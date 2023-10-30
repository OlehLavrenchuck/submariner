import * as PIXI from 'pixi.js';
import Submarine from './components/Submarine';
import Background from './content/Background';
import RipperEffect from './content/RipperEffect';
import Transition from './content/Transition';
import BubbleEffect from './content/BubbleEffect';
import Mine from './components/Mine';
import ResultPopup from './content/ResultPopup';
import Ballon from './components/Ballon';
import Frogman from './components/Frogman';

export default class Scene extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this.scale.set(0.5);
        this.alpha = 0;

        this.ripperEffect = this.addChild(new RipperEffect());
        this.background = this.ripperEffect.addChild(new Background());

        this.frogman = this.ripperEffect.addChild(new Frogman());
        this.submarine =  this.ripperEffect.addChild(new Submarine());

        this.bubbleEffect = this.ripperEffect.addChild(new BubbleEffect());
        this.mine = this.ripperEffect.addChild(new Mine());
        this.ballon = this.ripperEffect.addChild(new Ballon());

        this.transition = this.addChild(new Transition());
        this.popup = this.addChild(new ResultPopup());
    }

    play() {
        this.submarine.play();
        this.bubbleEffect.play();
        this.background.play();
    }

    reset() {
        this.background.reset();
        this.submarine.reset();
        this.bubbleEffect.reset();
        this.mine.reset();
    }
}
