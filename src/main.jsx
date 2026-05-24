import React, { useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const mainDeployOrigin = '';

const projectDetails = [
  {
    id: 'caredoc',
    label: 'CareDoc',
    type: 'Welfare Docs',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/caredoc/?portfolio=1&v=20260524-0928',
    demoLabel: 'CareDoc 실제 클론',
    title: '복지시설 서류 작성 흐름을 줄이는 문서 도구',
    summary: '이용자 정보를 한 번 입력하면 문서, 문구, 가족관계도, PDF 출력까지 이어지게 만든 업무형 앱입니다.',
    stack: ['React', 'PDF', 'SVG', '업무 자동화'],
    problem: '일본 복지시설 서류 업무에서 같은 정보를 여러 번 적고, 가족관계도를 워드 도형으로 직접 그리는 반복 작업이 있었습니다.',
    solution: '이용자 기본정보, 자주 쓰는 문구, 가족관계도 SVG 렌더링, PDF 출력을 한 흐름으로 묶어 작성 부담을 줄였습니다.',
    detail: ['이용자 정보가 여러 문서에 자동 반영', '자주 쓰는 표현을 선택형 문구로 정리', '가족관계도를 SVG로 자동 렌더링', '출력물 기준으로 PDF 생성'],
    demo: [
      ['이용자', '야마다 하나코 / 82세 / 요양 3등급'],
      ['문서 흐름', '회의록, 모니터링, 지원계획서 자동 반영'],
      ['출력', '가족관계도 SVG + PDF 준비 완료'],
    ],
  },
  {
    id: 'fixchecker',
    label: 'Fix Checker',
    type: 'AI Workflow',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/subtitle-fix-checker/',
    demoLabel: 'Subtitle Fix Checker 실제 클론',
    title: '자막 검수 판단을 AI 수정 지시서로 바꾸는 도구',
    summary: '영상 자막을 보며 틀린 구간만 체크하고, JSON 작업지시서로 후속 AI 수정까지 이어지게 만든 앱입니다.',
    stack: ['React', 'JSON', 'Video Demo', 'AI Workflow'],
    problem: '자막 검수는 사람이 판단한 내용이 흩어지면 후속 수정 지시로 다시 정리하는 시간이 듭니다.',
    solution: '오류 구간, 시간, 원문, 수정 요청을 구조화해서 AI가 바로 읽을 수 있는 JSON으로 출력합니다.',
    detail: ['10초 데모 영상 삽입 가능', '오류 구간과 수정 요청을 행 단위로 기록', 'JSON 작업지시서 생성', '로그인 없이 바로 체험'],
    demo: [
      ['00:03.2', '표현이 딱딱함 -> 자연스럽게 수정'],
      ['00:06.8', '문장 호흡이 김 -> 두 문장으로 분리'],
      ['출력', 'errors.json 작업지시서 생성'],
    ],
  },
  {
    id: 'unitime',
    label: 'Unitime',
    type: 'Schedule Ops',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/unitime/',
    demoLabel: 'Unitime 실제 클론',
    title: '팀 일정과 교육 일정을 한눈에 보는 운영 캘린더',
    summary: '반복 일정과 참여자를 월간 화면에서 빠르게 확인하는 일정 관리 서비스입니다.',
    stack: ['React', 'Calendar UI', 'Firebase', '운영 관리'],
    problem: '교육 일정, 팀 일정, 참여자 상태가 흩어져 있으면 운영자가 매번 다시 확인해야 합니다.',
    solution: '월간 캘린더, 카테고리, 참여자, 메모를 한 화면에 모아 일정 흐름을 빠르게 파악하도록 구성했습니다.',
    detail: ['월간 일정 흐름 확인', '카테고리별 일정 구분', '참여자/메모 기반 운영 정보 정리', '데모 데이터로 로그인 없이 확인'],
    demo: [
      ['오늘', '09:30 부산 교육센터 오리엔테이션'],
      ['이번 주', 'RAG 실습, 팀 프로젝트, 코드 리뷰'],
      ['메모', '제출 전 참석자 명단 재확인'],
    ],
  },
  {
    id: 'lucid',
    label: 'Lucid',
    type: 'Learning Admin',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/lucid/',
    demoLabel: 'Lucid 관리자 데모',
    title: '관리자 화면까지 바로 보여주는 학습 운영 서비스',
    summary: '로그인이 필요한 원본 흐름은 보호하고, 쇼케이스에서는 관리자 데모 세션으로 핵심 화면을 보여줍니다.',
    stack: ['React', 'Admin UI', 'Demo Session', 'Data Table'],
    problem: '채용 담당자가 포트폴리오를 볼 때 회원가입이나 로그인 단계가 있으면 핵심 화면까지 도달하기 어렵습니다.',
    solution: '원본 로그인 코드는 건드리지 않고, 포트폴리오용 클론에서 admin-demo 데이터로 바로 진입하는 구조를 둡니다.',
    detail: ['관리자 데모 세션으로 자동 진입', '학습 리포트와 과제 상태 노출', '원본 인증 로직과 분리', '데모 데이터만 사용'],
    demo: [
      ['세션', 'admin-demo 자동 진입'],
      ['리포트', '출석률 94% / 과제 제출 18건'],
      ['데이터', '학생 명단과 수업 데이터 미리 로드'],
    ],
  },
  {
    id: 'reallife',
    label: 'RealLife',
    type: 'Simulation Game',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/reallife/',
    demoLabel: 'RealLife 실제 클론',
    title: '로그인 없이 바로 플레이하는 생활 시뮬레이션 게임',
    summary: '선택지, 상태 변화, 결과 흐름이 즉시 보이는 게임형 프로젝트입니다.',
    stack: ['React', 'Game UI', 'State Flow', 'UX'],
    problem: '게임형 프로젝트는 설명보다 직접 선택하고 결과를 보는 편이 구현력을 더 빠르게 전달합니다.',
    solution: '포트폴리오 안에서 바로 플레이 가능한 데모를 두고, 선택에 따른 상태 변화를 보여줍니다.',
    detail: ['캐릭터 선택과 턴 진행', '체력/현금/집중도 변화', '선택 결과 피드백', '설치나 로그인 없이 체험'],
    demo: [
      ['1턴', '알바 제안 수락 / 체력 -8 / 현금 +70,000'],
      ['2턴', '자격증 공부 / 집중도 +12 / 시간 -3'],
      ['결과', '생활비와 성장 선택지를 비교'],
    ],
  },
];

const mobileShowcases = {
  caredoc: {
    headline: '입력 한 번으로 문서와 PDF까지',
    benefit: '이용자 기본정보를 넣으면 문서, 가족관계도, 출력 흐름까지 이어지는 업무형 모바일 장면입니다.',
    sceneLabel: '문서 작성 흐름',
    proof: '3개 문서 자동 반영',
    steps: [
      ['01', '기본정보 입력', '이름, 등급, 담당자 정보를 한 화면에서 정리'],
      ['02', '문서 반영 확인', '회의록과 지원계획서에 같은 정보 자동 연결'],
      ['03', '미리보기 출력', '가족관계도와 PDF 출력 상태까지 확인'],
    ],
    screen: {
      type: 'caredoc',
      user: '야마다 하나코',
      fields: [
        ['요양등급', '3등급'],
        ['담당자', '사토 켄'],
        ['작성상태', '미리보기 준비'],
      ],
      docs: ['기본정보', '회의록', '지원계획서'],
      action: 'PDF 출력 준비 완료',
    },
  },
  fixchecker: {
    headline: '검수 판단을 AI 수정 지시서로 변환',
    benefit: '영상 확인, 오류 체크, JSON 출력까지 모바일에서도 흐름이 바로 보이도록 재구성합니다.',
    sceneLabel: '검수 플로우',
    proof: '오류 2건 선택됨',
    steps: [
      ['01', '영상 확인', '문제가 보이는 구간을 먼저 확인'],
      ['02', '오류 체크', '시간, 문제, 수정 요청을 카드로 정리'],
      ['03', 'JSON 출력', '후속 AI가 읽을 작업지시서 생성'],
    ],
    screen: {
      type: 'fixchecker',
      videoTime: '00:03.2',
      errors: [
        ['00:03.2', '표현이 딱딱함', '자연스럽게 수정'],
        ['00:06.8', '문장 호흡이 김', '두 문장으로 분리'],
      ],
      json: '{ errors: 2, ready: true }',
    },
  },
  unitime: {
    headline: '오늘 해야 할 일부터 보이는 일정 운영',
    benefit: '월간 캘린더 전체 대신 오늘 일정, 이번 주 흐름, 상세 메모를 모바일 카드로 보여줍니다.',
    sceneLabel: '일정 운영 화면',
    proof: '오늘 일정 3건',
    steps: [
      ['01', '오늘 일정 확인', '지금 처리할 일정을 첫 카드로 표시'],
      ['02', '이번 주 흐름', '교육, 실습, 리뷰 일정을 세로 리스트로 확인'],
      ['03', '상세 메모', '운영자가 놓치면 안 되는 준비물을 기록'],
    ],
    screen: {
      type: 'unitime',
      today: ['09:30', '부산 교육센터 오리엔테이션', '참석자 명단 확인'],
      week: [
        ['월', 'RAG 실습'],
        ['수', '팀 프로젝트'],
        ['금', '코드 리뷰'],
      ],
      memo: '제출 전 참석자 명단과 자료 링크 재확인',
    },
  },
  lucid: {
    headline: '학습 운영 상태를 카드로 빠르게 파악',
    benefit: '관리자 테이블 전체가 아니라 학생, 수업, 과제 상태의 핵심 지표만 모바일에 맞게 보여줍니다.',
    sceneLabel: '관리자 요약',
    proof: '출석률 94%',
    steps: [
      ['01', '학생 현황', '출석과 과제 상태를 숫자로 먼저 확인'],
      ['02', '수업 리포트', '운영자가 봐야 할 수업 흐름을 요약'],
      ['03', '과제 상태', '지연된 과제와 확인 대상을 바로 표시'],
    ],
    screen: {
      type: 'lucid',
      kpis: [
        ['출석률', '94%'],
        ['과제', '18건'],
        ['알림', '3건'],
      ],
      report: '이번 주 과제 제출률 상승, 지연 학생 2명 확인 필요',
      tasks: ['React 과제 확인', '상담 필요 학생 표시', '수업 리포트 전송'],
    },
  },
  reallife: {
    headline: '상태 변화가 바로 보이는 모바일 게임 흐름',
    benefit: '큰 게임판을 줄이지 않고 상태바, 이벤트, 선택 버튼, 결과 변화를 모바일 게임 화면처럼 보여줍니다.',
    sceneLabel: '턴 선택 화면',
    proof: '현금 +70,000',
    steps: [
      ['01', '상태 확인', '체력, 현금, 집중도를 상단에서 확인'],
      ['02', '이벤트 선택', '현재 턴의 상황과 선택지를 카드로 표시'],
      ['03', '결과 반영', '선택 후 수치 변화가 즉시 보임'],
    ],
    screen: {
      type: 'reallife',
      stats: [
        ['체력', '72'],
        ['현금', '120K'],
        ['집중', '48'],
      ],
      event: '주말 단기 알바 제안이 들어왔습니다.',
      choices: ['수락하기', '공부하기', '휴식하기'],
      result: '체력 -8 / 현금 +70,000',
    },
  },
};

const introCards = [
  ['경력', '총 8년 8개월', '고객 응대와 현장 불편 관찰 경험'],
  ['교육', 'RAG AI 기반 풀스택 과정', 'Java, Spring Boot, React, MySQL, Python'],
  ['강점', '사용자 흐름 개선', '반복되는 불편을 실제 웹앱으로 전환'],
];

function App() {
  const [activeId, setActiveId] = useState(projectDetails[0].id);
  const detailRef = useRef(null);
  const activeProject = useMemo(
    () => projectDetails.find((project) => project.id === activeId),
    [activeId],
  );
  const selectProject = (projectId) => {
    setActiveId(projectId);
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
  };

  return (
    <main className="pageShell">
      <section className="heroSection" id="top">
        <nav className="heroNav" aria-label="포트폴리오 섹션">
          <a href="#top">처음</a>
          <a href="#about">소개</a>
          <a href="#works">작품</a>
          <a href="#contact">연락</a>
        </nav>

        <div className="heroCopy">
          <span className="welcomePill">최혁준 포트폴리오</span>
          <h1>
            Hello
            <br />
            I'm <span>최혁준</span>
          </h1>
          <p className="heroLead">
            <span>반복되는 불편을 지나치지 않고,</span>
            <span>고객 응대 현장에서 본 흐름을</span>
            <span>실제로 체험 가능한 웹앱으로 바꾸는 개발자입니다.</span>
          </p>
          <div className="heroActions">
            <a href="#works">작품 보기</a>
            <a href="#contact">연락하기</a>
          </div>
        </div>

        <aside className="codePanel" aria-label="개발자 프로필 코드 미리보기">
          <div className="codeChrome">
            <span className="red" />
            <span className="yellow" />
            <span className="green" />
            <strong>developer.js</strong>
          </div>
          <pre>{`const profile = {
  name: 'Choi Hyeokjun',
  title: 'Full-stack Web Developer',
  skills: [
    'React', 'Spring Boot', 'Java',
    'MySQL', 'Firebase', 'AI Workflow'
  ],
  strengths: {
    observesUserFlow: true,
    solvesRepeatedWork: true,
    buildsDemoFirst: true
  },
  projects: 5,
  hireable: function () {
    return this.observesUserFlow
      && this.solvesRepeatedWork
      && this.projects >= 5;
  }
};`}</pre>
        </aside>
      </section>

      <section className="aboutSection" id="about">
        <div className="sectionTitle">
          <p className="eyebrow">Cover Letter</p>
          <h2>자기소개서 요약</h2>
        </div>
        <div className="aboutGrid">
          {introCards.map(([title, value, body]) => (
            <article className="infoCard" key={title}>
              <span>{title}</span>
              <strong>{value}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <article className="letterPanel">
          <h3>지나치기 쉬운 비효율을 발견하는 개발자</h3>
          <p>
            반복되는 불편함을 그냥 넘기지 않고, 같은 작업을 줄일 방법을 먼저 고민합니다. 교육과정에서는
            Java, Spring Boot, React, MySQL, Python을 학습했고, 이후에는 CareDoc과 Subtitle Fix Checker처럼
            실제 현장의 문제를 웹앱으로 바꾸는 경험을 이어가고 있습니다.
          </p>
        </article>
      </section>

      <section className="workSection" id="works">
        <div className="sectionTitle">
          <p className="eyebrow">Selected Works</p>
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
              <strong>{project.label}</strong>
              <em>{project.id === activeId ? '열림' : '이동'}</em>
            </button>
          ))}
        </div>

        <ProjectDetail project={activeProject} refTarget={detailRef} />
      </section>

      <section className="contactSection" id="contact">
        <div className="sectionTitle">
          <p className="eyebrow">Contact</p>
          <h2>연락처 탭</h2>
        </div>
        <div className="contactGrid">
          <article>
            <span>제출용</span>
            <strong>사람인 이력서와 함께 제출</strong>
            <p>이력서, 자기소개서, 프로젝트 상세, 배포 링크를 한 사이트에서 확인할 수 있게 구성합니다.</p>
          </article>
          <article>
            <span>핵심 스택</span>
            <strong>React / Spring Boot / Firebase / MySQL / AI Workflow</strong>
            <p>각 작품 상세에서 어떤 문제를 어떤 방식으로 해결했는지 연결해서 보여줍니다.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

function ProjectDetail({ project, refTarget }) {
  return (
    <article className="detailPanel showcaseStage" ref={refTarget}>
      <MobileShowcase project={project} />
      <ProjectLiveFrame project={project} />
      <DetailSummary project={project} />

      <div className="detailBody compactDetailBody">
        <section>
          <h4>문제</h4>
          <p>{project.problem}</p>
        </section>
        <section>
          <h4>해결</h4>
          <p>{project.solution}</p>
        </section>
      </div>

      <div className="detailGrid">
        <div className="featureList">
          {project.detail.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </div>
        <div className="demoTable">
          {project.demo.map(([label, value]) => (
            <div className="demoRow" key={label}>
              <strong>{label}</strong>
              <span>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {['unitime', 'fixchecker', 'reallife'].includes(project.id) && (
        <DemoPlayground projectId={project.id} />
      )}
    </article>
  );
}

function MobileShowcase({ project }) {
  const demoUrl = `${project.demoOrigin}${project.demoPath}`;
  const mobile = mobileShowcases[project.id];

  return (
    <section className={`mobileShowcase mobileShowcase-${project.id}`} data-mobile-showcase>
      <div className="mobileShowcaseHeader">
        <div>
          <p className="eyebrow">{mobile.sceneLabel}</p>
          <h4>{project.label}</h4>
        </div>
        <span>{mobile.proof}</span>
      </div>
      <p className="mobileHeadline">{mobile.headline}</p>
      <p className="mobileBenefit">{mobile.benefit}</p>

      <div className="phoneMock" aria-label={`${project.label} 모바일 쇼케이스 화면`}>
        <div className="phoneStatus">
          <span>9:41</span>
          <strong>{project.label}</strong>
          <span>100%</span>
        </div>
        <MobileScreen screen={mobile.screen} />
      </div>

      <div className="mobileSteps" aria-label={`${project.label} 모바일 사용자 여정`}>
        {mobile.steps.map(([number, title, body]) => (
          <div className="mobileStep" key={number}>
            <span>{number}</span>
            <div>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          </div>
        ))}
      </div>

      <a className="mobileDemoButton" href={demoUrl} target="_blank" rel="noreferrer">
        실제 데모 열기
      </a>
    </section>
  );
}

function MobileScreen({ screen }) {
  if (screen.type === 'caredoc') {
    return (
      <div className="mobileScreen caredocScreen">
        <div className="screenTitle">
          <span>이용자 기본정보</span>
          <strong>{screen.user}</strong>
        </div>
        <div className="mobileFieldList">
          {screen.fields.map(([label, value]) => (
            <div className="mobileField" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="docChipRow">
          {screen.docs.map((doc) => <span key={doc}>{doc}</span>)}
        </div>
        <div className="mobileActionCard">{screen.action}</div>
      </div>
    );
  }

  if (screen.type === 'unitime') {
    return (
      <div className="mobileScreen unitimeScreen">
        <div className="todayCard">
          <span>{screen.today[0]}</span>
          <strong>{screen.today[1]}</strong>
          <p>{screen.today[2]}</p>
        </div>
        <div className="weekList">
          {screen.week.map(([day, title]) => (
            <div key={day}>
              <span>{day}</span>
              <strong>{title}</strong>
            </div>
          ))}
        </div>
        <div className="memoCard">{screen.memo}</div>
      </div>
    );
  }

  if (screen.type === 'fixchecker') {
    return (
      <div className="mobileScreen fixScreen">
        <div className="videoCard">
          <span>{screen.videoTime}</span>
          <strong>영상 구간 확인</strong>
        </div>
        <div className="mobileErrorCards">
          {screen.errors.map(([time, issue, request]) => (
            <div key={time}>
              <span>{time}</span>
              <strong>{issue}</strong>
              <p>{request}</p>
            </div>
          ))}
        </div>
        <pre>{screen.json}</pre>
      </div>
    );
  }

  if (screen.type === 'lucid') {
    return (
      <div className="mobileScreen lucidScreen">
        <div className="kpiGrid">
          {screen.kpis.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="reportCard">{screen.report}</div>
        <div className="taskList">
          {screen.tasks.map((task) => <span key={task}>{task}</span>)}
        </div>
      </div>
    );
  }

  return (
    <div className="mobileScreen reallifeScreen">
      <div className="lifeStatRow">
        {screen.stats.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="eventCard">
        <span>현재 이벤트</span>
        <strong>{screen.event}</strong>
      </div>
      <div className="choiceStack">
        {screen.choices.map((choice) => <button key={choice} type="button">{choice}</button>)}
      </div>
      <div className="resultPill">{screen.result}</div>
    </div>
  );
}

function ProjectLiveFrame({ project }) {
  const demoUrl = `${project.demoOrigin}${project.demoPath}`;

  return (
    <section className="liveFramePanel">
      <div className="liveFrameHead">
        <div>
          <p className="eyebrow">Live Preview</p>
          <h4>{project.demoLabel}</h4>
        </div>
        <a href={demoUrl} target="_blank" rel="noreferrer">새 창</a>
      </div>
      <div className="browserFrame" aria-label={`${project.label} 실제 클론 미리보기`}>
        <div className="browserFrameBar">
          <span className="windowDot redDot" />
          <span className="windowDot yellowDot" />
          <span className="windowDot greenDot" />
          <strong>{project.label}</strong>
          <em>{demoUrl}</em>
        </div>
        <div className="browserViewport">
          <iframe
            src={demoUrl}
            title={`${project.label} 실제 클론`}
          />
        </div>
      </div>
    </section>
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
      <div className="stackList">
        {project.stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </div>
  );
}

function DemoPlayground({ projectId }) {
  const [selectedEvent, setSelectedEvent] = useState('orientation');
  const [checkedErrors, setCheckedErrors] = useState(['tone']);
  const [lifeStats, setLifeStats] = useState({ turn: 1, hp: 72, cash: 120000, focus: 48, log: '오늘 할 일을 선택해보세요.' });

  const scheduleMap = {
    orientation: ['09:30', '부산 교육센터 오리엔테이션', '참석자 명단 확인 후 안내 메시지 발송'],
    rag: ['13:00', 'RAG 실습', '실습 자료와 API 키 준비 상태 점검'],
    review: ['16:30', '팀 프로젝트 코드 리뷰', 'PR별 피드백과 다음 작업자 기록'],
  };

  const errorItems = [
    { id: 'tone', time: '00:03.2', from: '표현이 딱딱함', to: '고객 응대 톤으로 자연스럽게 수정' },
    { id: 'breath', time: '00:06.8', from: '문장 호흡이 김', to: '두 문장으로 분리' },
    { id: 'term', time: '00:08.4', from: '용어가 불명확함', to: '서비스 화면 기준 용어로 통일' },
  ];

  const selectedErrors = errorItems.filter((item) => checkedErrors.includes(item.id));

  const playLife = (type) => {
    const next = {
      work: { hp: -8, cash: 70000, focus: -4, log: '알바를 수락했습니다. 현금은 늘었지만 체력이 줄었습니다.' },
      study: { hp: -5, cash: 0, focus: 12, log: '자격증 공부를 했습니다. 집중도가 올라갔습니다.' },
      rest: { hp: 14, cash: -12000, focus: 5, log: '휴식을 선택했습니다. 컨디션을 회복했습니다.' },
    }[type];

    setLifeStats((stats) => ({
      turn: stats.turn + 1,
      hp: Math.max(0, Math.min(100, stats.hp + next.hp)),
      cash: Math.max(0, stats.cash + next.cash),
      focus: Math.max(0, Math.min(100, stats.focus + next.focus)),
      log: next.log,
    }));
  };

  if (projectId === 'unitime') {
    const event = scheduleMap[selectedEvent];

    return (
      <section className="playgroundPanel">
        <div className="playgroundHead">
          <p className="eyebrow">Live Demo</p>
          <h4>일정 클릭 미리보기</h4>
        </div>
        <div className="scheduleButtons">
          {Object.entries(scheduleMap).map(([id, item]) => (
            <button className={selectedEvent === id ? 'active' : ''} key={id} onClick={() => setSelectedEvent(id)} type="button">
              <span>{item[0]}</span>
              {item[1]}
            </button>
          ))}
        </div>
        <div className="previewDoc">
          <strong>{event[0]} · {event[1]}</strong>
          <p>{event[2]}</p>
        </div>
      </section>
    );
  }

  if (projectId === 'fixchecker') {
    return (
      <section className="playgroundPanel">
        <div className="playgroundHead">
          <p className="eyebrow">Live Demo</p>
          <h4>자막 오류 체크 후 JSON 생성</h4>
        </div>
        <div className="errorList">
          {errorItems.map((item) => (
            <label key={item.id}>
              <input
                checked={checkedErrors.includes(item.id)}
                onChange={(event) => {
                  setCheckedErrors((current) => (
                    event.target.checked
                      ? [...current, item.id]
                      : current.filter((id) => id !== item.id)
                  ));
                }}
                type="checkbox"
              />
              <span>{item.time}</span>
              {item.from}
            </label>
          ))}
        </div>
        <pre className="jsonPreview">{JSON.stringify({ errors: selectedErrors.map(({ time, from, to }) => ({ time, issue: from, request: to })) }, null, 2)}</pre>
      </section>
    );
  }

  if (projectId === 'reallife') {
    return (
      <section className="playgroundPanel">
        <div className="playgroundHead">
          <p className="eyebrow">Live Demo</p>
          <h4>선택지에 따른 상태 변화</h4>
        </div>
        <div className="statGrid">
          <span>턴 {lifeStats.turn}</span>
          <span>체력 {lifeStats.hp}</span>
          <span>현금 {lifeStats.cash.toLocaleString()}원</span>
          <span>집중도 {lifeStats.focus}</span>
        </div>
        <div className="choiceRow">
          <button onClick={() => playLife('work')} type="button">알바 수락</button>
          <button onClick={() => playLife('study')} type="button">자격증 공부</button>
          <button onClick={() => playLife('rest')} type="button">휴식</button>
        </div>
        <p className="resultText">{lifeStats.log}</p>
      </section>
    );
  }

  return (
    <section className="playgroundPanel lockedDemo">
      <div className="playgroundHead">
        <p className="eyebrow">Demo Later</p>
        <h4>로그인이 필요한 프로젝트</h4>
      </div>
      <p>이 프로젝트는 로그인/관리자 권한 흐름이 있어, 원본 인증을 건드리지 않는 별도 데모 세션으로 나중에 분리합니다.</p>
    </section>
  );
}

createRoot(document.getElementById('root')).render(<App />);
