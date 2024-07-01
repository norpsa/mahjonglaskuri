import { checkDragonYakuhai, Hand } from '../src/index';
import { Suit, Wind, Ending, SetType, Dragon, SetState } from '../src/enums';

let hand: Hand;

describe('checkYakuhai', () => {

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
          { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.DOTS, value: 6 }, { suit: Suit.DOTS, value: 7 }, { suit: Suit.DOTS, value: 8 }]},
          { type: SetType.CHOW, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 3 }, { suit: Suit.BAMBOO, value: 4 }]},
          { type: SetType.PAIR, state: SetState.CONCEALED, tiles: [{ suit: Suit.BAMBOO, value: 2 }, { suit: Suit.BAMBOO, value: 2 }]},
      ],
    }
  });

  test('Checks Yakuhai', () => {
    expect(checkDragonYakuhai(hand).length).toBe(1);
  });

  test('Checks that kong is also okay', () => {
    hand.sets[0] = { type: SetType.KONG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }, { suit: Suit.DRAGON, value: Dragon.GREEN }]};
    expect(checkDragonYakuhai(hand).length).toBe(1);
  });

  test('Checks that white and red is also calculated', () => {
    hand.sets[0] = { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.WHITE }, { suit: Suit.DRAGON, value: Dragon.WHITE }, { suit: Suit.DRAGON, value: Dragon.WHITE } ]};
    hand.sets[1] = { type: SetType.PUNG, state: SetState.CONCEALED, tiles: [{ suit: Suit.DRAGON, value: Dragon.RED }, { suit: Suit.DRAGON, value: Dragon.RED }, { suit: Suit.DRAGON, value: Dragon.RED } ]};
    expect(checkDragonYakuhai(hand).length).toBe(2);
  });

});