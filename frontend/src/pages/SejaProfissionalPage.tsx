import React, { useState } from 'react';
import { api } from '../api';
import { Profissional } from '../types';

const SERVICOS_OPCOES = [
  'Limpeza residencial',
  'Limpeza Empresarial',
  'Limpeza Pós-obra',
  'Passar roupa'
];

const DIAS_SEMANA = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

export const SejaProfissionalPage: React.FC = () => {
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('Porto Seguro');
  const [nome, setNome] = useState('');
  const [genero, setGenero] = useState('Feminino');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [experienciaPrevia, setExperienciaPrevia] = useState('');
  const [servicosInteresse, setServicosInteresse] = useState<string[]>([
    'Limpeza residencial'
  ]);
  const [modalidadePreferida, setModalidadePreferida] = useState(
    'Profissional Parceiro(a)'
  );
  const [diasDisponiveis, setDiasDisponiveis] = useState<string[]>([
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira'
  ]);
  const [tempoDiariaPreferido, setTempoDiariaPreferido] = useState('Todas as opções');
  const [inicioImediato, setInicioImediato] = useState(true);
  const [codigoIndicacao, setCodigoIndicacao] = useState('');
  const [aceitouTermos, setAceitouTermos] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [cadastroSucesso, setCadastroSucesso] = useState<Profissional | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const toggleItem = (lista: string[], setLista: (v: string[]) => void, item: string) => {
    if (lista.includes(item)) {
      setLista(lista.filter((i) => i !== item));
    } else {
      setLista([...lista, item]);
    }
  };

  const handleCepChange = async (val: string) => {
    setCep(val);
    const digits = val.replace(/\D/g, '');
    if (digits.length === 8) {
      try {
        const info = await api.consultarCep(digits);
        if (info.logradouro) setLogradouro(info.logradouro);
        if (info.bairro) setBairro(info.bairro);
        if (info.cidade) setCidade(info.cidade);
      } catch {
        // Ignora erro silenciosamente
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      const res = await api.cadastrarProfissional({
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
      });
      setCadastroSucesso(res.profissional);
    } catch (err: any) {
      setErro(err.message || 'Erro ao enviar inscrição profissional.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="profissional-page">
      {/* Hero Seja um(a) Profissional */}
      <section className="page-hero">
        <div className="container">
          <span className="flag-tag">
            <span className="flag-dot flag-dot--green" />
            <span className="flag-dot flag-dot--red" />
            OPORTUNIDADES EM PORTO SEGURO — BA
          </span>
          <h1>
            Seja um(a) profissional parceiro(a) da <strong>Terceiriza Porto</strong>
          </h1>
          <p>
            Faça parte da maior rede de profissionais de limpeza, passadoria e terceirização de
            Porto Seguro. Ganhe com segurança, flexibilidade e apoio local da nossa unidade no
            bairro São Francisco.
          </p>
        </div>
      </section>

      {/* Modalidades de Parceria */}
      <section className="modalidades-profissional-section">
        <div className="container">
          <div className="section-title-center">
            <span className="section-eyebrow">ESCOLHA SEU MODELO DE ATUAÇÃO</span>
            <h2>Conheça as modalidades de parceria na unidade Porto Seguro</h2>
          </div>

          <div className="parceria-cards-grid">
            <div className="parceria-card">
              <span className="parceria-tag parceria-tag--green">AUTONOMIA & GANHOS RÁPIDOS</span>
              <h3>Profissional Parceiro(a)</h3>
              <p>
                Você atua com flexibilidade e autonomia para organizar sua rotina em Porto Seguro.
                Você informa os dias e períodos disponíveis, e nossa unidade em São Francisco
                direciona os atendimentos compatíveis com seu perfil.
              </p>
              <ul>
                <li>✓ Liberdade para escolher os dias da semana em que deseja atender</li>
                <li>✓ Pagamentos semanais seguros e garantidos pela unidade</li>
                <li>✓ Sem preocupação de prospectar ou cobrar clientes por conta própria</li>
                <li>✓ Suporte operacional durante todos os atendimentos</li>
              </ul>
            </div>

            <div className="parceria-card">
              <span className="parceria-tag parceria-tag--blue">VÍNCULO FORMAL & ROTINA FIXA</span>
              <h3>Profissional Celetista (CLT)</h3>
              <p>
                Oportunidades para profissionais que desejam atuar em regime CLT nos contratos fixos
                de terceirização da unidade (clínicas, hotéis, condomínios e empresas de Porto
                Seguro).
              </p>
              <ul>
                <li>✓ Carteira assinada com todos os direitos trabalhistas (férias, 13º, FGTS)</li>
                <li>✓ Jornada e horários fixos definidos junto à unidade</li>
                <li>✓ Uniformes, EPIs e treinamento técnico contínuo</li>
                <li>✓ Acompanhamento próximo da supervisão de campo</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário Completo de Cadastro Profissional */}
      <section className="cadastro-profissional-section">
        <div className="container">
          <div className="cadastro-prof-card">
            <div className="cadastro-prof-card__header">
              <span className="step-pill">CADASTRO OFICIAL DE PROFISSIONAIS</span>
              <h2>Cadastre-se e fique mais perto de novas oportunidades em Porto Seguro</h2>
              <p>
                Preencha o formulário abaixo. Seus dados serão analisados pela equipe da unidade
                Terceiriza Porto (São Francisco):
              </p>
            </div>

            {cadastroSucesso ? (
              <div className="orcamento-confirmado-box">
                <div className="orcamento-confirmado-box__badge">
                  INSCRIÇÃO {cadastroSucesso.id} RECEBIDA
                </div>
                <h3>Parabéns, {cadastroSucesso.nome}!</h3>
                <p>
                  Seu cadastro para <strong>{cadastroSucesso.modalidadePreferida}</strong> no bairro{' '}
                  <strong>{cadastroSucesso.bairro}</strong> ({cadastroSucesso.cidade}) foi
                  registrado com sucesso.
                </p>
                <div className="orcamento-confirmado-box__actions">
                  <a
                    href={`https://wa.me/5573999103388?text=${encodeURIComponent(
                      `Olá Terceiriza Porto! Realizei meu cadastro de profissional (${cadastroSucesso.id} - ${cadastroSucesso.nome}) pelo site.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn--green"
                  >
                    ▸ Falar com o RH da Unidade no WhatsApp
                  </a>
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => setCadastroSucesso(null)}
                  >
                    Realizar outro cadastro
                  </button>
                </div>
              </div>
            ) : (
              <form className="orcamento-form" onSubmit={handleSubmit}>
                <h4 className="form-section-heading">1. Seus Dados Pessoais</h4>
                <div className="form-row-3">
                  <label>
                    Nome completo*:
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                    />
                  </label>
                  <label>
                    Gênero:
                    <select value={genero} onChange={(e) => setGenero(e.target.value)}>
                      <option value="Feminino">Feminino</option>
                      <option value="Masculino">Masculino</option>
                      <option value="Prefiro não informar">Prefiro não informar</option>
                    </select>
                  </label>
                  <label>
                    CPF*:
                    <input
                      type="text"
                      required
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </label>
                </div>

                <h4 className="form-section-heading">2. Endereço e Contato em Porto Seguro</h4>
                <div className="form-row-3">
                  <label>
                    Celular / WhatsApp*:
                    <input
                      type="text"
                      required
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)}
                      placeholder="(73) 99999-9999"
                    />
                  </label>
                  <label>
                    CEP*:
                    <input
                      type="text"
                      required
                      value={cep}
                      onChange={(e) => handleCepChange(e.target.value)}
                      placeholder="45810-000"
                    />
                  </label>
                  <label>
                    Bairro*:
                    <input
                      type="text"
                      required
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="Ex: Baianão, Campinho, São Francisco"
                    />
                  </label>
                </div>

                <div className="form-row-3">
                  <label>
                    Logradouro (rua, avenida):
                    <input
                      type="text"
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      placeholder="Nome da rua"
                    />
                  </label>
                  <label>
                    Número:
                    <input
                      type="text"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="Nº"
                    />
                  </label>
                  <label>
                    Cidade:
                    <input
                      type="text"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                    />
                  </label>
                </div>

                <h4 className="form-section-heading">3. Experiência, Serviços e Disponibilidade</h4>
                <label>
                  Já trabalhou como profissional de limpeza? Se sim, quais serviços já realizou?
                  <textarea
                    rows={2}
                    value={experienciaPrevia}
                    onChange={(e) => setExperienciaPrevia(e.target.value)}
                    placeholder="Conte brevemente sua experiência em residências, pousadas, hotéis ou empresas..."
                  />
                </label>

                <div className="checkbox-group-panel">
                  <strong>Selecione os serviços que você tem interesse em realizar:</strong>
                  <div className="checkbox-chips">
                    {SERVICOS_OPCOES.map((srv) => (
                      <label key={srv} className="chip-check">
                        <input
                          type="checkbox"
                          checked={servicosInteresse.includes(srv)}
                          onChange={() =>
                            toggleItem(servicosInteresse, setServicosInteresse, srv)
                          }
                        />
                        <span>{srv}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row-3">
                  <label>
                    Modalidade preferida:
                    <select
                      value={modalidadePreferida}
                      onChange={(e) => setModalidadePreferida(e.target.value)}
                    >
                      <option value="Profissional Parceiro(a)">Profissional Parceiro(a)</option>
                      <option value="Profissional Celetista">Profissional Celetista (CLT)</option>
                      <option value="Não tenho preferência">Não tenho preferência</option>
                    </select>
                  </label>

                  <label>
                    Tempo de diária preferido:
                    <select
                      value={tempoDiariaPreferido}
                      onChange={(e) => setTempoDiariaPreferido(e.target.value)}
                    >
                      <option value="4 horas">4 horas</option>
                      <option value="6 horas">6 horas</option>
                      <option value="8 horas">8 horas</option>
                      <option value="Todas as opções">Todas as opções</option>
                    </select>
                  </label>

                  <label>
                    Disponibilidade para início imediato?
                    <select
                      value={inicioImediato ? 'sim' : 'nao'}
                      onChange={(e) => setInicioImediato(e.target.value === 'sim')}
                    >
                      <option value="sim">Sim, início imediato</option>
                      <option value="nao">Não, em breve</option>
                    </select>
                  </label>
                </div>

                <div className="checkbox-group-panel">
                  <strong>Selecione os dias da semana em que você tem disponibilidade:</strong>
                  <div className="checkbox-chips">
                    {DIAS_SEMANA.map((dia) => (
                      <label key={dia} className="chip-check">
                        <input
                          type="checkbox"
                          checked={diasDisponiveis.includes(dia)}
                          onChange={() => toggleItem(diasDisponiveis, setDiasDisponiveis, dia)}
                        />
                        <span>{dia}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label>
                  Programa de indicação (Código de indicação opcional):
                  <input
                    type="text"
                    value={codigoIndicacao}
                    onChange={(e) => setCodigoIndicacao(e.target.value)}
                    placeholder="Ex: PORTO1500"
                  />
                </label>

                <div className="form-terms">
                  <label className="checkbox-line">
                    <input
                      type="checkbox"
                      checked={aceitouTermos}
                      onChange={(e) => setAceitouTermos(e.target.checked)}
                    />
                    <span>
                      Li e aceito os Termos de Uso e Política de Privacidade da Terceiriza Porto*
                    </span>
                  </label>
                </div>

                {erro && <div className="alert-box alert-box--error">{erro}</div>}

                <button
                  type="submit"
                  className="btn btn--red-cta btn--full btn--lg"
                  disabled={enviando}
                >
                  ▸ {enviando ? 'Enviando inscrição...' : 'Enviar inscrição profissional'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
