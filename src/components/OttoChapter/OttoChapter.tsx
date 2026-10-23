import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionConfig } from '../../config/motionConfig';
import styles from './OttoChapter.module.css';

gsap.registerPlugin(ScrollTrigger);

interface OttoChapterProps {
  className?: string;
  isStaticMode?: boolean;
}

export const OttoChapter: React.FC<OttoChapterProps> = ({ className, isStaticMode = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);

  // Moments layers refs
  const moment1Ref = useRef<HTMLDivElement>(null);
  const moment2Ref = useRef<HTMLDivElement>(null);
  const moment3Ref = useRef<HTMLDivElement>(null);

  // Sequential pillars refs
  const pillar1Ref = useRef<HTMLDivElement>(null);
  const pillar2Ref = useRef<HTMLDivElement>(null);
  const pillar3Ref = useRef<HTMLDivElement>(null);

  // Illustration ref
  const ottoImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isStaticMode) {
      // In static mode, display all moments and pillars cleanly without pinning
      const m1 = moment1Ref.current;
      const m2 = moment2Ref.current;
      const m3 = moment3Ref.current;
      const img = ottoImageRef.current;
      gsap.set([m1, m2, m3], { opacity: 1, y: 0, visibility: 'visible', pointerEvents: 'auto' });
      gsap.set([pillar1Ref.current, pillar2Ref.current, pillar3Ref.current], { opacity: 1, x: 0 });
      gsap.set(img, { scale: 1.0, y: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    // 1. DESKTOP SCENE (3 Momentos Pinned Narrative)
    mm.add(`(min-width: ${motionConfig.breakpoints.desktopMin}px)`, () => {
      const section = sectionRef.current;
      const stage = pinStageRef.current;
      if (!section || !stage) return;

      const m1 = moment1Ref.current;
      const m2 = moment2Ref.current;
      const m3 = moment3Ref.current;
      const img = ottoImageRef.current;

      // Initial State
      gsap.set(m1, { opacity: 1, y: 0, visibility: 'visible', pointerEvents: 'auto' });
      gsap.set(m2, { opacity: 0, y: 20, visibility: 'hidden', pointerEvents: 'none' });
      gsap.set(m3, { opacity: 0, y: 20, visibility: 'hidden', pointerEvents: 'none' });
      gsap.set(img, { scale: 1.0, y: 0 });

      // Initial state of pillar rows
      gsap.set([pillar1Ref.current, pillar2Ref.current, pillar3Ref.current], { opacity: 0, x: -16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (motionConfig.desktopScroll.ottoExtraVh / 100)}`,
          pin: stage,
          pinSpacing: true,
          scrub: motionConfig.scrubSmoothing,
          anticipatePin: 1,
        },
      });

      // --- MOMENTO 1: Apresentação & Pesquisadoras (0.00 -> 0.28) ---
      tl.to({}, { duration: 0.28 });

      // --- TRANSIÇÃO MOMENTO 1 -> MOMENTO 2 (0.28 -> 0.38) ---
      tl.to(m1, { opacity: 0, y: -20, visibility: 'hidden', pointerEvents: 'none', duration: 0.1, ease: 'power2.in' }, 0.28)
        .set(m2, { visibility: 'visible', pointerEvents: 'auto' }, 0.30)
        .to(m2, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.30)
        // Câmera estável sem cortar mão levantada ou cabeça do Otto
        .to(img, { scale: 1.01, y: 0, duration: 0.14, ease: 'power2.inOut' }, 0.28);

      // --- MOMENTO 2: Entrada Sequencial dos Três Pilares Técnicos (0.36 -> 0.52) ---
      tl.to(pillar1Ref.current, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.36)
        .to(pillar2Ref.current, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.42)
        .to(pillar3Ref.current, { opacity: 1, x: 0, duration: 0.08, ease: 'power2.out' }, 0.48);

      // Intervalo de leitura do Momento 2 (0.50 -> 0.70)
      tl.to({}, { duration: 0.20 }, 0.50);

      // --- TRANSIÇÃO MOMENTO 2 -> MOMENTO 3 (0.70 -> 0.80) ---
      tl.to(m2, { opacity: 0, y: -20, visibility: 'hidden', pointerEvents: 'none', duration: 0.1, ease: 'power2.in' }, 0.70)
        .set(m3, { visibility: 'visible', pointerEvents: 'auto' }, 0.72)
        .to(m3, { opacity: 1, y: 0, duration: 0.12, ease: 'power2.out' }, 0.72)
        // Câmera retorna ao enquadramento pleno
        .to(img, { scale: 1.0, y: 0, duration: 0.14, ease: 'power2.inOut' }, 0.70);

      // --- MOMENTO 3: Leitura e Saída da Ponte Narrativa (0.80 -> 1.00) ---
      tl.to({}, { duration: 0.20 }, 0.80);
    });

    // 2. MOBILE SCENE (Fluxo vertical normal)
    mm.add(`(max-width: ${motionConfig.breakpoints.mobileMax}px)`, () => {
      // Elements are presented in natural document flow
    });

    return () => {
      mm.revert();
    };
  }, [isStaticMode]);

  return (
    <section
      id="capitulo-otto"
      ref={sectionRef}
      className={`${styles.chapterSection} ${className || ''}`}
      aria-labelledby="otto-chapter-title"
    >
      <div ref={pinStageRef} className={styles.pinnedStage}>
        {/* Editorial top hairline transition separator with registration marks */}
        <div className={styles.editorialDivider} aria-hidden="true">
          <span className={styles.registrationMark}>+</span>
          <div className={styles.dividerLine} />
          <span className={styles.rubricText}>CAPÍTULO DE PROTÓTIPO & PESQUISA</span>
          <div className={styles.dividerLine} />
          <span className={styles.registrationMark}>+</span>
        </div>

        <div className={styles.container}>
          {/* Main Stage: Desktop 2-column asymmetric grid, Mobile stacked */}
          <div className={styles.heroStage}>
            {/* Left Narrative Column with 3 Coordinated Moments */}
            <div className={styles.momentsContainer}>
              {/* MOMENTO 1: Apresentação & Pesquisadoras */}
              <div ref={moment1Ref} className={`${styles.momentLayer} ${styles.moment1Layer}`}>
                <div className={styles.markerBadge}>
                  <span className={styles.markerDot} aria-hidden="true" />
                  <span className={styles.markerText}>02 / TECNOLOGIA ASSISTIVA</span>
                </div>

                <h2 id="otto-chapter-title" className={styles.headline}>
                  Elas dão forma à tecnologia.
                </h2>

                <p className={styles.leadText}>
                  Na UFMT, professoras e estudantes participaram do desenvolvimento do Otto, um robô pensado para
                  apoiar atividades de comunicação e aprendizagem em sessões terapêuticas com crianças autistas.
                </p>

                <div className={styles.documentNote}>
                  <span className={styles.documentIcon} aria-hidden="true">¶</span>
                  <span>Recorte documental: pesquisa divulgada em janeiro de 2023.</span>
                </div>

                <div className={styles.protagonistasCard}>
                  <div className={styles.protagonistasHeader}>
                    <span className={styles.protagonistasLabel}>PROTAGONISTAS DO PROJETO</span>
                    <span className={styles.protagonistasContext}>UFMT • Pesquisa Aplicada</span>
                  </div>
                  <ul className={styles.protagonistasList}>
                    <li className={styles.protagonistItem}>
                      <strong>Thais Reggina Kempner</strong> — coordenação da pesquisa descrita pela FAPEMAT em 2023.
                    </li>
                    <li className={styles.protagonistItem}>
                      <strong>Luciana Borges e Eunice Nunes</strong> — professoras participantes da pesquisa.
                    </li>
                    <li className={styles.protagonistItem}>
                      Estudantes da graduação e do ensino médio também participaram do projeto.
                    </li>
                  </ul>
                </div>
              </div>

              {/* MOMENTO 2: Pilares Técnicos Sequenciais */}
              <div ref={moment2Ref} className={`${styles.momentLayer} ${styles.moment2Layer}`}>
                <div className={styles.sequentialPillarsCard}>
                  <header className={styles.pillarsCardHeader}>
                    <span aria-hidden="true">⚙</span>
                    <span>PILARES DE DESENVOLVIMENTO TÉCNICO</span>
                  </header>

                  <div className={styles.pillarsList}>
                    {/* Pilar 1 */}
                    <div ref={pillar1Ref} className={styles.pillarRow}>
                      <div className={styles.pillarRowHeader}>
                        <span className={styles.pillarIndex}>01</span>
                        <h3 className={styles.pillarTitle}>Interação</h3>
                      </div>
                      <div className={styles.pillarRule} aria-hidden="true" />
                      <p className={styles.pillarDescription}>
                        Botões e conteúdos sonoros para atividades educativas.
                      </p>
                    </div>

                    {/* Pilar 2 */}
                    <div ref={pillar2Ref} className={styles.pillarRow}>
                      <div className={styles.pillarRowHeader}>
                        <span className={styles.pillarIndex}>02</span>
                        <h3 className={styles.pillarTitle}>Expressão</h3>
                      </div>
                      <div className={styles.pillarRule} aria-hidden="true" />
                      <p className={styles.pillarDescription}>
                        LEDs e movimentos como recursos de interação.
                      </p>
                    </div>

                    {/* Pilar 3 */}
                    <div ref={pillar3Ref} className={styles.pillarRow}>
                      <div className={styles.pillarRowHeader}>
                        <span className={styles.pillarIndex}>03</span>
                        <h3 className={styles.pillarTitle}>Desenvolvimento</h3>
                      </div>
                      <div className={styles.pillarRule} aria-hidden="true" />
                      <p className={styles.pillarDescription}>
                        Integração de programação, eletrônica e modelagem do protótipo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MOMENTO 3: Pergunta e Ponte Narrativa */}
              <div ref={moment3Ref} className={`${styles.momentLayer} ${styles.moment3Layer}`}>
                <div className={styles.bridgeCard}>
                  <div className={styles.bridgeDivider} aria-hidden="true" />
                  <blockquote className={styles.bridgeQuote}>
                    “Como abrir caminhos para que outras meninas também criem?”
                  </blockquote>
                  <a href="#caminhos" className={styles.bridgeActionLink}>
                    <span>Ver caminhos para começar</span>
                    <span aria-hidden="true">↓</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Otto Stage Column (Visual Anchor) */}
            <div className={styles.imageColumn}>
              <div className={styles.imageFrame}>
                {/* Corner registration crosshairs */}
                <span className={`${styles.cornerCrosshair} ${styles.cornerTopLeft}`} aria-hidden="true">+</span>
                <span className={`${styles.cornerCrosshair} ${styles.cornerTopRight}`} aria-hidden="true">+</span>
                <span className={`${styles.cornerCrosshair} ${styles.cornerBottomLeft}`} aria-hidden="true">+</span>
                <span className={`${styles.cornerCrosshair} ${styles.cornerBottomRight}`} aria-hidden="true">+</span>

                {/* Technical rubric header */}
                <div className={styles.frameTechnicalHeader} aria-hidden="true">
                  <span>ILUSTRAÇÃO DO PROTÓTIPO</span>
                  <span>REGISTRO DOCUMENTAL FAPEMAT / UFMT</span>
                </div>

                {/* Responsive Container for complete, unclipped robot */}
                <div className={styles.imageContainer}>
                  <img
                    ref={ottoImageRef}
                    src="/images/otto-capitulo-hq.png"
                    alt="Ilustração do protótipo assistivo Otto em bancada de testes com circuitos eletrônicos e ferramentas"
                    className={styles.ottoImage}
                    loading="lazy"
                  />
                </div>

                {/* Image Caption */}
                <figcaption className={styles.imageCaption}>
                  Ilustração baseada em fotografia do protótipo publicada pela FAPEMAT. Ambiente conceitual.
                </figcaption>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
