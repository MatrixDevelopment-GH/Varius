//TODO: Hook up card ranks & suits with these guys.
export enum cards {
    '🂡🂢🂣🂤🂥🂦🂧🂨🂩🂪🂫🂬🂭🂮', // Spades
    '🂱🂲🂳🂴🂵🂶🂷🂸🂹🂺🂻🂼🂽🂾', // Hearts
    '🃁🃂🃃🃄🃅🃆🃇🃈🃉🃊🃋🃌🃍🃎', // Diamonds
    '🃑🃒🃓🃔🃕🃖🃗🃘🃙🃚🃛🃜🃝🃞', // Clubs
}

export class cardRank {
    public static readonly suits = ['spades', 'clubs', 'hearts', 'diamonds'];
    public static readonly ranks = [
        'A',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K',
    ];
    public static readonly ranksWithJoker = [
        'RJ',
        'BJ',
        'A',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        'J',
        'Q',
        'K',
    ];
}
