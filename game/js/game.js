var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var lastTime;
var gameTime = 0;
var terrainPattern;
var playerSpeed = 100;
var coinsSpeed = 150;
var keyCode;
var score = 1;
var gameOver = false;

var sndCatch = new Audio("catch.wav");

function init() {
    lastTime = Date.now();

    document.addEventListener("keydown", function(event) {
        keyCode = event.keyCode
    });
    document.addEventListener("keyup", function(event) {
        keyCode = 0
    });

    terrainPattern = ctx.createPattern(resources.get('img/bg-game.jpg'), "no-repeat");

    main();
}

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    render();

    lastTime = now;

    if (!gameOver) {
        requestAnimFrame(main);
    }
};

resources.load([
    'img/sprites.png',
    'img/bg-game.jpg'
]);
resources.onReady(init);

var player = {
    pos: [20, canvas.height / 2 - 19],
    sprite: new Sprite('img/sprites.png', [0, 0], [99, 90], 9, [0, 4])
};
var coins = [];

function update(dt) {
    gameTime += dt;

    handleInput(dt);
    updateEntities(dt);

    if (score == 0) {
        gameOver = true;
    }

    if ((Math.random() * (10000 - 1) + 1) < 150) {
        coins.push({
            pos: [canvas.width, Math.random() * (canvas.height - 39)],
            sprite: new Sprite('img/sprites.png', [0, 105], [43, 42], 6, [0, 1, 2, 3, 2, 1])
        });
    }

    catchCoins();

};

function handleInput(dt) {
    switch (keyCode) {
        case 38: // move up
            player.pos[1] -= playerSpeed * dt;
            if (player.pos[1] < -4) {
                player.pos[1] = -4;
            }
            break;
        case 40: // move down
            player.pos[1] += playerSpeed * dt;
            if (player.pos[1] > canvas.height - player.sprite.size[1]) {
                player.pos[1] = canvas.height - player.sprite.size[1];
            }
            break;
    }
}

function updateEntities(dt) {
    player.sprite.update(dt);

    for (let i = 0; i < coins.length; i++) {
        coins[i].pos[0] -= coinsSpeed * dt;
        coins[i].sprite.update(dt);

        if (coins[i].pos[0] + coins[i].sprite.size[0] < 0) {
            score--;
            coins.splice(i, 1);
            i--;
        }
    }
}

function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderEntity(player);
    renderEntities(coins);
    renderScore();

    if (gameOver) {
        ctx.font = "45px Verdana";
        ctx.fillStyle = "red";
        ctx.fillText("Game Over", 180, 250);
    }
};

function renderEntities(list) {
    for (let i = 0; i < list.length; i++) {
        renderEntity(list[i]);
    }
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

function renderScore() {
    ctx.font = "20px Verdana";
    ctx.fillStyle = "white";
    ctx.fillText("Score: " + score, 3, 20);
}

function catchCoins() {
    for (let i = 0; i < coins.length; i++) {
        if (boxCollides(player.pos, player.sprite.size, coins[i].pos, coins[i].sprite.size)) {
            score++;
            coins.splice(i, 1);
            i--;
            sndCatch.play();
        }
    }
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 || b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(
        pos[0], pos[1], pos[0] + size[0], pos[1] + size[1],
        pos2[0], pos2[1], pos2[0] + size2[0], pos2[1] + size2[1]
    );
}

var requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
