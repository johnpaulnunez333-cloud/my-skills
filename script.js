const roles = ['Frontend Developer', 'UI/UX Designer', 'Web Developer', 'Creative Code'];
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

function handleSend(btn) {
    btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
    btn.style.background = '#1de9a0';
    setTimeout(() => { btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message'; btn.style.background = ''; }, 2500);
}