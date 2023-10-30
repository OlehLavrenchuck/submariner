import {Spine} from 'pixi-spine';
import TWEEN from '@tweenjs/tween.js';
import {waitPromise} from 'util.wait';
import * as PIXI from 'pixi.js';

export default class Mine extends Spine {
    constructor() {
        super(PIXI.Assets.cache.get('bonus_mine').spineData);
        this.autoUpdate = false;
        this.visible = false;
        this.alpha = 0;
    }

    show() {
        this.state.setAnimation(0, 'mine_expl', true);
        this.autoUpdate = true;
        this.visible = true;

        this.tw = new TWEEN.Tween(this)
            .to({alpha: 1}, 250)
            .start();

        return waitPromise(2);
    }

    reset() {
        this.autoUpdate = false;
        this.visible = false;
        this.alpha = 0;

        if (this.tw) {
            TWEEN.remove(this.tw);
            this.tw = null;
        }
    }
}
