const canvas = document.getElementById('portfolioGame') || document.getElementById('arcadeGame');
const ctx = canvas ? canvas.getContext('2d') : null;

const keys = {
    left: false,
    right: false
};

const groundHeight = 24;
const obstacles = [];

let frames = 0;
let score = 0;
let isGameOver = false;
let gameStarted = false;
let animationFrameId = null;

const player = {
    x: 60,
    y: 120,
    width: 24,
    height: 24,
    color: '#33FF66',
    velocityY: 0,
    gravity: 1.15,
    jumpPower: -13.4,
    groundSpeed: 3.1,
    airSpeed: 2.05,
    isOnGround: false
};

function groundY() {
    return canvas.height - groundHeight;
}

function resetPlayer() {
    player.x = 60;
    player.y = groundY() - player.height;
    player.velocityY = 0;
    player.isOnGround = true;
}

function resetGame() {
    frames = 0;
    score = 0;
    isGameOver = false;
    obstacles.length = 0;
    resetPlayer();
}

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
    ctx.fillRect(0, groundY(), canvas.width, groundHeight);

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, groundY(), canvas.width, 2);
}

function drawPlayer() {
    const { x, y, width, height } = player;

    ctx.fillStyle = '#33FF88';
    ctx.fillRect(x, y + 4, width, height - 4);

    ctx.fillStyle = '#00D4FF';
    ctx.fillRect(x + 4, y + 10, width - 8, height - 14);

    ctx.fillStyle = '#FFCC00';
    ctx.fillRect(x + 2, y, width - 4, 8);

    ctx.fillStyle = '#101820';
    ctx.fillRect(x + 14, y + 3, 4, 4);
    ctx.fillRect(x + 6, y + 12, 4, 4);
    ctx.fillRect(x + 14, y + 12, 4, 4);
}

function drawScore() {
    ctx.save();
    ctx.font = '14px "Press Start 2P"';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const scoreText = `SCORE ${Math.floor(score)}`;
    ctx.strokeText(scoreText, canvas.width - 12, 12);
    ctx.fillText(scoreText, canvas.width - 12, 12);
    ctx.restore();
}

function drawCenteredText(text, y, size, color = '#ffffff') {
    ctx.save();
    ctx.font = `${size}px "Press Start 2P"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = color;
    ctx.shadowColor = '#000000';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.strokeText(text, canvas.width / 2, y);
    ctx.fillText(text, canvas.width / 2, y);
    ctx.restore();
}

function difficultyLevel() {
    return Math.min(score / 900, 6);
}

function spawnInterval() {
    return Math.max(48, Math.floor(98 - difficultyLevel() * 8));
}

function obstacleSpeed() {
    return 4.2 + difficultyLevel() * 0.6;
}

function spawnObstacle() {
    const height = Math.random() > 0.78 ? 34 : 24;

    obstacles.push({
        x: canvas.width,
        y: groundY() - height,
        width: Math.random() > 0.72 ? 28 : 20,
        height,
        speed: obstacleSpeed(),
        color: '#FF3366'
    });
}

function updatePlayer() {
    const horizontalInput = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    const moveSpeed = player.isOnGround ? player.groundSpeed : player.airSpeed;

    player.x += horizontalInput * moveSpeed;
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

    if (player.y + player.height >= groundY()) {
        player.y = groundY() - player.height;
        player.velocityY = 0;
        player.isOnGround = true;
    } else {
        player.isOnGround = false;
    }
}

function jump() {
    if (!player.isOnGround) {
        return;
    }

    player.velocityY = player.jumpPower;
    player.isOnGround = false;
}

function isColliding(rectA, rectB) {
    return (
        rectA.x < rectB.x + rectB.width &&
        rectA.x + rectA.width > rectB.x &&
        rectA.y < rectB.y + rectB.height &&
        rectA.y + rectA.height > rectB.y
    );
}

function updateObstacles() {
    if (frames === 0 || frames % spawnInterval() === 0) {
        spawnObstacle();
    }

    for (let index = obstacles.length - 1; index >= 0; index -= 1) {
        const obstacle = obstacles[index];
        obstacle.x -= obstacle.speed;

        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        ctx.fillStyle = '#000000';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, 3);

        if (isColliding(player, obstacle)) {
            isGameOver = true;
        }

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
        }
    }
}

function renderScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawGround();
}

function gameLoop() {
    renderScene();

    if (!gameStarted) {
        drawPlayer();
        drawScore();
        drawCenteredText('PRESS SPACE', canvas.height / 2 - 10, 12);
        return;
    }

    if (isGameOver) {
        drawPlayer();
        drawScore();
        drawCenteredText('GAME OVER', canvas.height / 2 - 18, 18, '#FF3366');
        drawCenteredText('SPACE TO RESTART', canvas.height / 2 + 20, 11);
        animationFrameId = null;
        return;
    }

    updatePlayer();
    updateObstacles();
    drawPlayer();
    drawScore();

    score += 1;
    frames += 1;
    animationFrameId = requestAnimationFrame(gameLoop);
}

function startLoop() {
    if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
    }

    animationFrameId = requestAnimationFrame(gameLoop);
}

function handleJumpAction() {
    if (!gameStarted) {
        gameStarted = true;
        startLoop();
        return;
    }

    if (isGameOver) {
        resetGame();
        gameStarted = true;
        startLoop();
        return;
    }

    jump();
}

function bindGameControls() {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            keys.left = true;
        }

        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            keys.right = true;
        }

        if (event.code === 'Space') {
            event.preventDefault();
            handleJumpAction();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') {
            keys.left = false;
        }

        if (event.code === 'ArrowRight' || event.code === 'KeyD') {
            keys.right = false;
        }
    });
}

function bindPortfolioUi() {
    const mainMenuStartBtn = document.getElementById('mainMenuStart');
    const titleScreen = document.getElementById('titleScreen');
    const portfolioScreen = document.getElementById('portfolioScreen');
    const gameContainerDiv = document.querySelector('.game-container');
    const questCards = document.querySelectorAll('.quest-card');
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (mainMenuStartBtn && titleScreen && portfolioScreen) {
        mainMenuStartBtn.addEventListener('click', () => {
            titleScreen.classList.add('hidden');
            portfolioScreen.classList.remove('hidden');

            if (gameContainerDiv) {
                gameContainerDiv.style.display = 'block';
            }

            gameStarted = true;
            startLoop();
        });
    }

    questCards.forEach((card) => {
        card.addEventListener('click', () => {
            card.classList.toggle('is-flipped');
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                card.classList.toggle('is-flipped');
            }
        });
    });

    if (!contactForm || !formStatus) {
        return;
    }

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const action = contactForm.getAttribute('action') || '';

        if (action.includes('your-form-id')) {
            formStatus.textContent = 'Replace the Formspree endpoint with your own ID to activate the form.';
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'SENDING...';

        try {
            const response = await fetch(action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to send');
            }

            contactForm.reset();
            formStatus.textContent = 'Message sent! I will reply soon.';
        } catch (error) {
            formStatus.textContent = 'The message could not be sent. Please email me directly.';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'SEND';
        }
    });
}

bindPortfolioUi();

if (canvas && ctx) {
    resetGame();
    bindGameControls();
    gameLoop();
}
