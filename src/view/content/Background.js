import * as PIXI from 'pixi.js';
import {GAME_EVENT} from '../../constants/constants';
import SeaCreatures from '../components/SeaCreatures';

const ANIMATION = {
    SPEED: 1,
    LOOP_FROM_LEVEL: 4
};

export default class BackgroundContainer extends PIXI.Container {
    constructor() {
        super();
        this._views = [];
        this._init();
    }

    _init() {
        for (let i = 1; i <= 6; i++) {
            const level = i > 5 ? 5 : i;
            const background = this.addChild(PIXI.Sprite.from(`bg_move_${level}_stage`));
            background.addChild(new SeaCreatures(level));
            background.didEmitAboutStage = false;
            background.level = level;
            background.anchor.set(0.5);
            background.y = background.height * (i - 1) - 4 * (i - 1);
            this._views.push(background);
        }
    }

    _onUpdate() {
        for (let i = 0; i < this._views.length; i++) {
            const view = this._views[i];
            if (view.y < -view.height && i >= ANIMATION.LOOP_FROM_LEVEL) {
                view.y = view.height * 0.97;
            } else {
                view.y -= ANIMATION.SPEED;
            }
            if (!view.didEmitAboutStage && view.y < -view.height * 0.5) {
                view.didEmitAboutStage = true;
                app.observer.notify(GAME_EVENT.BACKGROUND_CHANGE_STAGE, i + 1);
            }
        }
    }

    play() {
        app.ticker.add(this._onUpdate, this);
    }

    stop() {
        app.ticker.remove(this._onUpdate, this);
    }

    reset() {
        this._views
            .sort((a, b) => a.level - b.level)
            .forEach((view, i) => {
                view.y = view.height * i  - i * 4;
                view.didEmitAboutStage = false;
            });
    }
}
