const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Adjust canvas size for mobile
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Load Fronk logo
const fronkImg = new Image();
fronkImg.src = "https://raw.githubusercontent.com/thefronky/pfp/refs/heads/main/Fronk%20Logo%20new.png";

let player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 100,
    width: 80,
    height: 80,
    speed: 10,
    bullets: []
};

let enemies = [];
let colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"];
let trippyBackground = 0;

function createEnemies() {
    for (let i = 0; i < 10; i++) {
        enemies.push({
            x: i * (canvas.width / 10),
            y: 50,
            width: 50,
            height: 50,
            speedX: Math.random() * 4 - 2,
            speedY: Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
    }
}

createEnemies();

function drawPlayer() {
    ctx.drawImage(fronkImg, player.x, player.y, player.width, player.height);
}

function drawBullets() {
    player.bullets.forEach((bullet, index) => {
        ctx.drawImage(fronkImg, bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.drawImage(fronkImg, enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.x += enemy.speedX;
        enemy.y += enemy.speedY;

        if (enemy.x <= 0 || enemy.x >= canvas.width - enemy.width) {
            enemy.speedX *= -1;
        }
        if (enemy.y > canvas.height) enemies.splice(index, 1);
    });
}

function checkCollisions() {
    player.bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                player.bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
            }
        });
    });
}

function drawTrippyBackground() {
    trippyBackground += 0.05;
    let r = Math.floor(128 + 128 * Math.sin(trippyBackground));
    let g = Math.floor(128 + 128 * Math.sin(trippyBackground + 2));
    let b = Math.floor(128 + 128 * Math.sin(trippyBackground + 4));
    canvas.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrippyBackground();
    drawPlayer();
    drawBullets();
    drawEnemies();
    checkCollisions();
    requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    } else if (event.key === "ArrowRight" && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (event.key === " ") {
        player.bullets.push({ x: player.x + 30, y: player.y, width: 20, height: 20, speed: 10 });
    }
});

// Mobile Controls
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireBtn = document.getElementById("fireBtn");

leftBtn.addEventListener("touchstart", () => (player.x -= player.speed));
rightBtn.addEventListener("touchstart", () => (player.x += player.speed));
fireBtn.addEventListener("touchstart", () => {
    player.bullets.push({ x: player.x + 30, y: player.y, width: 20, height: 20, speed: 10 });
});

gameLoop();
