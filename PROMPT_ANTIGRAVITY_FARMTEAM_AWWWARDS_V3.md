# PROMPT MESTRE — FARM TEAM V3 | EXPERIÊNCIA CINEMATOGRÁFICA EDITORIAL EM NÍVEL AWWWARDS

Você é **Creative Developer Sênior, Diretor de Arte Digital, Motion Designer, UX Engineer e Performance Engineer**, com experiência em sites editoriais imersivos, React 19, TypeScript, Vite, GSAP ScrollTrigger, Canvas e projetos de narrativa scroll-driven. Sua missão é **IMPLEMENTAR**, testar e entregar uma **V3 funcional** do projeto existente **Farm Team — Mulheres e Meninas na Tecnologia em Mato Grosso**, com originalidade, refinamento visual e experiência de navegação comparável em ambição e qualidade a bons projetos exibidos no Awwwards — **sem copiar layouts de terceiros e sem afirmar que o site ganhou um prêmio**.

## 0. ENTRADA E CONTEXTO DE CONTINUIDADE — LEIA ANTES DE PROGRAMAR

O projeto existente foi fornecido como `hackaton-farmteam.zip` e já funciona em https://hackaton-farmteam.vercel.app. **ABRA O WORKSPACE REAL, IDENTIFIQUE A RAIZ CORRETA, INSPECIONE OS ARQUIVOS E EVOLUA A V2: NÃO CRIE UM PROJETO NOVO DESCONEXO, NÃO APAGUE CONTEÚDO E NÃO SUBSTITUA O SITE POR UM TEMPLATE.** Se o workspace contém alterações mais recentes que o ZIP, preserve a versão mais nova e faça um diagnóstico de diferenças antes de editar.

Constatações feitas diretamente no ZIP:
- Stack: **React 19 + Vite 6 + TypeScript + pnpm + GSAP 3/ScrollTrigger + CSS Modules**. Scripts existentes: `pnpm dev`, `pnpm build`, `pnpm preview`, `pnpm test:e2e`.
- Abertura em `<canvas>` com **241 WebP (1920×1080)** em `public/frames/landinghero/frames/` (`landinghero_0001.webp` a `landinghero_0241.webp`). Os frames pesam **aproximadamente 90,7 MB** no conjunto. Manifestos existentes: `public/frames/landinghero/manifest.json` e `src/data/framesManifest.json`.
- Existem `src/utils/frameLoader.ts` (fila com prioridades, LRU, prefetch e limite de concorrência), `src/utils/canvasFraming.ts`, `src/config/narrativeConfig.ts` e `src/config/motionConfig.ts`. **Melhore-os, não reescreva tudo sem motivo.**
- Capítulos/componentes atuais: `src/components/EditorialHero`, `MatoGrossoChapter`, `OttoChapter`, `CaminhosChapter`, `EncerramentoSection`; composição em `src/App.tsx`.
- Elementos de imagem/documentação existentes: `public/images/otto-capitulo-hq.png`, `public/images/meninas-digitais-hq.png`, `public/maps/mato-grosso.svg`, `public/maps/mato-grosso-ibge.geojson`, `public/maps/provenance.json`.
- Há testes em `tests/suite.e2e.cjs`, documento de direção `DESIGN.md` e relato `entrega.md`.
- Linguagem e conceito: HQ editorial autêntica, contraste entre papel marfim, tinta preta, vermelho editorial e azul elétrico. Tokens: `#F4E3CB` / `#F2E8D5` / `#181818` / `#D74735` / `#2465EC`.
- A V2 já possui **pins no desktop, transições coreografadas e fluxo natural no mobile**. Faça uma evolução de acabamento, impacto e fluidez, não apenas acrescente efeitos em cima de efeitos.

### Recuperação de continuidade da sessão Work anterior
A versão Awwwards foi iniciada em outra sessão, mas o artefato de código final não ficou disponível. Do histórico de execução recuperado, preserve estas decisões/intencionalidades:
1. A sequência original de ~90 MB deveria ganhar **assets desktop/mobile dimensionados e comprimidos**, com carregamento sob demanda; o frame corrente deveria ter prioridade alta e o prefetch seguir a direção do scroll.
2. O navegador já havia exibido a sequência de frames e as âncoras funcionando; faltavam ajustes no **enquadramento da mão levantada do Otto** e na **área textual da comunidade/Meninas Digitais**.
3. Havia sido acrescentado ao índice um controle real **“Ler sem animações”**, permitindo percorrer a narrativa em formato estático e acessível.
4. Os próximos passos seriam polimento visual, controle de sobreposição/contraste, testes de responsividade e pacote final para deploy.
**Se encontrar arquivos V3 no workspace, compare e continue a partir deles, sem sobrescrever melhorias já concluídas.**

## 1. OBJETIVO DE EXPERIÊNCIA

Criar um **documentário web editorial interativo**: a interface deve contar a história por meio da composição e do movimento, não parecer landing page SaaS, portfólio genérico, dashboard ou “template com fade-ins”. O visitante usa o scroll para acompanhar uma câmera narrativa que sai de uma **bancada de eletrônica**, atravessa a **geografia real de Mato Grosso**, encontra uma pesquisa de **tecnologia assistiva com o robô Otto**, entra na **comunidade Meninas Digitais** e chega a um convite concreto à participação.

O resultado deve transmitir **ciência real, autoria feminina, curiosidade, tecnologia acessível e identidade regional**. Público prioritário: estudantes e jovens de Mato Grosso, especialmente meninas, sem excluir educadores e famílias. A mensagem deve ser informativa, emocionante e crível; evitar tecnobabble, clichês motivacionais e estatísticas não verificadas.

Pilares visuais obrigatórios:
- **Direção editorial assinada:** grid assimétrico, títulos em escala monumental e responsiva, contrastes intencionais entre área de leitura e ilustração, microetiquetas e números de capítulo, forte hierarquia de informação.
- **HQ autoral, não infantilizada:** tinta, hachuras e textura de impressão MUITO discretas, linhas de registro, painéis que se encaixam e transições criadas a partir de objetos da própria história. Evitar excessos de glow, blur, glassmorphism, cards arredondados repetitivos, gradientes sem função e partículas aleatórias.
- **Motion design com propósito:** pausas reais de leitura; dinamismo nos momentos de descoberta; saídas visuais que já antecipem a linguagem do capítulo seguinte.
- **Acabamento premium:** microinterações de botões e links, estados de foco, cursor contextual apenas no desktop com ponteiro fino (se agregar valor), barras/etiquetas de progresso, ritmo de espaços em branco e lettering; cada seção deve parecer parte da mesma peça de direção de arte.

## 2. EXPERIÊNCIA DETALHADA POR CENA — FAÇA DE VERDADE

### CENA 0 — ABERTURA / “VOCÊ USA TECNOLOGIA TODOS OS DIAS”
- Preserve e aperfeiçoe o **canvas 241 frames**: enquadramento inicial legível, aproximação no circuito/LED, transição contínua com scroll reversível, poster imediato e texto em DOM (jamais rasterizado na imagem).
- Implemente composição inicial refinada: marca FARM TEAM discreta, indicador “01 — 04” ou capítulos correspondentes, índice de capítulos acessível, pista de scroll e tipografia hero em tamanhos fluidos. Não competir com rosto/personagem/circuito.
- Primeiro texto: **“Você usa tecnologia todos os dias.”**; segundo: **“Já imaginou criar a próxima?”**. Respeite pausas para leitura. Evitar flashing ou autoplay.
- Faça um detalhe visual coerente: o brilho azul do circuito vira uma **linha condutora vetorial** que leva ao contorno oficial de Mato Grosso; use SVG e transforms em vez de sobrecarregar o canvas.
- Evite travar a rolagem se os frames não baixarem; renderizar o último frame disponível/fallback, continuar a experiência normalmente. Ao voltar a página, reconstruir quadro correspondente, sem flash branco.

### CENA 1 — MATO GROSSO / “O PRÓXIMO CAPÍTULO ACONTECE AQUI”
- Manter **EXATAMENTE o contorno cartográfico oficial IBGE do projeto**; não redesenhar MT de cabeça, nem “inventar cidades”, nem criar coordenadas falsas.
- Em desktop, composição editorial full-screen com `pin` somente se servir ao ritmo; desenho progressivo do contorno por `stroke-dashoffset`, entradas tipográficas coordenadas, aproximação discreta no mapa e passagem de linha condutora para a próxima cena. O mapa deve estar legível e não se sobrepor ao texto.
- Em mobile, use **fluxo de leitura prioritário**, sem pinar conteúdo por longos trechos, preservando o estado inteiro do estado e evitando corte. Mapa legível mesmo com JavaScript/GSAP desativado.
- Todo dado e número exibido devem vir de fonte verificável. Se incluir números FAPEMAT, contextualize claramente o universo de **pesquisadores cadastrados no sistema**, sem tratá-lo como censo de todas as pesquisadoras do estado.

### CENA 2 — OTTO / TECNOLOGIA ASSISTIVA
- Preservar a história da pesquisa desenvolvida na **UFMT**, as referências documentais **FAPEMAT / FATA / LAVI** e a imagem `otto-capitulo-hq.png`.
- Três atos visuais reais, com pausa suficiente: **pesquisadoras e contexto** → **01 Interação / 02 Expressão / 03 Desenvolvimento** → pergunta “**Como abrir caminhos para que outras meninas também criem?**”.
- Enquadramento crucial: **não cortar a mão levantada do Otto, rosto, cabeça, pés ou elementos centrais da bancada**. Usar `object-fit: contain`, art direction específica por viewport ou parâmetros de crop verificados em screenshots reais; não aplicar `scale` excessivo para simular impacto.
- Microinterações elegantes para os 3 pilares, mas sem esconder o conteúdo atrás de hover. No mobile, mostrar tudo por rolagem normal.
- Não atribuir falas ou resultados clínicos que as fontes não confirmem. Preservar crédito de **ilustração conceitual baseada em documentação**; não apresentar ilustração como fotografia documental.

### CENA 3 — MENINAS DIGITAIS MT / COMUNIDADE
- Fazer transição editorial por **faixa rubra/painel de HQ**, não por fade genérico; revelação em plano aberto da `meninas-digitais-hq.png`.
- **Proteger os rostos das três alunas e o notebook**. A faixa de texto não deve invadir rostos/objetos importantes; usar composição responsiva para larguras 360, 390, 768, 1024 e 1440 px. Evitar o erro da versão anterior em que a área de texto ficava mal posicionada.
- Legenda honesta: **ilustração conceitual, personagens fictícias**. Nome e link da iniciativa **Meninas Digitais Mato Grosso**, referenciada pela **Sociedade Brasileira de Computação**. Manter o link institucional clicável.
- Narrativa encerra num convite: de observar tecnologia a **construir, pesquisar e participar**. Não criar perfis fictícios de pesquisadoras apresentando-os como reais.

### CENA 4 — ENCERRAMENTO / “O PRÓXIMO CAPÍTULO PODE SER SEU”
- Transição gradativa para tinta preta com máscara editorial; a mudança de atmosfera é proposital e elegante, não uma tela preta brusca.
- Título final monumental com reveal controlado pelo scroll, legível sem animação. CTA reais: revisitar capítulos / conhecer iniciativa / consultar fontes. Sem botões sem ação.
- Rodapé coerente, créditos da **Farm Team**, fontes oficiais (IBGE, FAPEMAT, UFMT/FATA, SBC), distinção entre documentos e ilustrações conceituais. **Não exibir instituição como patrocinadora/parceira sem comprovação**.

## 3. NAVEGAÇÃO E SISTEMA DE MOTION

Crie um **índice de capítulos editorial** (desktop: discreto fixo ou sobreposto; mobile: botão que abre menu compacto e acessível) com âncoras funcionais e indicador de progresso da narrativa. O usuário deve conseguir navegar diretamente para cada capítulo e retornar sem estado quebrado.

Ofereça controle visível e funcional **“Ler sem animações”**:
- Ao habilitar: remover/pausar pins, scrub, movimento excessivo e preload de toda a sequência; mostrar posters e conteúdo estático completo em fluxo natural, mantendo links, navegação, foco e leitura por teclado; opção reversível sem refresh bruto.
- Respeitar `prefers-reduced-motion: reduce` desde o primeiro paint. Não esconder texto importante por `opacity:0` no HTML/CSS base se GSAP não executar.
- Organize movimentos com `gsap.context()`/`gsap.matchMedia()` (ou escopos equivalentes bem encapsulados), `ScrollTrigger`, limpeza em unmount e `ScrollTrigger.refresh()` só quando necessário (após carregamento/fontes ou mudança de layout); evitar criar múltiplos triggers a cada render React.
- Rolar para âncoras deve atualizar posições sem dessincronizar seções pinned. Preserve rolagem reversível e status com reload em `#hash`.
- Usar `clamp()`, CSS custom properties, `min/max`, `svh/dvh` cuidadosamente; proteger Safari iOS, telas pequenas e orientação horizontal.
- **Não instalar Lenis, Three.js, React Three Fiber ou bibliotecas de UI pesadas por padrão.** GSAP existente é suficiente; se alguma dependência nova for essencial, justificar antes de adicionar. Não implementar WebGL/3D puramente decorativo que prejudique o projeto.

## 4. OTIMIZAÇÃO CRÍTICA DA SEQUÊNCIA DE FRAMES (~90,7 MB)

A sequência já é linda e **não pode perder continuidade, nitidez ou enquadramento**. Entretanto, a versão atual guarda 241 arquivos 1920x1080 e ocupa aproximadamente 90,7 MB, o que prejudica mobile e redes lentas. Implementar a recuperação da otimização iniciada no Work:

1. Faça backup versionado dos assets originais ou mantenha pasta fonte claramente identificada no workspace, sem sobrescrever destrutivamente.
2. Gere **variantes de resoluções apropriadas para desktop/tablet/mobile**, usando ferramentas locais em lote quando disponíveis (`sharp` apenas se necessário), com teste visual de pelo menos 5 frames-chave (`0001`, `0061`, `0121`, `0181`, `0241`). Preservar os 241 índices e sincronismo. Mobile deve ter composição própria quando crop comum cortar personagem ou circuito; um simples center-crop NÃO resolve todos os quadros.
3. Gere manifestos coerentes com os nomes e URLs efetivamente criados (sem 404), selecionando variante por viewport e DPR razoável. Fallback confiável para cada frame e imagem estática inicial.
4. **Prioridade absoluta ao frame de scroll atual**, prefetch da janela à frente conforme direção, limite de requisições concorrentes, cache LRU e remoção de frames distantes da memória decodificada; abortar/ignorar requests obsoletos quando possível, sem comprometer cache ou navegação reversa.
5. Primeiro frame/poster com prioridade; capítulos subsequentes carregados sob demanda. **Não requisitar todos os 241 frames imediatamente, não bloquear o site numa tela de loading 0–100%, não forçar pré-download de 90 MB**.
6. Controle de decode/repaint com `requestAnimationFrame`, Canvas dimensionado com DPR cap, sem redraw contínuo quando o frame não muda e sem retenção infinita de `ImageBitmap`/`HTMLImageElement`.
7. Medir no Network/Performance do navegador: bytes efetivamente transferidos após primeiro load, ausência de bursts massivos, continuidade ao descer/subir e comportamento sob rede lenta. Documentar tamanho final dos assets gerados e ganho percentual, **sem inventar números nem prometer pontuação Lighthouse sem medição**.
8. Se conversão completa inviabilizar a execução, implemente primeiro a lógica otimizada com os WebPs originais e deixe a geração do conjunto em script reexecutável + relatório claro; **não deixe animação quebrada**.

## 5. RESPONSIVIDADE E ACESSIBILIDADE — CRITÉRIOS INEGOCIÁVEIS

Validar 360×800, 390×844, 768×1024, 1024×768, 1440×900 e 1920×1080. Atenção a Safari iOS e Android. Nenhum `overflow-x`; nenhum rosto, mão, circuito, notebook ou mapa cortado indevidamente. Tipografia sem clipping e sem linhas órfãs exageradas. Touch targets e `:focus-visible` acessíveis. Navegação utilizável por teclado, contraste adequado e textos informativos sempre disponíveis para leitores de tela. Canvas e ilustração com alternativas textuais; não depender apenas de cor, hover ou movimento para comunicar conteúdo. Sem scroll-jacking agressivo, sem bloqueios de wheel/touch e sem autoplay de som.

## 6. PROCEDIMENTO DE IMPLEMENTAÇÃO — NÃO FIQUE PRESO EM TESTES

**Fase A — Auditoria curta, 1 passagem**: inspecionar package, componentes, CSS, loader, frames e estado do git; anotar problemas confirmados de enquadramento, peso, hierarquia e triggers. Registrar baseline e preservar arquivos do usuário. Executar `pnpm install --frozen-lockfile` apenas se necessário e `pnpm build`.

**Fase B — Design System V3**: atualizar variáveis globais, tipografia, grid, responsividade, detalhes editoriais e componentes de navegação. Não fazer refatoração cosmética vazia.

**Fase C — Motion e continuidade**: revisar hero e 4 capítulos em sequência; ajustar timeline, transições e controle de leitura sem animações. Fazer inspeção visual por marcos, não uma automação interminável de scroll.

**Fase D — Assets/performance**: variantes de frames, manifestos, loader e poster inicial. Medir ganho de payload e manter rollback.

**Fase E — Validação objetiva**: `pnpm build` e smoke tests Playwright nos fluxos principais. Faça no máximo **duas rodadas automatizadas de correção por bateria de testes**. Cada cenário deve ter timeout finito e logs curtos; **NUNCA permanecer horas executando um Playwright em loop**. Se uma inspeção automatizada falhar repetidamente, salve a evidência, isole a causa, faça a verificação manual pontual e continue entregando o que funciona. Testar desktop, mobile, capítulo direto, scroll reverso, modo reduzido, links e console. Não afirmar que testou algo que não foi executado.

**Fase F — Entrega**: código realmente alterado no projeto atual, página pronta para Vercel, sem `.env` secreto e sem incluir `node_modules` no pacote. Registrar arquivos editados, comandos rodados, falhas restantes e resultados visuais numa entrega `RELATORIO_FARMTEAM_V3.md`. Se possível gerar screenshots desktop/mobile nomeados e `FARMTEAM_AWWWARDS_V3.zip` excluindo `node_modules`, `.git`, caches e artefatos irrelevantes. Sugerir commit `feat(farmteam): elevate storytelling to cinematic v3`.

## 7. DEFINIÇÃO DE PRONTO

Só considere a V3 concluída quando:
- O visitante consegue seguir a história **do primeiro ao último capítulo**, voltar e saltar de seção pelo índice, com ou sem animações;
- Todas as cenas têm acabamento visual editorial consistente, **não apenas fade-ins**;
- Os 241 frames avançam e retrocedem sem travamentos relevantes e carregamento massivo desnecessário;
- Otto, mapa e as três meninas ficam corretamente enquadrados nas larguras verificadas;
- Dados, nomes, links e créditos são preservados com precisão; nenhuma autoria ou fonte é inventada;
- O build final passa e não há erros de execução evidentes no console;
- A opção “Ler sem animações” funciona, incluindo no mobile;
- Você entrega arquivos e implementação real, não apenas um relatório ou mockup.

**Comece agora pela auditoria do workspace e IMPLEMENTE a V3. Não me devolva somente recomendações, perguntas genéricas nem uma descrição de como seria. Preserve o projeto e comunique apenas bloqueios reais. Quando não houver artefato Work recuperável, reconstrua as melhorias acima diretamente sobre a V2 existente.**
