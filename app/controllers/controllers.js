app.controller('HomeController', function ($scope) {
console.log('HOME CONTROLER IS ACTIVE');
});

app.controller('SpojniceController', function ($scope, $interval, quizService) {
// retrieving data from quizService
    $scope.writers = quizService.getWriters();
    $scope.novels = quizService.getNovels();
    
// tracking $scopes    
    $scope.trackWriter = 0;
    $scope.currentlyOpenedWriter = $scope.writers[0];
    $scope.writers[0].selected = true;
    $scope.points = 0;
    $scope.cantSelect = false;
    $scope.reloadPage = function(){window.location.reload();}
    $scope.counter = 5;  

// only one writer can be opened
    $scope.openWriter = function(writer){
       if($scope.currentlyOpenedWriter === null){
        writer.selected = true;
        $scope.currentlyOpenedWriter = writer;
       }
    }

// check first if writer is opened
    $scope.openBook = function(book){
        if($scope.currentlyOpenedWriter !== null){
         // if YES, then compare currentlyOpenedWriter and opened book: if correct => 
            if($scope.currentlyOpenedWriter.id === book.writerId){
                $scope.currentlyOpenedWriter.solved = true;
                book.solved = true;
                if($scope.currentlyOpenedWriter.solved === true && book.solved === true){
                    $scope.success = true;
                    $scope.currentlyOpenedWriter.selected = false;
                    $scope.trackWriter++;
                    $scope.points+=2;
                    nextWriter();
                }
        // if currentlyOpenedWriter and opened book don't match =>
            } else {
                $scope.currentlyOpenedWriter.fail = true;
                book.fail = true;
                $scope.trackWriter++;
                nextWriter();
            }
        }
    }
    console.log($scope.currentlyOpenedWriter[0]);

    // FISHER YATES shuffle algorithm
    // function shuffle(array) {
    //     var counter = array.length;
    //     // While there are elements in the array
    //     while (counter > 0) {
    //         // Pick a random index
    //         var index = Math.floor(Math.random() * counter);
    //         // Decrease counter by 1
    //         counter--;
    //         // And swap the last element with it
    //         var temp = array[counter];
    //         array[counter] = array[index];
    //         array[index] = temp;
    //         // set currentlyOpenedWriter on the beginning of an array??????
    //         // $scope.currentlyOpenedWriter[0] = array[index];
    //         // alow currentlyOpenedWriter to go on next writer if they match or not
            
    //     }
     
    //     return array;
    //  }

    //  var arr = $scope.writers;
    //  arr = shuffle(arr);
    //  console.log(arr);
    //  console.log(arr[0]);
    //  console.log($scope.currentlyOpenedWriter[0]);

// function to go on to a next writer when matching completed
    function nextWriter(){
        for(var i = 1; i < $scope.writers.length; i++){
            // debugger;
            if($scope.currentlyOpenedWriter.id < $scope.writers[$scope.trackWriter].id){
                $scope.currentlyOpenedWriter = $scope.writers[$scope.trackWriter];
                $scope.currentlyOpenedWriter.selected = true;
            }
        }
    }

// Countdown time and GAME OVER if counter = 0
    setInterval(function(){
        $scope.counter--;
        $scope.$apply();
        if($scope.counter === 0){
            $timeout.cancel($scope.counter);
        }
    }, 1000);

// When time is up => GAME OVER
   

    });

app.controller('SkockoController', function ($scope, quizService) {
// retrieve 
    $scope.options = quizService.getSigns();

    $scope.firstRow = [];

    $scope.selectedOption = function(sign){
        $scope.firstRow.push(sign);
        sign.chosen = true;
        if($scope.firstRow.length > 3){
            console.log('go to next combination');
        }
    }


    });