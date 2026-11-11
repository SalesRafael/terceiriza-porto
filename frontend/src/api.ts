import {
  UnidadePayload,
  CepLookupResponse,
  Orcamento,
  Agendamento,
  Profissional,
  DashboardMetrics,
  ItemCarrinho,
  GeolocalizacaoPayload
} from './types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.erro || data.mensagem || 'Erro na comunicação com o servidor.');
  }
  return data as T;
}

export const api = {
  getUnidade: () => request<UnidadePayload>('/api/unidade'),
  consultarCep: (cep: string) =>
    request<CepLookupResponse>(`/api/cep/${encodeURIComponent(cep)}`),
  criarOrcamento: (payload: Record<string, unknown>) =>
    request<{ mensagem: string; orcamento: Orcamento }>('/api/orcamentos', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  listarOrcamentos: () => request<Orcamento[]>('/api/orcamentos'),
  atualizarStatusOrcamento: (id: string, status: Orcamento['status']) =>
    request<Orcamento>(`/api/orcamentos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  criarAgendamento: (payload: {
    clienteNome: string;
    clienteEmail: string;
    clienteCpf: string;
    clienteTelefone: string;
    cep: string;
    endereco: string;
    itens: ItemCarrinho[];
    dataAtendimento: string;
    horario: string;
    formaPagamento: string;
  }) =>
    request<{ mensagem: string; agendamento: Agendamento }>('/api/agendamentos', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  listarAgendamentos: () => request<Agendamento[]>('/api/agendamentos'),
  atualizarStatusAgendamento: (id: string, status: Agendamento['status']) =>
    request<Agendamento>(`/api/agendamentos/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  cadastrarProfissional: (payload: Record<string, unknown>) =>
    request<{ mensagem: string; profissional: Profissional }>('/api/profissionais', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  listarProfissionais: () => request<Profissional[]>('/api/profissionais'),
  atualizarStatusProfissional: (id: string, status: Profissional['status']) =>
    request<Profissional>(`/api/profissionais/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),
  consultarCliente: (termo: string) =>
    request<{
      termo: string;
      totalEncontrado: number;
      orcamentos: Orcamento[];
      agendamentos: Agendamento[];
    }>(`/api/cliente/consulta?termo=${encodeURIComponent(termo)}`),
  assinarNewsletter: (nome: string, email: string) =>
    request<{ mensagem: string }>('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ nome, email })
    }),
  getDashboard: () => request<DashboardMetrics>('/api/dashboard'),
  getGeolocalizacaoTerceirizados: (lat?: number, lng?: number, status?: string) => {
    const params = new URLSearchParams();
    if (typeof lat === 'number') params.set('lat', String(lat));
    if (typeof lng === 'number') params.set('lng', String(lng));
    if (status) params.set('status', status);
    return request<GeolocalizacaoPayload>(
      `/api/geolocalizacao/terceirizados?${params.toString()}`
    );
  },
  simularMovimentoGps: () =>
    request<{ mensagem: string; terceirizados: Profissional[] }>(
      '/api/geolocalizacao/simular-movimento',
      { method: 'POST' }
    ),
  registrarCheckinGps: (
    id: string,
    payload: {
      tipo: 'CHECKIN' | 'DESLOCAMENTO' | 'CHECKOUT';
      local: string;
      latitude?: number;
      longitude?: number;
    }
  ) =>
    request<{ mensagem: string; profissional: Profissional }>(
      `/api/profissionais/${id}/checkin`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    )
};

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}
