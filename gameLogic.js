var totalFields = 9;//matrix.length * matrix.length;
var COMPUTER_WIN = 1;
var COMPUTER_LOST = -1;
var NOT_FINISHED = 728;


/**
 * Return null if there is no move possible as the matrix is full.
 * @param matrix
 * @param computerFigure
 * @returns {{row: number, col: number}}
 */
function findBestMove(matrix, figure) {
    var bestMove = null;
    var maxPts = null;
    for( var r=0; r < matrix.length; r++ ) {
        for( var c=0; c < matrix.length; c++ ) {
            if( matrix[r][c] == '' ) {
                var matrixCopy = copyMatrix( matrix );
                matrixCopy[r][c] = figure;
                var pts = evaluateGames( matrixCopy, toggle(figure), 0 );
                console.log( "Evaluation for: (" + r + "," + c +", pts=" + eval );
                if( maxPts == null ) {
                    maxPts = pts;
                    bestMove = { row: r, col: c };
                }
                else if( pts > maxPts ) {
                    maxPts = pts;
                    bestMove = { row: r, col: c };
                }
            }
        }
    }
    return bestMove;
}

function evaluateGames(matrix, figure, result) {
    var min = null;
    var max = null;
    var gameResult = gameState(matrix);
    if( gameResult == COMPUTER_LOST ) {
        result = -10;
    }
    else if( gameResult == COMPUTER_WIN ) {
        result = 10;
    }
    else if( matrixFull(matrix) ) {
        result = 0;
    }
    else if( gameResult == NOT_FINISHED ) {
        for( var r=0; r < matrix.length; r++ ) {
            for( var c=0; c < matrix.length; c++ ) {
                var matrixCopy = copyMatrix( matrix );
                if( matrixCopy[r][c] == '') {
                    matrixCopy[r][c] = figure;
                    var pts = evaluateGames(matrixCopy, toggle(figure), result);
                    min = min == null ? pts : min;
                    max = max == null ? pts : max;
                    if( pts < min )  {
                        min = pts;
                    }
                    else if( pts > max )  {
                        max = pts;
                    }
                }
            }
        }
        result += ( isOpponentsTurn(figure) ? min : max );
    }
    return result;
}

function isOpponentsTurn(currentFigure) {
    return  currentFigure == 'O';
}

function toggle(figure) {
    return figure == 'X' ? 'O' : 'X';
}


/**
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
