import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FaArrowDownLong } from 'react-icons/fa6';
import './styles.css?experience-final';
import './experienceOverrides.css';

import { collection, getDocs } from 'firebase/firestore';
import { experienceItems, projectDetails, libraryGroups, resumeIntro, profileFacts } from './portfolioData';
import { db } from './firebase';

const showcaseItems = [
  {
    title: '고객 상담 & 유지 업무 경험',
    period: '2016.01~ 현재',
    image: '/showcase/rode.png',
    hover: '사람은 더 좋은 것보다\n익숙한 것을 선택한다는 점을 배웠습니다.',
    detailTitle: '고객 상담 & 유지 업무 경험',
    detailLabel: '경력',
    detailBody: experienceItems[0].body,
  },
  {
    title: '일본 유학 & 워킹홀리데이 경험',
    period: '2018.04 ~ 2019.10',
    image: '/showcase/japen.png',
    hover: '문화는 달라도\n사람의 불편과 감정은 비슷했습니다.',
    detailTitle: '일본 유학 & 워킹홀리데이 경험',
    detailLabel: '해외연수',
    detailBody: experienceItems[1].body,
  },
  {
    title: 'AI·풀스택 과정 & 프로젝트 경험',
    period: '2025.09 ~ 2026.02',
    image: '/showcase/project.png',
    hover: '기능보다 사용자 흐름이\n더 중요하다는 점을 배웠습니다.',
    detailTitle: 'AI·풀스택 과정 & 프로젝트 경험',
    detailLabel: '교육 이수',
    detailBody: experienceItems[2].body,
  },
];


// 연락처 — 푸터(ContactSection)와 쇼케이스 Contact 모달이 공유.
// GitHub·Brunch = 바로 링크 / Email = 클립보드 복사 / Kakao = 팝업 카드.
const EMAIL_ADDRESS = 'gurwns369@naver.com';
const KAKAO_ID = 'gurwns369';

const contactLinks = [
  { id: 'github', label: 'GitHub', icon: '/contact/github.png', href: 'https://github.com/HYEOKJUNCHOI', value: 'github.com/HYEOKJUNCHOI' },
  { id: 'brunch', label: 'Brunch', icon: '/contact/brunch.png', href: 'https://brunch.co.kr/@solbin369', value: 'brunch.co.kr/@solbin369' },
  { id: 'email', label: 'Email', icon: '/contact/email.png', value: EMAIL_ADDRESS },
  { id: 'kakao', label: 'KakaoTalk', icon: '/contact/kakao.png', value: KAKAO_ID },
];

let modalLockCount = 0;
let modalRestoreState = null;

function useModalScrollLock() {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const { body, documentElement } = document;
    const scrollY = window.scrollY || documentElement.scrollTop || 0;

    if (modalLockCount === 0) {
      modalRestoreState = {
        bodyOverflow: body.style.overflow,
        bodyPosition: body.style.position,
        bodyTop: body.style.top,
        bodyWidth: body.style.width,
        bodyTouchAction: body.style.touchAction,
        htmlOverflow: documentElement.style.overflow,
        scrollY,
      };

      body.style.overflow = 'hidden';
      body.style.position = 'fixed';
      body.style.top = `-${scrollY}px`;
      body.style.width = '100%';
      body.style.touchAction = 'none';
      body.classList.add('modalLocked');
      documentElement.style.overflow = 'hidden';
      documentElement.classList.add('modalLocked');
      // sideIndex JS 직접 차단 (fixed 요소는 CSS descendant selector 미적용)
      document.querySelectorAll('.sideIndex, .sideIndexRail').forEach(el => {
        el.dataset.prevPe = el.style.pointerEvents;
        el.style.pointerEvents = 'none';
      });
    }

    modalLockCount += 1;

    return () => {
      modalLockCount = Math.max(0, modalLockCount - 1);
      if (modalLockCount > 0 || !modalRestoreState) return;

      body.style.overflow = modalRestoreState.bodyOverflow;
      body.style.position = modalRestoreState.bodyPosition;
      body.style.top = modalRestoreState.bodyTop;
      body.style.width = modalRestoreState.bodyWidth;
      body.style.touchAction = modalRestoreState.bodyTouchAction;
      body.classList.remove('modalLocked');
      documentElement.style.overflow = modalRestoreState.htmlOverflow;
      documentElement.classList.remove('modalLocked');
      // sideIndex 복원
      document.querySelectorAll('.sideIndex, .sideIndexRail').forEach(el => {
        el.style.pointerEvents = el.dataset.prevPe || '';
        delete el.dataset.prevPe;
      });
      window.scrollTo?.(0, modalRestoreState.scrollY);
      modalRestoreState = null;
    };
  }, []);
}

function useModalFocusTrap(containerRef) {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    const getFocusable = () => Array.from(container.querySelectorAll(focusableSelector))
      .filter((element) => element instanceof HTMLElement && element.offsetParent !== null);

    const focusInitialElement = () => {
      const focusable = getFocusable();
      (focusable[0] || container).focus({ preventScroll: true });
    };

    const frame = window.requestAnimationFrame(focusInitialElement);
    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [containerRef]);
}

function App() {
  const [activeId, setActiveId] = useState(null);
  const [visitedProjectIds, setVisitedProjectIds] = useState(() => new Set());
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeShowcaseIndex, setActiveShowcaseIndex] = useState(null);
  const [viewedShowcaseIndexes, setViewedShowcaseIndexes] = useState(() => new Set());
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
    { id: 'career-crm', label: '업무 경험', showcaseIndex: 0 },
    { id: 'career-japan', label: '일본 연수', showcaseIndex: 1 },
    { id: 'career-education', label: '교육 이수', showcaseIndex: 2 },
    { id: 'projects', label: 'Projects', group: true },
    ...projectDetails.map((project) => ({
      id: 'projects',
      label: project.label,
      projectId: project.id,
    })),
    { id: 'library', label: 'Library', group: true },
    { id: 'contact', label: 'Contact', group: true },
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
    setVisitedProjectIds((current) => {
      if (current.has(projectId)) return current;
      return new Set(current).add(projectId);
    });
    setActiveId(projectId);
    setIsDetailOpen(true);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const briefTarget = document.getElementById(`project-brief-${projectId}`);
        (briefTarget || detailRef.current)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
        detailRef.current?.focus({ preventScroll: true });
      });
    });
  };

  const selectSideIndexProject = (event, projectId) => {
    event.preventDefault();
    selectProject(projectId, event.currentTarget);
  };

  const selectSideIndexShowcase = (event, index) => {
    event.preventDefault();
    selectShowcase(index);
  };

  const selectShowcase = (index) => {
    setViewedShowcaseIndexes((current) => {
      if (current.has(index)) return current;
      return new Set(current).add(index);
    });
    setActiveShowcaseIndex(index);
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
            onClick={
              item.projectId
                ? (event) => selectSideIndexProject(event, item.projectId)
                : item.showcaseIndex !== undefined
                  ? (event) => selectSideIndexShowcase(event, item.showcaseIndex)
                  : undefined
            }
          >
            <strong>{item.label}</strong>
          </a>
        ))}
      </nav>

      <div className="heroTechLayout">
        <section className="heroSection" id="home">
          <span className="anchorAlias" id="top" aria-hidden="true" />
          <div className="legacyAnchorFallback" aria-hidden="true">
            <a href="#top" tabIndex={-1}>처음</a>
            <a href="#career" tabIndex={-1}>경력</a>
            <a href="#self-intro" tabIndex={-1}>소개</a>
            <a href="#works" tabIndex={-1}>작품</a>
          </div>

          <div className="heroCopy">
            <h1 className="heroTitle heroTitleStacked">
              <span className="heroTitleLine heroTitlePlain">
                <span className="heroTitleOpening">
                  <span className="heroTitlePink">반복되는</span>
                  <span className="heroTitlePink">불편함</span>
                </span>을
              </span>
              <span className="heroTitleLine heroTitlePlain">그냥 지나치지</span>
              <span className="heroTitleLine heroTitlePlain">않습니다.</span>
            </h1>
            <div className="heroLead heroLeadStacked">
              <p><span className="heroLeadFocus">과정을</span></p>
              <p><span className="heroLeadFocus">단순하게 만드는</span></p>
              <p><span className="heroLeadFocus">방법</span><span className="heroLeadWhite">을 고민합니다.</span></p>
            </div>
          </div>

        </section>

        <TechStackPanel />
      </div>

      <section className="aboutSection" id="about">
        <span className="anchorAlias" id="self-intro" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow sectionEyebrowLarge">About</p>
        </div>
        <div className="aboutGrid">
          <div className="aboutIntro">
            {resumeIntro.split('\n\n').map((paragraph, index) => (
              <p key={`about-${index}`}>{paragraph}</p>
            ))}
          </div>
          <dl className="profileFacts">
            {profileFacts.map(([term, desc]) => (
              <div className="profileFactRow" key={term}>
                <dt>{term}</dt>
                <dd>{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="experienceSection" id="experience">
        <span className="anchorAlias" id="career" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow sectionEyebrowLarge">Experience / Background</p>
        </div>
        <ShowcaseImageGrid
          activeShowcaseIndex={activeShowcaseIndex}
          onSelectShowcase={selectShowcase}
          viewedShowcaseIndexes={viewedShowcaseIndexes}
        />
      </section>

      <section className="workSection" id="projects">
        <span className="anchorAlias" id="works" aria-hidden="true" />
        <div className="sectionTitle">
          <p className="eyebrow sectionEyebrowLarge">Project</p>
        </div>
        <ProjectNavigator
          activeId={activeId}
          detailPanelId={detailPanelId}
          isDetailOpen={isDetailOpen}
          onSelectProject={selectProject}
        />

        {isDetailOpen && activeProject ? (
          <>
            <ProjectDetail
              detailHeadingId={detailHeadingId}
              detailPanelId={detailPanelId}
              onRequestClose={closeDetailPanel}
              project={activeProject}
              refTarget={detailRef}
            />
            <ProjectNavigator
              activeId={activeId}
              detailPanelId={detailPanelId}
              isDetailOpen={isDetailOpen}
              onSelectProject={selectProject}
              variant="repeat"
              visitedProjectIds={visitedProjectIds}
            />
          </>
        ) : null}
      </section>

      <LibrarySection />

      <ContactSection />

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

function ProjectNavigator({ activeId, detailPanelId, isDetailOpen, onSelectProject, variant = 'primary', visitedProjectIds = new Set() }) {
  const isRepeat = variant === 'repeat';

  return (
    <div
      className={isRepeat ? 'projectGrid projectGridRepeat' : 'projectGrid'}
      aria-label={isRepeat ? '다른 프로젝트 다시 보기' : '프로젝트 네비게이터'}
    >
      {projectDetails.map((project) => {
        const isActive = activeId === project.id;
        const isVisited = isRepeat && visitedProjectIds.has(project.id);
        const isDisabled = isRepeat && isActive;
        const statusLabel = isRepeat && isActive ? '열람중' : isVisited ? '확인완료' : '';

        return (
          <button
            className={[
              'projectCard',
              isActive ? 'active' : '',
              isVisited ? 'visited' : '',
            ].filter(Boolean).join(' ')}
            aria-controls={detailPanelId}
            aria-current={isDisabled ? 'true' : undefined}
            aria-expanded={isDetailOpen && isActive}
            aria-label={statusLabel ? `${project.label} ${statusLabel}` : project.label}
            data-project-id={project.id}
            disabled={isDisabled}
            key={project.id}
            onClick={(event) => onSelectProject(project.id, event.currentTarget)}
            type="button"
          >
            <ProjectTeaserVisual
              image={project.showcaseImage}
              kind={project.visualKind}
              label={project.label}
              teaser={project.teaser}
              type={project.type}
            />
            {!isDisabled ? (
              <span className="projectActionCue" aria-hidden="true">자세히 보기</span>
            ) : null}
            {statusLabel ? (
              <>
                <span className="projectVisitBadge" aria-hidden="true">{statusLabel}</span>
                <span className="projectStatusMessage" aria-hidden="true">
                  <strong>{project.teaser}</strong>
                </span>
              </>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function TechStackPanel() {
  return (
    <section className="techStackPanel" aria-label="보유 기술 및 도구">
      <div className="techStackGlass">
        <img className="techStackMap" src="/showcase/hero-image2.jpg" alt="기술 흐름을 연결한 포트폴리오 히어로 이미지" />
      </div>
    </section>
  );
}

function LibrarySection() {
  // 책장 = Firestore 'shelf' 만 표시(seed 폴백 없음). 비면 + 타일만 중앙에.
  // 카테고리는 정렬 기준으로만 사용 — 같은 분류끼리 모여 진열.
  const [books, setBooks] = useState([]);
  const [addOpen, setAddOpen] = useState(false);
  const loadShelf = () => {
    getDocs(collection(db, 'shelf'))
      .then((snap) => {
        const list = snap.docs
          .map((d) => d.data())
          .sort((a, b) =>
            (a.category || '').localeCompare(b.category || '') ||
            (a.title || '').localeCompare(b.title || ''));
        setBooks(list);
      })
      .catch(() => {});
  };
  useEffect(() => { loadShelf(); }, []);
  const trackRef = useRef(null);
  // 마우스 클릭-드래그로 가로 스크롤(overflow 컨테이너는 기본적으로 드래그 스크롤이 안 됨).
  const dragRef = useRef({ active: false, startX: 0, startScroll: 0 });

  const onPointerDown = (event) => {
    const track = trackRef.current;
    if (!track || event.pointerType === 'touch') return; // 터치는 네이티브 스크롤에 맡김
    // 버튼/링크 위에서 시작한 포인터는 드래그(포인터 캡처) 대상에서 제외 → 클릭이 정상 작동
    if (event.target.closest('button, a, input, [role="button"]')) return;
    dragRef.current = { active: true, startX: event.clientX, startScroll: track.scrollLeft };
    track.setPointerCapture?.(event.pointerId);
    track.classList.add('dragging');
  };
  const onPointerMove = (event) => {
    if (!dragRef.current.active) return;
    const track = trackRef.current;
    if (!track) return;
    track.scrollLeft = dragRef.current.startScroll - (event.clientX - dragRef.current.startX);
  };
  const endDrag = () => {
    dragRef.current.active = false;
    trackRef.current?.classList.remove('dragging');
  };

  // 좌우 더 스크롤할 게 남았는지 → 화살표 힌트 노출 판단.
  const [edges, setEdges] = useState({ left: false, right: true });
  const updateEdges = () => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      left: track.scrollLeft > 4,
      right: track.scrollLeft < track.scrollWidth - track.clientWidth - 4,
    });
  };
  useEffect(() => {
    updateEdges();
    const track = trackRef.current;
    track?.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      track?.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, []);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    requestAnimationFrame(() => {
      track.scrollLeft = 0;
      updateEdges();
    });
  }, [books.length]);
  const scrollByDir = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.7, behavior: 'smooth' });
  };

  return (
    <section className="librarySection" id="library">
      <div className="sectionTitle">
        <p className="eyebrow sectionEyebrowLarge">Library</p>
        <p>나에게 영감을 준 책들.</p>
      </div>
      <div className="libraryShelf">
        <button
          className={`libraryNav libraryNavPrev${edges.left ? '' : ' is-hidden'}`}
          type="button"
          aria-label="이전 책"
          onClick={() => scrollByDir(-1)}
        >
          ‹
        </button>
        <ul
          className="libraryBooks"
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {books.map((book) => (
            <li className="libraryBook" key={book.isbn13 || book.title}>
              <span className="libraryCover">
                <img src={book.cover} alt={book.title} loading="lazy" draggable={false} />
              </span>
              <span className="libraryCaption">{book.title}</span>
            </li>
          ))}
          <li className="libraryBook libraryAddTile" key="__add__">
            <button type="button" className="libraryAddBtn" onClick={() => setAddOpen(true)} aria-label="관리자 책 등록">
              <span aria-hidden="true">+</span>
              <strong>관리자 책 등록</strong>
            </button>
          </li>
        </ul>
        <button
          className={`libraryNav libraryNavNext${edges.right ? '' : ' is-hidden'}`}
          type="button"
          aria-label="다음 책"
          onClick={() => scrollByDir(1)}
        >
          ›
        </button>
      </div>
      {addOpen ? (
        <BookAddModal
          books={books}
          onClose={() => setAddOpen(false)}
          onAdded={() => { setAddOpen(false); loadShelf(); }}
          onChanged={loadShelf}
        />
      ) : null}
    </section>
  );
}

function BookAddModal({ books, onClose, onAdded, onChanged }) {
  useModalScrollLock();
  // 2단계: ① PIN 게이트(/api/verify-pin) → ② 관리 메뉴(등록/수정/삭제).
  // 서버리스(/api/*)라 로컬 vite dev 에선 동작 X, 배포(Vercel)에서 동작.
  const [step, setStep] = useState('pin'); // 'pin' | 'manage'
  const [mode, setMode] = useState('register'); // 'register' | 'edit' | 'delete'
  const [pin, setPin] = useState('');
  const [isbn, setIsbn] = useState('');
  const [book, setBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [status, setStatus] = useState({ kind: 'idle' });
  const [confirmDeleteIsbn, setConfirmDeleteIsbn] = useState('');
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const pinKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', '0', 'submit'];

  const stopScan = () => {
    try { controlsRef.current?.stop(); } catch (e) { /* no-op */ }
    controlsRef.current = null;
    setScanning(false);
  };
  useEffect(() => () => stopScan(), []);

  const verifyPin = async () => {
    if (!pin) { setStatus({ kind: 'error', msg: 'PIN을 입력하세요.' }); return; }
    setStatus({ kind: 'loading' });
    try {
      const r = await fetch('/api/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      if (!r.ok) throw new Error('bad_pin');
      setStatus({ kind: 'idle' });
      setStep('manage');
    } catch (e) {
      setStatus({ kind: 'error', msg: 'PIN이 틀렸습니다.' });
    }
  };

  const pressPinKey = (key) => {
    setStatus({ kind: 'idle' });
    if (key === 'back') {
      setPin((current) => current.slice(0, -1));
      return;
    }
    if (key === 'submit') {
      verifyPin();
      return;
    }
    setPin((current) => (current.length >= 8 ? current : `${current}${key}`));
  };

  const chooseMode = (nextMode) => {
    stopScan();
    setMode(nextMode);
    setStatus({ kind: 'idle' });
    setConfirmDeleteIsbn('');
    setEditingBook(null);
  };

  const startScan = async () => {
    setStatus({ kind: 'idle' });
    setScanning(true);
    try {
      const { BrowserMultiFormatReader } = await import('@zxing/browser');
      const reader = new BrowserMultiFormatReader();
      controlsRef.current = await reader.decodeFromVideoDevice(undefined, videoRef.current, (result) => {
        if (!result) return;
        const code = result.getText().replace(/\D/g, '');
        if (code.length === 13) { setIsbn(code); stopScan(); }
      });
    } catch (e) {
      setStatus({ kind: 'error', msg: '카메라 실패: ' + (e.message || e) });
      setScanning(false);
    }
  };

  const lookup = async () => {
    const id = isbn.replace(/\D/g, '');
    if (id.length !== 13) { setStatus({ kind: 'error', msg: 'ISBN 13자리를 입력하세요.' }); return; }
    setStatus({ kind: 'loading' });
    try {
      const r = await fetch(`/api/book-lookup?isbn=${id}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'lookup');
      setBook(data);
      setStatus({ kind: 'idle' });
    } catch (e) {
      setStatus({ kind: 'error', msg: '조회 실패 (배포 후 동작): ' + (e.message || e) });
    }
  };

  const save = async () => {
    if (!book) return;
    setStatus({ kind: 'loading' });
    try {
      const r = await fetch('/api/book-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin, isbn: book.isbn13, title: book.title, author: book.author,
          publisher: book.publisher, cover: book.cover, category: book.category,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'save');
      onAdded();
    } catch (e) {
      const m = String(e.message || e);
      setStatus({ kind: 'error', msg: m === 'bad_pin' ? 'PIN이 틀렸습니다.' : '저장 실패: ' + m });
    }
  };

  const deleteBook = async (target) => {
    const targetIsbn = String(target?.isbn13 || '').replace(/\D/g, '');
    if (!targetIsbn) return;
    if (confirmDeleteIsbn !== targetIsbn) {
      setConfirmDeleteIsbn(targetIsbn);
      setStatus({ kind: 'idle' });
      return;
    }

    setStatus({ kind: 'loading' });
    try {
      const r = await fetch('/api/book-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', pin, isbn: targetIsbn }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'delete');
      setConfirmDeleteIsbn('');
      setStatus({ kind: 'idle' });
      onChanged?.();
    } catch (e) {
      const m = String(e.message || e);
      setStatus({ kind: 'error', msg: m === 'bad_pin' ? 'PIN이 틀렸습니다.' : '삭제 실패: ' + m });
    }
  };

  const beginEdit = (target) => {
    setEditingBook({
      isbn13: String(target?.isbn13 || ''),
      title: String(target?.title || ''),
      author: String(target?.author || ''),
      publisher: String(target?.publisher || ''),
      cover: String(target?.cover || ''),
      category: String(target?.category || ''),
    });
    setStatus({ kind: 'idle' });
  };

  const updateEditingField = (field, value) => {
    setEditingBook((current) => current ? { ...current, [field]: value } : current);
  };

  const updateBook = async () => {
    if (!editingBook) return;
    const targetIsbn = String(editingBook.isbn13 || '').replace(/\D/g, '');
    if (targetIsbn.length !== 13 || !editingBook.title.trim()) {
      setStatus({ kind: 'error', msg: 'ISBN과 제목을 확인하세요.' });
      return;
    }

    setStatus({ kind: 'loading' });
    try {
      const r = await fetch('/api/book-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          pin,
          isbn: targetIsbn,
          title: editingBook.title,
          author: editingBook.author,
          publisher: editingBook.publisher,
          cover: editingBook.cover,
          category: editingBook.category,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'update');
      setEditingBook(null);
      setStatus({ kind: 'idle' });
      onChanged?.();
    } catch (e) {
      const m = String(e.message || e);
      setStatus({ kind: 'error', msg: m === 'bad_pin' ? 'PIN이 틀렸습니다.' : '수정 실패: ' + m });
    }
  };

  return (
    <div className="bookAddModal" role="dialog" aria-modal="true" aria-label="책 관리">
      <button className="bookAddBackdrop" type="button" onClick={onClose} aria-label="닫기" />
      <div className="bookAddPanel">
        <button className="modalClose bookAddClose" type="button" onClick={onClose}>닫기</button>

        {step === 'pin' ? (
          <>
            <h3 className="bookAddTitle">관리자 확인</h3>
            <div className="bookPinBox" aria-label="PIN 입력">
              <div className="bookPinDots" aria-live="polite">
                {Array.from({ length: 4 }).map((_, index) => (
                  <span className={pin.length > index ? 'filled' : ''} key={index} />
                ))}
              </div>
              <div className="bookPinPad">
                {pinKeys.map((key) => (
                  <button
                    type="button"
                    className={key === 'submit' ? 'bookPinSubmit' : ''}
                    key={key}
                    onClick={() => pressPinKey(key)}
                    aria-label={key === 'back' ? '지우기' : key === 'submit' ? '확인' : `${key} 입력`}
                  >
                    {key === 'back' ? '←' : key === 'submit' ? '확인' : key}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="bookAddTitle">책 관리</h3>
            <div className="bookManageTabs" role="tablist" aria-label="책 관리 메뉴">
              <button type="button" className={mode === 'register' ? 'active' : ''} onClick={() => chooseMode('register')}>
                등록
              </button>
              <button type="button" className={mode === 'edit' ? 'active' : ''} onClick={() => chooseMode('edit')}>
                수정
              </button>
              <button type="button" className={mode === 'delete' ? 'active' : ''} onClick={() => chooseMode('delete')}>
                삭제
              </button>
            </div>

            {mode === 'register' ? (
              <>
                <label className="bookAddField">
                  <span>ISBN</span>
                  <div className="bookAddIsbnRow">
                    <input value={isbn} inputMode="numeric" placeholder="9788…(13자리)" autoFocus
                      onChange={(e) => setIsbn(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') lookup(); }} />
                    <button type="button" onClick={scanning ? stopScan : startScan}>{scanning ? '중지' : '📷'}</button>
                    <button type="button" onClick={lookup}>조회</button>
                  </div>
                </label>

                {scanning ? <video ref={videoRef} className="bookAddVideo" muted playsInline /> : null}

                {book ? (
                  <div className="bookAddPreview">
                    <img src={book.cover} alt="" />
                    <div className="bookAddPreviewBody">
                      <strong>{book.title}</strong>
                      <em>{book.author}</em>
                      <label className="bookAddField">
                        <span>표지 URL (옛 판본이면 교체)</span>
                        <input value={book.cover} onChange={(e) => setBook({ ...book, cover: e.target.value })} />
                      </label>
                      <label className="bookAddField">
                        <span>분류</span>
                        <input value={book.category} onChange={(e) => setBook({ ...book, category: e.target.value })} />
                      </label>
                      <button type="button" className="bookAddSave" onClick={save}>등록</button>
                    </div>
                  </div>
                ) : null}
              </>
            ) : mode === 'edit' ? (
              <>
                {!editingBook ? (
                  <div className="bookDeleteList" aria-label="등록된 책 수정">
                    {books.length ? books.map((item) => {
                      const itemIsbn = item.isbn13 || '';
                      return (
                        <div className="bookDeleteItem" key={itemIsbn || item.title}>
                          <img src={item.cover} alt="" loading="lazy" />
                          <span>
                            <strong>{item.title}</strong>
                            <em>{item.author || item.category || itemIsbn}</em>
                          </span>
                          <button type="button" className="edit" onClick={() => beginEdit(item)}>
                            수정
                          </button>
                        </div>
                      );
                    }) : (
                      <p className="bookAddMsg">등록된 책이 없습니다.</p>
                    )}
                  </div>
                ) : (
                  <div className="bookEditForm">
                    <div className="bookEditHeader">
                      <img src={editingBook.cover} alt="" />
                      <span>
                        <strong>{editingBook.title || '제목 없음'}</strong>
                        <em>{editingBook.isbn13}</em>
                      </span>
                    </div>
                    <label className="bookAddField">
                      <span>제목</span>
                      <input value={editingBook.title} onChange={(e) => updateEditingField('title', e.target.value)} />
                    </label>
                    <label className="bookAddField">
                      <span>저자</span>
                      <input value={editingBook.author} onChange={(e) => updateEditingField('author', e.target.value)} />
                    </label>
                    <label className="bookAddField">
                      <span>출판사</span>
                      <input value={editingBook.publisher} onChange={(e) => updateEditingField('publisher', e.target.value)} />
                    </label>
                    <label className="bookAddField">
                      <span>표지 URL</span>
                      <input value={editingBook.cover} onChange={(e) => updateEditingField('cover', e.target.value)} />
                    </label>
                    <label className="bookAddField">
                      <span>분류</span>
                      <input value={editingBook.category} onChange={(e) => updateEditingField('category', e.target.value)} />
                    </label>
                    <div className="bookEditActions">
                      <button type="button" onClick={() => setEditingBook(null)}>목록</button>
                      <button type="button" className="primary" onClick={updateBook}>수정 저장</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bookDeleteList" aria-label="등록된 책 삭제">
                {books.length ? books.map((item) => {
                  const itemIsbn = item.isbn13 || '';
                  const isConfirming = confirmDeleteIsbn === itemIsbn;
                  return (
                    <div className="bookDeleteItem" key={itemIsbn || item.title}>
                      <img src={item.cover} alt="" loading="lazy" />
                      <span>
                        <strong>{item.title}</strong>
                        <em>{item.author || item.category || itemIsbn}</em>
                      </span>
                      <button
                        type="button"
                        className={isConfirming ? 'confirming' : ''}
                        onClick={() => deleteBook(item)}
                      >
                        {isConfirming ? '삭제 확인' : '삭제'}
                      </button>
                    </div>
                  );
                }) : (
                  <p className="bookAddMsg">등록된 책이 없습니다.</p>
                )}
              </div>
            )}
          </>
        )}

        {status.kind === 'loading' ? <p className="bookAddMsg">처리 중…</p> : null}
        {status.kind === 'error' ? <p className="bookAddMsg error">{status.msg}</p> : null}
      </div>
    </div>
  );
}

async function copyContactText(text) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
    }
  }

  if (typeof document === 'undefined') return false;

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.width = '1px';
  textarea.style.height = '1px';
  textarea.style.opacity = '0';

  try {
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const execCommand = Reflect.get(document, 'execCommand');
    return typeof execCommand === 'function' ? execCommand.call(document, 'copy') : false;
  } catch (error) {
    return false;
  } finally {
    textarea.remove();
  }
}

function KakaoContactOverlay({ contact, onClose }) {
  useModalScrollLock();

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
    <div className="kakaoContactModal" role="dialog" aria-modal="true" aria-labelledby="kakao-contact-title">
      <button className="kakaoContactBackdrop" type="button" onClick={onClose} aria-label="닫기" />
      <div className="kakaoContactCard">
        <button className="modalClose kakaoContactClose" type="button" onClick={onClose}>닫기</button>
        <h3 id="kakao-contact-title">카카오톡으로 연락하기</h3>
        <img className="kakaoContactPreview" src="/contact/kakao-card.jpg" alt="카카오톡 연락처 화면" />
        <div className="kakaoContactIdCard" aria-label={`카카오톡 ID ${contact.value}`}>
          <img src={contact.icon} alt="" />
          <span>
            <em>KakaoTalk ID</em>
            <strong>{contact.value}</strong>
          </span>
        </div>
        <p className="kakaoContactHint">카카오톡 친구 추가에서 위 ID를 검색해 주세요.</p>
      </div>
    </div>
  );
}

function EmailContactOverlay({ copyStatus, onClose, onCopy }) {
  useModalScrollLock();

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
    <div className="emailContactModal" role="dialog" aria-modal="true" aria-labelledby="email-contact-title">
      <button className="emailContactBackdrop" type="button" onClick={onClose} aria-label="닫기" />
      <div className="emailContactCard">
        <button className="modalClose emailContactClose" type="button" onClick={onClose}>닫기</button>
        <h3 id="email-contact-title">이메일 주소</h3>
        <div className="emailCopyPanel">
          <strong>{EMAIL_ADDRESS}</strong>
          <button className="emailCopyButton" type="button" onClick={onCopy}>Copy</button>
          {copyStatus?.kind === 'success' ? (
            <span className="emailInlineNotice" role="status">{copyStatus.message}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ContactSection() {
  const [isKakaoOpen, setIsKakaoOpen] = useState(false);
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const emailStatusTimerRef = useRef(null);
  const kakaoContact = contactLinks.find((item) => item.id === 'kakao');

  useEffect(() => () => {
    if (emailStatusTimerRef.current) window.clearTimeout(emailStatusTimerRef.current);
  }, []);

  const showEmailStatus = (status) => {
    if (emailStatusTimerRef.current) window.clearTimeout(emailStatusTimerRef.current);
    setEmailStatus(status);
    emailStatusTimerRef.current = window.setTimeout(() => setEmailStatus(null), 1000);
  };

  const handleEmailCopy = async () => {
    const copied = await copyContactText(EMAIL_ADDRESS);

    showEmailStatus(copied ? { kind: 'success', message: '이메일주소를 복사했습니다.' } : {
      kind: 'error',
      message: '복사에 실패했습니다. 아래 이메일 주소를 직접 복사해 주세요.',
    });
  };

  return (
    <section className="contactSection" id="contact">
      <div className="sectionTitle">
        <p className="eyebrow sectionEyebrowLarge">Contact</p>
        <p>필요한 이야기가 있다면 언제든 연락 주세요.</p>
      </div>
      <ul className="contactList">
        {contactLinks.map((item) => (
          <li className="contactItem" key={item.id}>
            {item.href ? (
              <a className={`contactIcon contactIcon-${item.id}`} href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                <img src={item.icon} alt={item.label} />
              </a>
            ) : (
              <button
                className={`contactIcon contactIcon-${item.id}`}
                type="button"
                aria-label={item.id === 'email' ? '이메일 주소 열기' : 'KakaoTalk 연락처 열기'}
                aria-describedby={item.id === 'email' && emailStatus ? 'contact-email-status' : undefined}
                aria-expanded={item.id === 'kakao' ? isKakaoOpen : item.id === 'email' ? isEmailOpen : undefined}
                aria-haspopup={item.id === 'kakao' || item.id === 'email' ? 'dialog' : undefined}
                onClick={item.id === 'email' ? () => setIsEmailOpen(true) : () => setIsKakaoOpen(true)}
              >
                <img src={item.icon} alt={item.label} />
              </button>
            )}
          </li>
        ))}
      </ul>
      {emailStatus?.kind === 'error' ? (
        <div className={`contactToast ${emailStatus.kind}`} id="contact-email-status" role="status">
          {emailStatus.message}
          <strong>{EMAIL_ADDRESS}</strong>
        </div>
      ) : null}
      {isEmailOpen ? (
        <EmailContactOverlay
          copyStatus={emailStatus}
          onClose={() => setIsEmailOpen(false)}
          onCopy={handleEmailCopy}
        />
      ) : null}
      {isKakaoOpen && kakaoContact ? <KakaoContactOverlay contact={kakaoContact} onClose={() => setIsKakaoOpen(false)} /> : null}
    </section>
  );
}

function ProjectTeaserVisual({ image, kind, label, teaser, type }) {
  return (
    <span className={`projectTeaserVisual ${kind ? `projectVisual-${kind}` : ''}`} aria-hidden="true">
      <span className="projectVisualPane" style={image ? { '--project-image': `url("${image}")` } : undefined}>
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
      </span>
      <span className="projectExplanation" aria-hidden="true">
        <strong>{teaser}</strong>
      </span>
    </span>
  );
}

const showcaseAnchorIds = ['career-crm', 'career-japan', 'career-education'];

function ShowcaseImageGrid({ activeShowcaseIndex, onSelectShowcase, viewedShowcaseIndexes }) {
  return (
    <section className="showcaseImagePanel" aria-label="Experience / Background">
      <div className="showcaseImageGrid">
        {showcaseItems.map((item, index) => {
          const isActive = activeShowcaseIndex === index;
          const isViewed = viewedShowcaseIndexes.has(index);
          const statusLabel = isActive ? '열람중' : isViewed ? '확인완료' : '';

          return (
            <button
              className={[
                'showcaseImageCard',
                isActive ? 'active' : '',
                isViewed ? 'viewed' : '',
              ].filter(Boolean).join(' ')}
              id={showcaseAnchorIds[index]}
              key={item.title}
              onClick={() => onSelectShowcase(index)}
              type="button"
              aria-label={statusLabel ? `${item.title} ${statusLabel}` : item.title}
            >
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
          );
        })}
      </div>
    </section>
  );
}



function ShowcaseDetailModal({ item, onClose, onNext, onPrevious }) {
  useModalScrollLock();
  const modalRef = useRef(null);
  useModalFocusTrap(modalRef);
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
    <div className="showcaseDetailModal" role="dialog" aria-modal="true" aria-label={`${item.title} 상세 보기`} ref={modalRef} tabIndex={-1}>
      <div className="showcaseDetailBackdrop" aria-hidden="true" />
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
              {item.isContact ? (
                <ul className="showcaseContactList">
                  {contactLinks.map((contact) => {
                    const body = (
                      <>
                        <img src={contact.icon} alt="" />
                        <span className="showcaseContactText">
                          <strong>{contact.label}</strong>
                          {contact.valueHref ? (
                            <a href={contact.valueHref}>{contact.value}</a>
                          ) : (
                            <em>{contact.value}</em>
                          )}
                        </span>
                      </>
                    );
                    return (
                      <li className="showcaseContactRow" key={contact.id}>
                        {contact.href ? (
                          <a className="showcaseContactLink" href={contact.href} target="_blank" rel="noreferrer">
                            {body}
                          </a>
                        ) : (
                          <div className="showcaseContactLink">{body}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div>
                  {paragraphs.map((paragraph, index) => (
                    <p key={`${item.title}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="modalHintCapsule"><span className="hintKey">←</span><span className="hintKey">→</span> 이동&nbsp;&nbsp;·&nbsp;&nbsp;<span className="hintKey">ESC</span> 나가기</p>
      </div>
    </div>
  );
}

function ProjectDetailModal({ children, onClose, project }) {
  useModalScrollLock();
  const modalRef = useRef(null);
  useModalFocusTrap(modalRef);
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
    <div className="projectDetailModal" role="dialog" aria-modal="true" aria-label={`${project.label} 상세 보기`} ref={modalRef} tabIndex={-1}>
      <div className="projectDetailBackdrop" aria-hidden="true" />
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
  const [screenshotEdgeNotice, setScreenshotEdgeNotice] = useState(null);

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

  useEffect(() => {
    if (!screenshotEdgeNotice) return undefined;

    const noticeTimer = window.setTimeout(() => {
      setScreenshotEdgeNotice(null);
    }, 1400);

    return () => window.clearTimeout(noticeTimer);
  }, [screenshotEdgeNotice]);

  const moveScreenshot = (direction) => {
    if (!selectedScreenshot) return;

    const total = project.screenshots.length;
    const nextIndex = (selectedScreenshot.index + direction + total) % total;

    const [title, caption, src] = project.screenshots[nextIndex];

    setScreenshotEdgeNotice(null);
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
        setSelectedScreenshot={(item) => {
          setScreenshotEdgeNotice(null);
          setSelectedScreenshot(item);
        }}
      />

      {selectedScreenshot ? (
        <ScreenshotModal
          edgeNotice={screenshotEdgeNotice}
          project={project}
          screenshot={selectedScreenshot}
          onClose={() => {
            setScreenshotEdgeNotice(null);
            setSelectedScreenshot(null);
          }}
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
  const briefLabels = project.briefLabels || ['기존의 문제점', '구현한 것', '고민했던 부분'];
  const briefItems = [
    [briefLabels[0], project.problem],
    [briefLabels[1], project.solution],
    [briefLabels[2], project.learned],
  ];
  return (
    <section
      className={`projectBrief projectBrief-${project.id}`}
      id={`project-brief-${project.id}`}
      aria-label={`${project.label} 데모와 문제 해결 요약`}
    >
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

function ScreenshotModal({ edgeNotice, project, screenshot, onClose, onNext, onPrevious }) {
  useModalScrollLock();
  const modalRef = useRef(null);
  const touchStartRef = useRef(null);
  const shouldFillFrame = screenshot.index > 0 && screenshot.index < 5;
  const isLegacyFrame = screenshot.index === 0 || screenshot.index === project.screenshots.length - 1;
  const isMobileScreenshotViewport = () => (
    window.matchMedia?.('(max-width: 760px)').matches ?? window.innerWidth <= 760
  );

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

  useModalFocusTrap(modalRef);

  const handleMediaPointerDown = (event) => {
    if (event.pointerType !== 'touch' || !isMobileScreenshotViewport()) return;
    touchStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      id: event.pointerId,
    };
  };

  const handleMediaPointerUp = (event) => {
    if (!isMobileScreenshotViewport()) {
      touchStartRef.current = null;
      return;
    }

    const touchStart = touchStartRef.current;
    if (!touchStart || touchStart.id !== event.pointerId) return;

    touchStartRef.current = null;

    const deltaX = event.clientX - touchStart.x;
    const deltaY = event.clientY - touchStart.y;
    const isHorizontalSwipe = Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;

    if (isHorizontalSwipe) {
      if (deltaX < 0) {
        onNext();
      } else {
        onPrevious();
      }
      return;
    }

    if (Math.abs(deltaX) < 12 && Math.abs(deltaY) < 12) {
      onClose();
    }
  };

  const handleMediaPointerCancel = () => {
    touchStartRef.current = null;
  };

  return (
    <div className="screenshotModal" role="dialog" aria-modal="true" aria-label={`${screenshot.title} 크게 보기`} ref={modalRef} tabIndex={-1}>
      <div className="screenshotBackdrop" aria-hidden="true" />
      <div className="screenshotRotateNotice">
        <button className="modalClose screenshotRotateClose" onClick={onClose} type="button">닫기</button>
        <p className="eyebrow">{project.label}</p>
        <h4>가로모드로 사진을 크게 볼 수 있습니다.</h4>
        <p>휴대폰을 가로로 돌리면 설명 없이 사진만 화면에 맞춰 보여줍니다.</p>
      </div>
      <div className="screenshotModalStack">
        <div className="screenshotModalShell">
          <button className="modalNav modalNavPrevious" onClick={onPrevious} type="button" aria-label="이전 사진 보기">
            &lt;
          </button>
          <button className="modalNav modalNavNext" onClick={onNext} type="button" aria-label="다음 사진 보기">
            &gt;
          </button>
          <div className={[
              'screenshotDialog',
              shouldFillFrame ? 'fillModal' : '',
              isLegacyFrame ? 'legacyModal' : '',
            ].filter(Boolean).join(' ')}>
            <div className="modalWindowBar" aria-hidden="true">
              <span className="modalWindowControl modalWindowClose" />
              <span className="modalWindowControl modalWindowMinimize" />
              <span className="modalWindowControl modalWindowZoom" />
              <strong>{project.label}</strong>
            </div>
            <button className="modalClose" onClick={onClose} type="button">닫기</button>
            <div
              className="modalMedia"
              onPointerCancel={handleMediaPointerCancel}
              onPointerDown={handleMediaPointerDown}
              onPointerUp={handleMediaPointerUp}
            >
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
              {edgeNotice ? (
                <p className="modalEdgeNotice" key={edgeNotice.key} role="status" aria-live="polite">
                  {edgeNotice.message}
                </p>
              ) : null}
            </div>
            <div className="modalCaption">
              <p className="eyebrow">{project.label}</p>
              <h4>{screenshot.title}</h4>
              <p>{screenshot.caption}</p>
              <p className="modalProjectTeaser">{project.teaser}</p>
            </div>
          </div>
        </div>
        <p className="modalHintCapsule"><span className="hintKey">←</span><span className="hintKey">→</span> 이동&nbsp;&nbsp;·&nbsp;&nbsp;<span className="hintKey">ESC</span> 나가기</p>
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
