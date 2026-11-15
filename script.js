const API_URL = ['localhost', '127.0.0.1', ''].includes(location.hostname)
  ? 'http://localhost:5000'
  : 'https://my-skills-t88y.onrender.com/';

const roles = ['Frontend Developer', 'UI/UX Designer', 'Web Developer', 'Creative Coder'];
let roleIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typed-role');
const cursor = document.getElementById('cursor');

function typeloop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) { deleting = true; setTimeout(typeloop, 1800); return; }
  } else {
    typedEl.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeloop, deleting ? 60 : 100);
}
setInterval(() => { cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0'; }, 500);
typeloop();

const skillBars = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.style.width = e.target.dataset.pct + '%'; barObs.unobserve(e.target); }
  });
}, { threshold: 0.3 });
skillBars.forEach(b => barObs.observe(b));

const scrollBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollBtn.classList.toggle('show', window.scrollY > 400);
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) {
      links.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
});

document.getElementById('nav-toggle').addEventListener('click', () => {
  document.getElementById('mobile-nav').classList.toggle('open');
});
document.querySelectorAll('#mobile-nav a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('mobile-nav').classList.remove('open'));
});

document.querySelectorAll('.stat-card, .skill-card, .project-card, .about-text, .contact-info, .contact-form')
  .forEach(el => el.classList.add('reveal'));
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

const SEND_LABEL = '<i class="fas fa-paper-plane"></i> Send Message';
let statusEl = null;

function setStatus(btn, msg, type) {
  if (!statusEl) {
    statusEl = document.createElement('p');
    statusEl.className = 'form-status';
    statusEl.setAttribute('role', 'status');
    btn.insertAdjacentElement('afterend', statusEl);
  }
  statusEl.textContent = msg;
  statusEl.className = 'form-status' + (type ? ' ' + type : '');
}

async function handleSend(btn) {
  const nameEl = document.getElementById('contact-name');
  const emailEl = document.getElementById('contact-email');
  const msgEl = document.getElementById('contact-message');
  const honeypot = document.getElementById('contact-website').value;

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const message = msgEl.value.trim();

  if (!name || !email || !message) return setStatus(btn, 'Paki-fill out lahat ng fields.', 'err');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setStatus(btn, 'Invalid ang email address.', 'err');

  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  setStatus(btn, 'Sending... (maaaring tumagal ng ilang segundo kung natutulog ang server)', '');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message, website: honeypot }),
      signal: controller.signal,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'May error sa server.');

    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = '#1de9a0';
    setStatus(btn, 'Salamat! Natanggap ko na ang message mo.', 'ok');
    nameEl.value = emailEl.value = msgEl.value = '';
  } catch (err) {
    btn.innerHTML = '<i class="fas fa-triangle-exclamation"></i> Failed';
    setStatus(btn, err.name === 'AbortError' ? 'Natagalan ang server. Subukan ulit.' : err.message, 'err');
  } finally {
    clearTimeout(timeout);
    setTimeout(() => { btn.innerHTML = SEND_LABEL; btn.style.background = ''; btn.disabled = false; }, 2500);
  }
}
