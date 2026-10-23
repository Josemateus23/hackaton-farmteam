import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { matoGrossoMapData } from './matoGrossoMapData';
import { motionConfig } from '../../config/motionConfig';
import styles from './MatoGrossoChapter.module.css';

gsap.registerPlugin(ScrollTrigger);

interface MatoGrossoChapterProps {
  className?: string;
  isStaticMode?: boolean;
}

export const MatoGrossoChapter: React.FC<MatoGrossoChapterProps> = ({ className, isStaticMode = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const mapFillRef = useRef<SVGPathElement>(null);
  const blueConduitRef = useRef<HTMLDivElement>(null);

  // Animated elements refs
  const textColumnRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const supportingTextRef = useRef<HTMLParagraphElement>(null);
  const contextCardRef = useRef<HTMLDivElement>(null);
  const mapStageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStaticMode) {
      if (pathRef.current) gsap.set(pathRef.current, { strokeDashoffset: 0 });
      if (mapFillRef.current) gsap.set(mapFillRef.current, { opacity: 1 });
      if (headlineRef.current) gsap.set(headlineRef.current, { y: 0, opacity: 1 });
      if (supportingTextRef.current) gsap.set(supportingTextRef.current, { y: 0, opacity: 1 });
      if (contextCardRef.current) gsap.set(contextCardRef.current, { y: 0, opacity: 1 });
      if (mapStageRef.current) gsap.set(mapStageRef.current, { scale: 1, x: 0, opacity: 1 });
      if (textColumnRef.current) gsap.set(textColumnRef.current, { y: 0, opacity: 1 });
      if (blueConduitRef.current) gsap.set(blueConduitRef.current, { scaleY: 1 });
      return;
    }

    const mm = gsap.matchMedia();

    // 1. DESKTOP SCENE (Pinned scroll narrative)
    mm.add(`(min-width: ${motionConfig.breakpoints.desktopMin}px)`, () => {
      const section = sectionRef.current;
      const stage = pinStageRef.current;
      if (!section || !stage) return;

      const path = pathRef.current;
      const currentLength = path && path.getTotalLength ? path.getTotalLength() || 3400 : 3400;

      // Initial state
      gsap.set(path, { strokeDasharray: currentLength, strokeDashoffset: currentLength });
      gsap.set(mapFillRef.current, { opacity: 0 });
      gsap.set(headlineRef.current, { y: 40, opacity: 0 });
      gsap.set(supportingTextRef.current, { y: 25, opacity: 0 });
      gsap.set(contextCardRef.current, { y: 25, opacity: 0 });
      gsap.set(mapStageRef.current, { scale: 1, x: 0, opacity: 1 });
      gsap.set(textColumnRef.current, { y: 0, opacity: 1 });
      gsap.set(blueConduitRef.current, { scaleY: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${window.innerHeight * (motionConfig.desktopScroll.territorioExtraVh / 100)}`,
          pin: stage,
          pinSpacing: true,
          scrub: motionConfig.scrubSmoothing,
          anticipatePin: 1,
        },
      });

      // --- Fase 1: Entrada (0.00 -> 0.35) ---
      // Traço azul narrativo entra suavemente pelo topo
      tl.to(blueConduitRef.current, { scaleY: 1, ease: 'power2.out', duration: 0.12 }, 0)
        // Título entra por máscara curta
        .to(headlineRef.current, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.22 }, 0.04)
        // Texto de apoio e contexto
        .to(supportingTextRef.current, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.2 }, 0.12)
        .to(contextCardRef.current, { y: 0, opacity: 1, ease: 'power2.out', duration: 0.2 }, 0.18)
        // Contorno vetorial desenhado progressivamente
        .to(path, { strokeDashoffset: 0, ease: 'power1.inOut', duration: 0.34 }, 0.04)
        // Preenchimento sutil do território
        .to(mapFillRef.current, { opacity: 1, ease: 'power1.out', duration: 0.18 }, 0.24);

      // --- Fase 2: Intervalo de Leitura Estável (0.35 -> 0.75) ---
      tl.to({}, { duration: 0.40 }, 0.35);

      // --- Fase 3: Saída Coordenada (0.75 -> 1.00) ---
      // Mapa reduz moderadamente e desloca-se, texto sobe suavemente
      tl.to(
        mapStageRef.current,
        { scale: 0.90, x: 28, opacity: 0.35, ease: 'power2.inOut', duration: 0.25 },
        0.75
      ).to(
        textColumnRef.current,
        { y: -28, opacity: 0.3, ease: 'power2.inOut', duration: 0.25 },
        0.75
      );
    });

    // 2. MOBILE SCENE (Fluxo vertical com triggers discretos)
    mm.add(`(max-width: ${motionConfig.breakpoints.mobileMax}px)`, () => {
      const path = pathRef.current;
      const currentLength = path && path.getTotalLength ? path.getTotalLength() || 3400 : 3400;
      gsap.set(path, { strokeDasharray: currentLength, strokeDashoffset: currentLength });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: mapStageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      });

      if (mapFillRef.current) {
        gsap.to(mapFillRef.current, {
          opacity: 1,
          duration: 0.8,
          delay: 0.4,
          scrollTrigger: {
            trigger: mapStageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        });
      }
    });

    // 3. PREFERS-REDUCED-MOTION
    mm.add('(prefers-reduced-motion: reduce)', () => {
      if (pathRef.current) {
        gsap.set(pathRef.current, { strokeDashoffset: 0 });
      }
      if (mapFillRef.current) {
        gsap.set(mapFillRef.current, { opacity: 1 });
      }
    });

    return () => {
      mm.revert();
    };
  }, [isStaticMode]);

  return (
    <section
      id="proximo-capitulo"
      ref={sectionRef}
      className={`${styles.chapterSection} ${className || ''}`}
      aria-labelledby="chapter2-title"
    >
      <div ref={pinStageRef} className={styles.pinnedStage}>
        {/* Traço azul narrativo conectando da saída da abertura */}
        <div ref={blueConduitRef} className={styles.blueConduitTrace} aria-hidden="true" />

        {/* Editorial top hairline transition separator with registration marks */}
        <div className={styles.editorialDivider} aria-hidden="true">
          <span className={styles.registrationMark}>+</span>
          <div className={styles.dividerLine} />
          <span className={styles.rubricText}>CAPÍTULO TERRITORIAL</span>
          <div className={styles.dividerLine} />
          <span className={styles.registrationMark}>+</span>
        </div>

        <div className={styles.container}>
          {/* Asymmetric composition: Left text column, Right map stage */}
          <div className={styles.layoutGrid}>
            {/* Editorial Text Column */}
            <header ref={textColumnRef} className={styles.textColumn}>
              {/* Marker Tag */}
              <div className={styles.markerBadge}>
                <span className={styles.markerDot} aria-hidden="true" />
                <span className={styles.markerText}>01 / MATO GROSSO</span>
              </div>

              {/* Main Headline with Mask Reveal */}
              <div className={styles.headlineMaskWrapper}>
                <h2 id="chapter2-title" ref={headlineRef} className={styles.headline}>
                  O próximo capítulo <br className={styles.desktopBr} />
                  acontece aqui.
                </h2>
              </div>

              {/* Supporting Copy */}
              <p ref={supportingTextRef} className={styles.supportingText}>
                Conheça histórias de mulheres e meninas que criam tecnologia em Mato Grosso.
              </p>

              {/* Editorial Context Annotation */}
              <div ref={contextCardRef} className={styles.contextCard}>
                <div className={styles.contextCardHeader}>
                  <span className={styles.contextIndex}>TERRITÓRIO & INOVAÇÃO</span>
                </div>
                <p className={styles.contextBody}>
                  Das salas de aula e oficinas públicas aos laboratórios de prototipagem e desenvolvimento de software:
                  o estado abriga inventoras que desenham circuitos, programam futuros e conectam comunidades.
                </p>
                <div className={styles.attributionFootnote}>
                  <span className={styles.attributionLabel}>Base cartográfica oficial:</span>{' '}
                  <span className={styles.attributionSource}>IBGE — Malhas Territoriais (SIRGAS 2000)</span>
                </div>
              </div>
            </header>

            {/* Map Column */}
            <div className={styles.mapColumn} aria-label="Mapa oficial do território de Mato Grosso">
              <div ref={mapStageRef} className={styles.mapStageCard}>
                {/* Corner registration crosshairs (comic editorial print style) */}
                <span className={`${styles.cornerCrosshair} ${styles.cornerTopLeft}`} aria-hidden="true">+</span>
                <span className={`${styles.cornerCrosshair} ${styles.cornerTopRight}`} aria-hidden="true">+</span>
                <span className={`${styles.cornerCrosshair} ${styles.cornerBottomLeft}`} aria-hidden="true">+</span>
                <span className={`${styles.cornerCrosshair} ${styles.cornerBottomRight}`} aria-hidden="true">+</span>

                {/* Technical rubric header */}
                <div className={styles.mapRubricHeader} aria-hidden="true">
                  <span>ESTADO DE MATO GROSSO — CÓDIGO IBGE 51</span>
                  <span>MALHA DIGITAL OFICIAL IBGE</span>
                </div>

                {/* Responsive Cartographic SVG */}
                <div className={styles.svgWrapper}>
                  <svg
                    viewBox={matoGrossoMapData.viewBox}
                    className={styles.mapSvg}
                    role="img"
                    aria-label="Contorno cartográfico oficial do Estado de Mato Grosso gerado a partir de dados geodésicos do IBGE"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <title>Contorno Cartográfico de Mato Grosso</title>
                    <desc>
                      Representação precisa e em proporções oficiais do Estado de Mato Grosso baseada na Malha
                      Digital do IBGE (código 51, SIRGAS 2000), demarcando o território das criadoras de tecnologia.
                    </desc>

                    {/* Subtle paper territory fill tint */}
                    <path
                      ref={mapFillRef}
                      d={matoGrossoMapData.path}
                      className={styles.mapFill}
                      aria-hidden="true"
                    />

                    {/* Official Ink Stroke Contour with progressive draw reveal */}
                    <path
                      ref={pathRef}
                      d={matoGrossoMapData.path}
                      className={styles.mapContourPath}
                      style={{
                        strokeDasharray: 3400,
                        strokeDashoffset: 3400,
                      }}
                    />
                  </svg>
                </div>

                {/* Map Footer Bar with provenance details */}
                <footer className={styles.mapCardFooter}>
                  <div className={styles.footerData}>
                    <span className={styles.dataTag}>DADOS CARTOGRÁFICOS</span>
                    <span className={styles.dataValue}>IBGE Malhas Digitais (SIRGAS 2000)</span>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
