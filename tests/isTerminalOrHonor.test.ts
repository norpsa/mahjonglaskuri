import { isTerminalOrHonor } from '../src/utils';
import { Suit, Wind, Dragon } from '../src/enums';

describe('isTerminalOrHonor', () => {

  test('Checks that 1 is terminal', () => {
    expect(isTerminalOrHonor({ suit: Suit.DOTS, value: 1})).toBe(true);
  });

  test('Checks that 9 is terminal', () => {
    expect(isTerminalOrHonor({ suit: Suit.DOTS, value: 9})).toBe(true);
  });

  test('Checks that 5 is not terminal', () => {
    expect(isTerminalOrHonor({ suit: Suit.DOTS, value: 5})).toBe(false);
  });

  test('Checks that wind is honor', () => {
    expect(isTerminalOrHonor({ suit: Suit.WIND, value: Wind.EAST })).toBe(true);
  });

  test('Checks that wind is honor', () => {
    expect(isTerminalOrHonor({ suit: Suit.DRAGON, value: Dragon.GREEN })).toBe(true);
  });

});