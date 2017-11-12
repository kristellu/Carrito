function create() {
  disableScrolling();
  gameState = 'land';
  removeLoadingBar();
  createLandingScreen();
  prizeMoney = 0;
  handlingPerformance = 0;
  speedPerformance = 0;
  accelerationPerformance = 0;
  numberOfPerformanceUpgrades = 15;
}

function createBackground(){
  var rectangle = game.add.graphics(0, 0);
  rectangle.beginFill(0X8c8c8c);
  rectangle.drawRect(0, 0, game.width, game.height);
  rectangle.fixedToCamera = true;
}

function overButton(img){
  img.animations.play('down');
}
function outButton(img){
  img.animations.play('up');
}

function createLandingScreen(){
  gameTitleTextImage.text = '';

  uiLandingGroup = game.add.group();
  uiLandingGroup.fixedToCamera = true;

  uiLandingImage = uiLandingGroup.create(game.width/2, -game.height, 'landingImage');
  uiLandingImage.anchor.setTo(0.5, 0.5);

  uiRaceButtongImage = uiLandingGroup.create(game.width/2, -game.height, 'raceButton');
  uiRaceButtongImage.anchor.setTo(0.5, 0.5);
  uiRaceButtongImage.animations.add('up', [0], 1, true);
  uiRaceButtongImage.animations.add('down', [1], 1, true);
  uiRaceButtongImage.animations.play('up');
  uiRaceButtongImage.inputEnabled = true;
  uiRaceButtongImage.events.onInputOver.add(overButton, this);
  uiRaceButtongImage.events.onInputOut.add(outButton, this);
  uiRaceButtongImage.events.onInputDown.add(createCarSelectScreen, this);

  var y = gameTitleTextImage.y;
  gameTitleTextImage.y = 0;
  game.world.bringToTop(gameTitleTextImage);

  var tweenTime = 500;
  tween = game.add.tween(uiLandingImage).to( { y: game.height/2 }, tweenTime, Phaser.Easing.Back.Out, true);
  tween = game.add.tween(uiRaceButtongImage).to( { y: game.height/2 }, tweenTime, Phaser.Easing.Back.Out, true);
}

function destroyLandingScreen() {
  uiLandingGroup.forEach(function(sprite){
    uiLandingGroup.remove(sprite);
    sprite.destroy();
  });
  uiLandingGroup.destroy();
}

function createCarSelectScreen(){
  destroyLandingScreen();

  var tweenTime = 500;

  carIndex = 0;
  uiCarSelectGroup = game.add.group();
  uiCarSelectGroup.fixedToCamera = true;

  uiSelectImage = uiCarSelectGroup.create(0, game.height/2, 'landingImage');
  uiSelectImage.anchor.setTo(0.5, 0.5);
  tween = game.add.tween(uiSelectImage).to( { x: game.width/2 }, tweenTime, Phaser.Easing.Back.Out, true);

  carX = game.width/2;
  carY = game.height/2 - tileHeight;
  uiCarOptionImage = uiCarSelectGroup.create(0, carY, carImageNames[carIndex]+'x2');
  uiCarOptionImage.anchor.setTo(0.5, 0.5);
  tween = game.add.tween(uiCarOptionImage).to( { x: carX }, tweenTime, Phaser.Easing.Back.Out, true);

  uiLeftButtongImage = uiCarSelectGroup.create(0, uiCarOptionImage.y, 'leftArrow');
  uiLeftButtongImage.anchor.setTo(0.5, 0.5);
  uiLeftButtongImage.scale.setTo(2, 2);
  uiLeftButtongImage.inputEnabled = true;
  uiLeftButtongImage.events.onInputDown.add(selectCarToLeft, this);
  tween = game.add.tween(uiLeftButtongImage).to( { x: game.width/2 - uiCarOptionImage.width }, tweenTime, Phaser.Easing.Back.Out, true);

  uiRightButtongImage = uiCarSelectGroup.create(0, uiCarOptionImage.y, 'rightArrow');
  uiRightButtongImage.anchor.setTo(0.5, 0.5);
  uiRightButtongImage.scale.setTo(2, 2);
  uiRightButtongImage.inputEnabled = true;
  uiRightButtongImage.events.onInputDown.add(selectCarToRight, this);
  tween = game.add.tween(uiRightButtongImage).to( { x: game.width/2 + uiCarOptionImage.width }, tweenTime, Phaser.Easing.Back.Out, true);

  function destroyAndReubildCarOption(carIndex){
    var tweenTime = 200;
    tween = game.add.tween(uiCarOptionImage).to( { x: game.width + 100 }, tweenTime, Phaser.Easing.Back.Out, true);
    setTimeout(remove, tweenTime);

    function remove(){
      uiCarOptionImage.destroy();
      uiCarOptionImage = uiCarSelectGroup.create(0 - 100, carY, carImageNames[carIndex]+'x2');
      uiCarOptionImage.anchor.setTo(0.5, 0.5);
      tween = game.add.tween(uiCarOptionImage).to( { x: carX}, tweenTime, Phaser.Easing.Back.Out, true);
    }
  }
  function selectCarToLeft(){
    carIndex--;
    carIndex = Math.abs(carIndex);
    carIndex %= carImageNames.length;
    destroyAndReubildCarOption(carIndex);
    getCarPerformance();
  }

  function selectCarToRight(){
    carIndex++;
    carIndex = Math.abs(carIndex);
    carIndex %= carImageNames.length;
    destroyAndReubildCarOption(carIndex);
    getCarPerformance();
  }

  uiSelectButtongImage = uiCarSelectGroup.create(0, game.height/2 - tileHeight *2.4, 'selectButton');
  uiSelectButtongImage.anchor.setTo(0.5, 0.5);
  uiSelectButtongImage.animations.add('up', [0], 1, true);
  uiSelectButtongImage.animations.add('down', [1], 1, true);
  uiSelectButtongImage.animations.play('up');
  uiSelectButtongImage.inputEnabled = true;
  uiSelectButtongImage.events.onInputOver.add(overButton, this);
  uiSelectButtongImage.events.onInputOut.add(outButton, this);
  uiSelectButtongImage.events.onInputDown.add(createTrackSelectScreen, this);
  tween = game.add.tween(uiSelectButtongImage).to( { x: game.width/2 }, tweenTime, Phaser.Easing.Back.Out, true);

  function createPerformanceBox(x, y, img){
    performanceBoxImage = uiCarSelectGroup.create(0, y, img);
    performanceBoxImage.anchor.setTo(0.5, 0.5);
    tween = game.add.tween(performanceBoxImage).to( { x: x }, tweenTime, Phaser.Easing.Back.Out, true);
    return performanceBoxImage;
  }

  function createPerformanceIndicator(x, y){
    var targetX = x;
    performanceIndicator = [];
    for(var i = 0; i < numberOfPerformanceUpgrades; i++){
      performanceIndicator[i] = uiCarSelectGroup.create(0, y, 'performanceIndicator');
      performanceIndicator[i].anchor.setTo(0.5, 0.5);
      performanceIndicator[i].animations.add('green', [0], 1, true);
      performanceIndicator[i].animations.add('grey', [1], 1, true);
      performanceIndicator[i].animations.play('grey');
      tween = game.add.tween(performanceIndicator[i]).to( { x: targetX - 50 + 16*i }, tweenTime, Phaser.Easing.Back.Out, true);
    }
    return performanceIndicator;
  }

  function createPerformanceIncreaseArrow(x,y){
    performanceIncreaseArrow = uiCarSelectGroup.create(0, y, 'rightArrow');
    performanceIncreaseArrow.anchor.setTo(0.5, 0.5);
    performanceIncreaseArrow.scale.setTo(2, 2);
    performanceIncreaseArrow.inputEnabled = true;
    tween = game.add.tween(performanceIncreaseArrow).to( { x: x }, tweenTime, Phaser.Easing.Back.Out, true);
    return performanceIncreaseArrow;
  }

  uiHandlingBoxImage = createPerformanceBox(game.width/2, game.height/2 + tileHeight * 1, 'handlingBox');
  uiHandlingPerformanceIndicator = createPerformanceIndicator(game.width/2, uiHandlingBoxImage.y);
  if(handlingPerformance < numberOfPerformanceUpgrades - 1){
    uiHandlingIncreaseArrow = createPerformanceIncreaseArrow(game.width/2 + uiHandlingBoxImage.width/2 + 32, uiHandlingBoxImage.y);
    uiHandlingIncreaseArrow.events.onInputDown.add(increaseHandling, this);
  }

  uiSpeedBoxImage = createPerformanceBox(game.width/2, game.height/2 + tileHeight * 1.75, 'speedBox');
  uiSpeedBoxPerformanceIndicator = createPerformanceIndicator(game.width/2, uiSpeedBoxImage.y);
  if(speedPerformance < numberOfPerformanceUpgrades - 1){
    uiSpeedIncreaseArrow = createPerformanceIncreaseArrow(game.width/2 + uiSpeedBoxImage.width/2 + 32, uiSpeedBoxImage.y);
    uiSpeedIncreaseArrow.events.onInputDown.add(increaseSpeed, this);
  }

  uiAcceleractionBoxImage = createPerformanceBox(game.width/2, game.height/2 + tileHeight * 2.5, 'accelerationBox');
  uiAccelerationPerformanceIndicator = createPerformanceIndicator(game.width/2, uiAcceleractionBoxImage.y);
  if(accelerationPerformance < numberOfPerformanceUpgrades - 1){
    uiAccelerationIncreaseArrow = createPerformanceIncreaseArrow(game.width/2 + uiAcceleractionBoxImage.width/2 + 32, uiAcceleractionBoxImage.y);
    uiAccelerationIncreaseArrow.events.onInputDown.add(increaseAcceleration, this);
  }
  createMoneyUi();

  getCarPerformance();
}

function getCarPerformance(){
  var performanceStatImages = [uiHandlingPerformanceIndicator, uiSpeedBoxPerformanceIndicator, uiAccelerationPerformanceIndicator];
  var performanceStats = [handlingPerformance,speedPerformance,accelerationPerformance];
  for(var j = 0; j < performanceStats.length; j++){
    for(var i = 0; i < numberOfPerformanceUpgrades; i++){
      if(i <= performanceStats[j]){
        performanceStatImages[j][i].animations.play('green');
      }
      else{
        performanceStatImages[j][i].animations.play('grey');
      }
    }
  }
}

var popupTextImages = [];
function destroyPopupTextImage(){
  var b = popupTextImages.shift();
  b.destroy();
}

function increaseHandling(){
  var moneyRequired = 50 + 50*handlingPerformance;
  if(prizeMoney >= moneyRequired){
    prizeMoney -= moneyRequired;
    moneyTextImage.text = 'Prize Money: $' + prizeMoney;
    handlingPerformance++;
    getCarPerformance();
    if(handlingPerformance >= numberOfPerformanceUpgrades - 1){
      uiHandlingIncreaseArrow.destroy();
    }
  }
  else{
    var fadeTime = 1500;
    popupTextImage = game.add.text(game.camera.x + game.width / 2, uiHandlingIncreaseArrow.y, 'You need $'+moneyRequired+' to upgrade handling.', {
      font: '30px Arial',
      fill: '#FF0000',
      strokeThickness: 1,
      stroke: '#000000'
    });
    popupTextImage.anchor.setTo(0.5, 0.5);
    game.add.tween(popupTextImage).to( { alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, true, 500, 1400, true);
    popupTextImages.push(popupTextImage);
    setTimeout(destroyPopupTextImage, fadeTime);
  }
}
function increaseSpeed(){
  var moneyRequired = 50 + 50*speedPerformance;
  if(prizeMoney >= 50 + 50*speedPerformance){
    prizeMoney -= 50 + 50*speedPerformance;
    moneyTextImage.text = 'Prize Money: $' + prizeMoney;
    speedPerformance++;
    getCarPerformance();
    if(speedPerformance >= numberOfPerformanceUpgrades - 1){
      uiSpeedIncreaseArrow.destroy();
    }
  }
  else{
    var fadeTime = 1500;
    popupTextImage = game.add.text(game.camera.x + game.width / 2, uiSpeedIncreaseArrow.y, 'You need $'+moneyRequired+' to upgrade speed.', {
      font: '30px Arial',
      fill: '#FF0000',
      strokeThickness: 1,
      stroke: '#000000'
    });
    popupTextImage.anchor.setTo(0.5, 0.5);
    game.add.tween(popupTextImage).to( { alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, true, 500, 1400, true);
    popupTextImages.push(popupTextImage);
    setTimeout(destroyPopupTextImage, fadeTime);
  }
}
function increaseAcceleration(){
  var moneyRequired = 50 + 50*accelerationPerformance;
  if(prizeMoney >= 50 + 50*accelerationPerformance){
    prizeMoney -= 50 + 50*accelerationPerformance;
    moneyTextImage.text = 'Prize Money: $' + prizeMoney;
    accelerationPerformance++;
    getCarPerformance();
    if(accelerationPerformance >= numberOfPerformanceUpgrades - 1){
      uiAccelerationIncreaseArrow.destroy();
    }
  }
  else{
    var fadeTime = 1500;
    popupTextImage = game.add.text(game.camera.x + game.width / 2, uiAccelerationIncreaseArrow.y, 'You need $'+moneyRequired+' to upgrade acceleration.', {
      font: '30px Arial',
      fill: '#FF0000',
      strokeThickness: 1,
      stroke: '#000000'
    });
    popupTextImage.anchor.setTo(0.5, 0.5);
    game.add.tween(popupTextImage).to( { alpha: 0 }, fadeTime, Phaser.Easing.Linear.None, true, 500, 1400, true);
    popupTextImages.push(popupTextImage);
    setTimeout(destroyPopupTextImage, fadeTime);
  }
}

function destroyCarSelectScreen(){
  uiCarSelectGroup.forEach(function(sprite){
    uiCarSelectGroup.remove(sprite);
    sprite.destroy();
  });
  uiCarSelectGroup.destroy();
  uiCarSelectGroup.visible = false;
  moneyTextImage.destroy();
  moneyUiGroup.destroy();
}

function createTrackSelectScreen(){
  destroyCarSelectScreen();

  var tweenTime = 500;
  var trackScale = 1;
  trackDifficulty = 0;
  trackIndex = 0;
  uiTrackSelectGroup = game.add.group();

  uiSelectImage = uiTrackSelectGroup.create( game.camera.x, game.camera.y + game.height/2, 'landingImage');
  uiSelectImage.anchor.setTo(0.5, 0.5);
  tween = game.add.tween(uiSelectImage).to( { x: game.camera.x + game.width/2 }, tweenTime, Phaser.Easing.Back.Out, true);

  trackX = game.camera.x + game.width/2;
  trackY = game.camera.y + game.height/2 + 30;

  uiTrackOptionImage = uiTrackSelectGroup.create(0, trackY, trackImageNames[trackIndex]);
  uiTrackOptionImage.anchor.setTo(0.5, 0.5);
  uiTrackOptionImage.scale.set(trackScale);
  tween = game.add.tween(uiTrackOptionImage).to( { x: trackX }, tweenTime, Phaser.Easing.Back.Out, true);

  uiLeftButtongImage = uiTrackSelectGroup.create(game.camera.x, uiTrackOptionImage.y, 'leftArrow');
  uiLeftButtongImage.anchor.setTo(0.5, 0.5);
  uiLeftButtongImage.scale.setTo(2, 2);
  uiLeftButtongImage.inputEnabled = true;
  uiLeftButtongImage.events.onInputDown.add(selectTrackToLeft, this);
  tween = game.add.tween(uiLeftButtongImage).to( { x: game.camera.x + game.width/2 - uiTrackOptionImage.width/2 -20 }, tweenTime, Phaser.Easing.Back.Out, true);

  uiRightButtongImage = uiTrackSelectGroup.create(game.camera.x, uiTrackOptionImage.y, 'rightArrow');
  uiRightButtongImage.anchor.setTo(0.5, 0.5);
  uiRightButtongImage.scale.setTo(2, 2);
  uiRightButtongImage.inputEnabled = true;
  uiRightButtongImage.events.onInputDown.add(selectTrackToRight, this);
  tween = game.add.tween(uiRightButtongImage).to( { x: game.camera.x + game.width/2 + uiTrackOptionImage.width/2+20 }, tweenTime, Phaser.Easing.Back.Out, true);

  function selectTrackToLeft(){
    trackIndex--;
    changeTrack();
  }

  function selectTrackToRight(){
    trackIndex++;
    changeTrack();
  }

  function changeTrack(){
    var tweenTime = 200;
    trackIndex = Math.abs(trackIndex);
    trackIndex %= trackImageNames.length;
    uiTrackOptionImage.oldX = uiTrackOptionImage.x;
    uiTrackOptionImage.oldY = uiTrackOptionImage.y;
    tween = game.add.tween(uiTrackOptionImage).to( { x: game.camera.x + game.width + uiTrackOptionImage.width }, tweenTime, Phaser.Easing.Back.Out, true);
    setTimeout(remove, tweenTime);
    function remove(){
      var x = trackX;
      var y = trackY;
      uiTrackOptionImage.destroy();
      uiTrackOptionImage = uiTrackSelectGroup.create(game.camera.x, y, trackImageNames[trackIndex]);
      uiTrackOptionImage.anchor.setTo(0.5, 0.5);
      uiTrackOptionImage.scale.set(trackScale);
      tween = game.add.tween(uiTrackOptionImage).to( { x: x }, tweenTime, Phaser.Easing.Back.Out, true);
    }
  }

  uiSelectButtongImage = uiTrackSelectGroup.create(game.camera.x, game.camera.y + game.height/2 - tileHeight *2.4, 'selectButton');
  uiSelectButtongImage.anchor.setTo(0.5, 0.5);
  uiSelectButtongImage.animations.add('up', [0], 1, true);
  uiSelectButtongImage.animations.add('down', [1], 1, true);
  uiSelectButtongImage.animations.play('up');
  uiSelectButtongImage.inputEnabled = true;
  uiSelectButtongImage.events.onInputOver.add(overButton, this);
  uiSelectButtongImage.events.onInputOut.add(outButton, this);
  uiSelectButtongImage.events.onInputDown.add(createRace, this);
  tween = game.add.tween(uiSelectButtongImage).to( { x: game.camera.x + game.width/2 }, tweenTime, Phaser.Easing.Back.Out, true);

  uiWinningsBackgroundImage = uiTrackSelectGroup.create(0, game.camera.y + game.height / 3, 'winningsBackground');
  uiWinningsBackgroundImage.anchor.setTo(0.5, 0.5);
  tween = game.add.tween(uiWinningsBackgroundImage).to( { x: game.camera.x + game.width/2 - uiSelectImage.width/3 }, tweenTime, Phaser.Easing.Back.Out, true);

  trackWinningsTextImage = game.add.text(0, game.camera.y + game.height / 3, 'Winnings:', {
    font: '20px Arial',
    stroke: '#166e93',
    strokeThickness: 1,
    fill: '#1ea7e1'
  });
  trackWinningsTextImage.anchor.setTo(0.5, 0.5);
  tween = game.add.tween(trackWinningsTextImage).to( { x: game.camera.x + game.width/2 - uiSelectImage.width/3 }, tweenTime, Phaser.Easing.Back.Out, true);

  // uiHighscoreBackgroundImage = uiTrackSelectGroup.create(0, game.camera.y + game.height / 3, 'winningsBackground');
  // uiHighscoreBackgroundImage.anchor.setTo(0.5, 0.5);
  // tween = game.add.tween(uiHighscoreBackgroundImage).to( { x: game.camera.x + game.width/2 + uiSelectImage.width/3 }, tweenTime, Phaser.Easing.Back.Out, true);

  // var string = 'Highscores:\n1st:'+getStat('1st')+'\n2nd:'+getStat('2nd')+'\n3rd:'+getStat('3rd')+'\n4th:'+getStat('4th')+'';
  // trackHighscoreTextImage = game.add.text(0, game.camera.y + game.height / 3, string, {
  //   font: '20px Arial',
  //   stroke: '#166e93',
  //   strokeThickness: 1,
  //   fill: '#1ea7e1'
  // });
  // trackHighscoreTextImage.anchor.setTo(0.5, 0.5);
  // tween = game.add.tween(trackHighscoreTextImage).to( { x: game.camera.x + game.width/2 + uiSelectImage.width/3 }, tweenTime, Phaser.Easing.Back.Out, true);

  function createDifficultyBox(x, y, img){
    difficultyBoxImage = uiTrackSelectGroup.create(0, y, img);
    difficultyBoxImage.anchor.setTo(0.5, 0.5);
    tween = game.add.tween(difficultyBoxImage).to( { x: x }, tweenTime, Phaser.Easing.Back.Out, true);
    return difficultyBoxImage;
  }

  function createDifficultyIndicator(x, y){
    var targetX = x;
    difficultyIndicator = [];
    for(var i = 0; i < numberOfPerformanceUpgrades; i++){
      difficultyIndicator[i] = uiTrackSelectGroup.create(0, y, 'performanceIndicator');
      difficultyIndicator[i].anchor.setTo(0.5, 0.5);
      difficultyIndicator[i].animations.add('green', [0], 1, true);
      difficultyIndicator[i].animations.add('grey', [1], 1, true);
      difficultyIndicator[i].animations.play('grey');
      tween = game.add.tween(difficultyIndicator[i]).to( { x: targetX - 50 + 16*i }, tweenTime, Phaser.Easing.Back.Out, true);
    }
    return difficultyIndicator;
  }

  function createDifficultyIncreaseArrow(x,y){
    difficultyIncreaseArrow = uiTrackSelectGroup.create(0, y, 'rightArrow');
    difficultyIncreaseArrow.anchor.setTo(0.5, 0.5);
    difficultyIncreaseArrow.scale.setTo(2, 2);
    difficultyIncreaseArrow.inputEnabled = true;
    tween = game.add.tween(difficultyIncreaseArrow).to( { x: x }, tweenTime, Phaser.Easing.Back.Out, true);
    return difficultyIncreaseArrow;
  }

  function createDifficultyDecreaseArrow(x,y){
    difficultyDecreaseArrow = uiTrackSelectGroup.create(0, y, 'leftArrow');
    difficultyDecreaseArrow.anchor.setTo(0.5, 0.5);
    difficultyDecreaseArrow.scale.setTo(2, 2);
    difficultyDecreaseArrow.inputEnabled = true;
    tween = game.add.tween(difficultyDecreaseArrow).to( { x: x }, tweenTime, Phaser.Easing.Back.Out, true);
    return difficultyDecreaseArrow;
  }

  uiDifficultyBoxImage = createDifficultyBox(game.camera.x + game.width/2, game.camera.y + game.height/2 + uiSelectImage.height/2 - tileHeight * 0.6, 'difficultyBox');
  uiDifficultyPerformanceIndicator = createDifficultyIndicator(game.camera.x + game.width/2, uiDifficultyBoxImage.y);
  uiDifficultyIncreaseArrow = createDifficultyIncreaseArrow(game.camera.x + game.width/2 + uiDifficultyBoxImage.width/2 + 32, uiDifficultyBoxImage.y);
  uiDifficultyIncreaseArrow.events.onInputDown.add(increaseDifficulty, this);
  uiDifficultyDecreaseArrow = createDifficultyDecreaseArrow(game.camera.x + game.width/2 - uiDifficultyBoxImage.width/2 - 32, uiDifficultyBoxImage.y);
  uiDifficultyDecreaseArrow.events.onInputDown.add(decreaseDifficulty, this);

  getTrackDifficulty();
}


function getTrackDifficulty(){
  if(trackDifficulty >= numberOfPerformanceUpgrades){
    trackDifficulty = numberOfPerformanceUpgrades - 1;
  }
  if(trackDifficulty < 0){
    trackDifficulty = 0;
  }
  for(var i = 0; i < numberOfPerformanceUpgrades; i++){
    if(i <= trackDifficulty){
      difficultyIndicator[i].animations.play('green');
    }
    else{
      difficultyIndicator[i].animations.play('grey');
    }
  }
  trackWinningsTextImage.text = 'Winnings:\n1st $'+getPrizeMoney(1)+'\n2nd $'+getPrizeMoney(2)+'\n3rd $'+getPrizeMoney(3)+'\n4th $'+getPrizeMoney(4)+'';
}

function increaseDifficulty(){
  trackDifficulty++;
  getTrackDifficulty();
}

function decreaseDifficulty(){
  trackDifficulty--;
  getTrackDifficulty();
}

function destroyTrackSelectScreen(){
  uiTrackSelectGroup.forEach(function(sprite){
    uiTrackSelectGroup.remove(sprite);
    sprite.destroy();
  });
  uiTrackSelectGroup.destroy();
  trackWinningsTextImage.destroy();
}

function createRace() {
  destroyTrackSelectScreen();

  game.renderer.clearBeforeRender = false;
  game.renderer.roundPixels = true;
  createMap();
  createPlayer();
  var numberOfOpponents = 7;
  createOpponents(numberOfOpponents);
  createStartLights();
  createUi();
  lightIndex = 0;
  setTimeout(updateLight, 1000);
}

function updateLight() {
  lightIndex++;
  startLightsImage.animations.play(''+lightIndex);
  if(lightIndex == 4){
    startRace();
    setTimeout(destroyLight, 1000);
    function destroyLight(){
      startLightsImage.destroy();
      startLightsGroup.destroy();
    }
  }
  else{
    setTimeout(updateLight, 1000);
  }
}

function createStartLights(){
  startLightsGroup = game.add.group();

  startLightsImage = startLightsGroup.create(game.width / 2, game.height / 3, 'startLights');
  startLightsImage.anchor.setTo(0.5, 0.5);
  startLightsImage.animations.add('0', [0], 1, true);
  startLightsImage.animations.add('1', [1], 1, true);
  startLightsImage.animations.add('2', [2], 1, true);
  startLightsImage.animations.add('3', [3], 1, true);
  startLightsImage.animations.add('4', [4], 1, true);
  startLightsImage.animations.play('0');
  startLightsImage.fixedToCamera = true;
}

function startRace(){
  raceStartTime = new Date();
  game.paused = false;
  gameState = 'play';
}

function createMap(){
  var trackNumber = trackIndex + 1;
  numberOfCheckPoints = [8, 20, 13, 9];
  numberOfAiPaths = [8, 20, 13, 9];
  startLocations = [[15,4],[21,9],[15,5],[15,24]];

  mapImage = game.add.tilemap('mapGroundCsv', tileWidth, tileHeight);
  mapImage.addTilesetImage('mapTiles');
  mapLayer = mapImage.createLayer(0);
  mapLayer.resizeWorld();

  checkpointImage = game.add.tilemap('mapCheckpointCsv'+trackNumber, tileWidth, tileHeight);
  checkpointImage.addTilesetImage('mapTiles');
  checkpointLayer = checkpointImage.createLayer(0);
  checkpointLayer.resizeWorld();
  checkpointLayer.visible = false;

  aiPathImage = game.add.tilemap('mapAiPathCsv'+trackNumber, tileWidth, tileHeight);
  aiPathImage.addTilesetImage('mapTiles');
  aiPathLayer = aiPathImage.createLayer(0);
  aiPathLayer.resizeWorld();
  aiPathLayer.visible = false;

  trackImage = game.add.tilemap('mapRoadCsv'+trackNumber, tileWidth, tileHeight);
  trackImage.addTilesetImage('mapTiles');
  trackLayer = trackImage.createLayer(0);
  trackLayer.resizeWorld();

  createObjectMap(trackNumber);

  aiPathCoordinates = [];

  for(var i = 0; i < numberOfAiPaths[trackIndex]; i++){
    aiPathCoordinates[i] = i;
  }

  for(var i = 0; i < aiPathImage.width; i++){
    for(var j = 0; j < aiPathImage.height; j++){
      var value = getTile(i * tileWidth + tileWidth/2, j * tileHeight + tileHeight/2, aiPathLayer, aiPathImage);
      if(value != null){
        aiPathCoordinates[value.index] = [i * tileWidth + tileWidth/2, j * tileHeight + tileHeight/2];
      }
    }
  }
}

var createObjectMap = function(trackNumber) {
  objectGroup = game.add.group();
  objectImage = game.add.tilemap('mapObjectCsv'+trackNumber, tileWidth, tileHeight);
  for (var i = 0; i < objectImage.width; i++) {
    for (var j = 0; j < objectImage.height; j++) {
      if (objectImage.getTile(i, j) !== null) {
        var xTile = i;
        var yTile = j;
        var index = objectImage.getTile(i, j).index;
        var object = objectGroup.create((xTile+0.5)*tileWidth, (yTile+0.5)*tileHeight, objectImageNames[index]);
        object.anchor.set(0.5);
        game.physics.arcade.enable(object);
        if(objectImageNames[index] == 'cone_straight' || objectImageNames[index] == 'barrier_red_race - Copy' || objectImageNames[index] == 'barrier_white_race - Copy' || objectImageNames[index] == 'cone_down - Copy (3)' || objectImageNames[index] == 'barrier_white_race - Copy (2)' || objectImageNames[index] == 'barrier_red_race' || objectImageNames[index] == 'barrier_red_race - Copy (2)' || objectImageNames[index] == 'barrier_red_race - Copy (3)' || objectImageNames[index] == 'cone_down'){
          object.body.drag.x = 100;
          object.body.drag.y = 100;
        }
        else{
          object.body.immovable = true;
          object.body.moves = false;
        }
      }
    }
  }
}

function destroyMap(){
  mapImage.destroy();
  mapLayer.destroy();
  checkpointImage.destroy();
  checkpointLayer.destroy();
  aiPathImage.destroy();
  aiPathLayer.destroy();
  trackImage.destroy();
  trackLayer.destroy();
  objectImage.destroy();
  objectGroup.forEach(function(sprite) {
    objectGroup.remove(sprite);
    sprite.destroy();
  });
  objectGroup.destroy();
}

function createPlayer(){
  playerGroup = game.add.group();
  player = playerGroup.create(0, 0, carImageNames[carIndex]);
  player.anchor.set(0.5);
  game.physics.arcade.enable(player);
  player.body.setSize(33, 33, 15, 0);
  player.body.collideWorldBounds = true;
  player.body.drag.set(100);
  // player.body.drag.y = 0;
  // player.body.drag.x = 9999;
  game.camera.follow(player);
  setPlayerStartLocation();
}

function destroyPlayer(){
  playerGroup.forEach(function(sprite) {
    playerGroup.remove(sprite);
    sprite.destroy();
  });
  playerGroup.destroy();
}

function setPlayerStartLocation(){
  var xTile = startLocations[trackIndex][0];
  var yTile = startLocations[trackIndex][1];
  var x = (xTile + 0.5) * tileWidth;
  var y = (yTile + 0.5) * tileHeight;
  player.x = x;
  player.y = y;
  player.lap = 0;
  player.currentCheckpoint = 0;
  player.angle = 0;
  player.speed = 0;
  player.racePosition = 1;
  game.physics.arcade.velocityFromAngle(player.angle, player.speed, player.body.velocity);
}

function createUi(){
  createKeys();
  createUiTextImage();
  createSpeedUi();
  createLapCount();
  createPositionCount();
  createClockUi();
}

function destroyUi(){
  uiGroup.forEach(function(sprite) {
    uiGroup.remove(sprite);
    sprite.destroy();
  });
  uiGroup.destroy();
  positionCountTextImage.destroy();
  lapCountTextImage.destroy();
  speedTextImage.destroy();
  clockTextImage.destroy();
  for(var i = 0; i < speedometer.length; i++){
    speedometer[i].destroy();
  }
}

function createOpponents(numberOfOpponents){
  carGroup = game.add.group();
  opponents = [];
  for(var i = 0; i < numberOfOpponents; i++){
    opponents[i] = createCar(15, 3, 0);
  }
  setOpponentStartLocation(numberOfOpponents);
}

function destroyOpponents(){
  carGroup.forEach(function(sprite) {
    carGroup.remove(sprite);
    sprite.destroy();
  });
  carGroup.destroy();
}

function setOpponentStartLocation(numberOfOpponents){
  var startTilesOffset = [
    [-1,-1],
    [-2,0],
    [-3,-1],
    [-4,0],
    [-5,-1],
    [-6,0],
    [-7,-1]
  ];
  for(var i = 0; i < numberOfOpponents; i++){
    var xTile = startLocations[trackIndex][0] + startTilesOffset[i][0];
    var yTile = startLocations[trackIndex][1] + startTilesOffset[i][1];
    var x = (xTile+0.5)*tileWidth;
    var y = (yTile+0.5)*tileHeight;
    opponents[i].x = x;
    opponents[i].y = y;
    opponents[i].lap = 0;
    opponents[i].currentAiPath = 0;
    opponents[i].angle = 0;
    opponents[i].targetX = undefined;
    opponents[i].targetY = undefined;
    opponents[i].speed = 0;
    game.physics.arcade.velocityFromAngle(opponents[i].angle, opponents[i].speed, opponents[i].body.velocity);
  }
}

function createCar(xTile,yTile,angle){
  var index = Math.floor(Math.random()*carImageNames.length);
  if(carImageNames[index] == player.key){
    return createCar(xTile,yTile,angle);
  }
  var car = carGroup.create((xTile+0.5)*tileWidth, (yTile+0.5)*tileHeight, carImageNames[index]);
  car.anchor.set(0.5);
  game.physics.arcade.enable(car);
  car.body.setSize(33, 33, 15, 0);

  car.body.collideWorldBounds = true;
  car.checkWorldBounds = true;
  car.angle = angle;
  return car;
}

function createPositionCount(){
  positionCountTextImage = game.add.text(game.width / 2, 64, 'Position: 1/8', {
    font: '30px Arial',
    stroke: '#166e93',
    strokeThickness: 2,
    fill: '#1ea7e1'
  });
  positionCountTextImage.anchor.setTo(0.5, 0);
  positionCountTextImage.fixedToCamera = true;
}

function createLapCount(){
  lapCountTextImage = game.add.text(game.width / 2, 32, 'Lap: 1/3', {
    font: '30px Arial',
    stroke: '#166e93',
    strokeThickness: 2,
    fill: '#1ea7e1'
  });
  lapCountTextImage.anchor.setTo(0.5, 0);
  lapCountTextImage.fixedToCamera = true;
}

function createSpeedUi(){
  uiBackgroundImage = uiGroup.create(game.width / 2, 0,'glassPanel_cornerTL');
  uiBackgroundImage.anchor.setTo(0.5, 0);
  uiBackgroundImage.fixedToCamera = true;

  var circle1 = game.add.graphics(game.width/6, game.height-10);
  circle1.beginFill(0x000000, 1);
  circle1.drawCircle(0, 0, 210);
  circle1.fixedToCamera = true;
  circle1.alpha = 0.5;

  var circle2 = game.add.graphics(game.width/6, game.height-10);
  circle2.beginFill(0xFFFFFF, 1);
  circle2.drawCircle(0, 0, 200);
  circle2.fixedToCamera = true;
  circle2.alpha = 0.5;

  speedTextImage = game.add.text(game.width / 6, game.height - 42, '0 km/h', {
    font: '20px Arial',
    stroke: '#166e93',
    strokeThickness: 2,
    fill: '#1ea7e1'
  });
  speedTextImage.anchor.setTo(0.5, 0.5);
  speedTextImage.fixedToCamera = true;

  var rectangle = game.add.graphics(game.width/6, game.height-10);
  rectangle.beginFill(0xFF0000);
  rectangle.drawRect(0, 0, 95, 3);
  rectangle.angle = -180;
  rectangle.fixedToCamera = true;
  speedometer = [circle1, circle2, rectangle];
}

function updateSpeedometer(){
  var maxSpeed = 90;
  var percentSpeed = player.speed / (maxSpeed * 10);
  speedometer[2].angle = -180 + 180 * Math.abs(percentSpeed);
}

function createClockUi(){
  clockTextImage = game.add.text(game.width / 2, 0, 'Time: 0:00.0', {
    font: '30px Arial',
    stroke: '#166e93',
    strokeThickness: 2,
    fill: '#1ea7e1'
  });
  clockTextImage.anchor.setTo(0.5, 0);
  clockTextImage.fixedToCamera = true;
}

function createMoneyUi(){
  moneyUiGroup = game.add.group();
  var tweenTime = 500;

  moneyTextImageBackground = moneyUiGroup.create(game.camera.x, game.camera.y + game.height/2 - uiSelectImage.height/2 + 4, 'moneyBackground');
  tween = game.add.tween(moneyTextImageBackground).to( { x: game.camera.x + game.width/2 - uiSelectImage.width/2 + 4 }, tweenTime, Phaser.Easing.Back.Out, true);

  moneyTextImage = game.add.text(game.camera.x, moneyTextImageBackground.y + moneyTextImageBackground.height/2 , 'Prize Money: $'+prizeMoney, {
    font: '20px Arial',
    fill: '#000000'
  });
  tween = game.add.tween(moneyTextImage).to( { x: game.camera.x + game.width/2 - uiSelectImage.width/2 + 4 + moneyTextImageBackground.width/2 }, tweenTime, Phaser.Easing.Back.Out, true);
  moneyTextImage.anchor.setTo(0.5, 0.5);
}

function createUiTextImage(){
  uiTextImageBackground = uiGroup.create(game.width / 2, game.height / 2, 'glassPanel_cornerTL_large');
  uiTextImageBackground.anchor.setTo(0.5, 0.5);
  uiTextImageBackground.fixedToCamera = true;
  uiTextImageBackground.visible = false;
  uiTextImage = game.add.text(game.width / 2, game.height / 2 /*- 64*/, '', {
    font: '30px Arial',
    stroke: '#166e93',
    strokeThickness: 2,
    fill: '#1ea7e1'
  });
  uiTextImage.anchor.setTo(0.5, 0.5);
  uiTextImage.fixedToCamera = true;
  uiTextImage.tagDate = new Date();
}

function createKeys(){
  uiGroup = game.add.group();

  var alpha = 1;
  keyArrowsImage = uiGroup.create(0, 0, 'keyArrows');
  keyArrowsImage.x = game.width / 2;
  keyArrowsImage.y = game.height * 3/4;
  keyArrowsImage.anchor.setTo(0.5, 0.5);
  keyArrowsImage.scale.setTo(2, 2);
  keyArrowsImage.alpha = alpha;
  keyArrowsImage.fixedToCamera = true;
}

function reset(){
  destroyUi();
  destroyMap();
  destroyPlayer();
  destroyOpponents();
  uiTextImage.text = '';
  game.paused = false;
  createLandingScreen();
}