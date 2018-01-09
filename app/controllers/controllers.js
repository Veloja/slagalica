app.controller('HomeController', function ($scope) {
    console.log('HOME CONTROLER IS ACTIVE');
});


app.controller('SpojniceController', function ($scope, $interval, quizService) {
    // retrieving data from quizService
    init();

    $scope.reloadPage = function () {
        init();
    }
    $scope.counter = 5;

    // only one writer can be opened
    $scope.openWriter = function (writer) {
        if ($scope.currentlyOpenedWriter === null) {
            writer.selected = true;
            $scope.currentlyOpenedWriter = writer;
        }
    }

    // check first if writer is opened
    $scope.openBook = function (book) {
        if ($scope.currentlyOpenedWriter !== null) {
            // if YES, then compare currentlyOpenedWriter and opened book: if correct => 
            if ($scope.currentlyOpenedWriter.id === book.writerId) {
                $scope.currentlyOpenedWriter.solved = true;
                book.solved = true;
                if ($scope.currentlyOpenedWriter.solved === true && book.solved === true) {
                    $scope.success = true;
                    $scope.currentlyOpenedWriter.selected = false;
                    $scope.points += 2;
                    nextWriter();
                }
                // if currentlyOpenedWriter and opened book don't match =>
            } else {
                $scope.currentlyOpenedWriter.fail = true;
                book.fail = true;
                nextWriter();
            }
        }
    }

    // function to go on to a next writer when matching completed
    function nextWriter() {
        var indexOfCurrentWritter = $scope.writers.indexOf($scope.currentlyOpenedWriter);
        console.log($scope.writers.indexOf($scope.currentlyOpenedWriter));
        var nextWriter = $scope.writers[indexOfCurrentWritter + 1];
        nextWriter.selected = true;
        $scope.currentlyOpenedWriter = nextWriter;
    }

    function init() {
        $scope.writers = quizService.getWriters();
        $scope.writers.forEach(writter => {
            writter.selected = false;
            writter.fail = false;
            writter.success = false;
        });
        $scope.novels = quizService.getNovels();

        $scope.currentlyOpenedWriter = $scope.writers[0];
        $scope.writers[0].selected = true;
        $scope.points = 0;
        $scope.cantSelect = false;
    }

    // Countdown time and GAME OVER if counter = 0
    // setInterval(function(){
    //     $scope.counter--;
    //     $scope.$apply();
    //     if($scope.counter === 0){
    //         $timeout.cancel($scope.counter);
    //     }
    // }, 1000);

    // When time is up => GAME OVER


});

app.controller('SkockoController', function ($scope, quizService) {
    console.log('SKOCKO CTRL');
    // retrieve signs
    $scope.options = quizService.getSigns();
    // winning combination
    $scope.win = [1, 1, 4, 4];
    // arrays
    $scope.bigArrOfCombinations = [
    [{}, {}, {}, {}],
    [{}, {}, {}, {}],
    [{}, {}, {}, {}],
    [{}, {}, {}, {}],
    [{}, {}, {}, {}]
    ];
    $scope.results = [
                      [{}, {}, {}, {}],
                      [{}, {}, {}, {}],
                      [{}, {}, {}, {}],
                      [{}, {}, {}, {}]
                     ];

    $scope.row = 0;
    $scope.column = 0;
    $scope.gameOver = false;
    // Choose myCombination
    $scope.selectedOption = function (option) {
        if (!$scope.gameOver) {
            if ($scope.column === 4) {
                if ($scope.row < 3) {
                    $scope.column = 0;
                    $scope.row++;
                } else {
                    $scope.gameOver = true;
                    return;
                }
            }
            $scope.bigArrOfCombinations[$scope.row][$scope.column] = option;
            $scope.column++;
            if($scope.column === 4){
                checkSkocko($scope.row);
            }
        }
    }

    function checkSkocko(row) {
        var izabrani = $scope.bigArrOfCombinations[row].slice();
        var dobitni = $scope.win.slice();
        var result = [];
        for(var i = 0; i < izabrani.length; i++){
            if(izabrani[i].id === dobitni[i]){
                result.push({ color: 'red' });
                izabrani[i] = null;
                dobitni[i] = null;
            }
        }
        for(var i = 0; i < izabrani.length; i++){
            var current = izabrani[i];
            if(current !== null && dobitni.indexOf(current.id) !== -1){
                result.push({ color: 'yellow' });
            }
        }
        
        for(var i = 0; i < result.length; i++){
            $scope.results[row][i] = result[i];
        }
    }

});

app.controller('KoznaznaController', function ($scope, $timeout, quizService) {

$scope.questions = quizService.getQuestions();

$scope.activeQuestion = 0;
$scope.gameOver = false;
$scope.disable = false;

$scope.selectAnswer = function(answer){
    answer.selected = true;
    $scope.disable = true;
    // first select one answer then check if correct
    $timeout(function() {
        if(answer.selected && answer.correct){
            answer.success = true;
        } else {
            answer.fail = true;
        };
    }, 2000);

    // 5 seconds after answer is selected go to next question
    if(answer.selected){
        $timeout(function() {
            $scope.activeQuestion++;
            $scope.disable = false;
        }, 5000);
    }
    
}




});