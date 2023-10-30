import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import utils from '../../helpers/utils';

const ANIMATION = {
    OPEN: 'out',
    CLOSE: 'in'
};

export default class Transition extends Spine {
    constructor() {
        super(PIXI.Assets.cache.get('transition').spineData);
        this._toggleUpdateView(false);
        this._addListener();
    }

    _toggleUpdateView(value) {
        this.autoUpdate = value;
        this.visible = value;
    }
    
    _addListener() {
        this.state.addListener({
            start: entry => {
                if (entry?.animation.name === ANIMATION.CLOSE) {
                    this._toggleUpdateView(true);
                }
            },
            complete: entry => {
                if (entry?.animation.name === ANIMATION.CLOSE.OPEN) {
                    this._toggleUpdateView(false);
                }
                if (this._deferred) {
                    this._deferred.resolve();
                }
            }
        });
    }

    open() {
        this._deferred = utils.deferred();
        this.state.setAnimation(0, ANIMATION.OPEN, false);
        return this._deferred.promise;
    }

    close() {
        this._deferred = utils.deferred();
        this.state.setAnimation(0, ANIMATION.CLOSE, false);
        return this._deferred.promise;
    }
}