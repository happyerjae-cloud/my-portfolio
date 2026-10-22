/* TODO: 실제 프로젝트로 바꿔주세요. 위에 있을수록 먼저 보입니다.
   url: 상세 페이지 주소 (아직 없으면 '' 로 두면 클릭되지 않는 카드로 표시) */
const PROJECTS = [
  { title:'카페 브랜드 아이덴티티', cat:'BRANDING',  year:2026, img:'img/project-1.jpg', desc:'동네 로스터리 카페의 로고, 컬러, 패키지, 메뉴판까지 하나의 톤으로 정리한 브랜딩 프로젝트', url:'' },
  { title:'모바일 주문 앱 UI',      cat:'UI/UX',     year:2026, img:'img/project-2.jpg', desc:'매장 대기 없이 미리 주문하고 픽업하는 흐름을 설계한 모바일 앱', url:'' },
  { title:'브랜드 웹사이트 리뉴얼',  cat:'WEB',       year:2025, img:'img/project-3.jpg', desc:'오래된 홈페이지를 반응형으로 다시 설계하고 직접 퍼블리싱', url:'' },
  { title:'디저트 패키지 키 비주얼', cat:'AI VISUAL', year:2025, img:'img/project-1.jpg', desc:'생성형 AI로 시즌 디저트 패키지의 키 비주얼을 제작', url:'' },
  { title:'굿즈 3D 목업',          cat:'3D',        year:2025, img:'img/project-2.jpg', desc:'Blender로 브랜드 굿즈의 3D 목업과 제품 이미지를 제작', url:'' },
  { title:'예약 서비스 UX 개선',    cat:'UI/UX',     year:2025, img:'img/project-3.jpg', desc:'예약 단계의 이탈 지점을 찾아 화면 흐름을 다시 설계', url:'' },
  { title:'베이커리 로고 리디자인',  cat:'BRANDING',  year:2024, img:'img/project-1.jpg', desc:'오래된 베이커리 로고를 현재 매장 분위기에 맞게 정리', url:'' },
  { title:'포트폴리오 랜딩 페이지',  cat:'WEB',       year:2024, img:'img/project-2.jpg', desc:'HTML·CSS로 직접 구현한 개인 랜딩 페이지', url:'' },
  { title:'공간 3D 렌더링',        cat:'3D',        year:2024, img:'img/project-3.jpg', desc:'카페 인테리어 시안을 3D로 렌더링해 공간감을 미리 확인', url:'' },
];
const CATS = ['UI/UX','WEB','BRANDING','AI VISUAL','3D'];
const STEP = 6; // 처음 6개, 이후 6개씩
const STORE = 'projects-list-state';

(function(){
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

  /* ---- 목록 ---- */
  const grid = document.getElementById('grid');
  const filterEl = document.getElementById('filter');
  const moreWrap = document.getElementById('load-more');
  const moreBtn = document.getElementById('more-btn');
  const empty = document.getElementById('empty');
  const status = document.getElementById('list-status');
  document.getElementById('total').textContent = PROJECTS.length;

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // 상세에서 돌아왔을 때 필터·수량·스크롤 복원
  let saved = null;
  try { saved = JSON.parse(sessionStorage.getItem(STORE)); sessionStorage.removeItem(STORE); } catch(e){}
  const urlCat = new URLSearchParams(location.search).get('cat');
  let cat = (saved && saved.cat) || (CATS.includes(urlCat) ? urlCat : 'ALL');
  let shown = (saved && saved.shown) || STEP;

  const items = () => cat === 'ALL' ? PROJECTS : PROJECTS.filter(p => p.cat === cat);

  // 필터 버튼
  ['ALL', ...CATS].forEach(c=>{
    const n = c === 'ALL' ? PROJECTS.length : PROJECTS.filter(p => p.cat === c).length;
    const b = document.createElement('button');
    b.type = 'button';
    b.dataset.cat = c;
    b.innerHTML = `${c === 'ALL' ? '전체' : esc(c)}<span class="n">${n}</span>`;
    b.addEventListener('click', ()=>{
      if(cat === c) return;
      cat = c; shown = STEP;
      const u = new URL(location.href);
      c === 'ALL' ? u.searchParams.delete('cat') : u.searchParams.set('cat', c);
      history.replaceState(null, '', u);
      render();
    });
    filterEl.appendChild(b);
  });

  function card(p){
    const body = `
      <div class="thumb"><img src="${esc(p.img)}" alt="${esc(p.title)} 대표 이미지" loading="lazy"></div>
      <div class="card-meta"><span class="cat">${esc(p.cat)}</span><span>${esc(p.year)}</span></div>
      <h2>${esc(p.title)}</h2>
      <p>${esc(p.desc)}</p>`;
    return p.url
      ? `<li class="card"><a href="${esc(p.url)}">${body}</a></li>`
      : `<li class="card"><div class="inner">${body}</div></li>`;
  }

  function render(){
    filterEl.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === cat));
    const list = items();
    grid.innerHTML = list.slice(0, shown).map(card).join('');
    empty.hidden = list.length > 0;
    const rest = list.length - shown;
    moreWrap.hidden = rest <= 0;
    if(rest > 0) moreBtn.innerHTML = `프로젝트 더 보기 <span aria-hidden="true">+${Math.min(rest, STEP)}</span>`;
    status.textContent = `${Math.min(shown, list.length)}개 / 전체 ${list.length}개 표시 중`;
  }

  moreBtn.addEventListener('click', ()=>{
    const first = shown;
    shown += STEP;
    render();
    const next = grid.children[first];
    if(next){ const a = next.querySelector('a'); (a || next).setAttribute('tabindex', a ? '0' : '-1'); (a || next).focus({preventScroll:true}); }
  });

  // 상세 페이지로 이동할 때 현재 상태 저장
  grid.addEventListener('click', e=>{
    if(!e.target.closest('a')) return;
    try { sessionStorage.setItem(STORE, JSON.stringify({ cat, shown, y: scrollY })); } catch(err){}
  });

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
  let ticking = false;
  addEventListener('scroll', ()=>{
    if(ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{ headerBg(); ticking = false; });
  }, {passive:true});
  addEventListener('resize', headerBg);

  render();
  headerBg();
  if(saved && typeof saved.y === 'number') requestAnimationFrame(()=> scrollTo(0, saved.y));
})();
