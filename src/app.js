import './style/style.css';
import * as PIXI from 'pixi.js';
import Scene from './view/Scene';
import GameController from './controllers/GameController';
import GameObserver from './controllers/GameObserver';
import TWEEN from '@tweenjs/tween.js';
import UI from './ui/UI';
import GameModel from './model/GameModel';
import Loader from './view/Loader';
import Foreground from './view/Foreground';
import SoundController from './controllers/SoundController';
import '@pixi/sound';

class App extends PIXI.Application {
    constructor() {
        super();
        this._addListeners();
        this._onResize();
    }

    async init() {
        this.loader = this.stage.addChild(new Loader(this));
        await this.loader.preload();
        this.foreground = this.stage.addChild(new Foreground());
        await this.loader.load();
        this.model = new GameModel();
        this.observer = new GameObserver();
        this.scene = this.stage.addChildAt(new Scene(), 0);
        this.ui = this.stage.addChildAt(new UI(), this.stage.children.length);
        this.sound = new SoundController();
        this.controller = new GameController(this);
        this._show();
    }

    _show() {
        new TWEEN.Tween(this)
            .to({
                loader: {alpha: 0},
                scene: {alpha: 1},
                ui: {alpha: 1}
            }, 250)
            .start();
    }

    _addListeners() {
        window.addEventListener('resize', () => this._onResize());
        this.ticker.add(() => TWEEN.update());
    }

    _onResize() {
        const {innerWidth: w, innerHeight: h} = window;

        this.renderer.resize(w, h);
        this.stage.scale.set(Math.min(h / this.height, w / this.width));
        this.stage.position.set(w * 0.5, h * 0.45);
    }

    get width() {
        return 500;
    }

    get height() {
        return 800;
    }
}

window.app = new App();
window.onload = () => window.app.init();
document.body.appendChild(window.app.view);

