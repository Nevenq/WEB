// Отвечает является ли карта уткой.
import Card from './Card.js'
import Game from './Game.js'
import {setSpeedRate as setGameSpeedRate} from './SpeedRate.js';
import TaskQueue from './TaskQueue.js'

function isDuck(card) {
    return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}

class Creature extends Card {
    set currentPower(value) {
        if (value > this.maxPower)
            value = this.maxPower;
        this._currentPower = value;
    }

    get currentPower() {
        return this._currentPower;
    }

    constructor(name, maxPower, image) {
        super(name, maxPower, image);
    }

    getDescriptions() {
        let arr = super.getDescriptions();
        arr.unshift(getCreatureDescription(this));
        return arr;
    }

}

// Основа для утки.
class Duck extends Creature {
    constructor(name = 'Мирная утка', maxPower = 2, image = 'sheriff.png') {
        super(name, maxPower, image);
        this.quacks = function () {
            console.log('quack')
        };
        this.swims = function () {
            console.log('float: both;');
        };
    }
}


// Основа для собаки.
class Dog extends Creature {
    constructor(name = 'Пёс-бандит', maxPower = 3, image = 'bandit.png') {
        super(name, maxPower, image);
        this.swims = function () {
            console.log('float: none;')
        };
    }
}

class Lad extends Dog {
    constructor() {
        super('Браток', 2);
    }

    static get inGameCount() {
        return Lad._inGameCount || 0;
    }

    static set inGameCount(value) {
        Lad._inGameCount = value;
    }

    static getBonus() {
        return Lad.inGameCount * (Lad.inGameCount + 1) / 2;
    }

    getDescriptions() {
        let arr = super.getDescriptions();
        if (Lad.prototype.hasOwnProperty('modifyDealedDamageToCreature'))
            arr.unshift('Чем их больше, тем они сильнее!');
        return arr;
    }

    doAfterComingIntoPlay(gameContext, continuation) {
        Lad.inGameCount++;
        continuation();
    };

    doBeforeRemoving(continuation) {
        Lad.inGameCount--;
        continuation();
    };

    modifyDealedDamageToCreature(value, toCard, gameContext, continuation) {
        this.view.signalAbility(() => {
            continuation(value + Lad.getBonus());
        });
    };

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        this.view.signalAbility(() => {
            continuation(value - Lad.getBonus());
        });
    };
}

class Rogue extends Creature {
    constructor() {
        super('Изгой', 2);
    }

    doBeforeAttack(gameContext, continuation) {
        const {oppositePlayer, position} = gameContext;
        const card = Object.getPrototypeOf(oppositePlayer.table[position]);
        this.view.signalAbility(() => {
            if (card.hasOwnProperty('modifyDealedDamageToCreature')) {
                this.modifyDealedDamageToCreature = card.modifyDealedDamageToCreature;
                delete card.modifyDealedDamageToCreature;
            }
            if (card.hasOwnProperty('modifyDealedDamageToPlayer')) {
                this.modifyDealedDamageToPlayer = card.modifyDealedDamageToPlayer;
                delete card.modifyDealedDamageToPlayer;
            }
            if (card.hasOwnProperty('modifyTakenDamage')) {
                this.modifyTakenDamage = card.modifyTakenDamage;
                delete card.modifyTakenDamage;
            }
            gameContext.updateView();
            continuation();
        });
    };
}

class Brewer extends Duck {
    constructor() {
        super('Пивовар', 2);
    }

    doBeforeAttack(gameContext, continuation) {
        const tasks = new TaskQueue();
        const {currentPlayer, oppositePlayer, position, updateView} = gameContext;
        tasks.push(onDone => this.view.signalAbility(onDone));
        currentPlayer.table.concat(oppositePlayer.table)
            .filter(x => isDuck(x))
            .forEach(x => {
                tasks.push(onDone => {
                    x.maxPower++;
                    x.currentPower += 2;
                    x.view.signalHeal(onDone);
                    x.updateView();
                });
            });
        tasks.push(onDone => continuation(onDone));
    };
}

class Nemo extends Creature {
    constructor() {
        super('Немо', 4);
    }

    doBeforeAttack(gameContext, continuation) {
        const tasks = new TaskQueue();
        const {oppositePlayer, position} = gameContext;
        const card = Object.getPrototypeOf(oppositePlayer.table[position]);
        tasks.push(onDone => this.view.signalAbility(onDone));
        tasks.push(onDone => {
            delete this.doBeforeAttack;
            Object.setPrototypeOf(this, card);
            this.updateView();
            this.doBeforeAttack(gameContext, onDone);
        });
        tasks.push(onDone => continuation(onDone));
    };

}

const seriffStartDeck = [
    new Duck(),
    new Brewer(),
    new Nemo()
];
const banditStartDeck = [
    new Dog(),
    new Dog(),
    new Dog(),
];


// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
setGameSpeedRate(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});