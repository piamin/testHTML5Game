const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size based on window size
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Load images
const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeNorth = new Image();
const pipeSouth = new Image();

bird.src = 'bird.png';
bg.src = 'bg.png';
fg.src = 'fg.png';
pipeNorth.src = 'pipeNorth.png';
pipeSouth.src = 'pipeSouth.png';

// Variables
const gap = 0.15;  // Gap as a percentage of canvas height
let constant;
let bX, bY, gravity, birdSize, fgHeight, pipeWidth, pipeHeight;
let score = 0;
const pipeGapHeight = 2;  // Minimum size of pipes as a multiple of bird size
let lastPipeX = canvas.width;  // Tracks the last pipe position

// Audio files
const fly = new Audio();
const scor = new Audio();

fly.src = 'fly.mp3';
scor.src = 'score.mp3';

// Control
document.addEventListener('keydown', moveUp);

function moveUp() {
  bY -= canvas.height * 0.05;
  fly.play();
}

// Pipe array and initialize
const pipe = [];
pipe[0] = { x: canvas.width, y: 0 };

// Update sizes and positions based on canvas size
function updateSizes() {
  bX = canvas.width * 0.05;
  bY = canvas.height * 0.5;
  gravity = canvas.height * 0.002;
  birdSize = canvas.width * 0.1;
  fgHeight = canvas.height * 0.2;
  pipeWidth = canvas.width * 0.15;
  pipeHeight = canvas.height * 0.5;
  constant = pipeHeight + gap * canvas.height;
}

// Draw images and handle game logic
function draw() {
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  for (let i = 0; i < pipe.length; i++) {
    let pipeX = pipe[i].x;
    let pipeY = pipe[i].y;
    ctx.drawImage(pipeNorth, pipeX, pipeY, pipeWidth, pipeHeight);
    ctx.drawImage(pipeSouth, pipeX, pipeY + constant, pipeWidth, pipeHeight);

    pipe[i].x -= canvas.width * 0.005;

    if (pipe[i].x === Math.floor(canvas.width * 0.5)) {
      let newPipeY = Math.max(
        Math.floor(Math.random() * -pipeHeight), 
        -pipeHeight + birdSize * pipeGapHeight
      );

      if (pipe[i].x < lastPipeX - canvas.width * 0.3) {
        pipe.push({
          x: canvas.width,
          y: newPipeY
        });
        lastPipeX = canvas.width;
      }
    }

    // Collision detection
    if ((bX + birdSize >= pipeX && bX <= pipeX + pipeWidth &&
      (bY <= pipeY + pipeHeight || bY + birdSize >= pipeY + constant)) ||
      bY + birdSize >= canvas.height - fgHeight) {
      location.reload();
    }

    // Remove pipes that go out of view and update score
    if (pipe[i].x + pipeWidth < 0) {
      pipe.splice(i, 1);
      score++;
      scor.play();
    }
  }

  ctx.drawImage(fg, 0, canvas.height - fgHeight, canvas.width, fgHeight);
  ctx.drawImage(bird, bX, bY, birdSize, birdSize);

  bY += gravity;

  ctx.fillStyle = '#000';
  ctx.font = `${canvas.width * 0.05}px Verdana`;
  ctx.fillText('Score : ' + score, canvas.width * 0.05, canvas.height * 0.95);

  requestAnimationFrame(draw);
}

updateSizes();
draw();
