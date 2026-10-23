import React, { useState, useEffect, useCallback } from 'react';
import { EditorialNavigation } from './components/EditorialNavigation/EditorialNavigation';
import { EditorialHero } from './components/EditorialHero/EditorialHero';
import { MatoGrossoChapter } from './components/MatoGrossoChapter/MatoGrossoChapter';
import { OttoChapter } from './components/OttoChapter/OttoChapter';
import { CaminhosChapter } from './components/CaminhosChapter/CaminhosChapter';
import { EncerramentoSection } from './components/EncerramentoSection/EncerramentoSection';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const App: React.FC = () => {
  // Initialize static mode based on media query or URL parameter
  const [isStaticMode, setIsStaticMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('static') === 'true') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const toggleStaticMode = useCallback(() => {
    setIsStaticMode((prev) => {
      const next = !prev;
      setTimeout(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      }, 60);
      return next;
    });
  }, []);

  useEffect(() => {
    // Ensure all pinned scenes are evaluated in exact DOM sequence
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    if (window.location.hash) {
      const target = document.getElementById(window.location.hash.substring(1));
      if (target) {
        target.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      }
    }
  }, []);

  const isChapterPreview =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('previewChapter') === 'true';

  return (
    <div className={`editorial-app-root ${isStaticMode ? 'static-mode' : ''}`}>
      {/* Editorial Chapter Navigation & Static Mode Toggle Bar */}
      <EditorialNavigation
        isStaticMode={isStaticMode}
        onToggleStaticMode={toggleStaticMode}
      />

      {/* Accessible skip link for keyboard & screen readers */}
      <a href="#proximo-capitulo" className="skip-link">
        Pular abertura para o conteúdo
      </a>

      {/* Main Narrative Hero Sequence with scroll-driven frames */}
      <main id="top" style={{ paddingTop: '52px' }}>
        {isChapterPreview ? (
          <>
            <MatoGrossoChapter isStaticMode={isStaticMode} />
            <OttoChapter isStaticMode={isStaticMode} />
            <CaminhosChapter isStaticMode={isStaticMode} />
            <EncerramentoSection isStaticMode={isStaticMode} />
            <EditorialHero isStaticMode={isStaticMode} />
          </>
        ) : (
          <>
            <EditorialHero isStaticMode={isStaticMode} />
            <MatoGrossoChapter isStaticMode={isStaticMode} />
            <OttoChapter isStaticMode={isStaticMode} />
            <CaminhosChapter isStaticMode={isStaticMode} />
            <EncerramentoSection isStaticMode={isStaticMode} />
          </>
        )}
      </main>

      {/* Editorial Footer */}
      <footer
        style={{
          backgroundColor: 'var(--color-ink)',
          borderTop: '1px solid rgba(244, 227, 203, 0.12)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          fontFamily: 'var(--font-body)',
          fontSize: '0.8125rem',
          color: '#a89f91',
        }}
      >
        <p>
          Mulheres e Meninas na Tecnologia em Mato Grosso • Equipe Farm Team • Hackathon 2026
        </p>
      </footer>
    </div>
  );
};

export default App;
