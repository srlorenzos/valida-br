import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validarCPF, formatarCPF, gerarCPF,
  validarCNPJ, formatarCNPJ, gerarCNPJ,
  validarCEP, formatarCEP, validarTelefone, formatarTelefone,
} from '../src/index.js';

test('CPF válido e inválido', () => {
  assert.equal(validarCPF('529.982.247-25'), true);
  assert.equal(validarCPF('52998224725'), true);
  assert.equal(validarCPF('529.982.247-24'), false);
  assert.equal(validarCPF('111.111.111-11'), false);
  assert.equal(validarCPF('123'), false);
});

test('CPF formatar e gerar', () => {
  assert.equal(formatarCPF('52998224725'), '529.982.247-25');
  for (let i = 0; i < 200; i++) assert.equal(validarCPF(gerarCPF()), true);
});

test('CNPJ numérico', () => {
  assert.equal(validarCNPJ('11.222.333/0001-81'), true);
  assert.equal(validarCNPJ('11222333000181'), true);
  assert.equal(validarCNPJ('11.222.333/0001-82'), false);
  assert.equal(validarCNPJ('00000000000000'), false);
  assert.equal(formatarCNPJ('11222333000181'), '11.222.333/0001-81');
});

test('CNPJ alfanumérico (exemplo oficial da Receita)', () => {
  assert.equal(validarCNPJ('12.ABC.345/01DE-35'), true);
  assert.equal(validarCNPJ('12abc34501de35'), true);
  assert.equal(validarCNPJ('12.ABC.345/01DE-36'), false);
  assert.equal(formatarCNPJ('12ABC34501DE35'), '12.ABC.345/01DE-35');
});

test('CNPJ gerado sempre válido', () => {
  for (let i = 0; i < 200; i++) {
    assert.equal(validarCNPJ(gerarCNPJ()), true);
    assert.equal(validarCNPJ(gerarCNPJ({ alfanumerico: true, formatado: true })), true);
  }
});

test('CEP', () => {
  assert.equal(validarCEP('01310-100'), true);
  assert.equal(validarCEP('00000-000'), false);
  assert.equal(validarCEP('1234'), false);
  assert.equal(formatarCEP('01310100'), '01310-100');
});

test('Telefone', () => {
  assert.equal(validarTelefone('(11) 91234-5678'), true);
  assert.equal(validarTelefone('+55 11 91234-5678'), true);
  assert.equal(validarTelefone('(11) 3333-4444'), true);
  assert.equal(validarTelefone('(10) 91234-5678'), false);
  assert.equal(validarTelefone('(11) 81234-5678'), false);
  assert.equal(formatarTelefone('11912345678'), '(11) 91234-5678');
  assert.equal(formatarTelefone('1133334444'), '(11) 3333-4444');
});
