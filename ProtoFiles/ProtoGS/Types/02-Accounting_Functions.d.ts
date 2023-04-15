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
declare function coinClass(): {
    new (platinum?: number, gold?: number, silver?: number, copper?: number, platChange?: number, goldChange?: number, silvChange?: number, coppChange?: number): {
        plat: Coin;
        gold: Coin;
        silv: Coin;
        copp: Coin;
        name: string;
        setRaw(coin: ShortCoin, val: number): any;
        setPoints(coin: ShortCoin, val: number): any;
        setChange(arr?: any[]): any;
        getRaw(container?: any[]): number[];
        getRaw(container: {}): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        getPoints(): number;
        getPoints(container: any[]): number[];
        getPoints(container: {}): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        getChange(container?: any[]): number[];
        getChange(container: {}): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        copy(): any;
        logVals(): void;
        applyChange(): any;
        distribute(coppLMin?: number, silvLMin?: number, goldLMin?: number, platLMin?: number): any;
        finalize(): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        getFormattedPoints(): string;
        readonly coins: Coin[];
        readonly points: number;
    };
    /**
     * Returns a new CoinSet using the values from the container.
     * If the container or changer is an array, it must be organized (from lowest index to highest)
     * by Platinum, Gold, Silver, Copper, and it must have a length of 4.
     * Otherwise, outputted object will not be what you want.
     * If the container is an object, it should have the outlined parameters.
     * The parameters should be able to be coerced into numbers without throwing an error
     * (ex. "20" and 20 are both acceptable). Otherwise, all undefined values are set to 0.
     */
    fromRaw(container: any[] | {
        plat: any;
        gold: any;
        silv: any;
        copp: any;
    }, changer?: any[] | {
        plat: any;
        gold: any;
        silv: any;
        copp: any;
    }): {
        plat: Coin;
        gold: Coin;
        silv: Coin;
        copp: Coin;
        name: string;
        setRaw(coin: ShortCoin, val: number): any;
        setPoints(coin: ShortCoin, val: number): any;
        setChange(arr?: any[]): any;
        getRaw(container?: any[]): number[];
        getRaw(container: {}): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        getPoints(): number;
        getPoints(container: any[]): number[];
        getPoints(container: {}): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        getChange(container?: any[]): number[];
        getChange(container: {}): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        copy(): any;
        logVals(): void;
        applyChange(): any;
        distribute(coppLMin?: number, silvLMin?: number, goldLMin?: number, platLMin?: number): any;
        finalize(): {
            plat: number;
            gold: number;
            silv: number;
            copp: number;
        };
        getFormattedPoints(): string;
        readonly coins: Coin[];
        readonly points: number;
    };
};
declare function getCurrency(): number[];
declare function runManualDistributor(arr: number[]): void;
