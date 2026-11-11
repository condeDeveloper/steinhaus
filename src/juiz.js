// O juiz. Nao importa nada de `varredura.js` e nao usa `quantosUns`.
//
// A varredura conta uns pela via rapida: a linha seguinte e `x ^ (x >> 1)` e a
// contagem sai de popcount, tudo dentro de uma palavra de maquina. O juiz faz
// o contrario — monta o triangulo casa a casa num vetor de vetores e conta no
// laco. E lento de proposito: a lentidao e o preco de ele nao compartilhar
// raciocinio nenhum com a versao rapida.

/**
 * Monta o triangulo pela definicao, sem bit nenhum, e devolve todas as casas
 * numa lista unica.
 */
export function casasDoTriangulo(n, inicialBits) {
  let linha = [];
  for (let k = 0; k < n; k++) linha.push((inicialBits >> k) & 1);
  const todas = [...linha];
  while (linha.length > 1) {
    const proxima = [];
    for (let k = 0; k + 1 < linha.length; k++) {
      // soma mod 2 do par vizinho, escrita como soma mesmo, nao como xor
      proxima.push((linha[k] + linha[k + 1]) % 2);
    }
    todas.push(...proxima);
    linha = proxima;
  }
  return todas;
}

/** Quantos uns, contando casa a casa. */
export function unsPeloJuiz(n, inicialBits) {
  return casasDoTriangulo(n, inicialBits).reduce((a, b) => a + b, 0);
}

/** Quantas casas o triangulo tem de verdade, contadas e nao calculadas. */
export function casasPeloJuiz(n, inicialBits = 0) {
  return casasDoTriangulo(n, inicialBits).length;
}

/**
 * A previsao da teoria: so ha triangulo balanceado quando o numero de casas e
 * par, isto e, quando n = 0 ou 3 (mod 4).
 *
 * E uma previsao FORTE e facil de refutar: basta a varredura achar um
 * balanceado numa ordem que isto proibe. Juiz que nunca pode discordar nao
 * serve para nada.
 */
export function paridadePermiteBalanceado(n) {
  return n % 4 === 0 || n % 4 === 3;
}

/**
 * Conta os balanceados pelo caminho lento, para cruzar com a varredura rapida.
 * So vale para n pequeno — e esse o ponto.
 */
export function balanceadosPeloJuiz(n) {
  const total = (n * (n + 1)) / 2;
  if (total % 2 !== 0) return 0;
  let conta = 0;
  for (let i = 0; i < 1 << n; i++) {
    if (unsPeloJuiz(n, i) * 2 === total) conta++;
  }
  return conta;
}
