import React from 'react';

interface WhatsAppFloatProps {
  onOpenCheckout: () => void;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ onOpenCheckout }) => {
  return (
    <div className="floating-cta-group">
      <button
        type="button"
        className="floating-btn floating-btn--hire"
        onClick={onOpenCheckout}
      >
        ▸ Contrate agora
      </button>
      <a
        href="https://wa.me/5573999103388?text=Ol%C3%A1!%20Gostaria%20de%20contratar%20uma%20diarista%20ou%20or%C3%A7amento%20na%20Terceiriza%20Porto%20(Porto%20Seguro)."
        target="_blank"
        rel="noreferrer"
        className="floating-btn floating-btn--whatsapp"
        title="Falar no WhatsApp da unidade Terceiriza Porto em Porto Seguro"
      >
        <span className="wa-icon">💬</span>
        <span className="wa-text">(73) 99910-3388</span>
      </a>
    </div>
  );
};
