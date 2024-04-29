// CONSTANTS
export const NUMBITS = 48;
export const WORDSIZE = 16;
export const NUMWORD = Math.floor(NUMBITS / WORDSIZE);
export const MAXLONG = NUMWORD + 1;
export const UPRSHIFT = NUMBITS % WORDSIZE;
export const HALFSIZE = Math.floor(WORDSIZE / 2);
export const HIMASK = (~0 << HALFSIZE) >>> 0; // Himask needs to be adjusted for JS bit operations.
export const LOMASK = ~HIMASK;
export const MASK = (0xFFFF >>> HALFSIZE) >>> 0;
export const CARRY = (1 << HALFSIZE) >>> 0;
export const MSB_HW = (CARRY >>> 1) >>> 0;
export const INTMAX = (4 * MAXLONG - 1);
export const MAXSTRING = Math.floor(MAXLONG * WORDSIZE / 3);

// CLASSES
export class Bigint {
    constructor() {
        this.hw = new Array(4 * MAXLONG).fill(0);
    }
}

export class Point {
    constructor() {
        this.x = new Bigint();
        this.y = new Bigint();
    }
}
