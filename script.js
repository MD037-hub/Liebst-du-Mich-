// Initialize Lucide icons
lucide.createIcons();

// Web Audio API for asset-free sound effects
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(type) {
    try {
        initAudio();
        if (!audioCtx) return;

        const now = audioCtx.currentTime;
        
        if (type === 'pop') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.08);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
        } 
        else if (type === 'boing') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(180, now);
            osc.frequency.exponentialRampToValueAtTime(90, now + 0.18);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.start(now);
            osc.stop(now + 0.18);
        } 
        else if (type === 'wrong') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(130, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.22);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        } 
        else if (type === 'success') {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.setValueAtTime(0.1, now + 0.3);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);
        } 
        else if (type === 'magic') {
            const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
            notes.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + index * 0.06);
                gain.gain.setValueAtTime(0.08, now + index * 0.06);
                gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.06 + 0.35);
                osc.start(now + index * 0.06);
                osc.stop(now + index * 0.06 + 0.4);
            });
        }
    } catch (e) {
        console.error('Audio synthesis failed:', e);
    }
}

// Background floating hearts
const heartsBg = document.getElementById('hearts-bg');
function spawnBackgroundHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    
    const size = Math.random() * 24 + 12;
    heart.style.width = size + 'px';
    heart.style.height = size + 'px';
    
    // SVG heart shape
    heart.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
    
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 5 + 's';
    
    heartsBg.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 8000);
}
setInterval(spawnBackgroundHeart, 700);

// Elements
const btnJa = document.getElementById('btn-ja');
const btnNein = document.getElementById('btn-nein');
const trollMsg = document.getElementById('troll-message');
const cardQuestion = document.getElementById('card-question');
const cardFinal = document.getElementById('card-final');
const btnReplay = document.getElementById('btn-replay');
const modalOverlay = document.getElementById('modal-overlay');
const modalOk = document.getElementById('modal-ok');

// State
let trollCount = 0;
const trollMessages = [
    "Nein? 🥺",
    "Bist du dir ganz sicher? 💔",
    "Das war bestimmt ein Versehen! 👉👈",
    "Drück lieber 'Ja'! 😂",
    "Ich glaub du hast dich verklickt! 😜",
    "Ausweichen aktiviert! 🚀",
    "Nein ist heute leider ausverkauft! 🤫",
    "Okay, jetzt reicht's, klick 'Ja'! 🦖",
    "Haha, kriegst mich nicht! 😝",
    "Keine Chance mehr! 💖"
];

function runawayButton(e) {
    initAudio();
    playSound('boing');
    
    // Increment troll count
    trollCount++;
    
    // Update troll message
    if (trollCount <= trollMessages.length) {
        trollMsg.innerText = trollMessages[trollCount - 1];
        trollMsg.classList.remove('msg-bounce');
        void trollMsg.offsetWidth; // Trigger reflow to restart animation
        trollMsg.classList.add('msg-bounce');
    }
    
    // Move the Nein button
    const btnRect = btnNein.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;
    
    const margin = 30;
    const maxX = window.innerWidth - btnWidth - margin;
    const maxY = window.innerHeight - btnHeight - margin;
    
    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;
    
    // Prevent button from flying directly under cursor
    const cursorX = e.clientX || (e.touches && e.touches[0].clientX);
    const cursorY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (cursorX && cursorY) {
        const dist = Math.hypot(newX - cursorX, newY - cursorY);
        if (dist < 180) {
            newX = (newX + 220) % maxX;
            newY = (newY + 220) % maxY;
        }
    }
    
    btnNein.classList.add('runaway');
    btnNein.style.left = `${Math.max(margin, newX)}px`;
    btnNein.style.top = `${Math.max(margin, newY)}px`;
    
    // Check if max troll count reached
    if (trollCount >= 10) {
        btnNein.innerText = "Ja! 😜";
        btnNein.style.transform = "scale(0.7)";
        btnJa.style.transform = "scale(1.6)";
        btnJa.style.zIndex = "1000";
    }
}

// Attach event listeners to Nein button for escaping
btnNein.addEventListener('mouseover', runawayButton);
btnNein.addEventListener('touchstart', (e) => {
    e.preventDefault();
    runawayButton(e);
});

// Click Ja! (or click the fake Nein button that changed to Ja)
btnJa.addEventListener('click', handleSuccess);
btnNein.addEventListener('click', (e) => {
    if (trollCount >= 10) {
        handleSuccess();
    } else {
        // Backup overlay for clicks (e.g. keyboard navigation)
        playSound('wrong');
        modalOverlay.classList.add('active');
    }
});

function handleSuccess() {
    playSound('magic');
    
    // Confetti explosion
    const rect = btnJa.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    createConfetti(x, y);
    createConfetti(window.innerWidth / 2, window.innerHeight / 2);
    
    // Transition to final card
    cardQuestion.classList.remove('active');
    cardFinal.classList.add('active');
}

// Modal OK
modalOk.addEventListener('click', () => {
    playSound('pop');
    modalOverlay.classList.remove('active');
});

// Confetti particle explosion
function createConfetti(x, y) {
    const colors = ['#ff6584', '#ff8fa3', '#ffb6c1', '#ffd1dc', '#fff'];
    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.classList.add('confetti');
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        
        // Random directions
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 140 + 50;
        const dx = Math.cos(angle) * velocity;
        const dy = Math.sin(angle) * velocity;
        
        particle.style.setProperty('--x', `${dx}px`);
        particle.style.setProperty('--y', `${dy}px`);
        particle.style.setProperty('--r', `${Math.random() * 720 - 360}deg`);
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
}

// Replay reset
btnReplay.addEventListener('click', () => {
    playSound('pop');
    
    // Reset state
    trollCount = 0;
    trollMsg.innerText = "Beantworte diese Frage ehrlich! 😉";
    trollMsg.classList.remove('msg-bounce');
    
    // Reset buttons
    btnNein.classList.remove('runaway');
    btnNein.style.left = '';
    btnNein.style.top = '';
    btnNein.style.transform = '';
    btnNein.innerText = "Nein";
    
    btnJa.style.transform = '';
    btnJa.style.zIndex = '';
    
    // Transition back
    cardFinal.classList.remove('active');
    cardQuestion.classList.add('active');
});
