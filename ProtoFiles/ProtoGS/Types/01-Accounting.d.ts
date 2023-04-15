/// <reference types="google-apps-script" />
declare const CoinSet: {
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
declare function accounting(e: GoogleAppsScript.Events.SheetsOnEdit): void;
