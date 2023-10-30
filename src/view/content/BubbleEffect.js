import { Spine } from 'pixi-spine';
import * as PIXI from 'pixi.js';

export default class BubbleEffect extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this.view = this.addChild(new Spine(PIXI.Assets.cache.get('bg_animations').spineData));
        this.view.visible = false;
    }

    play() {
        this.view.state.setAnimation(0, 'animation', true);
        this.view.autoUpdate = true;
        this.view.visible = true;
    }

    stop() {
        this.view.autoUpdate = false;
    }

    reset() {
        this.view.visible = false;
        this.view.skeleton.setToSetupPose();
        this.view.state.tracks = [];
    }
}