import { LOMASK } from "./DEFINES.JS";
import { HALFSIZE } from "./DEFINES.JS";
import { INTMAX } from "./DEFINES.JS";

// FUNCTIONS

//Função int_null - Zera todos os bits de um BIGINT.
export function intNull(a) {
  for (let i = 0; i <= INTMAX; i++) {
      a.hw[i] = 0;
  }
}

// Função int_copy - Copia o conteúdo de um BIGINT para outro.
export function intCopy(a, b) {
  for (let i = 0; i <= INTMAX; i++) {
      b.hw[i] = a.hw[i];
  }
}


export function intAdd(a, b, c) {
  let ec = 0;
  for (let i = INTMAX; i >= 0; i--) {
      ec = a.hw[i] + b.hw[i] + (ec >>> HALFSIZE);
      c.hw[i] = ec & LOMASK;
  }
}

//Função int_neg - Retorna o valor negativo de um BIGINT.
export function intNeg(a) {
  for (let i = INTMAX; i >= 0; i--) {
      a.hw[i] = ~a.hw[i] & LOMASK;
  }
  for (let i = INTMAX; i >= 0; i--) {
      a.hw[i]++;
      if (a.hw[i] & LOMASK) break;
      a.hw[i] &= LOMASK;
  }
}

//Função int_sub - Subtrai um BIGINT de outro.
export function intSub(a, b, c) {
  let negb = { hw: Array(INTMAX + 1).fill(0) };
  intCopy(b, negb);
  intNeg(negb);
  intAdd(a, negb, c);
}

//Função int_mul - Multiplica dois BIGINT.
export function intMul(a, b, c) {
  intNull(c);
  for (let i = INTMAX; i >= INTMAX / 2; i--) {
      let ea = a.hw[i];
      let sum = { hw: Array(INTMAX + 1).fill(0) };
      intNull(sum);
      for (let j = INTMAX; j >= INTMAX / 2; j--) {
          let eb = b.hw[j];
          let k = i + j - INTMAX;
          let mul = ea * eb + sum.hw[k];
          sum.hw[k] = mul & LOMASK;
          sum.hw[k - 1] = mul >>> HALFSIZE;
      }
      intAdd(sum, c, c);
  }
}

//Função int_div - Divide um BIGINT por outro.
export function intDiv(top, bottom, quotient, remainder) {
  if (bottom === 0) throw new Error("Division by zero");

  // Inicializa quociente e resto
  intNull(quotient);
  intNull(remainder);
  intCopy(top, remainder);

  // Encontra o primeiro bit não zero no divisor
  let shift = bottom.hw.length * HALFSIZE - 1;
  while (shift >= 0 && !testBit(bottom, shift)) {
      shift--;
  }
  
  if (shift < 0) return; // bottom is zero after all

  // Divisão longa bit a bit
  for (let i = top.hw.length * HALFSIZE - 1; i >= shift; i--) {
      leftShift(quotient, 1); // Shift quotient left by 1 bit
      if (testBit(top, i)) {
          addBit(quotient, 0); // Add 1 to the least significant bit of quotient
      }
      if (compareBigints(remainder, bottom) >= 0) {
          subBigints(remainder, bottom, remainder);
          addBit(quotient, 0);
      }
  }
}


export function leftShift(bigint, bits) {
  const hwLength = bigint.hw.length;
  const wordSize = 32; // Assuming each element of hw is a 32-bit integer for this example
  const fullShifts = Math.floor(bits / wordSize);
  const innerShift = bits % wordSize;

  if (fullShifts > 0) {
      for (let i = hwLength - 1; i >= 0; i--) {
          bigint.hw[i] = i >= fullShifts ? bigint.hw[i - fullShifts] : 0;
      }
  }

  if (innerShift > 0) {
      for (let i = hwLength - 1; i > 0; i--) {
          bigint.hw[i] = (bigint.hw[i] << innerShift) | (bigint.hw[i - 1] >>> (wordSize - innerShift));
      }
      bigint.hw[0] <<= innerShift; // Shift the lowest order word
  }
}


export function testBit(bigint, bitPosition) {
  const wordSize = 32; // Assuming 32 bits per hw element
  const wordIndex = Math.floor(bitPosition / wordSize);
  const bitIndex = bitPosition % wordSize;

  if (wordIndex >= bigint.hw.length) return false; // Out of bounds
  return (bigint.hw[wordIndex] & (1 << bitIndex)) !== 0;
}


export function compareBigints(a, b) {
  for (let i = a.hw.length - 1; i >= 0; i--) {
      if (a.hw[i] > b.hw[i]) return 1;
      if (a.hw[i] < b.hw[i]) return -1;
  }
  return 0;
}


export function subBigints(a, b, result) {
  let borrow = 0;
  for (let i = 0; i < a.hw.length; i++) {
      let temp = a.hw[i] - b.hw[i] - borrow;
      borrow = temp < 0 ? 1 : 0;
      result.hw[i] = temp < 0 ? temp + 0x100000000 : temp; // Assuming each hw entry is 32 bits
  }
}


export function addBit(bigint, bitPosition) {
  const wordSize = 32; // Assuming 32 bits per hw element
  const wordIndex = Math.floor(bitPosition / wordSize);
  const bitIndex = bitPosition % wordSize;

  if (wordIndex >= bigint.hw.length) {
      console.error('Bit position out of bounds');
      return; // Optionally resize bigint.hw or handle error
  }

  bigint.hw[wordIndex] |= (1 << bitIndex);

  // Handle carry if necessary
  if (bigint.hw[wordIndex] >= 0x100000000) {
      bigint.hw[wordIndex] -= 0x100000000;
      // carry to the next word if needed, simplification here
  }
}


//Função ascii_to_bigint e bigint_to_ascii - Converte ASCII para BIGINT e vice-versa.
export function bigintToAscii(inhex, outstring) {
  let temp = new Bigint();
  let digit = new Bigint();
  let result = "";

  while (!isZero(inhex)) {
      intDiv(inhex, { hw: [10] }, temp, digit); // Divide by 10
      result = String.fromCharCode(digit.hw[INTMAX] + '0'.charCodeAt(0)) + result;
      intCopy(temp, inhex);
  }

  outstring[0] = result;
}

export function isZero(bigint) {
  // Returns true if all entries in bigint.hw are zero, false otherwise
  return bigint.hw.every(value => value === 0);
}
