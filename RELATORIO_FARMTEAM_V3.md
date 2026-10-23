# RELATÓRIO DE ENTREGA — FARM TEAM V3 (EDIÇÃO CINEMATOGRÁFICA EDITORIAL)

> **Projeto:** Mulheres e Meninas na Tecnologia em Mato Grosso  
> **Equipe:** Farm Team  
> **Data:** 23 de Outubro de 2026  
> **Versão:** 3.0.0 (Awwwards-level Storytelling & Performance)  
> **Repositório GitHub:** [Josemateus23/hackaton-farmteam](https://github.com/Josemateus23/hackaton-farmteam)  
> **Produção Vercel:** [hackaton-farmteam.vercel.app](https://hackaton-farmteam.vercel.app)

---

## 1. Resumo Executivo da Evolução V3

A V3 cinematográfica elevou o projeto a um documentário web editorial interativo de alto padrão, combinando arte sequencial em quadrinhos, cartografia oficial do IBGE, registros documentais de pesquisa aplicada na UFMT e rigor de engenharia de performance:

1. **Índice Editorial de Capítulos & Navegação Global:**
   - Implementado o componente `EditorialNavigation` fixado no topo em papel marfim translúcido (`rgba(244, 227, 203, 0.94)`) com desfoque de fundo (`backdrop-filter: blur(10px)`).
   - Âncoras ativas com acompanhamento de scroll (*scroll-spy*): `00 Abertura`, `01 Mato Grosso`, `02 Robô Otto`, `03 Meninas Digitais` e `04 Encerramento`.
   - Mini-barra de progresso contínuo no rodapé da navegação.
   - Menu drawer compacto e acessível para mobile com fechamento por tecla `Escape` e auto-fechamento ao selecionar capítulo.

2. **Controle "Ler sem animações" (Modo Estático Acessível):**
   - Botão interativo no cabeçalho com indicador visual e estado acessível (`aria-pressed`).
   - Permite alternar instantaneamente entre a experiência cinematográfica de scroll-driven pinning e um fluxo contínuo tradicional de leitura.
   - Respeita nativamente a preferência do sistema `prefers-reduced-motion: reduce` desde o primeiro paint.

3. **Otimização Crítica da Sequência de 241 Frames:**
   - **Variante Mobile Otimizada (960×540 WebP):** Gerada com biblioteca nativa `sharp` em lote.
   - **Métricas Reais de Payload:**
     - Sequência original 1080p: **86,47 MB**
     - Sequência mobile 540p: **19,75 MB**
     - **Redução de Payload: 77,2%** de economia de dados em dispositivos móveis.
   - **Carregamento Adaptativo com Fallback:** O `FrameLoader` detecta a viewport (`<= 900px`) e requisita automaticamente a variante mobile. Em caso de falha de rede na variante compacta, aciona fallback transparente para o frame desktop.
   - **Preload LCP Responsivo em `index.html`:** O primeiro frame é pré-carregado via `link rel="preload"` com media queries específicas (`(max-width: 900px)` e `(min-width: 901px)`).

4. **Correção e Refinamento de Enquadramento:**
   - **Capítulo Robô Otto (`OttoChapter`):** Ajustado o enquadramento da prancha técnica para `overflow: visible` e margens de respiração (`padding: 0.75rem 0.5rem`). O zoom do Momento 2 foi calibrado para `scale: 1.01`, garantindo que a **mão levantada do Otto, a cabeça, o corpo e as ferramentas da bancada permaneçam 100% visíveis** sem nenhum corte em qualquer resolução.
   - **Capítulo Meninas Digitais (`CaminhosChapter`):** O cabeçalho foi unificado e movido para **fora do invólucro da imagem**, eliminando a sobreposição de caixas de texto sobre o rosto das três estudantes e o notebook. As personagens e o cenário das chapadas estão plenamente visíveis.

---

## 2. Arquivos Modificados e Criados

| Arquivo | Natureza | Descrição da Alteração |
| :--- | :--- | :--- |
| `src/components/EditorialNavigation/EditorialNavigation.tsx` | **Novo** | Componente de navegação editorial, índice de capítulos, scroll-spy e toggle estático. |
| `src/components/EditorialNavigation/EditorialNavigation.module.css` | **Novo** | Estilos modulares em papel marfim, tipografia Space Grotesk, micro-interações e drawer mobile. |
| `src/App.tsx` | Modificado | Integração da navegação, gerenciamento do estado `isStaticMode` e propagação para os capítulos. |
| `src/components/EditorialHero/EditorialHero.tsx` | Modificado | Suporte a `isStaticMode`, inicialização de loader adaptativo mobile e poster LCP dinâmico. |
| `src/components/EditorialHero/EditorialHero.module.css` | Modificado | Ajuste de espaçamento do topo para integração harmônica com a barra de navegação global. |
| `src/components/OttoChapter/OttoChapter.tsx` | Modificado | Suporte a `isStaticMode`, câmera do Momento 2 calibrada para não cortar a mão levantada. |
| `src/components/OttoChapter/OttoChapter.module.css` | Modificado | Enquadramento com `overflow: visible` e suporte a regras `:global(.static-mode)`. |
| `src/components/CaminhosChapter/CaminhosChapter.tsx` | Modificado | Cabeçalho unificado acima da arte; remoção do texto sobreposto às 3 meninas e ao notebook. |
| `src/components/CaminhosChapter/CaminhosChapter.module.css` | Modificado | Estilos do cabeçalho unificado e regras de layout estático. |
| `src/components/MatoGrossoChapter/MatoGrossoChapter.tsx` | Modificado | Suporte a `isStaticMode` com desenho imediato do contorno cartográfico IBGE. |
| `src/components/MatoGrossoChapter/MatoGrossoChapter.module.css` | Modificado | Regras de transição e bypass estático para o mapa oficial. |
| `src/components/EncerramentoSection/EncerramentoSection.tsx` | Modificado | Suporte a `isStaticMode` com revelação imediata das chamadas e fontes. |
| `src/utils/frameLoader.ts` | Modificado | Suporte a `isMobile`, priorização por direção de scroll e fallback automático para desktop. |
| `src/utils/canvasFraming.ts` | Modificado | Dimensões naturais dinâmicas para suportar perfeitamente assets de 960×540 e 1920×1080. |
| `src/types/frames.ts` | Modificado | Inclusão de tipos para `mobileUrl`, `mobileDimensions` e `mobileSizeBytes`. |
| `src/data/framesManifest.json` | Modificado | Manifesto atualizado com as duas variantes (desktop e mobile). |
| `public/frames/landinghero/manifest.json` | Modificado | Manifesto público atualizado com as variantes geradas. |
| `public/frames/landinghero/mobile/*.webp` | **Novo (241 frames)** | Variante compacta de 960×540 WebP (19,75 MB total). |
| `index.html` | Modificado | Links `rel="preload"` responsivos para primeiro frame mobile e desktop. |
| `package.json` | Modificado | Dependência de build `sharp` e scripts `optimize:frames` e `test:smoke`. |
| `scripts/generateFrameVariants.mjs` | **Novo** | Script reprodutível de geração de variantes em lote com `sharp`. |
| `scripts/updateManifests.mjs` | **Novo** | Script utilitário de sincronização dos manifestos JSON. |
| `scripts/smokeTestV3.mjs` | **Novo** | Suíte de smoke tests Playwright (desktop 1440x900, mobile 390x844, toggle estático). |

---

## 3. Relatório de Testes e Validação Objetiva

### Build de Produção
```bash
$ tsc -b && vite build
✓ 52 modules transformed.
dist/index.html                   1.91 kB │ gzip:   0.90 kB
dist/assets/index-C3T1P3UT.css   44.89 kB │ gzip:   7.72 kB
dist/assets/index-CguKdsnT.js   488.07 kB │ gzip: 154.00 kB
✓ built in 8.14s
```

### Smoke Tests Playwright (Resultados)
- **Desktop (1440×900):**
  - Barra de navegação visível: **Sim**
  - Canvas de abertura renderizado: **Sim**
  - Salto direto para o capítulo Robô Otto: **Sim**
  - Alternância do modo "Sem animações" funcional: **Sim**
- **Mobile (390×844):**
  - Botão de menu hambúrguer visível: **Sim**
  - Drawer de navegação abre e responde ao toque: **Sim**
  - Salto para o capítulo Meninas Digitais: **Sim**
  - Carregamento de frames da pasta `/mobile/`: **Sim (100% verificado)**
- **Console do Navegador:** **0 erros (Clean Console)**.

---

## 4. Instruções para Deploy na Vercel

O projeto está 100% preparado para deploy imediato na Vercel:
1. Conectar o repositório GitHub `Josemateus23/hackaton-farmteam`.
2. Framework Preset: **Vite**.
3. Build Command: `pnpm build`.
4. Output Directory: `dist`.
5. Install Command: `pnpm install`.
