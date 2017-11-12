function disableScrolling() {
  $("body").css("overflow", "hidden");
  $(window).scroll(function() {
    scroll(0, 0);
  });
};

function getTile(x,y,layer,image){
  var xTile = layer.getTileX(x);
  var yTile = layer.getTileY(y);
  var tile = image.getTile(xTile, yTile, layer);
  return tile;
}

function getOrdinal(n) {
  if((parseFloat(n) == parseInt(n)) && !isNaN(n)){
    var s=["th","st","nd","rd"],
    v=n%100;
    return n+(s[(v-20)%10]||s[v]||s[0]);
  }
  return n;
}

function rotateDirection( current_angle, target_angle, increment){
  if ( Math.abs( target_angle - current_angle) <= increment || Math.abs( target_angle - current_angle) >= (360 - increment))  {
      current_angle = target_angle;
  }
  else
  {
      if ( Math.abs( target_angle - current_angle) > 180)   {
          if (target_angle < current_angle)     {
              target_angle += 360;
          }
          else
          {
              target_angle -= 360;
          }
      }
      if ( target_angle > current_angle)    {
          current_angle += increment;
      }
      else
      {
          if ( target_angle < current_angle)      {
              current_angle -= increment;
          }
      }
  }
  return current_angle;
}