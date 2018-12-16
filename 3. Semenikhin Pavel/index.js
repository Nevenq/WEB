addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 500);
        });

    document.getElementById('movePlay')
        .addEventListener('click', function () {
            const element = document.getElementById('moveBlock');
            animaster().addMove(500, {x: 20, y: 20}).addMove(1000, {x: 0, y: 0}).play(element);
            //animaster().move(block, 1000, {x: 100, y: 10});
        });

    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let elem = animaster().moveAndHide(block, 2000);

            document.getElementById('reset').addEventListener('click', () => {
                elem.reset()
            });
        })


    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 5000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let elem = animaster().heartBeating(block);
            document.getElementById('stopBeatingPlay').addEventListener('click', () => elem.stop())
        });
}

/**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */


/**
 * Функция, передвигающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param translation — объект с полями x и y, обозначающими смещение блока
 */


/**
 * Функция, увеличивающая/уменьшающая элемент
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
 */


function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}

function animaster() {
    const resetFadeIn = (element) => {
        element.classList.remove('show');
        element.classList.add('hide');
        element.style.transitionDuration = null;
    };
    const resetFadeOut = (element) => {
        element.classList.remove('hide');
        element.classList.add('show');
        element.style.transitionDuration = null;
    };
    const resetMoveAndScale = (element) => {
        element.style.transitionDuration = null;
        element.style.transform = null;
    };
    return {
        fadeIn: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },
        move: function (element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },
        scale: function (element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },
        fadeOut: function (element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },
        moveAndHide: function (element, duration) {
            let timeout1 = setTimeout(() => this.move(element, duration * 2 / 5, {x: 100, y: 20}), 0);
            let timeout2 = setTimeout(() => this.fadeOut(element, duration * 3 / 5), duration * 3 / 5);
            return {
                reset: () => {
                    clearTimeout(timeout2);
                    clearTimeout(timeout1);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            }
        },
        showAndHide: function (element, duration) {
            setTimeout(() => this.fadeIn(element, duration * 1 / 3), 0);
            setTimeout(() => this.fadeOut(element, duration * 1 / 3), duration * 1 / 3);
        },
        heartBeating: function (element) {
            let interval = setInterval(() => {
                setTimeout(() => this.scale(element, 500, 1.4), 0);
                setTimeout(() => this.scale(element, 500, 1.0), 500);
            }, 1000);
            return {
                stop: () => clearInterval(interval)
            }
        },
        _steps: []
        ,
        addMove: function (duration, translation) {
            this._steps.push({
                name: 'move',
                duration,
                translation,
            });
            return this;
        },
        play: function (element) {
            let totalDuration = 0;
            this._steps.forEach(step => {
                totalDuration += step.duration;
                const duration = totalDuration - step.duration;
                if (step.name === 'move') {
                    setTimeout(() => this.move(element, step.duration, step.translation), duration);
                    return;
                }
                /*if (step.name === 'scale') {
                    setTimeout(() => this.scale(element, step.duration, step.ratio), duration);
                    return;
                }
                if (step.name === 'fade') {
                    if (element.classList.contains('hide'))
                        setTimeout(() => this.fadeIn(element, step.duration), duration);
                    else
                        setTimeout(() => this.fadeOut(element, step.duration), duration);
                }*/
            })
        }
    }
}
