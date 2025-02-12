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
    }

    // fetches the gameboard for the UI
    const getGameboard = () => gameArray;

    return { getGameboard, placeMarker, resetGameboard};
})();

function Player(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
}

const gameFlow = (function () {
    // stores active players
    let players = [];

    let currentPlayer;
    // allows for new players to be registered, cannot allow more than two players
    const regNewPlayers = (name, marker) => {
        if (players.length > 2) return;
        players.push(Player(name, marker));
    }

    // checks all vertical, horizontal, and diagonal rows for a valid win
    const checkWinCond = (marker) => {
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
        const board = Gameboard.getGameboard();

        for (let conditon of conditions) {
            var isWon = true;
            for (let indexs of conditon) {
                if (board[indexs[0]][indexs[1]] != marker) {
                    isWon = false;
                    break;
                }
            }
            if (isWon === true) {
                break;
            }
        }
        return isWon;
    }

    // checks the gameboard to see if there are any more valid cells left over
    const checkTie = () => {
        const board = Gameboard.getGameboard();
        return board.flat().filter(cell => cell === "").length > 0 ? false : true;
    }

    const startGame = () => {
        if (players.length < 2) return;
        currentPlayer = players[0];
        newRound();
    }

    const newRound = () => {
        console.log(Gameboard.getGameboard(), `${currentPlayer.getName()}'s Turn!`);
    }

    const playRound = (row, col) => {
        // need to check valid placement
        console.log(`Player ${currentPlayer.getName()} has placed a marker at row ${row}, col ${col}`);
        Gameboard.placeMarker(currentPlayer.getMarker(), row, col);

        if (checkWinCond(currentPlayer.getMarker())) {
            console.log(`Player ${currentPlayer.getName()} has won!`);
        }
        else if (checkTie()) {
            console.log(`Game Tied!`);
        }

        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
        newRound();
    }

    const newGame = (newPlayers) => {
        Gameboard.resetGameboard();
        if (newPlayers === True) {
            players = [];
        }
    }

    return { regNewPlayers, newGame, playRound, startGame };
})();

const displayController = (function () {
    
})();
