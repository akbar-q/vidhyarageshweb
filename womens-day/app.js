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

function initWomenGallery() {
  const feed = document.querySelector("[data-wd-gallery]");
  if (!feed) return;

  function prettifyTitle(input) {
    if (!input) return "Women’s Day Memory";
    let s = String(input);
    s = s.replace(/\.[^./\\]+$/g, "");
    s = s.replace(/[_-]+/g, " ");
    s = s.replace(/([a-z])([A-Z])/g, "$1 $2");
    return s.replace(/\s+/g, " ").trim();
  }

  function photoUrl(fileName) {
    return `./photos/${encodeURIComponent(fileName)}`;
  }

  function makeCard(item) {
    const title = prettifyTitle(item.title || item.file);
    const src = photoUrl(item.file);

    const card = document.createElement("article");
    card.className = "wd-ig-card tilt";

    const media = document.createElement("div");
    media.className = "wd-ig-media";

    const img = document.createElement("img");
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = title;
    img.src = src;
    media.appendChild(img);

    const caption = document.createElement("div");
    caption.className = "wd-ig-caption";
    caption.textContent = title;

    card.appendChild(media);
    card.appendChild(caption);
    return card;
  }

  async function loadManifest() {
    const res = await fetch(`./photos/photos.json?v=${Date.now()}`);
    if (!res.ok) throw new Error("manifest fetch failed");
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((x) => x && typeof x.file === "string" && x.file.trim())
      .map((x) => ({ file: x.file.trim(), title: typeof x.title === "string" ? x.title : "" }));
  }

  (async () => {
    try {
      const items = await loadManifest();
      feed.innerHTML = "";

      if (!items.length) {
        const empty = document.createElement("article");
        empty.className = "wd-ig-card wd-missing";
        const txt = document.createElement("div");
        txt.className = "wd-ig-caption";
        txt.textContent = "No photos yet — add files to womens-day/photos and update photos.json.";
        empty.appendChild(txt);
        feed.appendChild(empty);
        return;
      }

      items.forEach((item) => feed.appendChild(makeCard(item)));
    } catch {
      feed.innerHTML = "";
      const fail = document.createElement("article");
      fail.className = "wd-ig-card wd-missing";
      const txt = document.createElement("div");
      txt.className = "wd-ig-caption";
      txt.textContent = "Couldn’t load womens-day/photos/photos.json yet.";
      fail.appendChild(txt);
      feed.appendChild(fail);
    }
  })();
}

function initClickGuide() {
  const nav = document.querySelector(".topbar nav");
  const wrap = document.querySelector(".wrap");
  if (!nav || !wrap) return;

  const currentPath = (window.location.pathname || "").replace(/\/+$/, "");
  const links = Array.from(nav.querySelectorAll("a[href]"))
    .map((a) => ({
      href: a.getAttribute("href") || "",
      label: (a.textContent || "").trim(),
      abs: a.href,
    }))
    .filter((x) => x.href && !x.href.startsWith("#"))
    .filter((x) => {
      try {
        const u = new URL(x.abs, window.location.href);
        return u.pathname.replace(/\/+$/, "") !== currentPath;
      } catch {
        return false;
      }
    });

  if (!links.length) return;

  const prompt = document.createElement("div");
  prompt.className = "wd-click-prompt";
  prompt.innerHTML = '<span class="wd-click-finger">👉</span><span data-wd-text></span><a class="btn alt" data-wd-link href="#">Click here</a>';
  wrap.insertBefore(prompt, wrap.querySelector("main"));

  const text = prompt.querySelector("[data-wd-text]");
  const link = prompt.querySelector("[data-wd-link]");

  const fab = document.createElement("a");
  fab.className = "wd-fab";
  fab.textContent = "☝️";
  fab.setAttribute("aria-label", "Open suggested page");
  document.body.appendChild(fab);

  let idx = Math.floor(Math.random() * links.length);

  const update = () => {
    const target = links[idx];
    if (!target) return;
    text.textContent = `Next stop: ${target.label}`;
    link.href = target.href;
    fab.href = target.href;
    fab.title = `Open ${target.label}`;
    idx = (idx + 1) % links.length;
  };

  update();
  if (!reduceMotion && links.length > 1) {
    window.setInterval(update, 4200);
  }
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
  initWomenGallery();
  initClickGuide();

  window.addEventListener("pointerdown", (event) => {
    if (reduceMotion) return;
    spawnEmoji(event.clientX, event.clientY, 10);
  }, { passive: true });
});
