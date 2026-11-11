// Uma funcao por tabela do README. Nenhum numero do README e escrito a mao.

import { casas, admiteBalanceado } from './triangulo.js';
import { varrer, classesPorInversao, extremos, inverter } from './varredura.js';
import { balanceadosPeloJuiz, paridadePermiteBalanceado, unsPeloJuiz } from './juiz.js';

/** Tabela 1 — a contagem de balanceados por ordem, e a paridade que a prevê. */
export function tabelaBalanceados(ate = 20) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const r = varrer(n);
    linhas.push({
      n,
      casas: r.casas,
      linhasIniciais: r.linhasIniciais,
      paridadePermite: paridadePermiteBalanceado(n),
      balanceados: r.balanceados,
      fracao: r.balanceados / r.linhasIniciais,
    });
  }
  return linhas;
}

/**
 * Tabela 2 — a varredura rapida contra o juiz lento, ordem a ordem.
 *
 * O juiz monta o triangulo casa a casa num vetor; a varredura usa xor
 * deslocado e popcount. Se os dois batem em toda ordem, o numero vale.
 */
export function tabelaContraJuiz(ate = 14) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const rapido = varrer(n).balanceados;
    const lento = balanceadosPeloJuiz(n);
    linhas.push({ n, rapido, lento, concordam: rapido === lento });
  }
  return linhas;
}

/**
 * Tabela 3 — a previsao da paridade conferida contra a varredura.
 *
 * A previsao e forte: basta UM balanceado numa ordem proibida para derrubar.
 */
export function tabelaParidade(ate = 20) {
  return tabelaBalanceados(ate).map((l) => ({
    n: l.n,
    casas: l.casas,
    permite: l.paridadePermite,
    achou: l.balanceados > 0,
    // a previsao acertou nesta ordem?
    acertou: l.paridadePermite === l.balanceados > 0,
  }));
}

/**
 * Tabela 4 — o histograma do numero de uns, e o quanto ele e simetrico.
 *
 * Vale a pergunta porque a simetria NAO e obvia: complementar a linha inicial
 * nao complementa o triangulo, entao nao ha razao de cara para o histograma
 * ser espelhado.
 */
export function tabelaHistograma(n) {
  const r = varrer(n);
  const h = r.histograma;
  let espelhado = true;
  for (let u = 0; u < h.length; u++) {
    if (h[u] !== h[h.length - 1 - u]) {
      espelhado = false;
      break;
    }
  }
  const pico = h.indexOf(Math.max(...h));
  return { n, casas: r.casas, espelhado, pico, picoVale: h[pico], histograma: Array.from(h) };
}

/** Tabela 5 — os extremos: o menor e o maior numero de uns alcancavel. */
export function tabelaExtremos(ate = 18) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) linhas.push(extremos(n));
  return linhas;
}

/**
 * Tabela 6 — a inversao da linha inicial espelha o triangulo, entao preserva o
 * numero de uns. Quantas classes ela forma, e quantos balanceados sao
 * simetricos por ela.
 */
export function tabelaInversao(ate = 16) {
  const linhas = [];
  for (let n = 1; n <= ate; n++) {
    const c = classesPorInversao(n);
    const total = casas(n);
    let balanceadosSimetricos = 0;
    if (total % 2 === 0) {
      for (let i = 0; i < 1 << n; i++) {
        if (inverter(n, i) !== i) continue;
        if (unsPeloJuiz(n, i) * 2 === total) balanceadosSimetricos++;
      }
    }
    linhas.push({ ...c, balanceadosSimetricos });
  }
  return linhas;
}

export { admiteBalanceado };
