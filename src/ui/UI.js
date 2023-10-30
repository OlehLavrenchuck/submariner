import * as PIXI from 'pixi.js';
import Button from './Button';
import AutoTakeWidget from './widgets/AutoTakeWidget';
import BetWidget from './widgets/BetWidget';
import Balance from './Balance';
import Multiplier from './Multiplier';

export default class UI extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this._addButton();
        this._addStakeWidgets();
        this._addBalance();
        this._addMultiplier();

        this.alpha = 0;
        this.scale.set(0.7);
        this.position.y = 300;
    }

    _addStakeWidgets() {
        this.betWidget = this.addChild(new BetWidget({
            startValue: app.model.bet,
            maxValue: app.model.maxBet,
            sign: '$'
        }));
        this.betWidget.position.set(-240, 80);

        this.autoTakeWidget = this.addChild(new AutoTakeWidget({
            startValue: app.model.autoTakeMultiplier,
            maxValue: app.model.autoTakeMultiplierMax,
            sign: 'x'
        }));
        this.autoTakeWidget.position.set(240, 80);
    }

    _addButton() {
        this.button = this.addChild(new Button());
    }

    _addBalance() {
        this.balance = this.addChild(new Balance());
        this.balance.y = 100;
    }

    _addMultiplier() {
        this.multiplier = this.addChild(new Multiplier());
        this.multiplier.y = -600;
    }
}
