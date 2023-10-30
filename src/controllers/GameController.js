import * as PIXI from 'pixi.js';
import {GAME_EVENT, SOUND_EVENT, UI_EVENT} from '../constants/constants';
import MultiplierCounter from './MultiplierCounter';

const STATE = {
    BET: 'STATE.BET',
    TAKE: 'STATE.TAKE',
    WAITING: 'STATE.WAITING'
};

export default class GameController extends PIXI.utils.EventEmitter {
    constructor({model, scene, ui, observer, sound}) {
        super();
        this.ui = ui;
        this.scene = scene;
        this.model = model;
        this.sound = sound;
        this.multiplierCounter = new MultiplierCounter(this.model);
        this.observer = observer;
        this.observer.subscribe(this);
        this.state = STATE.BET;
        this._addListeners();
    }

    _addListeners() {
        this.multiplierCounter.listenAutoTake(this._take, this);
        this.multiplierCounter.listenLose(this._lose, this);
        this.multiplierCounter.listenBonus(this._bonus, this);
        this.multiplierCounter.listenCounter(this.ui.button.updateCounter, this.ui.button);
        this.multiplierCounter.listenCounter(this.ui.multiplier.updateCounter, this.ui.multiplier);
    }

    notify(gameEvent, props) {
        switch (gameEvent) {
            case UI_EVENT.BET:
                this._bet();
                break;
            case UI_EVENT.TAKE:
                this._take();
                break;
            case UI_EVENT.BET_INCREASE:
            case UI_EVENT.BET_DECRASE:
                this._setModelBet(props);
                break;
            case UI_EVENT.AUTO_BET:
                this._setModelAutoBet(props);
                break;
            case UI_EVENT.AUTO_TAKE_INCREASE:
            case UI_EVENT.AUTO_TAKE_DECRASE:
                this._setModelTakeMultiplier(props);
                break;
            case UI_EVENT.AUTO_TAKE:
                this._setModelAutoTake(props);
                break;
        }

        this.sound.emit(gameEvent);
    }

    _bet() {
        if (this.state !== STATE.BET) return;
        this.state = STATE.TAKE;

        this.model.result();
        this.scene.play();
        this.multiplierCounter.start();
        this.observer.notify(GAME_EVENT.BET);
    }

    async _take() {
        if (this.state !== STATE.TAKE) return;
        this.state = STATE.WAITING;
        this.sound.emit(GAME_EVENT.TOGGLE_FADE_MAIN_SOUND, 0);

        this.multiplierCounter.stop();
        this.model.update();
        this.observer.notify(GAME_EVENT.WIN);

        this.scene.bubbleEffect.stop();
        this.scene.ballon.reset();

        this.scene.background.stop();
        await this.scene.frogman.show();

        this.sound.emit(SOUND_EVENT.TRANSITION_CLOSE);
        await this.scene.transition.close();

        this.sound.emit(SOUND_EVENT.POPUP_WIN);
        await this.scene.popup.win(this.model.roundWin);
        await this._reset();
    }

    async _lose() {
        this.state = STATE.WAITING;
        this.sound.emit(GAME_EVENT.TOGGLE_FADE_MAIN_SOUND, 0);

        this.observer.notify(GAME_EVENT.LOSE);
        this.scene.ballon.reset();
        this.scene.background.stop();
        this.scene.bubbleEffect.stop();

        this.scene.submarine.lose();
        await this.scene.mine.show();

        this.sound.emit(SOUND_EVENT.TRANSITION_CLOSE);
        await this.scene.transition.close();

        this.sound.emit(SOUND_EVENT.POPUP_LOSE);
        await this.scene.popup.lose();
        await this._reset();
    }

    async _reset() {
        this.model.reset();
        this.scene.reset();
        this.scene.popup.hide();

        this.sound.emit(GAME_EVENT.TOGGLE_FADE_MAIN_SOUND, 1);
        this.sound.emit(SOUND_EVENT.TRANSITION_OPEN);
        await this.scene.transition.open();

        this.state = STATE.BET;
        this.observer.notify(GAME_EVENT.RESET);

        if (this.model.autoBet) {
            this.observer.notify(UI_EVENT.BET);
        }
    }

    _bonus() {
        this.scene.ballon.show().then(() => {
            this.multiplierCounter.addBonus();
            this.scene.submarine.collect();
            this.sound.emit(SOUND_EVENT.BALLON);
        });
    }

    _setModelAutoBet(auto) {
        this.model.autoBet = auto;
        if (auto) {
            this._bet();
        }
    }

    _setModelBet(bet) {
        this.model.bet = bet;
    }

    _setModelAutoTake(auto) {
        this.model.autoTake = auto;
    }

    _setModelTakeMultiplier(autoTakeMultiplier) {
        this.model.autoTakeMultiplier = autoTakeMultiplier;
    }
}
