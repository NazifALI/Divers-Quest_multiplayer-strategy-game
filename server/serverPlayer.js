// server definition of player to store each player's position and id
// new player class is made because the server does not use many of the variables defined in client's player class

/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
	var x = startX
	var y = startY
	var id

	// Getters and setters
	var getX () {
		return x;
	}

	var getY () {
		return y;
	}

	var setX (newX) {
		x = newX;
	}

	var setY (newY) {
		y = newY;
	}
};

// Export the Player class so you can use it in
// other files by using require("Player").Player
exports.Player = Player;
