const Gameboard = (function () {
    // gameboard array that will hold game data
    const gameArray = [];

    let gameTie = false;
    // fills in the gameArray to an empty 3x3 2D array
    for (let x = 0; x < 3; x++) {
        gameArray[x] = [];
        for (let y = 0; y < 3; y++) {
            gameArray[x][y] = "";
        }
    }

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
                player.setWinState(isWon);
                break;
            }
        }
    };

    // checks the gameboard to see if there are any more valid cells left over
    const checkTie = () => {
        gameTie = gameArray.flat().filter(cell => cell === "").length > 0 ? true : false;
    };

    return { getGameboard, placeMarker, checkWinCond, checkTie};
})();

function Player(name, marker) {
    var playerWon = false;

    const getName = () => name;
    const getMarker = () => marker;
    const getWinState = () => playerWon;

    const setWinState = (state) => playerWon = state;

    return { getName, getMarker, setWinState, getWinState };
}

const displayController = (function () {

})();
