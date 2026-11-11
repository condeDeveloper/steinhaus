#!/usr/bin/env node
// Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js            todas
//   node ferramentas/medidor.js paridade   uma so
//
// Nenhum numero do README e digitado a mao: sai tudo daqui, e
// `testes/medidas.test.js` prende os valores.

import {
  tabelaBalanceados,
  tabelaContraJuiz,
  tabelaParidade,
  tabelaHistograma,
  tabelaExtremos,
  tabelaInversao,
} from '../src/medidas.js';
import { tetoDeUns, tabelaTeto } from '../src/teto.js';

const tabelas = {
  balanceados() {
    console.log('Balanceados por ordem');
    console.log('---------------------');
    console.log('  n  casas  2^n        permite  balanceados  fracao');
    for (const l of tabelaBalanceados(20)) {
      console.log(
        '  %s  %s  %s  %s  %s  %s',
        String(l.n).padStart(2),
        String(l.casas).padStart(5),
        String(l.linhasIniciais).padStart(9),
        String(l.paridadePermite).padStart(7),
        String(l.balanceados).padStart(11),
        l.fracao.toFixed(6)
      );
    }
  },

  juiz() {
    console.log('A varredura rapida contra o juiz lento');
    console.log('--------------------------------------');
    let todos = true;
    for (const l of tabelaContraJuiz(14)) {
      console.log('  n=%s  rapido %s  lento %s  %s',
        String(l.n).padStart(2), String(l.rapido).padStart(5),
        String(l.lento).padStart(5), l.concordam ? 'ok' : 'DISCORDAM');
      todos = todos && l.concordam;
    }
    console.log('  ->', todos ? 'concordam em todas' : 'HA DISCORDANCIA');
  },

  paridade() {
    console.log('A previsao da paridade contra a varredura');
    console.log('-----------------------------------------');
    console.log('  so pode haver balanceado quando n(n+1)/2 e par, isto e');
    console.log('  quando n = 0 ou 3 (mod 4)');
    let acertos = 0;
    const linhas = tabelaParidade(20);
    for (const l of linhas) {
      console.log('  n=%s  casas %s  permite %s  achou %s  %s',
        String(l.n).padStart(2), String(l.casas).padStart(4),
        String(l.permite).padStart(5), String(l.achou).padStart(5),
        l.acertou ? '' : '<- ERROU');
      if (l.acertou) acertos++;
    }
    console.log('  -> acertou em %d de %d ordens', acertos, linhas.length);
  },

  histograma() {
    console.log('O histograma do numero de uns');
    console.log('-----------------------------');
    for (const n of [8, 11, 12]) {
      const h = tabelaHistograma(n);
      console.log('  n=%d  casas %d  espelhado: %s  pico em %d (%d linhas)',
        h.n, h.casas, h.espelhado, h.pico, h.picoVale);
    }
  },

  teto() {
    console.log('O teto de uns: nenhum triangulo passa de 2/3');
    console.log('--------------------------------------------');
    console.log('  1 xor 1 = 0, entao tres casas que formam um triangulinho');
    console.log('  (duas vizinhas e a filha delas) nunca sao todas 1.');
    console.log('  n  casas  maior uns  fracao   teto 2/3');
    for (const l of tabelaTeto(18)) {
      console.log('  %s  %s  %s  %s  %s',
        String(l.n).padStart(2), String(l.casas).padStart(5),
        String(l.maiorUns).padStart(9), l.fracao.toFixed(4),
        String(l.teto).padStart(8));
    }
  },

  extremos() {
    console.log('Menor e maior numero de uns por ordem');
    console.log('-------------------------------------');
    for (const l of tabelaExtremos(18)) {
      console.log('  n=%s  casas %s  de %s a %s',
        String(l.n).padStart(2), String(l.casas).padStart(4),
        String(l.menorUns).padStart(3), String(l.maiorUns).padStart(3));
    }
  },

  inversao() {
    console.log('A inversao da linha inicial');
    console.log('---------------------------');
    console.log('  n  classes  simetricas  balanceados simetricos');
    for (const l of tabelaInversao(16)) {
      console.log('  %s  %s  %s  %s',
        String(l.n).padStart(2), String(l.classes).padStart(7),
        String(l.simetricas).padStart(10), String(l.balanceadosSimetricos).padStart(21));
    }
  },
};

const pedida = process.argv[2];
const nomes = pedida ? [pedida] : Object.keys(tabelas);
for (const nome of nomes) {
  if (!tabelas[nome]) {
    console.error('tabela desconhecida: %s', nome);
    console.error('conhecidas: %s', Object.keys(tabelas).join(', '));
    process.exit(1);
  }
  tabelas[nome]();
  console.log();
}
