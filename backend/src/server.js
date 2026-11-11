import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  UNIDADE_INFO,
  CATEGORIAS_SERVICOS,
  PLANOS_DIARIAS,
  DETALHES_TERCEIRIZACAO,
  PERGUNTAS_FREQUENTES,
  COMPARACOES_GALERIA,
  createInitialDatabase
} from './data/seed.js';
import {
  cleanDigits,
  resolveCepPortoSeguro,
  isWeekendDate,
  COORDENADAS_UNIDADE_SAO_FRANCISCO,
  COORDENADAS_PORTO_SEGURO,
  calcularDistanciaKm,
  calcularTempoDeslocamentoMin
} from './utils/validators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      // Garante que profissionais antigos tenham coordenadas GPS
      if (Array.isArray(parsed.profissionais) && parsed.profissionais.length >= 6 && parsed.profissionais[0].latitude) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Erro ao ler db.json, recriando seed:', err.message);
  }
  const initial = createInitialDatabase();
  saveDb(initial);
  return initial;
}

function saveDb(data) {
  try {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar db.json:', err.message);
  }
}

function enriquecerProfissionalComDistancia(prof, refLat, refLng) {
  const lat = Number(prof.latitude ?? COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude);
  const lng = Number(prof.longitude ?? COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude);
  const distanciaKm = calcularDistanciaKm(refLat, refLng, lat, lng);
  const tempoEstimadoMin = calcularTempoDeslocamentoMin(distanciaKm);
  return {
    ...prof,
    latitude: lat,
    longitude: lng,
    statusOperacional: prof.statusOperacional || 'DISPONIVEL',
    funcaoPrincipal: prof.funcaoPrincipal || 'Profissional Terceirizado(a)',
    bateriaNivel: prof.bateriaNivel ?? 90,
    velocidadeKmh: prof.velocidadeKmh ?? 0,
    precisaoMetros: prof.precisaoMetros ?? 6,
    ultimaAtualizacaoGps: prof.ultimaAtualizacaoGps || new Date().toISOString(),
    historicoCheckins: Array.isArray(prof.historicoCheckins) ? prof.historicoCheckins : [],
    distanciaKm,
    tempoEstimadoMin
  };
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sistema: 'Terceiriza Porto API (Web + Flutter Mobile + GPS)',
    unidade: 'Porto Seguro - BA (São Francisco)',
    timestamp: new Date().toISOString()
  });
});

// Dados consolidados da unidade Porto Seguro
app.get('/api/unidade', (req, res) => {
  const db = loadDb();
  res.json({
    unidade: UNIDADE_INFO,
    categoriasServicos: CATEGORIAS_SERVICOS,
    planosDiarias: PLANOS_DIARIAS,
    detalhesTerceirizacao: DETALHES_TERCEIRIZACAO,
    perguntasFrequentes: PERGUNTAS_FREQUENTES,
    comparacoesGaleria: COMPARACOES_GALERIA,
    estatisticasRede: {
      profissionaisCadastrados: 48 + db.profissionais.length,
      atendimentosAno: 3420 + db.agendamentos.length * 10,
      bairrosCobertos: UNIDADE_INFO.bairrosDestaque.length + UNIDADE_INFO.distritosAtendidos.length,
      indiceSatisfacao: '98,7%'
    }
  });
});

// Lista de serviços e planos
app.get('/api/servicos', (req, res) => {
  res.json({
    categorias: CATEGORIAS_SERVICOS,
    planos: PLANOS_DIARIAS,
    terceirizacao: DETALHES_TERCEIRIZACAO
  });
});

// ============================================================================
// GEOLOCALIZAÇÃO EM TEMPO REAL DOS TERCEIRIZADOS EM PORTO SEGURO - BA
// ============================================================================

app.get('/api/geolocalizacao/terceirizados', (req, res) => {
  const db = loadDb();
  const refLat = req.query.lat
    ? Number(req.query.lat)
    : COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude;
  const refLng = req.query.lng
    ? Number(req.query.lng)
    : COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude;
  const filtroStatus = req.query.status ? String(req.query.status) : '';
  const filtroDistrito = req.query.distrito ? String(req.query.distrito) : '';

  let lista = db.profissionais
    .map((p) => enriquecerProfissionalComDistancia(p, refLat, refLng))
    .sort((a, b) => a.distanciaKm - b.distanciaKm);

  if (filtroStatus && filtroStatus !== 'TODOS') {
    lista = lista.filter((p) => p.statusOperacional === filtroStatus);
  }
  if (filtroDistrito && filtroDistrito !== 'TODOS') {
    lista = lista.filter(
      (p) =>
        (p.distrito && p.distrito.toLowerCase().includes(filtroDistrito.toLowerCase())) ||
        (p.bairro && p.bairro.toLowerCase().includes(filtroDistrito.toLowerCase()))
    );
  }

  const resumoOperacional = {
    totalRastreados: db.profissionais.length,
    disponiveis: db.profissionais.filter((p) => p.statusOperacional === 'DISPONIVEL').length,
    emAtendimento: db.profissionais.filter((p) => p.statusOperacional === 'EM_ATENDIMENTO').length,
    emDeslocamento: db.profissionais.filter((p) => p.statusOperacional === 'EM_DESLOCAMENTO').length
  };

  res.json({
    referenciaCliente: {
      latitude: refLat,
      longitude: refLng
    },
    unidadeBase: COORDENADAS_UNIDADE_SAO_FRANCISCO,
    pontosReferenciaPortoSeguro: COORDENADAS_PORTO_SEGURO,
    resumoOperacional,
    terceirizados: lista
  });
});

// Buscar terceirizados mais próximos de um CEP ou coordenada GPS do cliente
app.post('/api/geolocalizacao/proximos', (req, res) => {
  const { latitude, longitude, cep, raioMaximoKm = 35, servicoDesejado } = req.body || {};

  let refLat = COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude;
  let refLng = COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude;
  let localReferencia = 'Unidade São Francisco — Porto Seguro';

  if (cep) {
    const cepInfo = resolveCepPortoSeguro(cep);
    if (cepInfo.latitude && cepInfo.longitude) {
      refLat = cepInfo.latitude;
      refLng = cepInfo.longitude;
      localReferencia = `${cepInfo.bairro || 'Porto Seguro'} (${cepInfo.cep || cep})`;
    }
  }
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    refLat = latitude;
    refLng = longitude;
    localReferencia = `Posição GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
  }

  const db = loadDb();
  let lista = db.profissionais
    .map((p) => enriquecerProfissionalComDistancia(p, refLat, refLng))
    .filter((p) => p.distanciaKm <= Number(raioMaximoKm));

  if (servicoDesejado) {
    const termo = String(servicoDesejado).toLowerCase();
    lista = lista.filter(
      (p) =>
        p.servicosInteresse.some((s) => s.toLowerCase().includes(termo)) ||
        (p.funcaoPrincipal && p.funcaoPrincipal.toLowerCase().includes(termo))
    );
  }

  lista.sort((a, b) => a.distanciaKm - b.distanciaKm);

  res.json({
    localReferencia,
    latitude: refLat,
    longitude: refLng,
    totalEncontrados: lista.length,
    terceirizadosProximos: lista
  });
});

// Atualizar posição GPS em tempo real de um terceirizado
app.patch('/api/profissionais/:id/localizacao', (req, res) => {
  const { id } = req.params;
  const {
    latitude,
    longitude,
    statusOperacional,
    bairro,
    clienteAtual,
    servicoAtual,
    bateriaNivel,
    velocidadeKmh,
    precisaoMetros
  } = req.body || {};

  const db = loadDb();
  const idx = db.profissionais.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ erro: 'Terceirizado(a) não encontrado(a).' });
  }

  const atual = db.profissionais[idx];
  if (typeof latitude === 'number') atual.latitude = Number(latitude.toFixed(6));
  if (typeof longitude === 'number') atual.longitude = Number(longitude.toFixed(6));
  if (statusOperacional) atual.statusOperacional = statusOperacional;
  if (bairro) atual.bairro = bairro;
  if (clienteAtual !== undefined) atual.clienteAtual = clienteAtual;
  if (servicoAtual !== undefined) atual.servicoAtual = servicoAtual;
  if (typeof bateriaNivel === 'number') atual.bateriaNivel = bateriaNivel;
  if (typeof velocidadeKmh === 'number') atual.velocidadeKmh = velocidadeKmh;
  if (typeof precisaoMetros === 'number') atual.precisaoMetros = precisaoMetros;
  atual.ultimaAtualizacaoGps = new Date().toISOString();

  saveDb(db);
  res.json({
    mensagem: `Localização GPS de ${atual.nome} atualizada com sucesso!`,
    profissional: enriquecerProfissionalComDistancia(
      atual,
      COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude,
      COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude
    )
  });
});

// Registrar Check-in / Check-out Georreferenciado do Terceirizado no local do cliente
app.post('/api/profissionais/:id/checkin', (req, res) => {
  const { id } = req.params;
  const {
    tipo = 'CHECKIN',
    local = 'Cliente em Porto Seguro - BA',
    latitude,
    longitude,
    observacao = ''
  } = req.body || {};

  const db = loadDb();
  const idx = db.profissionais.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ erro: 'Terceirizado(a) não encontrado(a).' });
  }

  const prof = db.profissionais[idx];
  const lat = typeof latitude === 'number' ? latitude : prof.latitude;
  const lng = typeof longitude === 'number' ? longitude : prof.longitude;

  prof.latitude = Number(lat.toFixed(6));
  prof.longitude = Number(lng.toFixed(6));
  prof.ultimaAtualizacaoGps = new Date().toISOString();

  if (tipo === 'CHECKIN') {
    prof.statusOperacional = 'EM_ATENDIMENTO';
    prof.clienteAtual = local;
    prof.velocidadeKmh = 0;
  } else if (tipo === 'DESLOCAMENTO') {
    prof.statusOperacional = 'EM_DESLOCAMENTO';
    prof.clienteAtual = `Em rota para: ${local}`;
    prof.velocidadeKmh = 25;
  } else {
    prof.statusOperacional = 'DISPONIVEL';
    prof.clienteAtual = `Check-out concluído (${local})`;
    prof.velocidadeKmh = 0;
    prof.atendimentosRealizados = (prof.atendimentosRealizados || 0) + 1;
  }

  if (!Array.isArray(prof.historicoCheckins)) {
    prof.historicoCheckins = [];
  }

  const registroCheckin = {
    id: `CHK-${Date.now().toString().slice(-5)}`,
    tipo,
    local,
    latitude: prof.latitude,
    longitude: prof.longitude,
    observacao,
    horario: new Date().toISOString()
  };

  prof.historicoCheckins.unshift(registroCheckin);
  saveDb(db);

  res.status(201).json({
    mensagem: `${tipo} georreferenciado registrado com sucesso para ${prof.nome}!`,
    checkin: registroCheckin,
    profissional: enriquecerProfissionalComDistancia(
      prof,
      COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude,
      COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude
    )
  });
});

// Simular movimentação GPS em tempo real dos terceirizados em Porto Seguro
app.post('/api/geolocalizacao/simular-movimento', (req, res) => {
  const db = loadDb();
  const agora = new Date().toISOString();

  db.profissionais.forEach((p, idx) => {
    const deltaLat = (Math.random() - 0.48) * 0.0032;
    const deltaLng = (Math.random() - 0.48) * 0.0032;
    p.latitude = Number(((p.latitude || -16.4435) + deltaLat).toFixed(6));
    p.longitude = Number(((p.longitude || -39.0682) + deltaLng).toFixed(6));
    p.ultimaAtualizacaoGps = agora;
    if (p.statusOperacional === 'EM_DESLOCAMENTO' || idx % 3 === 0) {
      p.velocidadeKmh = Math.floor(18 + Math.random() * 24);
    } else {
      p.velocidadeKmh = 0;
    }
  });

  saveDb(db);

  res.json({
    mensagem: 'Telemetria GPS dos terceirizados atualizada em tempo real!',
    terceirizados: db.profissionais.map((p) =>
      enriquecerProfissionalComDistancia(
        p,
        COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude,
        COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude
      )
    )
  });
});

// ============================================================================
// DEMAIS ROTAS DE CEP, ORÇAMENTOS, AGENDAMENTOS E PROFISSIONAIS
// ============================================================================

app.get('/api/cep/:cep', async (req, res) => {
  const rawCep = req.params.cep || '';
  const localResult = resolveCepPortoSeguro(rawCep);

  if (!localResult.valido) {
    return res.status(400).json(localResult);
  }

  const digits = cleanDigits(rawCep);
  if (!localResult.logradouro) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2500);
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`, {
        signal: controller.signal
      });
      clearTimeout(timer);
      if (response.ok) {
        const viaCep = await response.json();
        if (!viaCep.erro) {
          localResult.logradouro = viaCep.logradouro || localResult.logradouro;
          localResult.bairro = viaCep.bairro || localResult.bairro || 'São Francisco';
          localResult.cidade = viaCep.localidade || 'Porto Seguro';
          localResult.uf = viaCep.uf || 'BA';
        }
      }
    } catch {
      // Fallback silencioso para base local de Porto Seguro
    }
  }

  const coordBairro =
    COORDENADAS_PORTO_SEGURO[localResult.bairro] || COORDENADAS_UNIDADE_SAO_FRANCISCO;

  return res.json({
    ...localResult,
    latitude: localResult.latitude ?? coordBairro.latitude,
    longitude: localResult.longitude ?? coordBairro.longitude,
    servicosDisponiveis: PLANOS_DIARIAS.map((p) => ({
      id: p.id,
      titulo: `${p.titulo} — R$ ${p.preco.toFixed(2).replace('.', ',')}`,
      preco: p.preco,
      categoria: p.categoria
    })),
    servicosEspeciais: CATEGORIAS_SERVICOS.map((c) => ({
      id: c.id,
      titulo: `${c.nome} (a partir de R$ ${c.aPartirDe.toFixed(2).replace('.', ',')})`,
      preco: c.aPartirDe
    }))
  });
});

app.get('/api/orcamentos', (req, res) => {
  const db = loadDb();
  const { status, busca } = req.query;
  let lista = [...db.orcamentos].sort((a, b) =>
    String(b.criadoEm).localeCompare(String(a.criadoEm))
  );

  if (status) {
    lista = lista.filter((o) => o.status === status);
  }
  if (busca) {
    const q = String(busca).toLowerCase();
    lista = lista.filter(
      (o) =>
        o.nome.toLowerCase().includes(q) ||
        o.protocolo.toLowerCase().includes(q) ||
        o.bairro.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q) ||
        cleanDigits(o.cpf).includes(cleanDigits(q))
    );
  }

  res.json(lista);
});

app.post('/api/orcamentos', (req, res) => {
  const {
    nome,
    email,
    cpf,
    telefone,
    cep,
    logradouro,
    numero,
    bairro,
    complemento,
    servicoId,
    dataDesejada,
    informacoesExtras,
    aceitouTermos,
    aceitouPromocoes
  } = req.body || {};

  if (!nome || !email || !cpf || !telefone || !cep || !logradouro || !bairro) {
    return res.status(400).json({
      erro: 'Preencha todos os campos obrigatórios (Nome, E-mail, CPF, Telefone, CEP, Logradouro e Bairro).'
    });
  }

  if (!aceitouTermos) {
    return res.status(400).json({
      erro: 'É necessário aceitar os Termos de Uso para solicitar o orçamento.'
    });
  }

  const plano = PLANOS_DIARIAS.find((p) => p.id === servicoId);
  const categoria = CATEGORIAS_SERVICOS.find((c) => c.id === servicoId);

  const valorBase = plano ? plano.preco : categoria ? categoria.aPartirDe : 169.0;
  const servicoTitulo = plano
    ? plano.titulo
    : categoria
    ? categoria.nome
    : 'Limpeza residencial · 2h';

  const fimDeSemana = isWeekendDate(dataDesejada);
  const valorExtraFimDeSemana = fimDeSemana ? UNIDADE_INFO.extraFimDeSemana : 0.0;
  const valorTotal = valorBase + valorExtraFimDeSemana;

  const db = loadDb();
  const seq = db.orcamentos.length + 1;
  const protocolo = `TP-2026-${String(8400 + seq)}`;

  const novoOrcamento = {
    id: `ORC-2026-${String(seq).padStart(3, '0')}`,
    protocolo,
    nome: String(nome).trim(),
    email: String(email).trim(),
    cpf: String(cpf).trim(),
    telefone: String(telefone).trim(),
    cep: String(cep).trim(),
    logradouro: String(logradouro).trim(),
    numero: numero ? String(numero).trim() : 'S/N',
    bairro: String(bairro).trim(),
    complemento: complemento ? String(complemento).trim() : '',
    servicoId: servicoId || 'residencial-2h',
    servicoTitulo,
    dataDesejada: dataDesejada || new Date().toISOString().slice(0, 10),
    fimDeSemana,
    valorBase,
    valorExtraFimDeSemana,
    valorTotal,
    informacoesExtras: informacoesExtras ? String(informacoesExtras).trim() : '',
    aceitouTermos: Boolean(aceitouTermos),
    aceitouPromocoes: Boolean(aceitouPromocoes),
    status: 'EM_ANALISE',
    criadoEm: new Date().toISOString()
  };

  db.orcamentos.unshift(novoOrcamento);
  saveDb(db);

  res.status(201).json({
    mensagem: `Orçamento ${protocolo} registrado com sucesso na unidade Terceiriza Porto (São Francisco - Porto Seguro)!`,
    orcamento: novoOrcamento
  });
});

app.patch('/api/orcamentos/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const validStatuses = ['EM_ANALISE', 'CONFIRMADO', 'CONCLUIDO', 'CANCELADO'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ erro: 'Status inválido.' });
  }

  const db = loadDb();
  const idx = db.orcamentos.findIndex((o) => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ erro: 'Orçamento não encontrado.' });
  }

  db.orcamentos[idx].status = status;
  saveDb(db);
  res.json(db.orcamentos[idx]);
});

app.get('/api/agendamentos', (req, res) => {
  const db = loadDb();
  res.json(db.agendamentos);
});

app.post('/api/agendamentos', (req, res) => {
  const {
    clienteNome,
    clienteEmail,
    clienteCpf,
    clienteTelefone,
    cep,
    endereco,
    itens,
    dataAtendimento,
    horario,
    formaPagamento,
    profissionalDesignada
  } = req.body || {};

  if (!clienteNome || !clienteTelefone || !cep || !endereco || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({
      erro: 'Informe seus dados de contato, endereço em Porto Seguro e selecione ao menos 1 serviço no carrinho.'
    });
  }

  const subtotal = itens.reduce(
    (acc, item) => acc + Number(item.precoUnitario || 169) * Number(item.quantidade || 1),
    0
  );
  const fimDeSemana = isWeekendDate(dataAtendimento);
  const taxaFimDeSemana = fimDeSemana ? UNIDADE_INFO.extraFimDeSemana : 0.0;
  const total = subtotal + taxaFimDeSemana;

  const db = loadDb();
  const codigo = `AGD-${9920 + db.agendamentos.length + 1}`;
  const profAprovada =
    profissionalDesignada ||
    db.profissionais.find((p) => p.status === 'APROVADA')?.nome ||
    'Equipe Terceiriza Porto';

  const novoAgendamento = {
    id: `AGD-2026-${String(100 + db.agendamentos.length + 1)}`,
    codigo,
    clienteNome: String(clienteNome).trim(),
    clienteEmail: clienteEmail ? String(clienteEmail).trim() : '',
    clienteCpf: clienteCpf ? String(clienteCpf).trim() : '',
    clienteTelefone: String(clienteTelefone).trim(),
    cep: String(cep).trim(),
    endereco: String(endereco).trim(),
    itens,
    dataAtendimento: dataAtendimento || new Date().toISOString().slice(0, 10),
    horario: horario || '08:00',
    fimDeSemana,
    subtotal,
    taxaFimDeSemana,
    total,
    formaPagamento: formaPagamento || 'PIX',
    profissionalDesignada: profAprovada,
    status: 'AGENDADO',
    criadoEm: new Date().toISOString()
  };

  db.agendamentos.unshift(novoAgendamento);
  saveDb(db);

  res.status(201).json({
    mensagem: `Contratação ${codigo} confirmada! Nossa unidade em São Francisco enviará os detalhes pelo WhatsApp.`,
    agendamento: novoAgendamento
  });
});

app.patch('/api/agendamentos/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, profissionalDesignada } = req.body || {};
  const db = loadDb();
  const idx = db.agendamentos.findIndex((a) => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ erro: 'Agendamento não encontrado.' });
  }
  if (status) db.agendamentos[idx].status = status;
  if (profissionalDesignada) db.agendamentos[idx].profissionalDesignada = profissionalDesignada;
  saveDb(db);
  res.json(db.agendamentos[idx]);
});

app.get('/api/profissionais', (req, res) => {
  const db = loadDb();
  const refLat = COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude;
  const refLng = COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude;
  res.json(db.profissionais.map((p) => enriquecerProfissionalComDistancia(p, refLat, refLng)));
});

app.post('/api/profissionais', (req, res) => {
  const {
    nome,
    funcaoPrincipal,
    genero,
    cpf,
    celular,
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
    latitude,
    longitude,
    experienciaPrevia,
    servicosInteresse,
    modalidadePreferida,
    diasDisponiveis,
    tempoDiariaPreferido,
    inicioImediato,
    codigoIndicacao,
    aceitouTermos
  } = req.body || {};

  if (!nome || !cpf || !celular || !cep || !bairro) {
    return res.status(400).json({
      erro: 'Preencha Nome completo, CPF, Celular, CEP e Bairro para enviar sua inscrição.'
    });
  }

  if (!aceitouTermos) {
    return res.status(400).json({
      erro: 'Você precisa aceitar os Termos de Uso para concluir seu cadastro profissional.'
    });
  }

  const db = loadDb();
  const seq = db.profissionais.length + 1;
  const coordBairro = COORDENADAS_PORTO_SEGURO[bairro] || COORDENADAS_UNIDADE_SAO_FRANCISCO;
  const lat = typeof latitude === 'number' ? latitude : coordBairro.latitude + (Math.random() - 0.5) * 0.004;
  const lng = typeof longitude === 'number' ? longitude : coordBairro.longitude + (Math.random() - 0.5) * 0.004;

  const novoProfissional = {
    id: `PROF-${String(seq).padStart(3, '0')}`,
    nome: String(nome).trim(),
    funcaoPrincipal: funcaoPrincipal || 'Diarista & Terceirização',
    genero: genero || 'Prefiro não informar',
    cpf: String(cpf).trim(),
    celular: String(celular).trim(),
    cep: String(cep).trim(),
    logradouro: logradouro ? String(logradouro).trim() : '',
    numero: numero ? String(numero).trim() : 'S/N',
    bairro: String(bairro).trim(),
    distrito: coordBairro.distrito || 'Porto Seguro (Sede)',
    cidade: cidade ? String(cidade).trim() : 'Porto Seguro',
    latitude: Number(lat.toFixed(6)),
    longitude: Number(lng.toFixed(6)),
    statusOperacional: 'DISPONIVEL',
    clienteAtual: `Disponível em ${bairro}`,
    servicoAtual: Array.isArray(servicosInteresse) && servicosInteresse[0] ? servicosInteresse[0] : 'Limpeza Residencial',
    bateriaNivel: 100,
    velocidadeKmh: 0,
    precisaoMetros: 5,
    ultimaAtualizacaoGps: new Date().toISOString(),
    experienciaPrevia: experienciaPrevia ? String(experienciaPrevia).trim() : 'Em capacitação inicial',
    servicosInteresse: Array.isArray(servicosInteresse) && servicosInteresse.length > 0
      ? servicosInteresse
      : ['Limpeza residencial'],
    modalidadePreferida: modalidadePreferida || 'Profissional Parceiro(a)',
    diasDisponiveis: Array.isArray(diasDisponiveis) && diasDisponiveis.length > 0
      ? diasDisponiveis
      : ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'],
    tempoDiariaPreferido: tempoDiariaPreferido || 'Todas as opções',
    inicioImediato: Boolean(inicioImediato),
    codigoIndicacao: codigoIndicacao ? String(codigoIndicacao).trim() : '',
    avaliacaoMedia: 5.0,
    atendimentosRealizados: 0,
    status: 'EM_TRIAGEM',
    historicoCheckins: [],
    criadoEm: new Date().toISOString()
  };

  db.profissionais.unshift(novoProfissional);
  saveDb(db);

  res.status(201).json({
    mensagem: `Cadastro ${novoProfissional.id} recebido com geolocalização ativa em ${bairro}!`,
    profissional: enriquecerProfissionalComDistancia(
      novoProfissional,
      COORDENADAS_UNIDADE_SAO_FRANCISCO.latitude,
      COORDENADAS_UNIDADE_SAO_FRANCISCO.longitude
    )
  });
});

app.patch('/api/profissionais/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};
  const db = loadDb();
  const idx = db.profissionais.findIndex((p) => p.id === id);
  if (idx === -1) {
    return res.status(404).json({ erro: 'Profissional não encontrado(a).' });
  }
  db.profissionais[idx].status = status || 'APROVADA';
  saveDb(db);
  res.json(db.profissionais[idx]);
});

app.get('/api/cliente/consulta', (req, res) => {
  const termo = String(req.query.termo || '').trim().toLowerCase();
  if (!termo) {
    return res.status(400).json({ erro: 'Informe seu CPF, E-mail ou Protocolo para consultar.' });
  }

  const digits = cleanDigits(termo);
  const db = loadDb();

  const orcamentos = db.orcamentos.filter(
    (o) =>
      o.email.toLowerCase() === termo ||
      o.protocolo.toLowerCase() === termo ||
      o.nome.toLowerCase().includes(termo) ||
      (digits.length >= 4 && cleanDigits(o.cpf).includes(digits))
  );

  const agendamentos = db.agendamentos.filter(
    (a) =>
      a.clienteEmail.toLowerCase() === termo ||
      a.codigo.toLowerCase() === termo ||
      a.clienteNome.toLowerCase().includes(termo) ||
      (digits.length >= 4 && cleanDigits(a.clienteCpf).includes(digits))
  );

  res.json({
    termo,
    totalEncontrado: orcamentos.length + agendamentos.length,
    orcamentos,
    agendamentos
  });
});

app.post('/api/newsletter', (req, res) => {
  const { nome, email } = req.body || {};
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ erro: 'Informe um e-mail válido para assinar a newsletter.' });
  }

  const db = loadDb();
  const novo = {
    id: `NEWS-${String(db.newsletter.length + 1).padStart(3, '0')}`,
    nome: nome ? String(nome).trim() : 'Cliente Porto Seguro',
    email: String(email).trim(),
    criadoEm: new Date().toISOString()
  };

  db.newsletter.push(novo);
  saveDb(db);

  res.status(201).json({
    mensagem: 'Inscrição confirmada! Você receberá novidades e dicas da Terceiriza Porto.',
    inscricao: novo
  });
});

app.get('/api/dashboard', (req, res) => {
  const db = loadDb();
  const receitaOrcamentos = db.orcamentos
    .filter((o) => o.status !== 'CANCELADO')
    .reduce((acc, o) => acc + Number(o.valorTotal || 0), 0);
  const receitaAgendamentos = db.agendamentos
    .filter((a) => a.status !== 'CANCELADO')
    .reduce((acc, a) => acc + Number(a.total || 0), 0);

  res.json({
    totalOrcamentos: db.orcamentos.length,
    orcamentosConfirmados: db.orcamentos.filter((o) => o.status === 'CONFIRMADO' || o.status === 'CONCLUIDO').length,
    totalAgendamentos: db.agendamentos.length,
    totalProfissionais: db.profissionais.length,
    profissionaisAprovados: db.profissionais.filter((p) => p.status === 'APROVADA').length,
    terceirizadosEmCampo: db.profissionais.filter(
      (p) => p.statusOperacional === 'EM_ATENDIMENTO' || p.statusOperacional === 'EM_DESLOCAMENTO'
    ).length,
    assinantesNewsletter: db.newsletter.length,
    volumeTotalEstimado: receitaOrcamentos + receitaAgendamentos
  });
});

// Servir build estático do frontend caso exista
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Terceiriza Porto API rodando em http://localhost:${PORT}`);
});
