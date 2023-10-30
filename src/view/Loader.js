import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';
import manifest from '../../manifest.json';
import utils from '../helpers/utils';

export default class Loader extends PIXI.Container {
    async preload() {
        await PIXI.Assets.init({manifest});
        await PIXI.Assets.loadBundle('intro');
    }
    
    async load() {
        this._deferred = utils.deferred();
        this._currProgress = 0;
        this._needProgress = 0;
        this._speedProgress = 0.01;
        this._initView();
        this._toggleTickerUpdate(true);

        await PIXI.Assets.loadBundle('main', p => this._needProgress = p);
        await this._deferred.promise;
    }

    _initView() {
        this.scale.set(0.5);

        const background = this.addChild(PIXI.Sprite.from('back_loading_screen'));
        background.anchor.set(0.5);

        this.loadingView = this.addChild(new Spine(PIXI.Assets.cache.get('loading_screen').spineData));
        this.loadingView.state.setAnimation(0, 'water_level', true);
        this.loadingView.startY = 1000;
        this.loadingView.y = this.loadingView.startY;

        this.textView = this.addChild(new PIXI.Text('', utils.fontStyle({
            fontSize: 70,
            fill: 0xffffff,
            stroke: 0x000000, 
            strokeThickness: 3
        })));
        this.textView.anchor.set(0.5);
    }

    _toggleTickerUpdate(start) {
        if (start) {
            app.ticker.add(this._onSmoothLoading, this);
        } else {
            app.ticker.remove(this._onSmoothLoading, this);
        }
    }

    _updateView() {
        this.loadingView.y = this.loadingView.startY - this.loadingView.startY * this._currProgress;
        this.textView.text = (this._currProgress * 100).toFixed(0) + '%';
    }

    _onSmoothLoading() {
        if (this._currProgress >= 1) {
            this._deferred.resolve();
            this._toggleTickerUpdate(false);
        }
        if (this._needProgress > this._currProgress) {
            this._currProgress += this._speedProgress;
            this._updateView();
        }
    }
}

