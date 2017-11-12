var preload = function() {
  createBackground();
  loadStart();
  game.load.onFileComplete.add(fileComplete, this);
  game.load.onLoadComplete.add(loadComplete, this);

  objectImageNames = [
  'arrow_white - Copy (2)',
  'arrow_white - Copy (3)',
  'arrow_white - Copy',
  'arrow_white',
  'arrow_yellow - Copy (2)',
  'arrow_yellow - Copy (3)',
  'arrow_yellow - Copy',
  'arrow_yellow',
  'barrier_red - Copy (2)',
  'barrier_red - Copy (3)',
  'barrier_red - Copy',
  'barrier_red',
  'barrier_red_race - Copy (2)',
  'barrier_red_race - Copy (3)',
  'barrier_red_race - Copy',
  'barrier_red_race',
  'barrier_white - Copy (2)',
  'barrier_white - Copy (3)',
  'barrier_white - Copy',
  'barrier_white',
  'barrier_white_race - Copy (2)',
  'barrier_white_race - Copy (3)',
  'barrier_white_race - Copy',
  'barrier_white_race',
  'cone_down - Copy (2)',
  'cone_down - Copy (3)',
  'cone_down - Copy',
  'cone_down',
  'cone_straight',
  'light_white',
  'light_yellow',
  'lights',
  'oil',
  'rock1 - Copy (2)',
  'rock1 - Copy (3)',
  'rock1 - Copy',
  'rock1',
  'rock2 - Copy (2)',
  'rock2 - Copy (3)',
  'rock2 - Copy',
  'rock2',
  'rock3 - Copy (2)',
  'rock3 - Copy (3)',
  'rock3 - Copy',
  'rock3',
  'skidmark_long_1 - Copy',
  'skidmark_long_1',
  'skidmark_long_2 - Copy (2)',
  'skidmark_long_2 - Copy (3)',
  'skidmark_long_2 - Copy',
  'skidmark_long_2',
  'skidmark_long_3 - Copy',
  'skidmark_long_3',
  'skidmark_short_1 - Copy',
  'skidmark_short_1',
  'skidmark_short_2 - Copy (2)',
  'skidmark_short_2 - Copy (3)',
  'skidmark_short_2 - Copy',
  'skidmark_short_2',
  'skidmark_short_3 - Copy',
  'skidmark_short_3',
  'tent_blue - Copy',
  'tent_blue',
  'tent_blue_large - Copy',
  'tent_blue_large',
  'tent_red - Copy',
  'tent_red',
  'tent_red_large - Copy',
  'tent_red_large',
  'tires_red',
  'tires_red_alt',
  'tires_white',
  'tires_white_alt',
  'tree_large',
  'tree_small',
  'tribune_empty - Copy (2)',
  'tribune_empty - Copy (3)',
  'tribune_empty - Copy',
  'tribune_empty',
  'tribune_full - Copy (2)',
  'tribune_full - Copy (3)',
  'tribune_full - Copy',
  'tribune_full',
  'tribune_overhang_red - Copy (2)',
  'tribune_overhang_red - Copy (3)',
  'tribune_overhang_red - Copy',
  'tribune_overhang_red',
  'tribune_overhang_striped - Copy (2)',
  'tribune_overhang_striped - Copy (3)',
  'tribune_overhang_striped - Copy',
  'tribune_overhang_striped'];

  for(var i = 0; i < objectImageNames.length; i++){
    game.load.image(objectImageNames[i], 'img/Objects/'+objectImageNames[i]+'.png');
  }
  game.load.image('objects', 'img/objects.png');

  carColorNames = ['car_black','car_blue','car_green','car_red','car_yellow'];
  carTypeNames = ['_1','_2','_3','_4','_5'];
  carImageNames =[];
  for(var i = 0; i < carColorNames.length; i++){
    for(var j = 0; j < carTypeNames.length; j++){
      carImageNames.push(carColorNames[i]+carTypeNames[j]);
      game.load.image(carColorNames[i]+carTypeNames[j], 'img/Cars/'+carColorNames[i]+carTypeNames[j]+'.png');
      game.load.image(carColorNames[i]+carTypeNames[j]+'x2', 'img/Cars/'+carColorNames[i]+carTypeNames[j]+'x2.png');
    }
  }
  function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
  }
  shuffle(carImageNames);
  trackImageNames = ['track1','track2','track3','track4'];
  for(var i = 0; i < trackImageNames.length; i++){
    game.load.image(trackImageNames[i], 'img/'+trackImageNames[i]+'/'+trackImageNames[i]+'.png');
  }
  game.load.tilemap('mapGroundCsv', 'img/map.csv', null, Phaser.Tilemap.CSV);
  var numberOfTracks = trackImageNames.length;
  for(var i = 0; i < numberOfTracks; i++){
    game.load.tilemap('mapRoadCsv'+(i+1), 'img/track'+(i+1)+'/track'+(i+1)+'.csv', null, Phaser.Tilemap.CSV);
    game.load.tilemap('mapObjectCsv'+(i+1), 'img/track'+(i+1)+'/objects'+(i+1)+'.csv', null, Phaser.Tilemap.CSV);
    game.load.tilemap('mapCheckpointCsv'+(i+1), 'img/track'+(i+1)+'/track'+(i+1)+'Checkpoint.csv', null, Phaser.Tilemap.CSV);
    game.load.tilemap('mapAiPathCsv'+(i+1), 'img/track'+(i+1)+'/track'+(i+1)+'AiPath.csv', null, Phaser.Tilemap.CSV);
  }

  game.load.spritesheet('mapTiles', 'img/spritesheet_tiles.png', tileWidth, tileHeight);
  game.load.spritesheet('mapObjects', 'img/spritesheet_objects.png', tileWidth, tileHeight);


  // game.load.image('trackBackground', 'img/trackBackground.png');
  uiImageNames = ['glassPanel_cornerTL','glassPanel_cornerTL_large','keyArrows','keySpacebar','landingImage','leftArrow','rightArrow','accelerationBox','handlingBox','speedBox','difficultyBox','moneyBackground','winningsBackground'];
  for(var i = 0; i < uiImageNames.length; i++){
    game.load.image(uiImageNames[i], 'img/ui/'+uiImageNames[i]+'.png');
  }
  game.load.spritesheet('performanceIndicator','img/ui/performanceIndicator.png',8,8);

  game.load.spritesheet('raceButton','img/ui/raceButton.png',120,48);
  game.load.spritesheet('selectButton','img/ui/selectButton.png',120,48);
  game.load.spritesheet('startLights','img/ui/startLights.png',200,50);
}

function loadStart() {
  gameTitleTextImage = game.add.text(game.width / 2, game.height / 2 - tileHeight * 2.5, 'MotorSpeedway', {
    font: '48px Arial',
    stroke: '#166e93',
    strokeThickness: 3,
    fill: '#1ea7e1'
  });
  gameTitleTextImage.anchor.setTo(0.5, 0.5);
  gameTitleTextImage.fixedToCamera = true;

  loadingTextImage = game.add.text(game.width / 2, game.height / 2 - tileHeight, 'Loading ...', {
    font: '32px Arial',
    stroke: '#166e93',
    strokeThickness: 1,
    fill: '#1ea7e1'
  });
  loadingTextImage.anchor.setTo(0.5, 0.5);
  loadingBarBackground = game.add.graphics();
  loadingBarBackground.lineStyle(2, 0xffffff, 1);
  loadingBarBackground.drawRect(game.width / 2 - game.width * 2/3 / 2, game.height / 2 - tileHeight / 2, game.width * 2/3, tileHeight);
  loadingBar = game.add.graphics();
  loadingBar.beginFill(0x1ea7e1);
  loadingBar.lineStyle(2, 0xffffff, 1);
  loadingBar.drawRect(game.width / 2 - loadingBarBackground.width / 2, game.height / 2 - tileHeight / 2, 1, tileHeight);
}

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
  if (cacheKey == 'home') {
    homePageImage = game.add.image(game.width / 2, game.height / 2, 'home');
    homePageImage.anchor.setTo(0.5, 0.5);
    xScale = game.width / homePageImage.width;
    yScale = game.height / homePageImage.height;
    homePageImage.scale.x = Math.max(xScale, yScale);
    homePageImage.scale.y = Math.max(xScale, yScale);
    homePageImage.smoothed = false;
    loadStart();
  }
  loadingTextImage.text = "Loading " + progress + "%";
  loadingBar.clear();
  loadingBar.beginFill(0x1ea7e1);
  loadingBar.lineStyle(2, 0xffffff, 1);
  loadingBar.drawRect(game.width / 2 - loadingBarBackground.width / 2, game.height / 2 - tileHeight / 2, loadingBarBackground.width * progress/100, tileHeight);
}

function loadComplete() {
  loadingTextImage.text = "Load Complete";
  loadingBar.clear();
  loadingBar.beginFill(0x1ea7e1);
  loadingBar.lineStyle(2, 0xffffff, 1);
  loadingBar.drawRect(game.width / 2 - 500 / 2, game.height / 2 - tileHeight / 2, 5 * 100, tileHeight);
}

function removeLoadingBar() {
  loadingBarBackground.clear();
  loadingBar.clear();
  loadingTextImage.text = "";
}