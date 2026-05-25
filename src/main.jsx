import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const mainDeployOrigin = '';
const lines = (items) => items.join('\n');

const projectDetails = [
  {
    id: 'caredoc',
    label: 'CareDoc',
    type: '복지 서류 도구',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/caredoc/index.html?portfolio=1&v=20260525-0025',
    title: '복지시설 서류 작성 흐름을 줄이는 문서 도구',
    summary: lines([
      '엑셀·워드 중심의 반복 서류 업무를',
      '브라우저 업무 흐름으로 전환해본 프로젝트입니다.',
    ]),
    stack: ['React', 'PDF', 'SVG', '엑셀·워드 웹화'],
    problem: lines([
      '일본 복지시설 서류 업무에서 같은 정보를 여러 번 적고,',
      '가족관계도를 워드 도형으로 직접 그리는 반복 작업이 있었습니다.',
    ]),
    solution: lines([
      '엑셀·워드 파일에서 반복되던 입력 흐름을 정리하고,',
      '정보 입력부터 가족관계도와 PDF 출력까지 웹에서 이어지게 만들었습니다.',
    ]),
    detail: ['엑셀·워드 기반 업무를 브라우저 업무 흐름으로 전환', '이용자 정보가 여러 문서에 자동 반영', '가족관계도를 SVG로 자동 렌더링', '출력물 기준으로 PDF 생성'],
    demo: [
      ['이용자', '야마다 하나코 / 82세 / 요양 3등급'],
      ['문서 흐름', '회의록, 모니터링, 지원계획서 자동 반영'],
      ['출력', '가족관계도 SVG + PDF 준비 완료'],
    ],
    screenshots: [
      ['실제로 사용하던 워드 서류 화면', lines([
        '일본 장애인복지시설에서 실제로 사용하던 서류 화면입니다.',
        '직원 평균연령은 50대 후반이었고, 연령과 관계없이',
        '다루기 어려울 만큼 입력 항목과 문서 구조가 복잡했습니다.',
        '같은 정보를 여러 문서에 반복 작성해 업무 부담이 컸습니다.',
      ]), '/project-shots/caredoc/01.jpg'],
      ['웹으로 옮긴 워드와 엑셀 파일들', lines([
        '복잡한 워드와 엑셀 파일에서 반복 입력하던 내용을 추려',
        '한 번에 적용되도록 만들었습니다.',
        '직원이 순서대로 입력하면 서류가 완성되도록',
        '4개 파일의 업무 흐름을 웹으로 재구성했습니다.',
      ]), '/project-shots/caredoc/02.jpg'],
      ['반복 입력을 줄인 키보드 단축키', lines([
        '반복 입력을 줄인 뒤에도 비슷한 문장을',
        '자주 입력해야 하는 문제가 남아 있었습니다.',
        '고령의 직원도 쉽게 사용할 수 있도록',
        '키보드 단축키 기능을 추가했습니다.',
      ]), '/project-shots/caredoc/03.jpg'],
      ['서류 작성 과정을 단순화한 화면', lines([
        '처음에는 기능을 많이 붙였지만,',
        '실제 사용자 연령대와 업무 환경을 고려해',
        '과도한 기능보다 단순한 흐름과 접근성을 우선했습니다.',
        '필요한 순서대로 따라가면 작성이 끝나도록 구성했습니다.',
      ]), '/project-shots/caredoc/04.jpg'],
      ['자동 SVG로 그려지는 제노그램', lines([
        '문제의 제노그램, 즉 가족관계도는',
        '실제 워드에서 도형으로 직접 만들어야 했습니다.',
        '웹에서는 가족관계만 입력하면 자동 SVG 렌더링으로',
        '관계도가 그려지도록 만들었습니다.',
      ]), '/project-shots/caredoc/05.jpg'],
      ['출력 전 최종 확인 및 PDF 준비', lines([
        '입력된 정보와 작성된 문서를',
        '출력 가능한 형태로 정리하는 단계입니다.',
        '복잡한 워드 작업을 브라우저 안에서 마무리하고,',
        '제출용 문서로 이어질 수 있게 만든 결과 화면입니다.',
      ]), '/project-shots/caredoc/06.jpg'],
    ],
  },
  {
    id: 'fixchecker',
    label: 'Subtitle Fix Checker',
    type: 'AI 수정 흐름',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/subtitle-fix-checker/',
    title: '자막 검수 판단을 AI 수정 지시서로 바꾸는 도구',
    summary: lines([
      '검수자가 웹에서 하자 스티커를 붙이듯 문제 구간을 표시하고,',
      'JSON 주문서로 AI 수정까지 이어지게 만든 도구입니다.',
    ]),
    stack: ['React', 'JSON', 'AI 수정 연계', 'CapCut Draft'],
    problem: lines([
      '자막 검수는 사람이 판단한 내용이 흩어지면',
      '후속 수정 지시로 다시 정리하는 시간이 듭니다.',
    ]),
    solution: lines([
      '오류 구간과 수정 요청을 JSON 주문서로 만들고,',
      'AI가 CapCut 드래프트 파일을 수정하는 흐름까지 연결했습니다.',
    ]),
    detail: ['웹에서 자막 오류 구간과 수정 요청을 표시', '검수 판단을 JSON 주문서로 변환', 'AI에게 재전달해 CapCut 드래프트 수정 흐름으로 연결', '사용자의 반복 손작업을 줄이는 구조 실험'],
    demo: [
      ['00:03.2', '표현이 딱딱함 -> 자연스럽게 수정'],
      ['00:06.8', '문장 호흡이 김 -> 두 문장으로 분리'],
      ['출력', '오류 목록 작업지시서 생성'],
    ],
    screenshots: [
      ['영상 입력', '검수할 영상을 올리거나 확인하는 화면'],
      ['구간 체크', '오류 시간과 내용을 행 단위로 기록하는 화면'],
      ['수정 요청', '어떻게 바꿀지 지시를 적는 화면'],
      ['JSON 출력', 'AI가 읽을 작업지시서를 생성하는 화면'],
      ['오류 목록', '선택된 오류를 한 번에 검토하는 화면'],
      ['결과 확인', '후속 수정에 넘길 내용을 확인하는 화면'],
    ],
  },
  {
    id: 'lucid',
    label: 'Lucid',
    type: 'AI 학습 도구',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/lucid/',
    title: 'AI API와 GitHub 자료를 연결한 학습 도구',
    summary: lines([
      'AI API로 문제 출제와 정답 체크를 처리하고,',
      'GitHub 자료를 불러와 복습 흐름으로 연결한 학습 서비스입니다.',
    ]),
    stack: ['React', 'LangChain', 'AI API', 'GitHub API', 'Monaco Editor'],
    problem: lines([
      '수업 자료와 복습 문제가 흩어져 있으면',
      '학습자가 필요한 자료를 다시 찾고 문제로 확인하는 과정이 번거롭습니다.',
    ]),
    solution: lines([
      '강사의 GitHub 자료를 불러오고,',
      'AI API로 문제 출제, 정답 체크, 학습자료 출력을 연결했습니다.',
    ]),
    detail: ['LangChain과 AI API를 활용한 문제 출제', 'Monaco Editor를 활용한 코드/자료 확인 화면', '정답 체크와 학습자료 출력 흐름 구현', 'GitHub API로 강사 자료를 불러오는 복습 기능'],
    demo: [
      ['에디터', 'Monaco Editor로 코드와 자료 확인'],
      ['AI', '문제 출제 / 정답 체크 / 학습자료 출력'],
      ['자료', '강사 GitHub 자료 불러오기'],
    ],
    screenshots: [
      ['학습 홈', '복습할 수업 자료와 학습 흐름을 확인하는 화면'],
      ['코드 에디터', 'Monaco Editor로 코드와 학습 자료를 확인하는 화면'],
      ['문제 출제', 'AI API를 활용해 학습 내용 기반 문제를 만드는 화면'],
      ['정답 체크', '사용자 답안을 확인하고 피드백하는 화면'],
      ['학습자료 출력', '복습에 필요한 자료를 다시 정리해 출력하는 화면'],
      ['데모 세션', '로그인 없이 핵심 학습 흐름을 확인하는 화면'],
    ],
  },
  {
    id: 'reallife',
    label: 'RealLife',
    type: '생활 시뮬레이션',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/reallife/',
    title: '로그인 없이 바로 플레이하는 생활 시뮬레이션 게임',
    summary: '게임을 만들며 시각적 UI와 룰 기반 상태 흐름을 실습한 프로젝트입니다.',
    stack: ['React', '게임 화면', '상태 흐름', 'AI 기반 확장'],
    problem: lines([
      '게임형 프로젝트는 설명보다 직접 선택하고',
      '결과를 보는 편이 구현력을 더 빠르게 전달합니다.',
    ]),
    solution: lines([
      '룰과 UI를 분리해 구성하고,',
      '이후 AI에게 다른 규칙을 지시해도 비슷한 방식으로 확장할 수 있게 실험했습니다.',
    ]),
    detail: ['캐릭터 선택과 턴 진행', '체력/현금/집중도 변화', '시각적인 게임 UI 구성 실습', 'AI에게 룰을 지시해 다른 스타일 게임으로 확장 가능성 확인'],
    demo: [
      ['1턴', '알바 제안 수락 / 체력 -8 / 현금 +70,000'],
      ['2턴', '자격증 공부 / 집중도 +12 / 시간 -3'],
      ['결과', '생활비와 성장 선택지를 비교'],
    ],
    screenshots: [
      ['시작 화면', '게임 진입 전 분위기와 목표를 보여주는 화면'],
      ['캐릭터 선택', '플레이할 캐릭터를 고르는 화면'],
      ['상태판', '체력, 현금, 집중도 등 현재 상태를 보는 화면'],
      ['이벤트 카드', '턴마다 등장하는 선택지를 확인하는 화면'],
      ['결과 반영', '선택 후 수치 변화가 표시되는 화면'],
      ['엔딩 흐름', '누적 선택 결과를 확인하는 화면'],
    ],
  },
];

const experienceItems = [
  {
    id: 'career-crm',
    label: '통신 CRM 경력',
    period: '2016.01 ~ 현재',
    title: lines([
      '8년 이상 고객의 불편과 니즈를',
      '직접 마주한 경험',
    ]),
    body: lines([
      'U+ 이전설치 상담, 고객케어,',
      '헬로비전 가치제안 업무를 거치며 고객을 응대했습니다.',
      '해지 의사 고객의 불편을 듣고 유지 제안과 재약정을 안내하며,',
      '작은 차이가 사용자 경험에 영향을 준다는 점을 체감했습니다.',
    ]),
  },
  {
    id: 'career-japan',
    label: '일본 해외연수',
    period: '2018.04 ~ 2019.10',
    title: lines([
      '일본 문화와 현장 언어를',
      '직접 익힌 생활 경험',
    ]),
    body: lines([
      '일본 워킹홀리데이 1년과 유학원 6개월 생활로',
      '현지 문화를 직접 경험했습니다.',
      '현재도 일본어권 가족과 생활하며',
      '실생활 중심의 일본어 회화 능력을 유지하고 있습니다.',
      '이 경험은 현장의 말을 더 정확히 듣고 정리하는 기반이 됐습니다.',
    ]),
  },
  {
    id: 'career-education',
    label: '교육 이수',
    period: '2025.09 ~ 2026.02',
    title: lines([
      'RAG AI 기반 풀스택',
      '개발자 양성과정 수료',
    ]),
    body: lines([
      '2025년 9월부터 2026년 2월까지',
      '풀스택 개발 교육을 이수하며 웹 개발의 기본 구조를 익혔습니다.',
      '수료 이후에는 에이전트 코딩 방식을 익혀,',
      '실제 프로젝트 구현에 활용하고 있습니다.',
    ]),
  },
];

const resumeIntro = lines([
  '저는 반복되는 불편함을 그냥 넘기지 못하는 편입니다. 같은 작업을 여러 번 반복하는 상황에서 손을 더 빠르게 움직이기보다, 먼저 이 과정을 줄일 방법을 고민했습니다. 좌표 기반 매크로로 여러 단계의 작업을 원키로 줄여본 경험도 그때 시작됐고, 그 경험이 자연스럽게 개발에 대한 관심으로 이어졌습니다.',
  '',
  'RAG·AI 기반 풀스택 개발자 양성과정에서는 Java, Spring Boot, React, MySQL, Python을 학습했습니다. 팀 프로젝트에서는 레시피 추천 서비스의 데이터 정규화 문제를 맡았습니다. 기능이 동작하더라도 사용자가 헷갈리면 좋은 흐름이 아니라고 느꼈고, 개발은 단순히 기능을 구현하는 것에서 끝나는 것이 아니라 사용자가 자연스럽게 이해하고 선택할 수 있는 흐름까지 고민해야 한다는 것을 배웠습니다.',
  '',
  '교육과정 이후에는 실제 현장의 문제를 웹앱으로 바꿔보는 경험을 이어가고 있습니다. 일본 복지시설의 서류 업무에서는 같은 정보를 여러 번 적고 자주 쓰는 문장을 매번 다시 고르는 흐름이 먼저 보였습니다. 저는 큰 시스템을 만드는 것보다, 한 번 입력한 정보가 필요한 서류에 자연스럽게 이어지고 자주 쓰는 표현을 다시 찾지 않아도 되는 흐름이 먼저 필요하다고 생각했습니다. 그래서 이용자 정보 자동 반영, 자주 쓰는 문구 선택, 가족관계도 SVG 자동 렌더링, PDF 출력 기능을 넣어 실제 서류 작성 흐름에 맞춘 CareDoc을 만들었습니다.',
  '',
  '자막 검수 작업에서는 사람이 판단한 내용을 흘려보내지 않고 AI 후속 수정으로 이어질 수 있게 정리하려고 했습니다. 영상을 보면서 빠르게 틀린 부분만 체크한 뒤, 오류 구간과 시간, 원문, 수정 요청을 JSON 형태의 작업지시서로 남기는 구조를 만들었고, 이 흐름을 Subtitle Fix Checker로 구현했습니다.',
  '',
  'AI 도구를 사용하면서도 비슷한 점을 느꼈습니다. AI는 많은 것을 가능하게 해주지만, 어떤 지시를 주는지에 따라 결과가 크게 달라졌습니다. 계속 틀리는 부분도 단순히 코드를 다시 요구하기보다, 문제를 설명하는 맥락이나 방향을 바꾸면 전혀 다른 결과가 나오는 경우가 많았습니다. 그래서 모르는 부분이 나왔을 때 멈추기보다 질문을 어떻게 바꾸고, 문제를 어디까지 나누며, 결과를 어떻게 확인할지 계속 고민하게 됐습니다.',
  '',
  '저의 장점은 사람들이 익숙해서 지나치는 작은 불편을 발견하고, 그 문제를 실제로 사용할 수 있는 형태로 바꾸기 위해 끝까지 고민하는 점입니다. 반대로 아이디어가 떠오르면 기능이나 디자인을 더 다듬고 싶어져 개발 범위가 넓어지는 경우도 있었습니다. 그래서 최근에는 이 성향을 줄이기보다, AI와 함께 처음 목표를 먼저 정리하고 지금 필요한 기능과 나중에 해도 되는 개선을 나누며 작업하려고 하고 있습니다.',
  '',
  '개발자로서는 아직 더 배워야 할 부분이 많지만, 고객의 흐름을 관찰하고 문제를 끝까지 붙잡아온 경험을 웹앱 제작으로 이어가고 있습니다. 기회를 주신다면 주어진 기능을 단순히 구현하는 데서 멈추지 않고, 사용자가 왜 불편한지부터 살피며 실제로 도움이 되는 방향까지 고민하는 개발자가 되겠습니다.',
]);

const profileFacts = [
  ['이름', '최혁준'],
  ['방향', 'AI 개발 도구를 활용해 실제 문제를 구현하는 개발자'],
  ['학습', 'Java · Spring Boot · React · MySQL · Python'],
  ['도구', 'Claude Code · Codex · Gemini · OpenClaw'],
  ['경험', lines([
    '고객 응대 8년 이상',
    '일본 워킹홀리데이 1년 · 유학원 6개월',
    '일본어권 가족과 생활',
  ])],
];

function App() {
  const [activeId, setActiveId] = useState(projectDetails[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAnchor, setActiveAnchor] = useState('top');
  const detailRef = useRef(null);
  const sideIndexItems = [
    { id: 'career', label: '경력·연수·이수', group: true },
    { id: 'career-crm', label: 'CRM 경력' },
    { id: 'career-japan', label: '일본 연수' },
    { id: 'career-education', label: '교육 이수' },
    { id: 'self-intro', label: '자기소개', group: true },
    { id: 'works', label: '포트폴리오', group: true },
  ];
  const activeProject = useMemo(
    () => projectDetails.find((project) => project.id === activeId),
    [activeId],
  );
  useEffect(() => {
    const updateScrollState = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      const current = sideIndexItems.reduce((latest, item) => {
        const target = document.getElementById(item.id);
        if (!target) return latest;
        return target.getBoundingClientRect().top <= 170 ? item.id : latest;
      }, 'top');

      setScrollProgress(Math.min(1, Math.max(0, progress)));
      setActiveAnchor(current);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      window.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, []);
  const selectProject = (projectId) => {
    setActiveId(projectId);
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  return (
    <main className="pageShell">
      <nav
        className="sideIndex"
        style={{ '--scroll-progress': scrollProgress }}
        aria-label="스크롤 위치와 페이지 빠른 이동"
      >
        <div className="sideIndexRail" aria-hidden="true">
          <span />
        </div>
        {sideIndexItems.map((item) => (
          <a
            className={[
              item.group ? 'sideIndexGroup' : '',
              activeAnchor === item.id ? 'active' : '',
            ].filter(Boolean).join(' ')}
            href={`#${item.id}`}
            key={item.id}
          >
            <strong>{item.label}</strong>
          </a>
        ))}
      </nav>

      <section className="heroSection" id="top">
        <nav className="heroNav" aria-label="포트폴리오 섹션">
          <a href="#top">처음</a>
          <a href="#career">경력</a>
          <a href="#self-intro">소개</a>
          <a href="#works">작품</a>
        </nav>

        <div className="heroCopy">
          <h1>
            안녕하세요
            <br />
            <span>최혁준입니다.</span>
          </h1>
          <p className="heroLead">
            <span>풀스택 개발 교육으로 웹 개발의 기본 구조를 익힌 뒤,</span>
            <span>AI 개발 도구를 활용해</span>
            <span>실제 현장의 문제를 구현 가능한 서비스로 옮기고 있습니다.</span>
          </p>
          <div className="heroActions">
            <a href="#works">작품 보기</a>
          </div>
        </div>

        <aside className="codePanel" aria-label="개발자 프로필 요약">
          <div className="codeChrome">
            <span className="red" />
            <span className="yellow" />
            <span className="green" />
            <strong>프로필.js</strong>
          </div>
          <pre>
            <code>
              <span className="codeLine"><span className="token keyword">const</span> <span className="token variable">프로필</span> <span className="token operator">=</span> {'{'}</span>
              <span className="codeLine">  <span className="token property">이름</span>: <span className="token string">'최혁준'</span>,</span>
              <span className="codeLine">  <span className="token property">목표</span>: <span className="token string">'AI를 활용해 실제 문제를 구현하는 개발자'</span>,</span>
              <span className="codeLine">  <span className="token property">학습기술</span>: [</span>
              <span className="codeLine">    <span className="token string">'React'</span>, <span className="token string">'Spring Boot'</span>, <span className="token string">'Java'</span>,</span>
              <span className="codeLine">    <span className="token string">'MySQL'</span>, <span className="token string">'Firebase'</span></span>
              <span className="codeLine">  ],</span>
              <span className="codeLine">  <span className="token property">AI개발도구</span>: [</span>
              <span className="codeLine">    <span className="token string">'Claude Code'</span>, <span className="token string">'Codex'</span>, <span className="token string">'Gemini'</span>,</span>
              <span className="codeLine">    <span className="token string">'Antigravity'</span></span>
              <span className="codeLine">  ],</span>
              <span className="codeLine">  <span className="token property">작업환경</span>: [<span className="token string">'OpenClaw'</span>, <span className="token string">'Hermes'</span>],</span>
              <span className="codeLine">  <span className="token property">배포도구</span>: [<span className="token string">'Vercel'</span>],</span>
              <span className="codeLine">  <span className="token property">강점</span>: {'{'}</span>
              <span className="codeLine">    <span className="token property">사용자흐름관찰</span>: <span className="token boolean">true</span>, <span className="token property">반복업무개선</span>: <span className="token boolean">true</span>,</span>
              <span className="codeLine">    <span className="token property">실제데모구현</span>: <span className="token boolean">true</span></span>
              <span className="codeLine">  {'}'},</span>
              <span className="codeLine">  <span className="token property">포트폴리오프로젝트</span>: <span className="token number">4</span></span>
              <span className="codeLine">{'}'};</span>
            </code>
          </pre>
        </aside>
      </section>

      <section className="aboutSection" id="career">
        <div className="sectionTitle">
          <p className="eyebrow">경력 및 연수·교육 이수</p>
          <h2>현장에서 마주한 불편함을 개발로 풀어가고 있습니다</h2>
          <p>{lines([
            '고객을 응대하며 배운 니즈 파악과 풀스택 개발 교육에서 익힌 기본 구조를 바탕으로,',
            'Claude Code와 Codex 같은 AI 개발 도구를 활용해',
            '실제 프로젝트를 직접 구현하며 개발 경험을 쌓고 있습니다.',
          ])}</p>
        </div>
        <div className="experienceGrid">
          {experienceItems.map((item) => (
            <article className="infoCard experienceCard" id={item.id} key={item.label}>
              <span>{item.label}</span>
              <strong>{item.period}</strong>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

      </section>

      <section className="introSection" id="self-intro">
        <div className="sectionTitle">
          <p className="eyebrow">자기소개</p>
          <h2>작은 불편을 실제 흐름으로 바꾸는 개발자</h2>
        </div>

        <div className="introPage">
          <aside className="profileCard" aria-label="최혁준 기본 정보">
            <div className="profilePhotoFrame">
              <img src="/assets/profile.jpg" alt="최혁준 프로필 사진" />
            </div>
            <div className="profileIdentity">
              <strong>최혁준</strong>
              <span>Full-stack Web Developer</span>
            </div>
            <dl className="profileFacts">
              {profileFacts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <article className="letterPanel">
            <p className="resumeText">{resumeIntro}</p>
          </article>
        </div>
      </section>

      <section className="workSection" id="works">
        <div className="sectionTitle">
          <p className="eyebrow">주요 작업</p>
          <h2>포트폴리오 작품</h2>
          <p>메인은 가볍게 보여주고, 관심 있는 작품을 클릭하면 상세 설명과 데모 데이터가 열립니다.</p>
        </div>

        <div className="projectGrid" aria-label="프로젝트 네비게이터">
          {projectDetails.map((project) => (
            <button
              className={project.id === activeId ? 'projectCard active' : 'projectCard'}
              data-project-id={project.id}
              key={project.id}
              onClick={() => selectProject(project.id)}
              type="button"
            >
              <span>{project.type}</span>
              <strong>{project.navLabel || project.label}</strong>
              <em>{project.id === activeId ? '열림' : '이동'}</em>
            </button>
          ))}
        </div>

        <ProjectDetail project={activeProject} refTarget={detailRef} />
      </section>
    </main>
  );
}

function ProjectDetail({ project, refTarget }) {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const moveScreenshot = (direction) => {
    if (!selectedScreenshot) return;

    const total = project.screenshots.length;
    const nextIndex = (selectedScreenshot.index + direction + total) % total;
    const [title, caption, src] = project.screenshots[nextIndex];

    setSelectedScreenshot({ title, caption, src, index: nextIndex });
  };

  return (
    <article className="detailPanel showcaseStage" ref={refTarget}>
      <DetailSummary project={project} />
      <ProjectBrief project={project} />
      <ScreenshotGallery
        project={project}
        selectedScreenshot={selectedScreenshot}
        setSelectedScreenshot={setSelectedScreenshot}
      />

      {selectedScreenshot ? (
        <ScreenshotModal
          project={project}
          screenshot={selectedScreenshot}
          onClose={() => setSelectedScreenshot(null)}
          onNext={() => moveScreenshot(1)}
          onPrevious={() => moveScreenshot(-1)}
        />
      ) : null}
    </article>
  );
}

function ScreenshotGallery({ project, selectedScreenshot, setSelectedScreenshot }) {
  const hasImages = project.screenshots.some(([, , src]) => src);

  return (
    <section className="screenshotPanel" aria-label={`${project.label} 주요 화면`}>
      <div className="screenshotHead">
        <div>
          <p className="eyebrow">주요 화면</p>
          <h4>주요 화면 6장</h4>
        </div>
        <span>{hasImages ? '이미지 6장 적용' : '이미지 준비중'}</span>
      </div>
      <div className="screenshotGrid">
        {project.screenshots.map(([title, caption, src], index) => {
          const item = { title, caption, src, index };
          const isLegacyFrame = index === 0 || index === project.screenshots.length - 1;
          return (
            <button
              className={[
                'screenshotSlot',
                src ? 'hasImage' : '',
                isLegacyFrame ? 'legacyFrame' : '',
              ].filter(Boolean).join(' ')}
              key={`${project.id}-${title}`}
              onClick={() => setSelectedScreenshot(item)}
              type="button"
            >
              {src ? (
                <img alt={`${project.label} ${title}`} src={src} />
              ) : (
                <span className="screenshotPlaceholder">{String(index + 1).padStart(2, '0')}</span>
              )}
              <strong>{title}</strong>
              <p>{caption}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ProjectBrief({ project }) {
  const briefItems = [
    ['문제점', project.problem],
    ['구현한 것', project.solution],
  ];

  return (
    <section className="projectBrief" aria-label={`${project.label} 문제점과 구현한 것`}>
      {briefItems.map(([title, body]) => (
        <article className="briefCard" key={title}>
          <h4>{title}</h4>
          <ul>
            {body.split('\n').map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

function ScreenshotModal({ project, screenshot, onClose, onNext, onPrevious }) {
  const shouldFillFrame = screenshot.index > 0 && screenshot.index < 5;
  const isLegacyFrame = screenshot.index === 0 || screenshot.index === project.screenshots.length - 1;

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrevious();
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext();
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrevious]);

  return (
    <div className="screenshotModal" role="dialog" aria-modal="true" aria-label={`${screenshot.title} 크게 보기`}>
      <button className="screenshotBackdrop" onClick={onClose} type="button" aria-label="닫기" />
      <div className="screenshotModalStack">
        <div className="screenshotModalShell">
          <button className="modalNav modalNavPrevious" onClick={onPrevious} type="button" aria-label="이전 사진 보기">
            &lt;
          </button>
          <button className="modalNav modalNavNext" onClick={onNext} type="button" aria-label="다음 사진 보기">
            &gt;
          </button>
          <div className={['screenshotDialog', isLegacyFrame ? 'legacyModal' : ''].filter(Boolean).join(' ')}>
            <button className="modalClose" onClick={onClose} type="button">닫기</button>
            <div className="modalMedia">
              <div className={[
                'modalPreview',
                screenshot.src ? 'hasImage' : '',
                shouldFillFrame ? 'fillFrame' : '',
                isLegacyFrame ? 'legacyFrame' : '',
              ].filter(Boolean).join(' ')}>
                {screenshot.src ? (
                  <img alt={`${project.label} ${screenshot.title}`} src={screenshot.src} />
                ) : (
                  <span>{String(screenshot.index + 1).padStart(2, '0')}</span>
                )}
              </div>
            </div>
            <div className="modalCaption">
              <p className="eyebrow">{project.label}</p>
              <h4>{screenshot.title}</h4>
              <p>{screenshot.caption}</p>
            </div>
          </div>
        </div>
        <p className="modalHintCapsule">키보드 ← · → 로도 이동할 수 있습니다.</p>
      </div>
    </div>
  );
}

function DetailSummary({ project }) {
  return (
    <div className="detailHead">
      <div>
        <p className="eyebrow">{project.type}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
