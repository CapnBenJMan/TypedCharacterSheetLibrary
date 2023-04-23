type CapCoin = "Platinum" | "Gold" | "Silver" | "Copper";
type ShortCoin = "plat" | "gold" | "silv" | "copp";
declare class Coin {
    private name;
    private _raw;
    private _change;
    private _pts;
    constructor(name: CapCoin, _raw: number, _change: number);
    applyChange(): void;
    get raw(): number;
    set raw(r: number);
    get pts(): number;
    set pts(p: number);
    get change(): number;
    set change(c: number);
    get mod(): 1 | 10 | 1000 | 100;
}
declare class CoinSet {
    plat: Coin;
    gold: Coin;
    silv: Coin;
    copp: Coin;
    name: string;
    constructor(platinum?: number, gold?: number, silver?: number, copper?: number, // constructor: coin values and change values can be 
    platChange?: number, goldChange?: number, silvChange?: number, coppChange?: number);
    setRaw(coin: ShortCoin, val: number): this;
    setPoints(coin: ShortCoin, val: number): this;
    setChange(arr?: any[]): this;
    getRaw(container?: any[]): number[];
    getRaw(container: {}): {
        [K in ShortCoin]: number;
    };
    getPoints(): number;
    getPoints(container: any[]): number[];
    getPoints(container: {}): {
        [K in ShortCoin]: number;
    };
    getChange(container?: any[]): number[];
    getChange(container: {}): {
        [K in ShortCoin]: number;
    };
    copy(): CoinSet;
    /**
     * Returns a new CoinSet using the values from the container.
     * If the container or changer is an array, it must be organized (from lowest index to highest)
     * by Platinum, Gold, Silver, Copper, and it must have a length of 4.
     * Otherwise, outputted object will not be what you want.
     * If the container is an object, it should have the outlined parameters.
     * The parameters should be able to be coerced into numbers without throwing an error
     * (ex. "20" and 20 are both acceptable). Otherwise, all undefined values are set to 0.
     */
    static fromRaw(container: {
        [K in ShortCoin]: any;
    } | any[], changer?: {
        [K in ShortCoin]: any;
    } | any[]): CoinSet;
    logVals(): void;
    applyChange(): this;
    distribute(coppLMin?: number, silvLMin?: number, goldLMin?: number, platLMin?: number): this;
    finalize(): {
        plat: number;
        gold: number;
        silv: number;
        copp: number;
    };
    getFormattedPoints(): string;
    get coins(): Coin[];
    get points(): number;
}
declare function getCurrency(): number[];
declare function runManualDistributor(arr: number[]): void;
