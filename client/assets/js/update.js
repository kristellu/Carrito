var updateCounter = 0;
var worldScale = 1;

var update = function() {
  if (gameState === 'play') {
    updateCounter++;
    if(false){
      scaleWorld();
    }
    movePlayer();
    moveOpponents();
    checkForCheckpoint(player);
    checkForAiPath();
    updateUi();
    game.physics.arcade.collide(objectGroup, playerGroup, collideObjectPlayer, null, this);
    game.physics.arcade.collide(carGroup, objectGroup);
    game.physics.arcade.collide(carGroup, carGroup, collideCars, null, this);
    game.physics.arcade.collide(carGroup, playerGroup, collideCars, null, this);
    game.physics.arcade.collide(objectGroup, objectGroup);
  }
};

function scaleWorld(){
  if (game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
    worldScale += 0.05;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    worldScale -= 0.05;
  }
  worldScale = Phaser.Math.clamp(worldScale, 0.5, 1.5);
  game.world.scale.set(worldScale);
}

function collideCars(sprite1,sprite2){
  sprite1.speed = Math.floor(sprite1.speed/(1+Math.random()/1000));
  sprite2.speed = Math.floor(sprite2.speed/(1+Math.random()/1000));
}

function collideObjectPlayer(sprite1,sprite2){
  sprite2.speed = Math.floor(sprite2.speed/1.1);
}

function getPosition(){
  var lap = player.lap;
  var checkPointPercent = (player.currentCheckpoint) / numberOfCheckPoints[trackIndex];
  var playerPercentComplete = Math.floor((lap+checkPointPercent)/3*100);
  player.percentComplete = playerPercentComplete;
  player.racePosition = 1;
  carGroup.forEach(function(sprite){
    if(sprite.percentComplete > player.percentComplete){
      player.racePosition++;
    }
    else if(sprite.percentComplete == player.percentComplete){
      if(sprite.lastCheckpointDate < player.lastCheckpointDate){
        player.racePosition++;
      }
    }
  });
}

function opponentPercentComplete(sprite){
  var lap = sprite.lap;
  var checkPointPercent = (sprite.currentAiPath)/numberOfAiPaths[trackIndex];
  var percentComplete = Math.floor((lap+checkPointPercent)/3*100);
  sprite.percentComplete = percentComplete;
  getPosition();
}

function moveOpponents(){
  carGroup.forEach(function(sprite){
    sprite.body.angularVelocity = 0;
    sprite.acceleration = 2 + trackDifficulty/10;

    if(getTile(sprite.x, sprite.y, trackLayer, trackImage) == null){
      sprite.maxSpeed = 300;
    }
    else{
      sprite.maxSpeed = 600 + trackDifficulty*10;
      if(player.racePosition == 1){
        sprite.maxSpeed = 700 + trackDifficulty*10;
      }
      if(player.racePosition < 4){
        sprite.maxSpeed = 550 + trackDifficulty*10;
      }
      if(player.racePosition == 8){
        sprite.maxSpeed = 400 + trackDifficulty*10;
      }
    }
    if(sprite.speed == undefined){
      sprite.speed = 0;
    }
    if(sprite.speed >= sprite.maxSpeed){
      sprite.speed = sprite.maxSpeed + (Math.abs(sprite.speed - sprite.maxSpeed))/2;
    }
    else{
      sprite.speed += sprite.acceleration;
    }
    if(sprite.targetX == undefined || sprite.targetY == undefined){
      sprite.targetX = aiPathCoordinates[sprite.currentAiPath][0] + Math.random()*tileWidth/2 - Math.random()*tileWidth/2;
      sprite.targetY = aiPathCoordinates[sprite.currentAiPath][1] + Math.random()*tileHeight/2 - Math.random()*tileHeight/2;
    }

    var angle1 = sprite.angle;
    sprite.angle = game.math.angleBetween(
      sprite.x, sprite.y,
      sprite.targetX, sprite.targetY
    ) * 180/Math.PI;
    var angle2 = sprite.angle;
    if(Math.abs(angle1-angle2) > 10){
      sprite.angle = rotateDirection(angle1, angle2, (1 + sprite.speed/sprite.maxSpeed * 4) * 2 * Math.random());
    }
    game.physics.arcade.velocityFromAngle(sprite.angle, sprite.speed + trackDifficulty*10, sprite.body.velocity);
  });
  updateSpeedometer();
}

var driftDuration = 0;
function movePlayer(){
  player.body.angularVelocity = 0;
  player.acceleration = 2 + accelerationPerformance/10;
  if(getTile(player.x, player.y, trackLayer, trackImage) == null){
    player.maxSpeed = 300;
  }
  else{
    player.maxSpeed = 600 + speedPerformance*10;
  }
  if(player.speed == undefined){
    player.speed = 0;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
    player.body.angularVelocity = - Math.abs(player.speed / 4);
    keyArrowsImage.visible = false;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
    player.body.angularVelocity = Math.abs(player.speed / 4);
    keyArrowsImage.visible = false;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
    if(player.speed < -10){
      player.speed = Math.floor(player.speed/1.1);
    }
    else if(player.speed >= player.maxSpeed){
      player.speed = player.maxSpeed + (Math.abs(player.speed - player.maxSpeed))/2;
    }
    else{
      player.speed += player.acceleration;
    }
    keyArrowsImage.visible = false;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
    if(player.speed > 10){
      player.speed = Math.ceil(player.speed/1.1);
    }
    else if(player.speed <= -player.maxSpeed){
      player.speed = -player.maxSpeed - (Math.abs(player.speed + player.maxSpeed))/2;
    }
    else{
      player.speed -= player.acceleration;
    }
    keyArrowsImage.visible = false;
  }
  else{
    if(player.speed > player.maxSpeed){
      player.speed = player.maxSpeed + (Math.abs(player.speed - player.maxSpeed))/2;
    }
    else{
      if(player.speed > 0){
        player.speed = Math.floor(player.speed/1.0001);
      }
      if(player.speed < 0){
        player.speed = Math.ceil(player.speed/1.0001);
      }
    }
  }
  // if(player.speed < 9999){
    game.physics.arcade.velocityFromAngle(player.angle, player.speed+handlingPerformance*10, player.body.velocity);
  // }
  // else{
  //   var percentOfMaxSpeed = player.speed/1000;
  //   if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
  //     driftDuration -= 3;
  //     driftDuration = Math.max(Math.min(driftDuration,0),-45);
  //     game.physics.arcade.velocityFromAngle(player.angle+driftDuration*percentOfMaxSpeed, player.speed+handlingPerformance*10, player.body.velocity);
  //   }
  //   else if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
  //     driftDuration += 3;
  //     driftDuration = Math.min(Math.max(driftDuration,0),45);
  //     game.physics.arcade.velocityFromAngle(player.angle+driftDuration*percentOfMaxSpeed, player.speed+handlingPerformance*10, player.body.velocity);
  //   }
  //   else{
  //     game.physics.arcade.velocityFromAngle(player.angle, player.speed+handlingPerformance*10, player.body.velocity);
  //     driftDuration = 0;
  //   }
  // }
}

function checkForCheckpoint(sprite){
  if(getTile(sprite.x, sprite.y, checkpointLayer, checkpointImage) != null){
    if(getTile(sprite.x, sprite.y, checkpointLayer, checkpointImage).index == player.currentCheckpoint){
      sprite.currentCheckpoint++;
      sprite.lastCheckpointDate = new Date();
      // console.log(sprite.currentCheckpoint);
      sprite.currentCheckpoint %= numberOfCheckPoints[trackIndex];
      if(sprite.currentCheckpoint == 0){
        sprite.lap++;
        if(sprite.lap >= 3){
          getPosition();
          raceComplete();
        }
      }
      getPosition();
    }
  }
}

function checkForAiPath(){
  carGroup.forEach(function(sprite){
    if(getTile(sprite.x, sprite.y, aiPathLayer, aiPathImage) != null){
      if(getTile(sprite.x, sprite.y, aiPathLayer, aiPathImage).index == sprite.currentAiPath){
        sprite.currentAiPath++;
        sprite.lastCheckpointDate = new Date();
        sprite.currentAiPath %= numberOfAiPaths[trackIndex];
        if(sprite.currentAiPath == 0){
          sprite.lap++;
        }
        sprite.targetX = aiPathCoordinates[sprite.currentAiPath][0] + Math.random()*tileWidth/2 - Math.random()*tileWidth/2;
        sprite.targetY = aiPathCoordinates[sprite.currentAiPath][1] + Math.random()*tileHeight/2 - Math.random()*tileHeight/2;
        if(sprite.lap >= 3){
          sprite.visible = false;
          // sprite.body.destroy();
          sprite.body.setSize(0, 0, 0, 0);
        }
        opponentPercentComplete(sprite);
      }
    }
  });
}

function updateUi(){
  speedTextImage.text = Math.floor(Math.sqrt(player.body.velocity.x*player.body.velocity.x+player.body.velocity.y*player.body.velocity.y)/10)+' km/h';
  lapCountTextImage.text = 'Lap: '+ Math.min((Math.floor(player.lap)+1),3) + '/3';
  positionCountTextImage.text = 'Position: '+ player.racePosition +'/8';
  raceTime = new Date() - raceStartTime;
  var minutes = Math.floor(raceTime/60000);
  var seconds = Math.floor(raceTime/1000) - minutes *60;
  var tenthSeconds = Math.floor(raceTime/100) - seconds * 10 - minutes * 600;
  if(seconds < 10){
    seconds = '0'+seconds;
  }
  clockTextImage.text = 'Time: ' + minutes+':'+seconds+'.'+tenthSeconds;
}

function raceComplete(){
  // saveStats(1,'1st');
  // saveStats(2,'2nd');
  // saveStats(3,'3rd');
  // saveStats(4,'4th');
  gameState = 'over';
  game.paused = true;
  var moneyWon = getPrizeMoney(player.racePosition);
  prizeMoney += moneyWon;
  moneyTextImage.text = 'Prize Money: $' + prizeMoney;

  // game.world.bringToTop(uiTextImageBackground);
  uiTextImageBackground.visible = true;
  uiTextImage.text = 'Race Complete\nYou finished '+ getOrdinal(player.racePosition) + '\n' + 'You won $' + moneyWon;
  // game.world.bringToTop(uiTextImage);
  setTimeout(reset, 4000);
}

function getPrizeMoney(place){
  if(place == 1){
    return 100 + 100*trackDifficulty;
  }
  else if(place == 2){
    return 50 + 50*trackDifficulty;
  }
  else if(place == 3){
    return 25 + 25*trackDifficulty;
  }
  else if(place == 4){
    return 10 + 10*trackDifficulty;
  }
  else{
    return 0;
  }
}