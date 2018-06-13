require('find-java-home')(function(err, home){
  if(err)return console.log(err);
  console.log(home);
});