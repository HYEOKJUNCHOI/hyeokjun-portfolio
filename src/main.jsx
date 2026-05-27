import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import { experienceItems, lines, profileFacts, projectDetails, resumeIntro } from './portfolioData';

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
    { id: 'books', label: 'Books', group: true },
    { id: 'contact', label: 'Contact', group: true },
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
        <nav className="heroNav" aria-label="포트폴리오 섹션">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#books">Books</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="legacyAnchorFallback" aria-hidden="true">
          <a href="#top" tabIndex={-1}>처음</a>
          <a href="#career" tabIndex={-1}>경력</a>
          <a href="#self-intro" tabIndex={-1}>소개</a>
          <a href="#works" tabIndex={-1}>작품</a>
        </div>

        <div className="heroCopy">
          <p className="welcomePill">Portfolio rebuild 2026</p>
          <h1>
            안녕하세요
            <br />
            <span>최혁준입니다.</span>
          </h1>
          <p className="heroLead">
            <span className="identityLine">불편한 반복을 줄이는 개발자</span>
            <span>고객이 자주 멈추는 지점을 관찰하고 웹 도구로 정리합니다.</span>
          </p>
          <div className="heroActions">
            <a href="#about">소개 읽기</a>
            <a href="#projects">작업 보기</a>
          </div>
        </div>

        <aside className="avatarPanel" aria-label="작업 흐름을 설명하는 개발자 작업대 일러스트" tabIndex={0}>
          <div className="workspaceAvatar">
            <img
              className="workbenchIllustration"
              src="/generated/hero-workbench.svg"
              alt="모니터, 브라우저 카드, 체크리스트 노트, 램프, 커피와 책이 놓인 개발자 작업대"
            />
            <div className="heroExplainLayer">
              <span>왜 이 그림인가요?</span>
              <p>
                사용자가 반복해서 적는 정보, 확인해야 할 화면, 마지막 출력까지 한 책상 위에서 차례대로 정리한다는 뜻입니다.
              </p>
            </div>
          </div>
          <div className="avatarCaption">
            <span>작업 방향</span>
            <strong>반복되는 설명과 입력을 줄이는 작은 웹 도구</strong>
          </div>
        </aside>
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

        <div className="introPage">
          <aside className="profileCard" aria-label="최혁준 기본 정보">
            <div className="profileIntroHeader">
              <div className="profilePhotoFrame">
                <img src="/assets/profile.jpg" alt="최혁준 프로필 사진" />
              </div>
              <div className="profileIdentity">
                <strong>최혁준</strong>
                <span>Full-stack Web Developer</span>
              </div>
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

          <article className="letterPanel aboutSummaryPanel">
            <div className="aboutKeywordGrid" aria-label="최혁준을 설명하는 핵심 단어">
              <span>관찰</span>
              <span>흐름 정리</span>
              <span>작은 자동화</span>
              <span>끝까지 검증</span>
            </div>
            <p className="summaryLead">
              반복되는 불편을 발견하면 먼저 사용자가 어떤 순서에서 멈추는지 정리합니다.
              그 다음 입력, 확인, 출력처럼 작은 단위로 나누어 실제로 눌러볼 수 있는 화면으로 구현합니다.
            </p>
            <p className="aboutShortIntro">
              고객 응대 경험에서 나온 관찰을 바탕으로, 복잡한 설명과 반복 입력을 줄이는 웹 도구를 만들고 있습니다.
              화려한 기능보다 사용자가 바로 이해하고 다시 사용할 수 있는 흐름을 중요하게 봅니다.
            </p>
            <details className="resumeDetails">
              <summary>자기소개 자세히 보기</summary>
              <p className="resumeText">{resumeIntro}</p>
            </details>
          </article>
        </div>
      </section>

      <section className="experienceSection" id="experience">
        <span className="anchorAlias" id="career" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow">Experience / Background</p>
          <h2>검증된 경험을 넓은 타임라인으로 정리했습니다</h2>
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

      <BooksSection />

      <ContactSection />
    </main>
  );
}

const contactLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/HYEOKJUNCHOI',
    note: '프로젝트 코드와 학습 흐름을 확인할 수 있습니다.',
    meta: 'github.com/HYEOKJUNCHOI',
    external: true,
  },
  {
    label: 'Email',
    href: 'mailto:gurwns369@naver.com',
    note: '협업 제안이나 포트폴리오 관련 연락을 편하게 보내주세요.',
    meta: 'gurwns369@naver.com',
  },
  {
    label: 'Brunch',
    href: 'https://brunch.co.kr/@solbin369',
    note: '생각을 정리하는 글과 작업 기록을 천천히 남깁니다.',
    meta: 'brunch.co.kr/@solbin369',
    external: true,
  },
];

const bookshelfRows = [
  ['빈 책등', '주제 메모', 'ISBN 자리', '노트 자리', '분류 대기'],
  ['읽기 후보', '비어 있음', '스캔 준비', '책갈피', '정리 전'],
];

const bookPrepCards = [
  ['실제 기록 없음', 'v1에서는 읽은 책, 평점, 저자, 독서 이력을 표시하지 않습니다.'],
  ['입력 흐름만 준비', 'ISBN-13 입력과 스캔 버튼은 자리만 보여주며 저장이나 검색을 하지 않습니다.'],
  ['어댑터 메모', '나중에 데이터 구조가 확정되면 연결할 수 있도록 화면 구역만 분리했습니다.'],
];

function BooksSection() {
  return (
    <section className="booksSection" id="books" aria-labelledby="books-heading">
      <div className="sectionTitle">
        <p className="eyebrow">Books / Reading Desk</p>
        <h2 id="books-heading">아직 비어 있지만, 책장을 닮은 준비 공간</h2>
        <p>{lines([
          '실제 독서 데이터나 외부 도서 검색은 넣지 않았습니다.',
          '대신 나중에 ISBN 등록 흐름을 붙일 수 있는 자리와 빈 책장 상태를 완성된 화면처럼 보여줍니다.',
        ])}</p>
      </div>

      <div className="booksWorkspace">
        <article className="bookshelfPanel" aria-label="준비 중인 책장 화면" tabIndex={0}>
          <div className="bookshelfHeader">
            <div>
              <span>현재 상태</span>
              <strong>책 정보 연결 전</strong>
            </div>
            <em>Preparation only</em>
          </div>

          <div className="shelfRows" role="list" aria-label="비어 있는 책장 슬롯">
            {bookshelfRows.map((row, rowIndex) => (
              <div className="shelfRow" role="listitem" key={`shelf-row-${rowIndex}`}>
                {row.map((label, index) => (
                  <span
                    className={['bookSpine', index % 2 === 0 ? 'tallSpine' : '', label.includes('비어') || label.includes('빈') ? 'emptySpine' : ''].filter(Boolean).join(' ')}
                    key={`${rowIndex}-${label}`}
                  >
                    <span>{label}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="bookPrepGrid">
            {bookPrepCards.map(([title, body]) => (
              <article className="bookPrepCard" key={title}>
                <strong>{title}</strong>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </article>

        <aside className="isbnPrepPanel" aria-labelledby="isbn-prep-title">
          <span className="prepBadge">비활성 데모</span>
          <h3 id="isbn-prep-title">ISBN 등록 어댑터 자리</h3>
          <p>
            아래 입력 영역은 향후 등록 흐름을 위한 시각적 자리입니다. 지금은 값을 받을 수 없고,
            검색, 저장, 외부 연동을 실행하지 않습니다.
          </p>

          <div className="isbnMockForm" aria-describedby="isbn-prep-help">
            <label htmlFor="isbn-preview-input">ISBN-13 입력 준비</label>
            <div>
              <input
                disabled
                id="isbn-preview-input"
                inputMode="numeric"
                placeholder="978 또는 979로 시작하는 13자리"
                type="text"
              />
              <button disabled type="button">등록 준비중</button>
            </div>
            <p id="isbn-prep-help">버튼과 입력칸은 의도적으로 비활성화되어 있습니다.</p>
          </div>

          <div className="readingDeskVisual" aria-hidden="true">
            <span className="deskLight" />
            <span className="deskBook" />
            <span className="deskCard" />
          </div>
        </aside>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section className="contactSection" id="contact" aria-labelledby="contact-heading">
      <div className="sectionTitle">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-heading">작게라도 실제로 이어지는 협업을 기다립니다</h2>
        <p>{lines([
          '반복되는 설명, 입력, 확인 과정을 웹 화면으로 정리하는 일에 관심이 있습니다.',
          '프로젝트 제안이나 포트폴리오 관련 연락은 아래 경로로 편하게 남겨주세요.',
        ])}</p>
      </div>

      <div className="contactBoard" aria-label="연락 가능한 채널">
        <div className="contactIntroCard">
          <span>Open to conversation</span>
          <strong>명확한 문제를 함께 작게 나누고, 눌러볼 수 있는 결과로 옮기는 일을 좋아합니다.</strong>
          <p>답장은 상황에 따라 천천히 드릴 수 있지만, 보내주신 맥락은 차분히 읽고 확인하겠습니다.</p>
        </div>

        <div className="contactLinkGrid">
          {contactLinks.map((link) => (
            <a
              className="contactLinkCard"
              href={link.href}
              key={link.label}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noreferrer' : undefined}
            >
              <span>{link.label}</span>
              <strong>{link.meta}</strong>
              <p>{link.note}</p>
              <em>{link.external ? '새 창에서 보기' : '메일 보내기'}</em>
            </a>
          ))}
        </div>
      </div>
    </section>
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
