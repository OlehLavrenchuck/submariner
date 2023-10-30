import * as PIXI from 'pixi.js';
import {GAME_EVENT, UI_EVENT} from '../constants/constants';
import utils from '../helpers/utils';

const config = {
    bet: {
        texture: 'button',
        text: 'MAKE BET',
        style: utils.fontStyle({fontSize: 40})
    },
    take: {
        texture: 'button_take',
        text: 'TAKE',
        style: utils.fontStyle({fontSize: 32})
    },
    hold: {
        texture: 'button_disable',
        text: 'WAITING',
        style: utils.fontStyle({fontSize: 40})
    },
};

const BUTTON_STATE = {
    READY_BET: 'BUTTON_STATE.READY_BET',
    READY_TAKE: 'BUTTON_STATE.READY_TAKE',
    HOLD: 'BUTTON_STATE.HOLD'
};

export default class Button extends PIXI.Container {
    constructor() {
        super();
        this.state = null;
        this._init();
        this._setReadyBetState();
    }

    notify(gameEvent) {
        switch (gameEvent) {
            case GAME_EVENT.BET:
                this._setReadyTakeState();
                break;
            case GAME_EVENT.RESET:
                this._setReadyBetState();
                break;
            case GAME_EVENT.LOSE:
                this._setHoldState();
                break;
            case GAME_EVENT.WIN:
                this._setHoldState();
                break;
        }
    }

    updateCounter({roundWin}) {
        this.counterView.text = `${roundWin}$`;
    }

    _init() {
        this.buttonView = this.addChild(new PIXI.Sprite());
        this.buttonView.eventMode = 'static';
        this.buttonView.anchor.set(0.5);
        this.buttonView.on('pointerdown', this._onPointerdown, this);
        this.buttonView.effectPressButton = utils.effectPressButton(this);

        this.textView = this.addChild(new PIXI.Text('', {fontFamily: 'bebas'}));
        this.textView.anchor.set(0.5);
        this.textView.y = -10;

        this.counterView = this.addChild(new PIXI.Text('', utils.fontStyle({fontSize: 32})));
        this.counterView.anchor.set(0.5);
        this.counterView.visible = false;
        this.counterView.y = -30;

        app.observer.subscribe(this);
    }

    _onPointerdown() {
        switch (this.state) {
            case BUTTON_STATE.READY_BET:
                app.observer.notify(UI_EVENT.BET);
                break;
            case BUTTON_STATE.READY_TAKE:
                app.observer.notify(UI_EVENT.TAKE);
                break;
        }
    }

    _setReadyTakeState() {
        this.state = BUTTON_STATE.READY_TAKE;
        this.counterView.visible = true;
        this.buttonView.texture = PIXI.Assets.cache.get(config.take.texture);
        this.buttonView.effectPressButton();
        this.textView.text = config.take.text;
        this.textView.y *= -1;
        Object.assign(this.textView.style, config.take.style);
    }

    _setReadyBetState() {
        this.state = BUTTON_STATE.READY_BET;
        this.buttonView.texture = PIXI.Assets.cache.get(config.bet.texture);
        this.textView.text = config.bet.text;
        Object.assign(this.textView.style, config.bet.style);
    }

    _setHoldState() {
        this.state = BUTTON_STATE.HOLD;
        this.counterView.visible = false;
        this.buttonView.texture = PIXI.Assets.cache.get(config.hold.texture);
        this.buttonView.effectPressButton();
        this.textView.text = config.hold.text;
        this.textView.y *= -1;
        Object.assign(this.textView.style, config.hold.style);
    }
}
