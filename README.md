# 🚌 BusOnTime Floripa

**Aplicação PWA de mobilidade urbana com rastreamento de ônibus em tempo real, previsão de lotação e funcionamento offline.**

[![2º lugar](https://img.shields.io/badge/🏆_2º_lugar-Hackathon_SENAI_2026-FFB300?style=flat-square)](https://github.com/Veralucia0909/busOnTime)
[![Deploy](https://img.shields.io/badge/deploy-online-success?style=flat-square)](https://busontime-floripa.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![PWA](https://img.shields.io/badge/PWA-instalável-5A0FC8?style=flat-square)](https://web.dev/progressive-web-apps/)

### 🔗 [Ver aplicação online →](https://busontime-floripa.vercel.app/)

---

<p align="center">
  <img src="./docs/demo.gif" alt="Demonstração do BusOnTime Floripa: busca de linha, mapa em tempo real e status de lotação" width="300">
</p>

---

## 💡 O problema

Quem usa transporte público em Florianópolis convive todo dia com a mesma incerteza: não saber quando o ônibus chega, nem se vai conseguir entrar quando ele chegar. Atrasos e superlotação são rotina, e a informação disponível hoje não ajuda a decidir nada — você descobre que o ônibus está cheio quando ele já parou na sua frente.

Durante o **Hackathon SENAI 2026**, validamos esse problema com passageiros reais e construímos o BusOnTime: um app que responde às duas perguntas que importam antes de sair de casa — *quando chega* e *cabe mais gente*.

A proposta técnica que diferenciou o projeto foi usar **visão computacional nas câmeras de segurança já instaladas nos veículos** para contar passageiros automaticamente, sem exigir nenhum hardware novo na frota. O nível de lotação chega ao usuário antes do ônibus chegar ao ponto.

## ✨ Funcionalidades

- 📍 **Rastreamento em tempo real** posição dos veículos no mapa, atualizada continuamente
- 📊 **Previsão de lotação** status do ônibus (vazio, moderado ou lotado) a partir do processamento de imagem
- ⭐ **Linhas favoritas e alertas** notificação de aproximação nas rotas que você mais usa
- 💳 **Carteira digital** recarga e gerenciamento de passagens dentro do app
- 📱 **Instalável e offline** funciona na tela inicial do celular, com dados em cache via Service Workers para quem espera o ônibus na rua com conexão instável

## 🧰 Tecnologias

| Camada | Stack |
|---|---|
| **Front-end** | React 18, Vite, JavaScript (ES6+), HTML5, CSS3 |
| **PWA** | Service Workers, Web App Manifest |
| **Mapas** | Leaflet |
| **Dados** | MySQL |
| **Design** | Figma (protótipo de alta fidelidade) |
| **Deploy** | Vercel |

## 🚀 Como rodar localmente

Pré-requisitos: [Node.js](https://nodejs.org) 18 ou superior.

```bash
# Clone o repositório
git clone https://github.com/Veralucia0909/busOnTime.git

# Entre na pasta
cd busOnTime

# Instale as dependências
npm install

# Rode em modo de desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

Para gerar a versão de produção e testar o comportamento PWA (Service Worker só funciona em build):

```bash
npm run build
npm run preview
```

## 📲 Instalar como app

O BusOnTime é um PWA dá para instalar sem passar por loja de aplicativos:

- **Android (Chrome):** menu ⋮ → *Adicionar à tela inicial*
- **iOS (Safari):** botão compartilhar → *Adicionar à Tela de Início*
- **Desktop (Chrome/Edge):** ícone de instalação na barra de endereço

## 📁 Estrutura

```
busOnTime/
├── public/            # Assets estáticos, manifest e ícones do PWA
├── src/               # Componentes, páginas e lógica da aplicação
├── index.html
├── vite.config.js     # Configuração do Vite
├── vercel.json        # Configuração de rotas no deploy
└── package.json
```

## 🎨 Design e modelo de negócio

Além do código, o projeto incluiu:

- **UI/UX** mapeamento da jornada do usuário e protótipo de alta fidelidade no Figma, com abordagem mobile-first
- **Business Model Canvas** estruturação da proposta de valor e do modelo de parceria com os setores público e privado

## 👥 Equipe

Projeto desenvolvido de forma colaborativa durante o Hackathon SENAI 2026:

| Integrante |
|---|
| [Vera Lúcia](https://github.com/Veralucia0909) |
| Marcelo |
| Mauricio |
| Daniel |

Com mentoria dos professores **Gleimon Ramos**, **Natália K.** e **Thiago Cordeiro**.

---

<p align="center">
  <sub>Desenvolvido durante o Creative &amp; Tech Challenge — Hackathon SENAI Florianópolis 2026</sub>
</p>
