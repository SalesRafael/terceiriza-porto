import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PortoFlagLogo } from './PortoFlagLogo';
import { api } from '../api';

export const Footer: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setErro(null);
    setEnviando(true);
    try {
      const res = await api.assinarNewsletter(nome, email);
      setFeedback(res.mensagem);
      setNome('');
      setEmail('');
    } catch (err: any) {
      setErro(err.message || 'Não foi possível concluir a inscrição.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <footer className="site-footer">
      {/* Banner Newsletter com padrão das cores de Porto Seguro */}
      <div className="newsletter-banner">
        <div className="container newsletter-banner__inner">
          <div className="newsletter-banner__text">
            <span className="badge-flag-gold">NOVIDADES & DICAS DE PORTO SEGURO</span>
            <h3>
              Inscreva-se para receber <strong>novidades</strong>, tabelas corporativas e{' '}
              <strong>dicas da Terceiriza Porto</strong>
            </h3>
          </div>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="email"
              required
              placeholder="Seu melhor e-mail*"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn--red-cta" disabled={enviando}>
              ▸ {enviando ? 'Enviando...' : 'Enviar inscrição'}
            </button>
          </form>
          {feedback && <p className="newsletter-feedback success">{feedback}</p>}
          {erro && <p className="newsletter-feedback error">{erro}</p>}
        </div>
      </div>

      {/* Corpo principal do rodapé */}
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-col footer-col--brand">
            <PortoFlagLogo variant="light" />
            <p className="footer-about">
              Referência em diaristas, limpeza residencial, empresarial, pós-obra e terceirização de
              mão de obra em <strong>Porto Seguro — BA</strong>. Sede própria no bairro{' '}
              <strong>São Francisco</strong>.
            </p>
            <div className="flag-palette-badge">
              <span>Cores Oficiais de Porto Seguro:</span>
              <div className="flag-swatches">
                <span className="swatch swatch--green" title="Verde Mata Atlântica & Esperança" />
                <span className="swatch swatch--red" title="Vermelho Coroa & Bravura" />
                <span className="swatch swatch--blue" title="Azul Oceano das Caravelas" />
                <span className="swatch swatch--gold" title="Dourado Imperial do Marco" />
                <span className="swatch swatch--white" title="Branco Paz & Velas" />
              </div>
            </div>
          </div>

          <div className="footer-col">
            <h4>Terceiriza Porto</h4>
            <ul>
              <li>
                <Link to="/">Unidade Porto Seguro (São Francisco)</Link>
              </li>
              <li>
                <Link to="/seja-profissional">Seja um(a) profissional parceiro(a)</Link>
              </li>
              <li>
                <Link to="/servicos">Tabela de Preços 2026</Link>
              </li>
              <li>
                <Link to="/area-do-cliente">Área do Cliente & Acompanhamento</Link>
              </li>
              <li>
                <a href="#orcamento">Solicitar Orçamento Online</a>
              </li>
              <li>
                <a href="#faq">Perguntas Frequentes (FAQ)</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Serviços em Porto Seguro</h4>
            <ul>
              <li>
                <Link to="/servicos?categoria=limpeza-residencial">Limpeza residencial</Link>
              </li>
              <li>
                <Link to="/servicos?categoria=limpeza-empresarial">Limpeza empresarial</Link>
              </li>
              <li>
                <Link to="/servicos?categoria=passadoria">Passadoria</Link>
              </li>
              <li>
                <Link to="/servicos?categoria=limpeza-pos-obra">Limpeza pós-obra</Link>
              </li>
              <li>
                <Link to="/servicos?categoria=limpeza-de-vidros">Limpeza de vidros</Link>
              </li>
              <li>
                <Link to="/servicos?categoria=revitalizacao-de-esquadrias">
                  Revitalização de esquadrias
                </Link>
              </li>
              <li>
                <Link to="/servicos?categoria=revitalizacao-de-piso">Revitalização de piso</Link>
              </li>
              <li>
                <Link to="/servicos?categoria=sanitizacao-de-ambientes">
                  Sanitização de ambientes
                </Link>
              </li>
              <li>
                <Link to="/servicos?categoria=terceirizacao">Terceirização (12 meses)</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Atendimento Local</h4>
            <ul className="footer-contact-list">
              <li>
                <strong>Endereço:</strong> Rua do Cajueiro, 29 — São Francisco, Porto Seguro / BA —
                CEP 45810-000
              </li>
              <li>
                <strong>WhatsApp / Telefone:</strong>{' '}
                <a href="https://wa.me/5573999103388" target="_blank" rel="noreferrer">
                  (73) 99910-3388
                </a>
              </li>
              <li>
                <strong>E-mail:</strong>{' '}
                <a href="mailto:portoseguro@terceirizaporto.com.br">
                  portoseguro@terceirizaporto.com.br
                </a>
              </li>
              <li>
                <strong>Horário:</strong> Segunda a Sexta, das 08:00 às 18:00
              </li>
              <li>
                <strong>Cobertura:</strong> Sede, Orla Norte, Arraial d&apos;Ajuda, Trancoso, Caraíva
                e Vale Verde
              </li>
            </ul>
          </div>
        </div>

        {/* Selos de Qualidade e Certificações */}
        <div className="container footer-seals">
          <div className="seal-badge">🏆 Indicada Prêmio Reclame Aqui 2026</div>
          <div className="seal-badge">⚓ Excelência Costa do Descobrimento</div>
          <div className="seal-badge">🛡️ Profissionais Verificados & Segurados</div>
          <div className="seal-badge">🌿 Produtos Homologados ANVISA</div>
          <div className="seal-badge">⭐ 4.9/5 Satisfação em Porto Seguro</div>
        </div>
      </div>

      {/* Direitos autorais */}
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <p>
            © 2026 <strong>Terceiriza Porto Soluções e Serviços Ltda.</strong> | CNPJ
            48.720.519/0001-90 — Rua do Cajueiro, 29, São Francisco, Porto Seguro - BA | Todos os
            direitos reservados.
          </p>
          <p className="footer-motto">
            <em>&ldquo;Jam Ante Brasiliam Ego&rdquo;</em> — Inspirado nas cores oficiais de Porto
            Seguro
          </p>
        </div>
      </div>
    </footer>
  );
};
