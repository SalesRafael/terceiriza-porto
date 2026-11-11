// Validação de CPF, CEP de Porto Seguro e cálculo de preços

export function cleanDigits(value = '') {
  return String(value).replace(/\D/g, '');
}

export function isValidCPF(cpfInput = '') {
  const cpf = cleanDigits(cpfInput);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(cpf.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(cpf.charAt(10), 10);
}

// Mapa de CEPs conhecidos de Porto Seguro - BA (faixa 45810-000 a 45819-999)
export const PORTO_SEGURO_CEPS = {
  '45810000': {
    cep: '45810-000',
    logradouro: 'Rua do Cajueiro',
    bairro: 'São Francisco',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Porto Seguro (Sede)'
  },
  '45810001': {
    cep: '45810-001',
    logradouro: 'Avenida 22 de Abril',
    bairro: 'Centro',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Porto Seguro (Sede)'
  },
  '45810002': {
    cep: '45810-002',
    logradouro: 'Avenida Beira Mar (Orla Norte)',
    bairro: 'Taperapuã',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Porto Seguro (Sede)'
  },
  '45810003': {
    cep: '45810-003',
    logradouro: 'Avenida dos Navegantes',
    bairro: 'Areião',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Porto Seguro (Sede)'
  },
  '45810004': {
    cep: '45810-004',
    logradouro: 'Alameda das Palmeiras',
    bairro: 'Alto Mundaí',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Porto Seguro (Sede)'
  },
  '45816000': {
    cep: '45816-000',
    logradouro: 'Rua do Mucugê',
    bairro: "Arraial d'Ajuda",
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: "Arraial d'Ajuda"
  },
  '45818000': {
    cep: '45818-000',
    logradouro: 'Praça São João Batista (Quadrado)',
    bairro: 'Trancoso',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Trancoso'
  },
  '45819000': {
    cep: '45819-000',
    logradouro: 'Rua dos Navegantes',
    bairro: 'Caraíva',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Caraíva'
  },
  '45814000': {
    cep: '45814-000',
    logradouro: 'Praça Principal',
    bairro: 'Vale Verde',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Vale Verde'
  }
};

export function resolveCepPortoSeguro(rawCep = '') {
  const digits = cleanDigits(rawCep);
  if (digits.length !== 8) {
    return {
      valido: false,
      atendido: false,
      mensagem: 'Informe um CEP válido com 8 dígitos (ex: 45810-000).'
    };
  }

  const formatted = `${digits.slice(0, 5)}-${digits.slice(5)}`;
  if (PORTO_SEGURO_CEPS[digits]) {
    return {
      valido: true,
      atendido: true,
      ...PORTO_SEGURO_CEPS[digits],
      mensagem: 'Cobertura confirmada na unidade Terceiriza Porto (Porto Seguro - BA).'
    };
  }

  // Faixa de Porto Seguro e região (45810-000 a 45829-999)
  const prefix = parseInt(digits.slice(0, 5), 10);
  if (prefix >= 45810 && prefix <= 45829) {
    return {
      valido: true,
      atendido: true,
      cep: formatted,
      logradouro: '',
      bairro: 'São Francisco',
      cidade: 'Porto Seguro',
      uf: 'BA',
      distrito: 'Porto Seguro (Sede)',
      mensagem: 'CEP dentro da zona de cobertura de Porto Seguro - BA!'
    };
  }

  return {
    valido: true,
    atendido: true,
    foraDaZonaPadrao: true,
    cep: formatted,
    logradouro: '',
    bairro: '',
    cidade: 'Porto Seguro',
    uf: 'BA',
    distrito: 'Sob Consulta Regional',
    mensagem: 'CEP registrado. Nossa equipe em São Francisco (Porto Seguro - BA) confirmará a rota de atendimento.'
  };
}

export function isWeekendDate(dateStr = '') {
  if (!dateStr) return false;
  const parts = String(dateStr).split('-').map(Number);
  if (parts.length !== 3) return false;
  const dt = new Date(parts[0], parts[1] - 1, parts[2]);
  const day = dt.getDay();
  return day === 0 || day === 6; // Domingo (0) ou Sábado (6)
}
