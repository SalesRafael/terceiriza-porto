import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PortoFlagLogo } from './PortoFlagLogo';
import { CategoriaServico } from '../types';
import { formatCurrency } from '../api';

interface HeaderProps {
  categorias: CategoriaServico[];
  totalItensCarrinho: number;
  onOpenCheckout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  categorias,
  totalItensCarrinho,
  onOpenCheckout
}) => {
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSelectServico = (slug: string) => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    navigate(`/servicos?categoria=${slug}`);
  };

  return (
    <header className="site-header">
      {/* Faixa tricolor superior inspirada na Bandeira de Porto Seguro */}
      <div className="porto-flag-ribbon" aria-hidden="true">
        <span className="ribbon-green" />
        <span className="ribbon-gold" />
        <span className="ribbon-blue" />
        <span className="ribbon-gold" />
        <span className="ribbon-red" />
      </div>

      {/* Topbar institucional */}
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__left">
            <span className="location-pill">
              <span className="location-dot" />
              Localização Ativa: <strong>Porto Seguro - BA (São Francisco)</strong>
            </span>
            <a
              href="https://wa.me/5573999103388"
              target="_blank"
              rel="noreferrer"
              className="topbar__phone"
            >
              WhatsApp: (73) 99910-3388
            </a>
          </div>

          <div className="topbar__actions">
            <Link to="/seja-profissional" className="topbar__link">
              ▸ Seja um(a) profissional
            </Link>
            <Link to="/servicos?categoria=terceirizacao" className="topbar__link">
              ▸ Terceirização B2B
            </Link>
            <Link to="/area-do-cliente" className="topbar__link topbar__link--highlight">
              ▸ Área do cliente / Gestão
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar Principal com Mega-Menu */}
      <div className="navbar">
        <div className="container navbar__inner">
          <Link to="/" className="navbar__brand" onClick={() => setMegaMenuOpen(false)}>
            <PortoFlagLogo />
          </Link>

          <nav className={`navbar__nav ${mobileMenuOpen ? 'is-open' : ''}`}>
            <div
              className="nav-item-dropdown"
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
            >
              <button
                type="button"
                className={`nav-link nav-link--dropdown ${
                  location.pathname === '/servicos' ? 'active' : ''
                }`}
                onClick={() => setMegaMenuOpen((prev) => !prev)}
              >
                Serviços <span className="caret">▾</span>
              </button>

              {megaMenuOpen && (
                <div className="mega-menu">
                  <div className="mega-menu__header">
                    <div>
                      <h4>Catálogo de Serviços — Terceiriza Porto</h4>
                      <p>
                        Atendimento residencial, comercial, temporada e terceirização contínua em
                        Porto Seguro - BA
                      </p>
                    </div>
                    <Link
                      to="/servicos"
                      className="btn btn--outline-sm"
                      onClick={() => setMegaMenuOpen(false)}
                    >
                      Ver todos os 10 serviços →
                    </Link>
                  </div>
                  <div className="mega-menu__grid">
                    {categorias.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className="mega-menu__card"
                        onClick={() => handleSelectServico(cat.slug)}
                      >
                        <div className="mega-menu__icon">
                          {cat.icone === 'home' && '🏠'}
                          {cat.icone === 'building' && '🏢'}
                          {cat.icone === 'shirt' && '👔'}
                          {cat.icone === 'hammer' && '🏗️'}
                          {cat.icone === 'sparkles' && '🪟'}
                          {cat.icone === 'frame' && '🖼️'}
                          {cat.icone === 'layers' && '✨'}
                          {cat.icone === 'shield' && '🛡️'}
                          {cat.icone === 'briefcase' && '🤝'}
                          {cat.icone === 'users' && '🔎'}
                        </div>
                        <div className="mega-menu__info">
                          <strong>{cat.nome}</strong>
                          <span>A partir de {formatCurrency(cat.aPartirDe)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/"
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Unidade Porto Seguro
            </Link>

            <Link
              to="/servicos"
              className={`nav-link ${location.pathname === '/servicos' ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Preços & Terceirização
            </Link>

            <Link
              to="/seja-profissional"
              className={`nav-link ${
                location.pathname === '/seja-profissional' ? 'active' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Seja Profissional
            </Link>

            <Link
              to="/area-do-cliente"
              className={`nav-link ${
                location.pathname === '/area-do-cliente' ? 'active' : ''
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Área do Cliente
            </Link>
          </nav>

          <div className="navbar__cta">
            <button
              type="button"
              className="cart-btn"
              onClick={onOpenCheckout}
              title="Abrir carrinho de contratação"
            >
              <span className="cart-btn__icon">🛒</span>
              <span className="cart-btn__label">Carrinho</span>
              {totalItensCarrinho > 0 && (
                <span className="cart-btn__badge">{totalItensCarrinho}</span>
              )}
            </button>

            <button
              type="button"
              className="btn btn--red-cta"
              onClick={onOpenCheckout}
            >
              <span>▸</span> CONTRATE JÁ!
            </button>

            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen((p) => !p)}
              aria-label="Abrir menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
