import * as PIXI from 'pixi.js';
import {GAME_EVENT} from '../../constants/constants';
import {Spine} from 'pixi-spine';

const ANIMATION = {
    WAIT: 'waiting_bet',
    LEVEL_1: 'idle_s_1',
    TRANSITION_TO_LEVEL_2: 's1to2',
    LEVEL_2: 'idle_s_2',
    TRANSITION_TO_LEVEL_3: 's2to3',
    LEVEL_3: 'idle_s_3',
    TRANSITION_TO_LEVEL_4: 's3to4',
    LEVEL_4: 'idle_s_4',
    CRASH: 'crash',
    COLLECT: 'collects'
};

export default class Submarine extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this.level = 1;
        this.view = this.addChild(new Spine(PIXI.Assets.cache.get('submarine').spineData));
        this._setAnimation(ANIMATION.WAIT);

        this.collectView = this.addChild(new Spine(PIXI.Assets.cache.get('submarine').spineData));
        this.collectView.visible = false;

        app.observer.subscribe(this);
    }

    notify(gameEvent) {
        switch (gameEvent) {
            case GAME_EVENT.BACKGROUND_CHANGE_STAGE: {
                this._upgrade();
                break;
            }
        }
    }

    _setAnimation(name, loop = true) {
        if (this._listener) this._removeListener();
        this.view.state.setAnimation(0, name, loop);
    }
    
    _upgrade() {
        this.level++;
        if (!ANIMATION[`LEVEL_${this.level}`]) return;

        this._setAnimation(ANIMATION[`TRANSITION_TO_LEVEL_${this.level}`], false);
        this._listener = {complete: () => this._onComplete()};
        this.view.state.addListener(this._listener);
    }

    _onComplete() {
        this._setAnimation(ANIMATION[`LEVEL_${this.level}`]);
        this._removeListener();
    }

    _removeListener() {
        this.view.state.removeListener(this._listener);
        this._listener = null;
    }

    play() {
        this._setAnimation(ANIMATION.LEVEL_1);
    }

    lose() {
        this._setAnimation(ANIMATION.CRASH, false);
    }

    collect() {
        this.collectView.state.setAnimation(0, ANIMATION.COLLECT, false);
        this.collectView.visible = true;
    }

    reset() {
        this.level = 1;
        this._setAnimation(ANIMATION.WAIT);
    }
}
