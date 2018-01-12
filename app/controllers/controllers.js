app.controller('HomeController', function ($scope) {
    console.log('HOME CONTROLER IS ACTIVE');
});

app.controller('SpojniceController', function ($scope, $timeout, quizService) {

    $scope.totalScore = quizService.getTotalScore();

    // retrieving data from quizService
    init();

    $scope.reloadPage = function () {
        init();
    }

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
                    $scope.totalScore += 2;
                    nextWriter();
                    gameOver()
                }
                // if currentlyOpenedWriter and opened book don't match =>
            } else {
                $scope.currentlyOpenedWriter.fail = true;
                book.fail = true;
                nextWriter();
                // FINISH GAME FIRST THEN GO TO A NEXT ONE
                gameOver();
            }
        }
    }

    // function to go on to a next writer when matching completed
    function nextWriter() {
        var indexOfCurrentWritter = $scope.writers.indexOf($scope.currentlyOpenedWriter);
        var nextWriter = $scope.writers[indexOfCurrentWritter + 1];
        nextWriter.selected = true;
        $scope.currentlyOpenedWriter = nextWriter;
    }
    // after 5 seconds when all pairs are done, continue on next game
    function gameOver() {
        if ($scope.currentlyOpenedWriter.id === 6) {
            $timeout(function () {
                // game finished
                window.location = 'http://127.0.0.1:8080/#/skocko';
            }, 5000);
        }
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
});

app.controller('SkockoController', function ($scope, $timeout, quizService) {

    $scope.totalScore = quizService.getTotalScore();
    $scope.points = 0;

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
        [{}, {}, {}, {}],
        [{}, {}, {}, {}]
    ];

    $scope.row = 0;
    $scope.column = 0;
    $scope.gameOver = false;

    // 
    $scope.selectedOption = function (option) {
        if (!$scope.gameOver) {
            if ($scope.column === 4) {
                // keep track of rows
                if ($scope.row < 4) {
                    $scope.column = 0;
                    $scope.row++;
                } else {
                    $scope.gameOver = true;
                    if ($scope.gameOver) {
                        gameOver();
                    }
                    return;
                }
            }
            // keep track of column; when 4signs chosen check combination
            $scope.bigArrOfCombinations[$scope.row][$scope.column] = option;
            $scope.column++;
            if ($scope.column === 4) {
                checkSkocko($scope.row);
            }
        }
    }
    // main algorithm that checks selected combination and display them with red and yellow
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
    

        function gameOver() {
            $timeout(function () {
                // game finished
                window.location = 'http://127.0.0.1:8080/#/koznazna';
            }, 5000);
        }

    });

app.controller('KoznaznaController', function ($scope, $timeout, quizService) {

    $scope.totalScore = quizService.getTotalScore();

    $scope.questions = quizService.getQuestions();

    $scope.activeQuestion = 0;
    $scope.gameOver = false;
    $scope.disable = false;
    $scope.points = 0;

    $scope.selectAnswer = function (answer) {
        answer.selected = true;
        $scope.disable = true;
        // first select one answer then check if correct and wait for 2sec to check if correct
        $timeout(function () {
            if (answer.selected && answer.correct) {
                answer.success = true;
                $scope.points += 5;
                $scope.totalScore += 5;
            } else {
                answer.fail = true;
                $scope.points -= 2;
                $scope.totalScore -= 2;
            };
        }, 2000);

        // 2 seconds after answer is selected go to next question
        if (answer.selected) {
            $timeout(function () {
                $scope.activeQuestion++;
                $scope.disable = false;
                // game finished
                if ($scope.activeQuestion > 3) {
                    conosle.log('FINISH GAME THEN GO TO NEXT ONE');
                    window.location = 'http://127.0.0.1:8080/#/asocijacije';
                }
            }, 5000);
        }
    }

});

app.controller('AsocijacijeController', function ($scope, quizService) {
    $scope.columns = quizService.getColumns();
    $scope.totalScore = quizService.getTotalScore();
    $scope.points = 0;

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