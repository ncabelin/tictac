$(document).ready(function() {
  var ids = {
    1 : $("#one"),
    2 : $("#two"),
    3 : $("#three"),
    4 : $("#four"),
    5 : $("#five"),
    6 : $("#six"),
    7 : $("#seven"),
    8 : $("#eight"),
    9 : $("#nine"),
  };

  var resetB = $("#reset");
  var xPlayB = $("#xPlay");
  var oPlayB = $("#oPlay");
  var status = $("#status");
  var humanScore = $("#human");
  var compScore = $("#comp");
  var hScore = 0;
  var cScore = 0;
  var won = false;
  var move = 0;
  var occArr = [];
  var cMove;

  // Winning pattern
  var winning = [ [1,2,3], [4,5,6], [7,8,9], [1,4,7], [2,5,8], [3,6,9], [1,5,9], [3,5,7] ];

  function Player(symbol, state) {
    this.symbol = symbol;
    this.state = state;
    this.moves = [];
  }

  var human = new Player("X", "human");

  var computer = new Player("O", "computer");

  xPlayB.click(function() {
    human.symbol = "X";
    computer.symbol = "O";
    reset();
  });

  oPlayB.click(function() {
    human.symbol = "O";
    computer.symbol = "X";
    reset();
  });

  resetB.click(function() {
    reset();
  });

  function reset() {
    move = 0;
    human.moves = [];
    computer.moves = [];
    occArr = [];
    cMove = 0;
    // empty out each cell
    for (var i = 1; i < 10; i++) {
      ids[i].empty();
    }
    won = false;
    if (computer.symbol == "X") {
      computer.smartMove();
      computer.moveTo(cMove);
      computer.checkMove();
    }
  }

  Player.prototype.moveTo = function(position) {
    var pos = Number(position);
    this.moves.push(pos); // push to own moves array
    ids[position].html(this.symbol); // print symbol in corresponding cell
    occArr.push(pos); // mark cell occupied
    console.log(pos + " is the " + this.state + " move");
  };

  Player.prototype.checkMove = function() {
    won = false;
    var symb = this.symbol;
    var self = this;
    function checkEachMove() {
      self.moves.forEach(function(move) {
        var check = winning[i].indexOf(move);
        if (check !== -1) {
          rightMove++;
          winningArr.push(move);
          winningIndex.push(check);

          // if 3 numbers match winning array combo
          if (rightMove == 3) {
            for (var j = 0; j < winningArr.length; j++) {
              ids[winningArr[j]].html("<span class='win'>" + symb + "</span>");
            }
            status.html("Player " + symb + " WINS ! ");
            if (self.state == "human") {
              hScore++;
              humanScore.attr("value", hScore);
            } else {
              cScore++;
              compScore.attr("value", cScore);
            }
            won = true;
            return;
          }
        }
      });
    }

    for (var i = 0; i < winning.length; i++) { // cycle through each winning array
      var rightMove = 0;
      var winningArr = [];
      var winningIndex = [];

      checkEachMove();

      if (occArr.length == 9 && won === false) {
        status.html("DRAW ! No one won");
      }
    }
  };

  function findEmptyCells() {
    var emptyArr = [];
    for (var a = 1; a < 10; a++) { // generate empty cells Array
      var b = occArr.indexOf(a);
      if (b == -1) {
        emptyArr.push(a);
      }
    }
    return emptyArr;
  }

  function randomMove() {
    var emptied = findEmptyCells();
    var rand = emptied[Math.floor(Math.random() * emptied.length)];
    return rand;
  }

  Player.prototype.smartMove = function() {
    // computer generated move, if occArr = 1, random if human didn't do center cell, 3 and above do smart AI
    var foundAnswer = false;
    var check1 = occArr.indexOf(5);
    if (check1 == -1 && occArr.length <= 1) {
      cMove = 5;
      return cMove;
    }
    cMove = randomMove();
    if (occArr.length > 1) {
      winning.forEach(function(winData) {
        var rightMove = 0;
        var winningArr = [];
        var winningIndex = [];

        // look at own existing moves
        computer.moves.forEach(function(move) {
          var check = winData.indexOf(move);
          if (check !== -1) {
            rightMove++;
            winningArr.push(move);
            winningIndex.push(check);

            if (rightMove == 2) {
             // find out the other number and check if it exists in occArr already.

              var missingMove;
              var a = winningIndex.indexOf(0);
              var b = winningIndex.indexOf(1);
              var c = winningIndex.indexOf(2);
              if (a == -1) {
                missingMove = winData[0];
              } else if (b == -1) {
                missingMove = winData[1];
              } else if (c == -1) {
                missingMove = winData[2];
              }

               // if move exists, return. if not then it is the cMove (correct move)
              var check2 = occArr.indexOf(missingMove);
              if (check2 == -1) {
                console.log(winningArr + " is the winning array with 2 cells and so " + missingMove + " is the right answer");
                foundAnswer = true;
                cMove = missingMove;
                return;
              }
            }
          }
        });
      });

      if (foundAnswer) { return; }

      // iterate through each winning array combination
      winning.forEach(function(winData) {
        rightMove = 0;
        winningArr = [];
        winningIndex = [];

        // compare current human moves array to current winning array combo
        human.moves.forEach(function(move) {
          var check = winData.indexOf(move);
          if (check !== -1) {
            rightMove++;
            winningArr.push(move);
            winningIndex.push(check);

            // if 2 numbers match winning array combo
            if (rightMove == 2) {
              // find out the other number and check if it exists in occArr already.
              var missingMove;
              var a = winningIndex.indexOf(0);
              var b = winningIndex.indexOf(1);
              var c = winningIndex.indexOf(2);
              if (a == -1) {
                missingMove = winData[0];
              } else if (b == -1) {
                missingMove = winData[1];
              } else if (c == -1) {
                missingMove = winData[2];
              }

              // if move exists, return. if not then it is the cMove (correct move)
              var check2 = occArr.indexOf(missingMove);
              if (check2 == -1) {
                console.log(winningArr + " is the winning array with 2 cells and so " + missingMove + " is the right counter");
                cMove = missingMove;
                return;
              }
            }
          }
        });
      });
    }
  };

  $("td").click(function() {

    status.empty();
    if (won === true || occArr.length === 9) { // reset if a player won already
      reset();
    } else {
      var moved = Number($(this).attr("value")); // x is position of move
      var y = ids[moved]; // y is the jQuery DOM location of td cell clicked

      // prevents player from move if cell is occupied already

      var zed = occArr.indexOf(moved);
      if (zed !== -1) {
        status.html("That cell is taken, choose another one");
        return;
      }

      human.moveTo(moved);
      human.checkMove();

      if (won === false && occArr.length < 9) {
        computer.smartMove(); // generate cMove (AI move)
        setTimeout(function() {
          computer.moveTo(cMove);
          computer.checkMove();
        }, 500); // provide delay to simulate human thinking delay of half a second

      }
    }
  });


});
