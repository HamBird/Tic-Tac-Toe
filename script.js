const Gameboard = (function () {
    const gameArray = [];
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
    const getGameboard = () => gameArray;
    
    return { getGameboard, placeMarker };
})();

function Player(name, marker) {
    const getName = () => name;
    const getMarker = () => marker;

    return { getName, getMarker };
}

const displayController = (function () {

})();

// Any CODE that needs to edit gameboard should be in the gameboard object and NOT in displayController object
/*
0 0 0
0 0 0
0 0 0

Win conditions: 
horizontal
(00, 01, 02)
(10, 11, 12)
(20, 21, 22)
verical
(00, 10 20)
(01, 11, 21)
(02, 12, 22)
diagonal
(00, 11, 22)
(20, 11 02)
*/