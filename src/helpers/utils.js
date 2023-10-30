import TWEEN from "@tweenjs/tween.js";

export default {
    deferred: () => {
        const deferred = Object.create(null);
        deferred.resolve = null;
        deferred.promise = new Promise(r => deferred.resolve = r);
        return deferred;
    },

    fontStyle: style => {
        return {
            fontFamily: 'bebas',
            fill: 0x000000,
            stroke: 0xffffff,
            strokeThickness: 1,
            ...style
        };
    },

    generateMultipliers: () => {
        const array = [];
        let i = 1;
    
        while (array.length !== 20) {
            i = i >= 7 ? 1 : ++i;
            const multiplier = (Math.random() * i + i).toFixed(1);
            array.push(+multiplier);
        }

        return  array.sort(() => Math.random() > 0.5);
    },

    effectPressButton: button => {
        let defaultScale = button.scale.x;
        let tw = null;
        return () => {
            const scale = defaultScale - 0.05;
            button.scale.set(defaultScale);

            if (tw) {
                tw.stop();
                TWEEN.remove(tw);
            }

            tw = new TWEEN.Tween(button)
                .to({scale: {x: scale, y: scale}}, 100)
                .easing(TWEEN.Easing.Bounce.InOut)
                .repeat(1)
                .yoyo(true)
                .start();
        }
    } 
}
