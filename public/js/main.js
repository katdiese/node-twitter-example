var twitterStream = angular.module('myApp', ['chart.js'])

twitterStream.controller("mainCtrl", ['$scope', 'socket',
function ($scope, socket) {
  //chart labels
  $scope.labels = ["Cat", "Dog"];
  //chart colors
  $scope.colors = ['#6c6a6c','#000000'];

  //intial data values
  $scope.catVDogData = [0,0];


  socket.on('newTweet', function (tweet) {
    $scope.tweetImg = tweet.entities.media[0].media_url;
    $scope.tweet = tweet.text;
    $scope.user = tweet.user.screen_name;
  //   //parse source from payload
    var source = tweet.source.split('>')[1].split('<')[0].split(' ')[2]
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase()
    })
//   //check source and increment for #cat or #dog tweets
    if(hashtags.indexOf('cat' || 'kitten' || 'kittens') !== -1) {
      $scope.catVDogData[0]++;
    } else if (hashtags.indexOf('dog' || 'puppy' || 'puppies') !== -1) {
      $scope.catVDogData[1]++;
    }
  });
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
