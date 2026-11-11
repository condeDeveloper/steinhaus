# steinhaus

Triângulos de Steinhaus, varridos linha inicial a linha inicial. Começa com uma
linha de `n` bits; cada linha seguinte tem um bit a menos e sai da soma mod 2
de cada par vizinho da linha de cima:

```
1 0 0 1 1
 1 0 1 0
  1 1 1
   0 0
    0
```

O triângulo inteiro tem `n(n+1)/2` casas. Steinhaus perguntou em 1963 se existe
sempre um **balanceado** — tantos zeros quanto uns. Aqui as `2^n` linhas
iniciais de cada ordem são abertas uma a uma, até `n = 20`.

Sem dependência nenhuma. 29 testes.

## Os quatro achados

**1. O máximo de uns é exatamente `teto(n(n+1)/3)`, nas dezesseis ordens
medidas.** Nenhum triângulo passa de dois terços de uns, e a razão é de uma
linha: como `1 xor 1 = 0`, três casas que formam um triangulinho — duas
vizinhas mais a filha delas — nunca são todas 1. Os triangulinhos cobrem o
triângulo, e daí sai o teto. Em `n = 12` o máximo é 52 de 78 casas; em `n = 16`
é 91 de 136.

**2. A paridade prevê o resultado nas vinte ordens, sem erro.** Só pode haver
balanceado quando `n(n+1)/2` é par, isto é quando `n ≡ 0` ou `3 (mod 4)`. A
varredura encontrou zero balanceados em **todas** as dez ordens proibidas e pelo
menos um em **todas** as dez permitidas. É uma previsão fácil de derrubar —
bastaria um balanceado onde a paridade proíbe — e ela não caiu.

**3. O pico do histograma fica em 53% de uns, nunca na metade.** Em `n = 12` o
número de uns mais comum é 42 das 78 casas, com 519 linhas iniciais; em `n = 11`
é 35 de 66; em `n = 8` é 19 de 36. O histograma **não é espelhado**: complementar
a linha inicial não complementa o triângulo, e a distribuição inteira fica
puxada para o lado dos uns, encostando no teto de 2/3. É por isso que o
balanceado é raro mesmo quando é permitido.

**4. A ordem `n ≡ 0 (mod 4)` bate a parceira `n ≡ 3`, até morrer em 19/20.** A
fração de linhas iniciais que dá balanceado é maior em 8 que em 7 (15,6% contra
9,4%), maior em 12 que em 11, maior em 16 que em 15. Três pares seguidos. No
quarto par o padrão **inverte**: 19 dá 6,2479% e 20 dá 5,7205%.

## Como rodar

```bash
node --test testes/*.test.js
node ferramentas/medidor.js
node ferramentas/medidor.js teto
```

## As tabelas

### Balanceados por ordem

```
  n  casas  2^n        permite  balanceados  fracao
   3      6          8     true            4  0.500000
   4     10         16     true            6  0.375000
   7     28        128     true           12  0.093750
   8     36        256     true           40  0.156250
  11     66       2048     true          171  0.083496
  12     78       4096     true          410  0.100098
  15    120      32768     true         1896  0.057861
  16    136      65536     true         5160  0.078735
  19    190     524288     true        32757  0.062479
  20    210    1048576     true        59984  0.057205
```

As ordens que não aparecem — 1, 2, 5, 6, 9, 10, 13, 14, 17, 18 — deram **zero**,
e são exatamente as que a paridade proíbe.

### O teto de uns

```
  n  casas  maior uns  fracao   teto(n(n+1)/3)  piso ingenuo  erro do piso
   1      1          1  1.0000               1             0             1
   4     10          7  0.7000               7             6             1
   7     28         19  0.6786              19            18             1
  10     55         37  0.6727              37            36             1
  12     78         52  0.6667              52            52             0
  13     91         61  0.6703              61            60             1
  16    136         91  0.6691              91            90             1
```

### A inversão da linha inicial

```
  n  classes  simetricas  balanceados simetricos
  11     1056          64                      3
  12     2080          64                      0
```

Virar a linha inicial de trás para frente espelha o triângulo, então preserva o
número de uns. É a única simetria óbvia: complementar os bits **não** preserva.

## O que as medidas me corrigiram

**Eu escrevi o teto como piso de 2/3 e estava errado.** O raciocínio parecia
fechado: cada triangulinho admite no máximo dois uns, logo no máximo dois terços
das casas. Nas ordens em que `2/3` das casas dá inteiro, piso e teto coincidem e
não dá para notar a diferença — e foi isso que me enganou, porque são a maioria.
Nas outras, o máximo real fica **um acima** do piso. A varredura mostrou que a
fórmula certa é `teto(n(n+1)/3)`, e que o erro do piso aparece exatamente quando
`n ≡ 1 (mod 3)`: ordens 1, 4, 7, 10, 13, 16. O teste prende o erro esperado
ordem a ordem, justamente para a versão errada não voltar.

**E quase escrevi o achado 4 como lei.** Depois de ver 8 > 7, 12 > 11 e 16 > 15,
a frase "a ordem múltipla de 4 sempre tem fração maior que a parceira" estava
pronta para entrar no README como regra. O par 19/20 a derruba. Três
confirmações seguidas não são prova de nada, e o teste que prende a quebra está
lá para me lembrar disso.

## Os arquivos

```
src/triangulo.js   a regra, a contagem rapida por xor deslocado e popcount
src/varredura.js   as 2^n linhas iniciais, o histograma, a inversao
src/juiz.js        o caminho lento: monta o triangulo casa a casa num vetor
src/teto.js        o teto de uns e o piso ingenuo, lado a lado
src/medidas.js     uma funcao por tabela
ferramentas/medidor.js
testes/nucleo.test.js    17 testes
testes/medidas.test.js   12 testes
```

O juiz não importa nada da varredura e não usa `quantosUns`: a varredura conta
pela via rápida, dentro de uma palavra de máquina; o juiz monta o triângulo casa
a casa num vetor de vetores e soma no laço. Os dois concordam em **toda linha
inicial** até `n = 12` — são 8.190 triângulos conferidos dos dois jeitos.
