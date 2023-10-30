import * as PIXI from 'pixi.js';
import {GAME_EVENT} from '../../constants/constants';
import utils from '../../helpers/utils';

export default class StakeWidget extends PIXI.Container {
    constructor(config = {}) {
        super();
        this.init(config);
    }

    init(config) {
        const {startValue, maxValue, sign} = config;

        this.currValue = startValue;
        this.maxValue = maxValue;
        this.signValue = sign;
        this.autoAction = false;

        this.stake = this.addChild(PIXI.Sprite.from('stake'));
        this.stake.anchor.set(0.5);
        this.textView = this.stake.addChild(this.createText(`${this.currValue}${this.signValue}`, {fontSize: 40}));

        this.rightButton = this.createButton('button_stake', this.onRightTap);
        this.rightButton.x = 80;
        let text = this.rightButton.addChild(this.createText('+', {fontSize: 60}));
        text.position.y = 2;

        this.leftButton = this.createButton('button_stake', this.onLeftTap);
        this.leftButton.x = -80;
        text = this.leftButton.addChild(this.createText('-', {fontSize: 60}));
        text.position.y = 2;

        this.autoActionButton = this.createButton('autotake_bet', this.onAutoActionTap);
        this.autoActionButton.y = -65;
        text = this.autoActionButton.addChild(this.createText('AUTO', {fontSize: 25}));
        text.position.y = 2;

        app.observer.subscribe(this);
    }

    notify(gameEvent) {
        switch (gameEvent) {
            case GAME_EVENT.BET:
                this.toggleButtonAccess(false);
                break;
            case GAME_EVENT.RESET:
                this.toggleButtonAccess(true);
                break;
        }
    }

    createText(stroke, style) {
        const text = new PIXI.Text(stroke, utils.fontStyle(style));
        text.anchor.set(0.5);
        return text;
    }

    createButton(textureName, onPointerdown) {
        const button = this.addChild(PIXI.Sprite.from(textureName));
        button.eventMode = 'static';
        button.anchor.set(0.5);

        if (onPointerdown) {
            button.effectPressButton = utils.effectPressButton(button);
            button.on('pointerdown', onPointerdown, this);
        }

        return button;
    }

    onLeftTap(event) {
        if (this._disabled) return;

        this.currValue = this.currValue > 1 ? (this.currValue - 1) : 1;
        this.updateView();
        this.leftButton.effectPressButton();

        app.observer.notify(event, this.currValue);
    }

    onRightTap(event) {
        if (this._disabled) return;

        this.currValue = this.currValue < this.maxValue ? (this.currValue + 1) : this.maxValue;
        this.updateView();
        this.rightButton.effectPressButton();

        app.observer.notify(event, this.currValue);
    }

    onAutoActionTap(event) {
        if (this.autoAction) {
            this.autoActionButton.texture = PIXI.Assets.cache.get('autotake_bet');
        } else {
            this.autoActionButton.texture = PIXI.Assets.cache.get('autotake_bet_active');
        }

        this.autoAction = !this.autoAction;
        this.autoActionButton.effectPressButton();

        app.observer.notify(event, this.autoAction);
    }

    updateView() {
        this.textView.text = `${this.currValue}${this.signValue}`;
    }

    toggleButtonAccess(access = true) {
        this._disabled = !access;
        const suffix = access ? '' : '_disable';
        this.stake.texture = PIXI.Assets.cache.get(`stake${suffix}`);
        this.rightButton.texture = PIXI.Assets.cache.get(`button_stake${suffix}`);
        this.leftButton.texture = PIXI.Assets.cache.get(`button_stake${suffix}`);
    }
}
