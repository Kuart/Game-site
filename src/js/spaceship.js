let game = {
  ctx: null,
  width: 600,
  height: 800,
  isStarted: false,
  isGameOver: false,
  isExploded: false,
  status: false, //ship move on X
  localSwitch: false, //text move (game start, between rounds)
  isRoundCompleted: false,
  round: null,
  rounds: [
    { name: 'Раунд завершен', types: [2, 2, 0, 3, 0], isCompleted: false },
    { name: 'Раунд завершен', types: [2, 3, 1, 4, 0], isCompleted: false },
    { name: 'Раунд завершен', types: [3, 2, 2, 3, 1], isCompleted: false },
    { name: 'Раунд завершен', types: [2, 2, 2, 4, 2], isCompleted: false },
    { name: 'Раунд завершен', types: [3, 3, 2, 4, 3], isCompleted: false },
    { name: 'Раунд завершен', types: [4, 5, 3, 3, 0], isCompleted: false },
    { name: 'Раунд завершен', types: [6, 5, 4, 0, 0], isCompleted: false }
  ],
  count: 0,
  score: 0,
  streak: { x2: 2, x3: 3, x5: 5, x10: 10 },
  streakCounter: 0,
  enemiesSpeed: 0.003,
  target: '',
  index: null,
  oldIndex: null,
  shots: [],
  words: [],
  explosions: [],
  sprites: {
    background: null,
    ship: null,
    shot: null,
    enemiesType1: null,
    enemiesType2: null,
    enemiesType3: null,
    enemiesType4: null,
    enemiesType5: null,
    explosion: null,
    button: null,
    score: null,
    streak: null,
    target: null
  },
  audio: {
    shot: null,
    explosion: null,
    background: null
  },
  enemies: null,
  background: null,
  ship: null,
  shot: null,
  button: null,
  scoreView: null,
  streakView: null,
  gameOverText: null,
  roundText: null,
  textOffset: [-0, -18, -36, -54, -72, -0, -18, -36, -54, -72, -0, -18, -36, -54, -72],

  init: function() {
    let canvas = document.querySelector(`.spaceship`);
    this.ctx = canvas.getContext('2d');
  },

  load: function() {
    for (let i in this.sprites) {
      this.sprites[i] = new Image();
      this.sprites[i].src = `../img/${i}.png`;
    }
    this.mouseEventListener(); //449
  },

  start: function() {
    this.init(); //60
    this.load(); //65
    this.run(); //268
  },

  update: function() {
    //background
    this.background.dy -= this.background.speed;
    if (this.background.dy < this.background.height) {
      this.background.dy -= this.background.height;
    }

    if (!this.isGameOver) {
      //ship
      if (!this.status) {
        this.ship.x -= this.ship.speed;
        if (this.ship.x < 210) {
          this.status = true;
        }
      } else if (this.status) {
        this.ship.x += this.ship.speed;
        if (this.ship.x > 230) {
          this.status = false;
        }
      }

      if (this.isStarted) {
        //shots
        for (let i in this.shots) {
          if (this.enemies.length) {
            if (this.shots[i].target.x + this.shots[i].target.sizeX / 2 < 210) {
              this.shots[i].dx += (this.shots[i].x - this.shots[i].target.x) * this.shots[i].speed;
              this.shots[i].x -= this.shots[i].dx;
            } else if (this.shots[i].target.x + this.shots[i].target.sizeX / 2 > 250) {
              this.shots[i].dx += (this.shots[i].x - this.shots[i].target.x) * this.shots[i].speed;
              this.shots[i].x -= this.shots[i].dx;
            } else {
              this.shots[i].x = this.shots[i].target.x;
            }

            this.shots[i].dy += (this.shots[i].y - this.shots[i].target.y) * this.shots[i].speed;
            this.shots[i].y -= this.shots[i].dy;
            if (this.shots[i].y < this.shots[i].target.y + this.shots[i].target.sizeY / 2) {
              this.shots.splice(i, 1);
            }
          }
        }
        //enemies
        for (let i in this.enemies) {
          if (this.enemies[i].x < this.ship.x - 20) {
            if (Math.floor(this.enemies[i].x) != this.ship.x - 20) {
              this.enemies[i].dx += 0.0001;
              this.enemies[i].x += this.enemies[i].dx;
            }
          } else if (Math.floor(this.enemies[i].x) > this.ship.x) {
            if (Math.floor(this.enemies[i].x) != this.ship.x) {
              this.enemies[i].dx += 0.0001;
              this.enemies[i].x -= this.enemies[i].dx;
            }
          }
          this.enemies[i].dy += this.enemies[i].speed;
          this.enemies[i].y += this.enemies[i].dy;
        }
      }
      //exp
      for (let i in this.explosions) {
        this.explosions[i].step++;
        if (this.explosions[i].step > 3) {
          this.explosions[i].step = 0;
          if (this.explosions[i].stepX != 390) {
            this.explosions[i].stepX += 130;
          } else if (this.explosions[i].stepX === 130 && this.explosions[i].stepY === 390) {
            this.explosions.splice(i, 1);
          } else {
            this.explosions[i].stepY += 130;
            this.explosions[i].stepX = 0;
          }
        }
      }
    }
    //text move (301)
    if (this.isRoundCompleted) {
      this.moveText(this.roundText);
    }

    if (this.isGameOver && this.isStarted) {
      this.moveText(this.gameOverText); //endgame text move (301)
      //ship exp
      for (let i in this.explosions) {
        this.explosions[i].step++;
        if (this.explosions[i].step > 4) {
          this.explosions[i].step = 0;
          if (this.explosions[i].stepX != 390) {
            this.explosions[i].stepX += 130;
          } else if (this.explosions[i].stepX === 130 && this.explosions[i].stepY === 390) {
            this.explosions.splice(i, 1);
            this.isExploded = false;
          } else {
            this.explosions[i].stepY += 130;
            this.explosions[i].stepX = 0;
          }
        }
      }
    }
  },

  render: function() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    //bg
    this.ctx.drawImage(
      this.sprites.background,
      this.background.x,
      this.background.y + this.background.dy,
      600,
      1920,
      0,
      0,
      600,
      1920
    );
    if (this.background.dy < this.background.height + 1920) {
      this.ctx.drawImage(
        this.sprites.background,
        this.background.x,
        this.background.y,
        600,
        1900,
        0,
        this.background.height - this.background.dy,
        600,
        1920
      );
    }

    if (!this.isGameOver) {
      //ship
      this.ctx.drawImage(this.sprites.ship, this.ship.x, this.ship.y, 40, 60);
      if (this.isStarted) {
        //shots
        for (let i in this.shots) {
          this.ctx.drawImage(this.sprites.shot, this.shots[i].x, this.shots[i].y, 60, 60);
        }
        //target
        if (this.target) {
          for (let i in this.words) {
            if (this.target === this.words[i]) {
              this.ctx.drawImage(
                this.sprites.target,
                this.enemies[i].x - this.enemies[i].sizeX / 1.9,
                this.enemies[i].y - this.enemies[i].sizeX / 0.9,
                this.enemies[i].sizeX * 2,
                this.enemies[i].sizeY * 2
              );
            }
          }
        }
        //enemys
        for (let i in this.enemies) {
          this.ctx.drawImage(
            this.enemies[i].type,
            this.enemies[i].x,
            this.enemies[i].y,
            this.enemies[i].sizeX,
            this.enemies[i].sizeY
          );
          this.ctx.font = '16px Orbitron';
          this.ctx.fillStyle = '#fff';
          this.ctx.fillText(
            this.words[i],
            this.enemies[i].x,
            this.enemies[i].y + this.enemies[i].sizeY + this.textOffset[i]
          );
        }
        //text
        if (this.isRoundCompleted) {
          this.ctx.font = '20px Orbitron';
          this.ctx.fillStyle = '#fff';
          this.ctx.fillText(
            `${this.roundText.text2} ${this.rounds[this.round].name}`,
            this.roundText.x,
            this.roundText.y
          );
          this.ctx.fillText(
            `${this.roundText.text2} ${this.score}`,
            this.roundText.x,
            this.roundText.y + 50
          );
          this.rounds[this.round].isCompleted = true;
        }
        // window/score text
        this.ctx.font = '20px Orbitron';
        this.ctx.fillStyle = '#000';
        this.ctx.drawImage(
          this.sprites.score,
          this.scoreView.x,
          this.scoreView.y,
          this.scoreView.width,
          this.scoreView.height
        );
        this.ctx.fillText(
          this.score.toString().padStart(3, 0) || this.score,
          this.scoreView.x + this.scoreView.width / 3.2,
          this.scoreView.y + this.scoreView.height / 1.7
        );
        // window/streak  (264)
        this.ctx.drawImage(
          this.sprites.streak,
          this.streakView.x,
          this.streakView.y,
          this.streakView.width,
          this.streakView.height
        );
        this.streakCounter > 300
          ? this.drawStreakText(this.streak.x5)
          : this.streakCounter > 200
          ? this.drawStreakText(this.streak.x4)
          : this.streakCounter > 100
          ? this.drawStreakText(this.streak.x3)
          : this.streakCounter > 50
          ? this.drawStreakText(this.streak.x2)
          : this.drawStreakText(1);
        //exp
        for (let i in this.explosions) {
          this.ctx.drawImage(
            this.sprites.explosion,
            this.explosions[i].stepX,
            this.explosions[i].stepY,
            130,
            130,
            this.explosions[i].x - this.explosions[i].width * 4,
            this.explosions[i].y - this.explosions[i].height * 2,
            this.explosions[i].width * 10,
            this.explosions[i].height * 5
          );
        }
        //isGameOver?(465)
        this.gameOver();
      }
    } else if (this.isGameOver && this.isStarted) {
      this.ctx.font = '20px Orbitron';
      this.ctx.fillStyle = '#fff';
      this.ctx.fillText(this.gameOverText.text1, this.gameOverText.x, this.gameOverText.y);
      this.ctx.fillText(
        `${this.gameOverText.text2} ${this.score}`,
        this.gameOverText.x,
        this.gameOverText.y + 50
      );
      //ship exp
      if (!this.isExploded) {
        for (let i in this.explosions) {
          this.ctx.drawImage(
            this.sprites.explosion,
            this.explosions[i].stepX,
            this.explosions[i].stepY,
            130,
            130,
            this.explosions[i].x - this.explosions[i].width * 6,
            this.explosions[i].y - this.explosions[i].height * 3,
            this.explosions[i].width * 14,
            this.explosions[i].height * 7
          );
        }
      }
    }
    //game start btn
    if (!this.isStarted) {
      this.ctx.font = '20px Orbitron';
      this.ctx.fillStyle = '#fff';
      this.ctx.drawImage(
        this.sprites.button,
        this.button.x,
        this.button.y,
        this.button.width,
        this.button.height
      );
      this.ctx.fillText(
        'Начать игру',
        this.button.x + 55,
        this.button.y + this.button.height / 1.6
      );
    }
  },

  drawStreakText: function(text) {
    return this.ctx.fillText(
      `x${text}`,
      this.streakView.x + this.streakView.width / 3,
      this.streakView.y + this.streakView.height / 1.7
    );
  },

  run: function() {
    this.update(); //(79)
    this.render(); //(180)
    window.requestAnimationFrame(function() {
      game.run(); //268
    });
  },

  startNewRound: function() {
    this.isRoundCompleted = false;
    this.createWords(this.rounds); //421
    this.createEnemies(this.words); //282
  },

  createEnemies: function(arr) {
    let enemies = [];
    for (let i = 0; i < arr.length; i++) {
      enemies.push({
        x: this.randoming(0, 430), //417
        y: -100,
        speed: this.checkType(
          arr[i],
          this.enemiesSpeed,
          this.enemiesSpeed / 2,
          this.enemiesSpeed / 4, //checkType 342
          this.enemiesSpeed / 8,
          this.enemiesSpeed / 16
        ),
        type: this.checkType(
          arr[i],
          this.sprites.enemiesType1,
          this.sprites.enemiesType2,
          this.sprites.enemiesType3,
          this.sprites.enemiesType4,
          this.sprites.enemiesType5
        ),
        sizeX: this.checkType(arr[i], 10, 20, 40, 60, 100),
        sizeY: this.checkType(arr[i], 20, 40, 80, 120, 200),
        dy: 0,
        dx: 0
      });
    }
    this.enemies = enemies;
  },

  moveText: function(obj) {
    this.ctx.font = '20px Orbitron';
    this.ctx.fillStyle = '#fff';
    if (obj.x < 200 && !this.localSwitch) {
      obj.dx += obj.speed;
      obj.x += obj.dx;
      if (obj.x >= 199) {
        this.localSwitch = true;
      }
    } else if (obj.x > -250 && this.localSwitch) {
      obj.dx = 0;
      obj.dx += obj.speed * 4;
      obj.x -= obj.dx;
      if (obj.x <= 100 && obj.status === true) {
        obj.x = 0;
        obj.dx = 0;
        this.localSwitch = false;
        this.isStarted = false;
        this.isGameOver = false;
        this.words = [];
        this.enemies = [];
        this.shots = [];
        this.explosions = [];
        this.score = 0;
        this.streakCounter = 0;
        this.target = '';
        for (let i in this.rounds) {
          this.rounds[i].isCompleted = false;
        }
      } else if (obj.x <= 100 && obj.status === false) {
        this.localSwitch = false;
        this.explosions = [];
        this.target = '';
        obj.x = 0;
        obj.dx = 0;
        this.startNewRound(); //276
      }
    }
  },

  checkType: function(el, value1, value2, value3, value4, value5) {
    return el.length < 4
      ? value1
      : el.length < 6
      ? value2
      : el.length < 9
      ? value3
      : el.length < 12
      ? value4
      : value5;
  },

  shoting: function() {
    document.addEventListener('keypress', e => {
      let code = e.keyCode ? e.keyCode : e.which;
      if (!this.target) {
        let localStatus = false;
        for (let i = 0; i < this.words.length; i++) {
          if (this.words[i][0] === String.fromCharCode(code)) {
            this.streakCounter += 1;
            this.streakCounter > 300
              ? (this.score += this.streak.x10)
              : this.streakCounter > 200
              ? (this.score += this.streak.x5)
              : this.streakCounter > 100
              ? (this.score += this.streak.x3)
              : this.streakCounter > 50
              ? (this.score += this.streak.x2)
              : this.score++;
            this.index = i;
            this.target = this.words[i];
            this.words[i] = this.words[i].slice(1);
            this.target = this.target.slice(1);
            localStatus = true;
            this.shots.push({
              x: this.ship.x - 5,
              y: this.ship.y - 30,
              dx: 0,
              dy: 0,
              speed: 0.003,
              target: this.enemies[i]
            });
            this.shotAudio(); //472
            break;
          }
        }
        if (!localStatus) {
          this.streakCounter = 0;
          this.score - 5 > 0 ? (this.score -= 5) : (this.score = 0);
          lockalStatus = false;
        }
      } else if (this.target[0] === String.fromCharCode(code) && this.target) {
        this.shotAudio(); //472
        this.target = this.target.slice(1);
        this.words[this.index] = this.words[this.index].slice(1);
        this.shots.push({
          x: this.ship.x - 2,
          y: this.ship.y - 30,
          dx: 0,
          dy: 0,
          speed: 0.003,
          target: this.enemies[this.index]
        });
        this.streakCounter += 1;
        this.streakCounter > 300
          ? (this.score += this.streak.x10)
          : this.streakCounter > 200
          ? (this.score += this.streak.x5)
          : this.streakCounter > 100
          ? (this.score += this.streak.x3)
          : this.streakCounter > 50
          ? (this.score += this.streak.x2)
          : this.score++;
        if (this.words[this.index] === '') {
          this.oldIndex = this.index;
          this.enemies[this.oldIndex].speed = 0.005;
          this.enemies[this.oldIndex].dy = 0;
          this.explosions.push({
            x: this.enemies[this.oldIndex].x,
            y: this.enemies[this.oldIndex].y,
            width: this.enemies[this.oldIndex].sizeX,
            height: this.enemies[this.oldIndex].sizeY,
            stepX: 0,
            stepY: 0,
            step: 0
          });
          if (this.index === this.enemies.length - 1) {
            this.words.splice(this.oldIndex, 1);
            this.explosionAudio(); //485
            setTimeout(e => {
              this.enemies.splice(this.oldIndex, 1);
            }, 700);
            if (this.words.length === 0) {
              this.isRoundCompleted = true;
            }
          } else {
            this.words.splice(this.oldIndex, 1);
            this.enemies.splice(this.oldIndex, 1);
            this.explosionAudio(); //485
          }
        }
      } else {
        this.streakCounter = 0;
        this.score - 5 > 0 ? (this.score -= 5) : (this.score = 0);
      }
    });
  },

  randoming: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  createWords: function(round) {
    for (let i in round) {
      if (!round[i].isCompleted) {
        this.round = i;
        this.wordsGenerator(round[i]); //431
        break;
      }
    }
  },

  wordsGenerator: function(round) {
    for (let i = 0; i < round.types.length; i++) {
      for (let j = 0; j < round.types[i]; j++) {
        if (i === 0) {
          this.words.push(this.getUniqueWord(this.wordsType1, this.words));
        } else if (i === 1) {
          this.words.push(this.getUniqueWord(this.wordsType2, this.words));
        } else if (i === 2) {
          this.words.push(this.getUniqueWord(this.wordsType3, this.words));
        } else if (i === 3) {
          this.words.push(this.getUniqueWord(this.wordsType4, this.words));
        } else if (i === 4) {
          this.words.push(this.getUniqueWord(this.wordsType5, this.words));
        }
      }
    }
  },
  getUniqueWord: function(type, words) {
    let check = true;
    while (check) {
      let word = type[this.randoming(0, type.length - 1)];
      if (words.length === 0) {
        return word;
      } else if (!words.some(i => i[0] === word[0])) {
        return word;
      }
    }
  },

  mouseEventListener: function() {
    let canvas = document.querySelector('canvas');
    canvas.addEventListener('click', e => {
      let x = e.pageX - e.target.offsetLeft,
        y = e.pageY - e.target.offsetTop;
      if (
        x >= this.button.x &&
        x <= this.button.x + this.button.width &&
        y >= this.button.y &&
        y <= this.button.y + this.button.height &&
        !this.isStarted
      ) {
        this.isGameOver = false;
        this.isStarted = true;
        this.shoting(); //350
        this.startNewRound(); //276
        this.backgroundAudio(); //492
      }
    });
  },

  gameOver: function() {
    for (let i in this.enemies) {
      if (this.enemies[i].y >= this.ship.y) {
        this.explosions.push({
          x: this.ship.x,
          y: this.ship.y,
          width: this.ship.width,
          height: this.ship.height,
          stepX: 0,
          stepY: 0,
          step: 0
        });
        this.explosionAudio();
        this.audio.background.pause();
        this.audio.background.currentTime = 0.0;
        this.isGameOver = true;
      }
    }
  },

  shotAudio: function() {
    this.audio.shot = new Audio();
    this.audio.shot.src = `../audio/shot.ogg`;
    this.audio.shot.autoplay = true;
    this.audio.shot.volume = 0.6;
  },

  explosionAudio: function() {
    this.audio.explosion = new Audio();
    this.audio.explosion.src = `../audio/explosion.ogg`;
    this.audio.explosion.autoplay = true;
    this.audio.explosion.volume = 0.6;
  },

  backgroundAudio: function() {
    this.audio.background = new Audio();
    this.audio.background.src = '../audio/background.mp3';
    this.audio.background.autoplay = true;
    this.audio.background.loop = true;
    this.audio.background.volume = 0.1;
  }
};

game.background = {
  x: 200,
  y: 0,
  height: -1900,
  dy: 0,
  speed: 0.3
};

game.ship = {
  x: 235,
  y: 650,
  width: 40,
  height: 60,
  speed: 0.1
};

game.button = {
  x: 125,
  y: 200,
  width: 250,
  height: 50
};

game.scoreView = {
  x: 10,
  y: 730,
  width: 100,
  height: 60
};

game.streakView = {
  x: 390,
  y: 730,
  width: 100,
  height: 60
};

game.gameOverText = {
  x: 0,
  y: 300,
  dx: 0,
  speed: 0.1,
  text1: 'Игра окончена',
  text2: `Счет:`,
  status: true
};

game.roundText = {
  x: 0,
  y: 300,
  dx: 0,
  speed: 0.1,
  text1: '',
  text2: 'Счет: ',
  status: false
};

game.wordsType1 = wordsType1;
game.wordsType2 = wordsType2;
game.wordsType3 = wordsType3;
game.wordsType4 = wordsType4;
game.wordsType5 = wordsType5;

window.addEventListener('load', function() {
  game.start();
});
