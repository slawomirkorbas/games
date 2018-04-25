var totalFields = 9;//matrix.length * matrix.length;
var winCount = 3;
var COMPUTER_WIN = 1;
var DRAW = 0;
var COMPUTER_LOST = -1;
var NOT_FINISHED = 728;


/**
 * Return null if there is no move possible as the matrix is full.
 * @param matrix
 * @param computerFigure
 * @returns {{row: number, col: number}}
 */
function findBestMove(matrix, computerFigure) {
    console.log("------------------------------");
    var bestMove = null;
    var bestResult = -1000000;
    for( var r=0; r < matrix.length; r++ ) {
        for( var c=0; c < matrix.length; c++ ) {
            if( matrix[r][c] == '' ) {
                var matrixCopy = copyMatrix( matrix );
                matrixCopy[r][c] = computerFigure;
                var eval = { games: 0, pts: 0, wins: 0, draws: 0, loses: 0, movesTotal: 0 };
                eval = evaluatePossibleGames( matrixCopy, toggle(computerFigure), eval, 1 );
                console.log( "Evaluation for: (" + r + "," + c +") games(" + eval.games + ") wins(" + eval.wins + ") loses(" + eval.loses + ") draws(" + eval.draws + ")  pts=" + eval.pts + ", movesTotal=" + eval.movesTotal );
                if( eval.pts > bestResult ) {
                    bestResult = eval.pts;
                    bestMove = { row: r, col: c };
                }
            }
        }
    }
    return bestMove;
}

function evaluatePossibleGames(matrix, currentFigure, evaluation, movesCount ) {
    var gameResult = gameState(matrix);
    if( gameResult == COMPUTER_LOST ) {
        evaluation.games += 1;
        evaluation.loses++;
        evaluation.movesTotal += movesCount;
        if( movesCount == 2 ) {
            // 2 means we are losing in the next opponents move - this should be avoided game solution so we give it -100
            evaluation.pts -= 100;
        } else {
            evaluation.pts -= (1 + emptyFieldsLeft(matrix));
        }
    }
    else if( gameResult == COMPUTER_WIN ) {
        if( movesCount == 2 ) {
           // test  
            evaluation.pts += (1 + emptyFieldsLeft(matrix));
        }
        else {
            evaluation.pts += (1 + emptyFieldsLeft(matrix));
        }
        evaluation.movesTotal += movesCount;
        evaluation.wins++;
    }
    else if( matrixFull(matrix) ) {
        evaluation.draws++;
        evaluation.pts += 0;
        evaluation.games += 1;
        evaluation.movesTotal += movesCount;
    }
    else if( gameResult == NOT_FINISHED ) {
        for( var r=0; r < matrix.length; r++ ) {
            for( var c=0; c < matrix.length; c++ ) {
                var matrixCopy = copyMatrix( matrix );
                if( false ) {// matrixCopy[r][c] == '' && isOpponentsTurn(currentFigure) && (countOccupiedFields(matrixCopy) < totalFields - 1) && deadField(matrixCopy,r,c) ) {
                    // don't evaluate games with not clever moves...
                    continue;
                }
                else  if( matrixCopy[r][c] == '') {
                    matrixCopy[r][c] = currentFigure;
                    evaluation = evaluatePossibleGames(matrixCopy, toggle(currentFigure), evaluation, movesCount + 1 );
                }
            }
        }
    }

    return evaluation;
}

function isOpponentsTurn(currentFigure) {
    return  currentFigure == 'O';
}

deadField = function (matrix, r, c) {
    var vDead = verticalCheck(matrix, r, c);
    var hDead = horizontalCheck(matrix, r, c);
    var dDead_1 = diagonalPathCheck( matrix, r, c, true );
    var dDead_2 = diagonalPathCheck( matrix, r, c, false );

    //console.log( "dead = " + (hDead && vDead && dDead_1 && dDead_2) );
    return (hDead && vDead && dDead_1 && dDead_2);
}

horizontalCheck = function (matrix, r, c) {
    var hDead = false;
    var col = 0;
    while( col >= 0 && col < matrix.length ) {
        if( matrix[r][col] == 'X' ) {
            hDead = true;
            break;
        }
        col++;
    }
    return hDead;
}

verticalCheck = function(matrix, r, c) {
    var vDead = false;
    var row = 0;
    while( row >= 0 && row < matrix.length ) {
        if( matrix[row][c] == 'X' ) {
            vDead = true;
            break;
        }
        row++;
    }
    return vDead;
}

diagonalPathCheck = function ( matrix, r, c, topLeft2BottomRight ) {
    var dDead = false;
    var row = r;
    var col = c;
    var checkedCount = 0;
    var forward = true;
    while( checkedCount < winCount ) {
        if( row >= 0 && row < matrix.length && col >= 0 && col < matrix.length ) {
            if( matrix[row][col] == 'X' ) {
                dDead = true;
                break;
            }
            checkedCount++;
        }
        else if( forward == false && checkedCount < winCount ) {
            dDead = true;
            break;
        }
        else {
            // back to initial pos and change direction of checking...
            row = r;
            col = c;
            forward = false;
        }
        if( topLeft2BottomRight ) {
            row += forward ? 1 : -1;
            col += forward ? 1 : -1;
        }
        else {   // bottomLeft2TopRight
            row += forward ? -1 :  1;
            col += forward ?  1 : -1;
        }
    }
    return dDead;
}

function toggle(figure) {
    return figure == 'X' ? 'O' : 'X';
}


/**
 * Checks
 * @param matrix
 * @param figure
 * @returns  0 - game is not finished, 1 - 'X' has won, -1 - 'O' has won
 */
function gameState( matrix ) {
    // horizontal scan...
    var countX = 0, countO = 0, winCount = 3;
    for( var r=0; r < matrix.length; r++ ) {
        for( var c=0; c < matrix.length; c++ ) {
            countX = matrix[r][c] == 'X' ? countX + 1 : 0;
            countO = matrix[r][c] == 'O' ? countO + 1 : 0;
        }
        if( countX == winCount || countO == winCount) {
            return countX == winCount ? COMPUTER_WIN : COMPUTER_LOST;
        }
        countX = countO = 0;
    }
    //vertical scan...
    countX = countO = 0;
    for( var c=0; c < matrix.length; c++ ) {
        for( var r=0; r < matrix.length; r++ ) {
            countX = matrix[r][c] == 'X' ? countX + 1 : 0;
            countO = matrix[r][c] == 'O' ? countO + 1 : 0;
        }
        if( countX == winCount || countO == winCount) {
            return countX == winCount ? COMPUTER_WIN : COMPUTER_LOST;
        }
        countX = countO = 0;
    }
    //diagonal scan left top
    countX = countO = 0;

    //scan diagonal line  (top-left)
    for( var r=0; r < matrix.length; r++ ) {
        var colStart = 0;
        var rowStart = r;
        for( var x=colStart, y=rowStart; x < matrix.length && y < matrix.length; x++, y++ ) {
            countX = matrix[x][y] == 'X' ? countX + 1 : 0;
            countO = matrix[x][y] == 'O' ? countO + 1 : 0;
            if( countX == winCount || countO == winCount) {
                return countX == winCount ? COMPUTER_WIN : COMPUTER_LOST;
            }
        }
        countX = countO = 0;
    }

    //scan diagonal line  (bottom-right)
    for( var r=0; r < matrix.length; r++ ) {
        var colStart = matrix.length - 1;
        var rowStart = r;
        for( var x=colStart, y=rowStart; x < matrix.length && y < matrix.length; x--, y++ ) {
            countX = matrix[x][y] == 'X' ? countX + 1 : 0;
            countO = matrix[x][y] == 'O' ? countO + 1 : 0;
            if( countX == winCount || countO == winCount) {
                return countX == winCount ? COMPUTER_WIN : COMPUTER_LOST;
            }
        }
        countX = countO = 0;
    }
    return NOT_FINISHED;    // game is not over or matrix is full...
}

function matrixFull(matrix) {
    // check if matrix is full...
    return countOccupiedFields(matrix) == totalFields;
}

function countOccupiedFields(matrix) {
    var count = 0;
    for( var r=0; r < matrix.length; r++ ) {
        for( var c=0; c < matrix.length; c++ ) {
            count = matrix[r][c] != '' ? count + 1 : count;
        }
    }
    return count;
}

function emptyFieldsLeft(matrix) {
    var emptyFields = 0;
    for( var r=0; r < matrix.length; r++ ) {
        for( var c=0; c < matrix.length; c++ ) {
            if( matrix[r][c] == '' ) {
                emptyFields++;
            }
        }
    }
    return  emptyFields;
}

/**
 * Copies arrays - deep copy of two dimensional array
 * @param matrix
 * @returns {Array}
 */
function copyMatrix( matrix ) {
    var matrixCopy = [ ['','',''], ['','',''], ['','',''] ];
    for( var r=0; r < matrix.length; r++ ) {
        for( var c=0; c < matrix.length; c++ ) {
            matrixCopy[r][c] =  matrix[r][c];
        }
    }
    return matrixCopy;
}
