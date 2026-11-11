import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  casas, admiteBalanceado, linhas, quantosUns, popcount, ehBalanceado,
} from '../src/triangulo.js';
import { varrer, inverter, classesPorInversao } from '../src/varredura.js';
import {
  casasDoTriangulo, unsPeloJuiz, casasPeloJuiz,
  paridadePermiteBalanceado, balanceadosPeloJuiz,
} from '../src/juiz.js';
import { temTriangulinhoCheio, algumTriangulinhoCheio, quantosTriangulinhos } from '../src/teto.js';

test('o triangulo de lado n tem n(n+1)/2 casas, contadas uma a uma', () => {
  for (let n = 1; n <= 12; n++) {
    assert.equal(casasPeloJuiz(n, 0), casas(n), `lado ${n}`);
  }
});

test('cada linha tem uma casa a menos que a de cima, ate sobrar uma', () => {
  for (let n = 1; n <= 10; n++) {
    const L = linhas(n, 0b101101);
    assert.equal(L.length, n);
    for (let i = 0; i < n; i++) assert.equal(L[i].length, n - i);
  }
});

test('a regra do triangulo: filha = pai xor mae, casa a casa', () => {
  const L = linhas(6, 0b100110);
  for (let i = 0; i + 1 < L.length; i++) {
    for (let k = 0; k < L[i + 1].length; k++) {
      assert.equal(L[i + 1][k], L[i][k] ^ L[i][k + 1]);
    }
  }
});

test('a contagem rapida e a do juiz dao o mesmo em TODA linha inicial ate n=12', () => {
  for (let n = 1; n <= 12; n++) {
    for (let i = 0; i < 1 << n; i++) {
      assert.equal(quantosUns(n, i), unsPeloJuiz(n, i), `n=${n}, inicial=${i}`);
    }
  }
});

test('popcount conta bits de verdade', () => {
  for (let x = 0; x < 2000; x++) {
    const aMao = x.toString(2).split('').filter((c) => c === '1').length;
    assert.equal(popcount(x), aMao);
  }
});

test('admiteBalanceado e exatamente n = 0 ou 3 (mod 4)', () => {
  for (let n = 1; n <= 40; n++) {
    assert.equal(admiteBalanceado(n), paridadePermiteBalanceado(n), `n=${n}`);
  }
});

test('a linha de zeros da triangulo de zeros, e nunca e balanceada', () => {
  for (let n = 1; n <= 12; n++) {
    assert.equal(quantosUns(n, 0), 0);
    assert.equal(ehBalanceado(n, 0), false);
  }
});

test('inverter a linha inicial espelha o triangulo e preserva o numero de uns', () => {
  for (let n = 1; n <= 12; n++) {
    for (let i = 0; i < 1 << n; i++) {
      assert.equal(quantosUns(n, i), quantosUns(n, inverter(n, i)), `n=${n}, i=${i}`);
    }
  }
});

test('inverter duas vezes volta ao comeco', () => {
  for (let n = 1; n <= 12; n++) {
    for (let i = 0; i < 1 << n; i++) assert.equal(inverter(n, inverter(n, i)), i);
  }
});

test('as classes da inversao cobrem todas as 2^n linhas iniciais', () => {
  for (let n = 1; n <= 12; n++) {
    const { classes, simetricas } = classesPorInversao(n);
    // cada classe tem 2 elementos, menos as simetricas que tem 1
    assert.equal(2 * classes - simetricas, 1 << n, `n=${n}`);
  }
});

test('NENHUM triangulinho fica cheio de uns, em ordem nenhuma', () => {
  for (let n = 2; n <= 14; n++) {
    assert.equal(algumTriangulinhoCheio(n), -1, `n=${n} achou triangulinho cheio`);
  }
});

test('o triangulinho cheio e impossivel por construcao: 1 xor 1 = 0', () => {
  // conferido direto na regra, sem varrer: se pai e mae sao 1, a filha e 0
  assert.equal(1 ^ 1, 0);
  // e a varredura concorda com a regra numa ordem qualquer
  for (let i = 0; i < 1 << 10; i++) assert.equal(temTriangulinhoCheio(10, i), false);
});

test('quantos triangulinhos o triangulo tem, contados e nao calculados', () => {
  for (let n = 2; n <= 12; n++) {
    const L = linhas(n, 0);
    let conta = 0;
    for (let i = 0; i + 1 < L.length; i++) conta += L[i].length - 1;
    assert.equal(quantosTriangulinhos(n), conta, `n=${n}`);
  }
});

test('a varredura rapida e o juiz lento contam os mesmos balanceados', () => {
  for (let n = 1; n <= 14; n++) {
    assert.equal(varrer(n).balanceados, balanceadosPeloJuiz(n), `n=${n}`);
  }
});

test('o primeiro balanceado de cada ordem e mesmo balanceado', () => {
  for (const n of [3, 4, 7, 8, 11, 12]) {
    const { primeiro } = varrer(n);
    assert.ok(primeiro >= 0);
    assert.ok(ehBalanceado(n, primeiro));
    assert.equal(unsPeloJuiz(n, primeiro) * 2, casas(n));
  }
});

test('o histograma soma 2^n: toda linha inicial cai em alguma casa', () => {
  for (let n = 1; n <= 14; n++) {
    const r = varrer(n);
    const soma = r.histograma.reduce((a, b) => a + b, 0);
    assert.equal(soma, 1 << n, `n=${n}`);
  }
});

test('o juiz monta o triangulo sem usar bit nenhum', () => {
  const todas = casasDoTriangulo(4, 0b1011);
  assert.equal(todas.length, 10);
  assert.ok(todas.every((c) => c === 0 || c === 1));
});
