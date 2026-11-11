import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UnidadePayload,
  PlanoDiaria,
  CepLookupResponse,
  Orcamento
} from '../types';
import { api, formatCurrency } from '../api';

interface Props {
  dados: UnidadePayload;
  onContratarPlano: (plano: PlanoDiaria) => void;
}

const CEPS_RAPIDOS = [
  { label: 'São Francisco (45810-000)', cep: '45810-000' },
  { label: 'Orla Taperapuã (45810-002)', cep: '45810-002' },
  { label: "Arraial d'Ajuda (45816-000)", cep: '45816-000' },
  { label: 'Trancoso (45818-000)', cep: '45818-000' }
];

export const UnidadePortoSeguroPage: React.FC<Props> = ({
  dados,
  onContratarPlano
}) => {
  const {
    unidade,
    planosDiarias,
    categoriasServicos,
    perguntasFrequentes,
    comparacoesGaleria,
    estatisticasRede
  } = dados;

  // Estado do formulário de orçamento
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [complemento, setComplemento] = useState('');
  const [servicoId, setServicoId] = useState('');
  const [dataDesejada, setDataDesejada] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [informacoesExtras, setInformacoesExtras] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [aceitouPromocoes, setAceitouPromocoes] = useState(false);

  // Estado do CEP e Serviços liberados
  const [cepInfo, setCepInfo] = useState<CepLookupResponse | null>(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [enviandoOrcamento, setEnviandoOrcamento] = useState(false);
  const [orcamentoCriado, setOrcamentoCriado] = useState<Orcamento | null>(null);
  const [erroForm, setErroForm] = useState<string | null>(null);

  // Filtro da tabela de preços
  const [filtroCategoria, setFiltroCategoria] = useState<
    'todos' | 'comercial' | 'residencial' | 'passadoria'
  >('todos');

  // Estado do FAQ Acordeão
  const [faqAberto, setFaqAberto] = useState<string>(
    perguntasFrequentes[0]?.id || 'faq-1'
  );

  // Aba Antes/Depois nas comparações
  const [modoGaleria, setModoGaleria] = useState<Record<string, 'depois' | 'antes'>>({});

  const consultarCepUnidade = async (valorCep: string) => {
    setCep(valorCep);
    const limpo = valorCep.replace(/\D/g, '');
    if (limpo.length < 8) {
      setCepInfo(null);
      return;
    }

    setBuscandoCep(true);
    try {
      const info = await api.consultarCep(limpo);
      setCepInfo(info);
      if (info.logradouro) setLogradouro(info.logradouro);
      if (info.bairro) setBairro(info.bairro);
      if (!servicoId && info.servicosDisponiveis && info.servicosDisponiveis.length > 0) {
        setServicoId('residencial-4h');
      }
    } catch (err: any) {
      setCepInfo({
        valido: false,
        atendido: false,
        mensagem: err.message || 'CEP inválido.'
      });
    } finally {
      setBuscandoCep(false);
    }
  };

  const handleSelecionarPlanoParaOrcamento = (plano: PlanoDiaria) => {
    if (!cepInfo) {
      consultarCepUnidade('45810-000');
    }
    setServicoId(plano.id);
    const el = document.getElementById('orcamento');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmitOrcamento = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroForm(null);
    setOrcamentoCriado(null);

    if (!cepInfo || !cepInfo.valido) {
      setErroForm('Informe um CEP válido para confirmar a cobertura e liberar os serviços.');
      return;
    }

    setEnviandoOrcamento(true);
    try {
      const res = await api.criarOrcamento({
        nome,
        email,
        cpf,
        telefone,
        cep,
        logradouro,
        numero,
        bairro,
        complemento,
        servicoId: servicoId || 'residencial-4h',
        dataDesejada,
        informacoesExtras,
        aceitouTermos,
        aceitouPromocoes
      });
      setOrcamentoCriado(res.orcamento);
    } catch (err: any) {
      setErroForm(err.message || 'Erro ao enviar orçamento.');
    } finally {
      setEnviandoOrcamento(false);
    }
  };

  const planosFiltrados =
    filtroCategoria === 'todos'
      ? planosDiarias
      : planosDiarias.filter((p) => p.categoria === filtroCategoria);

  return (
    <div className="unidade-page">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link to="/">Terceiriza Porto</Link>
            </li>
            <li>
              <Link to="/servicos">Unidades</Link>
            </li>
            <li className="active">Porto Seguro — BA</li>
          </ol>
        </div>
      </div>

      {/* HERO DE CONTATO DA UNIDADE PORTO SEGURO */}
      <section className="hero-unidade">
        <div className="container">
          <div className="hero-unidade__header">
            <div className="flag-tag">
              <span className="flag-dot flag-dot--green" />
              <span className="flag-dot flag-dot--red" />
              <span className="flag-dot flag-dot--blue" />
              <span className="flag-dot flag-dot--gold" />
              UNIDADE OFICIAL EM PORTO SEGURO · SÃO FRANCISCO
            </div>
            <h1>
              Contate agora a unidade <strong>Terceiriza Porto</strong>{' '}
              <span className="text-porto-highlight">Porto Seguro</span>
            </h1>
            <p className="hero-unidade__subtitle">
              Diaristas verificadas, limpeza residencial, comercial, passadoria, pós-obra e
              terceirização completa na Costa do Descobrimento.
            </p>

            {/* 4 Pílulas de Contato Direto (WhatsApp, Telefone, E-mail, Mapa São Francisco) */}
            <div className="contact-pills-grid">
              <a
                href={`https://wa.me/${unidade.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="contact-pill contact-pill--whatsapp"
              >
                <span className="contact-pill__icon">💬</span>
                <div>
                  <small>WhatsApp da Unidade</small>
                  <strong>{unidade.telefone}</strong>
                </div>
              </a>

              <a href="tel:73999103388" className="contact-pill contact-pill--phone">
                <span className="contact-pill__icon">📞</span>
                <div>
                  <small>Ligar para a Unidade</small>
                  <strong>{unidade.telefone}</strong>
                </div>
              </a>

              <a
                href={`mailto:${unidade.email}`}
                className="contact-pill contact-pill--email"
              >
                <span className="contact-pill__icon">✉️</span>
                <div>
                  <small>E-mail Corporativo</small>
                  <strong>{unidade.email}</strong>
                </div>
              </a>

              <a
                href={unidade.endereco.mapaUrl}
                target="_blank"
                rel="noreferrer"
                className="contact-pill contact-pill--location"
              >
                <span className="contact-pill__icon">📍</span>
                <div>
                  <small>Rua do Cajueiro, 29 · São Francisco</small>
                  <strong>Porto Seguro - BA</strong>
                </div>
              </a>
            </div>
          </div>

          {/* SEÇÃO FORMULÁRIO DE ORÇAMENTO + DESTAQUE PROFISSIONAL */}
          <div id="orcamento" className="orcamento-split-grid">
            <div className="orcamento-form-card">
              <div className="orcamento-form-card__top">
                <span className="step-pill">ATENDIMENTO IMEDIATO</span>
                <h2>
                  Solicite um orçamento com a{' '}
                  <strong>Terceiriza Porto — Porto Seguro</strong> pelo formulário
                </h2>
                <p>
                  Preencha seu CEP de Porto Seguro (ou clique em um bairro rápido abaixo) para
                  liberar automaticamente a lista de serviços e valores da unidade:
                </p>

                <div className="cep-quick-buttons">
                  <span>Preencher CEP rápido:</span>
                  {CEPS_RAPIDOS.map((item) => (
                    <button
                      key={item.cep}
                      type="button"
                      className="cep-chip"
                      onClick={() => consultarCepUnidade(item.cep)}
                    >
                      📍 {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {orcamentoCriado ? (
                <div className="orcamento-confirmado-box">
                  <div className="orcamento-confirmado-box__badge">
                    PROTOCOLO {orcamentoCriado.protocolo}
                  </div>
                  <h3>Orçamento registrado com sucesso!</h3>
                  <p>
                    Olá <strong>{orcamentoCriado.nome}</strong>, recebemos sua solicitação para{' '}
                    <strong>{orcamentoCriado.servicoTitulo}</strong> no bairro{' '}
                    <strong>{orcamentoCriado.bairro}</strong> (Porto Seguro - BA).
                  </p>
                  <div className="orcamento-resumo-valores">
                    <div>
                      <span>Valor da Diária / Serviço Base:</span>
                      <strong>{formatCurrency(orcamentoCriado.valorBase)}</strong>
                    </div>
                    {orcamentoCriado.fimDeSemana && (
                      <div>
                        <span>Adicional de Fim de Semana:</span>
                        <strong>{formatCurrency(orcamentoCriado.valorExtraFimDeSemana)}</strong>
                      </div>
                    )}
                    <div className="total-row">
                      <span>Valor Total Estimado:</span>
                      <strong>{formatCurrency(orcamentoCriado.valorTotal)}</strong>
                    </div>
                  </div>
                  <div className="orcamento-confirmado-box__actions">
                    <a
                      href={`https://wa.me/${unidade.whatsapp}?text=${encodeURIComponent(
                        `Olá Terceiriza Porto! Solicitei o orçamento ${orcamentoCriado.protocolo} (${orcamentoCriado.servicoTitulo}) para ${orcamentoCriado.bairro}, Porto Seguro - BA.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn--green"
                    >
                      ▸ Agilizar atendimento no WhatsApp
                    </a>
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => setOrcamentoCriado(null)}
                    >
                      Solicitar novo orçamento
                    </button>
                  </div>
                </div>
              ) : (
                <form className="orcamento-form" onSubmit={handleSubmitOrcamento}>
                  <div className="form-row-2">
                    <label>
                      Nome completo*:
                      <input
                        type="text"
                        required
                        placeholder="Digite seu nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                      />
                    </label>
                    <label>
                      E-mail*:
                      <input
                        type="email"
                        required
                        placeholder="seuemail@exemplo.com.br"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="form-row-3">
                    <label>
                      CPF*:
                      <input
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                      />
                    </label>
                    <label>
                      Telefone / WhatsApp*:
                      <input
                        type="text"
                        required
                        placeholder="(73) 99999-9999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                      />
                    </label>
                    <label>
                      CEP*:
                      <input
                        type="text"
                        required
                        placeholder="45810-000"
                        value={cep}
                        onChange={(e) => consultarCepUnidade(e.target.value)}
                      />
                    </label>
                  </div>

                  {buscandoCep && (
                    <div className="cep-status-banner cep-status-banner--loading">
                      Verificando cobertura do CEP em Porto Seguro - BA...
                    </div>
                  )}

                  {cepInfo && (
                    <div
                      className={`cep-status-banner ${
                        cepInfo.valido
                          ? 'cep-status-banner--ok'
                          : 'cep-status-banner--err'
                      }`}
                    >
                      <span>{cepInfo.valido ? '✅' : '⚠️'}</span>
                      <div>
                        <strong>{cepInfo.mensagem}</strong>
                        {cepInfo.distrito && (
                          <small> • Zona: {cepInfo.distrito}</small>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="form-row-3-address">
                    <label className="col-span-2">
                      Logradouro (rua, avenida, etc)*:
                      <input
                        type="text"
                        required
                        placeholder="Ex: Rua do Cajueiro"
                        value={logradouro}
                        onChange={(e) => setLogradouro(e.target.value)}
                      />
                    </label>
                    <label>
                      Número:
                      <input
                        type="text"
                        placeholder="Ex: 29"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                      />
                    </label>
                  </div>

                  <div className="form-row-3">
                    <label>
                      Bairro*:
                      <input
                        type="text"
                        required
                        placeholder="Ex: São Francisco"
                        value={bairro}
                        onChange={(e) => setBairro(e.target.value)}
                      />
                    </label>
                    <label>
                      Complemento:
                      <input
                        type="text"
                        placeholder="Apto, Bloco, Pousada, Condomínio"
                        value={complemento}
                        onChange={(e) => setComplemento(e.target.value)}
                      />
                    </label>
                    <label>
                      Data desejada:
                      <input
                        type="date"
                        value={dataDesejada}
                        onChange={(e) => setDataDesejada(e.target.value)}
                      />
                    </label>
                  </div>

                  <label>
                    Serviço desejado*:
                    {!cepInfo || !cepInfo.valido ? (
                      <select disabled value="">
                        <option value="">Preencha o CEP para ver os serviços</option>
                      </select>
                    ) : (
                      <select
                        required
                        value={servicoId}
                        onChange={(e) => setServicoId(e.target.value)}
                      >
                        <optgroup label="Diárias Oficiais da Unidade Porto Seguro">
                          {planosDiarias.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.titulo} — {formatCurrency(p.preco)} ({p.metragemRecomendada})
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="Serviços Técnicos & Terceirização Contínua">
                          {categoriasServicos.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nome} — a partir de {formatCurrency(c.aPartirDe)}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    )}
                  </label>

                  <label>
                    Informações extras:
                    <textarea
                      rows={3}
                      placeholder="Descreva detalhes do imóvel, metragem aproximada ou necessidade específica..."
                      value={informacoesExtras}
                      onChange={(e) => setInformacoesExtras(e.target.value)}
                    />
                  </label>

                  <div className="form-terms">
                    <strong>Políticas e termos:</strong>
                    <label className="checkbox-line">
                      <input
                        type="checkbox"
                        checked={aceitouTermos}
                        onChange={(e) => setAceitouTermos(e.target.checked)}
                      />
                      <span>
                        Li e aceito os <a href="#faq">Termos de Uso</a> e Condições da Unidade Porto
                        Seguro*
                      </span>
                    </label>
                    <label className="checkbox-line">
                      <input
                        type="checkbox"
                        checked={aceitouPromocoes}
                        onChange={(e) => setAceitouPromocoes(e.target.checked)}
                      />
                      <span>
                        Li e aceito a <a href="#faq">Política de Promoções</a> e comunicações via
                        WhatsApp
                      </span>
                    </label>
                  </div>

                  {erroForm && <div className="alert-box alert-box--error">{erroForm}</div>}

                  <button
                    type="submit"
                    className="btn btn--red-cta btn--full btn--lg"
                    disabled={enviandoOrcamento}
                  >
                    ▸ {enviandoOrcamento ? 'Enviando solicitação...' : 'Solicitar orçamento'}
                  </button>
                </form>
              )}
            </div>

            {/* Coluna Lateral Visual & Indicadores */}
            <aside className="orcamento-aside">
              <div className="aside-Showcase-card">
                <div className="aside-flag-header">
                  <span className="aside-badge">PADRÃO COSTA DO DESCOBRIMENTO</span>
                  <h3>Profissionais verificados, treinados e segurados</h3>
                  <p>
                    Da limpeza residencial em São Francisco e Mundaí à terceirização completa de
                    pousadas em Arraial d&apos;Ajuda e Trancoso.
                  </p>
                </div>

                <div className="aside-stats-grid">
                  <div className="aside-stat">
                    <strong>R$ 169</strong>
                    <span>Diárias a partir de</span>
                  </div>
                  <div className="aside-stat">
                    <strong>+{estatisticasRede.profissionaisCadastrados}</strong>
                    <span>Profissionais ativos</span>
                  </div>
                  <div className="aside-stat">
                    <strong>{estatisticasRede.indiceSatisfacao}</strong>
                    <span>Aprovação local</span>
                  </div>
                  <div className="aside-stat">
                    <strong>5 Distritos</strong>
                    <span>Cobertura total</span>
                  </div>
                </div>

                <ul className="aside-checklist">
                  <li>✓ Checagem rigorosa de antecedentes e referências</li>
                  <li>✓ Reposição garantida em contratos de terceirização</li>
                  <li>✓ Produtos homologados e equipamentos profissionais</li>
                  <li>✓ Atendimento humanizado na unidade São Francisco</li>
                </ul>

                <div className="aside-unit-highlight">
                  <div>
                    <small>Unidade Física Porto Seguro - BA</small>
                    <strong>Rua do Cajueiro, 29 — Bairro São Francisco</strong>
                    <span>Seg a Sex • 08:00 às 18:00</span>
                  </div>
                  <a
                    href={`https://wa.me/${unidade.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--gold-sm"
                  >
                    Chamar no WhatsApp
                  </a>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* SEÇÃO PRÊMIO RECLAME AQUI 2026 & GALERIA COMPARATIVA ANTES/DEPOIS */}
      <section className="reclame-aqui-section">
        <div className="container">
          <div className="reclame-banner">
            <div className="reclame-banner__seal">
              <div className="ra-trophy">🏆</div>
              <div>
                <span className="ra-year">PRÊMIO EXCELÊNCIA 2026</span>
                <strong>NOTA {unidade.premioDestaque.notaMedia} / 5.0</strong>
                <small>{unidade.premioDestaque.avaliacoes} avaliações verificadas</small>
              </div>
            </div>
            <div className="reclame-banner__content">
              <h2>{unidade.premioDestaque.titulo}</h2>
              <p>{unidade.premioDestaque.descricao}</p>
            </div>
            <div className="reclame-banner__cta">
              <a href="#precos" className="btn btn--green">
                Ver Tabela de Preços 2026
              </a>
            </div>
          </div>

          {/* Galeria Comparativa Técnica (Pós-obra, Esquadrias, Limpeza Técnica) */}
          <div className="galeria-comparativa">
            <div className="section-title-center">
              <span className="section-eyebrow">RESULTADOS COMPROVADOS EM PORTO SEGURO</span>
              <h2>Comparação de Limpeza Pós-Obra e Limpeza Técnica</h2>
              <p>
                Alterne entre o cenário <strong>Antes</strong> e o resultado <strong>Depois</strong>{' '}
                executado pelas equipes da Terceiriza Porto:
              </p>
            </div>

            <div className="comparacoes-grid">
              {comparacoesGaleria.map((item) => {
                const modo = modoGaleria[item.id] || 'depois';
                return (
                  <div key={item.id} className="comparacao-card">
                    <div
                      className={`comparacao-visual ${
                        modo === 'depois'
                          ? 'comparacao-visual--depois'
                          : 'comparacao-visual--antes'
                      }`}
                    >
                      <div className="comparacao-visual__top">
                        <span className="comparacao-tag">
                          {modo === 'depois' ? '✨ DEPOIS (ENTREGUE)' : '🧱 ANTES DA EQUIPE'}
                        </span>
                        <div className="comparacao-toggle">
                          <button
                            type="button"
                            className={modo === 'antes' ? 'active' : ''}
                            onClick={() =>
                              setModoGaleria((prev) => ({ ...prev, [item.id]: 'antes' }))
                            }
                          >
                            Antes
                          </button>
                          <button
                            type="button"
                            className={modo === 'depois' ? 'active' : ''}
                            onClick={() =>
                              setModoGaleria((prev) => ({ ...prev, [item.id]: 'depois' }))
                            }
                          >
                            Depois
                          </button>
                        </div>
                      </div>
                      <p className="comparacao-visual__desc">
                        {modo === 'depois' ? item.depoisDescricao : item.antesDescricao}
                      </p>
                    </div>
                    <div className="comparacao-card__body">
                      <small>{item.local}</small>
                      <h3>{item.titulo}</h3>
                      <div className="comparacao-meta">
                        <span>⏱️ {item.tempoExecucao}</span>
                        <span>💎 {item.economiaEstimada}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CARD OFICIAL DA UNIDADE SÃO FRANCISCO */}
      <section className="unidade-destaque-section">
        <div className="container">
          <div className="unidade-info-banner">
            <div className="unidade-info-banner__main">
              <span className="badge-unidade">Unidade Terceiriza Porto</span>
              <h2>Diarista e limpeza em Porto Seguro, São Francisco</h2>
              <p>
                A <strong>Terceiriza Porto</strong> em Porto Seguro (BA) atende faxina residencial,
                empresarial, passadoria e terceirização pelo cadastro da unidade. A loja fica no
                bairro <strong>São Francisco</strong> (Rua do Cajueiro, 29).
              </p>
            </div>

            <div className="unidade-info-banner__metrics">
              <a
                href={`https://wa.me/${unidade.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="metric-card metric-card--wa"
              >
                <small>WhatsApp da unidade</small>
                <strong>{unidade.telefone}</strong>
              </a>
              <div className="metric-card metric-card--price">
                <small>Diária a partir de</small>
                <strong>{formatCurrency(unidade.diariaAPartirDe)}</strong>
              </div>
              <div className="metric-card metric-card--hours">
                <small>Horário</small>
                <strong>segunda a sexta das 08:00 às 18:00</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TABELA DE PREÇOS: QUANTO CUSTA UMA DIARISTA EM PORTO SEGURO? */}
      <section id="precos" className="precos-section">
        <div className="container">
          <div className="precos-header">
            <div>
              <span className="section-eyebrow">TABELA TRANSPARENTE DA UNIDADE</span>
              <h2>Quanto custa uma diarista em Porto Seguro?</h2>
              <p>
                Preços oficiais do cadastro desta unidade. Contrate online pelo Checkout Rápido,
                pelo formulário ou pelo WhatsApp.
              </p>
            </div>

            <div className="precos-filter-tabs">
              <button
                type="button"
                className={filtroCategoria === 'todos' ? 'active' : ''}
                onClick={() => setFiltroCategoria('todos')}
              >
                Todos ({planosDiarias.length})
              </button>
              <button
                type="button"
                className={filtroCategoria === 'comercial' ? 'active' : ''}
                onClick={() => setFiltroCategoria('comercial')}
              >
                Limpeza Comercial
              </button>
              <button
                type="button"
                className={filtroCategoria === 'residencial' ? 'active' : ''}
                onClick={() => setFiltroCategoria('residencial')}
              >
                Limpeza Residencial
              </button>
              <button
                type="button"
                className={filtroCategoria === 'passadoria' ? 'active' : ''}
                onClick={() => setFiltroCategoria('passadoria')}
              >
                Passadeira
              </button>
            </div>
          </div>

          <div className="precos-grid">
            {planosFiltrados.map((plano) => (
              <article
                key={plano.id}
                className={`preco-card ${plano.destaquePopular ? 'preco-card--popular' : ''}`}
              >
                {plano.destaquePopular && (
                  <span className="popular-ribbon">MAIS CONTRATADO</span>
                )}
                <div className="preco-card__top">
                  <span className="preco-card__city">{plano.unidade}</span>
                  <span className={`preco-card__cat cat--${plano.categoria}`}>
                    {plano.categoria === 'comercial' && '🏢 Comercial'}
                    {plano.categoria === 'residencial' && '🏠 Residencial'}
                    {plano.categoria === 'passadoria' && '👔 Passadoria'}
                  </span>
                </div>

                <h3 className="preco-card__title">{plano.titulo}</h3>

                <div className="preco-card__price">
                  <small>Valor da diária</small>
                  <strong>{formatCurrency(plano.preco)}</strong>
                </div>

                <p className="preco-card__desc">{plano.descricao}</p>

                <div className="preco-card__chips">
                  <span>⏱️ {plano.horas} horas</span>
                  <span>
                    👤 {plano.prestadores}{' '}
                    {plano.prestadores > 1 ? 'Prestadores' : 'Prestador'}
                  </span>
                  <span>📐 {plano.metragemRecomendada}</span>
                </div>

                <div className="preco-card__actions">
                  <button
                    type="button"
                    className="btn btn--green btn--full"
                    onClick={() => onContratarPlano(plano)}
                  >
                    🛒 Contratar Agora
                  </button>
                  <button
                    type="button"
                    className="btn btn--outline btn--full"
                    onClick={() => handleSelecionarPlanoParaOrcamento(plano)}
                  >
                    Solicitar no Formulário
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COBERTURA DE BAIRROS E DISTRITOS EM PORTO SEGURO */}
      <section className="bairros-section">
        <div className="container">
          <div className="bairros-card">
            <div className="bairros-card__info">
              <span className="section-eyebrow">ZONA DE ATENDIMENTO</span>
              <h2>Atende quais bairros em Porto Seguro?</h2>
              <p>
                No cadastro, a zona de atendimento desta unidade é{' '}
                <strong>Porto Seguro - BA</strong>. O endereço operacional da unidade fica no bairro{' '}
                <strong>São Francisco</strong>. O sistema confirma cobertura pelo CEP no formulário
                desta página e atende tanto a sede quanto os distritos turísticos:
              </p>

              <div className="distritos-row">
                {unidade.distritosAtendidos.map((distrito) => (
                  <span key={distrito} className="distrito-pill">
                    ⚓ {distrito}
                  </span>
                ))}
              </div>
            </div>

            <div className="bairros-card__tags">
              <h4>Principais bairros atendidos na Sede e Orla:</h4>
              <div className="bairros-tags-cloud">
                {unidade.bairrosDestaque.map((b) => (
                  <button
                    key={b}
                    type="button"
                    className="bairro-tag"
                    onClick={() => {
                      setBairro(b);
                      consultarCepUnidade('45810-000');
                      const el = document.getElementById('orcamento');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    title={`Solicitar orçamento para ${b}`}
                  >
                    📍 {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES EM PORTO SEGURO (FAQ) */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-title-center">
            <span className="section-eyebrow">TIRE SUAS DÚVIDAS</span>
            <h2>
              <strong>Perguntas</strong> frequentes em Porto Seguro
            </h2>
          </div>

          <div className="faq-accordion">
            {perguntasFrequentes.map((item) => {
              const aberto = faqAberto === item.id;
              return (
                <div
                  key={item.id}
                  className={`faq-item ${aberto ? 'faq-item--open' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setFaqAberto(aberto ? '' : item.id)}
                  >
                    <span>{item.pergunta}</span>
                    <span className="faq-icon">{aberto ? '−' : '+'}</span>
                  </button>
                  {aberto && (
                    <div className="faq-answer">
                      <p>{item.resposta}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
