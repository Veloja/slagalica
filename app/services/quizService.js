app.service('quizService', function(){

    // TOTAL SCORE
    this.getTotalScore = function(){
        return totalScore;
    }
    var totalScore = { score: 0};
    
    var leftColumnOptions = [];
    var rightColumnOptions = [];
    
    var cities = [{id: 1,
                  name: "Beograd"},
                 {id: 2,
                  name: "Bec"},
                 {id: 3,
                  name: "Amsterdam"},
                  {id: 4,
                    name: "Paris"},
                   {id: 5,
                    name: "New York"},
                   {id: 6,
                    name: "Tokyo"}];

    var writers = [{id: 1,
                        name: "Mesa Selimovic",
                        selected: false,
                        solved: false,
                        fail: false},
                        {id: 2,
                        name: "Ivo Andric",
                        selected: false,
                        solved: false,
                        fail: false},
                        {id: 3,
                        name: "Borislav Pekic",
                        selected: false,
                        solved: false,
                        fail: false},
                        {id: 4,
                        name: "Danilo Kis",
                        selected: false,
                        solved: false,
                        fail: false},
                        {id: 5,
                        name: "Slobodan Selenic",
                        selected: false,
                        solved: false,
                        fail: false},
                        {id: 6,
                        name: "Milorad Pavic",
                        selected: false,
                        solved: false,
                        fail: false}];

    var directors = [{id: 1,
                name: "Emir Kusturica",
                selected: false,
                solved: false,
                fail: false},
                {id: 2,
                name: "Andrej Tarkovski",
                selected: false,
                solved: false,
                fail: false},
                {id: 3,
                name: "Pavel Lungin",
                selected: false,
                solved: false,
                fail: false},
                {id: 4,
                name: "Ingmar Bergman",
                selected: false,
                solved: false,
                fail: false},
                {id: 5,
                name: "Lars von Trir",
                selected: false,
                solved: false,
                fail: false},
                {id: 6,
                name: "Andrej Zvjagincev",
                selected: false,
                solved: false,
                fail: false}];

    this.getWriters = function () {
    // push right column pairs into leftColumnOptions
        leftColumnOptions.push(writers);
        leftColumnOptions.push(cities);
        leftColumnOptions.push(directors);
        // randomize all arrays individualy for left column 
            var shuffledWriters = shuffle(writers);
            leftColumnOptions.push(shuffledWriters);
            var shuffledCities = shuffle(cities);
            leftColumnOptions.push(shuffledCities);
            var shuffledDirectors = shuffle(directors);
            leftColumnOptions.push(shuffledDirectors);
            // randomize left column with only one array
                return leftColumnOptions[Math.floor((Math.random() * 3))];
    }    
    
    var novels = [{writerId: 1, 
                    text: "Dervis i Smrt",
                    selected: false,
                    solved: false,
                    fail: false},
                     {writerId: 2,
                    text: "Na Drini Cuprija",
                    selected: false,
                    solved: false,
                    fail: false},
                     {writerId: 3,
                    text: "Zlatno runo",
                    selected: false,
                    solved: false,
                    fail: false},
                    {writerId: 4,
                    text: "Basta, pepeo i dim",
                    selected: false,
                    solved: false,
                    fail: false},
                     {writerId: 5,
                    text: "Timor Mortis",
                    selected: false,
                    solved: false,
                    fail: false},
                    {writerId: 6,
                    text: "Ruski hrt",
                    selected: false,
                    solved: false,
                    fail: false}];


    var countries = [{writerId: 1,
                        text: "Srbija",
                        selected: false,
                        solved: false,
                        fail: false},
                        {writerId: 2,
                        text: "Austrija",
                        selected: false,
                        solved: false,
                        fail: false},
                        {writerId: 3,
                        text: "Holandija",
                        selected: false,
                        solved: false,
                        fail: false},
                        {writerId: 4,
                        text: "Francuska",
                        selected: false,
                        solved: false,
                        fail: false},
                        {writerId: 5,
                        text: "Amerika",
                        selected: false,
                        solved: false,
                        fail: false},
                        {writerId: 6,
                        text: "Japan",
                        selected: false,
                        solved: false,
                        fail: false}]


    var movies = [{writerId: 1,
                    text: "Otac na sluzbenom putu",
                    selected: false,
                    solved: false,
                    fail: false},
                    {writerId: 2,
                    text: "Andrej Rubljov",
                    selected: false,
                    solved: false,
                    fail: false},
                    {writerId: 3,
                    text: "Ostrvo",
                    selected: false,
                    solved: false,
                    fail: false},
                    {writerId: 4,
                    text: "Jesenja sonata",
                    selected: false,
                    solved: false,
                    fail: false},
                    {writerId: 5,
                    text: "Dogwille",
                    selected: false,
                    solved: false,
                    fail: false},
                    {writerId: 6,
                    text: "Povratak",
                    selected: false,
                    solved: false,
                    fail: false}];

    this.getNovels = function () {
    // push right column pairs into rightColumnOptions
        rightColumnOptions.push(novels);
        rightColumnOptions.push(countries);
        rightColumnOptions.push(movies);
        // randomize all arrays individualy for right column
            var shuffledNovels = shuffle(novels);
            rightColumnOptions.push(shuffledNovels);
            var shuffledCountries = shuffle(countries);
            rightColumnOptions.push(shuffledCountries);
            var shuffledMovies = shuffle(movies);
            rightColumnOptions.push(shuffledMovies);
            // randomize left column with only one array
                return rightColumnOptions[Math.floor((Math.random() * 3))];
    }

// FISHER YATES shuffle algorithm
function shuffle(array) {
   var counter = array.length;
   // While there are elements in the array
   while (counter > 0) {
       // Pick a random index
       var index = Math.floor(Math.random() * counter);
       // Decrease counter by 1
       counter--;
       // And swap the last element with it
       var temp = array[counter];
       array[counter] = array[index];
       array[index] = temp;
   }

   return array;
}

// ----------- SKOCKO ----------

this.getSigns = function(){
    return signs;
}

 var signs = [
    {
        id: 1,
        sign: "heart",
        src: "Content/images/heart.jpg",
        chosen: false,
        red: false,
        yellow: false
    },
    {
        id: 2,
        sign: "pike",
        src: "Content/images/pike.png",
        chosen: false,
        red: false,
        yellow: false
    },
    {
        id: 3,
        sign: "leaf",
        src: "Content/images/leaf.png",
        chosen: false,
        red: false,
        yellow: false
    },
    {
        id: 4,
        sign: "diamond",
        src: "Content/images/diamond.jpg",
        chosen: false,
        red: false,
        yellow: false
    },
    {
        id: 5,
        sign: "skocko",
        src: "Content/images/skocko.jpg",
        chosen: false,
        red: false,
        yellow: false
    },
]

// ---------- KO ZNA ZNA -----------

this.getQuestions = function(){
    return questions;
}

var questions = [
    {id: 1, 
     text: "Ko je najbolji kosarkas na svetu?",
     posibilities: [{answer: "LeBron", correct: true}, 
                    {answer: "Bryant", correct: false},
                    {answer: "Jordan", correct: false},
                    {answer: "Bogdanovic", correct: false}],
     selected: false},
     {id: 2, 
     text: "Ko je najbolji pisac na svetu?",
     posibilities: [{answer: "Dostojevski", correct: true}, 
                    {answer: "Gete", correct: false},
                    {answer: "Tolstoj", correct: false},
                    {answer: "Hese", correct: false}],
     selected: null},
     {id: 3, 
     text: "Koji od ovih gradova je najblizi bugarskoj granici?",
     posibilities: [{answer: "Donji Milanovac", correct: false}, 
                    {answer: "Nis", correct: false},
                    {answer: "Beograd", correct: false},
                    {answer: "Zajecar", correct: true}],
     selected: null},
     {id: 4, 
     text: "Koji fudbalski klub je iz Zajecara?",
     posibilities: [{answer: "Partizan", correct: false}, 
                    {answer: "Timok", correct: true},
                    {answer: "Mladost", correct: false},
                    {answer: "Cukaricki", correct: false}],
     selected: null}];

// -------- ASOCIJACIJE -------

});