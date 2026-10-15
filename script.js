(function () {
  'use strict';

  let prm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let mob = window.matchMedia('(max-width: 768px)').matches;

  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    prm = e.matches;
  });
  window.matchMedia('(max-width: 768px)').addEventListener('change', (e) => {
    mob = e.matches;
  });

  const cvs = document.getElementById('particles');
  if (cvs && !prm) {
    const ctx = cvs.getContext('2d');
    let ps = [], w, h;

    const rsz = () => { w = cvs.width = innerWidth; h = cvs.height = innerHeight; };

    const init = () => {
      ps = [];
      const n = mob ? 30 : 70;
      for (let i = 0; i < n; i++) ps.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.5 + 0.15, p: Math.random() * Math.PI * 2
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.p += 0.015;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        const a = p.a * (0.6 + Math.sin(p.p) * 0.4);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(62,224,168,' + a + ')'; ctx.fill();
      }
      requestAnimationFrame(draw);
    };
    rsz(); init(); draw();
    addEventListener('resize', () => { rsz(); init(); });
  }

  document.querySelectorAll('.magnetic-btn').forEach((btn) => {
    let rid = null, tx = 0, ty = 0, cx = 0, cy = 0;
    const R = 80, S = 0.35;

    const anim = () => {
      cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
      btn.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      rid = (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) ? requestAnimationFrame(anim) : null;
    };

    const go = () => { if (!rid) rid = requestAnimationFrame(anim); };

    document.addEventListener('mousemove', (e) => {
      if (prm || mob) {
        if (tx !== 0 || ty !== 0) { tx = 0; ty = 0; go(); }
        return;
      }
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < R) { tx = dx * S; ty = dy * S; } else { tx = 0; ty = 0; }
      go();
    });

    btn.addEventListener('mouseleave', () => { tx = 0; ty = 0; go(); });

    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--mouse-x', ((e.clientX - r.left) / r.width) * 100 + '%');
      btn.style.setProperty('--mouse-y', ((e.clientY - r.top) / r.height) * 100 + '%');
    });
  });

  const cat = document.getElementById('cat');
  const scene = document.querySelector('.hero__scene');
  if (cat && scene) {
    let rid = null, trx = 0, try_ = 0, crx = 0, cry = 0;

    const anim = () => {
      crx += (trx - crx) * 0.08; cry += (try_ - cry) * 0.08;
      cat.style.transform = 'rotateX(' + crx + 'deg) rotateY(' + cry + 'deg)';
      rid = (Math.abs(trx - crx) > 0.05 || Math.abs(try_ - cry) > 0.05) ? requestAnimationFrame(anim) : null;
    };
    const go = () => { if (!rid) rid = requestAnimationFrame(anim); };

    addEventListener('mousemove', (e) => {
      if (prm || mob) {
        trx = 0; try_ = 0; go();
        return;
      }
      try_ = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * 10;
      trx = -((e.clientY - innerHeight / 2) / (innerHeight / 2)) * 10;
      go();
    });
  }

  const cEyes = document.querySelectorAll('.cat__eye');
  const hEyes = document.querySelectorAll('.hud-eye');
  addEventListener('mousemove', (e) => {
    if (prm || mob) return;

    if (cEyes.length) {
      const sx = ((e.clientX - innerWidth / 2) / (innerWidth / 2)) * 4;
      const sy = ((e.clientY - innerHeight / 2) / (innerHeight / 2)) * 4;
      cEyes.forEach((el) => el.style.transform = 'translate(' + sx + 'px,' + sy + 'px)');
    }
    if (hEyes.length) {
      hEyes.forEach((eye) => {
        const r = eye.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const sh = Math.min(Math.hypot(dx, dy) / 20, 6);
        const an = Math.atan2(dy, dx);
        eye.style.setProperty('--pupil-x', Math.cos(an) * sh + 'px');
        eye.style.setProperty('--pupil-y', Math.sin(an) * sh + 'px');
      });
    }
  });

  const exp = document.querySelector('.exploded__scene');
  const expCard = document.querySelector('.exploded__card');
  if (exp && expCard && !prm) {
    const lys = exp.querySelectorAll('.exploded__layer');
    let act = false;

    const check = () => {
      const t = exp.getBoundingClientRect().top;
      const tr = innerHeight * 0.7;
      if (t < tr && !act) {
        act = true;
        lys.forEach((l, i) => {
          l.style.transitionDelay = i * 0.15 + 's';
          l.style.transform = 'translateZ(' + (l.dataset.z || 0) + 'px)';
        });
      } else if (t >= tr && act) {
        act = false;
        lys.forEach((l) => { l.style.transitionDelay = '0s'; l.style.transform = 'translateZ(0px)'; });
      }
    };
    addEventListener('scroll', check, { passive: true });
    check();

    let rid = null, trx = 25, try_ = -25, crx = 25, cry = -25;
    const anim = () => {
      crx += (trx - crx) * 0.08; cry += (try_ - cry) * 0.08;
      expCard.style.transform = 'translate(-50%,-50%) rotateX(' + crx + 'deg) rotateY(' + cry + 'deg)';
      rid = (Math.abs(trx - crx) > 0.1 || Math.abs(try_ - cry) > 0.1) ? requestAnimationFrame(anim) : null;
    };
    const go = () => { if (!rid) rid = requestAnimationFrame(anim); };

    exp.addEventListener('mousemove', (e) => {
      if (prm || mob) return;
      const r = exp.getBoundingClientRect();
      try_ = -25 + ((e.clientX - r.left - r.width / 2) / r.width) * 50;
      trx = 25 - ((e.clientY - r.top - r.height / 2) / r.height) * 40;
      go();
    });

    exp.addEventListener('mouseleave', () => {
      trx = 25; try_ = -25; go();
    });

    let tapped = false;
    exp.addEventListener('click', () => {
      if (!mob) return;
      tapped = !tapped;
      lys.forEach((l, i) => {
        l.style.transitionDelay = i * 0.1 + 's';
        l.style.transform = tapped
          ? 'translateZ(' + (l.dataset.z || 0) + 'px)'
          : 'translateZ(0px)';
      });
    });
  }

  const cups = document.querySelectorAll('.cup');
  if (cups.length) {
    const obs = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) {
          const l = e.target.querySelector('.cup__liquid');
          if (l) l.style.height = (e.target.dataset.value || 100) + '%';
        }
      });
    }, { threshold: 0.5 });
    cups.forEach((c) => obs.observe(c));
  }

  if (cat && !prm) {
    const updateIdle = () => {
      cat.style.animation = mob ? 'mobileIdle 6s ease-in-out infinite' : '';
    };
    updateIdle();
    window.matchMedia('(max-width: 768px)').addEventListener('change', updateIdle);
  }

  const rit = document.getElementById('ritual');
  const rn = document.getElementById('ritualNum');
  const rt = document.getElementById('ritualTitle');
  const rtx = document.getElementById('ritualText');
  const pr = [
    ['XIX', 'Солнце', 'Свет уже нашёл тебя.'],
    ['XVIII', 'Луна', 'Тайна откроется мягко.'],
    ['XXI', 'Мир', 'Всё на своих местах.'],
    ['XVII', 'Звезда', 'Надежда уже рядом.'],
    ['VI', 'Влюблённые', 'Сердце знает путь.'],
    ['X', 'Колесо Фортуны', 'Всё повернётся к лучшему.'],
    ['III', 'Императрица', 'Изобилие придёт само.'],
    ['0', 'Шут', 'Шагни — и всё получится.']
  ];

  const sb = document.getElementById('summonBtn');
  const fb = document.getElementById('finalBtn');
  let rAct = false;

  if (sb) sb.addEventListener('click', () => {
    if (rAct || prm) return;
    rAct = true;
    if (cat) {
      cat.classList.add('cat--flash');
      setTimeout(() => cat.classList.remove('cat--flash'), 1400);
    }
    setTimeout(() => {
      rit.classList.add('ritual--active');
      const p = pr[Math.floor(Math.random() * pr.length)];
      rn.textContent = p[0];
      rt.textContent = p[1];
      rtx.textContent = p[2];
      setTimeout(() => rit.classList.add('ritual--card'), 400);
      setTimeout(() => rit.classList.add('ritual--final'), 2400);
      setTimeout(() => {
        rit.classList.remove('ritual--final');
        rit.classList.remove('ritual--card');
        setTimeout(() => {
          rit.classList.remove('ritual--active');
          rAct = false;
        }, 800);
      }, 5500);
    }, 900);
  });
  
  if (fb) fb.addEventListener('click', () => {
    if (rAct || prm) return;
    rAct = true;
    document.body.style.transition = 'filter .4s ease';
    document.body.style.filter = 'brightness(.6)';
    setTimeout(() => {
      document.body.style.transition = '';
      document.body.style.filter = '';
      document.body.classList.add('collapse');
    }, 400);
    setTimeout(() => {
      document.body.classList.remove('collapse');
      document.body.classList.add('burst-shake');
      rit.classList.add('ritual--active');
      rit.classList.add('ritual--burst');
      setTimeout(() => document.body.classList.remove('burst-shake'), 500);
    }, 1600);
    setTimeout(() => rit.classList.remove('ritual--burst'), 2800);
    setTimeout(() => rit.classList.add('ritual--final'), 3600);
    setTimeout(() => {
      rit.classList.remove('ritual--final');
      setTimeout(() => {
        rit.classList.remove('ritual--active');
        rAct = false;
      }, 800);
    }, 6600);
  });

  const st = document.createElement('style');
  st.textContent = '@keyframes mobileIdle{0%,100%{transform:rotateZ(-1.5deg) translateY(0)}50%{transform:rotateZ(1.5deg) translateY(-6px)}}';
  document.head.appendChild(st);
})();