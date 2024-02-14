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

export const Ending = {
    RON: 'RON',
    TSUMO: 'TSUMO',
} as const;

export type Ending = GetValues<typeof Ending>;