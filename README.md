# Terceiriza Porto — Sistema de Diaristas, Limpeza e Terceirização em Porto Seguro (BA)

Sistema full-stack desenvolvido em **React (TypeScript + Vite)** e **Node.js (Express REST API)** inspirado no modelo de unidades de serviços de limpeza e terceirização em **Porto Seguro — BA (Bairro São Francisco)**, com identidade visual construída a partir das **cores oficiais da Bandeira de Porto Seguro**.

---

## 🎨 Identidade Visual — Cores da Bandeira de Porto Seguro

A paleta oficial do sistema homenageia a bandeira e o brasão histórico de Porto Seguro (*"Jam Ante Brasiliam Ego"* — *"Antes do Brasil, Eu"*):

| Cor da Bandeira | Hexadecimal | Aplicação no Sistema |
|---|---|---|
| 🟩 **Verde Oficial (Metade Esquerda)** | `#008B45` / `#006833` | Cabeçalhos institucionais, confirmação de cobertura de CEP, botões de contratação e selos |
| 🟥 **Vermelho Oficial (Metade Direita)** | `#DC2626` / `#B91C1C` | CTAs de destaque (*"CONTRATE JÁ!"*, *"Solicitar orçamento"*), selo *"Mais Contratado"* e alertas |
| 🟦 **Azul Oceano (Escudo das Caravelas)** | `#0E87CC` / `#0A5F91` | Escudo do logotipo, filtros de CEP, simulador B2B e destaques empresariais |
| 🟨 **Dourado Imperial (Colunas do Brasão)** | `#F5D061` / `#EAB308` | Troféu Reclame Aqui 2026, insígnias de excelência e detalhes nobres |
| ⬜ **Branco (Caravelas e Coroa Mural)** | `#FFFFFF` / `#F6F9F7` | Superfícies de cartões, formulários e contraste de leitura |

---

## ✨ Funcionalidades Principais

1. **Página Oficial da Unidade Porto Seguro (`/` e `/unidades/porto_seguro`)**:
   - Atalhos diretos para WhatsApp `(73) 99910-3388`, telefone, e-mail e endereço em **São Francisco (Rua do Cajueiro, 29)**.
   - **Formulário de Orçamento Inteligente**: validação e busca automática de CEP em Porto Seguro (`45810-000` São Francisco, `45810-002` Taperapuã, `45816-000` Arraial d'Ajuda, `45818-000` Trancoso, `45819-000` Caraíva, `45814-000` Vale Verde), desbloqueando automaticamente a lista de serviços da unidade e calculando acréscimo de fim de semana (`+R$ 30,00`).
   - **Selo Prêmio Reclame Aqui 2026** e **Galeria Comparativa Antes & Depois** (Limpeza Pós-Obra, Revitalização de Esquadrias contra Maresia e Limpeza Técnica em Pousadas).
   - **Tabela Oficial de Preços de Diárias em Porto Seguro** (a partir de `R$ 169,00`):
     - Limpeza Comercial (2h, 4h, 6h, 8h)
     - Limpeza Residencial (2h, 4h, 6h, 8h, 8h com 2 ou 3 profissionais)
     - Passadeira Residencial (4h, 6h, 8h)
   - **Cobertura de Bairros e Distritos** + **Perguntas Frequentes (FAQ)** em acordeão.
2. **Checkout Rápido & Carrinho Online (`CONTRATE JÁ!`)**:
   - Adição de pacotes de diárias ao carrinho, cálculo automático de adicional de sábado/domingo e geração imediata de código de agendamento (`AGD-XXXX`).
3. **Catálogo dos 10 Serviços & Terceirização 12 Meses (`/servicos`)**:
   - Detalhamento dos 10 serviços (Limpeza Residencial, Empresarial, Passadoria, Pós-Obra, Vidros, Revitalização de Esquadrias, Revitalização de Piso, Sanitização, Terceirização e Recrutamento & Seleção).
   - Comparativo **Somente Mão de Obra** vs. **Com Produtos e Utensílios**, funções terceirizáveis, segmentos atendidos e **Simulador Corporativo B2B**.
4. **Portal Seja um(a) Profissional (`/seja-profissional`)**:
   - Modalidades **Profissional Parceiro(a)** e **Profissional Celetista (CLT)** com formulário completo de inscrição integrado à API.
5. **Área do Cliente & Painel de Gestão da Unidade (`/area-do-cliente`)**:
   - Consulta de orçamentos e agendamentos por **Protocolo**, **CPF** ou **E-mail**.
   - Painel administrativo com indicadores em tempo real, aprovação de orçamentos, conclusão de diárias e triagem de profissionais.

---

## 🛠️ Tecnologias Utilizadas

- **Mobile (Flutter)**: Flutter 3.x / Dart 3.x (`mobile_flutter/`), `flutter_map` + `latlong2` (Mapa OpenStreetMap interativo de Porto Seguro), `geolocator` (GPS real do dispositivo + simulador de telemetria), `http` e `url_launcher`.
- **Frontend Web**: React 19, TypeScript, React Router 7, Vite 6, CSS Custom Properties (Design System Bandeira de Porto Seguro) + **Mapa GPS de Terceirizados** (`/mapa-gps`).
- **Backend API**: Node.js, Express, CORS, Cálculo de Distância Haversine (`km`) e ETA (`min`), Persistência JSON (`backend/src/data/db.json`) com seed automático da unidade Porto Seguro.

---

## 📱 Aplicativo Mobile Flutter (`mobile_flutter/`) com Geolocalização dos Terceirizados

O aplicativo Flutter possui 4 módulos principais na barra de navegação inferior, estilizados com as cores da Bandeira de Porto Seguro:

1. **Mapa GPS (`lib/screens/mapa_terceirizados_screen.dart`)**:
   - Mapa interativo de **Porto Seguro — BA** com pinos em tempo real de todos os terceirizados (*Disponível*, *Em Deslocamento*, *Em Atendimento*).
   - Cálculo automático de distância em quilômetros (`km`) e tempo estimado de chegada (`min`) a partir do **GPS real do usuário** (`Geolocator`) ou de pontos de referência (*São Francisco*, *Centro*, *Orla Taperapuã*, *Alto Mundaí*, *Arraial d'Ajuda*, *Trancoso*, *Caraíva*).
   - Linha de rota (`PolylineLayer`) conectando o cliente ao terceirizado selecionado e botão **"Simular GPS"** para movimentação em tempo real.
2. **Diárias R$ 169+ (`lib/screens/diarias_precos_screen.dart`)**:
   - Todos os 13 pacotes oficiais de Porto Seguro com checkout rápido e vínculo direto com o terceirizado selecionado no radar GPS.
3. **Orçamento CEP (`lib/screens/orcamento_cep_screen.dart`)**:
   - Validação de CEP de Porto Seguro, preenchimento automático de bairro/logradouro e geração de protocolo (`TP-2026-XXXX`).
4. **Check-in GPS (`lib/screens/modo_terceirizado_screen.dart`)**:
   - Modo dedicado ao profissional terceirizado em campo para transmitir coordenadas GPS, iniciar deslocamento e registrar **Check-in / Check-out Georreferenciado** no endereço do cliente.

### Como executar o App Flutter

```bash
cd mobile_flutter
flutter pub get
flutter run
```

Para validar análise estática e testes automatizados do Flutter:

```bash
cd mobile_flutter
flutter analyze
flutter test
```

---

## 🚀 Como Executar o Projeto

### 1. Instalar dependências

```bash
npm run install:all
```

### 2. Iniciar o Backend (Node.js — Porta 3001)

```bash
npm run dev:backend
```

A API ficará disponível em `http://localhost:3001/api/unidade`.

### 3. Iniciar o Frontend (React + Vite — Porta 5173)

Em outro terminal:

```bash
npm run dev:frontend
```

Acesse no navegador: **http://localhost:5173**

---

## 📡 Principais Rotas da API (Node.js)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Status da API da unidade Porto Seguro |
| `GET` | `/api/unidade` | Dados completos da unidade, preços, serviços, bairros e FAQ |
| `GET` | `/api/cep/:cep` | Valida cobertura de CEP em Porto Seguro e libera os serviços |
| `GET` | `/api/orcamentos` | Lista solicitações de orçamento |
| `POST` | `/api/orcamentos` | Registra novo orçamento com cálculo de diária e fim de semana |
| `PATCH` | `/api/orcamentos/:id/status` | Atualiza status do orçamento (`EM_ANALISE`, `CONFIRMADO`, `CONCLUIDO`) |
| `GET` | `/api/agendamentos` | Lista contratações do Checkout Rápido |
| `POST` | `/api/agendamentos` | Cria novo agendamento online |
| `GET` | `/api/profissionais` | Lista profissionais parceiros(as) e celetistas |
| `POST` | `/api/profissionais` | Cadastra novo(a) profissional |
| `GET` | `/api/cliente/consulta?termo=` | Consulta pedidos por protocolo, CPF ou e-mail |
| `GET` | `/api/dashboard` | Indicadores consolidados da unidade |
