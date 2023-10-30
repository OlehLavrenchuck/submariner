import StakeWidget from './StakeWidget';
import {UI_EVENT} from '../../constants/constants';

export default class AutoTakeWidget extends StakeWidget {
    onLeftTap() {
        super.onLeftTap(UI_EVENT.AUTO_TAKE_DECRASE);
    }

    onRightTap() {
        super.onRightTap(UI_EVENT.AUTO_TAKE_INCREASE);
    }

    onAutoActionTap() {
        super.onAutoActionTap(UI_EVENT.AUTO_TAKE);
    }
}
