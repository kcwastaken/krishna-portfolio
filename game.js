const canvas = document.getElementById('portfolioGame');
const ctx = canvas.getContext('2d');

let frames = 0;
let score = 0;
let isGameOver = false;
let gameStarted = false;

const player = {
    x: 60,
    y: 120,
    width: 24,
    height: 24,
    color: '#33FF66',
    velocityY: 0,
    gravity: 0.8,
    jumpPower: -10,
    isJumping: false,

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },

    update() {
        this.velocityY += this.gravity;
        this.y += this.velocityY;

        if (this.y + this.height >= canvas.height - 20) {
            this.y = canvas.height - this.height - 20;
            this.velocityY = 0;
            this.isJumping = false;
        }
    },

    jump() {
        if (!this.isJumping) {
            this.velocityY = this.jumpPower;
            this.isJumping = true;
        }
    }
};

const obstacles = [];

function drawBackground() {
    ctx.fillStyle = '#5C94FC';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(40, 40, 60, 18);
    ctx.fillRect(50, 28, 30, 12);
    ctx.fillRect(250, 20, 70, 22);
    ctx.fillRect(265, 10, 35, 12);
    ctx.fillRect(440, 42, 50, 16);
    ctx.fillRect(452, 32, 24, 10);
}

function drawGround() {
    ctx.fillStyle = '#C84C0C';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 2);
}

function drawScore() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Press Start 2P"';
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(`Score: ${score}`, 10, 24);
    ctx.shadowColor = 'transparent';
}

function handleObstacles() {
    if (frames % 120 === 0) {
        obstacles.push({
            x: canvas.width,
            y: canvas.height - 44,
            width: 20,
            height: 24,
            color: '#FF3366',
            speed: 3
        });
    }

    for (let i = 0; i < obstacles.length; i++) {
        const obstacle = obstacles[i];
        obstacle.x -= obstacle.speed;
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (
            player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y
        ) {
            isGameOver = true;
        }

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            score += 1;
            i -= 1;
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameStarted && !isGameOver) {
        drawBackground();
        drawGround();
        player.update();
        player.draw();
        handleObstacles();
        drawScore();
        frames += 1;
        requestAnimationFrame(gameLoop);
    } else if (isGameOver) {
        drawBackground();
        drawGround();
        ctx.fillStyle = '#FF3366';
        ctx.font = '20px "Press Start 2P"';
        ctx.shadowColor = '#000000';
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText('GAME OVER', canvas.width / 2 - 90, canvas.height / 2);

        ctx.fillStyle = '#ffffff';
        ctx.font = '12px "Press Start 2P"';
        ctx.fillText('Press SPACE to Restart', canvas.width / 2 - 125, canvas.height / 2 + 30);
        ctx.shadowColor = 'transparent';
    } else {
        drawBackground();
        drawGround();
        player.draw();
    }
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault();

        if (!gameStarted) {
            gameStarted = true;
            requestAnimationFrame(gameLoop);
        } else if (isGameOver) {
            isGameOver = false;
            score = 0;
            frames = 0;
            obstacles.length = 0;
            player.y = 120;
            player.velocityY = 0;
            player.isJumping = false;
            requestAnimationFrame(gameLoop);
        } else {
            player.jump();
        }
    }
});

const mainMenuStartBtn = document.getElementById('mainMenuStart');
const titleScreen = document.getElementById('titleScreen');
const portfolioScreen = document.getElementById('portfolioScreen');
const gameContainerDiv = document.querySelector('.game-container');

if (mainMenuStartBtn) {
    mainMenuStartBtn.addEventListener('click', () => {
        titleScreen.classList.add('hidden');
        portfolioScreen.classList.remove('hidden');
        gameContainerDiv.style.display = 'block';
        gameStarted = true;
        requestAnimationFrame(gameLoop);
    });
}

drawBackground();
drawGround();
player.draw();