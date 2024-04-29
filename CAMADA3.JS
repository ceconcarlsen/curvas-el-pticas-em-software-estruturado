// ADICAO DE PONTOS NA CURVA ELIPTICA

function pointAdd(a, b, p, p0, p1, p2) {
  let temp1 = new Bigint(), temp2 = new Bigint(), temp3 = new Bigint(), lambda = new Bigint();
  let O = { x: new Bigint(), y: new Bigint() };
  intNull(O.x);
  intNull(O.y);

  let teste_x = intTest(p0.x);
  let teste_y = intTest(p0.y);
  if (teste_x === 0 && teste_y === 0) {
      intCopy(p1.x, p2.x);
      intCopy(p1.y, p2.y);
  } else {
      teste_x = intTest(p1.x);
      teste_y = intTest(p1.y);
      if (teste_x === 0 && teste_y === 0) {
          intCopy(p0.x, p2.x);
          intCopy(p0.y, p2.y);
      } else {
          let compara = intCompara(p0.x, p1.x);
          if (compara === 0) { // Points are not inverses
              subModular(p0.x, p1.x, p, temp1);
              subModular(p0.y, p1.y, p, temp2);

              inversoMul(temp1, p, temp1);
              mulModular(temp1, temp2, p, lambda);
          } else {
              compara = intCompara(p0.y, p1.y);
              if (compara === 0) { // Points are inverses, result is infinity
                  intCopy(O.x, p2.x);
                  intCopy(O.y, p2.y);
              } else {
                  if (intTest(p1.y) === 0) {
                      intCopy(O.x, p2.x);
                      intCopy(O.y, p2.y);
                  } else {
                      // Doubling case
                      mulModular(p1.x, p1.x, p, temp1);
                      addModular(temp1, temp1, p, temp2);
                      addModular(temp1, temp2, p, temp3);
                      addModular(temp3, a, p, temp2);

                      addModular(p1.y, p1.y, p, temp1);

                      inversoMul(temp1, p, temp1);
                      mulModular(temp1, temp2, p, lambda);
                  }
              }
          }

          mulModular(lambda, lambda, p, temp1);
          addModular(p0.x, p1.x, p, temp2);
          subModular(temp1, temp2, p, p2.x);

          subModular(p1.x, p2.x, p, temp1);
          mulModular(temp1, lambda, p, temp2);
          subModular(temp2, p1.y, p, p2.y);
      }
  }
}

// MULTIPLICACAO DE PONTOS NA CURVA ELIPTICA
function pointMul(a, b, p, k, p1, q1) {
  let temp1 = { x: new Bigint(), y: new Bigint() };
  intNull(q1.x);
  intNull(q1.y);
  intNull(temp1.x);
  intNull(temp1.y);

  let l = (INTMAX + 1) * HALFSIZE;
  for (let i = 0; i <= INTMAX; i++) {
      if (!k.hw[i]) {
          l -= HALFSIZE;
      } else {
          break;
      }
  }

  let mask = MSB_HW;
  for (let j = 0; j < HALFSIZE; j++) {
      if (!(k.hw[i] & mask)) {
          l--;
          mask >>= 1;
      } else {
          break;
      }
  }

  let v_sig = i, b_sig = l % HALFSIZE;
  b_sig = b_sig === 0 ? HALFSIZE : b_sig;

  while (v_sig <= INTMAX) {
      mask = MSB_HW >> (HALFSIZE - b_sig);
      while (b_sig > 0) {
          if ((k.hw[v_sig] & mask) === 0) {
              pointAdd(a, b, p, q1, q1, temp1);
              intCopy(temp1.x, q1.x);
              intCopy(temp1.y, q1.y);
              b_sig--;
              mask >>= 1;
          } else {
              pointAdd(a, b, p, q1, q1, temp1);
              pointAdd(a, b, p, p1, temp1, q1);
              b_sig--;
              mask >>= 1;
          }
      }
      b_sig = HALFSIZE;
      v_sig++;
  }
}
