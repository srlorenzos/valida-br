# valida-br

Valida e formata **CPF, CNPJ, CEP e telefone** brasileiros. Já suporta o **CNPJ alfanumérico** que a Receita Federal começou a emitir em julho de 2026 (ex.: `12.ABC.345/01DE-35`). Zero dependências, funciona no Node 18+ e no navegador.

```js
import { validarCPF, validarCNPJ, formatarCNPJ, validarTelefone, formatarTelefone } from 'valida-br';

validarCPF('529.982.247-25');          // true
validarCNPJ('12.ABC.345/01DE-35');     // true  (alfanumérico)
validarCNPJ('11.222.333/0001-81');     // true  (numérico)
formatarCNPJ('12abc34501de35');        // '12.ABC.345/01DE-35'
validarTelefone('+55 11 91234-5678');  // true
formatarTelefone('1133334444');        // '(11) 3333-4444'
```

## Funções

| Função | O que faz |
| --- | --- |
| `validarCPF(v)` / `formatarCPF(v)` / `gerarCPF(formatado?)` | CPF com dígitos verificadores |
| `validarCNPJ(v)` / `formatarCNPJ(v)` / `gerarCNPJ({ formatado, alfanumerico })` | CNPJ numérico e alfanumérico |
| `validarCEP(v)` / `formatarCEP(v)` | Formato do CEP (8 dígitos) |
| `validarTelefone(v)` / `formatarTelefone(v)` | Fixo e celular com DDD válido, aceita `+55` |
| `limpar(v)` | Remove tudo que não é dígito |

## Como o CNPJ alfanumérico é validado

Os 12 primeiros caracteres podem ser letras ou números; os 2 últimos (dígitos verificadores) continuam numéricos. Cada caractere vale o seu código ASCII menos 48 (`0`–`9` → 0–9, `A` → 17 … `Z` → 42) e o cálculo segue o mesmo módulo 11 do CNPJ tradicional. Por isso CNPJs antigos continuam válidos sem mudança.

## Testes

```bash
npm test
```

`gerarCPF` e `gerarCNPJ` existem para testes e dados fictícios. Não use números gerados como se fossem de pessoas ou empresas reais.

## Licença

MIT © Eduardo Lorenzo
