"use strict";

function createPlayer(id) {
  let hasTurn = false;

  function getId() {
    return id;
  }

  function getTurn() {
    return hasTurn;
  }

  function changeTurn() {
    hasTurn = hasTurn ? false : true;
  }

  function setTurn(valueOfTurn) {
    hasTurn = valueOfTurn;
  }

  return { getId, getTurn, changeTurn, setTurn };
}

const game = (() => {
  const startButton = document.querySelector(".start-button");
  const controlFlowDiv = document.querySelector("#control-flow");
  startButton.addEventListener("click", startGame);
  const nameForm = document.createElement("form");
  for (let i = 1; i < 3; i++) {
    const inputBoxDiv = document.createElement("div");
    inputBoxDiv.style.marginBottom = "10px";
    const formLabel = document.createElement("label");
    formLabel.setAttribute("for", `name${i}`);
    formLabel.textContent = `Player ${i} Name: `
    const formInput = document.createElement("input");
    formInput.setAttribute("type", "text");
    formInput.setAttribute("id", `name${i}`);
    formInput.setAttribute("name", "name");
    inputBoxDiv.appendChild(formLabel);
    inputBoxDiv.appendChild(formInput);
    nameForm.appendChild(inputBoxDiv);
    controlFlowDiv.after(nameForm);
  }

  function startGame() {
    const playerOneNameDiv = document.createElement("div");
    let playerOneName = document.getElementById("name1").value;
    playerOneNameDiv.textContent = playerOneName;
    const playerTwoNameDiv = document.createElement("div");
    let playerTwoName = document.getElementById("name2").value;
    playerTwoNameDiv.textContent = playerTwoName;

    startButton.remove();
    nameForm.remove();

    const playerOne = createPlayer(1);
    const playerTwo = createPlayer(2);
    playerOne.setTurn(true);
    playerTwo.setTurn(false);
    visuallyDisplayTurn();

    function visuallyDisplayTurn() {
      if (playerOne.getTurn()) {
        playerOneNameDiv.style.color = "green";
      } else {
        playerOneNameDiv.style.color = "red";
      }
      if (playerTwo.getTurn()) {
        playerTwoNameDiv.style.color = "green";
      } else {
        playerTwoNameDiv.style.color = "red";
      }
    }

    const gameBoard = (() => {
      const boardElement = document.querySelector("#board");
      boardElement.before(playerOneNameDiv);
      boardElement.after(playerTwoNameDiv);
      for (let i = 0; i < 3; i++) {
        const row = document.createElement("div");
        row.classList.add("row");
        boardElement.appendChild(row);
        for (let j = 0; j < 3; j++) {
          const tile = document.createElement("button");
          tile.classList.add("tile");
          tile.addEventListener("click", () => {
            if (tile.textContent !== "") {
              return;
            }

            if (playerOne.getTurn()) {
              tile.textContent = "X";
            } else {
              tile.textContent = "O";
            }
            console.log("change turn");
            playerOne.changeTurn();
            playerTwo.changeTurn();
            visuallyDisplayTurn();
            checkForWinner();
          });
          row.appendChild(tile);
        }
      }

      const rowNodeList = document.querySelectorAll(".row");
      const allTiles = document.querySelectorAll(".tile");
      const resultsDisplayDiv = document.querySelector(".results-display");

      function restartGame() {
        for (let i = 0; i < rowNodeList.length; i++) {
          const rowTiles = rowNodeList[i].children;
          for (let j = 0; j < rowTiles.length; j++) {
            rowTiles[j].textContent = "";
            rowTiles[j].disabled = false;
          }
        }
        resultsDisplayDiv.textContent = "";
        playerOne.setTurn(true);
        playerTwo.setTurn(false);
        visuallyDisplayTurn();
      }

      function checkForWinner() {
        function removeButtonAccess() {
          allTiles.forEach(tile => {
            tile.disabled = true;
          });
        }

        function checkWhoWins(buttonTextContent) {
          if (buttonTextContent === "X") {
            resultsDisplayDiv.textContent = "Player 1 wins!";
          } else {
            resultsDisplayDiv.textContent = "Player 2 wins!";
          }
          playerOneNameDiv.style.color = "black";
          playerTwoNameDiv.style.color = "black";
          removeButtonAccess();
        }

        // check rows
        for (let i = 0; i < rowNodeList.length; i++) {
          const rowTiles = rowNodeList[i].children;
          if (rowTiles[0].textContent !== "" &&
            rowTiles[0].textContent === rowTiles[1].textContent && rowTiles[1].textContent === rowTiles[2].textContent) {
            checkWhoWins(rowTiles[0].textContent);
            return;
          }
        }

        const rowOneTiles = rowNodeList[0].children;
        const rowTwoTiles = rowNodeList[1].children;
        const rowThreeTiles = rowNodeList[2].children;
        // check cols
        for (let i = 0; i < 3; i++) {
          if (rowOneTiles[i].textContent !== "" &&
            rowOneTiles[i].textContent === rowTwoTiles[i].textContent && rowTwoTiles[i].textContent === rowThreeTiles[i].textContent) {
            checkWhoWins(rowOneTiles[i].textContent);
            return;
          }
        }

        // check diagonals
        if (rowOneTiles[0].textContent !== "" &&
          rowOneTiles[0].textContent === rowTwoTiles[1].textContent && rowTwoTiles[1].textContent === rowThreeTiles[2].textContent) {
          checkWhoWins(rowOneTiles[0].textContent);
          return;
        } else if (rowOneTiles[2].textContent !== "" &&
          rowOneTiles[2].textContent === rowTwoTiles[1].textContent && rowTwoTiles[1].textContent === rowThreeTiles[0].textContent) {
          checkWhoWins(rowOneTiles[2].textContent)
          return;
        }

        let counter = 0;
        for (let i = 0; i < rowNodeList.length; i++) {
          const rowTiles = rowNodeList[i].children;
          for (let j = 0; j < rowTiles.length; j++) {
            if (rowTiles[j].textContent !== "") {
              counter++;
            }
          }
        }
        if (counter === 9) {
          console.log("It's a tie!");
        }
      }
      return { restartGame };
    })();

    const controlFlowElement = document.querySelector("#control-flow");
    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart";
    restartButton.classList.add("control-flow-buttons");
    restartButton.addEventListener("click", gameBoard.restartGame);
    controlFlowElement.appendChild(restartButton);
  }
})();