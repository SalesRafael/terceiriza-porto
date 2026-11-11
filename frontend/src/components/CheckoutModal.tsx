import React, { useState } from 'react';
import { ItemCarrinho, PlanoDiaria } from '../types';
import { api, formatCurrency } from '../api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  carrinho: ItemCarrinho[];
  planos: PlanoDiaria[];
  onAddPlano: (plano: PlanoDiaria) => void;
  onRemoveItem: (planoId: string) => void;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  carrinho,
  planos,
  onAddPlano,
  onRemoveItem,
  onClearCart
}) => {
  const [clienteNome, setClienteNome] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteCpf, setClienteCpf] = useState('');
  const [clienteTelefone, setClienteTelefone] = useState('');
  const [cep, setCep] = useState('45810-000');
  const [endereco, setEndereco] = useState('Rua do Cajueiro, São Francisco — Porto Seguro/BA');
  const [dataAtendimento, setDataAtendimento] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [horario, setHorario] = useState('08:00');
  const [formaPagamento, setFormaPagamento] = useState('PIX');
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState<{ codigo: string; mensagem: string } | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  if (!isOpen) return null;

  const isWeekend = (() => {
    if (!dataAtendimento) return false;
    const parts = dataAtendimento.split('-').map(Number);
    if (parts.length !== 3) return false;
    const d = new Date(parts[0], parts[1] - 1, parts[2]).getDay();
    return d === 0 || d === 6;
  })();

  const subtotal = carrinho.reduce(
    (acc, item) => acc + item.precoUnitario * item.quantidade,
    0
  );
  const taxaFimDeSemana = carrinho.length > 0 && isWeekend ? 30.0 : 0.0;
  const total = subtotal + taxaFimDeSemana;

  const handleCepBlur = async () => {
    if (cep.replace(/\D/g, '').length === 8) {
      try {
        const res = await api.consultarCep(cep);
        if (res.logradouro || res.bairro) {
          setEndereco(
            `${res.logradouro ? res.logradouro + ', ' : ''}${res.bairro || 'São Francisco'} — ${
              res.cidade || 'Porto Seguro'
            }/${res.uf || 'BA'}`
          );
        }
      } catch {
        // Ignora erro silenciosamente no autofill
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (carrinho.length === 0) {
      setErro('Adicione pelo menos uma diária ou serviço ao seu carrinho.');
      return;
    }
    setEnviando(true);
    try {
      const res = await api.criarAgendamento({
        clienteNome,
        clienteEmail,
        clienteCpf,
        clienteTelefone,
        cep,
        endereco,
        itens: carrinho,
        dataAtendimento,
        horario,
        formaPagamento
      });
      setSucesso({
        codigo: res.agendamento.codigo,
        mensagem: res.mensagem
      });
      onClearCart();
    } catch (err: any) {
      setErro(err.message || 'Falha ao registrar agendamento.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-badge">CHECKOUT RÁPIDO · PORTO SEGURO</span>
            <h3>Contratar Diária / Serviço Online</h3>
          </div>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {sucesso ? (
            <div className="checkout-success">
              <div className="checkout-success__icon">✅</div>
              <h4>Pedido {sucesso.codigo} Confirmado!</h4>
              <p>{sucesso.mensagem}</p>
              <div className="checkout-success__actions">
                <a
                  href={`https://wa.me/5573999103388?text=${encodeURIComponent(
                    `Olá Terceiriza Porto! Acabei de realizar a contratação ${sucesso.codigo} pelo site.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn--green"
                >
                  Confirmar no WhatsApp (73) 99910-3388
                </a>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => {
                    setSucesso(null);
                    onClose();
                  }}
                >
                  Fechar janela
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Seleção rápida se o carrinho estiver vazio */}
              <div className="checkout-cart-section">
                <h4>1. Serviços selecionados ({carrinho.length})</h4>
                {carrinho.length === 0 ? (
                  <div className="empty-cart-box">
                    <p>Seu carrinho está vazio. Escolha rapidamente uma diária abaixo:</p>
                    <div className="quick-plan-Chips">
                      {planos.slice(0, 6).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="chip-add-btn"
                          onClick={() => onAddPlano(p)}
                        >
                          + {p.titulo} ({formatCurrency(p.preco)})
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <ul className="cart-items-list">
                    {carrinho.map((item) => (
                      <li key={item.planoId} className="cart-item">
                        <div>
                          <strong>{item.titulo}</strong>
                          <span>
                            {item.quantidade}x {formatCurrency(item.precoUnitario)}
                          </span>
                        </div>
                        <div className="cart-item__right">
                          <strong>
                            {formatCurrency(item.precoUnitario * item.quantidade)}
                          </strong>
                          <button
                            type="button"
                            className="cart-remove-btn"
                            onClick={() => onRemoveItem(item.planoId)}
                          >
                            Remover
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form className="checkout-form" onSubmit={handleSubmit}>
                <h4>2. Data, Local em Porto Seguro e Pagamento</h4>
                <div className="form-row-2">
                  <label>
                    Nome completo*
                    <input
                      type="text"
                      required
                      value={clienteNome}
                      onChange={(e) => setClienteNome(e.target.value)}
                      placeholder="Ex: João Silva"
                    />
                  </label>
                  <label>
                    WhatsApp / Telefone*
                    <input
                      type="text"
                      required
                      value={clienteTelefone}
                      onChange={(e) => setClienteTelefone(e.target.value)}
                      placeholder="(73) 99999-9999"
                    />
                  </label>
                </div>

                <div className="form-row-2">
                  <label>
                    E-mail
                    <input
                      type="email"
                      value={clienteEmail}
                      onChange={(e) => setClienteEmail(e.target.value)}
                      placeholder="cliente@email.com"
                    />
                  </label>
                  <label>
                    CPF
                    <input
                      type="text"
                      value={clienteCpf}
                      onChange={(e) => setClienteCpf(e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </label>
                </div>

                <div className="form-row-2">
                  <label>
                    CEP (Porto Seguro - BA)*
                    <input
                      type="text"
                      required
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      onBlur={handleCepBlur}
                      placeholder="45810-000"
                    />
                  </label>
                  <label>
                    Data do Atendimento*
                    <input
                      type="date"
                      required
                      value={dataAtendimento}
                      onChange={(e) => setDataAtendimento(e.target.value)}
                    />
                  </label>
                </div>

                <label>
                  Endereço completo com número e bairro*
                  <input
                    type="text"
                    required
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, número, bairro, complemento"
                  />
                </label>

                <div className="form-row-2">
                  <label>
                    Horário de início
                    <select value={horario} onChange={(e) => setHorario(e.target.value)}>
                      <option value="08:00">08:00 (Manhã)</option>
                      <option value="09:00">09:00 (Manhã)</option>
                      <option value="13:00">13:00 (Tarde)</option>
                      <option value="14:00">14:00 (Tarde)</option>
                    </select>
                  </label>
                  <label>
                    Forma de pagamento
                    <select
                      value={formaPagamento}
                      onChange={(e) => setFormaPagamento(e.target.value)}
                    >
                      <option value="PIX">PIX (Confirmação Imediata)</option>
                      <option value="CARTAO_CREDITO">Cartão de Crédito (até 3x)</option>
                      <option value="BOLETO_EMPRESARIAL">Boleto / Faturado CNPJ</option>
                    </select>
                  </label>
                </div>

                <div className="checkout-summary">
                  <div className="summary-line">
                    <span>Subtotal das diárias:</span>
                    <strong>{formatCurrency(subtotal)}</strong>
                  </div>
                  <div className="summary-line">
                    <span>
                      Extra fim de semana ({isWeekend ? 'Sábado/Domingo aplicado' : 'Dia útil'}):
                    </span>
                    <strong>{formatCurrency(taxaFimDeSemana)}</strong>
                  </div>
                  <div className="summary-line summary-line--total">
                    <span>Total a pagar:</span>
                    <strong>{formatCurrency(total)}</strong>
                  </div>
                </div>

                {erro && <div className="alert-box alert-box--error">{erro}</div>}

                <button
                  type="submit"
                  className="btn btn--red-cta btn--full"
                  disabled={enviando}
                >
                  ▸ {enviando ? 'Processando contratação...' : 'Finalizar Contratação Agora'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
