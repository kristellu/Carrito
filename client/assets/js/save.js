function saveStats(data,dataColumnName){
  $.ajax(
    {
      url: 'php/saveStats.php',
      type:'POST',
      dataType: 'text',
      data: {track: trackIndex,
            data: JSON.stringify(data),
            dataColumnName: dataColumnName},
      success: function(data)
      {
        console.log(data);
      }
    }
  );
}

function isJson(str) {
  try {
      JSON.parse(str);
  } catch (e) {
      return false;
  }
  return true;
}

function getStat(dataColumnName){
  $.ajax(
    {
      url: "php/getStats.php",
      type:'POST',
      dataType: 'text',
      data: {track: trackIndex,
            dataColumnName: dataColumnName},
      success: function(data)
      {
        if(isJson(data)){
          // console.log(data);
          data = JSON.parse(data);
        }
        else{
          console.log('Error: achievements data not in JSON format.',data);
        }
        console.log(data);
        return data;
        if(dataColumnName == '1st'){
          // console.log(data);
        }
        else if(dataColumnName == '2nd'){
          // console.log(data);
        }
        else if(dataColumnName == '3rd'){
          // console.log(data);
        }
        else if(dataColumnName == '4th'){
          // console.log(data);
        }
        else{
          console.log('error:',dataColumnName);
        }
      }
    }
  );
}

function sendStatsData() {
  //NEW STUFF
  // function saveLocationData(){
    var data = raceTime;
    var dataColumnName = '1st';
    saveStats(data,dataColumnName);
  // }
  // saveLocationData();
}

function getStatsData(){
  var dataColumnNameArray = ['1st','2nd','3rd','4th'];
  // var dataColumnNameArray = ['location'];
  for(var i = 0; i < dataColumnNameArray.length; i++){
    getStat(dataColumnNameArray[i]);
  }
}
