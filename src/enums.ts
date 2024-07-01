type GetValues<T extends Record<string, string>> = T[keyof T];

export const Wind = {
    EAST: 'EAST',
    SOUTH: 'SOUTH',
    WEST: 'WEST',
    NORTH: 'NORTH',
} as const;

export type Wind = GetValues<typeof Wind>;

export const Suit = {
    BAMBOO: 'BAMBOO',
    DOTS: 'DOTS',
    CHARS: 'CHARS',
    WIND: 'WIND',
    DRAGON: 'DRAGON'
} as const;

export type Suit = GetValues<typeof Suit>;

export const Dragon = {
    WHITE: 'WHITE',
    GREEN: 'GREEN',
    RED: 'RED',
} as const;

export type Dragon = GetValues<typeof Dragon>;

export const SetType = {
    CHOW: 'CHOW',
    PUNG: 'PUNG',
    KONG: 'KONG',
    PAIR: 'PAIR',
    ORPHANS: 'ORPHANS',
} as const;

export type SetType = GetValues<typeof SetType>;

export const SetState = {
    OPEN: 'OPEN',
    CONCEALED: 'CONCEALED',
} as const;

export type SetState = GetValues<typeof SetState>;

export const Ending = {
    RON: 'RON',
    TSUMO: 'TSUMO',
} as const;

export type Ending = GetValues<typeof Ending>;

export const Yaku = {
    RIICHI: 'Riichi',
    IPPATSU: 'Ippatsu',
    DABURA: 'Dabura riichi',
    MENZEN_TSUMO: 'Menzen tsumo',
    PINFU: 'Pinfu',
    PURE_DOUBLE_CHOW: 'Pure double chow',
    ALL_SIMPLES: 'All simples',
    MIXED_TRIPLE_CHOW: 'Mixed triple chow',
    PURE_STRAIGHT: 'Pure straight',
    GREEN_DRAGON: 'Green dragon',
    RED_DRAGON: 'Red dragon',
    WHITE_DRAGON: 'White dragon',
    SEAT_WIND: 'Seat wind',
    PREVALENT_WIND: 'Prevalent wind',
    AFTER_A_KONG: 'After a kong',
    ROBBING_THE_KONG: 'Robbing the kong',
    UNDER_THE_SEA: 'Under the Sea',
    OUTSIDE_HAND: 'Outside hand',
    SEVEN_PAIRS: 'Seven pairs',
} as const;

export type Yaku = GetValues<typeof Yaku>;