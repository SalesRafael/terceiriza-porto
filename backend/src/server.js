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
  isWeekendDate
} from './utils/validators.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

function loadDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      return JSON.parse(raw);
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

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sistema: 'Terceiriza Porto API',
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

// Consulta de CEP e confirmação de cobertura em Porto Seguro - BA
app.get('/api/cep/:cep', async (req, res) => {
  const rawCep = req.params.cep || '';
  const localResult = resolveCepPortoSeguro(rawCep);

  if (!localResult.valido) {
    return res.status(400).json(localResult);
  }

  const digits = cleanDigits(rawCep);
  // Se não tiver logradouro preenchido no mapa local, tenta enriquecer via ViaCEP com timeout curto
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

  return res.json({
    ...localResult,
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

// Listar orçamentos
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

// Criar orçamento pelo formulário da unidade
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

// Atualizar status do orçamento
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

// Listar agendamentos do checkout direto
app.get('/api/agendamentos', (req, res) => {
  const db = loadDb();
  res.json(db.agendamentos);
});

// Criar agendamento via Checkout ("Contrate Já!")
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
    formaPagamento
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
    db.profissionais.find((p) => p.status === 'APROVADA')?.nome || 'Equipe Terceiriza Porto';

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

// Atualizar status de agendamento
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

// Listar profissionais ("Seja um(a) Profissional")
app.get('/api/profissionais', (req, res) => {
  const db = loadDb();
  res.json(db.profissionais);
});

// Cadastrar novo(a) profissional parceiro(a) ou celetista
app.post('/api/profissionais', (req, res) => {
  const {
    nome,
    genero,
    cpf,
    celular,
    cep,
    logradouro,
    numero,
    bairro,
    cidade,
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

  const novoProfissional = {
    id: `PROF-${String(seq).padStart(3, '0')}`,
    nome: String(nome).trim(),
    genero: genero || 'Prefiro não informar',
    cpf: String(cpf).trim(),
    celular: String(celular).trim(),
    cep: String(cep).trim(),
    logradouro: logradouro ? String(logradouro).trim() : '',
    numero: numero ? String(numero).trim() : 'S/N',
    bairro: String(bairro).trim(),
    cidade: cidade ? String(cidade).trim() : 'Porto Seguro',
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
    criadoEm: new Date().toISOString()
  };

  db.profissionais.unshift(novoProfissional);
  saveDb(db);

  res.status(201).json({
    mensagem: `Cadastro ${novoProfissional.id} recebido! A unidade Terceiriza Porto (São Francisco) analisará seu perfil e entrará em contato pelo WhatsApp.`,
    profissional: novoProfissional
  });
});

// Aprovar / alterar status de profissional
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

// Consulta da Área do Cliente por CPF, E-mail ou Protocolo
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

// Newsletter
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

// Dashboard administrativo da unidade
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
