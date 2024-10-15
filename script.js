const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = 'bird.png';  // 새 이미지 경로
bg.src = 'bg.png';      // 배경 이미지 경로
fg.src = 'fg.png';      // 바닥 이미지 경로
pipeNorth.src = 'pipeNorth.png';  // 위쪽 파이프 이미지 경로
pipeSouth.src = 'pipeSouth.png';  // 아래쪽 파이프 이미지 경로

// Variables
const gap = 85;
let constant;
let bX = 10;
let bY = 150;
const gravity = 1.5;
let score = 0;

// Audio files
const fly = new Audio();
const scor = new Audio();

fly.src = 'fly.mp3';
scor.src = 'score.mp3';

// Key press event
document.addEventListener('keydown', moveUp);

function moveUp() {
  bY -= 25;
  fly.play();
}

// Pipe coordinates
const pipe = [];

pipe[0] = {
  x: canvas.width,
  y: 0
};

// Draw images
function draw() {
  ctx.drawImage(bg, 0, 0);

  for (let i = 0; i < pipe.length; i++) {
    constant = pipeNorth.height + gap;
    ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
    ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);

    pipe[i].x--;

    if (pipe[i].x == 125) {
      pipe.push({
        x: canvas.width,
        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
      });
    }

    // Detect collision
    if (
      (bX + bird.width >= pipe[i].x &&
        bX <= pipe[i].x + pipeNorth.width &&
        (bY <= pipe[i].y + pipeNorth.height ||
          bY + bird.height >= pipe[i].y + constant)) ||
      bY + bird.height >= canvas.height - fg.height
    ) {
      location.reload(); // Reload the page
    }

    if (pipe[i].x == 5) {
      score++;
      scor.play();
    }
  }

  ctx.drawImage(fg, 0, canvas.height - fg.height);

  ctx.drawImage(bird, bX, bY);

  bY += gravity;

  ctx.fillStyle = '#000';
  ctx.font = '20px Verdana';
  ctx.fillText('Score : ' + score, 10, canvas.height - 20);

  requestAnimationFrame(draw);
}

draw();
