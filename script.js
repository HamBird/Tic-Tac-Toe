const Gameboard = (function () {
    // gameboard array that will hold game data
    const gameArray = [];

    // fills in the gameArray to an empty 3x3 2D array
    const resetGameboard = () => {
        for (let x = 0; x < 3; x++) {
            gameArray[x] = [];
            for (let y = 0; y < 3; y++) {
                gameArray[x][y] = "";
            }
        }
    }
    // resets gameboard before game initalization
    resetGameboard();

    // places player marker if the space is unoccupied by either player
    const placeMarker = (marker, row, col) => {
        if (gameArray[row][col] !== "") return;
        gameArray[row][col] = marker;
    };

    // fetches the gameboard for the UI
    const getGameboard = () => gameArray;
    
    // checks all vertical, horizontal, and diagonal rows for a valid win
    const checkWinCond = (player) => {
        const conditions = [
            [ [0, 0], [0, 1], [0, 2] ],
            [ [1, 0], [1, 1], [1, 2] ],
            [ [2, 0], [2, 1], [2, 2] ],
            [ [0, 0], [1, 0], [2, 0] ],
            [ [0, 1], [1, 1], [2, 1] ],
            [ [0, 2], [1, 2], [2, 2] ],
            [ [0, 0], [1, 1], [2, 2] ],
            [ [2, 0], [1, 1], [0, 2] ],
        ];
        
        for (let conditon of conditions) {
            var isWon = true;
            for (let indexs of conditon) {
                if (gameArray[indexs[0]][indexs[1]] != player.getMarker()) {
                    isWon = false;
                    break;
                }
            }
            if (isWon === true) {
                break;
            }
        }
        return isWon;
    };

    // checks the gameboard to see if there are any more valid cells left over
    const checkTie = () => {
        return gameArray.flat().filter(cell => cell === "").length > 0 ? false : true;
    };

    // Build functions for gameplay here but include ways for displayController to access

    return { getGameboard, placeMarker, checkWinCond, checkTie, resetGameboard};
})();

function Player(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
}

const displayController = (function () {

})();
