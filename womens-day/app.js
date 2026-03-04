const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const emojis = ["💖", "✨", "🌸", "👑", "🪩", "🎉", "💃", "🌈", "🔥", "💜"];

function spawnEmoji(x, y, count = 20) {
  const layer = document.querySelector(".emoji-rain");
  if (!layer) return;

  for (let i = 0; i < count; i += 1) {
    const node = document.createElement("span");
    node.className = "emoji-drop";
    node.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    node.style.left = `${x + (Math.random() * 160 - 80)}px`;
    node.style.animationDuration = `${2 + Math.random() * 2.8}s`;
    node.style.fontSize = `${1 + Math.random() * 1.2}rem`;
    layer.appendChild(node);
    window.setTimeout(() => node.remove(), 5200);
  }
}

function ambientRain() {
  if (reduceMotion) return;
  const layer = document.querySelector(".emoji-rain");
  if (!layer) return;

  const drop = () => {
    const node = document.createElement("span");
    node.className = "emoji-drop";
    node.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    node.style.left = `${Math.random() * window.innerWidth}px`;
    node.style.animationDuration = `${3 + Math.random() * 3}s`;
    node.style.opacity = "0.75";
    layer.appendChild(node);
    window.setTimeout(() => node.remove(), 6500);
    window.setTimeout(drop, 300 + Math.random() * 500);
  };

  drop();
}

function bindBurstButtons() {
  document.querySelectorAll("[data-burst]").forEach((button) => {
    button.addEventListener("click", () => {
      spawnEmoji(window.innerWidth / 2, window.innerHeight / 3, 42);
    });
  });

  document.querySelectorAll("[data-rain]").forEach((button) => {
    button.addEventListener("click", () => {
      for (let i = 0; i < 5; i += 1) {
        window.setTimeout(() => {
          spawnEmoji(Math.random() * window.innerWidth, 30, 18);
        }, i * 160);
      }
    });
  });
}

function bindThemeButtons() {
  document.querySelectorAll("[data-theme]").forEach((button) => {
    button.addEventListener("click", () => {
      const theme = button.getAttribute("data-theme");
      document.body.classList.remove("theme-sunset", "theme-cotton", "theme-neon");
      document.body.classList.add(`theme-${theme}`);
    });
  });
}

function bindDiscoToggle() {
  document.querySelectorAll("[data-disco]").forEach((button) => {
    button.addEventListener("click", () => {
      document.body.classList.toggle("disco");
      const isOn = document.body.classList.contains("disco");
      button.textContent = isOn ? "Stop Disco ✋" : "Start Disco Mode 🪩";
    });
  });
}

function bindTiltCards() {
  if (reduceMotion) return;
  document.querySelectorAll(".tilt").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const px = (event.clientX - bounds.left) / bounds.width;
      const py = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (px - 0.5) * 12;
      const rotateX = (0.5 - py) * 10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

function initTyping() {
  document.querySelectorAll("[data-typing]").forEach((el) => {
    const text = el.getAttribute("data-typing") || "";
    if (!text) return;
    el.textContent = "";

    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i);
      i += 1;
      if (i <= text.length) {
        window.setTimeout(tick, 34);
      }
    };

    tick();
  });
}

function initWall() {
  const saveButton = document.querySelector("[data-save-note]");
  const clearButton = document.querySelector("[data-clear-notes]");
  const noteInput = document.getElementById("noteInput");
  const grid = document.querySelector("[data-notes-grid]");
  if (!saveButton || !clearButton || !noteInput || !grid) return;

  const key = "womensDay.notes.v1";

  const readNotes = () => {
    try {
      return JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      return [];
    }
  };

  const writeNotes = (notes) => {
    localStorage.setItem(key, JSON.stringify(notes));
  };

  const render = () => {
    const notes = readNotes();
    grid.innerHTML = "";
    notes.forEach((text) => {
      const item = document.createElement("article");
      item.className = "note";
      item.textContent = text;
      grid.appendChild(item);
    });
  };

  saveButton.addEventListener("click", () => {
    const value = noteInput.value.trim();
    if (!value) return;
    const notes = readNotes();
    notes.unshift(value);
    writeNotes(notes.slice(0, 18));
    noteInput.value = "";
    render();
    spawnEmoji(window.innerWidth / 2, 100, 24);
  });

  clearButton.addEventListener("click", () => {
    localStorage.removeItem(key);
    render();
  });

  render();
}

function initPageEnter() {
  document.body.animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: reduceMotion ? 0 : 420, easing: "ease-out" }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  initPageEnter();
  ambientRain();
  bindBurstButtons();
  bindThemeButtons();
  bindDiscoToggle();
  bindTiltCards();
  initTyping();
  initWall();

  window.addEventListener("pointerdown", (event) => {
    if (reduceMotion) return;
    spawnEmoji(event.clientX, event.clientY, 10);
  }, { passive: true });
});
