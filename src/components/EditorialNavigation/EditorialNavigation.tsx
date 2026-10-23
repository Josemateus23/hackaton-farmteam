import React, { useState, useEffect, useCallback } from 'react';
import styles from './EditorialNavigation.module.css';

interface ChapterItem {
  id: string;
  num: string;
  title: string;
}

const CHAPTERS: ChapterItem[] = [
  { id: 'top', num: '00', title: 'Abertura' },
  { id: 'proximo-capitulo', num: '01', title: 'Mato Grosso' },
  { id: 'capitulo-otto', num: '02', title: 'Robô Otto' },
  { id: 'caminhos', num: '03', title: 'Meninas Digitais' },
  { id: 'encerramento', num: '04', title: 'Encerramento' },
];

interface EditorialNavigationProps {
  isStaticMode: boolean;
  onToggleStaticMode: () => void;
}

export const EditorialNavigation: React.FC<EditorialNavigationProps> = ({
  isStaticMode,
  onToggleStaticMode,
}) => {
  const [activeChapter, setActiveChapter] = useState('top');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Monitor scroll for active section & progress
  const updateScrollSpy = useCallback(() => {
    const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
    const currentScroll = window.scrollY;
    const progress = totalScrollable > 0 ? (currentScroll / totalScrollable) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));

    // Detect active chapter based on viewport position
    const viewportMiddle = currentScroll + window.innerHeight * 0.35;

    let currentActive = 'top';
    for (const ch of CHAPTERS) {
      if (ch.id === 'top') continue;
      const el = document.getElementById(ch.id);
      if (el) {
        const top = el.offsetTop;
        if (viewportMiddle >= top - 80) {
          currentActive = ch.id;
        }
      }
    }
    setActiveChapter(currentActive);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', updateScrollSpy, { passive: true });
    updateScrollSpy();
    return () => window.removeEventListener('scroll', updateScrollSpy);
  }, [updateScrollSpy]);

  // Navigate to chapter smoothly
  const handleNavClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    if (targetId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.pushState(null, '', '#');
      return;
    }

    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      const navOffset = 64;
      const targetTop = targetEl.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
      window.history.pushState(null, '', `#${targetId}`);
    }
  };

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <nav className={styles.navHeader} aria-label="Índice de Capítulos Editorial">
      <div className={styles.navContainer}>
        {/* Brand Link */}
        <a
          href="#top"
          className={styles.brandGroup}
          onClick={(e) => handleNavClick(e, 'top')}
          aria-label="Ir para o início da experiência"
        >
          <span className={styles.brandLogoMark} aria-hidden="true">FT</span>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>Farm Team</span>
            <span className={styles.brandSub}>Mato Grosso • V3</span>
          </div>
        </a>

        {/* Desktop Chapter Anchors */}
        <ul className={styles.chaptersList} role="menubar">
          {CHAPTERS.map((ch) => {
            const isActive = activeChapter === ch.id;
            return (
              <li key={ch.id} className={styles.chapterItem} role="none">
                <a
                  href={`#${ch.id}`}
                  role="menuitem"
                  className={`${styles.chapterLink} ${isActive ? styles.chapterLinkActive : ''}`}
                  onClick={(e) => handleNavClick(e, ch.id)}
                  aria-current={isActive ? 'true' : undefined}
                >
                  <span className={styles.chapterNum}>{ch.num}</span>
                  <span>{ch.title}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* Controls Group */}
        <div className={styles.controlsGroup}>
          {/* Static Mode / Read Without Animations Toggle */}
          <button
            type="button"
            className={`${styles.staticToggleBtn} ${isStaticMode ? styles.staticToggleBtnActive : ''}`}
            onClick={onToggleStaticMode}
            aria-pressed={isStaticMode}
            title={isStaticMode ? 'Reativar animações cinematográficas' : 'Ler história em formato contínuo sem animações'}
          >
            <span className={styles.staticToggleDot} aria-hidden="true" />
            <span>{isStaticMode ? 'Animações: Off' : 'Sem animações'}</span>
          </button>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? 'Fechar menu de capítulos' : 'Abrir menu de capítulos'}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mini Progress Bar */}
      <div
        className={styles.navProgressBar}
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-modal="true" aria-label="Menu de Navegação">
          <ul className={styles.mobileChapterList}>
            {CHAPTERS.map((ch) => {
              const isActive = activeChapter === ch.id;
              return (
                <li key={ch.id}>
                  <a
                    href={`#${ch.id}`}
                    className={`${styles.mobileChapterLink} ${isActive ? styles.mobileChapterLinkActive : ''}`}
                    onClick={(e) => handleNavClick(e, ch.id)}
                    aria-current={isActive ? 'true' : undefined}
                  >
                    <span>{ch.title}</span>
                    <span className={styles.chapterNum}>{ch.num}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
};
