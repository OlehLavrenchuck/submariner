import TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js';

export default class Foreground extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        const background = this.addChild(PIXI.Sprite.from('bg_main'));
        background.anchor.set(0.5);

        const compass = this.addChild(PIXI.Sprite.from('compass_scale'));
        compass.scale.set(0.5);
        compass.rotation = -Math.PI * 0.5;
        compass.anchor.set(0.5);

        const porthole = this.addChild(PIXI.Sprite.from('port_hole'));
        porthole.anchor.set(0.5);

        const logo = this.logo = this.addChild(PIXI.Sprite.from('logo'));
        logo.anchor.set(0.5);
        logo.y = -280;

        new TWEEN.Tween(compass)
            .to({rotation: 0.5}, 20000)
            .easing(TWEEN.Easing.Back.InOut)
            .repeat(Infinity)
            .yoyo(true)
            .start();
    }
}
