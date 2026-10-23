# Mulheres e Meninas na Tecnologia em Mato Grosso

> Projeto desenvolvido pela equipe **Farm Team** para o Hackathon High Tech.

Experiência web editorial e narrativa em estilo HQ/graphic novel celebrando o impacto de pesquisadoras, estudantes e projetos que transformam a tecnologia e a computação no Estado de Mato Grosso.

---

## 📖 Visão Geral

O projeto une narrativa visual interativa, animação coordenada por scroll (*scroll-driven storytelling*) e rigor documental para contar histórias reais e inspiradoras:

1. **Abertura Editorial (Canvas Scroll Hero):** Sequência interativa quadro a quadro retratando uma jovem na bancada de desenvolvimento com circuitos eletrônicos.
2. **Capítulo 01 — Mato Grosso:** Traço cartográfico oficial baseado na malha digital do IBGE (SIRGAS 2000, código 51), contextualizando o polo de inovação e pesquisa.
3. **Capítulo 02 — Tecnologia Assistiva (Robô Otto):** Registro da pesquisa desenvolvida na Universidade Federal de Mato Grosso (UFMT), coordenada por professoras e com participação de estudantes do ensino médio e graduação, focada em robôs assistivos para terapia de crianças no espectro autista.
4. **Capítulo 03 — Comunidade & Futuro (Meninas Digitais MT):** Destaque para o projeto parceiro da Sociedade Brasileira de Computação (SBC), ativo desde 2015 na inclusão de garotas na computação.
5. **Capítulo 04 — Encerramento & Fontes:** Chamada para ação e catálogo detalhado com transparência de fontes oficiais governamentais e acadêmicas.

---

## 🛠️ Tecnologias Utilizadas

- **Framework & Runtime:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Animações & Scroll:** [GSAP 3](https://greensock.com/gsap/) com ScrollTrigger
- **Estilização:** CSS Modules e Variáveis CSS (estética editorial: papel marfim `#F4E3CB`, tinta preta `#181818`, vermelho `#D74735` e azul condutor `#1A56DB`)
- **Gerenciador de Pacotes:** [pnpm](https://pnpm.io/)
- **Testes & Qualidade:** Playwright (E2E)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (versão 9 ou superior)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/Josemateus23/hackaton-farmteam.git

# Acesse a pasta do projeto
cd hackaton-farmteam

# Instale as dependências com pnpm
pnpm install
```

### Executar em Desenvolvimento

```bash
pnpm dev
```
Acesse a aplicação no seu navegador em `http://localhost:5173`.

### Build de Produção

```bash
# Compilar TypeScript e gerar pacote otimizado
pnpm build

# Pré-visualizar o build localmente
pnpm preview
```

### Testes E2E

```bash
pnpm test:e2e
```

---

## ♿ Acessibilidade e Inclusão

- Suporte completo a **`prefers-reduced-motion`** para usuários com sensibilidade a movimento.
- Links acessíveis para pular introdução (*skip-link* `#proximo-capitulo`).
- Marcação semântica com tags `header`, `main`, `section`, `article`, `figure` e `footer`.
- Alto contraste e leitura confortável seguindo padrões editoriais.

---

## 📄 Fontes e Referências

- **IBGE:** Malhas Territoriais e Digitais Oficiais de Mato Grosso (SIRGAS 2000).
- **FAPEMAT:** Registro documental da pesquisa com o robô Otto na UFMT (janeiro/2023).
- **LAVI / FATA / UFMT:** Laboratório de Ambientes Virtuais Interativos da UFMT.
- **SBC (Sociedade Brasileira de Computação):** Projeto parceiro Meninas Digitais Mato Grosso.

---

**Equipe Farm Team — Hackathon 2026**
