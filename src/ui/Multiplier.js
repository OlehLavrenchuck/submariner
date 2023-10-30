import {GAME_EVENT} from '../constants/constants';
import utils from '../helpers/utils';
import * as PIXI from 'pixi.js';
import {Tween} from '@tweenjs/tween.js';

export default class Multiplier extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    notify(gameEvent) {
        switch (gameEvent) {
            case GAME_EVENT.BET:
                this._toggleAlpha(1);
                break;
            case GAME_EVENT.LOSE:
            case GAME_EVENT.WIN:
                this._toggleAlpha(0);
                break;
        }
    }

    _init() {
        this.textView = this.addChild(new PIXI.Text('', utils.fontStyle({
            fontSize: 50,
            fill: 0xffffff,
            stroke: 0x000000,
            strokeThickness: 3
        })));
        this.textView.anchor.set(0.5);
        this.textView.alpha = 0;

        app.observer.subscribe(this);
    }

    _toggleAlpha(alpha) {
        new Tween(this.textView)
            .to({alpha}, 150)
            .start();
    }

    updateCounter({multiplier}) {
        this.textView.text = `${multiplier}x`;
    }
}
