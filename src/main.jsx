import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import { experienceItems, lines, projectDetails } from './portfolioData';

function App() {
  const [activeId, setActiveId] = useState(projectDetails[0].id);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAnchor, setActiveAnchor] = useState('home');
  const detailRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const detailPanelId = 'project-detail-panel';
  const detailHeadingId = `project-detail-heading-${activeId}`;
  const sideIndexItems = [
    { id: 'home', label: 'Home', group: true },
    { id: 'about', label: 'About', group: true },
    { id: 'experience', label: 'Experience', group: true },
    { id: 'career-crm', label: 'CRM 경력' },
    { id: 'career-japan', label: '일본 연수' },
    { id: 'career-education', label: '교육 이수' },
    { id: 'projects', label: 'Projects', group: true },
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
      }, 'home');

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
  const closeDetailPanel = () => {
    setIsDetailOpen(false);
    window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  };

  const selectProject = (projectId, trigger) => {
    lastTriggerRef.current = trigger;
    setActiveId(projectId);
    setIsDetailOpen(true);
    window.requestAnimationFrame(() => {
      detailRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      detailRef.current?.focus();
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

      <section className="heroSection" id="home">
        <span className="anchorAlias" id="top" aria-hidden="true" />
        <div className="heroIdentityBadge" aria-label="최혁준 포트폴리오">
          <span>최</span>
          <strong>최혁준</strong>
        </div>
        <nav className="heroNav" aria-label="포트폴리오 섹션">
          <a href="#home"><b>01</b> home</a>
          <a href="#projects"><b>02</b> works</a>
          <a href="#experience"><b>03</b> career</a>
          <a href="#about"><b>04</b> about</a>
        </nav>
        <div className="legacyAnchorFallback" aria-hidden="true">
          <a href="#top" tabIndex={-1}>처음</a>
          <a href="#career" tabIndex={-1}>경력</a>
          <a href="#self-intro" tabIndex={-1}>소개</a>
          <a href="#works" tabIndex={-1}>작품</a>
        </div>

        <div className="heroCopy">
          <p className="heroKicker">HELLO, MY NAME IS HYEOKJUN</p>
          <h1>
            I make useful
            <br />
            <span>web tools.</span>
          </h1>
          <p className="heroLead">
            <span className="identityLine">불편한 반복을 줄이는 개발자</span>
            <span>고객 응대 현장에서 본 작은 불편을 실제로 눌러볼 수 있는 웹 화면으로 옮깁니다.</span>
          </p>
          <div className="heroActions">
            <a href="#about">소개 읽기</a>
            <a href="#projects">작업 보기</a>
          </div>
        </div>

      </section>

      <section className="aboutSection" id="about">
        <span className="anchorAlias" id="self-intro" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow">About</p>
          <h2>사용자가 멈추는 지점을 먼저 살피고, 작게 끝까지 구현합니다</h2>
          <p>{lines([
            '고객 응대 현장에서 반복되는 설명과 불편을 가까이서 들었습니다.',
            '풀스택 개발 교육 이후에는 그 관찰을 서류 작성, 자막 검수, 학습 보조 흐름을 정리하는 개인 프로젝트로 옮기고 있습니다.',
          ])}</p>
        </div>

      </section>

      <section className="experienceSection" id="experience">
        <span className="anchorAlias" id="career" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow">Experience / Background</p>
        </div>
        <div className="experienceTimeline">
          {experienceItems.map((item, index) => (
            <article className="timelineCard" id={item.id} key={item.label}>
              <div className="timelineMarker" aria-hidden="true">
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className="timelineContent">
                <span>{item.label}</span>
                <strong>{item.period}</strong>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="workSection" id="projects">
        <span className="anchorAlias" id="works" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow">Projects</p>
          <h2>반복 작업을 줄이는 프로젝트</h2>
          <p>서류 작성, 자막 검수, 코딩 학습처럼 사용자가 자주 멈추는 과정을 작게 나누어 구현한 작업들입니다.</p>
        </div>

        <div className="projectGrid" aria-label="프로젝트 네비게이터">
          {projectDetails.map((project) => (
            <button
              className={project.id === activeId ? 'projectCard active' : 'projectCard'}
              aria-controls={detailPanelId}
              aria-expanded={isDetailOpen && project.id === activeId}
              data-project-id={project.id}
              key={project.id}
              onClick={(event) => selectProject(project.id, event.currentTarget)}
              type="button"
            >
              <ProjectTeaserVisual kind={project.visualKind} />
              <span className="projectType">{project.type}</span>
              <strong>{project.navLabel || project.label}</strong>
              <p>{project.teaser}</p>
              <span className="projectExplanation">
                <span>살펴볼 지점</span>
                <strong>{project.checkpoints[0]}</strong>
                <small>클릭하면 상세 화면과 데모 확인 포인트로 이동합니다.</small>
              </span>
              <em>{isDetailOpen && project.id === activeId ? '열림' : '열기'}</em>
            </button>
          ))}
        </div>

        {isDetailOpen ? (
          <ProjectDetail
            detailHeadingId={detailHeadingId}
            detailPanelId={detailPanelId}
            onRequestClose={closeDetailPanel}
            project={activeProject}
            refTarget={detailRef}
          />
        ) : null}
      </section>
    </main>
  );
}

function ProjectTeaserVisual({ kind }) {
  return (
    <span className={`projectTeaserVisual ${kind ? `projectVisual-${kind}` : ''}`} aria-hidden="true">
      <span className="visualFrame">
        <span />
        <span />
        <span />
        <span />
      </span>
    </span>
  );
}

function ProjectDetail({ detailHeadingId, detailPanelId, onRequestClose, project, refTarget }) {
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (selectedScreenshot) return;
      event.preventDefault();
      onRequestClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onRequestClose, selectedScreenshot]);

  const moveScreenshot = (direction) => {
    if (!selectedScreenshot) return;

    const total = project.screenshots.length;
    const nextIndex = (selectedScreenshot.index + direction + total) % total;
    const [title, caption, src] = project.screenshots[nextIndex];

    setSelectedScreenshot({ title, caption, src, index: nextIndex });
  };

  return (
    <article
      aria-labelledby={detailHeadingId}
      className="detailPanel showcaseStage"
      id={detailPanelId}
      ref={refTarget}
      tabIndex={-1}
    >
      <button aria-label="프로젝트 상세 패널 닫기" className="detailClose" onClick={onRequestClose} type="button">
        닫기
      </button>
      <DetailSummary headingId={detailHeadingId} project={project} />
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
    ['배운 점', project.learned],
  ];
  const demoHref = `${project.demoOrigin || ''}${project.demoPath}`;

  return (
    <section className="projectBrief" aria-label={`${project.label} 데모와 문제 해결 요약`}>
      <article className="briefCard demoBriefCard">
        <h4>데모 / 확인 포인트</h4>
        <a className="projectDemoLink" href={demoHref} data-project-demo={project.id} target="_blank" rel="noreferrer">
          데모 열기
        </a>
        <ul>
          {project.checkpoints.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
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

function DetailSummary({ headingId, project }) {
  return (
    <div className="detailHead">
      <div>
        <p className="eyebrow">{project.type}</p>
        <h3 id={headingId}>{project.title}</h3>
        <p>{project.summary}</p>
        {project.demoPath && (
          <a
            href={project.demoPath}
            target="_blank"
            rel="noopener noreferrer"
            className="cloneLaunchButton"
          >
            테스트 클론 실행하기
          </a>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
