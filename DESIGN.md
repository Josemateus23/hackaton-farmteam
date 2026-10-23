# Design System — Mulheres e Meninas na Tecnologia em Mato Grosso

## Stack
- framework: React 19 + TypeScript
- bundler: Vite 6
- styling: CSS Modules + Vanilla CSS custom properties
- animation: GSAP 3.12+ (ScrollTrigger)
- package-manager: pnpm (shared store)

## Visual Identity & Editorial Direction
- **Concept**: Graphic novel editorial (HQ editorial) showcasing women and girls creating technology in Mato Grosso.
- **Tone**: Grounded, high-tech, authentic, focused on education, public schools, and hands-on invention.
- **Visual Subject**: Concept illustration of an adolescent student at an electronics workbench with an illuminated blue circuit LED, notebooks, and prototype components.

## Tokens
- `--color-paper`: `#F4E3CB` (fine-tuned to match frame 0001 paper tone)
- `--color-paper-alt`: `#F2E8D5` (secondary ivory)
- `--color-ink`: `#181818` (deep print ink black)
- `--color-ink-muted`: `#4A453E` (secondary text)
- `--color-red`: `#D74735` (editorial accent red)
- `--color-blue`: `#2465EC` (circuit electric blue)
- `--color-blue-glow`: `rgba(36, 101, 236, 0.25)`
- `--color-border`: `rgba(24, 24, 24, 0.14)`
- `--font-display`: `'Space Grotesk', system-ui, -apple-system, sans-serif`
- `--font-body`: `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
- `--radius-sm`: `4px`
- `--radius-md`: `8px`
- `--radius-lg`: `14px`

## Scroll Timeline Architecture (0% - 100%)
- **Total Scroll Distance**: ~3.2 viewport heights (320vh) on desktop, ~220vh on mobile.
- **0% – 18%**: Initial stable frame (`landinghero_0001.webp`).
  - Text: *"Você usa tecnologia todos os dias."*
  - Frame remains stationary at index 0.
- **18% – 30%**: Smooth transition to text 2: *"Já imaginou criar a próxima?"*. Sequence begins subtle camera zoom.
- **30% – 45%**: Second text fades out cleanly. Canvas takes visual center stage.
- **45% – 85%**: Pure cinematic zoom towards the electronic circuit and lit blue LED.
  - Normalized progress $p \in [0.18, 0.85] \to \text{index} = \text{round}(p \times 240)$.
- **85% – 100%**: Final macro frame stays visible (`landinghero_0241.webp`), section prepares transition to normal flow.
- **Post-Sequence**: Next chapter banner: *"Em Mato Grosso, essa história já está sendo construída."* (Target of "Pular abertura").

## Memory & Canvas Performance Floor
- Windowed LRU cache: keeps ~30 nearest frames in memory, evicting distant decodes to prevent memory leaks.
- Canvas render decoupled via `requestAnimationFrame`, only redrawing when active frame index changes.
- Fallback LCP poster with `fetchpriority="high"`, replaced seamlessly on first canvas draw without blank flash.
- `prefers-reduced-motion`: Disables scroll sequence, presents static composition with standard document flow.
