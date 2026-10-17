# 디자인 스타일 — 미니멀 · 큰 타이포 · 좌측 제목 + 우측 콘텐츠

기준 문서: `포트폴리오_기획서_기능정의서_수정사항2.md` (2026-10-17), 「포트폴리오 디자인 계획서 수정」 PDF
실제 코드: `index.html` — 수정 전에 이 파일도 함께 열어볼 것

## 기본 설정
- 컨텐츠 최대 폭: 1280px (인트로·이미지 푸터는 화면 전체 사용)
- 화면 구분: PC 1024px 이상 · 태블릿 768~1023px · 모바일 767px 이하
- 간격: 10px 단위 (`--sp1`=10px, `--sp2`=20px, `--sp3`=30px …)
- 모서리: 기본 8px (`--r`), 필요하면 4px 단위 (`--r-sm`=4px). 태그는 알약형(999px)
- 분위기 참고: studiokyle(미니멀·전체 목록) / 구조·레이아웃·인트로 참고: insplanet

## 색상 (변수로 선언)
```
--cream:#faf6ed     밀크 크림 — 전체 배경
--terra:#af513d     테라코타 — 주요 버튼·강조 단어·화살표
--oat:#ddd0bb       오트밀 — 카드·섹션 배경, 태그 배경
--ink:#332b27       에스프레소 — 제목·본문
--apricot:#e9b89a   애프리콧 — 작은 장식·그래픽
--ink-soft:#6a5d55  보조 글자 (에스프레소를 옅게)
--line:#e6dccb      구분선
```
- 애프리콧(장식색)은 본문 글자색으로 쓰지 않는다.
- 테라코타 버튼 위 글자는 밀크 크림(대비 약 4.8:1).
- 작업물 이미지의 원래 색은 그대로 둔다.

## 글꼴
| 용도 | 글꼴 | 굵기 |
| --- | --- | --- |
| 본문·메뉴 설명·버튼·폼 | 에스코어드림 (`'Escoredream'`) | 400, 500 |
| 로고·인트로 Portfolio·섹션 제목(Who am I·Works·Contact)·메뉴 항목 | 영도체 (`'Yeongdo'`) | 400 |

```css
@font-face{font-family:'Escoredream';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-4Regular.woff') format('woff');font-weight:400;font-display:swap}
@font-face{font-family:'Escoredream';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-5Medium.woff') format('woff');font-weight:500;font-display:swap}
@font-face{font-family:'Yeongdo';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/2410-1@1.2/Yeongdo-Rg.woff2') format('woff2');font-weight:400;font-display:swap}
```

## 페이지 구성 (메인 = 한 페이지)
인트로 → Who am I → Works → Contact → 이미지 푸터

| 영역 | 레이아웃 |
| --- | --- |
| 헤더 | 왼쪽 로고, 오른쪽 햄버거 메뉴. 메뉴가 열리면 같은 자리에 X 닫기 버튼(Esc로도 닫힘). **PC·태블릿·모바일 모두 햄버거** (닫힌 상태에 메뉴 항목 나열 안 함) |
| 인트로 | 풀스크린. 왼쪽 아래 큰 `Portfolio` + 한 줄 소개, 오른쪽 위 `Designing ideas into / experiences.`(experiences 테라코타) + `UI/UX · WEB · AI VISUAL · 3D`, 오른쪽 끝 세로 SCROLL |
| Who am I | 좌측: 제목 + 프로필 사진 / 우측: Experience · Education · Tool(단색 아이콘 + 5단계 숙련도 + `4/5` 텍스트) · Skill(실제로 할 수 있는 업무 설명) |
| Works | 좌측: 제목 고정 / 우측: 프로젝트 세로 나열 (프로젝트명 → 16:9 이미지 → 2줄 설명 → 알약 태그 → `자세히 보기`). **메인은 최대 4개**, 프로젝트 아래 `지난 프로젝트 더보기` → `projects.html` |
| 전체 작업물 (`projects.html`) | 큰 `Works` 제목 + 총 개수, 분야 필터(전체·UI/UX·WEB·BRANDING·AI VISUAL·3D), 3열(태블릿 2열·모바일 1열) 카드: 4:3 이미지 → 분야·연도 → 프로젝트명 → 2줄 설명. 처음 6개, `프로젝트 더 보기`로 6개씩 추가. 상세에서 돌아오면 필터·개수·스크롤 위치 복원 |
| Contact | 좌측: 제목 고정 / 우측: 폼 — 기업명(선택)·성함(필수) 한 줄, 이메일(필수), 문의내용(필수), 개인정보 동의(필수), `메일보내기`. 수신 주소 `raspberry8437@gmail.com` |
| 이미지 푸터 | 큰 배경 이미지 + 아래쪽 어두운 그라데이션 위에 저작권 표기 |

### 섹션 제목 전환 (`.pin`)
1. 섹션 시작 시 제목이 화면 왼쪽 가운데 높이에 크게 보인다.
2. 스크롤하면 작아지면서 위로 올라가 왼쪽 위(`--pin-top`=110px)에 고정된다.
3. 섹션이 끝날 때까지 고정, 끝나면 섹션과 함께 올라간다.
- PC·태블릿(768px 이상) + 움직임 허용일 때만 `html.motion` 클래스로 동작한다.
- 모바일·'동작 줄이기' 설정에서는 효과 없이 1열 정적 배치로 보여준다.

## 버튼
- 모바일 기준으로 먼저 설계: 최소 높이 50px, 모서리 8px, 테라코타 배경 + 크림 글자.
- 모바일에서는 폼 버튼을 가로 전체 폭으로, PC·태블릿에서는 오른쪽 정렬.

## 수정 시 지켜야 할 것
- 색은 위 팔레트 변수만 사용하고, 새 색을 임의로 추가하지 않기
- 제목류는 영도체, 본문은 에스코어드림 — 두 글꼴 외 다른 글꼴 섞지 않기
- 간격은 10px 단위, 모서리는 8px 기본(4px 단위) 유지
- 한글 줄바꿈 `word-break: keep-all` 유지
- 섹션은 "좌측 제목 + 우측 콘텐츠" 2단 구조 유지 (모바일은 1열)
- 섹션 제목 전환 효과를 바꿀 때 모바일·동작 줄이기 설정에서 내용이 가려지지 않는지 확인
- 메인 Works는 최대 4개까지만 노출

## 체크리스트

### 아직 체크 안 된 것
- [ ] 실제 모바일 기기에서 인트로 문구가 겹치거나 잘리지 않는지
- [ ] 메뉴로 바로 이동했을 때 제목 축소·고정 상태가 정상인지
- [ ] 태블릿(768~1023px)에서 기업명·성함 칸 배치 확인
- [ ] 이미지 푸터의 모바일 크롭 확인
- [ ] 키보드만으로 메뉴 열기·닫기·폼 입력이 되는지

### 내용 중 사용자가 직접 바꿔야 할 것 (`index.html`의 `TODO` 주석 위치)
- [ ] 경력·학력 (`OO 디자인 스튜디오`, `OO대학교` 등 임시 문구)
- [ ] 툴별 숙련도 숫자 (`data-level`)
- [ ] 프로젝트 이름·설명·태그·이미지 (최대 4개)
- [ ] `img/profile.jpg`, `img/project-1~3.jpg`, `img/visual.jpg`(푸터 배경)를 실제 사진으로 교체
- [ ] `자세히 보기` 링크 — 프로젝트 상세 페이지를 만든 뒤 연결
- [ ] 푸터 저작권 표기의 최종 이름 확인

## 이전 스타일 문서
처음 비교했던 4가지 스타일(`style-a-minimal.md` ~ `style-d-dark.md`)은 참고용으로만 남겨둔다. 현재 디자인 기준은 이 문서다.
