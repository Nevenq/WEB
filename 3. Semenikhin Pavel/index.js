const customAnimation = animaster()
    .addMove(200, {x: 40, y: 40})
    .addScale(800, 1.3)
    .addMove(200, {x: 80, y: 0})
    .addScale(800, 1)
    .addMove(200, {x: 40, y: -40})
    .addScale(800, 0.7)
    .addMove(200, {x: 0, y: 0})
    .addScale(800, 1);
addListeners();

function addListeners() {
    document.getElementById('fadeInPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('fadeInBlock');
            animaster().fadeIn(block, 500);
        });
    let a = customAnimation.buildHandler();

    /*function () {
        const element = document.getElementById('moveBlock');
        //animaster().addMove(500, {x: 20, y: 20}).addMove(1000, {x: 0, y: 0}).play(element);
        //animaster().move(element, 1000, {x: 100, y: 10});
        let a = customAnimation.buildHandler();
        console.log(a())
    }*/

    document.getElementById('moveBlock').addEventListener('click', a, true);
    document.getElementById('movePlay')
        .addEventListener('click', () => document.getElementById('moveBlock').click());
    document.getElementById('scalePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('scaleBlock');
            animaster().scale(block, 1000, 1.25);
        });

    document.getElementById('moveAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('moveAndHideBlock');
            let elem = animaster().moveAndHide(block, 2000);

            document.getElementById('reset').addEventListener('click', elem.reset);
        });


    document.getElementById('showAndHidePlay')
        .addEventListener('click', function () {
            const block = document.getElementById('showAndHideBlock');
            animaster().showAndHide(block, 3000);
        });

    document.getElementById('heartBeatingPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('heartBeatingBlock');
            let elem = animaster().heartBeating(block);
            document.getElementById('stopBeatingPlay').addEventListener('click', elem.stop)
        });
    document.getElementById('newPlay')
        .addEventListener('click', function () {
            const block = document.getElementById('newBlock');
            animaster()
                .addRotate(1000,'1,1,0,180deg')
                .addDelay(500)
                .addRotate(1000,'1,1,0,0deg')
                .addDelay(500)
                .addRotate(1000,'-1,1,0,-180deg')
                .addDelay(500)
                .addRotate(1500,'-1,1,0,0deg')
                .addRotate(1500,'1,0,0,180deg')
                .addRotate(1500,'1,1,0,180deg')
                .addRotate(1500,'0,0,0,0deg')
                .addDelay(2000)
                .play(block,1)
        });
}


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
            return this.addFadeIn(duration).play(element)
        },
        move: function (element, duration, translation) {
            return this.addMove(duration, translation).play(element);
        },
        scale: function (element, duration, ratio) {
            return this.addScale(duration, ratio).play(element)
        },
        fadeOut: function (element, duration) {
            return this.addFadeOut(duration).play(element)
        },
        moveAndHide: function (element, duration) {
            return this.addMove(duration * 2 / 5, {x: 100, y: 20}).addFadeOut(duration * 3 / 5).play(element);

        },
        showAndHide: function (element, duration) {
            return this.addFadeIn(duration * 1 / 3).addDelay(duration * 1 / 3).addFadeOut(duration * 1 / 3).play(element, true);
        },
        heartBeating: function (element) {
            return this.addScale(500, 1.4).addScale(500, 1.0).play(element, true);
        },
        _steps: [],
        addMove: function (duration, translation) {
            const obj =[...this._steps];
            obj.push({
                name: 'move',
                duration,
                translation,
                transform: (element) => {
                    let ratio = element.style.transform.match(/scale\((.+)\)/);
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(translation, ratio && ratio[1]);
                }
            });
            return {...this,_steps: obj};
        },
        addScale: function (duration, ratio) {
            const obj = [...this._steps];
            obj.push({
                name: 'scale',
                duration,
                ratio,
                transform: (element) => {
                    let transform = element.style.transform.match(/translate\((.+)px, (.+)px\)/);
                    let translate = {};
                    if (transform)
                        translate = {x: transform[1], y: transform[2]};
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = getTransform(translate.x ? translate : null, ratio);
                }
            });
            return {...this,_steps : obj};
        },
        addFadeIn: function (duration) {
            const obj = [...this._steps];
            obj.push({
                name: 'fadeIn',
                duration,
                transform: (element) => {
                    element.style.transitionDuration = `${duration}ms`;
                    element.classList.remove('hide');
                    element.classList.add('show');
                }
            });
            return  {...this,_steps : obj};
        },
        addFadeOut: function (duration) {
            const obj = [...this._steps];
            obj.push({
                name: 'fadeOut',
                duration,
                transform: (element) => {
                    element.style.transitionDuration = `${duration}ms`;
                    element.classList.remove('show');
                    element.classList.add('hide');
                }
            });
            return {...this,_steps : obj}
        },
        addDelay: function (duration) {
            const obj = [...this._steps];
            obj.push({
                name: 'delay',
                duration,
                transform: (() => {
                })
            });
            return {...this,_steps : obj}
        },
        addRotate: function (duration,rotate) {
            const obj = [...this._steps];
            obj.push({
                name: 'rotate',
                duration,
                transform: ((element) => {
                    element.style.transitionDuration = `${duration}ms`;
                    element.style.transform = `perspective(400px) rotate3d(${rotate})`
                })
            });
            return {...this,_steps : obj}
        },
        play: function (element, cycled = false) {
            const totalDuration = this._steps.reduce((a, b) => a + b.duration, 0);
            let position = element.getBoundingClientRect();
            const initialState = {
                opacity: getComputedStyle(element).opacity,
                position: {x: position.x + pageXOffset, y: position.y + pageYOffset}
            };
            const animation = () => {
                let animationDelay = 0;
                this._steps.forEach(step => {
                    animationDelay += step.duration;
                    const delay = animationDelay - step.duration;
                    setTimeout(() => step.transform(element), delay);
                })
            };
            animation();
            const interval = cycled && setInterval(() => animation(), totalDuration);
            return {
                stop: () => interval && clearInterval(interval),
                reset: () => {
                    let position = element.getBoundingClientRect();
                    let opacity = getComputedStyle(element).opacity;
                    let changedPosition = {x: position.x + pageXOffset, y: position.y + pageYOffset};
                    if (initialState.x !== changedPosition.x || initialState.y !== changedPosition.y)
                        resetMoveAndScale(element);
                    if (initialState.opacity === '0' && opacity !== '0')
                        resetFadeIn(element);
                    if (initialState.opacity === '1' && opacity !== '1')
                        resetFadeOut(element);

                }
            }
        },
        buildHandler: function () {
            let animation = this;
            return function (cycled = false) {
                console.log(this);
                animation && animation.play && animation.play(this, cycled)
            };
        }

    }

}
