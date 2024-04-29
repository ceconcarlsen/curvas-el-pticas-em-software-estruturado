import { intAdd, intNull, intCopy, intNeg, intDiv } from "./CAMADA1";

// Função int_modular - Calcula o resto da divisão de um BIGINT por outro.
function intModular(a, p, resto) {
  let quociente = new Bigint();  // Similar à classe Bigint definida anteriormente

  if ((a.hw[0] >> (HALFSIZE - 1)) !== 0) {
      intAdd(a, p, resto);
  } else {
      let i = 0;
      while (i <= INTMAX && a.hw[i] === p.hw[i]) {
          i++;
      }
      if (i === INTMAX + 1) i = INTMAX;
      if (a.hw[i] >= p.hw[i]) {
          intDiv(a, p, quociente, resto);
      } else {
          intCopy(a, resto);
      }
  }
}

// Função add_modular - Adiciona dois BIGINT e calcula o resto da divisão por um terceiro.
function addModular(a, b, p, resto) {
  let temp = new Bigint();
  intAdd(a, b, temp);
  intModular(temp, p, resto);
}


// Função sub_modular - Subtrai dois BIGINT e calcula o resto da divisão por um terceiro.
function subModular(a, b, p, resto) {
  let temp = new Bigint();
  intSub(a, b, temp);
  intAdd(temp, p, temp);  // Garante que o resultado é positivo antes de aplicar o módulo
  intModular(temp, p, resto);
}

// Função mul_modular - Multiplica dois BIGINT e calcula o resto da divisão por um terceiro.
function mulModular(a, b, p, resto) {
  let temp = new Bigint();
  intMul(a, b, temp);
  intModular(temp, p, resto);
}

// Função inv_modular - Calcula o inverso multiplicativo de um BIGINT em relação a outro.
function inversoMul(a, b, c) {
  let q = new Bigint(), x2 = new Bigint(), y2 = new Bigint(), t2 = new Bigint(),
      x3 = new Bigint(), y3 = new Bigint(), t3 = new Bigint(), temp = new Bigint();
  intNull(x3);
  intNull(y3);
  intNull(t3);
  intNull(q);
  intNull(x2);
  intNull(y2);
  intNull(t2);
  intNull(temp);
  y2.hw[INTMAX] = 0x1;

  let i = 0;
  while (i <= INTMAX && a.hw[i] === b.hw[i]) {
      i++;
  }
  if (i === INTMAX + 1) i = INTMAX;
  if (a.hw[i] >= b.hw[i]) {
      intCopy(a, x3);
      intCopy(a, temp);
      intCopy(b, y3);
  } else {
      intCopy(b, x3);
      intCopy(b, temp);
      intCopy(a, y3);
  }

  let teste_y3 = intTest(y3);
  while (teste_y3 > 1) {
      intDiv(x3, y3, q, t3);
      intMul(q, y2, t2);
      intNeg(t2);
      intAdd(x2, t2, t2);
      intCopy(y3, x3);
      intCopy(t3, y3);
      intCopy(y2, x2);
      intCopy(t2, y2);
      teste_y3 = intTest(y3);
  }

  if (teste_y3 === 0) {
      return 0;
  } else {
      if ((y2.hw[0] >> (HALFSIZE - 1)) !== 0) {
          intAdd(y2, temp, c);
      } else {
          intCopy(y2, c);
      }
      return 1;
  }
}
