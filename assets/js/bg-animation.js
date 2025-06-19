const canvas = document.getElementById('bg-animation');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Cloud properties
const CLOUD_COUNT = 6;
const clouds = [];
for (let i = 0; i < CLOUD_COUNT; i++) {
    clouds.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * (window.innerHeight * 0.4),
        r: 40 + Math.random() * 60,
        speed: 0.2 + Math.random() * 0.3,
        opacity: 0.5 + Math.random() * 0.3
    });
}

// Bird properties
const bird = {
    x: -60,
    y: window.innerHeight * 0.3,
    size: 32,
    speed: 2,
    wingAngle: 0,
    wingDirection: 1
};

function drawCloud(x, y, r, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r * 0.7, y + r * 0.2, r * 0.7, 0, Math.PI * 2);
    ctx.arc(x - r * 0.7, y + r * 0.2, r * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
}

function drawBird(x, y, size, wingAngle) {
    ctx.save();
    ctx.translate(x, y);

    // Body
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.8, size * 0.35, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#444";
    ctx.fill();

    // Head
    ctx.beginPath();
    ctx.arc(size * 0.7, -size * 0.1, size * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = "#444";
    ctx.fill();

    // Beak
    ctx.beginPath();
    ctx.moveTo(size * 0.92, -size * 0.1);
    ctx.lineTo(size * 1.15, -size * 0.05);
    ctx.lineTo(size * 0.92, size * 0.05);
    ctx.closePath();
    ctx.fillStyle = "#e2b007";
    ctx.fill();

    // Eye
    ctx.beginPath();
    ctx.arc(size * 0.8, -size * 0.13, size * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(size * 0.8, -size * 0.13, size * 0.025, 0, Math.PI * 2);
    ctx.fillStyle = "#222";
    ctx.fill();

    // Left wing
    ctx.save();
    ctx.rotate(-wingAngle);
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, 0);
    ctx.quadraticCurveTo(-size * 1.1, -size * 0.7, -size * 1.5, 0);
    ctx.quadraticCurveTo(-size * 1.1, size * 0.7, -size * 0.2, 0);
    ctx.closePath();
    ctx.fillStyle = "#666";
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Right wing
    ctx.save();
    ctx.rotate(wingAngle);
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, 0);
    ctx.quadraticCurveTo(-size * 1.1, -size * 0.7, -size * 1.5, 0);
    ctx.quadraticCurveTo(-size * 1.1, size * 0.7, -size * 0.2, 0);
    ctx.closePath();
    ctx.fillStyle = "#666";
    ctx.globalAlpha = 0.8;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();

    ctx.restore();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    for (let cloud of clouds) {
        drawCloud(cloud.x, cloud.y, cloud.r, cloud.opacity);
        cloud.x += cloud.speed;
        if (cloud.x - cloud.r > canvas.width) {
            cloud.x = -cloud.r;
            cloud.y = Math.random() * (canvas.height * 0.4);
        }
    }

    // Animate bird
    bird.x += bird.speed;
    bird.y += Math.sin(bird.x / 80) * 0.7; // gentle up/down
    bird.wingAngle += 0.08 * bird.wingDirection;
    if (bird.wingAngle > 0.7 || bird.wingAngle < -0.7) bird.wingDirection *= -1;

    drawBird(bird.x, bird.y, bird.size, bird.wingAngle);

    // Reset bird to left when off screen
    if (bird.x - bird.size * 2 > canvas.width) {
        bird.x = -bird.size * 2;
        bird.y = randomBetween(canvas.height * 0.2, canvas.height * 0.5);
    }

    requestAnimationFrame(animate);
}

function randomBetween(a, b) {
    return a + Math.random() * (b - a);
}

animate();