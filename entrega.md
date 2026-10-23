# RELATÓRIO DE ENTREGA — CAPÍTULO 2: “ISSO ACONTECE EM MATO GROSSO”

**Data:** 23 de Outubro de 2026  
**Projeto:** Mulheres e Meninas na Tecnologia em Mato Grosso  
**Escopo:** Implementação do Segundo Capítulo Narrativo conectado à Abertura Editorial  

---

## 1. RESUMO EXECUTIVO DA IMPLEMENTAÇÃO

Implementamos o segundo capítulo da experiência narrativa, intitulado **“Isso acontece em Mato Grosso”**, dando continuidade visual e espacial direta ao fechamento do circuito na abertura:

1. **Integração Fluida com a Abertura:**
   - O ScrollTrigger da abertura libera o pin no progresso 1.0 (scrollY ~1.980px no desktop e ~1.650px no mobile).
   - O destino `#proximo-capitulo` foi integrado com `scroll-margin-top: 3.5rem` (desktop) e `2.5rem` (mobile), garantindo que tanto a rolagem natural quanto o clique em “Pular abertura” posicionem o título com conforto visual e respiração sob o topo da janela.
   - Organizado em componente dedicado e desacoplado: `MatoGrossoChapter` (`src/components/MatoGrossoChapter/MatoGrossoChapter.tsx` e `MatoGrossoChapter.module.css`).

2. **Direção Visual Editorial:**
   - **Superfície Marfim:** Fundo em `var(--color-paper)` (`#F4E3CB`) e cartões em `var(--color-paper-alt)` (`#F2E8D5`), integrados à paleta de papel e quadrinho editorial.
   - **Traço de Tinta:** Contorno do território em preto de tinta `var(--color-ink)` (`#181818`), espessura de 2.25px com junções arredondadas.
   - **Tipografia:** Título e marcadores em `Space Grotesk` (700) e textos de apoio em `Plus Jakarta Sans` (400/500/600).
   - **Destaques em Vermelho Editorial:** Vermelho `var(--color-red)` (`#D74735`) aplicado no marcador `01 / MATO GROSSO`, cruzetas de registro gráfico (`+`) e indicador de dados cartográficos.
   - **Composição Desktop:** Distribuição assimétrica equilibrada, com coluna editorial de texto à esquerda (48%) e prancha cartográfica à direita (52%).
   - **Composição Mobile:** Estrutura empilhada verticalmente, com bloco de texto acima e prancha cartográfica abaixo, preservando 100% do estado visível e sem overflow horizontal.

3. **Conteúdo Editorial Rigoroso:**
   - **Marcador:** `01 / MATO GROSSO`
   - **Título:** `O próximo capítulo acontece aqui.`
   - **Apoio:** `Conheça histórias de mulheres e meninas que criam tecnologia em Mato Grosso.`

---

## 2. ORIGEM E PROVENIÊNCIA DO MAPA CARTOGRÁFICO

A geometria do Estado de Mato Grosso foi obtida a partir de fonte oficial do Governo Federal, respeitando a regra estrita de **não desenhar o estado de memória nem gerar contornos fictícios por IA**.

| Propriedade | Especificação Oficial |
| :--- | :--- |
| **Órgão Emissor** | IBGE — Instituto Brasileiro de Geografia e Estatística |
| **Serviço/Origem** | API de Serviços de Dados / Malhas Geográficas v3 |
| **URL do Recurso** | [https://servicodados.ibge.gov.br/api/v3/malhas/estados/51?formato=application/vnd.geo+json](https://servicodados.ibge.gov.br/api/v3/malhas/estados/51?formato=application/vnd.geo+json) |
| **Código IBGE da UF** | `51` (Mato Grosso) |
| **Data de Extração** | 23 de Outubro de 2026 |
| **Sistema Geodésico** | SIRGAS 2000 (EPSG:4674) |
| **Limites Geográficos** | Longitude: `-61.6334°` a `-50.2248°` \| Latitude: `-18.0416°` a `-7.3490°` |
| **Vértices Geodésicos** | 2.645 pontos de coordenadas oficiais conectados em polígono contínuo fechado |
| **Projeção e Proporções** | Conformal Mercator com fator de correção de latitude central (`cos(-12.6953°) = 0.9755`) |
| **viewBox Responsivo** | `0 0 760 732` (proporção 1.038:1) |
| **Armazenamento Local** | `public/maps/mato-grosso.svg`, `public/maps/mato-grosso-ibge.geojson` e `public/maps/provenance.json` |
| **Licença e Uso** | Domínio Público / Dados Abertos Governamentais (Lei Federal nº 12.527/2011) |
| **Distinção de Fontes** | A fonte do IBGE atesta exclusivamente a demarcação político-territorial do estado. As fontes futuras de histórias de vida, projetos, instituições e comunidades serão catalogadas independentemente. |

*Nesta entrega, o mapa apresenta exclusivamente o território físico, sem marcadores ou pontos fictícios não documentados.*

---

## 3. TRANSIÇÃO, MOVIMENTO E ACESSIBILIDADE

- **Véu de Transição Editorial:**
  Adicionada a camada `.editorialTransitionOverlay` no fechamento da abertura. Entre os progressos 0.88 e 1.0 do scroll (fase `leadToExit`), uma suave cobertura de papel marfim vela progressivamente o close-up do circuito e LED azul. Evita clarões na tela e elimina cortes abruptos, preparando o olhar para o capítulo seguinte.
- **Desenho do Contorno no Scroll:**
  O contorno contínuo do estado de 2.645 vértices é revelado progressivamente através da transição controlada de `strokeDashoffset` no momento em que a seção entra no campo de visão (via `IntersectionObserver` em fluxo normal).
- **Sem Novo Pin Longo:**
  O capítulo 2 corre em fluxo normal de página, respeitando a rolagem nativa do usuário e permitindo rolagem reversa instantânea de volta para a abertura.
- **Acessibilidade Semântica e WCAG:**
  - Marcação estrutural com `<section>`, `<header>`, `<h2>`, `<p>`.
  - SVG configurado com `role="img"`, `aria-label="Contorno cartográfico oficial do Estado de Mato Grosso gerado a partir de dados geodésicos do IBGE"`, além de nós `<title>` e `<desc>`.
  - **Movimento Reduzido (`prefers-reduced-motion`):** As transições são zeradas, o texto e o mapa surgem imediatamente em seu estado final completo e legível, sem depender de nenhuma animação de scroll.

---

## 4. RESULTADOS DOS TESTES E2E EFETIVAMENTE REALIZADOS

Execução automatizada completa via Playwright: `pnpm run test:e2e`

```json
{
  "test1_destinationAndSkipLink": true,
  "test2_chapterContentAndTypography": true,
  "test3_ibgeMapContourAndAccessibility": true,
  "test4_desktopAsymmetricComposition": true,
  "test5_mobileStackedComposition390": true,
  "test6_mobileStackedComposition360": true,
  "test7_scrollContinuityAndReverse": true,
  "test8_transitionRecordingGenerated": true,
  "test9_reducedMotionAccessibility": true,
  "test10_consoleClean": true
}
```

### Detalhamento dos Testes Executados:
1. **Destino e Link "Pular Abertura":** **PASSOU** — Ao acionar o link, o scroll suave ancora `#proximo-capitulo` posicionando o título a 289px do topo da janela (área generosa e legível).
2. **Conteúdo e Tipografia:** **PASSOU** — Marcador `"01 / MATO GROSSO"`, título `"O próximo capítulo acontece aqui."` e apoio `"Conheça histórias de mulheres e meninas que criam tecnologia em Mato Grosso."` validados literalmente.
3. **Cartografia Oficial do IBGE:** **PASSOU** — SVG local com viewBox `0 0 760 732`, 2.645 vértices, papel marfim e contorno em preto de tinta, acessível com tags semânticas e atribuição documentada.
4. **Composição Assimétrica Desktop (1440×900 e 1920×1080):** **PASSOU** — Texto e mapa dispostos lado a lado com proporções harmônicas e zero overflow horizontal.
5. **Composição Empilhada Mobile (390×844):** **PASSOU** — Texto posicionado acima e mapa abaixo, com 100% do estado visível e sem cortes.
6. **Consistência Mobile Compacto (360×800):** **PASSOU** — Estado inteiro contido na viewport, sem rolagem horizontal.
7. **Continuidade e Rolagem Reversa:** **PASSOU** — Transição com máscara editorial entre o frame 240 e a superfície marfim; rolagem reversa restaura perfeitamente o frame inicial 0.
8. **Gravação de Vídeo:** **PASSOU** — Gravado arquivo de vídeo WebM da transição e desenho cartográfico.
9. **Movimento Reduzido (`prefers-reduced-motion: reduce`):** **PASSOU** — Apresentação estática imediata do mapa preenchido e textos 100% opacos.
10. **Console e Build:** **PASSOU** — Zero erros no console do navegador e build de produção compilado com sucesso (`tsc -b && vite build` em 6s).

---

## 5. EVIDÊNCIAS VISUAIS PRODUZIDAS

### 5.1 Gravação da Transição em Vídeo
- **Vídeo WebM da Transição e Revelação Cartográfica:**  
  [transicao_mato_grosso.webm](file:///c:/Users/drine/OneDrive/Desktop/hackaton/evidence/recordings/transicao_mato_grosso.webm) (3.56 MB)

### 5.2 Capturas de Tela de Comprovação
- **Desktop 1440×900 (Destino #proximo-capitulo e composição assimétrica):**  
  [evidence_chapter2_desktop_1440x900.png](file:///c:/Users/drine/OneDrive/Desktop/hackaton/evidence/evidence_chapter2_desktop_1440x900.png)
- **Desktop 1920×1080 (Full HD — Composição editorial ampla):**  
  [evidence_chapter2_desktop_1920x1080.png](file:///c:/Users/drine/OneDrive/Desktop/hackaton/evidence/evidence_chapter2_desktop_1920x1080.png)
- **Mobile 390×844 (Texto acima, mapa abaixo inteiro):**  
  [evidence_chapter2_mobile_390x844.png](file:///c:/Users/drine/OneDrive/Desktop/hackaton/evidence/evidence_chapter2_mobile_390x844.png)
- **Mobile 360×800 (Android compacto sem cortes):**  
  [evidence_chapter2_mobile_360x800.png](file:///c:/Users/drine/OneDrive/Desktop/hackaton/evidence/evidence_chapter2_mobile_360x800.png)
- **Modo Movimento Reduzido (Apresentação direta do estado final):**  
  [evidence_chapter2_reduced_motion.png](file:///c:/Users/drine/OneDrive/Desktop/hackaton/evidence/evidence_chapter2_reduced_motion.png)

---

## 6. ARQUIVOS ENTREGUES / MODIFICADOS

| Arquivo | Descrição |
| :--- | :--- |
| [src/components/MatoGrossoChapter/MatoGrossoChapter.tsx](file:///c:/Users/drine/OneDrive/Desktop/hackaton/src/components/MatoGrossoChapter/MatoGrossoChapter.tsx) | Componente principal do Capítulo 2 com marcação semântica, acessibilidade e revelação progressiva. |
| [src/components/MatoGrossoChapter/MatoGrossoChapter.module.css](file:///c:/Users/drine/OneDrive/Desktop/hackaton/src/components/MatoGrossoChapter/MatoGrossoChapter.module.css) | Estilização editorial, cruzetas de registro gráfico, grid responsivo e regras para `prefers-reduced-motion`. |
| [src/components/MatoGrossoChapter/matoGrossoMapData.ts](file:///c:/Users/drine/OneDrive/Desktop/hackaton/src/components/MatoGrossoChapter/matoGrossoMapData.ts) | Exportação de dados do polígono oficial com 2.645 pontos e metadados de projeção. |
| [public/maps/mato-grosso.svg](file:///c:/Users/drine/OneDrive/Desktop/hackaton/public/maps/mato-grosso.svg) | Arquivo SVG oficial local com contorno de Mato Grosso (viewBox 0 0 760 732). |
| [public/maps/mato-grosso-ibge.geojson](file:///c:/Users/drine/OneDrive/Desktop/hackaton/public/maps/mato-grosso-ibge.geojson) | GeoJSON bruto oficial extraído diretamente da API de Malhas do IBGE. |
| [public/maps/provenance.json](file:///c:/Users/drine/OneDrive/Desktop/hackaton/public/maps/provenance.json) | Metadados formais de proveniência cartográfica, URL, data de extração, licença e distinção de escopo. |
| [src/components/EditorialHero/EditorialHero.tsx](file:///c:/Users/drine/OneDrive/Desktop/hackaton/src/components/EditorialHero/EditorialHero.tsx) | Integração do véu de transição editorial no fechamento da abertura (0.88 -> 1.0). |
| [src/components/EditorialHero/EditorialHero.module.css](file:///c:/Users/drine/OneDrive/Desktop/hackaton/src/components/EditorialHero/EditorialHero.module.css) | Estilos da camada de transição editorial para a superfície marfim. |
| [src/App.tsx](file:///c:/Users/drine/OneDrive/Desktop/hackaton/src/App.tsx) | Montagem do `MatoGrossoChapter` no fluxo da aplicação e suporte a hash `#proximo-capitulo`. |
| [tests/suite.e2e.cjs](file:///c:/Users/drine/OneDrive/Desktop/hackaton/tests/suite.e2e.cjs) | Suíte completa com 10 baterias de testes automatizados e gravação de vídeo. |
| [entrega.md](file:///c:/Users/drine/OneDrive/Desktop/hackaton/entrega.md) | Relatório de entrega completo com dados cartográficos e comprovações. |
