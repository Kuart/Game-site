let game={ctx:null,width:600,height:800,isStarted:!1,isGameOver:!1,isExploded:!1,status:!1,localSwitch:!1,isRoundCompleted:!1,round:null,rounds:[{name:"Раунд завершен",types:[2,2,0,3,0],isCompleted:!1},{name:"Раунд завершен",types:[2,3,1,4,0],isCompleted:!1},{name:"Раунд завершен",types:[3,2,2,3,1],isCompleted:!1},{name:"Раунд завершен",types:[2,2,2,4,2],isCompleted:!1},{name:"Раунд завершен",types:[3,3,2,4,3],isCompleted:!1},{name:"Раунд завершен",types:[4,5,3,3,0],isCompleted:!1},{name:"Раунд завершен",types:[6,5,4,0,0],isCompleted:!1}],count:0,score:0,streak:{x2:2,x3:3,x5:5,x10:10},streakCounter:0,enemiesSpeed:.003,target:"",index:null,oldIndex:null,shots:[],words:[],explosions:[],sprites:{background:null,ship:null,shot:null,enemiesType1:null,enemiesType2:null,enemiesType3:null,enemiesType4:null,enemiesType5:null,explosion:null,button:null,score:null,streak:null,target:null},audio:{shot:null,explosion:null,background:null},enemies:null,background:(null,{x:200,y:0,height:-1900,dy:0,speed:.3}),ship:(null,{x:235,y:650,width:40,height:60,speed:.1}),shot:null,button:(null,{x:125,y:200,width:250,height:50}),scoreView:(null,{x:10,y:730,width:100,height:60}),streakView:(null,{x:390,y:730,width:100,height:60}),gameOverText:(null,{x:0,y:300,dx:0,speed:.1,text1:"Игра окончена",text2:"Счет:",status:!0}),roundText:(null,{x:0,y:300,dx:0,speed:.1,text1:"",text2:"Счет: ",status:!1}),textOffset:[-0,-18,-36,-54,-72,-0,-18,-36,-54,-72,-0,-18,-36,-54,-72],init:function(){let s=document.querySelector(".spaceship");this.ctx=s.getContext("2d")},load:function(){for(let s in this.sprites)this.sprites[s]=new Image,this.sprites[s].src=`./img/${s}.png`;this.mouseEventListener()},start:function(){this.init(),this.load(),this.run()},update:function(){if(this.background.dy-=this.background.speed,this.background.dy<this.background.height&&(this.background.dy-=this.background.height),!this.isGameOver){if(this.status?this.status&&(this.ship.x+=this.ship.speed,this.ship.x>230&&(this.status=!1)):(this.ship.x-=this.ship.speed,this.ship.x<210&&(this.status=!0)),this.isStarted){for(let s in this.shots)this.enemies.length&&(this.shots[s].target.x+this.shots[s].target.sizeX/2<210?(this.shots[s].dx+=(this.shots[s].x-this.shots[s].target.x)*this.shots[s].speed,this.shots[s].x-=this.shots[s].dx):this.shots[s].target.x+this.shots[s].target.sizeX/2>250?(this.shots[s].dx+=(this.shots[s].x-this.shots[s].target.x)*this.shots[s].speed,this.shots[s].x-=this.shots[s].dx):this.shots[s].x=this.shots[s].target.x,this.shots[s].dy+=(this.shots[s].y-this.shots[s].target.y)*this.shots[s].speed,this.shots[s].y-=this.shots[s].dy,this.shots[s].y<this.shots[s].target.y+this.shots[s].target.sizeY/2&&this.shots.splice(s,1));for(let s in this.enemies)this.enemies[s].x<this.ship.x-20?Math.floor(this.enemies[s].x)!=this.ship.x-20&&(this.enemies[s].dx+=1e-4,this.enemies[s].x+=this.enemies[s].dx):Math.floor(this.enemies[s].x)>this.ship.x&&Math.floor(this.enemies[s].x)!=this.ship.x&&(this.enemies[s].dx+=1e-4,this.enemies[s].x-=this.enemies[s].dx),this.enemies[s].dy+=this.enemies[s].speed,this.enemies[s].y+=this.enemies[s].dy}for(let s in this.explosions)this.explosions[s].step++,this.explosions[s].step>3&&(this.explosions[s].step=0,390!=this.explosions[s].stepX?this.explosions[s].stepX+=130:130===this.explosions[s].stepX&&390===this.explosions[s].stepY?this.explosions.splice(s,1):(this.explosions[s].stepY+=130,this.explosions[s].stepX=0))}if(this.isRoundCompleted&&this.moveText(this.roundText),this.isGameOver&&this.isStarted){this.moveText(this.gameOverText);for(let s in this.explosions)this.explosions[s].step++,this.explosions[s].step>4&&(this.explosions[s].step=0,390!=this.explosions[s].stepX?this.explosions[s].stepX+=130:130===this.explosions[s].stepX&&390===this.explosions[s].stepY?(this.explosions.splice(s,1),this.isExploded=!1):(this.explosions[s].stepY+=130,this.explosions[s].stepX=0))}},render:function(){if(this.ctx.clearRect(0,0,this.width,this.height),this.ctx.drawImage(this.sprites.background,this.background.x,this.background.y+this.background.dy,600,1920,0,0,600,1920),this.background.dy<this.background.height+1920&&this.ctx.drawImage(this.sprites.background,this.background.x,this.background.y,600,1900,0,this.background.height-this.background.dy,600,1920),this.isGameOver){if(this.isGameOver&&this.isStarted&&(this.ctx.font="20px Orbitron",this.ctx.fillStyle="#fff",this.ctx.fillText(this.gameOverText.text1,this.gameOverText.x,this.gameOverText.y),this.ctx.fillText(`${this.gameOverText.text2} ${this.score}`,this.gameOverText.x,this.gameOverText.y+50),!this.isExploded))for(let s in this.explosions)this.ctx.drawImage(this.sprites.explosion,this.explosions[s].stepX,this.explosions[s].stepY,130,130,this.explosions[s].x-6*this.explosions[s].width,this.explosions[s].y-3*this.explosions[s].height,14*this.explosions[s].width,7*this.explosions[s].height)}else if(this.ctx.drawImage(this.sprites.ship,this.ship.x,this.ship.y,40,60),this.isStarted){for(let s in this.shots)this.ctx.drawImage(this.sprites.shot,this.shots[s].x,this.shots[s].y,60,60);if(this.target)for(let s in this.words)this.target===this.words[s]&&this.ctx.drawImage(this.sprites.target,this.enemies[s].x-this.enemies[s].sizeX/1.9,this.enemies[s].y-this.enemies[s].sizeX/.9,2*this.enemies[s].sizeX,2*this.enemies[s].sizeY);for(let s in this.enemies)this.ctx.drawImage(this.enemies[s].type,this.enemies[s].x,this.enemies[s].y,this.enemies[s].sizeX,this.enemies[s].sizeY),this.ctx.font="16px Orbitron",this.ctx.fillStyle="#fff",this.ctx.fillText(this.words[s],this.enemies[s].x,this.enemies[s].y+this.enemies[s].sizeY+this.textOffset[s]);this.isRoundCompleted&&(this.ctx.font="20px Orbitron",this.ctx.fillStyle="#fff",this.ctx.fillText(`${this.roundText.text2} ${this.rounds[this.round].name}`,this.roundText.x,this.roundText.y),this.ctx.fillText(`${this.roundText.text2} ${this.score}`,this.roundText.x,this.roundText.y+50),this.rounds[this.round].isCompleted=!0),this.ctx.font="20px Orbitron",this.ctx.fillStyle="#000",this.ctx.drawImage(this.sprites.score,this.scoreView.x,this.scoreView.y,this.scoreView.width,this.scoreView.height),this.ctx.fillText(this.score.toString().padStart(3,0)||this.score,this.scoreView.x+this.scoreView.width/3.2,this.scoreView.y+this.scoreView.height/1.7),this.ctx.drawImage(this.sprites.streak,this.streakView.x,this.streakView.y,this.streakView.width,this.streakView.height),this.streakCounter>300?this.drawStreakText(this.streak.x5):this.streakCounter>200?this.drawStreakText(this.streak.x4):this.streakCounter>100?this.drawStreakText(this.streak.x3):this.streakCounter>50?this.drawStreakText(this.streak.x2):this.drawStreakText(1);for(let s in this.explosions)this.ctx.drawImage(this.sprites.explosion,this.explosions[s].stepX,this.explosions[s].stepY,130,130,this.explosions[s].x-4*this.explosions[s].width,this.explosions[s].y-2*this.explosions[s].height,10*this.explosions[s].width,5*this.explosions[s].height);this.gameOver()}this.isStarted||(this.ctx.font="20px Orbitron",this.ctx.fillStyle="#fff",this.ctx.drawImage(this.sprites.button,this.button.x,this.button.y,this.button.width,this.button.height),this.ctx.fillText("Начать игру",this.button.x+55,this.button.y+this.button.height/1.6))},drawStreakText:function(s){return this.ctx.fillText(`x${s}`,this.streakView.x+this.streakView.width/3,this.streakView.y+this.streakView.height/1.7)},run:function(){this.update(),this.render(),window.requestAnimationFrame(function(){game.run()})},startNewRound:function(){this.isRoundCompleted=!1,this.createWords(this.rounds),this.createEnemies(this.words)},createEnemies:function(s){let t=[];for(let e=0;e<s.length;e++)t.push({x:this.randoming(0,430),y:-100,speed:this.checkType(s[e],this.enemiesSpeed,this.enemiesSpeed/2,this.enemiesSpeed/4,this.enemiesSpeed/8,this.enemiesSpeed/16),type:this.checkType(s[e],this.sprites.enemiesType1,this.sprites.enemiesType2,this.sprites.enemiesType3,this.sprites.enemiesType4,this.sprites.enemiesType5),sizeX:this.checkType(s[e],10,20,40,60,100),sizeY:this.checkType(s[e],20,40,80,120,200),dy:0,dx:0});this.enemies=t},moveText:function(s){if(this.ctx.font="20px Orbitron",this.ctx.fillStyle="#fff",s.x<200&&!this.localSwitch)s.dx+=s.speed,s.x+=s.dx,s.x>=199&&(this.localSwitch=!0);else if(s.x>-250&&this.localSwitch)if(s.dx=0,s.dx+=4*s.speed,s.x-=s.dx,s.x<=100&&!0===s.status){s.x=0,s.dx=0,this.localSwitch=!1,this.isStarted=!1,this.isGameOver=!1,this.words=[],this.enemies=[],this.shots=[],this.explosions=[],this.score=0,this.streakCounter=0,this.target="";for(let s in this.rounds)this.rounds[s].isCompleted=!1}else s.x<=100&&!1===s.status&&(this.localSwitch=!1,this.explosions=[],this.target="",s.x=0,s.dx=0,this.startNewRound())},checkType:function(s,t,e,i,h,o){return s.length<4?t:s.length<6?e:s.length<9?i:s.length<12?h:o},shoting:function(){document.addEventListener("keypress",s=>{let t=s.keyCode?s.keyCode:s.which;if(this.target)this.target[0]===String.fromCharCode(t)&&this.target?(this.shotAudio(),this.target=this.target.slice(1),this.words[this.index]=this.words[this.index].slice(1),this.shots.push({x:this.ship.x-2,y:this.ship.y-30,dx:0,dy:0,speed:.003,target:this.enemies[this.index]}),this.streakCounter+=1,this.streakCounter>300?this.score+=this.streak.x10:this.streakCounter>200?this.score+=this.streak.x5:this.streakCounter>100?this.score+=this.streak.x3:this.streakCounter>50?this.score+=this.streak.x2:this.score++,""===this.words[this.index]&&(this.oldIndex=this.index,this.enemies[this.oldIndex].speed=.005,this.enemies[this.oldIndex].dy=0,this.explosions.push({x:this.enemies[this.oldIndex].x,y:this.enemies[this.oldIndex].y,width:this.enemies[this.oldIndex].sizeX,height:this.enemies[this.oldIndex].sizeY,stepX:0,stepY:0,step:0}),this.index===this.enemies.length-1?(this.words.splice(this.oldIndex,1),this.explosionAudio(),setTimeout(s=>{this.enemies.splice(this.oldIndex,1)},700),0===this.words.length&&(this.isRoundCompleted=!0)):(this.words.splice(this.oldIndex,1),this.enemies.splice(this.oldIndex,1),this.explosionAudio()))):(this.streakCounter=0,this.score-5>0?this.score-=5:this.score=0);else{let s=!1;for(let e=0;e<this.words.length;e++)if(this.words[e][0]===String.fromCharCode(t)){this.streakCounter+=1,this.streakCounter>300?this.score+=this.streak.x10:this.streakCounter>200?this.score+=this.streak.x5:this.streakCounter>100?this.score+=this.streak.x3:this.streakCounter>50?this.score+=this.streak.x2:this.score++,this.index=e,this.target=this.words[e],this.words[e]=this.words[e].slice(1),this.target=this.target.slice(1),s=!0,this.shots.push({x:this.ship.x-5,y:this.ship.y-30,dx:0,dy:0,speed:.003,target:this.enemies[e]}),this.shotAudio();break}s||(this.streakCounter=0,this.score-5>0?this.score-=5:this.score=0,lockalStatus=!1)}})},randoming:function(s,t){return Math.floor(Math.random()*(t-s+1)+s)},createWords:function(s){for(let t in s)if(!s[t].isCompleted){this.round=t,this.wordsGenerator(s[t]);break}},wordsGenerator:function(s){for(let t=0;t<s.types.length;t++)for(let e=0;e<s.types[t];e++)0===t?this.words.push(this.getUniqueWord(this.wordsType1,this.words)):1===t?this.words.push(this.getUniqueWord(this.wordsType2,this.words)):2===t?this.words.push(this.getUniqueWord(this.wordsType3,this.words)):3===t?this.words.push(this.getUniqueWord(this.wordsType4,this.words)):4===t&&this.words.push(this.getUniqueWord(this.wordsType5,this.words))},getUniqueWord:function(s,t){for(;;){let e=s[this.randoming(0,s.length-1)];if(0===t.length)return e;if(!t.some(s=>s[0]===e[0]))return e}},mouseEventListener:function(){document.querySelector("canvas").addEventListener("click",s=>{let t=s.pageX-s.target.offsetLeft,e=s.pageY-s.target.offsetTop;t>=this.button.x&&t<=this.button.x+this.button.width&&e>=this.button.y&&e<=this.button.y+this.button.height&&!this.isStarted&&(this.isGameOver=!1,this.isStarted=!0,this.shoting(),this.startNewRound(),this.backgroundAudio())})},gameOver:function(){for(let s in this.enemies)this.enemies[s].y>=this.ship.y&&(this.explosions.push({x:this.ship.x,y:this.ship.y,width:this.ship.width,height:this.ship.height,stepX:0,stepY:0,step:0}),this.explosionAudio(),this.audio.background.pause(),this.audio.background.currentTime=0,this.isGameOver=!0)},shotAudio:function(){this.audio.shot=new Audio,this.audio.shot.src="./audio/shot.ogg",this.audio.shot.autoplay=!0,this.audio.shot.volume=.6},explosionAudio:function(){this.audio.explosion=new Audio,this.audio.explosion.src="./audio/explosion.ogg",this.audio.explosion.autoplay=!0,this.audio.explosion.volume=.6},backgroundAudio:function(){this.audio.background=new Audio,this.audio.background.src="./audio/background.mp3",this.audio.background.autoplay=!0,this.audio.background.loop=!0,this.audio.background.volume=.1}};game.wordsType1=wordsType1,game.wordsType2=wordsType2,game.wordsType3=wordsType3,game.wordsType4=wordsType4,game.wordsType5=wordsType5,window.addEventListener("load",function(){game.start()});