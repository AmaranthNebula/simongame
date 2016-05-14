$(document).ready(function() {
    var userTimeOutLength = 10000;
    var highlightButtonLemgth = 750;
    var timeBetweenMoves = 200;
    var buttonColors = ["green", "red", "yellow", "blue"];
    var simulatedMoves = [];
    var userMoves = [];
    var level = 0;
    var strictModeOn = false;
    var timer;
    
    // make array of audio files for buttons
    var audioObjects = document.getElementsByTagName("audio");
    
    // posiiton elements correctly
    resizeElements();
    // start page with game off
    turnOff();

    // when strict mode toggle is clicked
    // check or uncheck button
    $(".toggleModeButton").click(function() {
        if ($(".toggleModeButton input").prop("checked") === false) {
            $(".toggleModeButton input").prop("checked", true);
            strictModeOn = true;
        }else {
            $(".toggleModeButton input").prop("checked", false);
            strictModeOn = false;
        }
    });    
    
    // on and off button slide toggle event handler
    $(".toggleSwitch").click(function() {
        // check or uncheck toggle button
        if ($(".toggleSwitch input").prop("checked") === false) {
            $(".toggleSwitch input").prop("checked", true);
            turnOn();
        }else {
            $(".toggleSwitch input").prop("checked", false);
            turnOff();
        }        
    });

    function turnOn() {
        updateDisplay("--");
        $("#startButton").prop("disabled", false);
    }
    function turnOff() {
        stopMoveTimer();
        level = 0;
        simulatedMoves = [];
        userMoves = [];
        updateDisplay("");
        $("button").prop("disabled", true);
    }
    
    //start or restart game when button is clicked
    $("#startButton").click(function() {
        newGame();
    });  
    
    //erases all setings and starts a new game
    function newGame() {
       stopMoveTimer();
       level = 0;
       simulatedMoves = [];
       userMoves = [];
       getNextLevel();
       updateDisplay(level);
       $("button").prop("disabled", false);
    }
        
    // computer gets random button for next move
    function getNextLevel() {
        level++;
        updateDisplay(level);
        // generate random number between 0 and 3
        var random = Math.floor(Math.random()*4); 
        //save chosen button by adding to simulatedMoves array
        simulatedMoves.push(buttonColors[random]);        
        
        // wait for replay to finish before starting user timer
        //var completeReplay = [Promise.resolve(replayMoves())];
        Promise.resolve(replayMoves()).then(function(complete){
            //start timer for user to respond
            resetMoveTimer();
          });
    }
    
    // update level display on GUI with passed string
    function updateDisplay(displayText) {
        // if a number is passed and it is less than 10
        // format result to start with a zero to make result 2 chars long
        if (displayText < 10 && /^\d$/g.test(displayText)) {
            $("#counterDisplay p").text("0" + displayText);
        }else {
            $("#counterDisplay p").text(displayText);
        }
    }
        
    // highlights/flashes the clicked or simulated button
    // play sound for button
    function flashButton(color) {
        $("#" + color + "Button").addClass(color + "Activated");
        //get audio file to play
        // indexOf returns the index of a color to find the correct audiofile
        var audioFile = audioObjects[buttonColors.indexOf(color)];
        audioFile.play(); 
        
        //stop flashing button
        setTimeout(function() {
           $("#" + color + "Button").removeClass(color + "Activated"); 
        }, highlightButtonLemgth);
    }

    //set and restart timer that alerts player when they take too long to answer
    function resetMoveTimer() {
        //stop timer
        clearTimeout(timer);
        //restart timer
        timer = setTimeout(function() {
                wrongAnswer();
            }, userTimeOutLength);
    }
    function stopMoveTimer() {
        clearTimeout(timer);
    }    
            
    // event handler when user clicks on the red, green, blue, or yellow buttons        
   $("#baseElement > button").click(function(e) {
       //reset time limit between moves
       resetMoveTimer();
       
       //get color of button clicked
       var name = $(this).attr("id");
       name = name.replace("Button", "");

        // call function to play sound and highlight button when user clicks
        flashButton(name);
        // add move to userMoves array
        userMoves.push(name);
        // check if user has completed all moves correctly
        var evaluateMove = checkMoves();   
        // aftter level 20 end game
        if (evaluateMove.correctMoves && evaluateMove.sequenceComplete && level === 4) {
            gameWon();
        }
        // if all moves correct, get next level's move
        else if (evaluateMove.correctMoves && evaluateMove.sequenceComplete) {
            //stop timer
            stopMoveTimer();
            // clear user input
            userMoves = [];
            // get next level
            getNextLevel();
        }
        // if user has made an incorrect move
        //call function to handle wrong moves
        else if (!evaluateMove.correctMoves) {
            wrongAnswer();
        }
   });
    
    //compare simulated movese to user movese
    // return true if all entries in userMoves matches simulated moves
    // false if any moves are different
    function checkMoves() {
        // hold value on if all moves made by player are correct
        var isCorrect = true;
        // holds value on if user completed all moves made by computer
        var completedSequence = false;
        for(var i = 0; i < userMoves.length; i++) {
            if(simulatedMoves[i] !== userMoves[i]) {
                isCorrect = false;
            }
        }
        if (simulatedMoves.length === userMoves.length) {
            completedSequence = true;
        }
        return {"correctMoves": isCorrect, "sequenceComplete": completedSequence};
    } // end of correctAnswers    
    
    // when called starts new game is strict mode is on
    // or flashes warning and replays moves
    function wrongAnswer() {
        updateDisplay("!!");
        
        setTimeout(function() {
            if(strictModeOn) {
                newGame();
            }else {
                //clear user moves
                userMoves = [];
                //update display:
                updateDisplay(level);
                //replay simulated moves for user
                replayMoves();
                //restart timer
                resetMoveTimer();
            }
        }, 1000);
     }    
 
    // replay all moves chosen by computer
    // by highlighting buttons and playing sounds
    function replayMoves() {
        var complete = false;
        // disable rgby buttons to prevent user interaction while replaying moves
        $("#baseElement > button").prop("disabled", true);
        var index = 0;
          var replay = setInterval(function() {
                if (index < simulatedMoves.length) {
                    flashButton(simulatedMoves[index]);
                    index++;
                }else {
                    clearInterval(replay);
                }
            },highlightButtonLemgth + timeBetweenMoves);
        //re-enable the buttons
        $("#baseElement > button").prop("disabled", false);
         complete = true;
        return complete;
    }
    
    // end game after level 20
    // just update display to show win and stopTimerd
    function gameWon() {
        updateDisplay("win!");
        stopMoveTimer();
        $("#baseElement > button").prop("disabled", true);
        // after 2 seconds start a new game
        setTimeout(function() {
            newGame();
        }, 2000);
        
    }
    


    function resizeElements() {
        //check height and width and find the smaller dimension
        var width = $(window).outerWidth(true);
        var height = $(window).outerHeight(true);

        //diameter of base is 80% of the height or width (whichevers smaller)
        var diameter = Math.min(height, width)*0.8;
        // diameter of center panel
        var centerDiameter = diameter/2;
        var outerPadding = diameter * 0.05;
        
        //get height of display counterDisplay
        var displayHeight = centerDiameter*0.2;

        //set sizes for base circle
        $("#baseElement").css({
            "height": diameter + "px",
            "width": diameter + "px",
            "padding": outerPadding + "px",
            "top": ((height-diameter)/2) + "px",
            "left": ((width-diameter)/2) + "px"
            
        });
        // set size of inner circle that contains game controls
        $("#centerPanel").css({
            "height": centerDiameter + "px",
            "width": centerDiameter + "px",
            "top": (centerDiameter/2) +"px",
            "left": (centerDiameter/2) + "px"
        });
        //set size and position of step count display
        $("#counterDisplay p").css("font-size", displayHeight + "px");
        
        //set size of on/off toggle
        //width is 20% of parent's width
       var toggleWidth = $("#toggleContainer").outerWidth(true)*0.2;
       var borderSizeDouble = 4;
       //height is a little more than half the width
       var toggleHeight = toggleWidth*0.5667;
       var textSize = toggleHeight;
       
       //change size of on/off toggle and its text size
       $("#toggleContainer p").css("font-size", textSize + "px");
       $(".toggleSwitch").css({
          "width": (toggleWidth + borderSizeDouble ) + "px",
          "height": (toggleHeight + borderSizeDouble) + "px"
       });
       
       
       // set size of strict mode toggle's text size
       $(".toggleModeButton").css("font-size", (toggleHeight*0.7) + "px");
       //set font size of start reset button's label
       $("#startResetLabel").css("font-size", (toggleHeight*0.7) + "px");
        
    } //end of resizeElements
   
    $(window).resize(function(){
        resizeElements();
    });
});