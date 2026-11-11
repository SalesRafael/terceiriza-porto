import React, { useState, useEffect } from 'react';
import { api, formatCurrency } from '../api';
import {
  Orcamento,
  Agendamento,
  Profissional,
  DashboardMetrics
} from '../types';

export const AreaClienteAdminPage: React.FC = () => {
  const [abaAtiva, setAbaAtiva] = useState<'cliente' | 'gestao'>('cliente');

  // Consulta do Cliente
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadoCliente, setResultadoCliente] = useState<{
    orcamentos: Orcamento[];
    agendamentos: Agendamento[];
  } | null>(null);
  const [buscandoCliente, setBuscandoCliente] = useState(false);

  // Gestão da Unidade
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [profissionais, setProfissionais] = useState<Profissional[]>([]);
  const [carregandoGestao, setCarregandoGestao] = useState(false);

  const carregarDadosUnidade = async () => {
    setCarregandoGestao(true);
    try {
      const [m, o, a, p] = await Promise.all([
        api.getDashboard(),
        api.listarOrcamentos(),
        api.listarAgendamentos(),
        api.listarProfissionais()
      ]);
      setMetrics(m);
      setOrcamentos(o);
      setAgendamentos(a);
      setProfissionais(p);
    } catch (err) {
      console.error('Erro ao carregar painel:', err);
    } finally {
      setCarregandoGestao(false);
    }
  };

  useEffect(() => {
    carregarDadosUnidade();
  }, []);

  const handleConsultarCliente = async (termoInput?: string) => {
    const q = (termoInput ?? termoBusca).trim();
    if (!q) return;
    setTermoBusca(q);
    setBuscandoCliente(true);
    try {
      const res = await api.consultarCliente(q);
      setResultadoCliente({
        orcamentos: res.orcamentos,
        agendamentos: res.agendamentos
      });
    } catch (err) {
      console.error(err);
    } finally {
      setBuscandoCliente(false);
    }
  };

  const handleStatusOrcamento = async (id: string, status: Orcamento['status']) => {
    await api.atualizarStatusOrcamento(id, status);
    await carregarDadosUnidade();
  };

  const handleStatusAgendamento = async (id: string, status: Agendamento['status']) => {
    await api.atualizarStatusAgendamento(id, status);
    await carregarDadosUnidade();
  };

  const handleStatusProfissional = async (id: string, status: Profissional['status']) => {
    await api.atualizarStatusProfissional(id, status);
    await carregarDadosUnidade();
  };

  return (
    <div className="area-cliente-page">
      <section className="page-hero">
        <div className="container">
          <span className="flag-tag">
            <span className="flag-dot flag-dot--green" />
            <span className="flag-dot flag-dot--red" />
            CENTRAL DO CLIENTE & GESTÃO DA UNIDADE SÃO FRANCISCO
          </span>
          <h1>
            Área do <strong>Cliente</strong> & Painel Operacional
          </h1>
          <p>
            Acompanhe seus protocolos de orçamento, diárias agendadas e gerencie a operação da
            unidade Terceiriza Porto em tempo real.
          </p>

          <div className="panel-mode-tabs">
            <button
              type="button"
              className={abaAtiva === 'cliente' ? 'active' : ''}
              onClick={() => setAbaAtiva('cliente')}
            >
              👤 Consulta do Cliente (Protocolo / CPF)
            </button>
            <button
              type="button"
              className={abaAtiva === 'gestao' ? 'active' : ''}
              onClick={() => {
                setAbaAtiva('gestao');
                carregarDadosUnidade();
              }}
            >
              📊 Painel de Gestão da Unidade (Admin)
            </button>
          </div>
        </div>
      </section>

      <section className="panel-content-section">
        <div className="container">
          {abaAtiva === 'cliente' ? (
            <div className="cliente-lookup-card">
              <h2>Consulte seus Orçamentos e Diárias Agendadas</h2>
              <p>
                Digite seu <strong>Protocolo</strong>, <strong>CPF</strong>,{' '}
                <strong>E-mail</strong> ou <strong>Nome</strong> (ou teste com um protocolo de
                demonstração abaixo):
              </p>

              <div className="cep-quick-buttons">
                <span>Testar consulta rápida:</span>
                <button
                  type="button"
                  className="cep-chip"
                  onClick={() => handleConsultarCliente('TP-2026-8401')}
                >
                  🔎 Protocolo TP-2026-8401
                </button>
                <button
                  type="button"
                  className="cep-chip"
                  onClick={() => handleConsultarCliente('AGD-9921')}
                >
                  🔎 Agendamento AGD-9921
                </button>
                <button
                  type="button"
                  className="cep-chip"
                  onClick={() => handleConsultarCliente('Roberto')}
                >
                  🔎 Cliente Clínica São Francisco
                </button>
              </div>

              <form
                className="lookup-search-bar"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConsultarCliente();
                }}
              >
                <input
                  type="text"
                  placeholder="Digite o protocolo (ex: TP-2026-8401), CPF ou e-mail..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <button type="submit" className="btn btn--green" disabled={buscandoCliente}>
                  {buscandoCliente ? 'Consultando...' : 'Consultar Agora'}
                </button>
              </form>

              {resultadoCliente && (
                <div className="lookup-results">
                  {resultadoCliente.orcamentos.length === 0 &&
                  resultadoCliente.agendamentos.length === 0 ? (
                    <div className="empty-state-box">
                      Nenhum orçamento ou agendamento encontrado para &ldquo;{termoBusca}&rdquo;.
                    </div>
                  ) : (
                    <>
                      {resultadoCliente.orcamentos.map((orc) => (
                        <div key={orc.id} className="record-card">
                          <div className="record-card__header">
                            <div>
                              <span className="protocol-pill">{orc.protocolo}</span>
                              <strong>{orc.servicoTitulo}</strong>
                            </div>
                            <span className={`status-badge status--${orc.status}`}>
                              {orc.status}
                            </span>
                          </div>
                          <div className="record-card__grid">
                            <div>
                              <small>Cliente</small>
                              <strong>{orc.nome}</strong>
                            </div>
                            <div>
                              <small>Endereço em Porto Seguro</small>
                              <strong>
                                {orc.logradouro}, {orc.numero} — {orc.bairro} ({orc.cep})
                              </strong>
                            </div>
                            <div>
                              <small>Data Prevista</small>
                              <strong>{orc.dataDesejada}</strong>
                            </div>
                            <div>
                              <small>Valor Estimado</small>
                              <strong>{formatCurrency(orc.valorTotal)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}

                      {resultadoCliente.agendamentos.map((agd) => (
                        <div key={agd.id} className="record-card">
                          <div className="record-card__header">
                            <div>
                              <span className="protocol-pill">{agd.codigo}</span>
                              <strong>
                                {agd.itens.map((i) => i.titulo).join(' + ')}
                              </strong>
                            </div>
                            <span className={`status-badge status--${agd.status}`}>
                              {agd.status}
                            </span>
                          </div>
                          <div className="record-card__grid">
                            <div>
                              <small>Cliente</small>
                              <strong>{agd.clienteNome}</strong>
                            </div>
                            <div>
                              <small>Local do Atendimento</small>
                              <strong>{agd.endereco}</strong>
                            </div>
                            <div>
                              <small>Data & Horário</small>
                              <strong>
                                {agd.dataAtendimento} às {agd.horario}
                              </strong>
                            </div>
                            <div>
                              <small>Profissional Designada / Total</small>
                              <strong>
                                {agd.profissionalDesignada} • {formatCurrency(agd.total)}
                              </strong>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="gestao-dashboard">
              {metrics && (
                <div className="kpi-grid">
                  <div className="kpi-card kpi-card--green">
                    <small>Orçamentos Recebidos</small>
                    <strong>{metrics.totalOrcamentos}</strong>
                    <span>{metrics.orcamentosConfirmados} confirmados/concluídos</span>
                  </div>
                  <div className="kpi-card kpi-card--blue">
                    <small>Contratações Online (Checkout)</small>
                    <strong>{metrics.totalAgendamentos}</strong>
                    <span>Diárias agendadas na unidade</span>
                  </div>
                  <div className="kpi-card kpi-card--gold">
                    <small>Profissionais na Base</small>
                    <strong>{metrics.totalProfissionais}</strong>
                    <span>{metrics.profissionaisAprovados} aprovados(as) para escala</span>
                  </div>
                  <div className="kpi-card kpi-card--red">
                    <small>Volume Operacional Estimado</small>
                    <strong>{formatCurrency(metrics.volumeTotalEstimado)}</strong>
                    <span>Orçamentos + Agendamentos</span>
                  </div>
                </div>
              )}

              {carregandoGestao && <p>Atualizando dados da unidade...</p>}

              {/* Tabela de Orçamentos */}
              <div className="admin-panel-block">
                <h3>1. Gestão de Solicitações de Orçamento ({orcamentos.length})</h3>
                <div className="admin-records-list">
                  {orcamentos.map((orc) => (
                    <div key={orc.id} className="record-card">
                      <div className="record-card__header">
                        <div>
                          <span className="protocol-pill">{orc.protocolo}</span>
                          <strong>{orc.nome}</strong> — <span>{orc.servicoTitulo}</span>
                        </div>
                        <span className={`status-badge status--${orc.status}`}>
                          {orc.status}
                        </span>
                      </div>
                      <div className="record-card__grid">
                        <div>
                          <small>Contato</small>
                          <strong>
                            {orc.telefone} • {orc.email}
                          </strong>
                        </div>
                        <div>
                          <small>Bairro / CEP</small>
                          <strong>
                            {orc.bairro} ({orc.cep}) — {orc.logradouro}, {orc.numero}
                          </strong>
                        </div>
                        <div>
                          <small>Data & Valor</small>
                          <strong>
                            {orc.dataDesejada} • {formatCurrency(orc.valorTotal)}
                          </strong>
                        </div>
                        <div className="record-actions">
                          <button
                            type="button"
                            className="btn btn--green-sm"
                            onClick={() => handleStatusOrcamento(orc.id, 'CONFIRMADO')}
                          >
                            Confirmar
                          </button>
                          <button
                            type="button"
                            className="btn btn--outline-sm"
                            onClick={() => handleStatusOrcamento(orc.id, 'CONCLUIDO')}
                          >
                            Concluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de Agendamentos Diretos */}
              <div className="admin-panel-block">
                <h3>2. Agendamentos Diretos do Checkout ({agendamentos.length})</h3>
                <div className="admin-records-list">
                  {agendamentos.map((agd) => (
                    <div key={agd.id} className="record-card">
                      <div className="record-card__header">
                        <div>
                          <span className="protocol-pill">{agd.codigo}</span>
                          <strong>{agd.clienteNome}</strong> —{' '}
                          <span>{agd.itens.map((i) => i.titulo).join(', ')}</span>
                        </div>
                        <span className={`status-badge status--${agd.status}`}>
                          {agd.status}
                        </span>
                      </div>
                      <div className="record-card__grid">
                        <div>
                          <small>Endereço</small>
                          <strong>{agd.endereco}</strong>
                        </div>
                        <div>
                          <small>Data / Pagamento</small>
                          <strong>
                            {agd.dataAtendimento} às {agd.horario} ({agd.formaPagamento})
                          </strong>
                        </div>
                        <div>
                          <small>Profissional / Valor Total</small>
                          <strong>
                            {agd.profissionalDesignada} • {formatCurrency(agd.total)}
                          </strong>
                        </div>
                        <div className="record-actions">
                          <button
                            type="button"
                            className="btn btn--green-sm"
                            onClick={() => handleStatusAgendamento(agd.id, 'CONCLUIDO')}
                          >
                            Marcar Concluído
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Banco de Profissionais Parceiros e CLT */}
              <div className="admin-panel-block">
                <h3>3. Profissionais Parceiros(as) e Celetistas ({profissionais.length})</h3>
                <div className="admin-records-list">
                  {profissionais.map((prof) => (
                    <div key={prof.id} className="record-card">
                      <div className="record-card__header">
                        <div>
                          <span className="protocol-pill">{prof.id}</span>
                          <strong>{prof.nome}</strong> —{' '}
                          <span>{prof.modalidadePreferida}</span>
                        </div>
                        <span className={`status-badge status--${prof.status}`}>
                          {prof.status}
                        </span>
                      </div>
                      <div className="record-card__grid">
                        <div>
                          <small>Bairro & WhatsApp</small>
                          <strong>
                            {prof.bairro} ({prof.cidade}) • {prof.celular}
                          </strong>
                        </div>
                        <div>
                          <small>Especialidades</small>
                          <strong>{prof.servicosInteresse.join(', ')}</strong>
                        </div>
                        <div>
                          <small>Disponibilidade</small>
                          <strong>
                            {prof.tempoDiariaPreferido} • {prof.diasDisponiveis.length} dias/sem
                          </strong>
                        </div>
                        <div className="record-actions">
                          {prof.status !== 'APROVADA' && (
                            <button
                              type="button"
                              className="btn btn--green-sm"
                              onClick={() => handleStatusProfissional(prof.id, 'APROVADA')}
                            >
                              Aprovar Cadastro
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
