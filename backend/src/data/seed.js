// Dados iniciais e catálogo oficial da Unidade Terceiriza Porto (Porto Seguro - BA)

export const UNIDADE_INFO = {
  nome: 'Terceiriza Porto',
  subtitulo: 'Unidade Porto Seguro — São Francisco',
  lema: 'Jam Ante Brasiliam Ego — Antes do Brasil, Eu',
  cnpj: '48.720.519/0001-90',
  telefone: '(73) 99910-3388',
  whatsapp: '5573999103388',
  email: 'portoseguro@terceirizaporto.com.br',
  endereco: {
    logradouro: 'Rua do Cajueiro, 29',
    bairro: 'São Francisco',
    cidade: 'Porto Seguro',
    uf: 'BA',
    cep: '45810-000',
    latitude: -16.4435,
    longitude: -39.0682,
    mapaUrl: 'https://www.google.com/maps?q=Rua%20do%20Cajueiro%2C%2029%2C%20S%C3%A3o%20Francisco%2C%20Porto%20Seguro%2C%20BA'
  },
  horarioAtendimento: 'Segunda a Sexta das 08:00 às 18:00',
  diariaAPartirDe: 169.0,
  extraFimDeSemana: 30.0,
  premioDestaque: {
    titulo: 'Somos uma empresa indicada ao Prêmio Excelência & Reclame Aqui 2026',
    descricao: 'A indicação é resultado da nossa reputação, pontualidade e confiabilidade no mercado de limpeza e terceirização na Costa do Descobrimento.',
    notaMedia: 4.9,
    avaliacoes: 642
  },
  coresBandeira: {
    verde: '#008B45',
    vermelho: '#DC2626',
    azulCaravela: '#0E87CC',
    douradoImperial: '#EAB308',
    branco: '#FFFFFF'
  },
  distritosAtendidos: [
    'Porto Seguro (Sede)',
    "Arraial d'Ajuda",
    'Trancoso',
    'Caraíva',
    'Vale Verde'
  ],
  bairrosDestaque: [
    'São Francisco',
    'Centro',
    'Taperapuã',
    'Alto Mundaí',
    'Baixo Mundaí',
    'Areião',
    'Campinho',
    'Pequi',
    'Village',
    'Paraíso dos Pataxós',
    'Outeiro da Glória',
    'Outeiro de São Francisco',
    'Frei Calixto (Baianão)',
    'Quinta do Descobrimento',
    'Mirante Caravelas',
    'Cambolo'
  ]
};

export const CATEGORIAS_SERVICOS = [
  {
    id: 'limpeza-residencial',
    slug: 'limpeza-residencial',
    nome: 'Limpeza Residencial',
    resumo: 'Faxina completa para casas, apartamentos e imóveis de temporada em Porto Seguro.',
    descricao: 'Diaristas selecionadas e verificadas para cuidar do seu lar ou casa de veraneio com padrão hoteleiro, segurança e pontualidade.',
    icone: 'home',
    destaque: true,
    aPartirDe: 169.0
  },
  {
    id: 'limpeza-empresarial',
    slug: 'limpeza-empresarial',
    nome: 'Limpeza Empresarial',
    resumo: 'Higienização profissional para escritórios, clínicas, lojas, pousadas e comércios.',
    descricao: 'Ambientes corporativos e comerciais impecáveis para receber clientes e turistas em Porto Seguro sem preocupações trabalhistas.',
    icone: 'building',
    destaque: true,
    aPartirDe: 169.0
  },
  {
    id: 'passadoria',
    slug: 'passadoria',
    nome: 'Passadoria',
    resumo: 'Passadeira residencial e para enxoval de pousadas/temporada (4h, 6h ou 8h).',
    descricao: 'Cuidado técnico com roupas pessoais, camisas sociais, roupas de cama, mesa e banho com organização completa.',
    icone: 'shirt',
    destaque: true,
    aPartirDe: 189.0
  },
  {
    id: 'limpeza-pos-obra',
    slug: 'limpeza-pos-obra',
    nome: 'Limpeza Pós-Obra',
    resumo: 'Remoção técnica de resíduos de tinta, gesso, cimento e poeira fina após reformas.',
    descricao: 'Equipe especializada para entregar sua obra, reforma ou empreendimento imobiliário pronto para morar ou inaugurar.',
    icone: 'hammer',
    destaque: true,
    aPartirDe: 390.0
  },
  {
    id: 'limpeza-de-vidros',
    slug: 'limpeza-de-vidros',
    nome: 'Limpeza de Vidros',
    resumo: 'Vitrines, fachadas, guarda-corpos e janelas expostas à maresia litorânea.',
    descricao: 'Protocolo específico contra manchas de salitre e maresia, devolvendo transparência e brilho às superfícies de vidro.',
    icone: 'sparkles',
    destaque: false,
    aPartirDe: 210.0
  },
  {
    id: 'revitalizacao-de-esquadrias',
    slug: 'revitalizacao-de-esquadrias',
    nome: 'Revitalização de Esquadrias',
    resumo: 'Renovação e proteção UV/hidro-repelente contra sol e maresia em alumínio e PVC.',
    descricao: 'Recupera a cor vibrante de janelas, portas e portões sem necessidade de troca ou obra, protegendo contra a ação do litoral.',
    icone: 'frame',
    destaque: false,
    aPartirDe: 320.0
  },
  {
    id: 'revitalizacao-de-piso',
    slug: 'revitalizacao-de-piso',
    nome: 'Revitalização de Piso',
    resumo: 'Limpeza profunda, decapagem e tratamento técnico de porcelanatos, pedras e decks.',
    descricao: 'Restaura o aspecto original de pisos internos e externos com equipamentos rotativos e produtos homologados.',
    icone: 'layers',
    destaque: false,
    aPartirDe: 350.0
  },
  {
    id: 'sanitizacao-de-ambientes',
    slug: 'sanitizacao-de-ambientes',
    nome: 'Sanitização de Ambientes',
    resumo: 'Eliminação de ácaros, fungos, bactérias e odores de mofo em ambientes fechados.',
    descricao: 'Ideal para quartos de hotéis, clínicas, consultórios e residências de temporada em clima tropical úmido.',
    icone: 'shield',
    destaque: false,
    aPartirDe: 240.0
  },
  {
    id: 'terceirizacao',
    slug: 'terceirizacao',
    nome: 'Terceirização (Contrato 12 meses)',
    resumo: 'Gestão completa de equipe fixa: Auxiliar de Limpeza, Copeira, Camareira, Jardineiro e mais.',
    descricao: 'Contrato formal de 12 meses com cobertura de faltas e férias, supervisão presencial em campo, EPIs e zero risco trabalhista.',
    icone: 'briefcase',
    destaque: true,
    aPartirDe: 2890.0
  },
  {
    id: 'recrutamento-e-selecao',
    slug: 'recrutamento-e-selecao',
    nome: 'Recrutamento e Seleção',
    resumo: 'Triagem rigorosa, entrevistas, referências e checagem de antecedentes.',
    descricao: 'Encontramos o profissional ideal para sua residência ou empresa em Porto Seguro com garantia de reposição.',
    icone: 'users',
    destaque: false,
    aPartirDe: 490.0
  }
];

export const PLANOS_DIARIAS = [
  {
    id: 'comercial-2h',
    unidade: 'Porto Seguro',
    categoria: 'comercial',
    categoriaId: 'limpeza-empresarial',
    titulo: 'Limpeza comercial · 2h',
    horas: 2,
    prestadores: 1,
    metragemRecomendada: 'até 30m²',
    preco: 169.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 02 horas | 01 Prestador | Recomendado para ambiente comercial de até 30m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'comercial-4h',
    unidade: 'Porto Seguro',
    categoria: 'comercial',
    categoriaId: 'limpeza-empresarial',
    titulo: 'Limpeza comercial · 4h',
    horas: 4,
    prestadores: 1,
    metragemRecomendada: 'até 60m²',
    preco: 199.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 04 horas | 01 Prestador | Recomendado para ambiente comercial de até 60m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'comercial-6h',
    unidade: 'Porto Seguro',
    categoria: 'comercial',
    categoriaId: 'limpeza-empresarial',
    titulo: 'Limpeza comercial · 6h',
    horas: 6,
    prestadores: 1,
    metragemRecomendada: 'até 90m²',
    preco: 239.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 06 horas | 01 Prestador | Recomendado para ambiente comercial de até 90m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'comercial-8h',
    unidade: 'Porto Seguro',
    categoria: 'comercial',
    categoriaId: 'limpeza-empresarial',
    titulo: 'Limpeza comercial · 8h',
    horas: 8,
    prestadores: 1,
    metragemRecomendada: 'até 120m²',
    preco: 289.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 08 horas | 01 Prestador | Recomendado para ambiente comercial de até 120m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'residencial-2h',
    unidade: 'Porto Seguro',
    categoria: 'residencial',
    categoriaId: 'limpeza-residencial',
    titulo: 'Limpeza residencial · 2h',
    horas: 2,
    prestadores: 1,
    metragemRecomendada: 'até 30m²',
    preco: 169.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 02 horas | 01 Prestador | Recomendado para ambiente residencial de até 30m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'residencial-4h',
    unidade: 'Porto Seguro',
    categoria: 'residencial',
    categoriaId: 'limpeza-residencial',
    titulo: 'Limpeza residencial · 4h',
    horas: 4,
    prestadores: 1,
    metragemRecomendada: 'até 50m²',
    preco: 189.0,
    extraFimDeSemana: 30.0,
    destaquePopular: true,
    descricao: 'Limpeza 04 horas | 01 Prestador | Recomendado para ambiente residencial de até 50m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'residencial-6h',
    unidade: 'Porto Seguro',
    categoria: 'residencial',
    categoriaId: 'limpeza-residencial',
    titulo: 'Limpeza residencial · 6h',
    horas: 6,
    prestadores: 1,
    metragemRecomendada: 'até 80m²',
    preco: 239.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 06 horas | 01 Prestador | Recomendado para ambiente residencial de até 80m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'residencial-8h',
    unidade: 'Porto Seguro',
    categoria: 'residencial',
    categoriaId: 'limpeza-residencial',
    titulo: 'Limpeza residencial · 8h',
    horas: 8,
    prestadores: 1,
    metragemRecomendada: 'até 120m²',
    preco: 289.0,
    extraFimDeSemana: 30.0,
    destaquePopular: true,
    descricao: 'Limpeza 08 horas | 01 Prestador | Recomendado para ambiente residencial de até 120m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'residencial-8h-2p',
    unidade: 'Porto Seguro',
    categoria: 'residencial',
    categoriaId: 'limpeza-residencial',
    titulo: 'Limpeza residencial · 8h · 2 profissionais',
    horas: 8,
    prestadores: 2,
    metragemRecomendada: 'até 200m²',
    preco: 550.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 08 horas | 02 Prestadores | Recomendado para ambiente residencial até 200m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'residencial-8h-3p',
    unidade: 'Porto Seguro',
    categoria: 'residencial',
    categoriaId: 'limpeza-residencial',
    titulo: 'Limpeza residencial · 8h · 3 profissionais',
    horas: 8,
    prestadores: 3,
    metragemRecomendada: 'até 300m²',
    preco: 830.0,
    extraFimDeSemana: 30.0,
    descricao: 'Limpeza 08 horas | 03 Prestadores | Recomendado para ambiente residencial até 300m² Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'passadeira-4h',
    unidade: 'Porto Seguro',
    categoria: 'passadoria',
    categoriaId: 'passadoria',
    titulo: 'Passadeira residencial · 4h',
    horas: 4,
    prestadores: 1,
    metragemRecomendada: 'Até 25 peças',
    preco: 189.0,
    extraFimDeSemana: 30.0,
    descricao: 'Passadeira 04 horas | 01 Prestador Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'passadeira-6h',
    unidade: 'Porto Seguro',
    categoria: 'passadoria',
    categoriaId: 'passadoria',
    titulo: 'Passadeira residencial · 6h',
    horas: 6,
    prestadores: 1,
    metragemRecomendada: 'Até 40 peças',
    preco: 239.0,
    extraFimDeSemana: 30.0,
    descricao: 'Passadeira 06 horas | 01 Prestador Extra fim de semana: R$ 30,00.'
  },
  {
    id: 'passadeira-8h',
    unidade: 'Porto Seguro',
    categoria: 'passadoria',
    categoriaId: 'passadoria',
    titulo: 'Passadeira residencial · 8h',
    horas: 8,
    prestadores: 1,
    metragemRecomendada: 'Até 60 peças',
    preco: 289.0,
    extraFimDeSemana: 30.0,
    descricao: 'Passadeira 08 horas | 01 Prestador Extra fim de semana: R$ 30,00.'
  }
];

export const DETALHES_TERCEIRIZACAO = {
  modalidades: [
    {
      id: 'somente-mao-de-obra',
      titulo: 'Somente mão de obra',
      subtitulo: 'Ideal para empresas que já possuem estoque próprio de insumos',
      itens: [
        'Mão de obra rigorosamente selecionada e treinada',
        'Uniformes e EPIs fornecidos pela Terceiriza Porto',
        'Supervisão presencial em dias e horários alternados',
        'Cobertura imediata de ausências e substituição em férias',
        'Gestão trabalhista completa: folha, FGTS, INSS e obrigações legais',
        'Produtos e equipamentos fornecidos pelo cliente'
      ]
    },
    {
      id: 'com-produtos-e-utensilios',
      titulo: 'Com produtos e utensílios',
      subtitulo: 'Solução completa Turnkey para hotéis, clínicas, condomínios e escritórios',
      destaque: true,
      itens: [
        'Mão de obra selecionada, treinada e padronizada',
        'Uniformes e EPIs fornecidos e substituídos pela Terceiriza Porto',
        'Equipamentos e utensílios profissionais em comodato',
        'Produtos de limpeza profissionais homologados pela ANVISA',
        'Supervisão presencial ativa sem aviso prévio ao profissional',
        'Cobertura garantida de faltas, atestados e período de férias',
        'Gestão trabalhista 100% assumida pela Terceiriza Porto'
      ]
    }
  ],
  funcoesTerceirizadas: [
    'Auxiliar de Limpeza',
    'Copeira',
    'Camareira para Hotéis e Pousadas',
    'Limpador de Vidros e Fachadas',
    'Auxiliar de Limpeza com acúmulo de Copeira',
    'Passadeira Profissional',
    'Cozinheira',
    'Jardineiro e Manutenção de Piscinas'
  ],
  segmentosAtendidos: [
    'Hotéis, Resorts e Pousadas na Orla e Arraial/Trancoso',
    'Hospitais, Clínicas e Consultórios',
    'Escritórios e Coworkings',
    'Condomínios Residenciais, Comerciais e Villages',
    'Restaurantes, Barracas de Praia e Lanchonetes',
    'Academias e Centros Esportivos',
    'Lojas e Estabelecimentos Comerciais',
    'Casas de Temporada e Alto Padrão',
    'Fábricas e Galpões Logísticos'
  ]
};

export const PERGUNTAS_FREQUENTES = [
  {
    id: 'faq-1',
    pergunta: 'Quanto custa uma diarista em Porto Seguro?',
    resposta: 'No cadastro da unidade Terceiriza Porto, a limpeza em Porto Seguro começa em R$ 169,00 para 2 horas (comercial ou residencial). Também oferecemos pacotes de 4h (R$ 189,00 residencial / R$ 199,00 comercial), 6h (R$ 239,00) e 8h (R$ 289,00), além de equipes com 2 ou 3 profissionais. Aos sábados e domingos há acréscimo fixo de R$ 30,00.'
  },
  {
    id: 'faq-2',
    pergunta: 'Como contratar faxineira ou terceirização em Porto Seguro?',
    resposta: 'Você agenda diretamente pelo aplicativo ou site Terceiriza Porto, acompanhando em tempo real a geolocalização dos terceirizados em Porto Seguro. Informe seu CEP para confirmar a cobertura, escolha o serviço e finalize o pedido.'
  },
  {
    id: 'faq-3',
    pergunta: 'Qual o WhatsApp da unidade Terceiriza Porto em Porto Seguro?',
    resposta: 'O WhatsApp oficial da unidade em Porto Seguro é (73) 99910-3388. Nossa base operacional fica na Rua do Cajueiro, 29 — Bairro São Francisco.'
  },
  {
    id: 'faq-4',
    pergunta: 'A Terceiriza Porto atende quais bairros e distritos em Porto Seguro?',
    resposta: "A zona de atendimento abrange Porto Seguro - BA (Sede: São Francisco, Centro, Taperapuã, Mundaí, Areião, Campinho, Pequi, Baianão, Mirante Caravelas e adjacências) e também os distritos de Arraial d'Ajuda, Trancoso, Caraíva e Vale Verde. Basta digitar seu CEP ou ativar o GPS para localizar os terceirizados mais próximos."
  },
  {
    id: 'faq-5',
    pergunta: 'Como funciona a geolocalização dos terceirizados?',
    resposta: 'Todos os profissionais parceiros e celetistas realizam check-in georreferenciado via GPS no aplicativo Terceiriza Porto. Clientes e supervisores visualizam no mapa em tempo real o status (Disponível, Em Deslocamento ou Em Atendimento), distância em km e previsão de chegada.'
  },
  {
    id: 'faq-6',
    pergunta: 'Qual o horário de atendimento da unidade em Porto Seguro?',
    resposta: 'Nosso escritório em São Francisco funciona de segunda, terça, quarta, quinta e sexta-feira das 08:00 às 18:00. Os serviços agendados podem ser realizados de segunda a domingo, conforme sua reserva.'
  }
];

export const COMPARACOES_GALERIA = [
  {
    id: 'comp-1',
    titulo: 'Limpeza Pós-Obra — Residencial & Temporada',
    local: 'Alto Mundaí · Porto Seguro - BA',
    antesDescricao: 'Piso porcelanato coberto por névoa de tinta acrílica, respingos de rejunte epóxi e poeira fina de gesso.',
    depoisDescricao: 'Remoção 100% técnica sem arranhar o esmalte do porcelanato, brilho espelhado e rodapés higienizados.',
    tempoExecucao: '8 horas (2 profissionais)',
    economiaEstimada: 'Evitou troca de 85m² de revestimento'
  },
  {
    id: 'comp-2',
    titulo: 'Revitalização de Esquadrias contra Maresia',
    local: 'Orla Norte (Taperapuã) · Porto Seguro - BA',
    antesDescricao: 'Janelas e portas de alumínio esbranquiçadas pela maresia, radiação UV e oxidação costeira.',
    depoisDescricao: 'Aplicação de revitalizador técnico com proteção UV e hidro-repelente; cor original restaurada sem obra.',
    tempoExecucao: '6 horas (1 especialista)',
    economiaEstimada: 'Economia de 78% frente à substituição'
  },
  {
    id: 'comp-3',
    titulo: 'Limpeza Técnica Empresarial & Pousadas',
    local: "Rua do Mucugê · Arraial d'Ajuda - BA",
    antesDescricao: 'Recepção, vidros panorâmicos e deck de madeira com acúmulo de salitre e tráfego intenso de alta temporada.',
    depoisDescricao: 'Vidros cristalinos com tratamento anti-maresia, deck revitalizado e sanitização completa de suítes.',
    tempoExecucao: 'Contrato Terceirizado Contínuo',
    economiaEstimada: 'Nota 9.8 em limpeza nos portais de reserva'
  }
];

export function createInitialDatabase() {
  return {
    orcamentos: [
      {
        id: 'ORC-2026-001',
        protocolo: 'TP-2026-8401',
        nome: 'Mariana Costa Figueiredo',
        email: 'mariana.figueiredo@pousadadocais.com.br',
        cpf: '428.519.630-06',
        telefone: '(73) 99812-4401',
        cep: '45810-002',
        logradouro: 'Avenida Beira Mar, Condomínio Brisas do Descobrimento',
        numero: '410',
        bairro: 'Taperapuã',
        complemento: 'Bloco B - Casa 04',
        servicoId: 'residencial-8h',
        servicoTitulo: 'Limpeza residencial · 8h',
        dataDesejada: '2026-11-14',
        fimDeSemana: true,
        valorBase: 289.0,
        valorExtraFimDeSemana: 30.0,
        valorTotal: 319.0,
        informacoesExtras: 'Casa de veraneio com 3 suítes e área gourmet. Priorizar limpeza de vidros da varanda.',
        aceitouTermos: true,
        aceitouPromocoes: true,
        status: 'CONFIRMADO',
        criadoEm: '2026-11-10T10:15:00.000Z'
      },
      {
        id: 'ORC-2026-002',
        protocolo: 'TP-2026-8402',
        nome: 'Roberto Almeida Nascimento',
        email: 'financeiro@clinicasaofrancisco.med.br',
        cpf: '193.847.260-91',
        telefone: '(73) 99945-7720',
        cep: '45810-000',
        logradouro: 'Rua do Cajueiro',
        numero: '118',
        bairro: 'São Francisco',
        complemento: 'Térreo e 1º Andar',
        servicoId: 'terceirizacao',
        servicoTitulo: 'Terceirização (Contrato 12 meses) · Com produtos e utensílios',
        dataDesejada: '2026-11-18',
        fimDeSemana: false,
        valorBase: 2890.0,
        valorExtraFimDeSemana: 0.0,
        valorTotal: 2890.0,
        informacoesExtras: 'Necessitamos de 1 Auxiliar de Limpeza + 1 Copeira de segunda a sexta para clínica médica.',
        aceitouTermos: true,
        aceitouPromocoes: false,
        status: 'EM_ANALISE',
        criadoEm: '2026-11-10T13:40:00.000Z'
      }
    ],
    agendamentos: [
      {
        id: 'AGD-2026-101',
        codigo: 'AGD-9921',
        clienteNome: 'Henrique Vasconcelos',
        clienteEmail: 'henrique.v@gmail.com',
        clienteCpf: '517.204.839-30',
        clienteTelefone: '(73) 99104-8899',
        cep: '45816-000',
        endereco: "Rua do Mucugê, 245 — Arraial d'Ajuda, Porto Seguro - BA",
        itens: [
          {
            planoId: 'residencial-6h',
            titulo: 'Limpeza residencial · 6h',
            precoUnitario: 239.0,
            quantidade: 1
          },
          {
            planoId: 'passadeira-4h',
            titulo: 'Passadeira residencial · 4h',
            precoUnitario: 189.0,
            quantidade: 1
          }
        ],
        dataAtendimento: '2026-11-13',
        horario: '08:00',
        fimDeSemana: false,
        subtotal: 428.0,
        taxaFimDeSemana: 0.0,
        total: 428.0,
        formaPagamento: 'PIX',
        profissionalDesignada: 'Luciana Ferreira dos Santos',
        status: 'AGENDADO',
        criadoEm: '2026-11-10T11:20:00.000Z'
      }
    ],
    profissionais: [
      {
        id: 'PROF-001',
        nome: 'Luciana Ferreira dos Santos',
        funcaoPrincipal: 'Diarista & Governança Hoteleira',
        genero: 'Feminino',
        cpf: '309.418.725-44',
        celular: '(73) 99931-2040',
        cep: '45810-000',
        logradouro: 'Rua do Cajueiro',
        numero: '72',
        bairro: 'São Francisco',
        distrito: 'Porto Seguro (Sede)',
        cidade: 'Porto Seguro',
        latitude: -16.4428,
        longitude: -39.0674,
        statusOperacional: 'DISPONIVEL',
        clienteAtual: 'Base Unidade São Francisco (Pronta para saída)',
        servicoAtual: 'Limpeza Residencial / Passadoria',
        bateriaNivel: 94,
        velocidadeKmh: 0,
        precisaoMetros: 6,
        ultimaAtualizacaoGps: new Date().toISOString(),
        experienciaPrevia: '6 anos em governança de hotelaria na Orla Norte e limpeza residencial de alto padrão.',
        servicosInteresse: ['Limpeza residencial', 'Limpeza Empresarial', 'Passar roupa'],
        modalidadePreferida: 'Profissional Parceiro(a)',
        diasDisponiveis: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        tempoDiariaPreferido: 'Todas as opções',
        inicioImediato: true,
        codigoIndicacao: 'PORTO1500',
        avaliacaoMedia: 4.95,
        atendimentosRealizados: 148,
        status: 'APROVADA',
        historicoCheckins: [
          {
            id: 'CHK-101',
            tipo: 'CHECKIN',
            local: 'Unidade São Francisco — Rua do Cajueiro, 29',
            latitude: -16.4428,
            longitude: -39.0674,
            horario: '2026-11-10T08:00:00.000Z'
          }
        ],
        criadoEm: '2026-10-05T09:00:00.000Z'
      },
      {
        id: 'PROF-002',
        nome: 'Edson Oliveira Batista',
        funcaoPrincipal: 'Especialista Pós-Obra & Revitalização de Pisos',
        genero: 'Masculino',
        cpf: '614.820.931-15',
        celular: '(73) 98842-1190',
        cep: '45810-002',
        logradouro: 'Avenida Beira Mar (Orla Norte)',
        numero: '410',
        bairro: 'Taperapuã',
        distrito: 'Porto Seguro (Sede)',
        cidade: 'Porto Seguro',
        latitude: -16.3948,
        longitude: -39.0422,
        statusOperacional: 'EM_ATENDIMENTO',
        clienteAtual: 'Condomínio Brisas do Descobrimento — Taperapuã',
        servicoAtual: 'Limpeza Pós-Obra · 8h',
        bateriaNivel: 82,
        velocidadeKmh: 0,
        precisaoMetros: 5,
        ultimaAtualizacaoGps: new Date().toISOString(),
        experienciaPrevia: 'Especialista em limpeza pós-obra, limpeza de vidros em altura e revitalização de pisos.',
        servicosInteresse: ['Limpeza Pós-obra', 'Limpeza Empresarial'],
        modalidadePreferida: 'Profissional Celetista',
        diasDisponiveis: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
        tempoDiariaPreferido: '8 horas',
        inicioImediato: true,
        codigoIndicacao: '',
        avaliacaoMedia: 4.92,
        atendimentosRealizados: 94,
        status: 'APROVADA',
        historicoCheckins: [
          {
            id: 'CHK-102',
            tipo: 'CHECKIN',
            local: 'Condomínio Brisas do Descobrimento — Taperapuã',
            latitude: -16.3948,
            longitude: -39.0422,
            horario: '2026-11-10T08:15:00.000Z'
          }
        ],
        criadoEm: '2026-10-12T14:30:00.000Z'
      },
      {
        id: 'PROF-003',
        nome: 'Cláudia Nascimento Rocha',
        funcaoPrincipal: 'Camareira & Limpeza de Temporada',
        genero: 'Feminino',
        cpf: '742.190.384-20',
        celular: '(73) 99974-6310',
        cep: '45816-000',
        logradouro: 'Rua do Mucugê',
        numero: '245',
        bairro: "Arraial d'Ajuda",
        distrito: "Arraial d'Ajuda",
        cidade: 'Porto Seguro',
        latitude: -16.4915,
        longitude: -39.0738,
        statusOperacional: 'EM_DESLOCAMENTO',
        clienteAtual: "A caminho de Rua do Mucugê, 245 — Arraial d'Ajuda",
        servicoAtual: 'Limpeza Residencial · 6h',
        bateriaNivel: 88,
        velocidadeKmh: 26,
        precisaoMetros: 8,
        ultimaAtualizacaoGps: new Date().toISOString(),
        experienciaPrevia: 'Atuação em pousadas de charme e casas de temporada em Arraial d’Ajuda e Trancoso.',
        servicosInteresse: ['Limpeza residencial', 'Passar roupa', 'Limpeza Empresarial'],
        modalidadePreferida: 'Profissional Parceiro(a)',
        diasDisponiveis: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        tempoDiariaPreferido: '6 horas',
        inicioImediato: true,
        codigoIndicacao: 'PORTO1500',
        avaliacaoMedia: 4.98,
        atendimentosRealizados: 210,
        status: 'APROVADA',
        historicoCheckins: [],
        criadoEm: '2026-09-18T11:00:00.000Z'
      },
      {
        id: 'PROF-004',
        nome: 'Janaína Pataxó Silva',
        funcaoPrincipal: 'Auxiliar de Limpeza & Copeira Terceirizada',
        genero: 'Feminino',
        cpf: '851.304.927-66',
        celular: '(73) 99850-4120',
        cep: '45810-004',
        logradouro: 'Alameda das Palmeiras',
        numero: '88',
        bairro: 'Alto Mundaí',
        distrito: 'Porto Seguro (Sede)',
        cidade: 'Porto Seguro',
        latitude: -16.4168,
        longitude: -39.0518,
        statusOperacional: 'DISPONIVEL',
        clienteAtual: 'Disponível na região Alto Mundaí / Orla',
        servicoAtual: 'Terceirização / Limpeza Comercial',
        bateriaNivel: 91,
        velocidadeKmh: 0,
        precisaoMetros: 5,
        ultimaAtualizacaoGps: new Date().toISOString(),
        experienciaPrevia: '4 anos como copeira e auxiliar de higienização em clínicas médicas e escritórios.',
        servicosInteresse: ['Limpeza Empresarial', 'Limpeza residencial'],
        modalidadePreferida: 'Profissional Celetista',
        diasDisponiveis: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
        tempoDiariaPreferido: '8 horas',
        inicioImediato: true,
        codigoIndicacao: '',
        avaliacaoMedia: 4.91,
        atendimentosRealizados: 118,
        status: 'APROVADA',
        historicoCheckins: [],
        criadoEm: '2026-10-20T10:00:00.000Z'
      },
      {
        id: 'PROF-005',
        nome: 'Marcos Vinícius Santana',
        funcaoPrincipal: 'Técnico em Esquadrias, Vidros & Sanitização',
        genero: 'Masculino',
        cpf: '529.601.478-09',
        celular: '(73) 99128-9055',
        cep: '45818-000',
        logradouro: 'Praça São João Batista (Quadrado)',
        numero: '14',
        bairro: 'Trancoso',
        distrito: 'Trancoso',
        cidade: 'Porto Seguro',
        latitude: -16.5882,
        longitude: -39.0921,
        statusOperacional: 'EM_ATENDIMENTO',
        clienteAtual: 'Villa Boutique Quadrado — Trancoso',
        servicoAtual: 'Revitalização de Esquadrias & Limpeza de Vidros',
        bateriaNivel: 77,
        velocidadeKmh: 0,
        precisaoMetros: 7,
        ultimaAtualizacaoGps: new Date().toISOString(),
        experienciaPrevia: '5 anos em tratamento anti-maresia de esquadrias, vidros panorâmicos e sanitização.',
        servicosInteresse: ['Limpeza Pós-obra', 'Limpeza Empresarial'],
        modalidadePreferida: 'Profissional Parceiro(a)',
        diasDisponiveis: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
        tempoDiariaPreferido: '8 horas',
        inicioImediato: true,
        codigoIndicacao: '',
        avaliacaoMedia: 4.96,
        atendimentosRealizados: 87,
        status: 'APROVADA',
        historicoCheckins: [],
        criadoEm: '2026-10-25T15:30:00.000Z'
      },
      {
        id: 'PROF-006',
        nome: 'Patrícia Gomes de Jesus',
        funcaoPrincipal: 'Passadeira & Diarista Residencial',
        genero: 'Feminino',
        cpf: '403.719.285-33',
        celular: '(73) 99902-7741',
        cep: '45810-001',
        logradouro: 'Avenida 22 de Abril',
        numero: '310',
        bairro: 'Centro',
        distrito: 'Porto Seguro (Sede)',
        cidade: 'Porto Seguro',
        latitude: -16.4492,
        longitude: -39.0641,
        statusOperacional: 'DISPONIVEL',
        clienteAtual: 'Disponível no Centro / Areião / São Francisco',
        servicoAtual: 'Passadeira Residencial · 4h / 6h',
        bateriaNivel: 97,
        velocidadeKmh: 0,
        precisaoMetros: 4,
        ultimaAtualizacaoGps: new Date().toISOString(),
        experienciaPrevia: 'Especialista em passadoria de enxoval hoteleiro, camisas sociais e organização residencial.',
        servicosInteresse: ['Passar roupa', 'Limpeza residencial'],
        modalidadePreferida: 'Profissional Parceiro(a)',
        diasDisponiveis: ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
        tempoDiariaPreferido: '6 horas',
        inicioImediato: true,
        codigoIndicacao: 'PORTO1500',
        avaliacaoMedia: 4.94,
        atendimentosRealizados: 132,
        status: 'APROVADA',
        historicoCheckins: [],
        criadoEm: '2026-10-29T09:15:00.000Z'
      }
    ],
    newsletter: [
      {
        id: 'NEWS-001',
        nome: 'Carla Menezes',
        email: 'carla.menezes@portosegurotur.com.br',
        criadoEm: '2026-11-09T16:00:00.000Z'
      }
    ]
  };
}
