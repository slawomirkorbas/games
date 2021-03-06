var totalFields = 9;//matrix.length * matrix.length;
var COMPUTER_WIN = 1;
var COMPUTER_LOST = -1;
var DRAW = 0;
var NOT_FINISHED = 728;
var computerFigure;

/**
 * Return null if there is no move possible as the matrix is full.
 * @param matrix
 * @param computerFigure
 * @returns {state: number, {row: number, col: number}}
 */
function doBestMove(matrix, figure) {
    computerFigure = figure;
    var bestMoves = [];
    var result = { nextMove: null, state: null};
    result.state = gameState(matrix);
    if( result.state == NOT_FINISHED) {
        var maxPts = null;
        for (var r = 0; r < matrix.length; r++) {
            for (var c = 0; c < matrix.length; c++) {
                if (matrix[r][c] == '') {
                    var matrixCopy = copyMatrix(matrix);
                    matrixCopy[r][c] = figure;
                    var pts = evaluateGames(matrixCopy, toggle(figure), 0);
                    //console.log("Evaluation for: (" + r + "," + c + ", pts=" + eval);
                    if (maxPts == null || pts == maxPts) {
                        maxPts = pts;
                        bestMoves[bestMoves.length] = {row: r, col: c};
                    } else if (pts > maxPts) {
                        maxPts = pts;
                        bestMoves.length = 0;
                        bestMoves[bestMoves.length] = {row: r, col: c};
                    }
                }
            }
        }
        if(bestMoves.length > 0) {
            result.nextMove = bestMoves[ randomInt(0, bestMoves.length - 1) ];
            matrix[result.nextMove.row][result.nextMove.col] = figure;
        }
        // update game state again
        result.state = gameState(matrix);
    }
    return result;
}

/**
 * Returns random integer number form given range
 * @param min
 * @param max
 * @returns {*}
 */
function randomInt(min, max) {
    return min + Math.floor((max - min) * Math.random());
}

/**
 * Evaluate all possible games from given point (game state) and calculate total sore for each of them
 * @param matrix
 * @param figure
 * @param result
 * @returns {number}
 */
function evaluateGames(matrix, figure, result) {
    var min = null;
    var max = null;
    var gameResult = gameState(matrix);
    if( gameResult == COMPUTER_LOST ) {
        result = -10 * countOccupiedFields(matrix);
    }
    else if( gameResult == COMPUTER_WIN ) {
        result = 10 * countOccupiedFields(matrix);
    }
    else if( gameResult == DRAW ) {
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
    return  currentFigure != computerFigure;
}

function toggle(figure) {
    return figure == 'X' ? 'O' : 'X';
}


/**
 * @param matrix
 * @param figure
 * @returns  0 - DRAW, 1 - 'X' has won, -1 - 'O' has won
 */
function gameState( matrix ) {
    // horizontal scan...
    var countX = 0, countO = 0, winCount = 3;
    for( var r=0; r < matrix.length; r++ ) {
        for( var c=0; c < matrix.length; c++ ) {
            countX = matrix[r][c] == 'X' ? countX + 1 : 0;
            countO = matrix[r][c] == 'O' ? countO + 1 : 0;
        }
        if(countX == winCount )
            return computerFigure == 'X' ? COMPUTER_WIN : COMPUTER_LOST;
        if(countO == winCount )
            return computerFigure == 'O' ? COMPUTER_WIN : COMPUTER_LOST;
        countX = countO = 0;
    }
    //vertical scan...
    countX = countO = 0;
    for( var c=0; c < matrix.length; c++ ) {
        for( var r=0; r < matrix.length; r++ ) {
            countX = matrix[r][c] == 'X' ? countX + 1 : 0;
            countO = matrix[r][c] == 'O' ? countO + 1 : 0;
        }
        if(countX == winCount )
            return computerFigure == 'X' ? COMPUTER_WIN : COMPUTER_LOST;
        if(countO == winCount )
            return computerFigure == 'O' ? COMPUTER_WIN : COMPUTER_LOST;
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
            if(countX == winCount )
                return computerFigure == 'X' ? COMPUTER_WIN : COMPUTER_LOST;
            if(countO == winCount )
                return computerFigure == 'O' ? COMPUTER_WIN : COMPUTER_LOST;
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
            if(countX == winCount )
                return computerFigure == 'X' ? COMPUTER_WIN : COMPUTER_LOST;
            if(countO == winCount )
                return computerFigure == 'O' ? COMPUTER_WIN : COMPUTER_LOST;
        }
        countX = countO = 0;
    }

    if( countOccupiedFields(matrix) == totalFields)
    {
        return DRAW;
    }
    return NOT_FINISHED;    // game is not over
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
}
