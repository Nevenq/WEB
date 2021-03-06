Задача добавить новые интересные карты в карточную игру.

0. «Осмотр реквизита»
Для начала осмотрись:
- Запусти index.html и понаблюдай как игра играет сама в себя.
- Посмотри index.js. В этом файле создаются колоды карты и запускается игра.
  В заданиях ты будешь пр
  авить только этот файл, за исключением одного случая.
- Загляни в Game.js, обрати внимания на стадии хода.
- Изучи Card.js, чтобы разобраться какие действия происходят с картой, какие возможности по расширению заложены.

Твоя задача - создавать новые типы карт, наследующиеся от Card.
В этой задаче можно использовать только прототипное наследование.
Никакого синтаксического сахара в виде классов!


1. «Утки против собак»
Добавь антуража в игру! Создай в index.js две новые карты, унаследовав их от Card:
- Duck с именем «Мирная утка» и силой 2
- Dog с именем «Пес-бандит» и силой 3

Посмотреть, как унаследовать один тип от другого с помощью прототипов можно тут:
https://learn.javascript.ru/class-inheritance#%D0%BF%D0%BE%D0%BB%D0%BD%D1%8B%D0%B9-%D0%BA%D0%BE%D0%B4-%D0%BD%D0%B0%D1%81%D0%BB%D0%B5%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F

Не забудь вызвать базовый конструктор Card!

- Новые карты должны создаваться, даже если им не передать параметров: new Duck() и new Dog().
- После добавления новых типов замени карты в колоде шерифа на уток, а в колоде бандита - на собак.
- Функция isDuck должна возвращать true для утки, а функция isDog — для собаки.
- Если все сделано правильно, то внизу карты утки должен быть текст Duck➔ Card, а у собаки Dog➔ Card.


2. «Утка или собака?»
Метод getCustomDescriptions в Card создан для того, чтобы на картах появлялась дополнительная информация.
Замени в прототипе Card текущую реализацию на другую:
- для карт, удовлетворяющих только условию isDuck, пусть возвращается описание «Утка»
- для карт, удовлетворяющих только условию isDog, пусть возвращается описание «Собака»
- для карт, удовлетворяющих обоим условиям — «Утка-Собака»
- для остальных карт — «Существо»

Необходимый код напиши в файле index.js.


3. «Громила»
Для уток все становится плохо, когда в рядах бандитов появляется Громила.

Добавь карту Trasher:
- называется Громила, сила 5, наследуется от Dog.
- если Громилу атакуют, то он получает на 1 меньше урона.

Подсказки:
- переопредели метод modifyTakenDamage, чтобы уменшать урон
- this.view.signalAbility — используй, чтобы при применении способности карта мигала

Переопредели getCustomDescriptions, чтобы на лицевой стороне карты выводилось краткое описание способности Громилы.
Не забудь вызвать реализацию из базового типа, чтобы информация «Утка или Собака» никуда не делась.

Колоды для проверки:
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Duck(),
];
const banditStartDeck = [
    new Trasher(),
];


4. «Гатлинг»
Нехорошо нападать на мирных жителей. Это еще может быть опасно, если в сарае припрятан Гатлинг.

Добавь карту Gatling:
- называется Гатлинг, сила 6, наследуется от Card.
- при атаке наносит 2 урона всем картам противника на столе, но не атакует игрока-противника.

Подсказки:
- переопредели метод attack так, чтобы урон наносился всем картам противника
- список карт противника можно получить через gameContext.oppositePlayer.table
- в качестве примера выполнения действий над несколькими картами можешь использовать applyCards из Player.js

Колоды для проверки:
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Gatling(),
];
const banditStartDeck = [
    new Trasher(),
    new Dog(),
    new Dog(),
];


5. «Братки»
Чем их больше, тем они сильнее.

Добавь карту Lad:
- называется Браток, сила 2, наследуется от Dog.
- чем больше братков находится в игре, тем больше урона без потерь поглощается
  и больше урона по картам наносится каждым из них.

Защита от урона      =  количество * (количество + 1) / 2
Дополнительный урон  =  количество * (количество + 1) / 2

Подсказки:
- текущее количество братков в игре надо где-то хранить, свойство в функции-конструкторе Lad — подходящее место.
Выглядеть будет как-то так: Lad.inGameCount = 0;
- чтобы обновлять количество братков в игре переопредели методы doAfterComingIntoPlay, doBeforeRemoving
- чтобы рассчитывать бонус к урону и защите стоит завести метод в функции Lad (статический метод).
Выглядеть будет как-то так: Lad.getBonus = function () { ... }
- обрати внимание на то, чему равен this в статических методах, т.е. методах функции-конструктора.
- переопредели методы modifyDealedDamageToCreature и modifyTakenDamage, чтобы они использовали бонус

Добавь в описание карты «Чем их больше, тем они сильнее».
Этот текст должен появляться только если непосредственно у братков (т.е. в Lad.prototype)
переопределены методы modifyDealedDamageToCreature или modifyTakenDamage.
Проверка на наличие свойства непосредственно у объекта выглядит так: obj.hasOwnProperty('nameOfProperty')
Эта особенность понадобится на следующем шаге.

Колоды для проверки:
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Gatling(),
];
const banditStartDeck = [
    new Lad(),
    new Lad(),
    new Lad(),
];


6. «Изгой»
От него все бегут, потому что он приходит и отнимает силы...

Добавь карту Rogue:
- называется Изгой, сила 2, наследуется от Card.
- перед атакой на карту забирает у нее все способности к увеличению наносимого урона или уменьшению получаемого урона.
  Одновременно эти способности забираются у всех карт того же типа, но не у других типов карт.
  Изгой получает эти способности, но не передает их другим Изгоям.

Подсказки:
- Изгой похищает эти способности: modifyDealedDamageToCreature, modifyDealedDamageToPlayer, modifyTakenDamage
- Чтобы похитить способности у всех карт некоторого типа, надо взять их из прототипа
- Получить доступ к прототипу некоторой карты можно так: Object.getPrototypeOf(card)
- Чтобы не похищать способности у других типов, нельзя задевать прототип прототипа
- Object.keys и obj.hasOwnProperty позволяют получать только собственные свойства объекта
- Удалить свойство из объекта можно с помощью оператора delete так: delete obj[propName]
  Это не то же самое, что obj[propName] = undefined
- После похищения стоит обновить вид всех объектов игры. updateView из gameContext поможет это сделать.

Колоды для проверки:
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Rogue(),
];
const banditStartDeck = [
    new Lad(),
    new Lad(),
    new Lad(),
];


7*. «Кузен»
Нагрянула проверка бизнеса из Семьи. Кузен все расставит на свои места.

Добавь карту Cousin:
- называется Кузен, сила 3, наследуется от Dog.
- Пока Кузен находится в игре, все собаки получают на 1 единицу урона меньше.
  Эффект от нескольких Кузенов не суммируется.

Подсказки:
- Все необходимое ты уже знаешь :)

Колоды для проверки:
const seriffStartDeck = [
    new Rogue(),
    new Duck(),
    new Duck(),
    new Duck(),
    new Duck(),
];
const banditStartDeck = [
    new Cousin(),
    new Dog(),
    new Dog(),
];


8*. «Пивовар»
Живительное пиво помогает уткам творить невозможное!

Добавь карту Brewer:
- называется Пивовар, сила 2, наследуется от Duck.
- перед атакой на карту Пивовар раздает пиво,
  которое изменяет максимальную силу карты на +1, а затем текущую силу на +2.
- Пивовар угощает пивом все карты на столе: и текущего игрока и игрока-противника,
но только с утками, проверяя их с помощью isDuck.
- Пивовар само собой утка, поэтому его сила тоже возврастает.

Подсказки:
- Все карты на столе можно получить из gameContext так: currentPlayer.table.concat(oppositePlayer.table).
- this.view.signalHeal — используй, чтобы подсветить карту, у которой увеличилась сила.
- card.updateView() — используй, чтобы обновлять вид карт, у которых увеличилась сила.

Важно, чтобы при увеличении текущей силы она не превышала максимальную.
Добиться этого можно по разному, но решить этот вопрос раз и навсегда иначе определив свойство currentPower в Card.

Сейчас оно определяется в функции definePower просто:
    this.currentPower = maxPower

Перепиши функцию definePower в файле Card.js.
Для определения свойства currentPower примени Object.defineProperty.
При этом используй дескриптор доступа, в котором можно задать геттер и сеттер.

Подробнее про Object.defineProperty тут:
https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty

Пример определения свойства с геттером и сеттером:
https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty#Example:_Custom_setters_and_getters

Колоды для проверки:
const seriffStartDeck = [
    new Duck(),
    new Brewer(),
];
const banditStartDeck = [
    new Dog(),
    new Cousin(),
    new Dog(),
    new Dog(),
];


9*. «Псевдоутка»
Чтобы получить доступ к живительному напитку надо всего лишь
выглядеть как утка, плавать как утка и крякать как утка!

Добавь карту PseudoDuck:
- называется Псевдоутка, сила 3, наследуется от Dog.
- Псевдоутка — это обычный пес, но еще умеет крякать, поэтому легко проходит проверку на утиность isDuck.

Подсказки:
- убедись, что в описании Псевдоутки присутстует «Утка-Собака».
- можно научить Псевдоутку крякать, используя уже имеющийся метод quacks.

Колоды для проверки:
const seriffStartDeck = [
    new Duck(),
    new Brewer(),
    new Duck(),
];
const banditStartDeck = [
    new PseudoDuck(),
    new Cousin(),
    new PseudoDuck(),
];


10*. «Хитрый гусь»
Охота на замаскировавшихся собак начинается.

Добавь карту SlyGoose:
- называется Хитрый гусь, сила 2, наследуется от Card.
- урон удваивается, если Хитрый гусь атакует Псевдоутку.

Подсказки:
- убедись, что увеличение урона работает только против Псевдоуток.

Колоды для проверки:
const seriffStartDeck = [
    new SlyGoose(),
    new SlyGoose(),
    new SlyGoose(),
];
const banditStartDeck = [
    new PseudoDuck(),
    new Dog(),
    new PseudoDuck(),
];


11*. «Снайпер»
Неуловимый и смертоносный.

Добавь карту Sniper:
- называется Снайпер, сила 2, наследуется от Card.
- урон по противоположенной карте утраивается.
- урон по игроку-противнику утраивается.
- урон по Снайперу уменьшается в 3 раза с округлением вниз.

Колоды для проверки:
const seriffStartDeck = [
    new Duck(),
    new Gatling(),
    new Brewer(),
    new Duck(),
];
const banditStartDeck = [
    new Sniper(),
    new Sniper(),
];


12*. «Немо»
«The one without a name without an honest heart as compass»

Добавь карту Nemo:
- называется Немо, сила 4, наследуется от Card.
- перед атакой на карту крадет ее прототип и назначает себе, получая все ее способности,
  но вместе со своим старым прототипом теряет способность красть.
- если карта, у которой был украден прототип, обладает способностями, выполняющимися перед атакой,
  то они должны быть выполнены сразу после кражи прототипа.
- некоторые способности для Nemo работают необычно.
  Например, даже украв прототип утки он никогда не научится крякать и плавать.

Подсказки:
- updateView из gameContext позволяет обновить вид всех объектов игры.
- Object.getPrototypeOf(obj) позволяет получить прототип объекта.
- Object.setPrototypeOf(obj, proto) позволяет задать протип объекту.
- функция doBeforeAttack из прототипа должна быть вызвана сразу после кражи прототипа.

Колоды для проверки:
const seriffStartDeck = [
    new Nemo(),
    new Nemo(),
];
const banditStartDeck = [
    new Brewer(),
    new Sniper(),
];
