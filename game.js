const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 15;
const paddleHeight = 100;
const ballRadius = 10;

// Positions
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = canvas.height / 2 - paddleHeight / 2;

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Score
let playerScore = 0;
let aiScore = 0;

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;

  // Clamp paddle within canvas
  if (playerY < 0) playerY = 0;
  if (playerY > canvas.height - paddleHeight) playerY = canvas.height - paddleHeight;
});

// Draw everything
function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw middle line
  ctx.fillStyle = "#888";
  ctx.fillRect(canvas.width / 2 - 2, 0, 4, canvas.height);

  // Draw paddles
  ctx.fillStyle = "#fff";
  ctx.fillRect(10, playerY, paddleWidth, paddleHeight); // Player paddle (left)
  ctx.fillRect(canvas.width - paddleWidth - 10, aiY, paddleWidth, paddleHeight); // AI paddle (right)

  // Draw ball
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw scores
  ctx.font = "32px Arial";
  ctx.fillText(playerScore, canvas.width / 2 - 60, 40);
  ctx.fillText(aiScore, canvas.width / 2 + 30, 40);
}

// Ball movement and collision
function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top and bottom wall collision
  if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
    ballSpeedY *= -1;
  }

  // Left paddle collision
  if (
    ballX - ballRadius < 10 + paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX *= -1;
    ballX = 10 + paddleWidth + ballRadius; // Prevent sticking
    // Add effect based on where it hits the paddle
    let collidePoint = ballY - (playerY + paddleHeight / 2);
    ballSpeedY = collidePoint * 0.2;
  }

  // Right paddle collision
  if (
    ballX + ballRadius > canvas.width - paddleWidth - 10 &&
    ballY > aiY &&
    ballY < aiY + paddleHeight
  ) {
    ballSpeedX *= -1;
    ballX = canvas.width - paddleWidth - 10 - ballRadius; // Prevent sticking
    let collidePoint = ballY - (aiY + paddleHeight / 2);
    ballSpeedY = collidePoint * 0.2;
  }

  // Score
  if (ballX - ballRadius < 0) {
    aiScore++;
    resetBall();
  }
  if (ballX + ballRadius > canvas.width) {
    playerScore++;
    resetBall();
  }

  // AI paddle movement (basic)
  let aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY - 35) {
    aiY += 5;
  } else if (aiCenter > ballY + 35) {
    aiY -= 5;
  }
  // Clamp AI paddle
  if (aiY < 0) aiY = 0;
  if (aiY > canvas.height - paddleHeight) aiY = canvas.height - paddleHeight;
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 5;
  ballSpeedY = (Math.random() * 4 - 2);
}

// Main loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();