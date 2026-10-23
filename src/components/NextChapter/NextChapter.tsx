import React from 'react';
import { narrativeConfig } from '../../config/narrativeConfig';
import styles from './NextChapter.module.css';

export const NextChapter: React.FC = () => {
  return (
    <section
      id="proximo-capitulo"
      className={styles.chapterSection}
      aria-label="Primeiro Capítulo: A Construção da Tecnologia em Mato Grosso"
    >
      <div className={styles.chapterContainer}>
        <div className={styles.chapterTag}>{narrativeConfig.copy.nextChapterTag}</div>

        <h2 className={styles.chapterTitle}>{narrativeConfig.copy.nextChapterTitle}</h2>

        <p className={styles.chapterSubtitle}>{narrativeConfig.copy.nextChapterSubtitle}</p>

        {/* Clean, reserved structure for forthcoming narrative chapters */}
        <div className={styles.chapterGrid}>
          <div className={styles.chapterCardStub}>
            <span className={styles.cardIndex}>01 — ETAPA</span>
            <h3 className={styles.cardTitle}>A Bancada de Criação</h3>
            <p className={styles.cardDescription}>
              O primeiro contato com componentes eletrônicos, sensores e protótipos em escolas públicas e oficinas de MT.
            </p>
          </div>

          <div className={styles.chapterCardStub}>
            <span className={styles.cardIndex}>02 — ETAPA</span>
            <h3 className={styles.cardTitle}>Do Código ao Circuito</h3>
            <p className={styles.cardDescription}>
              Meninas programando sistemas embarcados e desenvolvendo soluções reais para desafios locais.
            </p>
          </div>

          <div className={styles.chapterCardStub}>
            <span className={styles.cardIndex}>03 — ETAPA</span>
            <h3 className={styles.cardTitle}>Comunidades e Futuro</h3>
            <p className={styles.cardDescription}>
              Redes de apoio, mentorias e iniciativas que conectam jovens criadoras ao ecossistema de inovação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
