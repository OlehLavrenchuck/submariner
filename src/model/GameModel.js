import utils from "../helpers/utils";

export default class GameModel {
    constructor() {
        this._balance = 10e3;
        this._bet = 1;
        this._maxBet = 30;
        this._bonusMultiplier = 1.2;
        this._multiplier = 0;
        this._maxMultiplier = 0;
        this._autoTakeMultiplier = 1;
        this._autoTakeMultiplierMax = 10;
        this._maxRoundWin = 0;
        this._autoBet = false;
        this._autoTake = false;
    }

    result() {
        const multipliers = utils.generateMultipliers();
        this._balance -= this._bet;
        this._maxMultiplier = multipliers[~~(multipliers.length * Math.random())];
        this._maxRoundWin = this._bet * this._maxMultiplier;
    }

    update() {
        this._balance += +this._bet * this._multiplier;
    }

    reset() {
        this._multiplier = 0;
        this._maxRoundWin = 0;
        this._maxMultiplier = 0;
    }

    get bonusMultiplier() {
        return this._bonusMultiplier;
    }

    set bonusMultiplier(v) {
        this._bonusMultiplier = v;
    }

    get balance() {
        return this._balance;
    }

    get bet() {
        return this._bet;
    }

    set bet(v) {
        this._bet = v;
    }

    get maxBet() {
        return this._maxBet;
    }

    get multiplier() {
        return this._multiplier;
    }

    set multiplier(v) {
        this._multiplier = v;
    }

    get maxMultiplier() {
        return this._maxMultiplier;
    }

    set maxMultiplier(v) {
        this._maxMultiplier = v;
    }

    get maxRoundWin() {
        return this._maxRoundWin;
    }

    get roundWin() {
        return this.bet * this.multiplier;
    }

    set autoTakeMultiplier(v) {
        this._autoTakeMultiplier = v;
    }

    get autoTakeMultiplier() {
        return this._autoTakeMultiplier;
    }

    get autoTakeMultiplierMax() {
        return this._autoTakeMultiplierMax;
    }

    set autoTake(v) {
        this._autoTake = v;
    }

    get autoTake() {
        return this._autoTake;
    }

    set autoBet(v) {
        this._autoBet = v;
    }

    get autoBet() {
        return this._autoBet;
    }
}