import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { UnidadePayload, PlanoDiaria } from '../types';
import { formatCurrency } from '../api';

interface Props {
  dados: UnidadePayload;
  onContratarPlano: (plano: PlanoDiaria) => void;
}

export const ServicosPage: React.FC<Props> = ({ dados, onContratarPlano }) => {
  const { categoriasServicos, planosDiarias, detalhesTerceirizacao } = dados;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoriaQuery = searchParams.get('categoria') || '';
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>(categoriaQuery || 'todos');

  // Simulador B2B de Terceirização
  const [qtdProfissionais, setQtdProfissionais] = useState(2);
  const [modalidadeB2B, setModalidadeB2B] = useState<'somente-mao-de-obra' | 'com-produtos'>(
    'com-produtos'
  );
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('Auxiliar de Limpeza');

  useEffect(() => {
    if (categoriaQuery) {
      setCategoriaAtiva(categoriaQuery);
    }
  }, [categoriaQuery]);

  const custoUnitarioB2B = modalidadeB2B === 'com-produtos' ? 3290 : 2890;
  const estimativaMensalB2B = qtdProfissionais * custoUnitarioB2B;

  const categoriasExibidas =
    categoriaAtiva === 'todos'
      ? categoriasServicos
      : categoriasServicos.filter((c) => c.slug === categoriaAtiva);

  return (
    <div className="servicos-page">
      <section className="page-hero">
        <div className="container">
          <span className="flag-tag">
            <span className="flag-dot flag-dot--green" />
            <span className="flag-dot flag-dot--red" />
            SOLUÇÕES RESIDENCIAIS, TEMPORADA E CORPORATIVAS
          </span>
          <h1>
            Catálogo de <strong>Serviços & Terceirização</strong> em Porto Seguro
          </h1>
          <p>
            Escolha entre diárias avulsas a partir de R$ 169,00 ou contratos de terceirização de 12
            meses com gestão trabalhista e supervisão presencial em campo.
          </p>

          <div className="category-pills-bar">
            <button
              type="button"
              className={categoriaAtiva === 'todos' ? 'active' : ''}
              onClick={() => setCategoriaAtiva('todos')}
            >
              Todos os 10 Serviços
            </button>
            {categoriasServicos.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={categoriaAtiva === cat.slug ? 'active' : ''}
                onClick={() => setCategoriaAtiva(cat.slug)}
              >
                {cat.nome}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID DOS 10 SERVIÇOS */}
      <section className="catalogo-servicos-section">
        <div className="container">
          <div className="servicos-cards-grid">
            {categoriasExibidas.map((cat) => {
              const planosRelacionados = planosDiarias.filter(
                (p) => p.categoriaId === cat.id
              );
              return (
                <div key={cat.id} className="servico-detail-card">
                  <div className="servico-detail-card__header">
                    <span className="servico-badge">
                      A partir de {formatCurrency(cat.aPartirDe)}
                    </span>
                    <h2>{cat.nome}</h2>
                    <p className="servico-resumo">{cat.resumo}</p>
                  </div>
                  <p className="servico-descricao">{cat.descricao}</p>

                  {planosRelacionados.length > 0 ? (
                    <div className="servico-planos-mini">
                      <h4>Pacotes de horas disponíveis nesta unidade:</h4>
                      <div className="mini-planos-list">
                        {planosRelacionados.map((pl) => (
                          <div key={pl.id} className="mini-plano-row">
                            <div>
                              <strong>{pl.titulo}</strong>
                              <small>{pl.metragemRecomendada}</small>
                            </div>
                            <div className="mini-plano-row__right">
                              <strong>{formatCurrency(pl.preco)}</strong>
                              <button
                                type="button"
                                className="btn btn--green-sm"
                                onClick={() => onContratarPlano(pl)}
                              >
                                Contratar
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="servico-custom-cta">
                      <p>
                        Serviço técnico sob medida com avaliação pela equipe da unidade São
                        Francisco.
                      </p>
                      <button
                        type="button"
                        className="btn btn--red-cta"
                        onClick={() => navigate('/#orcamento')}
                      >
                        ▸ Solicitar Orçamento Personalizado
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEÇÃO COMPLETA DE TERCEIRIZAÇÃO (12 MESES) */}
      <section className="terceirizacao-section">
        <div className="container">
          <div className="section-title-center">
            <span className="section-eyebrow">GESTÃO COMPLETA DE EQUIPE FIXA</span>
            <h2>
              Contrate <strong>Terceirização</strong> em Porto Seguro (Contrato 12 meses)
            </h2>
            <p>
              Manter um funcionário próprio vai muito além do salário. A{' '}
              <strong>Terceiriza Porto</strong> assume seleção, treinamento, EPIs, cobertura de
              faltas/férias e 100% dos encargos trabalhistas.
            </p>
          </div>

          <div className="modalidades-terceirizacao-grid">
            {detalhesTerceirizacao.modalidades.map((mod) => (
              <div
                key={mod.id}
                className={`modalidade-card ${
                  mod.destaque ? 'modalidade-card--destaque' : ''
                }`}
              >
                {mod.destaque && (
                  <span className="modalidade-ribbon">SOLUÇÃO COMPLETA TURNKEY</span>
                )}
                <h3>{mod.titulo}</h3>
                <p>{mod.subtitulo}</p>
                <ul>
                  {mod.itens.map((item) => (
                    <li key={item}>✓ {item}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="btn btn--green btn--full"
                  onClick={() => navigate('/#orcamento')}
                >
                  Solicitar Proposta — {mod.titulo}
                </button>
              </div>
            ))}
          </div>

          {/* Funções e Segmentos + Simulador */}
          <div className="terceirizacao-bottom-grid">
            <div className="funcoes-segmentos-box">
              <div className="list-panel">
                <h4>Funções que podem ser terceirizadas</h4>
                <div className="pill-tags">
                  {detalhesTerceirizacao.funcoesTerceirizadas.map((fn) => (
                    <span key={fn} className="pill-tag pill-tag--green">
                      👤 {fn}
                    </span>
                  ))}
                </div>
              </div>

              <div className="list-panel">
                <h4>Segmentos atendidos na Costa do Descobrimento</h4>
                <div className="pill-tags">
                  {detalhesTerceirizacao.segmentosAtendidos.map((seg) => (
                    <span key={seg} className="pill-tag pill-tag--blue">
                      🏢 {seg}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="simulador-b2b-card">
              <span className="modal-badge">SIMULADOR CORPORATIVO B2B</span>
              <h3>Simule seu Contrato de Terceirização</h3>
              <p>
                Calcule uma estimativa mensal com cobertura de férias, faltas, supervisão ativa e
                encargos inclusos:
              </p>

              <label>
                Função principal desejada:
                <select
                  value={funcaoSelecionada}
                  onChange={(e) => setFuncaoSelecionada(e.target.value)}
                >
                  {detalhesTerceirizacao.funcoesTerceirizadas.map((fn) => (
                    <option key={fn} value={fn}>
                      {fn}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantidade de postos / profissionais: <strong>{qtdProfissionais}</strong>
                <input
                  type="range"
                  min={1}
                  max={15}
                  value={qtdProfissionais}
                  onChange={(e) => setQtdProfissionais(Number(e.target.value))}
                />
              </label>

              <label>
                Modalidade de insumos:
                <select
                  value={modalidadeB2B}
                  onChange={(e) =>
                    setModalidadeB2B(
                      e.target.value as 'somente-mao-de-obra' | 'com-produtos'
                    )
                  }
                >
                  <option value="com-produtos">
                    Com produtos ANVISA, EPIs e equipamentos em comodato
                  </option>
                  <option value="somente-mao-de-obra">
                    Somente mão de obra + EPIs e supervisão
                  </option>
                </select>
              </label>

              <div className="simulador-result">
                <span>Investimento mensal estimado ({qtdProfissionais} posto(s)):</span>
                <strong>{formatCurrency(estimativaMensalB2B)} / mês</strong>
                <small>
                  Inclui férias, 13º, FGTS, INSS, reposição imediata de faltas e supervisão em
                  Porto Seguro.
                </small>
              </div>

              <button
                type="button"
                className="btn btn--red-cta btn--full"
                onClick={() => navigate('/#orcamento')}
              >
                ▸ Agendar Visita Técnica Comercial
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
