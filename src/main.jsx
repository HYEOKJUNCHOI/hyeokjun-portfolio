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
// GitHub·Brunch = 바로 링크 / Email·Kakao = 값 표시(이메일은 mailto).
const contactLinks = [
  { id: 'github', label: 'GitHub', icon: '/contact/github.png', href: 'https://github.com/HYEOKJUNCHOI?tab=repositories', value: 'github.com/HYEOKJUNCHOI' },
  { id: 'brunch', label: 'Brunch', icon: '/contact/brunch.png', href: 'https://brunch.co.kr/@solbin369', value: 'brunch.co.kr/@solbin369' },
  { id: 'email', label: 'Email', icon: '/contact/email.png', value: 'gurwns369@naver.com', valueHref: 'mailto:gurwns369@naver.com' },
  { id: 'kakao', label: 'KakaoTalk', icon: '/contact/kakao.png', value: 'gurwns369' },
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
              <span className="heroTitleLine">
                <span className="heroTitlePlain">저는 </span>
                <span className="heroTitleOpening">반복되는 불편함</span>
                <span className="heroTitlePlain">을</span>
              </span>
              <span className="heroTitleLine heroTitlePlain">그냥 지나치지 않습니다.</span>
            </h1>
            <div className="heroLead heroLeadStacked">
              <p><span className="heroLeadWhite">손을 더 빠르게<br className="heroMobileBreak" /> 움직이기보다,</span></p>
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

        {isDetailOpen && activeProject ? (
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

function TechStackPanel() {
  return (
    <section className="techStackPanel" aria-label="보유 기술 및 도구">
      <div className="techStackGlass">
        <img className="techStackMap" src="/showcase/히어로이미지.png" alt="기술 흐름을 연결한 포트폴리오 히어로 이미지" />
      </div>
    </section>
  );
}

function LibrarySection() {
  // 카테고리는 '정렬 기준'으로만 사용 — 같은 분류끼리 모여 한 책장에 쭉 진열.
  // seed = 폴백. Firestore 'shelf'에 데이터 있으면 그걸로 교체.
  const seedBooks = useMemo(() => libraryGroups.flatMap((group) => group.books), []);
  const [books, setBooks] = useState(seedBooks);
  const [addOpen, setAddOpen] = useState(false);
  const loadShelf = () => {
    getDocs(collection(db, 'shelf'))
      .then((snap) => {
        if (snap.empty) return;
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
            <button type="button" className="libraryAddBtn" onClick={() => setAddOpen(true)} aria-label="책 등록">
              <span aria-hidden="true">+</span>
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
          onClose={() => setAddOpen(false)}
          onAdded={() => { setAddOpen(false); loadShelf(); }}
        />
      ) : null}
    </section>
  );
}

function BookAddModal({ onClose, onAdded }) {
  // PIN → ISBN(카메라/입력) → 조회 → 표지·분류 확인/교체 → 등록.
  // 조회/저장은 /api/book-lookup, /api/book-save (Vercel 서버리스). 로컬 vite dev 에선 동작 X.
  const [pin, setPin] = useState('');
  const [isbn, setIsbn] = useState('');
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState({ kind: 'idle' });
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);

  const stopScan = () => {
    try { controlsRef.current?.stop(); } catch (e) { /* no-op */ }
    controlsRef.current = null;
    setScanning(false);
  };
  useEffect(() => () => stopScan(), []);

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
    if (!pin) { setStatus({ kind: 'error', msg: 'PIN을 입력하세요.' }); return; }
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

  return (
    <div className="bookAddModal" role="dialog" aria-modal="true" aria-label="책 등록">
      <button className="bookAddBackdrop" type="button" onClick={onClose} aria-label="닫기" />
      <div className="bookAddPanel">
        <button className="modalClose bookAddClose" type="button" onClick={onClose}>닫기</button>
        <h3 className="bookAddTitle">책 등록</h3>

        <label className="bookAddField">
          <span>PIN</span>
          <input type="password" value={pin} inputMode="numeric" placeholder="••••"
            onChange={(e) => setPin(e.target.value)} />
        </label>

        <label className="bookAddField">
          <span>ISBN</span>
          <div className="bookAddIsbnRow">
            <input value={isbn} inputMode="numeric" placeholder="9788…(13자리)"
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

        {status.kind === 'loading' ? <p className="bookAddMsg">처리 중…</p> : null}
        {status.kind === 'error' ? <p className="bookAddMsg error">{status.msg}</p> : null}
      </div>
    </div>
  );
}

function ContactSection() {
  // GitHub·Brunch = 바로 링크 / Email·Kakao = 클릭하면 주소를 아이콘 옆에 표시.
  const [revealed, setRevealed] = useState(null);

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
              <a className="contactIcon" href={item.href} target="_blank" rel="noreferrer" aria-label={item.label}>
                <img src={item.icon} alt={item.label} />
              </a>
            ) : (
              <button
                className="contactIcon"
                type="button"
                aria-label={`${item.label} 주소 보기`}
                aria-expanded={revealed === item.id}
                onClick={() => setRevealed((current) => (current === item.id ? null : item.id))}
              >
                <img src={item.icon} alt={item.label} />
              </button>
            )}
            {item.value && revealed === item.id ? (
              item.valueHref ? (
                <a className="contactValue" href={item.valueHref}>{item.value}</a>
              ) : (
                <span className="contactValue">{item.value}</span>
              )
            ) : null}
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
