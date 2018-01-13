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
                        $scope.totalScore += 6;
                        // finish game
                        gameOver();
                    } if ($scope.row === 1) {
                        $scope.points += 5;
                        $scope.totalScore += 5;
                        // finish game
                        gameOver();
                    } if ($scope.row === 2) {
                        $scope.points += 4;
                        $scope.totalScore += 4;
                        // finish game
                        gameOver();
                    } if ($scope.row === 3) {
                        $scope.points += 3;
                        $scope.totalScore += 3;
                        // finish game
                        gameOver();
                    } if ($scope.row === 4) {
                        $scope.points += 2;
                        $scope.totalScore += 2;
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
    // $scope.columns = quizService.getColumns();
    $scope.totalScore = quizService.getTotalScore();
    $scope.pointsA = 5;
    $scope.pointsB = 5;
    $scope.pointsC = 5;
    $scope.pointsD = 5;
    $scope.gameScore = 20;
    $scope.columnAinput = '';
    $scope.columnBinput = '';
    $scope.columnCinput = '';
    $scope.columnDinput = '';

    $scope.columnA = [{ a: 'A1', text: 'sibir', opened: false },
    { a: 'A2', text: 'moskva', opened: false },
    { a: 'A3', text: 'putin', opened: false },
    { a: 'A3', text: 'dostojevski', opened: false }];

    $scope.columnB = [{ b: 'A1', text: 'pariz', opened: false },
    { b: 'A2', text: 'ajfelov toranj', opened: false },
    { b: 'A3', text: 'sena', opened: false },
    { b: 'A3', text: 'tur de frans', opened: false }];

    $scope.columnC = [{ c: 'A1', text: 'berlinski zid', opened: false },
    { c: 'A2', text: 'berlin', opened: false },
    { c: 'A3', text: 'bajern', opened: false },
    { c: 'A3', text: 'gete', opened: false }];

    $scope.columnD = [{ d: 'A1', text: 'beograd', opened: false },
    { d: 'A2', text: 'zajecar', opened: false },
    { d: 'A3', text: 'ratovi', opened: false },
    { d: 'A3', text: 'beda', opened: false }];

    $scope.openA = function (option) {
        option.opened = true;
        option.a = option.text;
    }

    $scope.openB = function (option) {
        option.opened = true;
        option.b = option.text;
    }

    $scope.openC = function (option) {
        option.opened = true;
        option.c = option.text;
    }

    $scope.openD = function (option) {
        option.opened = true;
        option.d = option.text;
    }

    $scope.submitA = function () {
        if ($scope.columnAinput === 'rusija') {
            console.log('sve treba da pozeleni');
            // check how many points you have based on opened fields
            checkA();
        } else {
            $scope.columnAinput = '';
        }
    }

    $scope.submitB = function () {
        if ($scope.columnBinput === 'francuska') {
            console.log('sve treba da pozeleni');
            // check how many points you have based on opened fields
            checkB();
        } else {
            $scope.columnBinput = '';
        }
    }

    $scope.submitC = function () {
        if ($scope.columnCinput === 'nemacka') {
            console.log('sve treba da pozeleni');
            // check how many points you have based on opened fields
            checkC();
        } else {
            $scope.columnCinput = '';
        }
    }

    $scope.submitD = function () {
        if ($scope.columnDinput === 'srbija') {
            console.log('sve treba da pozeleni');
            // check how many points you have based on opened fields
            checkD();
        } else {
            $scope.columnDinput = '';
        }
    }

    function checkA(){
        $scope.columnA.forEach(function(option){
            if(option.opened){
                $scope.pointsA--;
                $scope.gameScore--;
            }
        });
    }
    function checkB(){
        $scope.columnB.forEach(function(option){
            if(option.opened){
                $scope.pointsB--;
                $scope.gameScore--;
            }
        });
    }
    function checkC(){
        $scope.columnC.forEach(function(option){
            if(option.opened){
                $scope.pointsC--;
                $scope.gameScore--;
            }
        });
    }
    function checkD(){
        $scope.columnD.forEach(function(option){
            if(option.opened){
                $scope.pointsD--;
                $scope.gameScore--;
            }
        });
    }

    

    });