// Premium Love Puzzle Game – 4 Levels with Trolls on Every Choice
// ---------------------------------------------------------------
// Dependencies: Lucide icons (already loaded), Web Audio API for sound effects
// ---------------------------------------------------------------

// Initialise Lucide icons
lucide.createIcons();

// ---------- Background floating hearts ----------
const heartsBg = document.getElementById('hearts-bg');
function spawnHeart() {
  const h = document.createElement('div');
  h.classList.add('floating-heart');
  const size = Math.random() * 24 + 12;
  h.style.width = h.style.height = size + 'px';
  h.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
  h.style.left = Math.random() * 100 + 'vw';
  h.style.animationDuration = Math.random() * 3 + 5 + 's';
  heartsBg.appendChild(h);
  setTimeout(() => h.remove(), 8000);
}
setInterval(spawnHeart, 700);

// ---------- Audio Setup ----------
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}
function playSound(type) {
  try {
    initAudio();
    const now = audioCtx.currentTime;
    const createOsc = (shape, freq, dur) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = shape;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.start(now);
      osc.stop(now + dur);
    };
    switch (type) {
      case "pop":
        createOsc("sine", 350, 0.08);
        break;
      case "boing":
        createOsc("triangle", 180, 0.18);
        break;
      case "wrong":
        createOsc("sawtooth", 130, 0.22);
        break;
      case "magic":
        const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99, 1046.5, 1318.51];
        notes.forEach((f, i) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(f, now + i * 0.06);
          gain.gain.setValueAtTime(0.08, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.4);
        });
        break;
    }
  } catch (e) {
    console.error("Audio error", e);
  }
}

// ---------- Confetti ----------
function createConfetti(x, y) {
  const colors = ["#ff6584", "#ff8fa3", "#ffb6c1", "#ffd1dc", "#fff"];
  for (let i = 0; i < 40; i++) {
    const p = document.createElement("div");
    p.classList.add("confetti");
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    const angle = Math.random() * Math.PI * 2;
    const vel = Math.random() * 140 + 50;
    p.style.setProperty("--x", `${Math.cos(angle) * vel}px`);
    p.style.setProperty("--y", `${Math.sin(angle) * vel}px`);
    p.style.setProperty("--r", `${Math.random() * 720 - 360}deg`);
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 2000);
  }
}

// ---------- State ----------
let currentLevel = 1;
let jaClicks = 0; // level‑1 confirmation clicks
let neinClicks = 0; // level‑1 "Nein" hover counter
let level2Trolls = 0; // counts wrong clicks / swaps
let sliderTrolled = false; // level‑3 first‑fail flag
let kissState = 0; // 0‑4 progression for "1 Kuss" button
let infiniteClicks = 0; // level‑4 verification clicks

// ---------- Helper: show/hide cards ----------
function hideAll() {
  document.querySelectorAll('.game-card').forEach(c => c.classList.remove('active'));
}
function goTo(level) {
  hideAll();
  const target = document.getElementById(`card-level-${level}`) || (level === 5 ? document.getElementById('card-final') : null);
  if (target) target.classList.add('active');
  currentLevel = level;
}

// ---------------------------------------------------------------
// LEVEL 1 – "Liebst du mich?" – Runaway "Nein" & Confirm "Ja"
// ---------------------------------------------------------------
const btnJa1 = document.getElementById('btn-ja-1');
const btnNein1 = document.getElementById('btn-nein-1');
const trollMsg1 = document.getElementById('troll-msg-1');
const neinTexts = [
  "Nein? 🥺",
  "Bist du dir ganz sicher? 💔",
  "Das war bestimmt ein Versehen! 👉👈",
  "Versuchs nochmal! 😂",
  "Ich glaub du hast dich verklickt! 😜",
  "Ausweichen aktiviert! 🚀",
  "Nein ist heute leider ausverkauft! 🤫",
  "Okay, jetzt reicht's, klick 'Ja'! 🦖",
  "Haha, kriegst mich nicht! 😝",
  "Keine Chance mehr! 💖"
];
function moveNein(e) {
  playSound('boing');
  if (neinClicks < neinTexts.length) {
    trollMsg1.innerText = neinTexts[neinClicks];
    neinClicks++;
  }
  // random position, keep inside viewport
  const rect = btnNein1.getBoundingClientRect();
  const margin = 30;
  const maxX = window.innerWidth - rect.width - margin;
  const maxY = window.innerHeight - rect.height - margin;
  let newX = Math.random() * maxX;
  let newY = Math.random() * maxY;
  const cx = e.clientX || (e.touches && e.touches[0].clientX);
  const cy = e.clientY || (e.touches && e.touches[0].clientY);
  if (cx && cy) {
    const d = Math.hypot(newX - cx, newY - cy);
    if (d < 180) {
      newX = (newX + 220) % maxX;
      newY = (newY + 220) % maxY;
    }
  }
  btnNein1.style.left = `${Math.max(margin, newX)}px`;
  btnNein1.style.top = `${Math.max(margin, newY)}px`;
  btnNein1.classList.add('runaway');

  // after 10 attempts transform into a fake "Ja"
  if (neinClicks >= 10) {
    btnNein1.innerText = "Ja! 😜";
    btnNein1.style.transform = "scale(0.7)";
    btnJa1.style.transform = "scale(1.6)";
    btnJa1.style.zIndex = "1000";
  }
}
btnNein1.addEventListener('mouseover', moveNein);
btnNein1.addEventListener('touchstart', e => { e.preventDefault(); moveNein(e); });

btnJa1.addEventListener('click', () => {
  jaClicks++;
  if (jaClicks < 3) {
    const hints = ["Ganz sicher? 🥺", "Wirklich? 👸", "Letzter Versuch…"];
    btnJa1.innerText = hints[jaClicks - 1];
    playSound('wrong');
  } else {
    playSound('magic');
    goTo(2);
  }
});
// If the transformed "Nein" (now Ja) is clicked after 10 hovers
btnNein1.addEventListener('click', () => {
  if (neinClicks >= 10) {
    playSound('magic');
    goTo(2);
  } else {
    playSound('wrong');
  }
});

// ---------------------------------------------------------------
// LEVEL 2 – "Wer ist der Süßere?" – Swap, Wrong, Secret Button
// ---------------------------------------------------------------
const btnIch = document.getElementById('btn-opt-sie-2');
const btnDu = document.getElementById('btn-opt-er-2');
const btnBoth = document.getElementById('btn-opt-both-2');
const feedback2 = document.getElementById('feedback-2');
let bothJumped = false;
function swap() {
  const container = document.getElementById('btn-group-2');
  container.style.flexDirection = container.style.flexDirection === 'column-reverse' ? 'column' : 'column-reverse';
  playSound('boing');
}
btnIch.addEventListener('mouseover', swap);

btnDu.addEventListener('click', () => {
  level2Trolls++;
  feedback2.innerText = "Falsch! Ich bin viel süßer! 😜";
  feedback2.classList.add('error');
  playSound('wrong');
  if (level2Trolls >= 2) {
    btnBoth.classList.remove('hidden');
    btnBoth.classList.add('fade-in');
  }
});

btnBoth.addEventListener('mouseover', () => {
  if (!bothJumped) {
    btnBoth.style.transform = 'translateX(30px)';
    playSound('boing');
    bothJumped = true;
    setTimeout(() => btnBoth.style.transform = '', 300);
  }
});
btnBoth.addEventListener('click', () => {
  if (bothJumped) {
    playSound('magic');
    goTo(3);
  } else {
    feedback2.innerText = 'Erst hoppeln, dann klicken! 🤭';
    playSound('pop');
  }
});

// ---------------------------------------------------------------
// LEVEL 3 – Heart Slider – First attempt jumps, second merges
// ---------------------------------------------------------------
const draggable = document.getElementById('draggable-heart');
const targetHeart = document.getElementById('target-heart');
const trollMsg3 = document.getElementById('troll-msg-3');
let isDragging = false;
let dragOffset = 0;
function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  const rect = draggable.getBoundingClientRect();
  const clientX = e.clientX || e.touches[0].clientX;
  dragOffset = clientX - rect.left;
  draggable.classList.add('dragging');
}
function onDrag(e) {
  if (!isDragging) return;
  const clientX = e.clientX || e.touches[0].clientX;
  const track = document.getElementById('slider-track').getBoundingClientRect();
  let newX = clientX - track.left - dragOffset;
  const maxX = track.width - draggable.offsetWidth;
  newX = Math.max(0, Math.min(maxX, newX));
  draggable.style.left = `${newX}px`;
}
function endDrag() {
  if (!isDragging) return;
  isDragging = false;
  draggable.classList.remove('dragging');
  const dRect = draggable.getBoundingClientRect();
  const tRect = targetHeart.getBoundingClientRect();
  const dist = Math.hypot(dRect.left - tRect.left, dRect.top - tRect.top);
  if (dist < 30) {
    if (!sliderTrolled) {
      sliderTrolled = true;
      trollMsg3.innerText = "Huch, nicht so schnell! 🫣";
      targetHeart.style.transform = 'translateX(50px)';
      playSound('wrong');
      setTimeout(() => targetHeart.style.transform = '', 400);
      draggable.style.left = '0px';
    } else {
      playSound('magic');
      createConfetti(dRect.left + dRect.width / 2, dRect.top + dRect.height / 2);
      goTo(4);
    }
  } else {
    draggable.style.left = '0px';
  }
}

draggable.addEventListener('mousedown', startDrag);
draggable.addEventListener('touchstart', startDrag);
window.addEventListener('mousemove', onDrag);
window.addEventListener('touchmove', onDrag);
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchend', endDrag);

// ---------------------------------------------------------------
// LEVEL 4 – Kiss Counter & "Unendlich" verification
// ---------------------------------------------------------------
const btnKiss = document.getElementById('btn-1-kuss');
const btnInfinite = document.getElementById('btn-unendlich');
const feedback4 = document.getElementById('feedback-4');
const kissTexts = ["1 Kuss 😗", "10 Küsse! 😤", "100 Küsse! 🦖", "1000 Küsse! 🚀", "Unendlich viele! 💖"];
function updateKiss() {
  btnKiss.innerText = kissTexts[kissState];
  const scale = 1 + kissState * 0.2;
  btnKiss.style.transform = `scale(${scale})`;
}
updateKiss();
btnKiss.addEventListener('click', () => {
  if (kissState < 4) {
    kissState++;
    updateKiss();
    playSound('pop');
  }
});
btnInfinite.addEventListener('click', () => {
  infiniteClicks++;
  if (infiniteClicks === 1) {
    btnInfinite.innerText = "Sicher? Das sind echt viele! 🤭";
    btnInfinite.style.transform = 'scale(0.9)';
    playSound('wrong');
  } else {
    playSound('magic');
    createConfetti(window.innerWidth / 2, window.innerHeight / 2);
    goTo(5); // final screen
  }
});

// ---------------------------------------------------------------
// REPLAY – reset everything
// ---------------------------------------------------------------
const btnReplay = document.getElementById('btn-replay');
btnReplay.addEventListener('click', () => {
  // reset level‑1
  jaClicks = 0;
  neinClicks = 0;
  btnJa1.innerText = "Ja! ❤️";
  btnJa1.style.transform = '';
  btnJa1.style.zIndex = '';
  btnNein1.innerText = "Nein";
  btnNein1.style.transform = '';
  btnNein1.classList.remove('runaway');
  btnNein1.style.left = '';
  btnNein1.style.top = '';
  trollMsg1.innerText = "Beantworte diese Frage ehrlich! 😉";

  // reset level‑2
  level2Trolls = 0;
  feedback2.innerText = '';
  feedback2.classList.remove('error');
  btnBoth.classList.add('hidden');
  btnBoth.classList.remove('fade-in');
  btnBoth.style.transform = '';
  bothJumped = false;
  // ensure original order
  const grp2 = document.getElementById('btn-group-2');
  grp2.style.flexDirection = 'column';

  // reset level‑3
  sliderTrolled = false;
  draggable.style.left = '0px';
  targetHeart.style.transform = '';
  trollMsg3.innerText = "Schiebe die Herzhälften zueinander...";

  // reset level‑4
  kissState = 0;
  updateKiss();
  btnInfinite.innerText = "Unendlich viele! 💖";
  btnInfinite.style.transform = '';
  infiniteClicks = 0;
  feedback4.innerText = '';

  // go back to first card
  goTo(1);
  playSound('pop');
});

// start on level 1 (HTML already marks it active)
goTo(1);
