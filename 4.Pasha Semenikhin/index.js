isDuck = function (obj) {
    return obj && obj.quacks && obj.swims;
};

isDog = function (obj) {
    return obj instanceof Dog;
};

//TODO 2 getDescription
Card.prototype.getCustomDescriptions = function () {
    if (isDuck(this) && !isDog(this))
        return ["Утка"];
    if (isDog(this) && !isDuck(this))
        return ["Собака"];
    if (isDog(this) && isDuck(this))
        return ["Утка-Собака"];
    return ["Существо"];
};

//TODO 1.1 Duck constructor
function Duck(name = 'Мирная утка', power = 2, image = 'duck.png') {
    Card.call(this, name, power, image);
    this.quacks = () => {
        console.log('quack')
    };
    this.swims = () => {
        console.log('float: both;')
    };
}

Duck.prototype = Object.create(Card.prototype);
Duck.prototype.constructor = Duck;

//TODO 1.2 Dog
function Dog(name = 'Пес-бандит', power = 3, image = 'dog.png') {
    Card.call(this, name, power, image);
    this.swims = () => {
        console.log('float: none;')
    };
}

Dog.prototype = Object.create(Card.prototype);
Dog.prototype.constructor = Dog;

//TODO 3 Trasher
function Trasher(name = 'Громила', power = 5, image = 'trasher.png') {
    Dog.call(this, name, power, image);
}

Trasher.prototype = Object.create(Dog.prototype);
Trasher.prototype.constructor = Trasher;
Trasher.prototype.modifyTakenDamage = function (value, fromCard, gameContext, continuation) {
    this.view.signalAbility(() => {
        continuation(value - 1);
    });
};
Trasher.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    if (Object.getPrototypeOf(this).hasOwnProperty('modifyTakenDamage'))
        arr.unshift("«Получает на 1 еденицу урона меньше»");
    return arr;
};

//TODO 4 Gatling
function Gatling(name = 'Гатлинг', power = 6, image = 'gatling.png') {
    Card.call(this, name, power, image);
}

Gatling.prototype = Object.create(Card.prototype);
Gatling.prototype.constructor = Gatling;
Gatling.prototype.attack = function (gameContext, continuation) {
    const taskQueue = new TaskQueue();
    const {oppositePlayer} = gameContext;
    taskQueue.push(onDone => this.view.showAttack(onDone));
    taskQueue.push(onDone => this.view.signalAbility(onDone));
    for (const card of oppositePlayer.table) {
        if (card) {
            taskQueue.push(onDone => {
                this.dealDamageToCreature(2, card, gameContext, onDone);
            });
        }
    }
    taskQueue.continueWith(continuation);
};
Gatling.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    if (Object.getPrototypeOf(this).hasOwnProperty('attack'))
        arr.unshift("«Наносит две еденицы урона всем врагам»");
    return arr;
};

//TODO 5 Lads

function Lad(name = 'Браток', power = 2, image = 'lad.png') {
    Dog.call(this, name, power, image);
}

Lad.prototype = Object.create(Dog.prototype);
Lad.prototype.constructor = Lad;
Lad.inGameCount = 0;
Lad.prototype.doAfterComingIntoPlay = function (gameContext, continuation) {
    Lad.inGameCount++;
    continuation();
};
Lad.prototype.doBeforeRemoving = function (continuation) {
    Lad.inGameCount--;
    continuation();
};
Lad.getBonus = function () {
    return this.inGameCount * (this.inGameCount + 1) / 2;
};
Lad.prototype.modifyDealedDamageToCreature = function (value, toCard, gameContext, continuation) {
    this.view.signalAbility(() => continuation(value + Lad.getBonus()));
};
Lad.prototype.modifyTakenDamage = function (value, fromCard, gameContext, continuation) {
    this.view.signalAbility(() => continuation(value - Lad.getBonus()));
};
Lad.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    if (Object.getPrototypeOf(this).hasOwnProperty('modifyDealedDamageToCreature'))
        arr.unshift("«Чем их больше, тем они сильнее»");
    return arr;
};

//TODO 6 Rogue
function Rogue(name = 'Изгой', power = 2, image = 'rogue.png') {
    Card.call(this, name, power, image)
}

Rogue.prototype = Object.create(Card.prototype);
Rogue.prototype.constructor = Rogue;
Rogue.prototype.attack = function (gameContext, continuation) {
    const taskQueue = new TaskQueue();

    const {oppositePlayer, position} = gameContext;

    taskQueue.push(onDone => this.view.showAttack(onDone));
    taskQueue.push(onDone => {
        const oppositeCard = oppositePlayer.table[position];
        if (oppositeCard) {
            const proto = Object.getPrototypeOf(oppositeCard);
            if (proto.hasOwnProperty('modifyDealedDamageToCreature')) {
                this.modifyDealedDamageToCreature = proto.modifyDealedDamageToCreature;
                delete proto.modifyDealedDamageToCreature;
            }
            if (proto.hasOwnProperty('modifyDealedDamageToPlayer')) {
                this.modifyDealedDamageToPlayer = proto.modifyDealedDamageToPlayer;
                delete proto.modifyDealedDamageToPlayer;
            }
            if (proto.hasOwnProperty('modifyTakenDamage')) {
                this.modifyTakenDamage = proto.modifyTakenDamage;
                delete proto.modifyTakenDamage
            }
            gameContext.updateView();
            this.dealDamageToCreature(this.currentPower, oppositeCard, gameContext, onDone);
        } else {
            this.dealDamageToPlayer(1, gameContext, onDone);
        }
    });
    taskQueue.continueWith(continuation);
};

Rogue.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    arr.unshift("«Похищает способности(Имба)»");
    return arr;
};

//TODO 7 Cousin
function Cousin(name = 'Кузен', power = 3, image = 'cousin.png') {
    Dog.call(this, name, power, image);
}

Cousin.prototype = Object.create(Dog.prototype);
Cousin.prototype.constructor = Cousin;
Cousin.prototype.doAfterComingIntoPlay = function (gameContext, continuation) {
    Dog.prototype.modifyTakenDamage = function (value, fromCard, gameContext, continuation) {
        this.view.signalAbility(() => continuation(value - 1));
    };
    continuation();
};
Cousin.prototype.doBeforeRemoving = function (continuation) {
    Dog.prototype.modifyTakenDamage = function (value, fromCard, gameContext, continuation) {
        continuation(value);
    };
    continuation();
};
Cousin.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    arr.unshift("Пока Кузен находится в игре, все собаки получают на 1 единицу урона меньше.");
    return arr;

};

//TODO 8 Brewer
function Brewer(name = 'Пивовар', power = 2, image = 'brewer.png') {
    Duck.call(this, name, power, image);
}

Brewer.prototype = Object.create(Duck.prototype);
Brewer.prototype.constructor = Brewer;
Brewer.prototype.doBeforeAttack = function (gameContext, continuation) {
    const {currentPlayer, oppositePlayer} = gameContext;
    const taskQueue = new TaskQueue();
    taskQueue.push(onDone => this.view.signalAbility(onDone));
    let cards = currentPlayer.table.concat(oppositePlayer.table);
    cards
        .filter(x => isDuck(x))
        .forEach(x => {
            taskQueue.push(onDone => {
                x.maxPower++;
                x.Power += 2;
                x.view.signalHeal(onDone);
                x.updateView();
            })
        });

    taskQueue.continueWith(continuation)
};
Brewer.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    arr.unshift("«Бафает уток на +2/+1»");
    return arr;
};

//TODO 9 PseudoDuck
function PseudoDuck(name = 'Псевдоутка', power = 3, image = 'pseudoDuck.png') {
    Dog.call(this, name, power, image);
    this.quacks = new Duck().quacks;
}

PseudoDuck.prototype = Object.create(Dog.prototype);
PseudoDuck.prototype.constructor = PseudoDuck;

//TODO 10
function SlyGoose(name = 'Хитрый гусь', power = 2, image = 'slygoose.png') {
    Card.call(this, name, power, image)
}

SlyGoose.prototype = Object.create(Card.prototype);
SlyGoose.prototype.constructor = SlyGoose;
SlyGoose.prototype.modifyDealedDamageToCreature = function (value, toCard, gameContext, continuation) {
    if (Object.getPrototypeOf(toCard).constructor === PseudoDuck)
        continuation(value * 2);
    else
        continuation(value)
};
SlyGoose.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    if (Object.getPrototypeOf(this).hasOwnProperty('modifyDealedDamageToCreature'))
        arr.unshift("«Наносит псевдоутке х2 урона»");
    return arr;
};

//TODO 11 Sniper
function Sniper(name = 'Снайпер', power = 2, image = 'sniper.png') {
    Card.call(this, name, power, image);
}

Sniper.prototype = Object.create(Card.prototype);
Sniper.prototype.constructor = Sniper;
Sniper.prototype.modifyDealedDamageToCreature = function (value, toCard, gameContext, continuation) {
    this.view.signalAbility(() => continuation(value * 3));
};
Sniper.prototype.modifyDealedDamageToPlayer = function (value, gameContext, continuation) {
    this.view.signalAbility(() => continuation(value * 3));
};
Sniper.prototype.modifyTakenDamage = function (value, fromCard, gameContext, continuation) {
    this.view.signalAbility(() => continuation(Math.floor(value / 3)));
};
Sniper.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    if (Object.getPrototypeOf(this).hasOwnProperty('modifyDealedDamageToPlayer'))
        arr.unshift("«Наносит х3 урона/получает в 3 раза меньше урона (Срочно нерфить)»");
    return arr;
};

//TODO 12 Nemo
function Nemo(name = 'Немо', power = 4, image = 'nemo.png') {
    Card.call(this, name, power, image);
}

Nemo.prototype = Object.create(Card.prototype);
Nemo.prototype.constructor = Nemo;
Nemo.prototype.doBeforeAttack = function (gameContext, continuation) {
    const tasks = new TaskQueue();
    const {oppositePlayer, position} = gameContext;
    if (!oppositePlayer.table[position]) {
        continuation();
        return;
    }
    const card = Object.getPrototypeOf(oppositePlayer.table[position]);
    tasks.push(onDone => this.view.signalAbility(onDone));
    tasks.push(onDone => {
        delete this.doBeforeAttack;
        Object.setPrototypeOf(this, card);
        this.updateView();
        this.doBeforeAttack(gameContext, onDone)
    });
    tasks.push(onDone => continuation(onDone))

};
Nemo.prototype.getCustomDescriptions = function () {
    let arr = Card.prototype.getCustomDescriptions.call(this);
    if (Object.getPrototypeOf(this).hasOwnProperty('modifyDealedDamageToPlayer'))
        arr.unshift("«крадет прототип и назначает себе»");
    return arr;
};
const seriffStartDeck = [
    new Nemo(),
    new Nemo(),
];
const banditStartDeck = [
    new Brewer(),
    new Sniper(),
];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальная функция, позволяющая управлять скоростью всех анимаций.
function getSpeedRate() {
    return 1;
}

// Запуск игры.
game.play(false, (winner) => {
    const a = winner.name === 'Уточка зря' ? 'Победила ' : 'Победил ';
    alert(a + winner.name);
});
