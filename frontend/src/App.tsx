import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { api } from './api';
import { UnidadePayload, ItemCarrinho, PlanoDiaria } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CheckoutModal } from './components/CheckoutModal';
import { WhatsAppFloat } from './components/WhatsAppFloat';
import { UnidadePortoSeguroPage } from './pages/UnidadePortoSeguroPage';
import { ServicosPage } from './pages/ServicosPage';
import { SejaProfissionalPage } from './pages/SejaProfissionalPage';
import { AreaClienteAdminPage } from './pages/AreaClienteAdminPage';
import { MapaTerceirizadosPage } from './pages/MapaTerceirizadosPage';

export const App: React.FC = () => {
  const [dados, setDados] = useState<UnidadePayload | null>(null);
  const [erroCarregamento, setErroCarregamento] = useState<string | null>(null);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [checkoutAberto, setCheckoutAberto] = useState(false);

  useEffect(() => {
    api
      .getUnidade()
      .then((res) => setDados(res))
      .catch((err) =>
        setErroCarregamento(
          err.message || 'Não foi possível conectar à API da Terceiriza Porto.'
        )
      );
  }, []);

  const handleAddPlano = (plano: PlanoDiaria) => {
    setCarrinho((prev) => {
      const idx = prev.findIndex((i) => i.planoId === plano.id);
      if (idx >= 0) {
        const clone = [...prev];
        clone[idx] = {
          ...clone[idx],
          quantidade: clone[idx].quantidade + 1
        };
        return clone;
      }
      return [
        ...prev,
        {
          planoId: plano.id,
          titulo: plano.titulo,
          precoUnitario: plano.preco,
          quantidade: 1
        }
      ];
    });
    setCheckoutAberto(true);
  };

  const handleRemoveItem = (planoId: string) => {
    setCarrinho((prev) => prev.filter((i) => i.planoId !== planoId));
  };

  const totalItensCarrinho = carrinho.reduce((acc, i) => acc + i.quantidade, 0);

  if (erroCarregamento) {
    return (
      <div className="loading-screen">
        <h2>Terceiriza Porto — Porto Seguro (BA)</h2>
        <p>{erroCarregamento}</p>
        <button
          type="button"
          className="btn btn--green"
          onClick={() => window.location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!dados) {
    return (
      <div className="loading-screen">
        <div className="spinner-porto" />
        <p>Carregando unidade Terceiriza Porto (Porto Seguro - BA)...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header
          categorias={dados.categoriasServicos}
          totalItensCarrinho={totalItensCarrinho}
          onOpenCheckout={() => setCheckoutAberto(true)}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <UnidadePortoSeguroPage
                  dados={dados}
                  onContratarPlano={handleAddPlano}
                />
              }
            />
            <Route
              path="/unidades/porto_seguro"
              element={
                <UnidadePortoSeguroPage
                  dados={dados}
                  onContratarPlano={handleAddPlano}
                />
              }
            />
            <Route
              path="/servicos"
              element={
                <ServicosPage
                  dados={dados}
                  onContratarPlano={handleAddPlano}
                />
              }
            />
            <Route path="/mapa-gps" element={<MapaTerceirizadosPage />} />
            <Route path="/seja-profissional" element={<SejaProfissionalPage />} />
            <Route path="/area-do-cliente" element={<AreaClienteAdminPage />} />
          </Routes>
        </main>

        <Footer />

        <WhatsAppFloat onOpenCheckout={() => setCheckoutAberto(true)} />

        <CheckoutModal
          isOpen={checkoutAberto}
          onClose={() => setCheckoutAberto(false)}
          carrinho={carrinho}
          planos={dados.planosDiarias}
          onAddPlano={handleAddPlano}
          onRemoveItem={handleRemoveItem}
          onClearCart={() => setCarrinho([])}
        />
      </div>
    </BrowserRouter>
  );
};

export default App;
