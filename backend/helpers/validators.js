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

export function formatMatricula(matricula) {
  return matricula.trim().toUpperCase();
}