import { useState, useEffect, useRef } from "react";

const roles = ["frontend Developer", "UI/UX Designer", " Web Developer", "Creative Coder"];

function useTypewriter() {
    const [text, setText] = useState("");
    const [roleIdx, setRoleIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);
    
    useEffect(() => {
        const current = roles[roleIdx];
        const delay = deleting ? 60 : charIdx === current.length ? 1800 : 100;
        const timer = setTimeout(() => {
            if (!deleting) {
                setText( current.slice(0, charIdx + 1));
                if (charIdx + 1 === current.length) setDeleting(true);
                else setCharIdx(c => c + 1);
            } else {
                setText(current.slice(0, charIdx - 1));
                if (charIdx - 1 === 0) {
                    setDeleting(false);
                    setRoleIdx(r => (r + 1) % roles.length);
                    setCharIdx(0);
                } else {
                    setCharIdx(c => c -1);
                }
            }
        }, delay);
        return () => clearTimeout(timer)
    }, [text, roleIdx, charIdx, deleting]);
    
    return text;
}

function useScrollSpy() {
    const [active, setActive] = useState("home");
    useEffect(() => {
        const handler = () => {
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(sec =  {
                if (window.scrollY >= sec.offsetTop - 120) setActive(sec.id);
            });
        };
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);
    return active;
}

function useSkillBars() {
    const ref = useRef(null);
    const[triggered, setTriggered] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTriggered(true); }, {threshold: 0.3 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return [ref, triggered];
}

function Navbar({ active, mobileOpen, setMobileOpen}) {
    const links = ["home", "about", " skills", "portfolio", " contact"];
    return(
        <>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>john<span style={{ color: "var(--cyan)" }}>.</span></div>
        <ul style={styles.navLinks}>
          {links.map(l => (
            <li key={l}>
              <a href={`#${l}`} style={{ ...styles.navLink, ...(active === l ? styles.navLinkActive : {}) }}>
                {l.charAt(0).toUpperCase() + l.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <button style={styles.navToggle} onClick={() => setMobileOpen(o => !o)}>
          <i className={`fas ${mobileOpen ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </nav>
      {mobileOpen && (
        <div style={styles.mobileNav}>
          {links.map(l => (
            <a key={l} href={`#${l}`} style={styles.mobileNavLink} onClick={() => setMobileOpen(false)}>
              {l.charAt(0).toUpperCase() + l.slice(1)}
            </a>
          ))}
        </div>
    );
}

function Hero({ typedText }) {
    const [ cursor, setCursor ] = useState(true);
    useEffect(() => {
        const t = setInterval(() => setCursor(c => !c), 500);
        return () => clearInterval(t);
    }, []);
    
    return (
        <section id="home" style={styles.home}>
      <div style={styles.heroText}>
        <p style={styles.heroEyebrow}>Hello, It's Me</p>
        <h1 style={styles.heroName}>John Paul<br />Orillo Nunez</h1>
        <p style={styles.heroRole}>
          And I'm a <span style={{ color: "var(--cyan)" }}>{typedText}</span>
          <span style={{ color: "var(--cyan)", opacity: cursor ? 1 : 0 }}>|</span>
        </p>
        <p style={styles.heroDesc}>
          Crafting clean, performant, and visually compelling digital experiences — from pixel-perfect interfaces to scalable web applications.
        </p>
        <div style={styles.socials}>
          {[["fab fa-facebook-f", "Facebook"], ["fab fa-twitter", "Twitter"], ["fab fa-instagram", "Instagram"], ["fab fa-linkedin-in", "LinkedIn"], ["fab fa-github", "GitHub"]].map(([icon, label]) => (
            <a key={label} href="#" aria-label={label} style={styles.socialLink}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "var(--muted)"; }}>
              <i className={icon}></i>
            </a>
          ))}
        </div>
        <a href="#" style={styles.btnPrimary}><i className="fas fa-download"></i> Download CV</a>
      </div>

      <div style={styles.heroImageWrap}>
        <div style={styles.hexContainer}>
          <div style={styles.hexGlow}></div>
          <div style={styles.hexBg}></div>
          <div style={styles.hexPhoto}>
            <div style={styles.hexPlaceholder}>
              <i className="fas fa-user-circle" style={{ fontSize: "3rem", color: "var(--cyan)" }}></i>
              <span style={{ fontSize: "0.8rem", color: "var(--muted)", textAlign: "center" }}>Replace with your photo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
}

function About() {
    return (
        <section id="about" style={{ ...styles.section, background: "var(--surface)" }}>
      <div style={styles.sectionLabel}>Get to Know Me</div>
      <div style={styles.divider}></div>
      <h2 style={styles.sectionTitle}>About Me</h2>
      <div style={styles.aboutGrid}>
        <div style={styles.aboutText}>
          <p style={styles.aboutP}>I'm <strong>John Paul Orillo Nunez</strong>, a passionate developer who loves building things that live on the internet. I care deeply about code quality, user experience, and shipping products that actually matter to people.</p>
          <p style={styles.aboutP}>When I'm not coding, I'm exploring new technologies, contributing to open-source, or thinking up the next project that keeps me up at night. I believe great software is built at the intersection of clear thinking and creative execution.</p>
          <a href="#contact" style={{ ...styles.btnPrimary, marginTop: "8px" }}>Let's Talk <i className="fas fa-arrow-right"></i></a>
        </div>
        <div style={styles.aboutStats}>
          {[["3+", "Years of Experience"], ["40+", "Projects Completed"], ["20+", "Happy Clients"], ["∞", "Lines of Code Written"]].map(([num, desc]) => (
            <div key={desc} style={styles.statCard}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}>
              <div style={styles.statNumber}>{num}</div>
              <div style={styles.statDesc}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
    );
}

function skills() {
    const [ref, triggered] = useSkillBars();
    const skills = [
    ["fab fa-html5", "HTML / CSS", 95],
    ["fab fa-js", "JavaScript", 88],
    ["fab fa-react", "React", 85],
    ["fab fa-node-js", "Node.js", 78],
    ["fas fa-database", "SQL / NoSQL", 75],
    ["fab fa-figma", "UI/UX Design", 80],
    ];
    return (
        <section id="skills" style={{ ...styles.section, background: "var(--bg)" }} ref={ref}>
      <div style={styles.sectionLabel}>What I Do</div>
      <div style={styles.divider}></div>
      <h2 style={styles.sectionTitle}>My Skills</h2>
      <div style={styles.skillsGrid}>
        {skills.map(([icon, name, pct]) => (
          <div key={name} style={styles.skillCard}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.3)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={styles.skillIcon}><i className={icon}></i></div>
            <div style={styles.skillName}>{name}</div>
            <div style={styles.skillBarBg}>
              <div style={{ ...styles.skillBarFill, width: triggered ? `${pct}%` : "0%" }}></div>
            </div>
            <div style={styles.skillPct}>{pct}%</div>
          </div>
        ))}
      </div>
    </section>
    );
}

function Portfolio() {
    const projects = [
        ["🛒", "E-commerce Platform", " A full-stack e-commerce solution with cart management, payment integration, and admin dashboard."],
        ["📊", "Dashboard", "Analytics Dashboard", "Real-time data visualization dashboard built with React and D3.js for business intelligence."],
        ["💬", "Mobile App", "Chat Application", "Real-time messaging app with WebSocket, end-to-end encryption, and cross-platform support."],
    ];
    return (
        <section id="portfolio" style={{ ...styles.section, background: "var(--surface)" }}>
      <div style={styles.sectionLabel}>My Work</div>
      <div style={styles.divider}></div>
      <h2 style={styles.sectionTitle}>Portfolio</h2>
      <div style={styles.portfolioGrid}>
        {projects.map(([emoji, tag, title, desc]) => (
          <div key={title} style={styles.projectCard}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(0,229,255,0.25)"; e.currentTarget.style.transform = "translateY(-6px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}>
            <div style={styles.projectThumb}>{emoji}</div>
            <div style={styles.projectInfo}>
              <div style={styles.projectTag}>{tag}</div>
              <div style={styles.projectTitle}>{title}</div>
              <p style={styles.projectDesc}>{desc}</p>
              <a href="#" style={styles.projectLink}>View Project <i className="fas fa-arrow-right"></i></a>
            </div>
          </div>
        ))}
      </div>
    </section>
    );
}

function Contact() {
    const [ sent, setSent ] = useState(false);
    function handleSend() {
        setSent(true);
        setTimeout(() => setSent(false), 2500), 
    }
    return (
        <section id="contact" style={{ ... styles.section, background: "var(--bg)" }}>
        <div style={styles.sectionLabel}>Get In Touch</div>
        <div style={styles.divider}></div>
        <h2 style={styles.sectionTitle}>Contact Me</h2>
        <div style={styles.contactGrid}>
          <div>
            <p style={{  fontSize: "0.95rem", lineHeight: 1.8, color: " var(--muted)", marginBottom: "36px" }}>
             Have a project in mind or just want to say hi? My inbox is always open. I'll get back to you as soon as possible.
          </p>
          {[["fas fa-envelope", "Email", " johnpaulorilloNunez@email.com"], ["fas Fa-phone", "Phone", "+63 900 000 000"], [" fas fa-map-market-alt", "Location", " Philippines"]].map(([icon, label, val]) => (
              <div key={label} styles={styles.contactItem}>
                <div style={styles.contactIcon}><i className={icon}></i></div>
                <div>
                  <strong style={{ display: "block", color: "var(--white)", fontSize: " 0.92rem", marginBottom: "2px" }}>label</strong>
                  <span style={{ fontSize: "0.88", color: "var(--muted)", }}>{val}</span>
                </div>
             </div>
            ))}
        </div>
        <div style={styles.contactForm}>
          {[["text", "Your Name", "John Doe"], ["email", "Email Address", "john@email.com"]].map(([type, label, ph]) => (
            <div key={label} style={styles.formGroup}>
              <label style={styles.formLabel}>{label}</label>
              <input type={type} placeholder={ph} style={styles.formInput} />
            </div>
          ))}
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Message</label>
            <textarea placeholder="Tell me about your project..." style={{ ...styles.formInput, minHeight: "130px", resize: "none" }}></textarea>
          </div>
          <button onClick={handleSend} style={{ ...styles.btnPrimary, alignSelf: "flex-start", background: sent ? "#1de9a0" : "var(--cyan)" }}>
            <i className={`fas ${sent ? "fa-check" : "fa-paper-plane"}`}></i> {sent ? "Sent!" : "Send Message"}
          </button>
        </div>
      </div>
    </section>
    );
}

export default function App() {
    const typedText = useTypewriter();
    const active = useScrollSpy();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [showTop, setShowTop] = useState(false);
    
    useEffect(() => {
        const handler = () => setShowTop(window.scrollY > 400);
        window.addEventListener("scroll", handler);
        return () => window.removeEventListener("scroll", handler);
    }, []);
    return (
          <>
      <style>{`
        :root { --bg: #0d0d0f; --surface: #131317; --card: #1a1a21; --cyan: #00e5ff; --cyan-dim: rgba(0,229,255,0.12); --cyan-glow: rgba(0,229,255,0.35); --white: #f0f0f4; --muted: #7a7a90; --nav-h: 72px; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Space Grotesk', sans-serif; background: var(--bg); color: var(--white); overflow-x: hidden; }
        body::before { content: ''; position: fixed; inset: 0; background: radial-gradient(ellipse 60% 40% at 80% 90%, rgba(0,229,255,0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 10% 20%, rgba(0,229,255,0.05) 0%, transparent 50%); pointer-events: none; z-index: 0; }
        @keyframes pulse-glow { 0%,100%{opacity:.2;transform:scale(1)} 50%{opacity:.4;transform:scale(1.04)} }
        a { text-decoration: none; }
      `}</style>

      <Navbar active={active} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Hero typedText={typedText} />
      <About />
      <Skills />
      <Portfolio />
      <Contact />

      <footer style={styles.footer}>
        <p>© 2026 <span style={{ color: "var(--cyan)" }}>John Paul Orillo Nunez</span>. All rights reserved. Built with passion.</p>
      </footer>

      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={styles.scrollTop}>
          <i className="fas fa-arrow-up"></i>
        </button>
      )}
    </>
  );
}

const styles = {
    nav: { position: "fixed", top: 0, left: 0, right: 0, height: "var(--nav-h)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 60px", background: "rgba(13,13,15,0.88)", backdropFilter: "blur(18px)", borderBottom: "1px solid rgba(255,255,255,0.05)", zIndex: 100 },
  navLogo: { fontFamily: "'Syne', sans-serif", fontSize: "1.3rem", fontWeight: 800, color: "var(--white)" },
  navLinks: { display: "flex", gap: "36px", listStyle: "none" },
  navLink: { fontSize: "0.875rem", fontWeight: 500, color: "var(--muted)", textDecoration: "none", letterSpacing: "0.04em", transition: "color 0.2s" },
  navLinkActive: { color: "var(--cyan)" },
  navToggle: { display: "none", background: "none", border: "none", cursor: "pointer", color: "var(--white)", fontSize: "1.3rem" },
  mobileNav: { position: "fixed", top: "var(--nav-h)", left: 0, right: 0, background: "rgba(13,13,15,0.97)", backdropFilter: "blur(20px)", padding: "24px 40px", display: "flex", flexDirection: "column", gap: "20px", zIndex: 99, borderBottom: "1px solid rgba(255,255,255,0.06)" },
  mobileNavLink: { color: "var(--muted)", fontSize: "1rem", fontWeight: 500 },
  home: { position: "relative", minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", alignItems: "center", padding: "calc(var(--nav-h) + 60px) 60px 80px", gap: "40px", zIndex: 1 },
  heroText: { maxWidth: "560px" },
  heroEyebrow: { fontSize: "1rem", color: "var(--muted)", marginBottom: "12px", letterSpacing: "0.06em" },
  heroName: { fontFamily: "'Syne', sans-serif", fontSize: "clamp(2.8rem, 5vw, 4.2rem)", fontWeight: 800, lineHeight: 1.0, letterSpacing: "-0.03em", marginBottom: "16px" },
  heroRole: { fontSize: "1.3rem", fontWeight: 500, marginBottom: "24px" },
  heroDesc: { fontSize: "0.95rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: "440px", marginBottom: "36px" },
  socials: { display: "flex", gap: "14px", marginBottom: "36px" },
  socialLink: { width: "42px", height: "42px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted)", fontSize: "0.9rem", transition: "all 0.25s" },
  btnPrimary: { display: "inline-flex", alignItems: "center", gap: "10px", padding: "14px 32px", background: "var(--cyan)", color: "#0d0d0f", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.04em", borderRadius: "50px", border: "none", cursor: "pointer", transition: "all 0.25s" },
  heroImageWrap: { display: "flex", justifyContent: "center", alignItems: "center" },
  hexContainer: { position: "relative", width: "340px", height: "390px" },
  hexBg: { position: "absolute", inset: 0, background: "linear-gradient(135deg, var(--cyan) 0%, rgba(0,229,255,0.4) 100%)", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" },
  hexGlow: { position: "absolute", inset: "-20px", background: "linear-gradient(135deg, var(--cyan) 0%, transparent 70%)", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", opacity: 0.25, filter: "blur(20px)", animation: "pulse-glow 3s ease-in-out infinite" },
  hexPhoto: { position: "absolute", inset: "4px", clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  hexPlaceholder: { display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", padding: "20px" },
  section: { position: "relative", zIndex: 1, padding: "100px 60px" },
  sectionLabel: { fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "12px" },
  sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: "56px" },
  divider: { width: "48px", height: "3px", background: "var(--cyan)", marginBottom: "16px", borderRadius: "2px" },
  aboutGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" },
  aboutText: {},
  aboutP: { fontSize: "0.95rem", lineHeight: 1.85, color: "var(--muted)", marginBottom: "20px" },
  aboutStats: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" },
  statCard: { background: "var(--card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "28px 24px", transition: "border-color 0.25s" },
  statNumber: { fontFamily: "'Syne', sans-serif", fontSize: "2.4rem", fontWeight: 800, color: "var(--cyan)", lineHeight: 1, marginBottom: "6px" },
  statDesc: { fontSize: "0.82rem", color: "var(--muted)" },
  skillsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" },
  skillCard: { background: "var(--card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "28px 24px", transition: "all 0.25s" },
  skillIcon: { width: "44px", height: "44px", background: "var(--cyan-dim)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cyan)", fontSize: "1.2rem", marginBottom: "16px" },
  skillName: { fontWeight: 600, fontSize: "0.95rem", marginBottom: "14px" },
  skillBarBg: { height: "5px", background: "rgba(255,255,255,0.07)", borderRadius: "3px", overflow: "hidden" },
  skillBarFill: { height: "100%", background: "linear-gradient(90deg, var(--cyan), rgba(0,229,255,0.5))", borderRadius: "3px", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" },
  skillPct: { fontSize: "0.75rem", color: "var(--muted)", marginTop: "8px" },
  portfolioGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" },
  projectCard: { background: "var(--card)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "20px", overflow: "hidden", transition: "all 0.3s" },
  projectThumb: { height: "200px", background: "linear-gradient(135deg, var(--cyan-dim), rgba(0,229,255,0.03))", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "3rem" },
  projectInfo: { padding: "24px" },
  projectTag: { fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--cyan)", marginBottom: "8px" },
  projectTitle: { fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "10px" },
  projectDesc: { fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.65, marginBottom: "18px" },
  projectLink: { fontSize: "0.82rem", fontWeight: 600, color: "var(--cyan)", display: "inline-flex", alignItems: "center", gap: "6px" },
  contactGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" },
  contactItem: { display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" },
  contactIcon: { width: "42px", height: "42px", background: "var(--cyan-dim)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--cyan)", flexShrink: 0 },
  contactForm: { display: "flex", flexDirection: "column", gap: "16px" },
  formGroup: { display: "flex", flexDirection: "column", gap: "8px" },
  formLabel: { fontSize: "0.78rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)" },
  formInput: { background: "var(--card)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "14px 18px", color: "var(--white)", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.9rem", outline: "none" },
  footer: { position: "relative", zIndex: 1, textAlign: "center", padding: "36px 60px", borderTop: "1px solid rgba(255,255,255,0.05)", color: "var(--muted)", fontSize: "0.82rem" },
  scrollTop: { position: "fixed", bottom: "32px", right: "32px", width: "44px", height: "44px", background: "var(--cyan)", color: "#0d0d0f", border: "none", borderRadius: "50%", cursor: "pointer", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
};
