import { Spine } from 'pixi-spine';
import * as PIXI from 'pixi.js';

const AMOUNT_TYPES = 7;

const SWIM_BOUNDS = {
    MAX_WIDTH: 1000,
    MAX_HEIGHT: 800
};

export default class SeaCreatures extends PIXI.Container {
    constructor(level) {
        super();
        this.views = [];
        this._init(level);
    }

    _init(level) {
        this.pivot.set(
            SWIM_BOUNDS.MAX_WIDTH * 0.5,
            SWIM_BOUNDS.MAX_HEIGHT * 0.5
        );
        this._addCreatures(level);
        this._addAnimation(level);
    }

    _addCreatures(level) {
        level = level > 4 ? 4 : level;
        let accumType = 1;
        let direction = 1;

        while (this.views.length !== AMOUNT_TYPES) {
            let textureName = `f_${accumType}_s_${level}`;

            if (!PIXI.Assets.cache.has(textureName)) {
                textureName = `f_3_s_${level}`;
            }

            const creature = this.addChild(new Spine(PIXI.Assets.cache.get(textureName).spineData));
            creature.scale.set(0.6);
            creature.state.setAnimation(0, 'animation', true);  
            creature.direction = direction
            creature.scale.x *= creature.direction;
            creature.x = Math.random() * SWIM_BOUNDS.MAX_WIDTH;
            creature.y = accumType * 100;

            this.views.push(creature);

            direction *= -1;
            accumType = accumType <= AMOUNT_TYPES ? ++accumType : 1;
        }
    }

    _addAnimation() {
        app.ticker.add(this._onUpdate, this);
    }

    _onUpdate() {
        for (let i = 0; i < this.views.length; i++) {
            const creature =  this.views[i];
            creature.x += creature.direction;

            if (creature.position.x < 0 || creature.position.x > SWIM_BOUNDS.MAX_WIDTH) {
                creature.direction *= -1;
            }

            if (creature.scale.x > 0 && creature.direction < 0 || creature.scale.x < 0 && creature.direction > 0) {
                creature.scale.x *= -1;
            }
        }
    }
}
