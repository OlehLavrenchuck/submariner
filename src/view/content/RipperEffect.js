import * as PIXI from 'pixi.js';

export default class RipperContainer extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this._displacementSprite = this.addChild(PIXI.Sprite.from('bg_move_1_stage'));
        this._displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this._displacementSprite.anchor.set(0.5);
        this._displacementSprite.delta = 0.5;
        this._displacementSprite.speed = 5;

        this.filters = [new PIXI.DisplacementFilter(this._displacementSprite, 20)];
        app.ticker.add(this._onUpdate, this);
    }

    _onUpdate() {
        this._displacementSprite.x = -this._displacementSprite.delta * this._displacementSprite.speed;
        this._displacementSprite.delta += 0.5;
    }
}
