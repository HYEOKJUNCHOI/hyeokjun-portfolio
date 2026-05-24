import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const mainDeployOrigin = '';

const projectDetails = [
  {
    id: 'caredoc',
    label: 'CareDoc',
    type: 'Welfare Docs',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/caredoc/index.html?portfolio=1&v=20260525-0025',
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
    screenshots: [
      ['실제로 사용하던 워드 서류 화면', '일본 장애인복지시설에서 실제로 사용하던 서류 화면입니다. 직원 평균연령은 50대 후반이며, 이 서류는 연령과 관계없이 다루기 어려울 만큼 입력 항목과 문서 구조가 복잡했습니다. 같은 정보를 여러 문서에 반복 작성해야 해 업무 부담이 컸습니다.', '/project-shots/caredoc/01.jpg'],
      ['웹으로 옮긴 워드와 엑셀 파일들', '복잡한 워드와 엑셀 파일에서 반복 입력하던 내용을 추려 일괄 적용되도록 만들었습니다. 직원이 순서에 따라 입력하면 서류가 완성되도록 4개 파일의 업무 흐름을 웹으로 재구성했습니다.', '/project-shots/caredoc/02.jpg'],
      ['반복 입력을 줄인 키보드 단축키', '문서 반복 입력을 줄인 뒤에도 업무 흐름상 비슷한 문장을 자주 입력하는 문제가 남아 있었습니다. 이를 발견하고 고령의 직원도 쉽게 사용할 수 있도록 키보드 단축키 기능을 추가했습니다.', '/project-shots/caredoc/03.jpg'],
      ['서류 작성 과정을 단순화한 화면', '처음에는 기능을 많이 붙였지만, 실제 사용자의 연령대와 업무 환경을 고려해 과도한 기능보다 단순한 흐름과 접근성을 우선했습니다. 필요한 순서대로 따라가면 작성이 끝나도록 구성했습니다.', '/project-shots/caredoc/04.jpg'],
      ['자동 SVG로 그려지는 제노그램', '문제의 제노그램, 즉 가족관계도는 실제 워드에서 도형을 이용해 직접 만들어야 했습니다. 웹에서는 가족관계만 입력하면 자동 SVG 렌더링으로 관계도가 그려지도록 만들었습니다.', '/project-shots/caredoc/05.jpg'],
      ['출력 전 최종 확인 및 PDF 준비', '입력된 정보와 작성된 문서를 출력 가능한 형태로 정리하는 단계입니다. 복잡한 워드 작업을 웹앱 안에서 마무리하고, 제출용 문서로 이어질 수 있게 만든 결과 화면입니다.', '/project-shots/caredoc/06.jpg'],
    ],
  },
  {
    id: 'fixchecker',
    label: 'Fix Checker',
    type: 'AI Workflow',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/subtitle-fix-checker/',
    title: '자막 검수 판단을 AI 수정 지시서로 바꾸는 도구',
    summary: '자막을 보며 틀린 구간만 체크하고, JSON 작업지시서로 후속 AI 수정까지 이어지게 만든 앱입니다.',
    stack: ['React', 'JSON', '검수 플로우', 'AI Workflow'],
    problem: '자막 검수는 사람이 판단한 내용이 흩어지면 후속 수정 지시로 다시 정리하는 시간이 듭니다.',
    solution: '오류 구간, 시간, 원문, 수정 요청을 구조화해서 AI가 바로 읽을 수 있는 JSON으로 출력합니다.',
    detail: ['오류 구간과 수정 요청을 행 단위로 기록', '검수 판단을 JSON 작업지시서로 변환', '후속 AI 수정 요청에 바로 연결', '로그인 없이 흐름 확인'],
    demo: [
      ['00:03.2', '표현이 딱딱함 -> 자연스럽게 수정'],
      ['00:06.8', '문장 호흡이 김 -> 두 문장으로 분리'],
      ['출력', 'errors.json 작업지시서 생성'],
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
    type: 'Learning Admin',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/lucid/',
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
    screenshots: [
      ['관리자 홈', '학습 운영 상태를 처음 확인하는 화면'],
      ['학생 관리', '학생 목록과 상태를 관리하는 화면'],
      ['수업 리포트', '출석률과 과제 현황을 보는 화면'],
      ['과제 상태', '제출/미제출 흐름을 확인하는 화면'],
      ['알림 관리', '운영자가 확인할 알림을 모아보는 화면'],
      ['데모 세션', '로그인 없이 관리자 화면을 체험하는 화면'],
    ],
  },
  {
    id: 'reallife',
    label: 'RealLife',
    type: 'Simulation Game',
    demoOrigin: mainDeployOrigin,
    demoPath: '/clones/reallife/',
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
  projects: 4,
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
      <ScreenshotGallery
        project={project}
        selectedScreenshot={selectedScreenshot}
        setSelectedScreenshot={setSelectedScreenshot}
      />

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
          <p className="eyebrow">Screen Preview</p>
          <h4>주요 화면 6장</h4>
        </div>
        <span>{hasImages ? '이미지 6장 적용' : '이미지 준비중'}</span>
      </div>
      <div className="screenshotGrid">
        {project.screenshots.map(([title, caption, src], index) => {
          const item = { title, caption, src, index };
          return (
            <button
              className={[
                'screenshotSlot',
                src ? 'hasImage' : '',
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
      {selectedScreenshot ? null : (
        <p className="screenshotNote">
          방문자는 등록할 수 없고, 스크린샷은 코드에 포함된 이미지만 표시됩니다.
        </p>
      )}
    </section>
  );
}

function ScreenshotModal({ project, screenshot, onClose, onNext, onPrevious }) {
  const shouldFillFrame = Boolean(screenshot.src);

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
          <div className="screenshotDialog">
            <button className="modalClose" onClick={onClose} type="button">닫기</button>
            <div className="modalMedia">
              <div className={[
                'modalPreview',
                screenshot.src ? 'hasImage' : '',
                shouldFillFrame ? 'fillFrame' : '',
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
  const demoUrl = `${project.demoOrigin}${project.demoPath}`;

  return (
    <div className="detailHead">
      <div>
        <p className="eyebrow">{project.type}</p>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
      </div>
      <div className="projectOpenActions">
        <a href={demoUrl} target="_blank" rel="noreferrer">
          새 창으로 열기
        </a>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
