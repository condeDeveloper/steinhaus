// O teto de uns.
//
// A regra do triangulo e `filha = pai xor mae`. Como `1 xor 1 = 0`, duas casas
// vizinhas iguais a 1 forcam a filha a ser 0. Ou seja: NENHUM triangulinho
// (duas casas vizinhas na mesma linha, mais a casa logo abaixo entre elas)
// tem as tres iguais a 1.
//
// Cada triangulinho e um trio que admite no maximo dois uns, e os
// triangulinhos cobrem o triangulo grande — e dai que sai um teto proximo de
// 2/3 das casas. Aqui o teto NAO e deduzido: ele e MEDIDO pela varredura, e a
// conta de 2/3 fica ao lado como previsao a ser conferida.

import { casas, quantosUns } from './triangulo.js';
import { linhas } from './triangulo.js';

/** Quantos triangulinhos (trios pai-mae-filha) o triangulo de lado n tem. */
export function quantosTriangulinhos(n) {
  // em cada linha de largura w >= 2 ha w-1 trios
  let total = 0;
  for (let w = n; w >= 2; w--) total += w - 1;
  return total;
}

/**
 * Confere, casa a casa, que nenhum triangulinho tem tres uns.
 *
 * E a propriedade que sustenta o teto. Se ela falhasse uma vez, o teto cairia
 * junto — por isso ela e conferida por varredura, nao assumida.
 */
export function temTriangulinhoCheio(n, inicial) {
  const L = linhas(n, inicial);
  for (let i = 0; i + 1 < L.length; i++) {
    for (let k = 0; k + 1 < L[i].length; k++) {
      if (L[i][k] === 1 && L[i][k + 1] === 1 && L[i + 1][k] === 1) return true;
    }
  }
  return false;
}

/** Varre todas as linhas iniciais procurando um triangulinho cheio. */
export function algumTriangulinhoCheio(n) {
  for (let i = 0; i < 1 << n; i++) if (temTriangulinhoCheio(n, i)) return i;
  return -1;
}

/** O maior numero de uns que a varredura alcanca, medido. */
export function maiorUns(n) {
  let maior = -1;
  let onde = -1;
  for (let i = 0; i < 1 << n; i++) {
    const u = quantosUns(n, i);
    if (u > maior) {
      maior = u;
      onde = i;
    }
  }
  return { maiorUns: maior, linhaInicial: onde };
}

/**
 * O teto de uns, MEDIDO: `teto(n(n+1)/3)`.
 *
 * Eu havia escrito PISO de 2/3 das casas, raciocinando que cada triangulinho
 * admite no maximo dois uns. A varredura derrubou: nas ordens em que 2/3 das
 * casas nao da inteiro — isto e, quando n = 1 (mod 3) — o maximo real fica UM
 * acima do piso, e bate com o teto. Nas outras, piso e teto coincidem e nao da
 * para notar a diferenca. Por isso a formula aqui e o teto, e a versao errada
 * ficou guardada em `pisoIngenuo` para a tabela mostrar onde ela quebra.
 */
export function tetoDeUns(n) {
  return Math.ceil((n * (n + 1)) / 3);
}

/** A previsao que eu tinha feito de cabeca, guardada para a tabela. */
export function pisoIngenuo(n) {
  return Math.floor((2 * casas(n)) / 3);
}

/**
 * A tabela: o maximo medido contra o teto previsto de 2/3.
 *
 * `folga` diz quanto o maximo real fica ABAIXO do teto. Se desse sempre zero,
 * o teto seria exato; nao da, e a folga e o que o README conta.
 */
export function tabelaTeto(ate = 18) {
  const linhasSaida = [];
  for (let n = 1; n <= ate; n++) {
    const { maiorUns: maior } = maiorUns(n);
    const total = casas(n);
    linhasSaida.push({
      n,
      casas: total,
      maiorUns: maior,
      fracao: maior / total,
      teto: tetoDeUns(n),
      bateComOTeto: maior === tetoDeUns(n),
      pisoIngenuo: pisoIngenuo(n),
      // onde a minha previsao errada se separa do medido
      erroDoPiso: maior - pisoIngenuo(n),
      triangulinhos: quantosTriangulinhos(n),
    });
  }
  return linhasSaida;
}
