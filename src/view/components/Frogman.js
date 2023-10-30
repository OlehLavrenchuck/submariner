import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import utils from '../../helpers/utils';

export default class Frogman extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this.view = this.addChild(new Spine(PIXI.Assets.cache.get('frogman').spineData));
        this.view.state.addListener({
            start: () => {
                this._toggleUpdateView(true);
                this._deferred = utils.deferred();
            },
            complete: () => {
                this._toggleUpdateView(false);
                this._deferred?.resolve();
            }
        });
        this._toggleUpdateView(false);
    }

    _toggleUpdateView(value) {
        this.view.autoUpdate = value;
        this.view.visible = value;
    }

    show() {
        this.view.state.setAnimation(0, 'animation', false);
        return this._deferred.promise;
    }
}
