import { isSameTile } from '../src/utils';
import { Suit } from '../src/enums';

const tileA = { suit: Suit.DOTS, value: 3 };
const tileB = { suit: Suit.CHARS, value: 3 };
const tileC = { suit: Suit.DOTS, value: 2 }

describe('isSameTile', () => {
  test('Checks that tileA is tileA', () => {
    expect(isSameTile(tileA, tileA)).toBe(true);
  });

  test('Checks that tileA is not tileB', () => {
    expect(isSameTile(tileA, tileB)).toBe(false);
  });

  test('Checks that tileA is not tileC', () => {
    expect(isSameTile(tileA, tileC)).toBe(false);
  });
});