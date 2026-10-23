import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionConfig } from '../../config/motionConfig';
import styles from './CaminhosChapter.module.css';

gsap.registerPlugin(ScrollTrigger);

interface CaminhosChapterProps {
  className?: string;
  isStaticMode?: boolean;
}

export const CaminhosChapter: React.FC<CaminhosChapterProps> = ({ className, isStaticMode = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);

  // Animated elements
  const redBandRef = useRef<HTMLDivElement>(null);
  const blackCurtainRef = useRef<HTMLDivElement>(null);
  const stageFrameRef = useRef<HTMLDivElement>(null);
  const stageImageRef = useRef<HTMLImageElement>(null);
  const desktopHeaderRef = useRef<HTMLDivElement>(null);
  const initiativeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const redBand = redBandRef.current;
    const blackCurtain = blackCurtainRef.current;
    const frame = stageFrameRef.current;
    const img = stageImageRef.current;
    const header = desktopHeaderRef.current;
    const initiative = initiativeSectionRef.current;

    if (isStaticMode) {
      gsap.set(redBand, { scaleX: 1, opacity: 0 });
      gsap.set(blackCurtain, { scaleY: 0 });
      gsap.set(frame, { opacity: 1, y: 0 });
      gsap.set(img, { scale: 1.0 });
      gsap.set(header, { opacity: 1, y: 0 });
      gsap.set(initiative, { opacity: 1, y: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    // 1. DESKTOP SCENE (Pinned scroll narrative)
    mm.add(`(min-width: ${motionConfig.breakpoints.desktopWideMin}px)`, () => {
      const section = sectionRef.current;
      const stage = pinStageRef.current;
      if (!section || !stage) return;

      // Initial States
      gsap.set(redBand, { scaleX: 0, opacity: 1 });
      gsap.set(blackCurtain, { scaleY: 0 });
      gsap.set(frame, { opacity: 0, y: 25 });
      gsap.set(img, { scale: 1.0 });
      gsap.set(header, { opacity: 0, y: 30 });
      gsap.set(initiative, { opacity: 0, y: 25 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (motionConfig.desktopScroll.comunidadeExtraVh / 100)}`,
          pin: stage,
          pinSpacing: true,
          scrub: motionConfig.scrubSmoothing,
          anticipatePin: 1,
        },
      });

      // --- Fase 1: Entrada com passagem de quadro (0.00 -> 0.25) ---
      // Faixa vermelha corta a tela
      tl.to(redBand, { scaleX: 1, ease: 'power2.inOut', duration: 0.12 }, 0)
        .to(redBand, { opacity: 0, duration: 0.08 }, 0.12)
        // Quadro da imagem e arte
        .to(frame, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.16 }, 0.08)
        .to(img, { scale: 1.0, ease: 'power1.out', duration: 0.22 }, 0.08)
        // Texto na área clara
        .to(header, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.18 }, 0.12)
        // Bloco da iniciativa
        .to(initiative, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.18 }, 0.16);

      // --- Fase 2: Intervalo de Leitura Estável (0.25 -> 0.75) ---
      tl.to({}, { duration: 0.50 }, 0.25);

      // --- Fase 3: Saída Coordenada com Cortina Preta (0.75 -> 1.00) ---
      // Fundo preto do encerramento sobe pela tela
      tl.to(blackCurtain, { scaleY: 1, ease: 'power2.inOut', duration: 0.25 }, 0.75)
        .to([header, initiative], { opacity: 0.15, duration: 0.2 }, 0.78);
    });

    // 2. MOBILE SCENE (Fluxo vertical normal)
    mm.add(`(max-width: ${motionConfig.breakpoints.desktopWideMin - 1}px)`, () => {
      // Elements are presented in natural document flow
    });

    // 3. PREFERS-REDUCED-MOTION
    mm.add('(prefers-reduced-motion: reduce)', () => {
      // Direct rendering
    });

    return () => {
      mm.revert();
    };
  }, [isStaticMode]);

  return (
    <section
      id="caminhos"
      ref={sectionRef}
      className={`${styles.chapterSection} ${className || ''}`}
      aria-labelledby="caminhos-title"
    >
      <div ref={pinStageRef} className={styles.pinnedStage}>
        {/* Passagem de quadro: faixa vermelha e cortina preta de saída */}
        <div className={styles.comicTransitionWipe} aria-hidden="true">
          <div ref={redBandRef} className={styles.comicRedBand} />
        </div>
        <div ref={blackCurtainRef} className={styles.blackExitCurtain} aria-hidden="true" />

        {/* Editorial top hairline transition separator with registration marks */}
        <div className={styles.editorialDivider} aria-hidden="true">
          <span className={styles.registrationMark}>+</span>
          <div className={styles.dividerLine} />
          <span className={styles.rubricText}>CAPÍTULO DE COMUNIDADE & FUTURO</span>
          <div className={styles.dividerLine} />
          <span className={styles.registrationMark}>+</span>
        </div>

        <div className={styles.container}>
          {/* Unified Chapter Header positioned cleanly above the stage frame without overlapping art */}
          <header ref={desktopHeaderRef} className={styles.chapterHeader}>
            <div className={styles.markerBadge}>
              <span className={styles.markerDot} aria-hidden="true" />
              <span className={styles.markerText}>03 / CAMINHOS PARA COMEÇAR</span>
            </div>
            <h2 id="caminhos-title" className={styles.headline}>
              Criar também se aprende em comunidade.
            </h2>
          </header>

          {/* Stage Frame: Features the collaborative learning illustration */}
          <div ref={stageFrameRef} className={styles.stageFrame}>
            {/* Corner registration crosshairs */}
            <span className={`${styles.cornerCrosshair} ${styles.cornerTopLeft}`} aria-hidden="true">+</span>
            <span className={`${styles.cornerCrosshair} ${styles.cornerTopRight}`} aria-hidden="true">+</span>
            <span className={`${styles.cornerCrosshair} ${styles.cornerBottomLeft}`} aria-hidden="true">+</span>
            <span className={`${styles.cornerCrosshair} ${styles.cornerBottomRight}`} aria-hidden="true">+</span>

            {/* Technical frame header */}
            <div className={styles.frameTechnicalHeader} aria-hidden="true">
              <span>INICIATIVAS DE COMPUTAÇÃO EM MATO GROSSO</span>
              <span>APRENDIZAGEM & REDE COLETIVA</span>
            </div>

            {/* Image Wrapper */}
            <div className={styles.imageWrapper}>
              {/* Complete, uncropped illustration preserving all 3 characters and laptop */}
              <img
                ref={stageImageRef}
                src="/images/meninas-digitais-hq.png"
                alt="Ilustração conceitual de aprendizagem colaborativa: três jovens na bancada com circuitos eletrônicos, notebook e anotações, com vista das chapadas ao fundo"
                className={styles.stageImage}
                loading="lazy"
              />
            </div>

            {/* Caption */}
            <figcaption className={styles.imageCaption}>
              Ilustração conceitual de aprendizagem colaborativa. Personagens fictícias.
            </figcaption>
          </div>

          {/* Initiative & Editorial Reading Area */}
          <div ref={initiativeSectionRef} className={styles.initiativeSection}>
            {/* Main Initiative Card */}
            <article className={styles.initiativeCard}>
              <header className={styles.initiativeHeader}>
                <h3 className={styles.initiativeName}>Meninas Digitais Mato Grosso</h3>
                <span className={styles.initiativeYearBadge}>DESDE 2015</span>
              </header>

              <p className={styles.initiativeDescription}>
                Criado em 2015, o projeto promove ações motivacionais e informativas para aproximar meninas da computação e de suas possibilidades.
              </p>

              <div className={styles.initiativeActionBox}>
                <a
                  href="https://meninas.sbc.org.br/projetos-parceiros/meninas-digitais-mato-grosso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.sbcLink}
                >
                  <span>Conhecer o projeto na SBC</span>
                  <span className={styles.sbcLinkIcon} aria-hidden="true">↗</span>
                </a>
              </div>
            </article>

            {/* Supporting Editorial Column */}
            <aside className={styles.supportColumn} aria-label="Apoio editorial">
              <span className={styles.supportLabel}>APOIO EDITORIAL</span>
              <p className={styles.supportText}>
                Conhecer outras trajetórias, experimentar ideias e compartilhar descobertas são caminhos para começar.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
};
