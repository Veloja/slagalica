app.service('quizService', function(){
    
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

     this.getWriters = function () {
             return writers;
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

    this.getNovels = function () {
        return novels;
    }
    
    
    

       });