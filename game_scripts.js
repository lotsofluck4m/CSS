const game = {
    canvasId: "Gwanghwamun",

    backgroundSrc: "res/looping_background.jpg",

    spriteSrc: "res/candle_sprite.png",
    sprites: [],
    spriteWidth: 20,
    spriteHeight: 36,
    maximumSprites: 40,

    playerSrc: "res/president_portrait.png",
    playerWidth: 30,
    playerHeight: 30,
    direction: Object.freeze({
        DOWN_LEFT: 1,
        DOWN: 2,
        DOWN_RIGHT: 3,
        LEFT: 4,
        NEUTRAL: 5,
        RIGHT: 6,
        UP_LEFT: 7,
        UP: 8,
        UP_RIGHT: 9
    }),

    keyMap: [],
    directionKeyCode: Object.freeze({
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40
    }),

    getSize: function (rect) {

        this.width = rect.width;
        this.height = rect.height;
    },

    scrollBackground: function (scrollAmount) {

        this.backgroundY += scrollAmount;

        if (this.backgroundY > this.height * 2) {
            this.backgroundY = 0;
        }
    },

    scrollSprite: function (sprite, scrollAmount) {

        if (sprite.isVertical) {
            sprite.positionY += scrollAmount * sprite.velocityScale;

            if ((sprite.velocityScale > 0 && sprite.positionY > this.height) ||
                (sprite.velocityScale < 0 && sprite.positionY + this.spriteHeight < 0)) {
                this.relocateSprite(sprite);
            }
        }
        else {
            //horizontal
            sprite.positionX += scrollAmount * sprite.velocityScale;

            if ((sprite.velocityScale > 0 && sprite.positionX > this.width) ||
                (sprite.velocityScale < 0 && sprite.positionX + this.spriteWidth < 0)) {
                this.relocateSprite(sprite);
            }
        }
    },

    relocateSprite: function (sprite) {

        sprite.isVertical = (Math.random() < 0.7);

        do {
            sprite.velocityScale = (Math.random() - 0.5) * 2.5;
        } while (Math.abs(sprite.velocityScale) < 0.75);

        if (sprite.isVertical) {
            sprite.positionY = (sprite.velocityScale > 0) ? -this.height * Math.random() : this.height * (1 + Math.random());
            sprite.positionX = this.width * Math.random();
        }
        else {
            //horizontal
            sprite.positionY = this.height * Math.random();
            sprite.positionX = (sprite.velocityScale > 0) ? -this.width * Math.random() : this.width * (1 + Math.random());
        }
    },

    movePlayer: function (moveAmount) {

        let currentDirection =
            (this.keyMap[this.directionKeyCode.UP] && this.keyMap[this.directionKeyCode.LEFT] && this.direction.UP_LEFT) ||
            (this.keyMap[this.directionKeyCode.UP] && this.keyMap[this.directionKeyCode.RIGHT] && this.direction.UP_RIGHT) ||
            (this.keyMap[this.directionKeyCode.DOWN] && this.keyMap[this.directionKeyCode.LEFT] && this.direction.DOWN_LEFT) ||
            (this.keyMap[this.directionKeyCode.DOWN] && this.keyMap[this.directionKeyCode.RIGHT] && this.direction.DOWN_RIGHT) ||
            (this.keyMap[this.directionKeyCode.UP] && this.direction.UP) ||
            (this.keyMap[this.directionKeyCode.DOWN] && this.direction.DOWN) ||
            (this.keyMap[this.directionKeyCode.LEFT] && this.direction.LEFT) ||
            (this.keyMap[this.directionKeyCode.RIGHT] && this.direction.RIGHT) ||
            this.direction.NEUTRAL;

        switch (currentDirection) {
            case this.direction.NEUTRAL:
                break;
            case this.direction.LEFT:
                this.playerX -= moveAmount;
                if (this.playerX < 0) this.playerX = 0;
                break;
            case this.direction.UP:
                this.playerY -= moveAmount;
                if (this.playerY < 0) this.playerY = 0;
                break;
            case this.direction.RIGHT:
                this.playerX += moveAmount;
                if (this.playerX > this.width - this.playerWidth) this.playerX = this.width - this.playerWidth;
                break;
            case this.direction.DOWN:
                this.playerY += moveAmount;
                if (this.playerY > this.height - this.playerHeight) this.playerY = this.height - this.playerHeight;
                break;
            case this.direction.UP_LEFT:
                this.playerX -= moveAmount / Math.sqrt(2);
                this.playerY -= moveAmount / Math.sqrt(2);
                if (this.playerX < 0) this.playerX = 0;
                if (this.playerY < 0) this.playerY = 0;
                break;
            case this.direction.UP_RIGHT:
                this.playerX += moveAmount / Math.sqrt(2);
                this.playerY -= moveAmount / Math.sqrt(2);
                if (this.playerX > this.width - this.playerWidth) this.playerX = this.width - this.playerWidth;
                if (this.playerY < 0) this.playerY = 0;
                break;
            case this.direction.DOWN_LEFT:
                this.playerX -= moveAmount / Math.sqrt(2);
                this.playerY += moveAmount / Math.sqrt(2);
                if (this.playerX < 0) this.playerX = 0;
                if (this.playerY > this.height - this.playerHeight) this.playerY = this.height - this.playerHeight;
                break;
            case this.direction.DOWN_RIGHT:
                this.playerX += moveAmount / Math.sqrt(2);
                this.playerY += moveAmount / Math.sqrt(2);
                if (this.playerX > this.width - this.playerWidth) this.playerX = this.width - this.playerWidth;
                if (this.playerY > this.height - this.playerHeight) this.playerY = this.height - this.playerHeight;
                break;
        }
    },

    createBackgroundImage: function () {

        let backgroundImage = new Image();
        backgroundImage.src = this.backgroundSrc;
        backgroundImage.style.height = this.height;
        backgroundImage.style.zIndex = 1;

        return backgroundImage;
    },

    createSpriteImage: function () {

        let spriteImage = new Image();
        spriteImage.src = this.spriteSrc;
        spriteImage.style.zIndex = 3;

        return spriteImage;
    },

    createPlayerImage: function () {

        let playerImage = new Image();
        playerImage.src = this.playerSrc;
        playerImage.style.zIndex = 2;

        return playerImage;
    },

    initialize: function () {

        this.canvas = document.getElementById(this.canvasId);

        if (!this.canvas.getContext("2d")) {
            return;
        }
        this.context = this.canvas.getContext("2d");

        this.getSize(this.canvas);

        this.keyMap[this.directionKeyCode.UP] = false;
        this.keyMap[this.directionKeyCode.DOWN] = false;
        this.keyMap[this.directionKeyCode.LEFT] = false;
        this.keyMap[this.directionKeyCode.RIGHT] = false;

        this.timer = 0;

        this.initBackground();

        this.initSprites();

        this.initPlayer();
    },

    initBackground: function () {

        this.backgroundY = 0;

        this.backgroundImage = this.createBackgroundImage();
    },

    initSprites: function () {

        for (let i = 0; i < this.maximumSprites; i++) {
            let spriteBorn = {
                positionX: 0,
                positionY: 0,
                velocityScale: 0,
                isVertical: true
            };

            this.relocateSprite(spriteBorn);

            this.sprites.push(spriteBorn);
        }

        this.spriteImage = this.createSpriteImage();
    },

    initPlayer: function () {

        this.playerX = this.width / 2 - this.playerWidth;
        this.playerY = this.height / 2 - this.playerHeight;

        this.playerImage = this.createPlayerImage();
    },

    drawBackground: function () {

        this.context.drawImage(this.backgroundImage, 0, this.backgroundY, this.width, this.height);
        this.context.drawImage(this.backgroundImage, 0, this.backgroundY - this.height, this.width, this.height);
        this.context.drawImage(this.backgroundImage, 0, this.backgroundY - 2 * this.height, this.width, this.height);
    },

    drawPlayer: function () {

        this.context.drawImage(this.playerImage, this.playerX, this.playerY, this.playerWidth, this.playerHeight);
    },

    drawSprite: function (index) {

        this.context.drawImage(this.spriteImage, this.sprites[index].positionX, this.sprites[index].positionY, this.spriteWidth, this.spriteHeight);
    },

    checkCollision: function (index) {

        const reduceScale = 0.2;

        let reducedPlayerX = this.playerX + this.playerWidth * reduceScale;
        let reducedPlayerY = this.playerY + this.playerHeight * reduceScale;
        let reducedPlayerWidth = this.playerWidth - 2 * this.playerWidth * reduceScale;
        let reducedPlayerHeight = this.playerHeight - 2 * this.playerHeight * reduceScale;

        const sprite = this.sprites[index];

        if (!((sprite.positionX > reducedPlayerX + reducedPlayerWidth) ||
            (sprite.positionX + this.spriteWidth < reducedPlayerX) ||
            (sprite.positionY + this.spriteHeight < reducedPlayerY) ||
            (sprite.positionY > reducedPlayerY + reducedPlayerHeight))) {

            this.sprites.length = 0;

            stopGame();

            return true;
        }
        else {
            return false;
        }
    },

    proceed: function (timeInterval) {

        const backgroundVelocity = 600;
        const spriteVelocity = 200;
        const playerSpeed = 200;

        this.getSize(this.canvas);
        this.context.clearRect(0, 0, this.width, this.height);

        this.scrollBackground(timeInterval / 1000 * backgroundVelocity);
        this.drawBackground();

        this.movePlayer(timeInterval / 1000 * playerSpeed);
        this.drawPlayer();

        for (let i = 0; i < this.maximumSprites; i++) {
            this.scrollSprite(this.sprites[i], timeInterval / 1000 * spriteVelocity);
            this.drawSprite(i);

            if (this.checkCollision(i)) break;
        }

        this.timer += timeInterval / 1000;
    },

    directionKeyListener: function (event) {

        if (event.keyCode >= this.directionKeyCode.LEFT && event.keyCode <= this.directionKeyCode.DOWN) {
            event.preventDefault();

            this.keyMap[event.keyCode] = (event.type == keyEvent.KEY_DOWN);
        }
    }
};

const keyEvent = Object.freeze({
    KEY_DOWN: "keydown",
    KEY_UP: "keyup"
});

let intervalId;

const startGame = function () {

    const fps = 60;
    const refreshInterval = 1000 / fps;

    game.initialize();

    document.removeEventListener(keyEvent.KEY_DOWN, spaceBarListener, false);

    document.addEventListener(keyEvent.KEY_DOWN, (() => game.directionKeyListener(event)), false);
    document.addEventListener(keyEvent.KEY_UP, (() => game.directionKeyListener(event)), false);

    intervalId = setInterval((() => game.proceed(refreshInterval)), refreshInterval);
};

const stopGame = function () {

    clearInterval(intervalId);

    document.removeEventListener(keyEvent.KEY_DOWN, (() => game.directionKeyListener(event)), false);
    document.removeEventListener(keyEvent.KEY_UP, (() => game.directionKeyListener(event)), false);

    document.addEventListener(keyEvent.KEY_DOWN, spaceBarListener, false);

    alert("탄핵소추안이 가결되었습니다!\n\n" + game.timer.toFixed(3) + " 초를 버텼습니다");
};

const spaceBarListener = function (event) {

    if (event.keyCode == 32) {
        event.preventDefault();

        startGame();
    }
};

window.onload = document.addEventListener(keyEvent.KEY_DOWN, spaceBarListener, false);
