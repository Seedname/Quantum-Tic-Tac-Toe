function setup() {
    createCanvas(600, 600);
}

var board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var turn = 0;
var moves = 0;
var entangled = false;

var entangledPairs = [];
var entangledColors = [];

var winners = [];
var winnersLines = [];
var winner = 0;

var score = [0, 0];

function X(x, y, s) {
    line(x-s, s+y, s+x, y-s);
    line(x-s, y-s, s+x, s+y);
}
function O(x, y, s) {
    noFill();
    ellipse(x, y, 2*s, 2*s);
}
function isInside(x, y, w, h) {
    return (mouseX >= x && mouseX <= x+w && mouseY >= y && mouseY <= y+h);
}
draw = function() {
    background(220);
    
    stroke(0);
    strokeWeight(5);
    line(2*width/5, height/5, 2*width/5, 4*height/5);
    line(3*width/5, height/5, 3*width/5, 4*height/5);
    line(width/5, 2*height/5, 4*width/5, 2*height/5);
    line(width/5, 3*height/5, 4*width/5, 3*height/5);

    stroke(200);
    if(isInside(width/5, height/5, 3*width/5, 3*height/5)  && winners.length === 0) {
        var x = floor(5*mouseX/width);
        var y = floor(5*mouseY/height);
        if(board[x-1 + 3*(y-1)] === 0) {
            if(entangled) {
                textAlign(CENTER, CENTER);
                fill(200);
                textSize(80)
                noStroke();
                // textFont(createFont('arial', 80));
                text("?", width*x/5+width/10, height*y/5+height/10);
            } else if(turn % 2 === 0) {
                X(width*x/5+width/10, height*y/5+height/10, 35);
            } else {
                O(width*x/5+width/10, height*y/5+height/10, 35);
            }
        }
    }
    
    stroke(0);
    for(var i = 0; i < 9; i++) {
        var x = (i) % 3;
        var y = floor((i)/3);
        if(board[i] === -1) {
            X(width*x/5+3*width/10, height*y/5+3*height/10, 35);
        } else if(board[i] === 1) {
            O(width*x/5+3*width/10, height*y/5+3*height/10, 35);
        } else if(board[i] === 100) {
            textAlign(CENTER, CENTER);
            for(var j = 0; j < entangledPairs.length; j++) {
                if (entangledPairs[j][0] === i) {
                    fill(entangledColors[j]);
                } else if(entangledPairs[j][1] === i) {
                    fill(entangledColors[j]);
                }
            }
            // textFont(createFont('arial', 80));
            textSize(80);
            noStroke();
            text("?", width*x/5+3*width/10, height*y/5+3*height/10);
        }
    }
    
    noFill();
    stroke(0);
    strokeWeight(3);
    if(isInside(width/2-150/2-90, 4*height/5+25, 150, 50) && winners.length === 0) {
        rect(width/2-150/2-6.25-90, 4*height/5+18.75, 162.5, 62.5);
    } else {
        rect(width/2-150/2-90, 4*height/5+25, 150, 50);
    }
    
    if(isInside(width/2-150/2+90, 4*height/5+25, 150, 50)  && winners.length === 0) {
        rect(width/2-150/2-6.25+90, 4*height/5+18.75, 162.5, 62.5);
    } else {
        rect(width/2-150/2+90, 4*height/5+25, 150, 50);
    }
    textAlign(CENTER, CENTER);
    fill(0);
    // textFont(createFont('verdana', 25));
    textSize(25);
    noStroke();
    text("Entangle", width/2-90, 4*height/5+50);
    text("Measure", width/2+90, 4*height/5+50);
    
    if (winners.length > 0) {
        textAlign(CENTER, BOTTOM);
        // textFont(createFont("verdana"), 40);
        // noStroke();
        textSize(40);
        if(winner === 0) {
            text("X wins!", width/2, height/5-20);
        } else if(winner === 1) {
            text("O wins!", width/2, height/5-20);
        } else if(winner === 2) {
            text("X and O win!", width/2, height/5-20);
        }
        
        strokeWeight(8);
        for(var i = 0; i < winnersLines.length; i++) {
            var j = winnersLines[i][0];
            var k = winnersLines[i][1];
            line(width*(j%3)/5+width/10+width/5, height*floor(j/3)/5+height/10+height/5, width*(k%3)/5+width/10+width/5, height*floor(k/3)/5+height/10+height/5);
        } 
    }
    
    if (moves >= 9 && winners.length === 0) {
        textAlign(CENTER, BOTTOM);
        // textFont(createFont("verdana"), 40);
        textSize(40);
        noStroke();
        text("Draw", width/2, height/5-20);
    }
    
    // textFont(createFont("verdana"), 23);
    textSize(23);
    noStroke();
    textAlign(LEFT, TOP);
    text("X wins: " + score[0], 0, 0);
    textAlign(RIGHT, TOP);
    text("O wins: " + score[1], width, 0);
};

function measure() {
    for(var i = entangledPairs.length-1; i >= 0; i--) {
        var choice = 2 * floor(random(2)) - 1;
        board[entangledPairs[i][0]] = choice;
        board[entangledPairs[i][1]] = -choice;
        entangledPairs.splice(i, 1);
        entangledColors.splice(i, 1);
    }
}
function check() {
    var sum3 = 0;
    var sum4 = 0;
    for(var i = 0; i < 3; i++) {
        var sum = 0;
        var sum2 = 0;
        
        for(var j = 0; j < 3; j++) {
            sum += board[i + 3*j];
            sum2 += board[j + 3*i];
        }
        sum3 += board[i + 3*i];
        sum4 += board[2 - i + 3*i];
        
        if(sum === -3 || sum2 === -3 || sum3 === -3 || sum4 === -3) {
            winners.push("X");
        } 
        if(sum === 3 || sum2 === 3 || sum3 === 3 || sum4 === 3) {
            winners.push("O");
        }
        
        if(abs(sum) === 3) {winnersLines.push([i, i+6]);}
        if(abs(sum2) === 3) {winnersLines.push([3*i, 3*i+2]);}
        if(abs(sum3) === 3) {winnersLines.push([0, 8]);}
        if(abs(sum4) === 3) {winnersLines.push([2, 6]);}
    }
    
    if(winners.length > 0) {
        var xWins = 0;
        var oWins = 0;
        for(var i = 0; i < winners.length; i++) {
            if(winners[i] === "X") {
                xWins ++;
            } else {
                oWins ++;
            }
        }
        
        if(xWins > oWins) {
            winner = 0;
            score[0]++;
        } else if(oWins > xWins) {
            winner = 1;
            score[1]++;
        } else {
            winner = 2;
            score[0]++;
            score[1]++;
        }
    }

}

function mousePressed() {
    if(winners.length === 0 && moves < 9) {
        if(isInside(width/2-150/2-90, 4*height/5+25, 150, 50) && moves <= 7) {
            if(!entangled) {
                entangled = true;
            } else if(floor(turn) === turn) {
                entangled = false;
            }
        }
        
        if(isInside(width/2-150/2+90, 4*height/5+25, 150, 50) && entangledPairs.length > 0 && floor(turn) === turn) {
            measure();
            check();
            turn ++;
        } 
        if(isInside(width/5, height/5, 3*width/5, 3*height/5) && moves < 9) {
            var x = floor(5*mouseX/width);
            var y = floor(5*mouseY/height);
            if(board[x-1 + 3*(y-1)] === 0) {
                if(entangled) {
                    board[x-1 + 3*(y-1)] = 100;
                    turn += 0.5;
                    if(floor(turn) === turn) {
                        entangled = false;
                        entangledPairs[entangledPairs.length-1].push(x-1 + 3*(y-1));
                    } else {
                        entangledPairs.push([x-1 + 3*(y-1)]);
                        entangledColors.push(color(random(255),random(255),random(255)));
                    }
                } else {
                    board[x-1 + 3*(y-1)] = 2 * (turn % 2) - 1;
                    turn ++;
                }
                moves ++;
                if(moves >= 9 && entangledPairs.length > 0) {
                    measure();
                }
                if(!entangled) {
                    check();
                }
            }
        } 
    } else {
        board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        turn = 0;
        moves = 0;
        winners = [];
        winnersLines = [];
    entangledPairs = [];
    entangledColors = [];
    }
}
