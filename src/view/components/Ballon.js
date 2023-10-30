import {Spine} from 'pixi-spine';
import TWEEN, { Tween } from '@tweenjs/tween.js';
import utils from '../../helpers/utils';
import * as PIXI from 'pixi.js';

const START_POS_Y = 500;

const ANIMATION = {
    IDLE: 'ballon_idle',
    COLLECT: 'ballon_bonus'
};

export default class Ballon extends Spine {
    constructor() {
        super(PIXI.Assets.cache.get('bonus_mine').spineData);;
        this._init();
    }

    _init() {
        this.reset();

        this._listener = {complete: ({animation}) => {
            if (animation.name === ANIMATION.COLLECT) {
                this.reset();
            }
        }};
        this.state.addListener(this._listener);
    }

    show() {
        this.position.y = START_POS_Y;
        this.state.setAnimation(0, ANIMATION.IDLE, true);
        this.autoUpdate = true;
        this.visible = true;
        this.alpha = 1;
        this.isCollect = false;    

        this.collectTw = new TWEEN.Tween(this)
            .to({y: -150}, 2500)
            .onUpdate(({y}) => {
                if (y < 160 && !this.isCollect) {
                    this.collect();
                    deferred.resolve();
                }
            })
            .start();

        const deferred = utils.deferred();
        return deferred.promise;
    }

    collect() {
        this.isCollect = true;
        this.state.setAnimation(0, ANIMATION.COLLECT, false);
        this.hide();
    }

    hide() {
        new Tween(this)
            .to({alpha: 0}, 300)
            .delay(500)
            .start();
    }

    reset() {
        this.autoUpdate = false;
        this.visible = false;

        if (this.collectTw) {
            TWEEN.remove(this.collectTw);
            this.collectTw = null;
        }
    }
}