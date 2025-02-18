// disable start button til players are added
document.querySelector(".restart").setAttribute("disabled", true);

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
    let winCount = 0;
    const getName = () => name;
    const getMarker = () => marker;
    const incrementWin = () => winCount++;
    const getWins = () => winCount;

    return { getName, getMarker, getWins, incrementWin };
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

    const createScoreBoard = (players) => {
        var scoreboard = "";
        scoreboard += `<p id="player-${players[0].getName()}">${players[0].getName()}</p>`;
        scoreboard += `<p id="player-${players[1].getName()}">${players[1].getName()}</p>`;
        scoreboard += `<div><p id="${players[0].getName()}-wins">${players[0].getWins()}</p></div>`;
        scoreboard += `<div><p id="${players[1].getName()}-wins">${players[1].getWins()}</p></div>`;

        document.querySelector(".scores").innerHTML = scoreboard;
    }

    const updateScoreBoard = (player) => {
        document.getElementById(`${player.getName()}-wins`).innerHTML = player.getWins();
    }

    displayBoard();

    return { displayBoard, displayStatus, createScoreBoard, updateScoreBoard };
})();

const gameFlow = (function () {
    // stores active players
    var players = [];
    let currentPlayer;

    const regPlayers = (playerArray) => {
        playerArray.forEach(player => players.push(player));
    }

    // clears existing players
    const removePlayers = () => players = [];

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

    var isGameOver = true;

    // checks the gameboard to see if there are any more valid cells left over
    const checkTie = () => {
        const board = Gameboard.getGameboard();
        return board.flat().filter(cell => cell === "").length > 0 ? false : true;
    }

    // creates a new round
    const newRound = () => {
        console.log(Gameboard.getGameboard(), `${currentPlayer.getName()}'s Turn!`);
        displayController.displayStatus(`${currentPlayer.getName()}'s Turn!`);
    }

    const playRound = (row, col) => {
        // Checks if the move is valid
        if (!isGameOver && Gameboard.placeMarker(currentPlayer.getMarker(), row, col)) {
            console.log(`Player ${currentPlayer.getName()} has placed a marker at row ${row}, col ${col}`);

            // Checks for a win, tie, else game continues and updates display
            if (checkWinCond(currentPlayer.getMarker())) {
                console.log(`Player ${currentPlayer.getName()} has won!`);
                displayController.displayStatus(`Player ${currentPlayer.getName()} has won!`);
                currentPlayer.incrementWin();
                displayController.updateScoreBoard(currentPlayer);
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

    const newGame = () => {
        if (players.length < 2) return;
        Gameboard.resetGameboard();
        displayController.displayBoard();
        currentPlayer = players[0];
        newRound();
        isGameOver = false;
    }

    // return { regNewPlayers, playRound, startGame, newGame};
    return {  removePlayers, regPlayers, playRound, newGame };
})();


let dialog = document.getElementById("player-dialog");
// opens the dialog
function openDialog() {
    dialog.showModal();
}
// clears the data in the dialog and closes after
function closeDialog() {
    document.getElementById("player1").value = "";
    document.getElementById("player2").value = "";
    dialog.close();
}

// not inside an object due to event.preventDefault()
// Checks if player names are set and are not the same, then removes existing players and adds the names below
// creates the scoreboard, enables the start buttons and closes dialog.
document.querySelector(".submit-btn").addEventListener("click", (event) => {
    event.preventDefault()

    let player1Name = document.getElementById("player1").value;
    let player2Name = document.getElementById("player2").value;
    if (player1Name.length < 1 || player2Name.length < 1 || player1Name === player2Name) {
        alert("Player names MUST include atleast 1 character and cannot be similar.")
        return;
    }

    gameFlow.removePlayers();
    let players = [Player(player1Name, "X"), Player(player2Name, "O")];
    gameFlow.regPlayers(players);
    displayController.createScoreBoard(players);
    document.querySelector(".restart").removeAttribute("disabled");
    closeDialog();
})
