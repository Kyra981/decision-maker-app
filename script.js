let angolo = 0;

function aggiungiScelta() {
  const container = document.getElementById("inputs");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Scelta";

  container.appendChild(input);
}

function getScelte() {
  const inputs = document.querySelectorAll("#inputs input");
  let scelte = [];

  inputs.forEach(i => {
    if (i.value.trim() !== "") scelte.push(i.value);
  });

  return scelte;
}

function decidi() {
  const modalita = document.getElementById("modalita").value;
  const scelte = getScelte();
  const risultato = document.getElementById("risultato");
  const wheelBox = document.getElementById("wheelBox");

  if (scelte.length < 2) {
    risultato.textContent = "Inserisci almeno 2 scelte!";
    return;
  }

  // 🎲 RANDOM
  if (modalita === "random") {
    wheelBox.style.display = "none";

    const scelta = scelte[Math.floor(Math.random() * scelte.length)];
    risultato.textContent = "🎲 " + scelta;
    return;
  }

  // 🎡 RUOTA
  if (modalita === "ruota") {
    wheelBox.style.display = "block";
    spinRuota(scelte);
  }
}

function drawWheel(scelte, angolo) {
  const canvas = document.getElementById("ruota");
  const ctx = canvas.getContext("2d");

  const r = canvas.width / 2;
  const step = (2 * Math.PI) / scelte.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const colors = ["#ff4d4d", "#ffcc00", "#4dff88", "#4da6ff", "#b84dff"];

  scelte.forEach((s, i) => {
    const start = angolo + i * step;

    ctx.beginPath();
    ctx.moveTo(r, r);
    ctx.arc(r, r, r, start, start + step);
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(r, r);
    ctx.rotate(start + step / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.fillText(s, r - 10, 5);
    ctx.restore();
  });
}

function spinRuota(scelte) {
  const risultato = document.getElementById("risultato");

  let speed = 0.3;
  let decelerazione = 0.995;

  const interval = setInterval(() => {
    angolo += speed;
    speed *= decelerazione;

    drawWheel(scelte, angolo);

    if (speed < 0.002) {
      clearInterval(interval);

      const normalized = angolo % (2 * Math.PI);

    // ☚ PERFETTO PER FRECCIA A DESTRA
      const step = (2 * Math.PI) / scelte.length;

// aggiungiamo mezzo spicchio per centrare la selezione
const adjusted = (normalized + step / 2) % (2 * Math.PI);

const index = Math.floor(
  (adjusted / (2 * Math.PI)) * scelte.length
);

      risultato.textContent = "🎯 " + scelte[index];
    }
  }, 16);
}

// iniziale
drawWheel(["Aggiungi scelte"], 0);