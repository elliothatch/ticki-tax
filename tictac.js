"use strict";
(function(window) {
	var squareContents = [];
		squareContents[Minimax.SPACES.BLANK] = '';
		squareContents[Minimax.SPACES.X] = 'X';
		squareContents[Minimax.SPACES.O] = 'O';
	var gameState = [0,0,0, 0,0,0, 0,0,0];
	var humanPlayer = Minimax.PLAYERS.X;
	var computerPlayer = Minimax.PLAYERS.O;
	var endTextElement = window.document.getElementsByClassName('end-text')[0];
	var board = window.document.getElementsByClassName('board')[0];
	// attach click handlers
	for(var i = 0; i < board.children.length; i++) {
		board.children[i].setAttribute('data-index', i);
		(function(i) {
			board.children[i].addEventListener('click', function(event) {
				if(gameState[i] !== 0) {
					return;
				}
				var boardState = takeTurn(i, Minimax.TURNS[humanPlayer]);
				if(boardState === Minimax.BOARD_STATES.NONE) {
					boardState = takeAiTurn(computerPlayer, gameState);
				}
				if(boardState.winPlayer === humanPlayer) {
					endTextElement.textContent = 'You win! :)';
				}
				if(boardState.winPlayer === computerPlayer) {
					endTextElement.textContent = 'AI wins >:)';
				}
				if(boardState === Minimax.BOARD_STATES.CAT_WIN) {
					endTextElement.textContent = 'cat game :|';
				}
			}, false)
		})(i);
	}

	function newGame(goFirst) {
		for(var i = 0; i < gameState.length; i++) {
			setBoardSquare(i, Minimax.SPACES.BLANK);
		}
		endTextElement.textContent = '';
		if(goFirst) {
			humanPlayer = Minimax.PLAYERS.X;
			computerPlayer = Minimax.PLAYERS.O;
		}
		else {
			humanPlayer = Minimax.PLAYERS.O;
			computerPlayer = Minimax.PLAYERS.X;
			takeAiTurn(computerPlayer, gameState);
		}
	}

	function takeAiTurn(player, state) {
		Minimax.statistics.lastStatesEvaluated = 0;
		console.log('AI thinking...');
		var aiMove = Minimax.minimax(player, state, player, -Infinity, Infinity);
		console.log('Moves evaluated: ' + Minimax.statistics.lastStatesEvaluated);
		return takeTurn(aiMove.index, Minimax.TURNS[player]);
	}

	function takeTurn(index, space) {
		setBoardSquare(index, space);
		return window.Minimax.getWinner(gameState);
	}
	function setBoardSquare(index, space) {
		gameState[index] = space;
		board.children[index].firstChild.textContent = squareContents[space];
	}

	window.TicTac = {
		newGame: newGame
	};
})(window);
