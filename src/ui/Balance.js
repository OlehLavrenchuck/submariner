import * as PIXI from 'pixi.js';
import {GAME_EVENT} from '../constants/constants';
import utils from '../helpers/utils';

export default class Balance extends PIXI.Container {
    constructor() {
        super();
        this._init();
        this._updateView();
    }

    notify(gameEvent) {
        switch (gameEvent) {
            case GAME_EVENT.BET:
            case GAME_EVENT.WIN:
                this._updateView();
                break;
        }
    }

    _init() {
        const background =  this.addChild(PIXI.Sprite.from('balance'));
        background.anchor.set(0.5);

        this.textView = this.addChild(new PIXI.Text('', utils.fontStyle({fontSize: 40})));
        this.textView.anchor.set(0.5);
        this.textView.y = 3;

        app.observer.subscribe(this);
    }

    _updateView() {
        this.textView.text = `${new Intl.NumberFormat('en-US').format(app.model.balance)}$`;
    }
}
