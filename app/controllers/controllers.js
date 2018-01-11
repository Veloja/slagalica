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
            if ($scope.column === 4) {
                checkSkocko($scope.row);
            }
        }
    }

    function checkSkocko(row) {
        var izabrani = $scope.bigArrOfCombinations[row].slice();
        var dobitni = $scope.win.slice();
        var result = [];
        for (var i = 0; i < izabrani.length; i++) {
            if (izabrani[i].id === dobitni[i]) {
                result.push({ color: 'red' });
                izabrani[i] = null;
                dobitni[i] = null;
            }
        }
        for (var i = 0; i < izabrani.length; i++) {
            var current = izabrani[i];
            if (current !== null && dobitni.indexOf(current.id) !== -1) {
                result.push({ color: 'yellow' });
            }
        }

        for (var i = 0; i < result.length; i++) {
            $scope.results[row][i] = result[i];
        }
    }

});

app.controller('KoznaznaController', function ($scope, $timeout, quizService) {

    $scope.questions = quizService.getQuestions();

    $scope.activeQuestion = 0;
    $scope.gameOver = false;
    $scope.disable = false;

    $scope.selectAnswer = function (answer) {
        answer.selected = true;
        $scope.disable = true;
        // first select one answer then check if correct
        $timeout(function () {
            if (answer.selected && answer.correct) {
                answer.success = true;
            } else {
                answer.fail = true;
            };
        }, 2000);

        // 5 seconds after answer is selected go to next question
        if (answer.selected) {
            $timeout(function () {
                $scope.activeQuestion++;
                $scope.disable = false;
            }, 5000);
        }
    }


});

app.controller('AsocijacijeController', function ($scope, quizService) {
    $scope.columns = quizService.getColumns();

    $scope.a1 = false;
    $scope.a2 = false;
    $scope.a3 = false;
    $scope.a4 = false;

    $scope.b1 = false;
    $scope.b2 = false;
    $scope.b3 = false;
    $scope.b4 = false;

    $scope.c1 = false;
    $scope.c2 = false;
    $scope.c3 = false;
    $scope.c4 = false;

    $scope.d1 = false;
    $scope.d2 = false;
    $scope.d3 = false;
    $scope.d4 = false;

    $scope.a = '';
    $scope.aWin = 'rusija';
    $scope.b = '';
    $scope.bWin = 'francuska';
    $scope.c = '';
    $scope.cWin = 'nemacka';
    $scope.d = '';
    $scope.dWin = 'srbija';
    $scope.konacno = '';
    $scope.konacnoWin = 'evropa';

    $scope.submitA = function () {
        if ($scope.a === $scope.aWin) {
            $scope.a1 = true;
            $scope.a2 = true;
            $scope.a3 = true;
            $scope.a4 = true;
            $scope.greenA = true;
        } else {
            $scope.a = '';
        }
    }

    $scope.submitB = function () {
        if ($scope.b === $scope.bWin) {
            $scope.b1 = true;
            $scope.b2 = true;
            $scope.b3 = true;
            $scope.b4 = true;
            $scope.greenB = true;
        } else {
            $scope.b = '';
        }
    }

    $scope.submitC = function () {
        if ($scope.c === $scope.cWin) {
            $scope.c1 = true;
            $scope.c2 = true;
            $scope.c3 = true;
            $scope.c4 = true;
            $scope.greenC = true;
        } else {
            $scope.c = '';
        }
    }

    $scope.submitD = function () {
        if ($scope.d === $scope.dWin) {
            $scope.d1 = true;
            $scope.d2 = true;
            $scope.d3 = true;
            $scope.d4 = true;
            $scope.greenD = true;
        } else {
            $scope.d = '';
        }
    }

    $scope.submitKonacno = function () {
        if ($scope.konacno === $scope.konacnoWin) {
            $scope.d1 = true;
            $scope.d2 = true;
            $scope.d3 = true;
            $scope.d4 = true;
            $scope.a1 = true;
            $scope.a2 = true;
            $scope.a3 = true;
            $scope.a4 = true;
            $scope.b1 = true;
            $scope.b2 = true;
            $scope.b3 = true;
            $scope.b4 = true;
            $scope.c1 = true;
            $scope.c2 = true;
            $scope.c3 = true;
            $scope.c4 = true;
            $scope.greenK = true;
        } else {
            console.log('promasaj');
            $scope.konacno = '';
        }
    }

    $scope.showmeA1 = function () {
        $scope.a1 = true;
    }
    $scope.showmeA2 = function () {
        $scope.a2 = true;
    }
    $scope.showmeA3 = function () {
        $scope.a3 = true;
    }
    $scope.showmeA4 = function () {
        $scope.a4 = true;
    }
    $scope.showmeB1 = function () {
        $scope.b1 = true;
    }
    $scope.showmeB2 = function () {
        $scope.b2 = true;
    }
    $scope.showmeB3 = function () {
        $scope.b3 = true;
    }
    $scope.showmeB4 = function () {
        $scope.b4 = true;
    }
    $scope.showmeC1 = function () {
        $scope.c1 = true;
    }
    $scope.showmeC2 = function () {
        $scope.c2 = true;
    }
    $scope.showmeC3 = function () {
        $scope.c3 = true;
    }
    $scope.showmeC4 = function () {
        $scope.c4 = true;
    }
    $scope.showmeD1 = function () {
        $scope.d1 = true;
    }
    $scope.showmeD2 = function () {
        $scope.d2 = true;
    }
    $scope.showmeD3 = function () {
        $scope.d3 = true;
    }
    $scope.showmeD4 = function () {
        $scope.d4 = true;
    }

});