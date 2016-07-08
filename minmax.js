"use strict";
(function(window) {

// game state is an array with the mapping:
// [0,1,2,3,4,5,6,7,8]
// 0 1 2
// 3 4 5
// 6 7 8

var SPACES = {
	BLANK: 0,
	X: 1,
	O: 2
};

var TURNS = [SPACES.X, SPACES.O];

//player value correlates to TURNS index and BOARD_STATES value index
var PLAYERS = {
	X: 0,
	O: 1
};

var BOARD_STATES = {
	NONE: {
		winPlayer: null,
		value: [0, 0]
	},
	X_WIN: {
		winPlayer: PLAYERS.X,
		value: [1, -1]
	},
	O_WIN: {
		winPlayer: PLAYERS.O,
		value: [-1, 1]
	},
	CAT_WIN: {
		winPlayer: null,
		value: [0, 0]
	}
};

var statistics = {
	totalStatesEvaluated: 0,
	lastStatesEvaluated: 0
};

var winStates =
	[[0,1,2], [3,4,5], [6,7,8], // horizontal
	[0,3,6], [1,4,7], [2,5,8], // vertical
	[0,4,8], [2,4,6]]; // diagonal

// returns a player
function getWinner(state) {
	var moveIndexes = state.reduce(function(o, space, i) {
		if(space === SPACES.X) {
			o.x.push(i);
		}
		else if(space === SPACES.O) {
			o.o.push(i);
		}
		else if(space === SPACES.BLANK) {
			o.blank.push(i);
		}
		return o;
	}, {x: [], o: [], blank: []});

	var xoIndexes = [moveIndexes.x, moveIndexes.o];
	// traditional loop so we can return immediately
	for(var i = 0; i < xoIndexes.length; i++) {
		var indexes = xoIndexes[i];
		//look for matches in winStates
		var won = winStates.find(function(winState) {
			return winState.reduce(function(win, position) {
				return (win && indexes.indexOf(position) !== -1);
			}, true);
		});
		if(won) {
			if(i === 0) {
				return BOARD_STATES.X_WIN;
			}
			else if(i === 1) {
				return BOARD_STATES.O_WIN;
			}
		}
	}
	if(moveIndexes.blank.length === 0) {
		return BOARD_STATES.CAT_WIN;
	}
	return BOARD_STATES.NONE;
}

// player is who we're optimizing for
// returns { value, index }
function minimax(player, state, turn) {
	statistics.lastStatesEvaluated++;
	var winner = getWinner(state);
	if(winner !== BOARD_STATES.NONE) {
		return { value: winner.value[player], index: null};
	}

	//create a new game state for each possible move and recurse
	var moves = state.reduce(function(a, space, i) {
		if(space === SPACES.BLANK) {
			a.push({ index: i});
		}
		return a;
	}, []).map(function(obj) {
		var newState = state.slice();
		newState[obj.index] = TURNS[turn];
		return {
			index: obj.index,
			value: minimax(player, newState, (turn + 1) % TURNS.length).value
		};
	});

	return moves.reduce(function(o, move, i) {
		// maximize if it's our turn, minimize otherwise
		if(o === null ||
			((player === turn && move.value > o.value) || (player !== turn && move.value < o.value))) {
			return move;
		}
		return o;
	}, null);
}

window.Minimax = {
	minimax: minimax,
	getWinner: getWinner,
	PLAYERS: PLAYERS,
	TURNS: TURNS,
	SPACES: SPACES,
	BOARD_STATES: BOARD_STATES,
	statistics: statistics
};

})(window);
