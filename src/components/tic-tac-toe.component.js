/* global AFRAME */
const { Board } = require('tictactoe-game-modules')

let board = new Board
const X_SYMBOL = 'X'
const O_SYMBOL = 'O'

const GRID_SIZE = [3, 3]
let [rowSize, colSize] = GRID_SIZE
let mySymbol = null

function processTurn(move, symbol) {
        board = board.makeMove(move, symbol)

        if (board.isGameOver()) {
          if (board.hasWinner()) {
            let winningSymbol = board.winningPlayer()
            alert(`${winningSymbol} wins`)
          } else {
            alert('Tie game')
          }
        }
  
        return board
}

AFRAME.registerComponent('tic-tac-toe', {
  schema: {
    crosstemplate: { default: '' },
    ringtemplate: { default: '' },
    keyCode: { default: 32 }
  },

  init: function() {
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keyup", this.onKeyUp);

    NAF.connection.subscribeToDataChannel('ticTacToe', function(senderId, dataType, data, targetId) {
      let {move, symbol} = data
      board = processTurn(move, symbol)
    })

    // document.body.addEventListener('entityCreated', function (event) {
    //   console.log('meta', event.detail.meta)
    //   if (event.detail.meta.move !== '' && event.detail.meta.symbol !== '') {
    //     
    //   }
    // })
  },

  onKeyUp: function(e) {
    let rowIndex = null
    let colIndex = null
    let index = null

    switch (e.keyCode) {
      case 49: // 0
        index = 0
      break;
      case 50: // 1
        index = 1
      break;
      case 51: // 2
        index = 2
      break;
      case 52: // 3
       index = 3
      break;
      case 53: // 4
        index = 4
      break;
      case 54: // 5
        index = 5
      break;
      case 55: // 6
        index = 6
      break;
      case 56: // 7
        index = 7
      break;
      case 57: // 8
        index = 8
      break;
      case 79: // O
        mySymbol = O_SYMBOL
      break;
      case 88: // X
        mySymbol = X_SYMBOL
      break;
    }

    rowIndex = Math.floor(index / rowSize)
    colIndex = Math.floor(index % colSize)
    
    if (index !== null) {
      let number = (index + 1)

      if (board.currentMark() !== mySymbol) {
        alert('Not your turn, wait for other player to take theirs')
      } else if (!board.isPositionTaken(number)) {
        var el = document.createElement('a-entity');
        let template = (mySymbol === 'X') ? this.data.crosstemplate : this.data.ringtemplate
        el.setAttribute('networked', 'template:' + template);

        let [x, y, z] = [0, 0, 0]
  
        x += rowIndex
        z += colIndex
  
        el.setAttribute('position', {x, y, z});
        var scene = this.el.sceneEl;
        scene.appendChild(el);

        board = processTurn(number, mySymbol)
        NAF.connection.broadcastDataGuaranteed('ticTacToe', {move: number, symbol: mySymbol});
      } else {
        let availablePositionsCount = board.availablePositionCount()
        let availablePositions = board.availablePositions().join(', ')
        alert(`Position already taken, ${availablePositionsCount} positions available (${availablePositions})`)
      }
    }
  }
});