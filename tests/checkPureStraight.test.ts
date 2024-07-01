import { checkPureStraight, Hand } from '../src/index';
import { Suit, Wind, Ending, SetType, SetState, Dragon } from '../src/enums';

let hand: Hand;

describe('checkPureStraight', () => {

  beforeEach(() => {
    hand = {
      seatWind: Wind.EAST,
      prevalentWind: Wind.EAST,
      doras: [{ suit: Suit.BAMBOO, value: 2 }],
      hiddenDoras: [{ suit: Suit.DOTS, value: 3 }],
      end: Ending.RON,
      lastTile: { suit: Suit.BAMBOO, value: 4 },
      riichi: true,
      concealead: true,
      ippatsu: false,
      dabura: false,
      sets: [
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 4 }, { suit: Suit.BAMBOO, value: 5 }, { suit: Suit.BAMBOO, value: 6 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 7 }, { suit: Suit.BAMBOO, value: 8 }, { suit: Suit.BAMBOO, value: 9 }]},
          { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }]},
          { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.WIND, value: Wind.NORTH }, { suit: Suit.WIND, value: Wind.NORTH }]},
      ],
    }
  });

  test('Checks pure straight concealed', () => {
    expect(checkPureStraight(hand).length).toBe(1);
    expect(checkPureStraight(hand)[0].han).toBe(2);
  });

  test('Checks pure straight not concealed', () => {
    hand.concealead = false;
    expect(checkPureStraight(hand).length).toBe(1);
    expect(checkPureStraight(hand)[0].han).toBe(1);
  });

  test('Checks pure straight requires one suit', () => {
    hand.sets[0] = { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 1 }, { suit: Suit.DOTS, value: 2 }, { suit: Suit.DOTS, value: 2 }]};
    expect(checkPureStraight(hand).length).toBe(0);
  });


  test('Checks pure straight orders correctly', () => {
    hand.sets[0] = { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 1 }, { suit: Suit.BAMBOO, value: 2 }]};
    expect(checkPureStraight(hand).length).toBe(1);
    expect(checkPureStraight(hand)[0].han).toBe(2);
  });

});