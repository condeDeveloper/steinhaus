// Os numeros do README, presos.
//
// Nenhum valor aqui foi escrito de cabeca: todos sairam do medidor. As
// comparacoes de fracao foram calculadas com `node -e` antes de entrar —
// estender uma curva com o olho ja me custou caro.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { varrer } from '../src/varredura.js';
import {
  tabelaBalanceados, tabelaContraJuiz, tabelaParidade,
  tabelaHistograma, tabelaInversao,
} from '../src/medidas.js';
import { tabelaTeto, tetoDeUns, pisoIngenuo } from '../src/teto.js';

test('a contagem de balanceados, ordem a ordem', () => {
  const esperado = {
    3: 4, 4: 6, 7: 12, 8: 40, 11: 171, 12: 410,
    15: 1896, 16: 5160, 19: 32757, 20: 59984,
  };
  for (const [n, q] of Object.entries(esperado)) {
    assert.equal(varrer(Number(n)).balanceados, q, `n=${n}`);
  }
});

test('zero balanceados em toda ordem que a paridade proibe', () => {
  for (const n of [1, 2, 5, 6, 9, 10, 13, 14, 17, 18]) {
    assert.equal(varrer(n).balanceados, 0, `n=${n} deveria ser zero`);
  }
});

test('a previsao da paridade acerta nas 20 ordens', () => {
  const linhas = tabelaParidade(20);
  assert.equal(linhas.length, 20);
  assert.equal(linhas.filter((l) => l.acertou).length, 20);
});

test('a varredura rapida e o juiz lento concordam em todas as ordens medidas', () => {
  const linhas = tabelaContraJuiz(14);
  assert.equal(linhas.length, 14);
  assert.ok(linhas.every((l) => l.concordam), 'ha discordancia entre os dois');
});

test('a lei do teto: o maximo de uns e teto(n(n+1)/3), em 16 ordens', () => {
  const linhas = tabelaTeto(16);
  assert.equal(linhas.length, 16);
  for (const l of linhas) {
    assert.equal(l.maiorUns, tetoDeUns(l.n), `n=${l.n}`);
    assert.equal(l.bateComOTeto, true);
  }
});

test('os maximos de uns, ordem a ordem', () => {
  const esperado = [1, 2, 4, 7, 10, 14, 19, 24, 30, 37, 44, 52, 61, 70, 80, 91];
  const linhas = tabelaTeto(16);
  for (let i = 0; i < esperado.length; i++) {
    assert.equal(linhas[i].maiorUns, esperado[i], `n=${i + 1}`);
  }
});

test('o piso ingenuo de 2/3 erra por UM exatamente quando n = 1 (mod 3)', () => {
  for (const l of tabelaTeto(16)) {
    const deveriaErrar = l.n % 3 === 1;
    assert.equal(l.erroDoPiso, deveriaErrar ? 1 : 0, `n=${l.n}`);
    assert.equal(l.maiorUns - pisoIngenuo(l.n), deveriaErrar ? 1 : 0);
  }
});

test('o pico do histograma fica ACIMA da metade, nunca nela', () => {
  const esperado = { 8: { pico: 19, vale: 60 }, 11: { pico: 35, vale: 288 },
                     12: { pico: 42, vale: 519 } };
  for (const [n, e] of Object.entries(esperado)) {
    const h = tabelaHistograma(Number(n));
    assert.equal(h.pico, e.pico, `pico de n=${n}`);
    assert.equal(h.picoVale, e.vale, `altura do pico de n=${n}`);
    assert.ok(h.pico * 2 > h.casas, `n=${n}: o pico nao passou da metade`);
    assert.equal(h.espelhado, false, `n=${n}: o histograma nao e espelhado`);
  }
});

test('a primeira linha inicial balanceada de cada ordem', () => {
  const esperado = { 3: 1, 4: 2, 7: 9, 8: 11, 11: 75, 12: 73 };
  for (const [n, p] of Object.entries(esperado)) {
    assert.equal(varrer(Number(n)).primeiro, p, `n=${n}`);
  }
});

test('as classes da inversao e as linhas simetricas', () => {
  const linhas = tabelaInversao(12);
  const n12 = linhas.find((l) => l.n === 12);
  assert.equal(n12.classes, 2080);
  assert.equal(n12.simetricas, 64);
  assert.equal(n12.balanceadosSimetricos, 0);

  const n11 = linhas.find((l) => l.n === 11);
  assert.equal(n11.classes, 1056);
  assert.equal(n11.balanceadosSimetricos, 3);
});

test('a ordem n = 0 (mod 4) tem fracao MAIOR que a parceira n = 3, ate quebrar em 19/20', () => {
  const linhas = tabelaBalanceados(20);
  const f = (n) => linhas.find((l) => l.n === n).fracao;

  // o padrao vale em tres pares seguidos
  assert.ok(f(8) > f(7), '8 contra 7');
  assert.ok(f(12) > f(11), '12 contra 11');
  assert.ok(f(16) > f(15), '16 contra 15');

  // e morre no quarto: 0,0572 contra 0,0625
  assert.ok(f(20) < f(19), '20 contra 19 deveria QUEBRAR o padrao');
  assert.equal(f(19).toFixed(6), '0.062479');
  assert.equal(f(20).toFixed(6), '0.057205');
});

test('a fracao de balanceados cai no geral, mas nao monotonamente', () => {
  const linhas = tabelaBalanceados(20).filter((l) => l.balanceados > 0);
  assert.ok(linhas[0].fracao > linhas[linhas.length - 1].fracao, 'no geral cai');
  const subidas = linhas.filter((l, i) => i > 0 && l.fracao > linhas[i - 1].fracao);
  assert.equal(subidas.length, 3, 'sobe exatamente tres vezes');
});
