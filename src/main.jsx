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
      ['기존 서류 분석', lines([
        '복잡한 워드 서류에서 반복 입력과',
        '수기 작성 병목을 확인했습니다.',
      ]), '/project-shots/caredoc/01.jpg'],
      ['서류 입력 흐름 재구성', lines([
        '여러 문서에 흩어진 입력 항목을 정리해',
        '한 번 입력한 정보가 이어지도록 구성했습니다.',
      ]), '/project-shots/caredoc/02.jpg'],
      ['반복 문구 입력 개선', lines([
        '자주 쓰는 표현을 버튼과 단축키로 선택해',
        '반복 입력 부담을 줄였습니다.',
      ]), '/project-shots/caredoc/03.jpg'],
      ['업무 화면 단순화', lines([
        '사용자가 순서대로 따라가면 작성이 끝나도록',
        '입력 흐름을 단순하게 정리했습니다.',
      ]), '/project-shots/caredoc/04.jpg'],
      ['가족관계도 자동 렌더링', lines([
        '워드 도형으로 직접 만들던 가족관계도를',
        '입력값 기반 SVG로 자동 생성했습니다.',
      ]), '/project-shots/caredoc/05.jpg'],
      ['PDF 출력 흐름 구성', lines([
        '작성 내용을 최종 확인한 뒤',
        '제출용 PDF로 이어지도록 구성했습니다.',
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
      ['영상 입력', '검수할 영상을 올리거나 확인하는 화면', '/project-shots/fixchecker/01.png'],
      ['구간 체크', '오류 시간과 내용을 행 단위로 기록하는 화면', '/project-shots/fixchecker/02.png'],
      ['수정 요청', '어떻게 바꿀지 지시를 적는 화면', '/project-shots/fixchecker/03.png'],
      ['JSON 출력', 'AI가 읽을 작업지시서를 생성하는 화면', '/project-shots/fixchecker/04.png'],
      ['오류 목록', '선택된 오류를 한 번에 검토하는 화면', '/project-shots/fixchecker/05.png'],
      ['결과 확인', '후속 수정에 넘길 내용을 확인하는 화면', '/project-shots/fixchecker/06.png'],
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
      ['학습 홈', '복습할 수업 자료와 학습 흐름을 확인하는 화면', '/project-shots/lucid/01.jpg'],
      ['코드 에디터', 'Monaco Editor로 코드와 학습 자료를 확인하는 화면', '/project-shots/lucid/02.jpg'],
      ['문제 출제', 'AI API를 활용해 학습 내용 기반 문제를 만드는 화면', '/project-shots/lucid/03.jpg'],
      ['정답 체크', '사용자 답안을 확인하고 피드백하는 화면', '/project-shots/lucid/04.jpg'],
      ['학습자료 출력', '복습에 필요한 자료를 다시 정리해 출력하는 화면', '/project-shots/lucid/05.jpg'],
      ['데모 세션', '로그인 없이 핵심 학습 흐름을 확인하는 화면', '/project-shots/lucid/06.jpg'],
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
      ['권리증 화면', '임대료와 보유 자산 정보를 직관적으로 보여줍니다.', '/project-shots/reallife/01.jpg'],
      ['타인의 땅을 밟았을 때', '사회자 멘트와 애니메이션으로 통행료 상황을 보여줍니다.', '/project-shots/reallife/02.jpg'],
      ['차례 안내', '턴이 넘어오면 차례 안내가 나갑니다.', '/project-shots/reallife/03.jpg'],
      ['정산 연출', '누가 누구의 땅을 밟았는지 한 화면에서 확인합니다.', '/project-shots/reallife/04.jpg'],
      ['매입 선택', lines([
        '부동산 도착 시 매입과 스킵을 선택합니다.',
        '매입하면 보유 현금이 바로 줄어드는',
        '정산 액션이 표시됩니다.',
      ]), '/project-shots/reallife/05.jpg'],
      ['대출 기능', lines([
        '조건에 맞으면 담보대출과 신용대출을 선택할 수 있습니다.',
        '대출 이후에는 매 턴 이자를 지급해야 하므로',
        '현금 흐름 확인이 중요합니다.',
      ]), '/project-shots/reallife/06.jpg'],
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
  '저는 반복되는 불편함을 그냥 넘기지 못하는 편입니다. 같은 작업을 여러 번 반복하는 상황에서 손을 더 빠르게 움직이기보다, 먼저 이 과정을 줄일 방법을 고민했습니다. 좌표 기반 매크로로 여러 단계의 작업을 원키로 줄여본 경험도 그때 시작됐고, 이후 개발을 배우며 이 관심을 웹앱 제작으로 이어가고 있습니다.',
  '',
  '고객응대 업무를 8년 이상 경험하며 사용자가 실제로 어디에서 불편을 느끼고, 업무자가 어떤 확인과 입력을 반복하는지 가까이서 봐왔습니다. RAG·AI 기반 풀스택 개발자 양성과정에서는 Java, Spring Boot, React, MySQL, Python을 학습했고, 팀 프로젝트에서는 레시피 추천 서비스의 데이터 정규화 문제를 맡았습니다.',
  '',
  '교육 이후에는 실제 업무의 반복 지점을 줄이는 프로젝트를 만들고 있습니다. CareDoc은 일본 복지시설의 서류 작성 과정에서 반복 입력, 가족관계도 작성, PDF 출력 과정을 하나의 웹 흐름으로 정리한 프로젝트입니다. Subtitle Fix Checker는 자막 검수 중 사람이 판단한 오류를 JSON 작업지시서로 정리해 AI 후속 수정에 연결하는 도구입니다.',
  '',
  '저는 Claude Code와 Codex 같은 AI 도구를 단순 코드 생성용이 아니라, 문제를 기능 단위로 나누고 반복 작업을 줄이는 방식으로 활용하고 있습니다. 입사 후에도 사내 업무 병목을 관찰하고, AI와 웹 기술로 실제로 도움이 되는 자동화 도구를 만드는 개발자가 되고 싶습니다.',
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
