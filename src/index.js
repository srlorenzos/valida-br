// valida-br — validação e formatação de documentos brasileiros, sem dependências.
// CPF, CNPJ (numérico e alfanumérico, padrão da Receita a partir de julho/2026), CEP e telefone.

const onlyDigits = (v) => String(v ?? '').replace(/\D/g, '');
const onlyCnpjChars = (v) => String(v ?? '').toUpperCase().replace(/[^0-9A-Z]/g, '');

/** Remove tudo que não for dígito. */
export function limpar(valor) {
  return onlyDigits(valor);
}

// ------------------------------------------------------------------ CPF

function cpfDigito(base) {
  let soma = 0;
  for (let i = 0; i < base.length; i++) soma += Number(base[i]) * (base.length + 1 - i);
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
}

/** true se o CPF é válido (aceita com ou sem pontuação). */
export function validarCPF(valor) {
  const cpf = onlyDigits(valor);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const d1 = cpfDigito(cpf.slice(0, 9));
  const d2 = cpfDigito(cpf.slice(0, 9) + d1);
  return cpf.endsWith(`${d1}${d2}`);
}

/** 12345678909 -> 123.456.789-09 */
export function formatarCPF(valor) {
  const cpf = onlyDigits(valor).slice(0, 11);
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

/** Gera um CPF válido aleatório (para testes). */
export function gerarCPF(formatado = false) {
  let base = '';
  for (let i = 0; i < 9; i++) base += Math.floor(Math.random() * 10);
  const d1 = cpfDigito(base);
  const cpf = base + d1 + cpfDigito(base + d1);
  return formatado ? formatarCPF(cpf) : cpf;
}

// ------------------------------------------------------------------ CNPJ
// Valor de cada caractere = código ASCII - 48 (0-9 -> 0-9, A -> 17 ... Z -> 42).
// Os dois dígitos verificadores continuam numéricos (módulo 11).

const PESOS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

function cnpjDigito(base, pesos) {
  let soma = 0;
  for (let i = 0; i < base.length; i++) soma += (base.charCodeAt(i) - 48) * pesos[i];
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

/** true se o CNPJ é válido. Aceita o formato numérico e o alfanumérico (ex.: 12.ABC.345/01DE-35). */
export function validarCNPJ(valor) {
  const cnpj = onlyCnpjChars(valor);
  if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj) || /^(\d)\1{13}$/.test(cnpj)) return false;
  const base = cnpj.slice(0, 12);
  const d1 = cnpjDigito(base, PESOS_1);
  const d2 = cnpjDigito(base + d1, PESOS_2);
  return cnpj.endsWith(`${d1}${d2}`);
}

/** 11222333000181 -> 11.222.333/0001-81 (também para CNPJ alfanumérico). */
export function formatarCNPJ(valor) {
  const cnpj = onlyCnpjChars(valor).slice(0, 14);
  return cnpj.replace(/^(\w{2})(\w{3})(\w{3})(\w{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/** Gera um CNPJ válido aleatório (para testes). alfanumerico = true usa letras na raiz. */
export function gerarCNPJ({ formatado = false, alfanumerico = false } = {}) {
  const chars = alfanumerico ? '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '0123456789';
  let raiz = '';
  for (let i = 0; i < 8; i++) raiz += chars[Math.floor(Math.random() * chars.length)];
  const base = raiz + '0001';
  const d1 = cnpjDigito(base, PESOS_1);
  const cnpj = base + d1 + cnpjDigito(base + d1, PESOS_2);
  return formatado ? formatarCNPJ(cnpj) : cnpj;
}

// ------------------------------------------------------------------ CEP e telefone

/** true se tem 8 dígitos (formato; não consulta os Correios). */
export function validarCEP(valor) {
  return /^\d{8}$/.test(onlyDigits(valor)) && !/^0{8}$/.test(onlyDigits(valor));
}

/** 01310100 -> 01310-100 */
export function formatarCEP(valor) {
  return onlyDigits(valor).slice(0, 8).replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

const DDDS = new Set([
  11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46,
  47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85,
  86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99,
]);

/** true para fixo (10 dígitos) ou celular (11 dígitos começando com 9), com DDD existente. Aceita +55. */
export function validarTelefone(valor) {
  let tel = onlyDigits(valor);
  if (tel.length > 11 && tel.startsWith('55')) tel = tel.slice(2);
  if (!DDDS.has(Number(tel.slice(0, 2)))) return false;
  if (tel.length === 11) return tel[2] === '9';
  if (tel.length === 10) return /[2-5]/.test(tel[2]);
  return false;
}

/** 11912345678 -> (11) 91234-5678 ; 1133334444 -> (11) 3333-4444 */
export function formatarTelefone(valor) {
  let tel = onlyDigits(valor);
  if (tel.length > 11 && tel.startsWith('55')) tel = tel.slice(2);
  if (tel.length === 11) return tel.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
  if (tel.length === 10) return tel.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
  return tel;
}
