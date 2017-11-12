var getWindowDimensions = function(){
    var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth;
    y = w.innerHeight || e.clientHeight || g.clientHeight;
    return([x,y]);
};
/*
xworking position counter
xadd clock
xadd spedometer
xgain money when race is won
xability to buy upgrades
xadd all cars to selection
-add new UI images
-create more tracks
-add ability to unlock tracks
-launch
-tweet
-fb post
-stumble upon
-write website blurbs and launch article
-submit pagemap to google
*/

var navBarHeight = 51;//111;//52;
var footerHeight = 20;
var screenWidth = getWindowDimensions()[0];
var screenHeight = getWindowDimensions()[1] - navBarHeight - footerHeight;
var tileHeight = 64;
var tileWidth = 64;

var game = new Phaser.Game(Math.min(screenWidth,600), Math.min(screenHeight,400), Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });
