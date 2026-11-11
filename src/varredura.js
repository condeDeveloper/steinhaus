// A varredura: todas as 2^n linhas iniciais, uma a uma.
//
// Nao ha busca nem poda aqui — o dominio e pequeno o bastante para ser aberto
// inteiro ate n = 26 ou 27, e abrir tudo e o que torna as contagens provaveis
// em vez de estimadas.

import { casas, quantosUns, admiteBalanceado, popcount } from './triangulo.js';

/**
 * Varre as 2^n linhas iniciais e conta os triangulos balanceados.
 *
 * Devolve tambem o histograma completo de quantos uns aparecem, que e de onde
 * sai quase toda a tabela do README.
 */
export function varrer(n) {
  const total = casas(n);
  const histograma = new Int32Array(total + 1);
  const quantidade = 1 << n;
  let balanceados = 0;
  let primeiro = -1;

  for (let inicial = 0; inicial < quantidade; inicial++) {
    const uns = quantosUns(n, inicial);
    histograma[uns]++;
    if (total % 2 === 0 && uns * 2 === total) {
      balanceados++;
      if (primeiro < 0) primeiro = inicial;
    }
  }

  return {
    n,
    casas: total,
    linhasIniciais: quantidade,
    admite: admiteBalanceado(n),
    balanceados,
    primeiro,
    histograma: Array.from(histograma),
  };
}

/**
 * A fracao de linhas iniciais que dao triangulo balanceado.
 *
 * O denominador e 2^n, que e o numero de linhas iniciais DE VERDADE: nao e o
 * numero de triangulos distintos nem o numero de casas.
 */
export function fracaoBalanceada(n) {
  const r = varrer(n);
  return { n, balanceados: r.balanceados, de: r.linhasIniciais,
           fracao: r.balanceados / r.linhasIniciais };
}

/**
 * As simetrias que preservam o numero de uns.
 *
 * Virar a linha inicial de tras para frente espelha o triangulo inteiro, entao
 * a contagem de uns nao muda. E a unica simetria obvia; complementar os bits
 * NAO preserva (o triangulo de `~x` nao e o complemento do de `x`), e essa
 * diferenca e justamente o que torna a contagem interessante.
 */
export function inverter(n, inicial) {
  let saida = 0;
  for (let k = 0; k < n; k++) if ((inicial >> k) & 1) saida |= 1 << (n - 1 - k);
  return saida;
}

/** Quantas classes a inversao forma, e quantas linhas sao simetricas. */
export function classesPorInversao(n) {
  const vistos = new Uint8Array(1 << n);
  let classes = 0;
  let simetricas = 0;
  for (let i = 0; i < 1 << n; i++) {
    if (vistos[i]) continue;
    const j = inverter(n, i);
    vistos[i] = 1;
    vistos[j] = 1;
    classes++;
    if (i === j) simetricas++;
  }
  return { n, classes, simetricas };
}

/** O maior e o menor numero de uns que um triangulo de lado n alcanca. */
export function extremos(n) {
  const r = varrer(n);
  let menor = -1;
  let maior = -1;
  for (let u = 0; u < r.histograma.length; u++) {
    if (r.histograma[u] > 0) {
      if (menor < 0) menor = u;
      maior = u;
    }
  }
  return { n, casas: r.casas, menorUns: menor, maiorUns: maior };
}

export { popcount };
