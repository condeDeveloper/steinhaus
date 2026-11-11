// O triangulo de Steinhaus.
//
// Comeca com uma linha de n bits. Cada linha seguinte tem um bit a menos e sai
// da soma mod 2 de cada par vizinho da linha de cima:
//
//     1 0 0 1 1
//      1 0 1 0
//       1 1 1
//        0 0
//         0
//
// O triangulo inteiro tem n(n+1)/2 casas. Steinhaus perguntou em 1963 se existe
// sempre um BALANCEADO — tantos zeros quanto uns. So pode existir quando
// n(n+1)/2 e par, ou seja n = 0 ou 3 (mod 4); Harborth provou em 1972 que
// nesses casos sempre existe.
//
// Aqui a linha inicial e um inteiro: o bit k e a casa k. Com isso a linha
// seguinte sai de UM xor deslocado, e o triangulo de n = 32 ainda cabe numa
// palavra de maquina.

/** Quantas casas tem o triangulo de lado n. */
export function casas(n) {
  return (n * (n + 1)) / 2;
}

/**
 * Pode existir triangulo balanceado de lado n?
 *
 * Condicao de paridade pura: metade de um numero impar de casas nao e inteiro.
 */
export function admiteBalanceado(n) {
  return casas(n) % 2 === 0;
}

/**
 * Constroi o triangulo e devolve as linhas como vetores de bits.
 *
 * `inicial` e a primeira linha, com `n` bits, o menos significativo na
 * esquerda.
 */
export function linhas(n, inicial) {
  const saida = [];
  let linha = [];
  for (let k = 0; k < n; k++) linha.push((inicial >> k) & 1);
  saida.push(linha);
  while (linha.length > 1) {
    const proxima = new Array(linha.length - 1);
    for (let k = 0; k < proxima.length; k++) proxima[k] = linha[k] ^ linha[k + 1];
    saida.push(proxima);
    linha = proxima;
  }
  return saida;
}

/**
 * Quantos UNS o triangulo tem, pela via rapida.
 *
 * Nao monta vetor nenhum: a linha seguinte e `x ^ (x >> 1)` com a largura
 * encolhendo, e a contagem de bits sai de `popcount`. E essa versao que a
 * varredura usa milhoes de vezes.
 */
export function quantosUns(n, inicial) {
  let x = inicial;
  let total = 0;
  for (let largura = n; largura >= 1; largura--) {
    const mascara = largura === 32 ? -1 : (1 << largura) - 1;
    const linha = x & mascara;
    total += popcount(linha);
    x = linha ^ (linha >>> 1);
  }
  return total;
}

/** Numero de bits 1 de um inteiro de 32 bits. */
export function popcount(x) {
  x = x - ((x >>> 1) & 0x55555555);
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  x = (x + (x >>> 4)) & 0x0f0f0f0f;
  return (x * 0x01010101) >>> 24;
}

/** O triangulo de `inicial` e balanceado? */
export function ehBalanceado(n, inicial) {
  const total = casas(n);
  return total % 2 === 0 && quantosUns(n, inicial) * 2 === total;
}
