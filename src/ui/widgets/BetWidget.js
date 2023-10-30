import StakeWidget from './StakeWidget';
import {UI_EVENT} from '../../constants/constants';

export default class BetWidget extends StakeWidget {
    onLeftTap() {
        super.onLeftTap(UI_EVENT.BET_DECRASE);
    }

    onRightTap() {
        super.onRightTap(UI_EVENT.BET_INCREASE);
    }

    onAutoActionTap() {
        super.onAutoActionTap(UI_EVENT.AUTO_BET);
    }
}
