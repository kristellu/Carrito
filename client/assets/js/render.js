var render = function() {
  if (gameState === 'play') {
    if(window.location.href.indexOf("localhost") > -1)
    debugFps();
    if(false){
      debugSprite(player);
      carGroup.forEach(function(sprite){
        debugSprite(sprite);
      });
    }
    if (gameState === 'play') {
    }
  }
};
//***************************************************************************************************************************************************
function debugFps(){
  if(!game.time.advancedTiming){
    game.time.advancedTiming = true;
  }
  game.debug.text('FPS: '+ game.time.fps || 'FPS: '+ '--', 2, game.height - 140, "#00ff00");
}

function debugSprite(sprite){
  game.debug.bodyInfo(sprite, 32, 32);
  game.debug.body(sprite);
}