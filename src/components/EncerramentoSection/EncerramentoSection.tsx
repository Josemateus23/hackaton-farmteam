import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './EncerramentoSection.module.css';

gsap.registerPlugin(ScrollTrigger);

interface EncerramentoSectionProps {
  className?: string;
  isStaticMode?: boolean;
}

export const EncerramentoSection: React.FC<EncerramentoSectionProps> = ({ className, isStaticMode = false }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStaticMode) {
      if (markerRef.current) gsap.set(markerRef.current, { opacity: 1, y: 0 });
      if (headlineRef.current) gsap.set(headlineRef.current, { y: '0%', opacity: 1 });
      if (bodyRef.current) gsap.set(bodyRef.current, { opacity: 1, y: 0 });
      if (actionsRef.current) gsap.set(actionsRef.current, { opacity: 1, y: 0 });
      return;
    }

    const mm = gsap.matchMedia();

    // 1. DESKTOP ANIMATION: Typographic masked entrance linked to entry, then stable
    mm.add('(min-width: 768px)', () => {
      const section = sectionRef.current;
      const marker = markerRef.current;
      const headline = headlineRef.current;
      const body = bodyRef.current;
      const actions = actionsRef.current;

      if (!section || !headline || !body || !actions) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        marker,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      )
        .fromTo(
          headline,
          { y: '110%', opacity: 0 },
          { y: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          body,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          '-=0.4'
        )
        .fromTo(
          actions,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
          '-=0.4'
        );

      return () => {
        tl.kill();
      };
    });

    // 2. MOBILE / NARROW SCREENS: Concise vertical entrance
    mm.add('(max-width: 767px)', () => {
      const section = sectionRef.current;
      const marker = markerRef.current;
      const headline = headlineRef.current;
      const body = bodyRef.current;
      const actions = actionsRef.current;

      if (!section || !headline || !body || !actions) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        marker,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      ).fromTo(
        [headline, body, actions],
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
        '-=0.2'
      );

      return () => {
        tl.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [isStaticMode]);

  return (
    <section
      id="encerramento"
      ref={sectionRef}
      className={`${styles.section} ${className || ''}`}
      aria-labelledby="encerramento-title"
    >
      {/* Editorial top hairline transition separator with registration marks */}
      <div className={styles.editorialDivider} aria-hidden="true">
        <span className={styles.registrationMark}>+</span>
        <div className={styles.dividerLine} />
        <span className={styles.rubricText}>ENCERRAMENTO EDITORIAL</span>
        <div className={styles.dividerLine} />
        <span className={styles.registrationMark}>+</span>
      </div>

      <div className={styles.container}>
        {/* Main Call To Action Hero: "04 / SUA VEZ" */}
        <div className={styles.heroStage}>
          <div ref={markerRef} className={styles.markerBadge}>
            <span className={styles.markerDot} aria-hidden="true" />
            <span className={styles.markerText}>04 / SUA VEZ</span>
          </div>

          <div className={styles.headlineMaskWrapper}>
            <h2 id="encerramento-title" ref={headlineRef} className={styles.headline}>
              O próximo capítulo pode ser seu.
            </h2>
          </div>

          <p ref={bodyRef} className={styles.bodyText}>
            Escolha um problema do seu cotidiano. Imagine uma solução. Procure pessoas com quem aprender e comece a experimentar.
          </p>

          {/* Functional Actions Row */}
          <div ref={actionsRef} className={styles.actionsRow} role="group" aria-label="Ações de navegação final">
            <a href="#capitulo-otto" className={styles.primaryAction}>
              <span>Revisitar as histórias</span>
              <span className={styles.actionIcon} aria-hidden="true">↑</span>
            </a>

            <a href="#referencias" className={styles.secondaryAction}>
              <span>Consultar as fontes</span>
              <span className={styles.actionIcon} aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        {/* References & Documented Sources Section (#referencias) */}
        <section
          id="referencias"
          className={styles.referencesCard}
          aria-labelledby="referencias-heading"
        >
          <header className={styles.referencesHeader}>
            <h3 id="referencias-heading" className={styles.referencesTitle}>
              Fontes & Referências Oficiais
            </h3>
            <span className={styles.referencesMeta}>Transparência & Metodologia Documental</span>
          </header>

          {/* Clear Distinction Notice */}
          <div className={styles.differentiationNotice}>
            <strong>Nota de rigor e proveniência:</strong> Este projeto diferencia com precisão <em>dados cartográficos oficiais</em>, <em>registros institucionais de pesquisa e extensão</em> e <em>ilustrações artísticas conceituais</em>. Todas as ilustrações do site são representações artísticas voltadas à contextualização visual e contêm personagens e cenários conceituais, sem caráter de documentação fotográfica estrita.
          </div>

          {/* References Grid */}
          <div className={styles.referencesGrid}>
            {/* Category: Cartografia Oficial */}
            <div className={styles.refCategory}>
              <span className={styles.refCategoryTitle}>Dados Cartográficos</span>
              <div className={styles.refItem}>
                <strong>IBGE — Instituto Brasileiro de Geografia e Estatística</strong>
                <p>
                  Malhas Territoriais e Digitais Oficiais do Estado de Mato Grosso (Código IBGE 51), Sistema Geodésico SIRGAS 2000.
                </p>
                <a
                  href="https://www.ibge.gov.br/geociencias/organizacao-do-territorio/malhas-territoriais/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.refLink}
                >
                  ibge.gov.br/geociencias/malhas-territoriais ↗
                </a>
              </div>
            </div>

            {/* Category: Pesquisa & Robô Otto */}
            <div className={styles.refCategory}>
              <span className={styles.refCategoryTitle}>Pesquisa & Robô Otto</span>
              <div className={styles.refItem}>
                <strong>FAPEMAT — Fundação de Amparo à Pesquisa de MT</strong>
                <p>
                  Notícia documental publicada em 11/01/2023 sobre a pesquisa com o protótipo do robô assistivo Otto na UFMT.
                </p>
                <a
                  href="https://www.fapemat.mt.gov.br/-/23314743-pesquisadoras-de-mt-desenvolvem-robo-para-auxiliar-no-tratamento-de-criancas-com-transtorno-do-espectro-autista-tea-"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.refLink}
                >
                  fapemat.mt.gov.br (Registro 11/01/2023) ↗
                </a>
              </div>

              <div className={styles.refItem}>
                <strong>FATA / LAVI / UFMT</strong>
                <p>
                  Página institucional do projeto de Desenvolvimento de Tecnologias Assistivas Personalizadas.
                </p>
                <a
                  href="https://lavi2.ic.ufmt.br/projetos/fata-desenvolvimento-de-tecnologias-assistivas-personalizadas/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.refLink}
                >
                  lavi2.ic.ufmt.br/projetos/fata ↗
                </a>
              </div>
            </div>

            {/* Category: Projetos Comunitários */}
            <div className={styles.refCategory}>
              <span className={styles.refCategoryTitle}>Iniciativas em Computação</span>
              <div className={styles.refItem}>
                <strong>SBC — Sociedade Brasileira de Computação</strong>
                <p>
                  Registro oficial do projeto parceiro Meninas Digitais Mato Grosso, iniciado em 2015 para aproximação de garotas à tecnologia.
                </p>
                <a
                  href="https://meninas.sbc.org.br/projetos-parceiros/meninas-digitais-mato-grosso/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.refLink}
                >
                  meninas.sbc.org.br/projetos-parceiros ↗
                </a>
              </div>
            </div>

            {/* Category: Ilustrações Conceituais */}
            <div className={styles.refCategory}>
              <span className={styles.refCategoryTitle}>Ilustrações Conceituais</span>
              <div className={styles.refItem}>
                <strong>Arte Conceitual & Identidade Visual</strong>
                <p>
                  Abertura em HQ, protótipo assistivo na bancada e oficina de computação representadas em estilo editorial clássico com personagens conceituais, sem vínculo comercial.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial Credits & Hackathon Stamp */}
          <footer className={styles.creditsCard}>
            <p className={styles.creditsStatement}>
              Projeto desenvolvido pela equipe Farm Team para o hackathon.
            </p>
            <p className={styles.creditsDisclaimer}>
              As instituições citadas (UFMT, FAPEMAT, IBGE e SBC) são fontes documentais e referências de dados de interesse público, não constituindo patrocinadoras ou parceiras diretas da equipe desenvolvedora.
            </p>
          </footer>
        </section>
      </div>
    </section>
  );
};
