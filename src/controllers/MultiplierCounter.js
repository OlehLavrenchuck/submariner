export default class MultiplierCounter {
    constructor(model) {
        this.model = model;
        this._listeners = {
            autoTake: [],
            counter: [],
            lose: [],
            bonus: []
        };
    }

    listenAutoTake(cb, ctx) {
        this._listeners.autoTake.push(cb.bind(ctx));
    }

    listenLose(cb, ctx) {
        this._listeners.lose.push(cb.bind(ctx));
    }

    listenCounter(cb, ctx) {
        this._listeners.counter.push(cb.bind(ctx));
    }

    listenBonus(cb, ctx) {
        this._listeners.bonus.push(cb.bind(ctx));
    }

    addBonus() {
        this.counterInfo.current += this.model.bonusMultiplier;
    }

    start() {
        this.counterInfo = this._counterInfo();
        this.counterInfo.bonuses = this._generateBonusesForRound();
        app.ticker.add(this._onUpdate, this);
    }

    stop() {
        app.ticker.remove(this._onUpdate, this);
    }

    _onUpdate() {
        if (this.counterInfo.current <= this.counterInfo.max) {
            this.counterInfo.current += this.counterInfo.speed;
            this.model.multiplier = +this.counterInfo.current.toFixed(1);

            if (this.counterInfo.bonuses.length) this._tryEmitBonus();

            const roundWin = (this.model.bet * this.counterInfo.current).toFixed(1);
            this._listeners.counter.forEach(cb => cb({
                roundWin: roundWin,
                multiplier: this.model.multiplier
            }));
        } else {
            this.stop();
            this._listeners.lose.forEach(cb => cb());
        }

        if (this.model.autoTake && this.model.autoTakeMultiplier <= this.model.multiplier) {
            this.stop();
            this._listeners.autoTake.forEach(cb => cb());
        }
    }

    _counterInfo() {
        return {
            current: 0,
            max: this.model.maxMultiplier,
            speed: 0.002,
            bonuses: []
        };
    }

    _generateBonusesForRound() {
        const multiplier = this.model.bonusMultiplier;
        const count = ~~(this.model.maxMultiplier / this.model.bonusMultiplier / 2);
        const result = [];

        for (let i = 0; i < count; i++) {
            result.push(
                {
                    multiplier: this.model.bonusMultiplier,
                    emitOnMultiplier: Math.random() * (i + 1) + (i * multiplier * 3) // God of random
                }
            );
        }

        return result;
    }

    _tryEmitBonus() {
        const bonus = this.counterInfo.bonuses.find(({emitOnMultiplier}) => emitOnMultiplier <= this.counterInfo.current);
        if (bonus) {
            const index = this.counterInfo.bonuses.indexOf(bonus);
            this.counterInfo.bonuses.splice(index, 1);
            this._listeners.bonus.forEach(cb => cb());
        }
    }
}
