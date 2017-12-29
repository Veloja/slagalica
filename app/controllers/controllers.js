app.controller('HomeController', function ($scope) {
console.log('HOME CONTROLER IS ACTIVE');
});

app.controller('SpojniceController', function ($scope, quizService) {
    console.log('SPOJNICE CONTROLER IS ACTIVE');
    $scope.writers = quizService.getWriters();
    $scope.novels = quizService.getNovels();
    
// tracking $scopes    
    $scope.trackWriter = 0;
    $scope.currentlyOpenedWriter = $scope.writers[0];
    $scope.writers[0].selected = true;
    $scope.points = 0;
    $scope.cantSelect = false;

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
                    console.log($scope.currentlyOpenedWriter.selected);
                    // if book matches the writer then diselect that book
                        // if($scope.success){
                        //     $scope.cantSelect = book.solved;
                        //     // debugger;
                        // }
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

// need a function to go on to a next writer when matching completed
    function nextWriter(){
        for(var i = 1; i < $scope.writers.length; i++){
            // debugger;
            if($scope.currentlyOpenedWriter.id < $scope.writers[$scope.trackWriter].id){
                $scope.currentlyOpenedWriter = $scope.writers[$scope.trackWriter];
                $scope.currentlyOpenedWriter.selected = true;
            }
        }
    }




















    });