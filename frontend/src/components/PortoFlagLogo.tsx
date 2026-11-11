import React from 'react';

interface Props {
  variant?: 'default' | 'light' | 'compact';
}

export const PortoFlagLogo: React.FC<Props> = ({ variant = 'default' }) => {
  const isLight = variant === 'light';

  return (
    <div className={`brand-logo ${isLight ? 'brand-logo--light' : ''}`}>
      <svg
        width={variant === 'compact' ? 40 : 48}
        height={variant === 'compact' ? 32 : 38}
        viewBox="0 0 96 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="porto-flag-svg"
        aria-label="Bandeira e Brasão de Porto Seguro - Terceiriza Porto"
      >
        {/* Moldura com cantos arredondados */}
        <rect
          x="2"
          y="2"
          width="92"
          height="68"
          rx="10"
          fill="#FFFFFF"
        />
        <clipPath id="flagClip">
          <rect x="3" y="3" width="90" height="66" rx="8" />
        </clipPath>
        <g clipPath="url(#flagClip)">
          {/* Metade esquerda: Verde Oficial da Bandeira de Porto Seguro */}
          <rect x="3" y="3" width="45" height="66" fill="#008B45" />
          {/* Metade direita: Vermelho Oficial da Bandeira de Porto Seguro */}
          <rect x="48" y="3" width="45" height="66" fill="#DC2626" />
        </g>

        {/* Coroa Mural Prateada */}
        <path
          d="M35 15H39V18H42V15H46V18H50V15H54V18H57V15H61V22H35V15Z"
          fill="#F8FAFC"
          stroke="#1E293B"
          strokeWidth="1.4"
        />

        {/* Colunas Douradas Laterais do Brasão */}
        <rect
          x="26"
          y="22"
          width="5"
          height="28"
          rx="1.5"
          fill="#F5D061"
          stroke="#854D0E"
          strokeWidth="1.2"
        />
        <rect
          x="65"
          y="22"
          width="5"
          height="28"
          rx="1.5"
          fill="#F5D061"
          stroke="#854D0E"
          strokeWidth="1.2"
        />

        {/* Escudo Central Azul Oceano (Caravelas do Descobrimento) */}
        <path
          d="M34 22H62V39C62 46.5 55.8 52 48 53.5C40.2 52 34 46.5 34 39V22Z"
          fill="#0E87CC"
          stroke="#FFFFFF"
          strokeWidth="2"
        />

        {/* Vela Branca e Cruz Vermelha da Ordem de Cristo no Escudo */}
        <path d="M48 27L55 37H41L48 27Z" fill="#FFFFFF" />
        <path d="M48 29.5V35.5M45 32.5H51" stroke="#DC2626" strokeWidth="1.8" strokeLinecap="round" />

        {/* Casco da Caravela e Ondas Brancas */}
        <path d="M40 39H56L53.5 43.5H42.5L40 39Z" fill="#F5D061" />
        <path
          d="M38 46.5C40.5 45 43 48 45.5 46.5C48 45 50.5 48 53 46.5C55.5 45 57 47.5 58 46.5"
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Listel Azul e Branco (Jam Ante Brasiliam Ego) */}
        <rect
          x="24"
          y="55"
          width="48"
          height="7"
          rx="3.5"
          fill="#0E87CC"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        <rect x="31" y="57.7" width="34" height="1.6" rx="0.8" fill="#FFFFFF" />

        {/* Borda Externa Dourada */}
        <rect
          x="2"
          y="2"
          width="92"
          height="68"
          rx="10"
          stroke="#F5D061"
          strokeWidth="2"
        />
      </svg>

      {variant !== 'compact' && (
        <div className="brand-logo__text">
          <div className="brand-logo__title">
            <span className="brand-logo__terceiriza">Terceiriza</span>{' '}
            <span className="brand-logo__porto">Porto</span>
          </div>
          <div className="brand-logo__subtitle">
            PORTO SEGURO · BA • SÃO FRANCISCO
          </div>
        </div>
      )}
    </div>
  );
};
