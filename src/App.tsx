import React from 'react';
import { EditorialHero } from './components/EditorialHero/EditorialHero';
import { MatoGrossoChapter } from './components/MatoGrossoChapter/MatoGrossoChapter';
import { OttoChapter } from './components/OttoChapter/OttoChapter';
import { CaminhosChapter } from './components/CaminhosChapter/CaminhosChapter';
import { EncerramentoSection } from './components/EncerramentoSection/EncerramentoSection';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const App: React.FC = () => {
  React.useEffect(() => {
    // Ensure all pinned scenes are evaluated in exact DOM sequence
    ScrollTrigger.sort();
    ScrollTrigger.refresh();

    if (window.location.hash === '#proximo-capitulo') {
      const target = document.getElementById('proximo-capitulo');
      if (target) {
        target.scrollIntoView({ behavior: 'instant' as ScrollBehavior });
      }
    }
  }, []);

  const isChapterPreview = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('previewChapter') === 'true';

  return (
    <div className="editorial-app-root">
      {/* Accessible skip link for keyboard & screen readers */}
      <a href="#proximo-capitulo" className="skip-link">
        Pular abertura para o conteúdo
      </a>

      {/* Main Narrative Hero Sequence with scroll-driven frames */}
      <main>
        {isChapterPreview ? (
          <>
            <MatoGrossoChapter />
            <OttoChapter />
            <CaminhosChapter />
            <EncerramentoSection />
            <EditorialHero />
          </>
        ) : (
          <>
            <EditorialHero />
            <MatoGrossoChapter />
            <OttoChapter />
            <CaminhosChapter />
            <EncerramentoSection />
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
          Mulheres e Meninas na Tecnologia em Mato Grosso • Hackathon High Tech
        </p>
      </footer>
    </div>
  );
};

export default App;
