import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FaArrowDownLong } from 'react-icons/fa6';
import './styles.css';

import { experienceItems, lines, projectDetails, libraryGroups } from './portfolioData';

const showcaseItems = [
  {
    title: 'Customer Relations',
    period: '2016.01~ 현재',
    image: '/showcase/rode.png',
    hover: '사람은 더 좋은 것보다\n익숙한 것을 선택한다는 점을 배웠습니다.',
    detailTitle: '고객 상담 & 유지 업무 경험',
    detailLabel: '경력',
    detailBody: experienceItems[0].body,
  },
  {
    title: 'Experience in Japan',
    period: '2018.04 ~ 2019.10',
    image: '/showcase/japen.png',
    hover: '문화는 달라도\n사람의 불편과 감정은 비슷했습니다.',
    detailTitle: '일본 유학 & 워킹홀리데이 경험',
    detailLabel: '해외연수',
    detailBody: experienceItems[1].body,
  },
  {
    title: 'AI & Full-Stack Journey',
    period: '2025.09 ~ 2026.02',
    image: '/showcase/project.png',
    hover: '기능보다 사용자 흐름이\n더 중요하다는 점을 배웠습니다.',
    detailTitle: 'AI·풀스택 과정 & 프로젝트 경험',
    detailLabel: '교육 이수',
    detailBody: experienceItems[2].body,
  },
  {
    title: 'To Be Continued...',
    period: 'Contact',
    image: '/showcase/mesege.png',
    hover: '필요한 이야기가 있다면\n언제든 연락 주세요.',
    detailTitle: 'Contact',
    detailLabel: 'To Be Continued...',
    detailBody: lines([
      '카카오톡 아이디 : gurwns369',
      '메일 : gurwns369@naver.com',
      '브런치 : https://brunch.co.kr/@solbin369',
      'GitHub : https://github.com/HYEOKJUNCHOI?tab=repositories',
    ]),
  },
];

function App() {
  const [activeId, setActiveId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeAnchor, setActiveAnchor] = useState('home');
  const detailRef = useRef(null);
  const lastTriggerRef = useRef(null);
  const detailPanelId = 'project-detail-panel';
  const detailHeadingId = `project-detail-heading-${activeId || 'none'}`;
  const sideIndexItems = useMemo(() => [
    { id: 'home', label: 'Home', group: true },
    { id: 'about', label: 'About', group: true },
    { id: 'experience', label: 'Experience', group: true },
    { id: 'career-crm', label: 'CRM 경력' },
    { id: 'career-japan', label: '일본 연수' },
    { id: 'career-education', label: '교육 이수' },
    { id: 'projects', label: 'Projects', group: true },
    ...projectDetails.map((project) => ({
      id: 'projects',
      label: project.id === 'fixchecker' ? 'SFC' : project.label,
      projectId: project.id,
    })),
    { id: 'library', label: 'Library', group: true },
  ], []);
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
  }, [sideIndexItems]);
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

  const selectSideIndexProject = (event, projectId) => {
    event.preventDefault();
    selectProject(projectId, event.currentTarget);
  };

  const moveShowcase = (direction) => {
    setActiveShowcaseIndex((current) => {
      if (current === null) return current;
      return (current + direction + showcaseItems.length) % showcaseItems.length;
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
              item.projectId ? 'sideIndexProject' : '',
              activeAnchor === item.id && (!item.projectId || item.projectId === activeId) ? 'active' : '',
            ].filter(Boolean).join(' ')}
            href={`#${item.id}`}
            key={item.projectId || item.id}
            onClick={item.projectId ? (event) => selectSideIndexProject(event, item.projectId) : undefined}
          >
            <strong>{item.label}</strong>
          </a>
        ))}
      </nav>

      <section className="heroSection" id="home">
        <span className="anchorAlias" id="top" aria-hidden="true" />
        <div className="legacyAnchorFallback" aria-hidden="true">
          <a href="#top" tabIndex={-1}>처음</a>
          <a href="#career" tabIndex={-1}>경력</a>
          <a href="#self-intro" tabIndex={-1}>소개</a>
          <a href="#works" tabIndex={-1}>작품</a>
        </div>

        <div className="heroCopy">
          <h1 className="heroTitle">
            <span className="heroTitleLine heroTitleSingle">
              <span className="heroTitlePlain">저는 </span>
              <span className="heroTitleOpening">반복되는 불편함</span>
              <span className="heroTitlePlain">을 그냥 </span>
              <span className="heroTitleConclusion">지나치지 않습니다.</span>
            </span>
          </h1>
          <div className="heroLead">
            <p><span className="heroLeadEmphasis heroLeadWhite">손을 더 빠르게 움직이기보다,</span></p>
            <p><span className="heroLeadEmphasis heroLeadQuestion"><span className="heroLeadWhite">같은 일을 </span><span className="heroLeadFocus">더 단순하게 만드는 방법</span><span className="heroLeadWhite">을 고민합니다.</span></span></p>
          </div>
        </div>

      </section>

      <section className="aboutSection" id="about">
        <span className="anchorAlias" id="self-intro" aria-hidden="true" />
      </section>

      <section className="experienceSection" id="experience">
        <span className="anchorAlias" id="career" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow sectionEyebrowLarge">Experience / Background</p>
        </div>
        <ShowcaseImageGrid onSelectShowcase={setActiveShowcaseIndex} />
      </section>

      <section className="workSection" id="projects">
        <span className="anchorAlias" id="works" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow sectionEyebrowLarge">Project</p>
        </div>
        <div className="projectGrid" aria-label="프로젝트 네비게이터">
          {projectDetails.map((project) => (
            <button
              className={activeId && project.id === activeId ? 'projectCard active' : 'projectCard'}
              aria-controls={detailPanelId}
              aria-expanded={isDetailOpen && project.id === activeId}
              data-project-id={project.id}
              key={project.id}
              onClick={(event) => selectProject(project.id, event.currentTarget)}
              type="button"
            >
              <ProjectTeaserVisual
                image={project.showcaseImage}
                kind={project.visualKind}
                label={project.label}
                teaser={project.teaser}
                type={project.type}
              />
            </button>
          ))}
        </div>

        {isDetailOpen && activeProject?.id === 'caredoc' ? (
          <ProjectDetailModal onClose={closeDetailPanel} project={activeProject}>
            <ProjectDetail
              detailHeadingId={detailHeadingId}
              detailPanelId={detailPanelId}
              onRequestClose={closeDetailPanel}
              project={activeProject}
              refTarget={detailRef}
            />
          </ProjectDetailModal>
        ) : null}

        {isDetailOpen && activeProject?.id !== 'caredoc' ? (
          <ProjectDetail
            detailHeadingId={detailHeadingId}
            detailPanelId={detailPanelId}
            onRequestClose={closeDetailPanel}
            project={activeProject}
            refTarget={detailRef}
          />
        ) : null}
      </section>

      <LibrarySection />

      {activeShowcaseIndex !== null ? (
        <ShowcaseDetailModal
          item={showcaseItems[activeShowcaseIndex]}
          onClose={() => setActiveShowcaseIndex(null)}
          onNext={() => moveShowcase(1)}
          onPrevious={() => moveShowcase(-1)}
        />
      ) : null}

    </main>
  );
}

function LibrarySection() {
  // 카테고리는 '정렬 기준'으로만 사용 — 같은 분류끼리 모여 한 책장에 쭉 진열.
  const books = libraryGroups.flatMap((group) => group.books);
  return (
    <section className="librarySection" id="library">
      <div className="sectionTitle">
        <p className="eyebrow sectionEyebrowLarge">Library</p>
        <p>읽은 책, 그리고 언젠가 읽었으면 하는 책들.</p>
      </div>
      <ul className="libraryBooks">
        {books.map((book) => (
          <li className="libraryBook" key={book.title}>
            <span className="libraryCover">
              <img src={book.cover} alt={book.title} loading="lazy" />
            </span>
            <span className="libraryCaption">{book.title}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProjectTeaserVisual({ image, kind, label, teaser, type }) {
  return (
    <span className={`projectTeaserVisual ${kind ? `projectVisual-${kind}` : ''}`} aria-hidden="true">
      {image ? <img src={image} alt="" /> : (
        <span className="visualFrame">
          <span />
          <span />
          <span />
          <span />
        </span>
      )}
      <span className="projectCardChrome">
        <span className="projectType">{type}</span>
        <strong>{label}</strong>
      </span>
      <span className="projectExplanation" aria-hidden="true">
        <strong>{teaser}</strong>
      </span>
    </span>
  );
}

function ShowcaseImageGrid({ onSelectShowcase }) {
  return (
    <section className="showcaseImagePanel" aria-label="Experience / Background">
      <div className="showcaseImageGrid">
        {showcaseItems.map((item, index) => (
          <button className="showcaseImageCard" key={item.title} onClick={() => onSelectShowcase(index)} type="button">
            <img alt={`${item.title} 쇼케이스`} src={item.image} />
            <span className="showcaseImageOverlay">
              <strong>{item.title}</strong>
              <em>{item.period}</em>
            </span>
            <span className={[
              'showcaseExplanation',
              item.detailTitle === 'Contact' ? 'contactExplanation' : '',
            ].filter(Boolean).join(' ')} aria-hidden="true">
              <strong>{item.detailTitle === 'Contact' ? 'Kakao  gurwns369\nMail  gurwns369@naver.com\nBrunch  @solbin369\nGitHub  HYEOKJUNCHOI' : item.hover}</strong>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}



function ShowcaseDetailModal({ item, onClose, onNext, onPrevious }) {
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

  const paragraphs = item.detailBody.split('\n\n');

  return (
    <div className="showcaseDetailModal" role="dialog" aria-modal="true" aria-label={`${item.title} 상세 보기`}>
      <button className="showcaseDetailBackdrop" onClick={onClose} type="button" aria-label="닫기" />
      <div className="showcaseDetailModalStack">
        <div className="showcaseDetailModalShell">
          <button className="modalNav modalNavPrevious" onClick={onPrevious} type="button" aria-label="이전 Experience 보기">
            &lt;
          </button>
          <button className="modalNav modalNavNext" onClick={onNext} type="button" aria-label="다음 Experience 보기">
            &gt;
          </button>
          <button className="modalClose showcaseDetailModalClose" onClick={onClose} type="button">닫기</button>
          <div className="showcaseDetailDialog">
            <div className="showcaseDetailImage">
              <img alt={`${item.title} 이미지`} src={item.image} />
            </div>
            <div className="showcaseDetailCopy">
              <p className="eyebrow">{item.detailLabel}</p>
              <h3>{item.detailTitle}</h3>
              <em>{item.period}</em>
              <div>
                {paragraphs.map((paragraph, index) => (
                  <p key={`${item.title}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        <p className="modalHintCapsule">키보드 ← · → 로도 이동할 수 있습니다.</p>
      </div>
    </div>
  );
}

function ProjectDetailModal({ children, onClose, project }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="projectDetailModal" role="dialog" aria-modal="true" aria-label={`${project.label} 상세 보기`}>
      <button className="projectDetailBackdrop" onClick={onClose} type="button" aria-label="닫기" />
      <div className="projectDetailModalStack">
        <div className="projectDetailModalShell">
          <button className="modalClose projectDetailModalClose" onClick={onClose} type="button">닫기</button>
          {children}
        </div>
      </div>
    </div>
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
      <DetailSummary headingId={detailHeadingId} project={project} />
      <ProjectBrief project={project} />
      <ScreenshotGallery
        project={project}
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

function ScreenshotGallery({ project, setSelectedScreenshot }) {
  return (
    <section className="screenshotPanel" aria-label={`${project.label} 주요 화면`}>
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
                ['fixchecker', 'lucid', 'reallife'].includes(project.id) ? 'cropLegacyFrame' : '',
              ].filter(Boolean).join(' ')}
              key={`${project.id}-${title}`}
              onClick={() => setSelectedScreenshot(item)}
              type="button"
            >
              <strong>{title}</strong>
              {src ? (
                <img alt={`${project.label} ${title}`} src={src} />
              ) : (
                <span className="screenshotPlaceholder">{String(index + 1).padStart(2, '0')}</span>
              )}
              <p>{caption}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ProjectBrief({ project }) {
  const briefLabels = project.briefLabels || ['문제점', '구현한 것', '고민했던 부분'];
  const briefItems = [
    [briefLabels[0], project.problem],
    [briefLabels[1], project.solution],
    [briefLabels[2], project.learned],
  ];
  return (
    <section className={`projectBrief projectBrief-${project.id}`} aria-label={`${project.label} 데모와 문제 해결 요약`}>
      {briefItems.map(([title, body]) => (
        <article className="briefCard" key={title}>
          <h4><span className="briefTitleCapsule">{title}</span></h4>
          <div className="briefProse">
            {body.split('\n\n').map((paragraph, index) => (
              paragraph.trim().replace(/\u200B/g, '') === '↓' ? (
                <div className="briefFlowArrow" key={`${title}-arrow-${index}`} aria-hidden="true">
                  <FaArrowDownLong />
                </div>
              ) : (
                <p key={`${title}-paragraph-${index}`}>
                  {paragraph.split('\n').map((line, lineIndex) => (
                    <span className="briefLine" key={`${title}-paragraph-${index}-line-${lineIndex}`}>{line}</span>
                  ))}
                </p>
              )
            ))}
          </div>
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
            <div className="modalWindowBar" aria-hidden="true">
              <span className="modalWindowControl modalWindowClose" />
              <span className="modalWindowControl modalWindowMinimize" />
              <span className="modalWindowControl modalWindowZoom" />
              <strong>{project.label}</strong>
            </div>
            <button className="modalClose" onClick={onClose} type="button">닫기</button>
            <div className="modalMedia">
              <div className={[
                'modalPreview',
                screenshot.src ? 'hasImage' : '',
                shouldFillFrame ? 'fillFrame' : '',
                isLegacyFrame ? 'legacyFrame' : '',
                ['fixchecker', 'lucid', 'reallife'].includes(project.id) ? 'cropLegacyFrame' : '',
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
  const demoHref = `${project.demoOrigin || ''}${project.demoPath}`;

  return (
    <div className="detailHead" aria-labelledby={headingId}>
      <div>
        <p className="eyebrow" id={headingId}>{project.type}</p>
      </div>
      <a className="projectDemoLink detailDemoLink" href={demoHref} data-project-demo={project.id} target="_blank" rel="noreferrer">
        데모 확인
      </a>
    </div>
  );
}

const appElement = React.createElement(App);
createRoot(document.getElementById('root')).render(appElement);
