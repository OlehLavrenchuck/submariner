import * as PIXI from 'pixi.js';
import {sound} from '@pixi/sound';
import {GAME_EVENT, SOUND_EVENT, UI_EVENT} from '../constants/constants';

export default class SoundController extends PIXI.utils.EventEmitter {
    constructor() {
        super();
        document.body.addEventListener('click', () => this._init(), {once: true});
    }

    _init() {
        this.on(UI_EVENT.AUTO_TAKE_DECRASE, this._playIncreaseAndDecrease, this);
        this.on(UI_EVENT.AUTO_TAKE_INCREASE, this._playIncreaseAndDecrease, this);
        this.on(UI_EVENT.BET_DECRASE, this._playIncreaseAndDecrease, this);
        this.on(UI_EVENT.BET_INCREASE, this._playIncreaseAndDecrease, this);
        this.on(UI_EVENT.AUTO_BET, this._playAutoTakeAndBet, this);
        this.on(UI_EVENT.AUTO_TAKE, this._playAutoTakeAndBet, this);
        
        this.on(SOUND_EVENT.TRANSITION_OPEN, this._playTransitionOpen, this);
        this.on(SOUND_EVENT.TRANSITION_CLOSE, this._playTransitionClose, this);
        this.on(SOUND_EVENT.POPUP_WIN, this._playPopupWin, this);
        this.on(SOUND_EVENT.POPUP_LOSE, this._playPopupLose, this);
        this.on(SOUND_EVENT.BALLON, this._playBallon, this);
        
        this.on(GAME_EVENT.WIN, this._playTake, this);
        this.on(GAME_EVENT.LOSE, this._playLose, this);
        this.on(GAME_EVENT.BET, this._playBet, this);

        sound.play('bg_main_theme', {loop: true});
    }

    _playIncreaseAndDecrease() {
        sound.play('increase_decrease_button');
    }

    _playTake() {
        sound.play('take');
    }

    _playBet() {
        sound.play('make_bet');
    }

    _playAutoTakeAndBet() {
        sound.play('autobet_button');
    }

    _playTransitionOpen() {
        sound.play('transition_open');
    }

    _playTransitionClose() {
        sound.play('transition_close');
    }

    _playPopupWin() {
        sound.play('pop_up_you_won');
    }

    _playPopupLose() {
        sound.play('pop_up_crash');
    }

    _playBallon() {
        sound.play('bonus');
    }

    _playLose() {
        sound.play('crash');
    }
}