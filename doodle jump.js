let isGameOver = false;
let isJumping = false;
let isGoingLeft = false;
let isGoingRight = false;
let upTimerId;
let downTimerId;
let rightTimerId;
let leftTimerId;
let doodlerBottom;
let doodlerLeft;
let platBottom;
let platforms = [];
let platCount = 5;
let platGap;
let startPoint;
let score = 0;

// Class representing a platform
class platform {
    constructor(platBottom) {
        this.bottom = platBottom;
        this.left = Math.random() * 396;
        $(".grid").append("<div class='platform'></div>");
        this.visual = $(".platform:last");
        const visual = this.visual;
        visual.css({
            left: 2 + this.left + "px",
            bottom: this.bottom + "px"
        });
    };
};

// Function to create platform
function createPlatform() {
    $(".grid").append("<div class='scoreDisplay'>" + score + "</div>")
    for (let i = 0; i < platCount; i++) {
        platGap = 550 / platCount;
        platBottom = 70 + i * platGap;
        let newPlatform = new platform(platBottom);
        platforms.push(newPlatform);
    }
};

// Function to create the doodler
function createDoodler() {
    $(".grid").append("<div class='doodler'></div>");
    doodlerBottom = platforms[0].bottom + 15;
    startPoint = doodlerBottom;
    doodlerLeft = platforms[0].left + 29;
    $(".doodler").css("left", doodlerLeft + "px");
    $(".doodler").css("bottom", doodlerBottom + "px");
};

// Function to move platform
function movePlatforms() {
    if (doodlerBottom > 200) {
        platforms.forEach(plat => {
            plat.bottom -= 6;
            let visual = plat.visual;
            visual.css("bottom", plat.bottom + "px");
            if (plat.bottom < 10) {
                let firstPlatform = platforms[0].visual;
                firstPlatform.removeClass("platform");
                platforms.shift();
                score += 1;
                $(".scoreDisplay").text(score);
                let newPlatform = new platform(510);
                platforms.push(newPlatform);
            };
        });
    };
};

// Function to jump
function jump() {
    if (!isJumping) {
        clearInterval(downTimerId);
        isJumping = true;
    };
    upTimerId = setInterval(() => {
        doodlerBottom += 5;
        $(".doodler").css("bottom", doodlerBottom + "px");
        if ((doodlerBottom > startPoint + 200) || (doodlerBottom > 555)) {
            fall();
        };
    }, 15);
};

// Funtion to fall after jumping
function fall() {
    if (isJumping) {
        clearInterval(upTimerId);
        isJumping = false;
    }
    downTimerId = setInterval(() => {
        doodlerBottom -= 5;
        $(".doodler").css("bottom", doodlerBottom + "px");
        if (doodlerBottom < 0) {
            gameOver();
        };
        platforms.forEach(plat => {
            if ((doodlerBottom >= plat.bottom) &&
                (doodlerBottom <= plat.bottom + 15) &&
                (doodlerLeft <= plat.left + 100) &&
                ((doodlerLeft + 45) >= plat.left) &&
                (!isJumping)) {
                startPoint = doodlerBottom;
                jump();
            }
        })
    }, 20);
};

// Function to move left
function left() {
    if (isGoingRight) {
        clearInterval(rightTimerId);
        isGoingRight = false;
    };
    clearInterval(leftTimerId);
    isGoingLeft = true;
    leftTimerId = setInterval(() => {
        if (doodlerLeft > 0) {
            doodlerLeft -= 3;
            $(".doodler").css("left", doodlerLeft + "px");
        } else if (doodlerLeft <= 0) {
            right();
        }
    }, 25);
};

// Function to move right
function right() {
    if (isGoingLeft) {
        clearInterval(leftTimerId);
        isGoingLeft = false;
    };
    clearInterval(rightTimerId);
    isGoingRight = true;
    rightTimerId = setInterval(() => {
        if (doodlerLeft < 450) {
            doodlerLeft += 3;
            $(".doodler").css("left", doodlerLeft + "px");
        } else if (doodlerLeft >= 450) {
            left();
        }
    }, 25);
};

// Function to move straight
function straight() {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
};

// Function to stop game when game over
function gameOver() {
    isGameOver = true;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(rightTimerId);
    clearInterval(leftTimerId);
    $(".grid").html(`<div class='scoreText'>DOODLE JUMP<br><br> YOUR SCORE: ${score}</div><br><br><button id='tryagain'>Try Again</button>`);
    $("#tryagain").on("click", function () {
        location.reload();
    });
    $("html").on("keyup", function (e) {
        if (e.which === 13) {
            location.reload();
        };
    })
};

// Function to controll doodle
function control(e) {
    if (e.which === 38 || e.which === 40) {
        straight();
    } else if (e.which === 37) {
        left();
    } else if (e.which === 39) {
        right();
    };
};

// Function to start game
function start() {
    if (!isGameOver) {
        createPlatform();
        createDoodler();
        setInterval(movePlatforms, 40);
        jump();
        $(document).on("keyup", control);
    };
};
start();