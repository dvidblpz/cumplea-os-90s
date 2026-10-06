/* =========================================================
   INVITACIÓN - LUIS RANGEL
   BACK TO THE 90s
========================================================= */


/* =========================================================
   INTRO
========================================================= */

const intro = document.getElementById(
    "intro"
);

const startInvitation = document.getElementById(
    "startInvitation"
);

const music = document.getElementById(
    "backgroundMusic"
);

const musicButton = document.getElementById(
    "musicButton"
);


startInvitation.addEventListener(
    "click",
    () => {

        intro.classList.add(
            "hidden"
        );

        music.volume = 0.35;

        music.play()
            .catch(() => {});

    }
);


/* =========================================================
   MÚSICA
========================================================= */

let musicPlaying = false;

musicButton.addEventListener(
    "click",
    () => {

        if (music.paused) {

            music.play()
                .then(() => {

                    musicPlaying = true;

                    musicButton.textContent =
                        "🔊";

                })
                .catch(() => {});

        } else {

            music.pause();

            musicPlaying = false;

            musicButton.textContent =
                "🔇";
        }

    }
);


/* =========================================================
   COUNTDOWN
========================================================= */

const eventDate = new Date(
    "December 12, 2026 20:00:00"
).getTime();


function updateCountdown() {

    const now = new Date().getTime();

    const difference =
        eventDate - now;


    if (difference <= 0) {

        document.getElementById(
            "days"
        ).textContent = "00";

        document.getElementById(
            "hours"
        ).textContent = "00";

        document.getElementById(
            "minutes"
        ).textContent = "00";

        document.getElementById(
            "seconds"
        ).textContent = "00";

        return;
    }


    const days = Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );


    const hours = Math.floor(
        (
            difference %
            (1000 * 60 * 60 * 24)
        ) /
        (1000 * 60 * 60)
    );


    const minutes = Math.floor(
        (
            difference %
            (1000 * 60 * 60)
        ) /
        (1000 * 60)
    );


    const seconds = Math.floor(
        (
            difference %
            (1000 * 60)
        ) /
        1000
    );


    document.getElementById(
        "days"
    ).textContent =
        String(days).padStart(
            2,
            "0"
        );


    document.getElementById(
        "hours"
    ).textContent =
        String(hours).padStart(
            2,
            "0"
        );


    document.getElementById(
        "minutes"
    ).textContent =
        String(minutes).padStart(
            2,
            "0"
        );


    document.getElementById(
        "seconds"
    ).textContent =
        String(seconds).padStart(
            2,
            "0"
        );
}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);


/* =========================================================
   GALERÍA
========================================================= */

const galleryItems =
    document.querySelectorAll(
        ".gallery-item"
    );

const lightbox =
    document.getElementById(
        "lightbox"
    );

const lightboxImage =
    document.getElementById(
        "lightboxImage"
    );

const closeLightbox =
    document.getElementById(
        "closeLightbox"
    );


galleryItems.forEach(
    item => {

        item.addEventListener(
            "click",
            () => {

                const image =
                    item.dataset.image;

                lightboxImage.src =
                    image;

                lightbox.classList.add(
                    "active"
                );

            }
        );

    }
);


closeLightbox.addEventListener(
    "click",
    () => {

        lightbox.classList.remove(
            "active"
        );

        lightboxImage.src = "";

    }
);


lightbox.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            lightbox
        ) {

            lightbox.classList.remove(
                "active"
            );

            lightboxImage.src = "";
        }

    }
);


/* =========================================================
   SPACE INVADERS
========================================================= */

const canvas =
    document.getElementById(
        "gameCanvas"
    );

const ctx =
    canvas.getContext(
        "2d"
    );


/* =========================================================
   ELEMENTOS HUD
========================================================= */

const scoreElement =
    document.getElementById(
        "score"
    );

const highScoreElement =
    document.getElementById(
        "highScore"
    );

const livesElement =
    document.getElementById(
        "lives"
    );

const gameMessage =
    document.getElementById(
        "gameMessage"
    );

const startGameButton =
    document.getElementById(
        "startGame"
    );


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const GAME_WIDTH =
    canvas.width;

const GAME_HEIGHT =
    canvas.height;


/* =========================================================
   ESTADO DEL JUEGO
========================================================= */

let gameRunning = false;

let gameOver = false;

let gameWon = false;

let score = 0;

let lives = 3;

let animationFrame;


/* =========================================================
   HIGH SCORE
========================================================= */

let highScore =
    Number(
        localStorage.getItem(
            "luisRangelSpaceInvadersHighScore"
        )
    ) || 0;


function updateHighScore() {

    if (
        score >
        highScore
    ) {

        highScore =
            score;

        localStorage.setItem(
            "luisRangelSpaceInvadersHighScore",
            highScore
        );

    }

    highScoreElement.textContent =
        String(highScore).padStart(
            5,
            "0"
        );
}


updateHighScore();


/* =========================================================
   JUGADOR
========================================================= */

const player = {

    width: 54,

    height: 25,

    x:
        GAME_WIDTH / 2 - 27,

    y:
        GAME_HEIGHT - 55,

    speed: 7,

    color: "#00ffff",

    shootingCooldown: 0

};


/* =========================================================
   BALAS DEL JUGADOR
========================================================= */

let playerBullets = [];


/* =========================================================
   BALAS ENEMIGAS
========================================================= */

let enemyBullets = [];


/* =========================================================
   INVASORES
========================================================= */

let invaders = [];


const INVADER_ROWS = 5;

const INVADER_COLUMNS = 10;

const INVADER_WIDTH = 36;

const INVADER_HEIGHT = 25;

const INVADER_GAP_X = 18;

const INVADER_GAP_Y = 18;

let invaderDirection = 1;

let invaderSpeed = 0.6;

let invaderDropDistance = 18;

let invaderMoveTimer = 0;


/* =========================================================
   ESTRELLAS DEL ESPACIO
========================================================= */

const stars = [];


for (
    let i = 0;
    i < 100;
    i++
) {

    stars.push({

        x:
            Math.random() *
            GAME_WIDTH,

        y:
            Math.random() *
            GAME_HEIGHT,

        size:
            Math.random() *
            2 + 1,

        speed:
            Math.random() *
            0.4 + 0.1

    });

}


/* =========================================================
   CREAR INVASORES
========================================================= */

function createInvaders() {

    invaders = [];

    const totalWidth =
        (
            INVADER_COLUMNS *
            INVADER_WIDTH
        ) +
        (
            (
                INVADER_COLUMNS - 1
            ) *
            INVADER_GAP_X
        );


    const startX =
        (
            GAME_WIDTH -
            totalWidth
        ) / 2;


    const startY = 65;


    for (
        let row = 0;
        row < INVADER_ROWS;
        row++
    ) {

        for (
            let column = 0;
            column < INVADER_COLUMNS;
            column++
        ) {

            let type;

            if (row === 0) {

                type = 3;

            } else if (
                row <= 2
            ) {

                type = 2;

            } else {

                type = 1;

            }


            invaders.push({

                x:
                    startX +
                    column *
                    (
                        INVADER_WIDTH +
                        INVADER_GAP_X
                    ),

                y:
                    startY +
                    row *
                    (
                        INVADER_HEIGHT +
                        INVADER_GAP_Y
                    ),

                width:
                    INVADER_WIDTH,

                height:
                    INVADER_HEIGHT,

                type:
                    type,

                alive:
                    true

            });

        }

    }

}


/* =========================================================
   DIBUJAR INVASOR
========================================================= */

function drawInvader(
    invader
) {

    if (
        !invader.alive
    ) {
        return;
    }


    const x =
        Math.round(
            invader.x
        );

    const y =
        Math.round(
            invader.y
        );


    let color;


    if (
        invader.type === 3
    ) {

        color =
            "#ff1493";

    } else if (
        invader.type === 2
    ) {

        color =
            "#00ffff";

    } else {

        color =
            "#ffe600";

    }


    ctx.fillStyle =
        color;


    /*
       CABEZA
    */

    ctx.fillRect(
        x + 8,
        y,
        20,
        5
    );


    ctx.fillRect(
        x + 4,
        y + 5,
        28,
        8
    );


    /*
       OJOS
    */

    ctx.fillStyle =
        "#000";

    ctx.fillRect(
        x + 9,
        y + 7,
        5,
        5
    );

    ctx.fillRect(
        x + 22,
        y + 7,
        5,
        5
    );


    /*
       CUERPO
    */

    ctx.fillStyle =
        color;

    ctx.fillRect(
        x + 8,
        y + 13,
        20,
        7
    );


    /*
       BRAZOS
    */

    ctx.fillRect(
        x,
        y + 14,
        8,
        5
    );

    ctx.fillRect(
        x + 28,
        y + 14,
        8,
        5
    );


    /*
       PIERNAS
    */

    ctx.fillRect(
        x + 7,
        y + 20,
        6,
        5
    );

    ctx.fillRect(
        x + 23,
        y + 20,
        6,
        5
    );

}


/* =========================================================
   DIBUJAR JUGADOR
========================================================= */

function drawPlayer() {

    const x =
        Math.round(
            player.x
        );

    const y =
        Math.round(
            player.y
        );


    ctx.fillStyle =
        player.color;


    /*
       CUERPO
    */

    ctx.fillRect(
        x + 8,
        y + 10,
        player.width - 16,
        15
    );


    /*
       CABINA
    */

    ctx.fillRect(
        x + 19,
        y,
        16,
        10
    );


    /*
       ALAS
    */

    ctx.fillRect(
        x,
        y + 18,
        15,
        7
    );

    ctx.fillRect(
        x + player.width - 15,
        y + 18,
        15,
        7
    );


    /*
       NÚCLEO
    */

    ctx.fillStyle =
        "#ff1493";

    ctx.fillRect(
        x + 24,
        y + 4,
        6,
        17
    );

}


/* =========================================================
   DISPARO DEL JUGADOR
========================================================= */

function shootPlayer() {

    if (
        !gameRunning
    ) {
        return;
    }


    if (
        player.shootingCooldown > 0
    ) {
        return;
    }


    playerBullets.push({

        x:
            player.x +
            player.width / 2 -
            2,

        y:
            player.y - 10,

        width:
            4,

        height:
            12,

        speed:
            9

    });


    player.shootingCooldown =
        14;

}


/* =========================================================
   DISPAROS ENEMIGOS
========================================================= */

function enemyShoot() {

    const aliveInvaders =
        invaders.filter(
            invader =>
                invader.alive
        );


    if (
        aliveInvaders.length === 0
    ) {
        return;
    }


    const shooter =
        aliveInvaders[
            Math.floor(
                Math.random() *
                aliveInvaders.length
            )
        ];


    enemyBullets.push({

        x:
            shooter.x +
            shooter.width / 2 -
            2,

        y:
            shooter.y +
            shooter.height,

        width:
            4,

        height:
            12,

        speed:
            4

    });

}


/* =========================================================
   COLISIÓN
========================================================= */

function collision(
    a,
    b
) {

    return (

        a.x <
        b.x + b.width &&

        a.x + a.width >
        b.x &&

        a.y <
        b.y + b.height &&

        a.y + a.height >
        b.y

    );

}


/* =========================================================
   ACTUALIZAR JUGADOR
========================================================= */

const keys = {

    left: false,

    right: false

};


function updatePlayer() {

    if (
        keys.left
    ) {

        player.x -=
            player.speed;

    }


    if (
        keys.right
    ) {

        player.x +=
            player.speed;

    }


    if (
        player.x < 10
    ) {

        player.x = 10;

    }


    if (
        player.x +
        player.width >
        GAME_WIDTH - 10
    ) {

        player.x =
            GAME_WIDTH -
            player.width -
            10;

    }


    if (
        player.shootingCooldown >
        0
    ) {

        player.shootingCooldown--;

    }

}


/* =========================================================
   ACTUALIZAR BALAS
========================================================= */

function updatePlayerBullets() {

    playerBullets.forEach(
        bullet => {

            bullet.y -=
                bullet.speed;

        }
    );


    playerBullets =
        playerBullets.filter(
            bullet =>
                bullet.y +
                bullet.height >
                0
        );

}


/* =========================================================
   ACTUALIZAR BALAS ENEMIGAS
========================================================= */

function updateEnemyBullets() {

    enemyBullets.forEach(
        bullet => {

            bullet.y +=
                bullet.speed;

        }
    );


    enemyBullets =
        enemyBullets.filter(
            bullet =>
                bullet.y <
                GAME_HEIGHT
        );

}


/* =========================================================
   ACTUALIZAR INVASORES
========================================================= */

function updateInvaders() {

    invaderMoveTimer +=
        invaderSpeed;


    if (
        invaderMoveTimer < 1
    ) {
        return;
    }


    invaderMoveTimer = 0;


    let shouldDrop =
        false;


    invaders.forEach(
        invader => {

            if (
                !invader.alive
            ) {
                return;
            }


            invader.x +=
                invaderDirection *
                3;


            if (
                invader.x <= 10 ||
                invader.x +
                invader.width >=
                GAME_WIDTH - 10
            ) {

                shouldDrop = true;

            }

        }
    );


    if (
        shouldDrop
    ) {

        invaderDirection *=
            -1;


        invaders.forEach(
            invader => {

                invader.y +=
                    invaderDropDistance;

            }
        );

    }


    /*
       Acelerar ligeramente
       conforme quedan menos
       invasores.
    */

    const aliveCount =
        invaders.filter(
            invader =>
                invader.alive
        ).length;


    invaderSpeed =
        0.6 +
        (
            (
                INVADER_ROWS *
                INVADER_COLUMNS -
                aliveCount
            ) *
            0.025
        );

}


/* =========================================================
   COLISIONES DE BALAS
========================================================= */

function checkBulletCollisions() {


    /*
       BALAS DEL JUGADOR
    */

    for (
        let i =
            playerBullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            playerBullets[i];


        for (
            let j =
                invaders.length - 1;

            j >= 0;

            j--
        ) {

            const invader =
                invaders[j];


            if (
                !invader.alive
            ) {
                continue;
            }


            if (
                collision(
                    bullet,
                    invader
                )
            ) {

                invader.alive =
                    false;


                playerBullets.splice(
                    i,
                    1
                );


                /*
                   PUNTUACIÓN
                */

                if (
                    invader.type === 3
                ) {

                    score += 30;

                } else if (
                    invader.type === 2
                ) {

                    score += 20;

                } else {

                    score += 10;

                }


                updateHUD();

                break;

            }

        }

    }


    /*
       BALAS ENEMIGAS
    */

    for (
        let i =
            enemyBullets.length - 1;

        i >= 0;

        i--
    ) {

        const bullet =
            enemyBullets[i];


        if (
            collision(
                bullet,
                player
            )
        ) {

            enemyBullets.splice(
                i,
                1
            );


            lives--;

            updateHUD();


            if (
                lives <= 0
            ) {

                endGame(
                    false
                );

            }

        }

    }

}


/* =========================================================
   COMPROBAR VICTORIA
========================================================= */

function checkWin() {

    const alive =
        invaders.filter(
            invader =>
                invader.alive
        );


    if (
        alive.length === 0
    ) {

        endGame(
            true
        );

    }

}


/* =========================================================
   COMPROBAR INVASORES CERCA DEL JUGADOR
========================================================= */

function checkInvaderBottom() {

    const danger =
        invaders.some(
            invader =>
                invader.alive &&
                invader.y +
                invader.height >=
                player.y
        );


    if (
        danger
    ) {

        endGame(
            false
        );

    }

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    scoreElement.textContent =
        String(score).padStart(
            5,
            "0"
        );


    livesElement.textContent =
        lives;


    updateHighScore();

}


/* =========================================================
   DIBUJAR ESTRELLAS
========================================================= */

function drawStars() {

    stars.forEach(
        star => {

            ctx.fillStyle =
                "rgba(255,255,255,0.7)";


            ctx.fillRect(
                star.x,
                star.y,
                star.size,
                star.size
            );


            star.y +=
                star.speed;


            if (
                star.y >
                GAME_HEIGHT
            ) {

                star.y = 0;

                star.x =
                    Math.random() *
                    GAME_WIDTH;

            }

        }
    );

}


/* =========================================================
   DIBUJAR BALAS
========================================================= */

function drawBullets() {

    /*
       JUGADOR
    */

    ctx.fillStyle =
        "#00ffff";


    playerBullets.forEach(
        bullet => {

            ctx.fillRect(
                bullet.x,
                bullet.y,
                bullet.width,
                bullet.height
            );

        }
    );


    /*
       ENEMIGOS
    */

    ctx.fillStyle =
        "#ff1493";


    enemyBullets.forEach(
        bullet => {

            ctx.fillRect(
                bullet.x,
                bullet.y,
                bullet.width,
                bullet.height
            );

        }
    );

}


/* =========================================================
   DISPAROS AUTOMÁTICOS ENEMIGOS
========================================================= */

let enemyShootTimer = 0;


function updateEnemyShooting() {

    enemyShootTimer++;


    if (
        enemyShootTimer >
        55
    ) {

        enemyShootTimer = 0;

        enemyShoot();

    }

}


/* =========================================================
   DIBUJAR TODO
========================================================= */

function drawGame() {

    ctx.clearRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /*
       FONDO
    */

    ctx.fillStyle =
        "#02030b";

    ctx.fillRect(
        0,
        0,
        GAME_WIDTH,
        GAME_HEIGHT
    );


    /*
       ESTRELLAS
    */

    drawStars();


    /*
       INVASORES
    */

    invaders.forEach(
        drawInvader
    );


    /*
       JUGADOR
    */

    drawPlayer();


    /*
       BALAS
    */

    drawBullets();


    /*
       LÍNEA DE DEFENSA
    */

    ctx.fillStyle =
        "rgba(0,255,255,0.15)";

    ctx.fillRect(
        0,
        player.y +
        player.height +
        20,
        GAME_WIDTH,
        1
    );

}


/* =========================================================
   LOOP PRINCIPAL
========================================================= */

function gameLoop() {

    if (
        !gameRunning
    ) {
        return;
    }


    updatePlayer();

    updatePlayerBullets();

    updateEnemyBullets();

    updateInvaders();

    updateEnemyShooting();

    checkBulletCollisions();

    checkInvaderBottom();

    checkWin();

    drawGame();


    if (
        gameRunning
    ) {

        animationFrame =
            requestAnimationFrame(
                gameLoop
            );

    }

}


/* =========================================================
   INICIAR JUEGO
========================================================= */

function startGame() {

    cancelAnimationFrame(
        animationFrame
    );


    gameRunning = true;

    gameOver = false;

    gameWon = false;

    score = 0;

    lives = 3;


    player.x =
        GAME_WIDTH / 2 -
        player.width / 2;


    playerBullets = [];

    enemyBullets = [];


    invaderDirection = 1;

    invaderSpeed = 0.6;

    invaderMoveTimer = 0;

    enemyShootTimer = 0;


    createInvaders();

    updateHUD();


    gameMessage.classList.add(
        "hidden"
    );


    gameLoop();

}


/* =========================================================
   TERMINAR JUEGO
========================================================= */

function endGame(
    won
) {

    if (
        !gameRunning
    ) {
        return;
    }


    gameRunning = false;

    gameWon = won;


    cancelAnimationFrame(
        animationFrame
    );


    updateHighScore();


    gameMessage.classList.remove(
        "hidden"
    );


    const title =
        gameMessage.querySelector(
            "h3"
        );

    const text =
        gameMessage.querySelector(
            "p"
        );


    if (
        won
    ) {

        title.textContent =
            "YOU WIN!";

        title.style.color =
            "#ffe600";

        text.textContent =
            "¡PLANETA SALVADO!";

        startGameButton.textContent =
            "▶ PLAY AGAIN";

    } else {

        title.textContent =
            "GAME OVER";

        title.style.color =
            "#ff1493";

        text.textContent =
            "LOS INVASORES GANARON";

        startGameButton.textContent =
            "▶ TRY AGAIN";

    }

}


/* =========================================================
   BOTÓN START
========================================================= */

startGameButton.addEventListener(
    "click",
    startGame
);


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            keys.left = true;

            event.preventDefault();

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            keys.right = true;

            event.preventDefault();

        }


        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            shootPlayer();

        }

    }
);


document.addEventListener(
    "keyup",
    event => {

        if (
            event.key ===
            "ArrowLeft"
        ) {

            keys.left = false;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            keys.right = false;

        }

    }
);


/* =========================================================
   CONTROLES TÁCTILES
========================================================= */

const leftButton =
    document.getElementById(
        "leftButton"
    );

const rightButton =
    document.getElementById(
        "rightButton"
    );

const shootButton =
    document.getElementById(
        "shootButton"
    );


/*
   IZQUIERDA
*/

leftButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        keys.left = true;

    }
);


leftButton.addEventListener(
    "pointerup",
    () => {

        keys.left = false;

    }
);


leftButton.addEventListener(
    "pointerleave",
    () => {

        keys.left = false;

    }
);


/*
   DERECHA
*/

rightButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        keys.right = true;

    }
);


rightButton.addEventListener(
    "pointerup",
    () => {

        keys.right = false;

    }
);


rightButton.addEventListener(
    "pointerleave",
    () => {

        keys.right = false;

    }
);


/*
   DISPARAR
*/

shootButton.addEventListener(
    "pointerdown",
    event => {

        event.preventDefault();

        shootPlayer();

    }
);


/* =========================================================
   PREVENIR MENÚ CONTEXTUAL
========================================================= */

document.addEventListener(
    "contextmenu",
    event => {

        event.preventDefault();

    }
);


/* =========================================================
   ESTADO INICIAL DEL CANVAS
========================================================= */

createInvaders();

drawGame();