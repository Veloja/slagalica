app.controller('HomeController', function ($scope) {
    console.log('HOME CONTROLER IS ACTIVE');
});

app.controller('SpojniceController', function ($scope, $timeout, quizService) {
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
                    $scope.totalScore.score += 2;
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
        $scope.totalScore = quizService.getTotalScore();
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
    $scope.disable = false;

    // choosing combinations
    $scope.selectedOption = function (option) {
        if (!$scope.gameOver) {
            if ($scope.column === 4) {
                // keep track of rows
                if ($scope.row < 4) {
                    $scope.column = 0;
                    $scope.row++;
                } else {
                    $scope.gameOver = true;
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
                // based on which row give predicted points for right combination
                if (result.length === 4 && result[i].color === 'red') {
                    if ($scope.row === 0) {
                        $scope.points += 6;
                        $scope.totalScore.score += 6;
                        // finish game
                        gameOver();
                    } if ($scope.row === 1) {
                        $scope.points += 5;
                        $scope.totalScore.score += 5;
                        // finish game
                        gameOver();
                    } if ($scope.row === 2) {
                        $scope.points += 4;
                        $scope.totalScore.score += 4;
                        // finish game
                        gameOver();
                    } if ($scope.row === 3) {
                        $scope.points += 3;
                        $scope.totalScore.score += 3;
                        // finish game
                        gameOver();
                    } if ($scope.row === 4) {
                        $scope.points += 2;
                        $scope.totalScore.score += 2;
                        // finish game
                        gameOver();
                    }
                }
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
        // game finished; disable further clicking
        $scope.disable = true;
        $timeout(function () {
            // and wait for few seconds to go to a next one
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
                $scope.totalScore.score += 5;
            } else {
                answer.fail = true;
                $scope.points -= 2;
                $scope.totalScore.score -= 2;
            };
        }, 2000);

        // 2 seconds after answer is selected go to next question
        if (answer.selected) {
            $timeout(function () {
                $scope.activeQuestion++;
                $scope.disable = false;
                // game finished
                if ($scope.activeQuestion > 3) {
                    window.location = 'http://127.0.0.1:8080/#/asocijacije';
                }
            }, 5000);
        }
    }

});

app.controller('AsocijacijeController', function ($scope, quizService) {
    $scope.totalScore = quizService.getTotalScore();
    // Asocijacije tracking score
    $scope.pointsA = 5;
    $scope.pointsB = 5;
    $scope.pointsC = 5;
    $scope.pointsD = 5;
    $scope.gameScore = 20;
    $scope.endSlagalica = false;
    // inputs and solutions
    $scope.columnInputs = ['', '', '', ''];
    $scope.columnSolutions = ['rusija', 'francuska', 'nemacka', 'srbija'];
    $scope.konacno = '';
    $scope.konacnoWin = 'evropa';

    // open clicked field in column
    $scope.open = function (item) {
        item.opened = true;
        item.a = item.text;
    }
    // check Konacno solution and calculate total gameScore
    $scope.submitKonacno = function (colA, colB, colC, colD) {
        if ($scope.konacno === $scope.konacnoWin) {
            // give green class to all columns
            $scope.colA = true;
            $scope.colB = true;
            $scope.colC = true;
            $scope.colD = true;
            $scope.successA = true;
            $scope.successB = true;
            $scope.successC = true;
            $scope.successD = true;
            $scope.endSlagalica = true;
            for (var i = 0; i < 4; i++) {
                // check how many times each column has been opened (how many fields are open)
                //  and substract certain amount of gameScore based on that
                if (colA[i].opened) {
                    $scope.gameScore--;
                } if (colB[i].opened) {
                    $scope.gameScore--;
                } if (colC[i].opened) {
                    $scope.gameScore--;
                } if (colD[i].opened) {
                    $scope.gameScore--;
                }
            } 
        } else {
            $scope.konacno = '';
        }
    }

    $scope.submit = function (column) {
        checkColumns(column);
    }
    // check column solution and give certain points
    function checkColumns(column) {
        for (var i = 0; i < $scope.columnSolutions.length; i++) {
            if ($scope.ArrOfColumns[0] === column) {
                if ($scope.columnInputs[0] === $scope.columnSolutions[0]) {
                    if (column[i].opened) {
                        $scope.pointsA--;
                        $scope.successA = true;
                        $scope.colA = true;
                        console.log('substract points from column A');
                    }
                } else {
                    $scope.columnInputs[0] = '';
                }
            } if ($scope.ArrOfColumns[1] === column) {
                if ($scope.columnInputs[1] === $scope.columnSolutions[1]) {
                    if (column[i].opened) {
                        $scope.pointsB--;
                        $scope.successB = true;
                        $scope.colB = true;
                        console.log('substract points from column B');
                    }
                } else {
                    $scope.columnInputs[1] = '';
                }
            } if ($scope.ArrOfColumns[2] === column) {
                if ($scope.columnInputs[2] === $scope.columnSolutions[2]) {
                    if (column[i].opened) {
                        $scope.pointsC--;
                        $scope.successC = true;
                        $scope.colC = true;
                        console.log('substract points from column C');
                    }
                } else {
                    $scope.columnInputs[2] = '';
                }
            } if ($scope.ArrOfColumns[3] === column) {
                if ($scope.columnInputs[3] === $scope.columnSolutions[3]) {
                    if (column[i].opened) {
                        $scope.pointsD--;
                        $scope.successD = true;
                        $scope.colD = true;
                        console.log('substract points from column D');
                    }
                } else {
                    $scope.columnInputs[3] = '';
                }
            }
        }
    }

    $scope.ArrOfColumns = [
        [{ a: 'A1', text: 'sibir', opened: false },
        { a: 'A2', text: 'moskva', opened: false },
        { a: 'A3', text: 'putin', opened: false },
        { a: 'A4', text: 'dostojevski', opened: false }],
        [{ a: 'B1', text: 'pariz', opened: false },
        { a: 'B2', text: 'ajfelov toranj', opened: false },
        { a: 'B3', text: 'sena', opened: false },
        { a: 'B4', text: 'tur de frans', opened: false }],
        [{ a: 'C1', text: 'berlinski zid', opened: false },
        { a: 'C2', text: 'berlin', opened: false },
        { a: 'C3', text: 'bajern', opened: false },
        { a: 'C4', text: 'gete', opened: false }],
        [{ a: 'D1', text: 'beograd', opened: false },
        { a: 'D2', text: 'zajecar', opened: false },
        { a: 'D3', text: 'ratovi', opened: false },
        { a: 'D4', text: 'beda', opened: false }]
    ];

});