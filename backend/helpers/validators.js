// Validar CNPJ
export function isValidCNPJ(cnpj) {
  cnpj = cnpj.replace(/\D/g, '');
  
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(0))) return false;
  
  size = size + 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += numbers.charAt(size - i) * pos--;
    if (pos < 2) pos = 9;
  }
  
  result = sum % 11 < 2 ? 0 : 11 - sum % 11;
  if (result !== parseInt(digits.charAt(1))) return false;
  
  return true;
}

// Validar Matrícula (12 dígitos)
export function isValidMatricula(matricula) {
  const cleaned = matricula.replace(/\D/g, '');
  return cleaned.length === 12;
}

// Validar Email
export function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Validar Telefone
export function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

// Validar soma de pontos (deve ser 10)
export function isValidTotalPoints(questions) {
  const total = questions.reduce((sum, q) => sum + (q.points || 0), 0);
  return Math.abs(total - 10) < 0.01; // Permitir pequenas variações de ponto flutuante
}
