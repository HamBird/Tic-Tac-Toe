const Gameboard = (function () {
    // gameboard array that will hold game data
    var gameArray = [];

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
        // if the spot is already occupied, return false indicate invalid play
        if (gameArray[row][col] !== "") return false;
        gameArray[row][col] = marker;
        // returns true to indicate valid play
        return true;
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

const displayController = (function () {
    const displayBoard = () => {
        const board = Gameboard.getGameboard();

        var cells = "";
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                cells += `<div class="cells" data-row="${row}" data-col="${col}">${board[row][col]}</div>`;
            }
        }

        document.querySelector(".board").innerHTML = cells;
        setCellEvent();
    }

    const setCellEvent = () => {
        document.querySelectorAll(".cells").forEach(cell => {
            cell.addEventListener("click", () => {
                gameFlow.playRound(cell.dataset.row, cell.dataset.col);
            });
        });
    }

    const displayStatus = (status) => {
        document.querySelector(".display>h2").innerHTML = status;
    }

    displayBoard();

    return { displayBoard, displayStatus };
})();

const gameFlow = (function () {
    // stores active players
    let players = [
        // preset players to test UI
        Player("Joe", "X"),
        Player("Bill", "O"),
    ];

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
    var isGameOver = false;
    // checks the gameboard to see if there are any more valid cells left over
    const checkTie = () => {
        const board = Gameboard.getGameboard();
        return board.flat().filter(cell => cell === "").length > 0 ? false : true;
    }

    const newRound = () => {
        console.log(Gameboard.getGameboard(), `${currentPlayer.getName()}'s Turn!`);
        displayController.displayStatus(`${currentPlayer.getName()}'s Turn!`);
    }

    const startGame = () => {
        if (players.length < 2 && !isGameOver) return;
        currentPlayer = players[0];
        newRound();
    }

    // used to debug UI
    startGame();
    const playRound = (row, col) => {
        // need to check valid placement
        if (Gameboard.placeMarker(currentPlayer.getMarker(), row, col) && !isGameOver) {
            console.log(`Player ${currentPlayer.getName()} has placed a marker at row ${row}, col ${col}`);

            if (checkWinCond(currentPlayer.getMarker())) {
                console.log(`Player ${currentPlayer.getName()} has won!`);
                displayController.displayStatus(`Player ${currentPlayer.getName()} has won!`);
                isGameOver = true;
            }
            else if (checkTie()) {
                console.log(`Game Tied!`);
                displayController.displayStatus(`Game Tied!`);
                isGameOver = true;
            }
            else {
                currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
                newRound();
            }
            displayController.displayBoard();
        }
    }

    const newGame = (newPlayers) => {
        Gameboard.resetGameboard();
        displayController.displayBoard();
        displayController.displayStatus("Start game when ready!");
        isGameOver = false;
        if (newPlayers === true) {
            players = [];
        }
    }

    // Should add a boolean to check if game has ended in anyway to halt the game from progressing anymore
    return { regNewPlayers, newGame, playRound, startGame };
})();


let dialog = document.getElementById("player-dialog");
// opens the dialog
function openDialog() {
    dialog.showModal();
}
// clears the data in the dialog and closes after
function closeDialog() {
    dialog.close();
}