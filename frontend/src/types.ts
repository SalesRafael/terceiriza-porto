export interface EnderecoUnidade {
  logradouro: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  mapaUrl: string;
}

export interface UnidadeInfo {
  nome: string;
  subtitulo: string;
  lema: string;
  cnpj: string;
  telefone: string;
  whatsapp: string;
  email: string;
  endereco: EnderecoUnidade;
  horarioAtendimento: string;
  diariaAPartirDe: number;
  extraFimDeSemana: number;
  premioDestaque: {
    titulo: string;
    descricao: string;
    notaMedia: number;
    avaliacoes: number;
  };
  coresBandeira: {
    verde: string;
    vermelho: string;
    azulCaravela: string;
    douradoImperial: string;
    branco: string;
  };
  distritosAtendidos: string[];
  bairrosDestaque: string[];
}

export interface CategoriaServico {
  id: string;
  slug: string;
  nome: string;
  resumo: string;
  descricao: string;
  icone: string;
  destaque: boolean;
  aPartirDe: number;
}

export interface PlanoDiaria {
  id: string;
  unidade: string;
  categoria: 'comercial' | 'residencial' | 'passadoria';
  categoriaId: string;
  titulo: string;
  horas: number;
  prestadores: number;
  metragemRecomendada: string;
  preco: number;
  extraFimDeSemana: number;
  destaquePopular?: boolean;
  descricao: string;
}

export interface ModalidadeTerceirizacao {
  id: string;
  titulo: string;
  subtitulo: string;
  destaque?: boolean;
  itens: string[];
}

export interface DetalhesTerceirizacao {
  modalidades: ModalidadeTerceirizacao[];
  funcoesTerceirizadas: string[];
  segmentosAtendidos: string[];
}

export interface PerguntaFrequente {
  id: string;
  pergunta: string;
  resposta: string;
}

export interface ComparacaoGaleria {
  id: string;
  titulo: string;
  local: string;
  antesDescricao: string;
  depoisDescricao: string;
  tempoExecucao: string;
  economiaEstimada: string;
}

export interface UnidadePayload {
  unidade: UnidadeInfo;
  categoriasServicos: CategoriaServico[];
  planosDiarias: PlanoDiaria[];
  detalhesTerceirizacao: DetalhesTerceirizacao;
  perguntasFrequentes: PerguntaFrequente[];
  comparacoesGaleria: ComparacaoGaleria[];
  estatisticasRede: {
    profissionaisCadastrados: number;
    atendimentosAno: number;
    bairrosCobertos: number;
    indiceSatisfacao: string;
  };
}

export interface CepLookupResponse {
  valido: boolean;
  atendido: boolean;
  foraDaZonaPadrao?: boolean;
  cep?: string;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  distrito?: string;
  mensagem: string;
  servicosDisponiveis?: Array<{
    id: string;
    titulo: string;
    preco: number;
    categoria: string;
  }>;
  servicosEspeciais?: Array<{
    id: string;
    titulo: string;
    preco: number;
  }>;
}

export interface Orcamento {
  id: string;
  protocolo: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  servicoId: string;
  servicoTitulo: string;
  dataDesejada: string;
  fimDeSemana: boolean;
  valorBase: number;
  valorExtraFimDeSemana: number;
  valorTotal: number;
  informacoesExtras: string;
  aceitouTermos: boolean;
  aceitouPromocoes: boolean;
  status: 'EM_ANALISE' | 'CONFIRMADO' | 'CONCLUIDO' | 'CANCELADO';
  criadoEm: string;
}

export interface ItemCarrinho {
  planoId: string;
  titulo: string;
  precoUnitario: number;
  quantidade: number;
}

export interface Agendamento {
  id: string;
  codigo: string;
  clienteNome: string;
  clienteEmail: string;
  clienteCpf: string;
  clienteTelefone: string;
  cep: string;
  endereco: string;
  itens: ItemCarrinho[];
  dataAtendimento: string;
  horario: string;
  fimDeSemana: boolean;
  subtotal: number;
  taxaFimDeSemana: number;
  total: number;
  formaPagamento: string;
  profissionalDesignada: string;
  status: 'AGENDADO' | 'EM_EXECUCAO' | 'CONCLUIDO' | 'CANCELADO';
  criadoEm: string;
}

export interface Profissional {
  id: string;
  nome: string;
  genero: string;
  cpf: string;
  celular: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  experienciaPrevia: string;
  servicosInteresse: string[];
  modalidadePreferida: string;
  diasDisponiveis: string[];
  tempoDiariaPreferido: string;
  inicioImediato: boolean;
  codigoIndicacao: string;
  avaliacaoMedia: number;
  atendimentosRealizados: number;
  status: 'EM_TRIAGEM' | 'APROVADA' | 'INATIVA';
  criadoEm: string;
}

export interface DashboardMetrics {
  totalOrcamentos: number;
  orcamentosConfirmados: number;
  totalAgendamentos: number;
  totalProfissionais: number;
  profissionaisAprovados: number;
  assinantesNewsletter: number;
  volumeTotalEstimado: number;
}
