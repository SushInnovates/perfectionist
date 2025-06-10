
document.addEventListener("DOMContentLoaded", () => {
  const targetTime = new Date("2025-06-11T00:00:00");

  function createTimerElement() {
    const timer = document.createElement("div");
    timer.id = "midnight-timer";
    timer.style.position = "fixed";
    timer.style.bottom = "20px";
    timer.style.right = "20px";
    timer.style.padding = "10px 20px";
    timer.style.background = "rgba(0,0,0,0.6)";
    timer.style.color = "#fff";
    timer.style.fontSize = "1.5rem";
    timer.style.borderRadius = "12px";
    timer.style.zIndex = "9998";
    timer.style.fontFamily = "monospace";
    document.body.appendChild(timer);
    return timer;
  }

  function updateTimer(timerEl) {
    const now = new Date();
    const remaining = targetTime - now;

    if (remaining <= 0) {
      timerEl.remove();
      launchFireworks();
      return;
    }

    const hours = String(Math.floor(remaining / 3600000)).padStart(2, "0");
    const minutes = String(Math.floor((remaining % 3600000) / 60000)).padStart(2, "0");
    const seconds = String(Math.floor((remaining % 60000) / 1000)).padStart(2, "0");

    timerEl.textContent = `${hours}:${minutes}:${seconds}`;
    requestAnimationFrame(() => updateTimer(timerEl));
  }

  function launchFireworks() {
    const canvas = document.createElement("canvas");
    canvas.id = "fireworks-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "9999";
    canvas.style.pointerEvents = "none";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    let particles = [];
    const colors = ["#ff4b5c", "#fffc00", "#17e9e0", "#f72585", "#ffd6e0"];

    function createParticle(x, y) {
      const angle = Math.random() * 2 * Math.PI;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.alpha -= 0.01;
        ctx.beginPath();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        if (p.alpha <= 0) particles.splice(i, 1);
      });

      ctx.globalAlpha = 1;
      if (particles.length < 100) {
        for (let i = 0; i < 5; i++) {
          createParticle(Math.random() * canvas.width, Math.random() * canvas.height / 2);
        }
      }
      requestAnimationFrame(draw);
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw();

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // Start timer only if before midnight
  const now = new Date();
  if (now < targetTime) {
    const timerEl = createTimerElement();
    updateTimer(timerEl);
  } else {
    launchFireworks(); // Just in case page is opened after midnight
  }
});

