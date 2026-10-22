(function(){
  const root = document.documentElement;
  const motionMQ = matchMedia('(min-width:768px) and (prefers-reduced-motion: no-preference)');

  /* ---- 인트로 글자 나누기 ---- */
  const h1 = document.querySelector('.intro-title h1');
  h1.innerHTML = [...h1.textContent].map((c,i)=>`<span class="ch" aria-hidden="true" style="--i:${i}">${c}</span>`).join('');

  /* ---- 숙련도 5단계 ---- */
  document.querySelectorAll('.tool').forEach(t=>{
    const lv = +t.dataset.level;
    let dots = '';
    for(let i=1;i<=5;i++){
      dots += `<i class="${i<=lv?'on':''}"></i>`;
      if(i<5) dots += `<b class="${i<lv?'on':''}"></b>`;
    }
    t.insertAdjacentHTML('beforeend',
      `<span class="level" aria-hidden="true">${dots}</span><span class="tool-lv"><span class="sr-only">숙련도 5단계 중 </span>${lv}/5</span>`);
  });

  /* ---- 햄버거 메뉴 ---- */
  const btn = document.querySelector('.menu-btn');
  const menu = document.getElementById('menu');
  const closeBtn = menu.querySelector('.menu-close');
  function setMenu(open){
    btn.setAttribute('aria-expanded', open);
    menu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    if(open) closeBtn.focus(); else btn.focus();
  }
  btn.addEventListener('click', ()=> setMenu(true));
  closeBtn.addEventListener('click', ()=> setMenu(false));
  menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> setMenu(false)));
  document.addEventListener('keydown', e=>{
    if(e.key === 'Escape' && menu.classList.contains('open')) setMenu(false);
  });

  /* ---- 섹션 제목: 크게 → 작아지며 고정 ---- */
  const pins = [...document.querySelectorAll('.pin')];
  const HOLD = 0.5; // 화면 높이의 50% 만큼 제목이 크게 머문 뒤 작아짐 (CSS --hold와 같은 값)
  let metrics = [];

  function measure(){
    const vh = innerHeight;
    const pinTop = parseFloat(getComputedStyle(root).getPropertyValue('--pin-top'));
    const big = Math.min(160, Math.max(80, innerWidth * 0.11));
    metrics = pins.map(sec=>{
      const title = sec.querySelector('.pin-title');
      const fs = parseFloat(getComputedStyle(title).fontSize);
      const h = title.offsetHeight;
      const S = big / fs;
      return { sec, title, S,
        hold: vh * HOLD,
        dist: vh - pinTop - 40,
        startY: vh/2 - pinTop - (h*S)/2 };
    });
  }

  const ease = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2; // 천천히 시작 → 천천히 멈춤
  function update(){
    if(!root.classList.contains('motion')) return;
    metrics.forEach(m=>{
      const top = m.sec.getBoundingClientRect().top;
      const p = ease(Math.min(1, Math.max(0, (-top - m.hold) / m.dist)));
      const s = m.S + (1 - m.S) * p;
      const ty = m.startY * (1 - p);
      m.title.style.transform = `translateY(${ty}px) scale(${s})`;
      m.sec.style.setProperty('--p', p.toFixed(3));
    });
  }

  function applyMode(){
    root.classList.toggle('motion', motionMQ.matches);
    if(motionMQ.matches){ measure(); update(); }
    else pins.forEach(sec=>{ sec.querySelector('.pin-title').style.transform=''; sec.style.removeProperty('--p'); });
  }

  /* ---- 헤더 배경: 바로 아래 섹션의 배경색을 따라감 (이미지 푸터 위에서는 투명) ---- */
  const header = document.querySelector('.site-header');
  const bgAreas = [...document.querySelectorAll('main > section, .site-footer')];
  const pageBg = getComputedStyle(document.body).backgroundColor;
  function headerBg(){
    const y = header.offsetHeight;
    const area = bgAreas.find(el=>{ const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; });
    let bg = 'transparent';
    if(area && !area.classList.contains('site-footer')){
      const c = getComputedStyle(area).backgroundColor;
      bg = (c === 'rgba(0, 0, 0, 0)' || c === 'transparent') ? pageBg : c;
    }
    header.style.backgroundColor = bg;
  }
  headerBg();

  let ticking = false;
  addEventListener('scroll', ()=>{
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{ update(); headerBg(); ticking = false; });
  }, {passive:true});
  addEventListener('resize', ()=>{ if(root.classList.contains('motion')){ measure(); update(); } headerBg(); });
  motionMQ.addEventListener('change', applyMode);
  document.fonts && document.fonts.ready.then(()=>{ if(root.classList.contains('motion')){ measure(); update(); } });
  applyMode();

  /* ---- Notes 게시판 ----
     TODO: 게시판(예: Supabase)을 연결하면 NOTES 대신 불러온 글 목록을 renderNotes()에 넘겨주세요.
     글 하나의 형태: { date:'2026.10.17', cat:'회고', title:'제목', excerpt:'요약', url:'상세 주소' } */
  const NOTES = [
    { date:'2026.10.17', cat:'회고',   title:'포트폴리오 디자인을 미니멀 방향으로 바꾼 이유', excerpt:'카드형 레이아웃에서 큰 타이포 중심으로 바꾸면서 고민한 것들', url:'' },
    { date:'2026.10.10', cat:'정리',   title:'스크롤에 따라 작아지는 섹션 제목 만들기',     excerpt:'position: sticky와 스크롤 진행률로 제목 전환을 구현한 과정', url:'' },
    { date:'2026.09.28', cat:'작업기', title:'카페 브랜딩 프로젝트 컬러 시스템 정리',       excerpt:'밀크 크림과 테라코타를 중심으로 팔레트를 정한 기준', url:'' },
  ];
  const MAX_NOTES = 5; // 메인에 보여줄 최대 글 수
  const escHTML = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function renderNotes(list){
    const ul = document.getElementById('note-list');
    ul.innerHTML = list.slice(0, MAX_NOTES).map(n => `
      <li class="note"><a href="${escHTML(n.url || '#notes')}">
        <span class="note-date">${escHTML(n.date)}</span>
        <div><span class="note-cat">${escHTML(n.cat)}</span><h3>${escHTML(n.title)}</h3>${n.excerpt ? `<p>${escHTML(n.excerpt)}</p>` : ''}</div>
      </a></li>`).join('');
    document.getElementById('notes-empty').hidden = list.length > 0;
    if(root.classList.contains('motion')){ measure(); update(); }
  }
  renderNotes(NOTES);

  /* ---- 문의 폼 ---- */
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const f = id => document.getElementById(id);
  function setErr(input, errId, msg){
    f(errId).textContent = msg;
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const name = f('f-name'), email = f('f-email'), msg = f('f-msg'), agree = f('f-agree'), company = f('f-company');
    const ok = [
      setErr(name, 'e-name', name.value.trim() ? '' : '성함을 입력해주세요.'),
      setErr(email, 'e-email', !email.value.trim() ? '답변 받으실 이메일을 입력해주세요.'
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : '이메일 형식을 확인해주세요.'),
      setErr(msg, 'e-msg', msg.value.trim() ? '' : '문의내용을 입력해주세요.'),
      setErr(agree, 'e-agree', agree.checked ? '' : '개인정보 수집에 동의해주세요.')
    ].every(Boolean);
    if(!ok){ form.querySelector('[aria-invalid="true"]').focus(); status.textContent=''; return; }

    const subject = `[포트폴리오 문의] ${company.value.trim() ? company.value.trim() + ' · ' : ''}${name.value.trim()}`;
    const body = `기업명: ${company.value.trim() || '-'}\n성함: ${name.value.trim()}\n회신 이메일: ${email.value.trim()}\n\n${msg.value.trim()}`;
    location.href = `mailto:raspberry8437@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.textContent = '메일 앱이 열렸습니다. 메일 앱에서 보내기를 눌러주세요.';
  });
})();
