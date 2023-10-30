import TWEEN from '@tweenjs/tween.js';
import {Spine} from 'pixi-spine';
import * as PIXI from 'pixi.js';
import utils from '../../helpers/utils';

const ANIMATION = {
    WIN: 'you_won',
    LOSE: 'crash'
};

export default class ResultPopup extends PIXI.Container {
    constructor() {
        super();
        this._init();
    }

    _init() {
        this.popupView = this.addChild(new Spine(PIXI.Assets.cache.get('pop_up').spineData));
        this.popupView.state.addListener({
            start: () => {
                this._toggleUpdateView(true);
            },
            complete: () => {
                if (this._deferred) {
                    this._deferred.resolve();
                }
            }
        });
        this.textView = this.addChild(this._createText());
        this._toggleUpdateView(false);
    }

    _createText() {
        const text = this.addChild(new PIXI.Text('', utils.fontStyle({
            fill: 0xffffff,
            fontSize: 70
        })));
        text.scale.set(1.9);
        text.anchor.set(0.5);
        text.alpha = 0;
        text.y = 50;
        
        text.show = () => new TWEEN.Tween(text)
            .to({alpha: 1}, 200)
            .start();
        
        text.hide = () => new TWEEN.Tween(text)
            .to({alpha: 0}, 200)
            .start();

        return text;
    }

    _toggleUpdateView(value) {
        this.popupView.autoUpdate = value;
        this.popupView.visible = value;
    }
    
    win(result) {
        this.textView.show();
        this.textView.text = result.toFixed(1) + '$';
        this.popupView.state.setAnimation(0, ANIMATION.WIN, false);
        this._deferred = utils.deferred();
        return this._deferred.promise;
    }

    lose() {
        this.popupView.state.setAnimation(0, ANIMATION.LOSE, false);
        this._deferred = utils.deferred();
        return this._deferred.promise;
    }

    hide() {
        this.textView.hide();

        const tw = new TWEEN.Tween(this.popupView)
            .to({alpha: 0}, 300)
            .onComplete(() => {
                this._toggleUpdateView(false);
                this.popupView.alpha = 1;
                TWEEN.remove(tw);
            })
            .start();
    }
}
