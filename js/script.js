var chess = document.getElementById("chess");
var context = chess.getContext('2d');
var me = true;
var over = false;
var flag = true;

//标注棋盘上每一个点的二维数组
var points = [];
for(var i = 0; i < 15; i++) {
	points[i] = [];
	for(var j = 0; j < 15; j++) {
		points[i][j] = 0;
	}
}

//创建赢法数组,记录所有连成5颗子的可能性
var wins = [];

for(var i = 0; i < 15; i++) {
	wins[i] = [];
	for(var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
var count = 0;
//横向赢法
for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
console.log(count);

//纵向
for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}

}
console.log(count);

//斜向

for(var i = 0; i < 11; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[j + k][i + k][count] = true;
		}
		count++;
	}

}
console.log(count);
//反斜向
for(var i = 0; i < 11; i++) {
	for(var j = 14; j > 3; j--) {
		for(var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}

}
console.log(count);

//赢法统计数组,初始化
var myWin = [];
var computerWin = [];
for(var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}

context.strokeStyle = "#BFBFBF"
for(var i = 0; i < 15; i++) {
	//划横线
	context.moveTo(15, 15 + i * 30);
	context.lineTo(435, 15 + i * 30);
	context.stroke();
	//划纵线
	context.moveTo(15 + i * 30, 15);
	context.lineTo(15 + i * 30, 435);
	context.stroke();

}

var oneStep = function(x, y, me) {
	//画棋子
	context.beginPath();
	context.arc(15 + x * 30, 15 + y * 30, 13, 0, 2 * Math.PI)
	context.closePath();
	var gradint = context.createRadialGradient(15 + x * 30 + 2, 15 + y * 30 - 2, 13, 15 + x * 30 + 2, 15 + y * 30 - 2, 0);
	if(me) {
		gradint.addColorStop(0, "#0A0A0A");
		gradint.addColorStop(1, "#636766");
	} else {
		gradint.addColorStop(0, "#D1D1D1");
		gradint.addColorStop(1, "#F9F9F9");
	}

	context.fillStyle = gradint;
	context.fill()

}

chess.onclick = function(e) {
	if(over) {
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;

	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(points[i][j] == 0) {
		oneStep(i, j, me);
		points[i][j] = 1;

		for(var k = 0; k < count; k++) {
			if(wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6;
				if(myWin[k] == 5) {
					window.alert("你赢了!")
					over = true;
				}
			}
		}
		if(!over) {
			me = !me;
			computerAI();
		}
	}
}

var computerAI = function() {
	var myScore = [];
	var computerScore = [];

	var max = 0;
	var u = 0;
	var v = 0;

	for(var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for(var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	//遍历棋盘中的每个点
	for(var i = 0; i < 15; i++) {
		for(var j = 0; j < 15; j++) {
			if(points[i][j] == 0) {
				//该点还未落子
				for(var k = 0; k < count; k++) {
					if(wins[i][j][k]) {
						if(myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if(myWin[k] == 2) {
							myScore[i][j] += 400;
							for(var z = 0; z < count; z++) {
								if(wins[i][j][z] && match(k, z) && myWin[z] == 2) {
									//33连

									if(hasOtherPoint(k) == 2) {
										myScore[i][j] = 3000;
									} else {
										myScore[i][j] = 10000;
									}
								}
							}

						} else if(myWin[k] == 3) {

							if(hasOtherPoint(k) == 2) {
								myScore[i][j] += 5000;
							} else {
								myScore[i][j] += 20000;

							}
							for(var z = 0; z < count; z++) {
								if(wins[i][j][z] && match(k, z) && myWin[z] == 2) {
									//34连

									if(hasOtherPoint(k) == 2) {
										myScore[i][j] = 8800;
									} else {
										myScore[i][j] = 66000;

									}
								}
							}

						} else if(myWin[k] == 4) {
							myScore[i][j] += 90000;
						}

						if(computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if(computerWin[k] == 2) {
							computerScore[i][j] += 440;
							for(var z = 0; z < count; z++) {
								if(wins[i][j][z] && match(k, z) && computerWin[z] == 2) {
									//33连
									if(hasOtherPoint(k) == 1) {
										computerScore[i][j] = 3300;
									} else {
										computerScore[i][j] = 11000;
									}

								}
							}

						} else if(computerWin[k] == 3) {
							if(hasOtherPoint(k) == 1) {
								computerScore[i][j] += 5500;
							} else {
								computerScore[i][j] += 22000;

							}

							for(var z = 0; z < count; z++) {
								if(wins[i][j][z] && match(k, z) && computerWin[z] == 2) {
									//34连
									if(hasOtherPoint(k) == 1) {
										computerScore[i][j] = 8800;
									} else {
										computerScore[i][j] = 66000;

									}

								}
							}

						} else if(computerWin[k] == 4) {
							computerScore[i][j] += 99000;
						}
					}
				}

				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if(myScore[i][j] == max) {
					if(computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}

				if(computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if(computerScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}

		}
	}
	oneStep(u, v, false);
	points[u][v] = 2;
	console.log(max);

	for(var k = 0; k < count; k++) {
		if(wins[u][v][k]) {
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k] == 5) {
				window.alert("计算机赢了!")
				over = true;
			}
		}
	}
	if(!over) {
		me = !me;
	}
}

var match = function(k, z) {
		if(k >= 0 && k <= 165) {
			if(z >= 166) {
				return true;
			}
		}

		if(k >= 166 && k <= 330) {
			if(z >= 331 || z <= 165) {
				return true;
			}
		}

		if(k >= 331 && k <= 451) {
			if(z >= 452 || z <= 330) {
				return true;
			}
		}

		if(k >= 452 && k <= 572) {
			if(z <= 451) {
				return true;
			}
		}
		return false;

	}
	//判断当前赢法的边界是否有另一种棋子

var hasOtherPoint = function(k) {

	var temp = [];
	for(var a = 0; a < 2; a++) {
		temp[a] = [];
	}
	var flag = 0;
	for(var j = 0; j < 15; j++) {
		for(var q = 0; q < 15; q++) {
			if(wins[j][q][k] && points[j][q] != 0) {
				if(flag ==0){
					temp[flag].push(j);
					temp[flag].push(q);
					flag++;
				}else{
					temp[1][0] = j;
					temp[1][1] =q;
					flag++;
				}

				
			}

		}
	}

	if(k >= 0 && k <= 165) {
		var x = temp[0][0] - 1;
		var y = temp[0][1];

		var x1 = temp[1][0] + 1;
		var y1 = temp[1][1];
		if(x >= 0 && x < 15 && y >= 0 && y < 15 && x1 >= 0 && x1 < 15 && y1 >= 0 && y1 < 15) {
			if(points[x][y] == 1 || points[x1][y1] == 1) {
				//有黑旗
				return 1;
			}
			if(points[x][y] == 2 || points[x1][y1] == 2) {
				//有白旗
				return 2;
			}
		}
	}

	if(k >= 166 && k <= 330) {
		var x = temp[0][0];
		var y = temp[0][1] - 1;

		var x1 = temp[1][0];
		var y1 = temp[1][1] + 1;
		if(x >= 0 && x < 15 && y >= 0 && y < 15 && x1 >= 0 && x1 < 15 && y1 >= 0 && y1 < 15) {
			if(points[x][y] == 1 || points[x1][y1] == 1) {
				//有黑旗
				return 1;
			}
			if(points[x][y] == 2 || points[x1][y1] == 2) {
				//有白旗
				return 2;
			}
		}

	}

	if(k >= 331 && k <= 451) {
		var x = temp[0][0] - 1;
		var y = temp[0][1] + 1;

		var x1 = temp[1][0] + 1;
		var y1 = temp[1][1] - 1;
		if(x >= 0 && x < 15 && y >= 0 && y < 15 && x1 >= 0 && x1 < 15 && y1 >= 0 && y1 < 15) {
			if(points[x][y] == 1 || points[x1][y1] == 1) {
				//有黑旗
				return 1;
			}
			if(points[x][y] == 2 || points[x1][y1] == 2) {
				//有白旗
				return 2;
			}
		}
	}

	if(k >= 452 && k <= 572) {
		var x = temp[0][0] - 1;
		var y = temp[0][1] - 1;

		var x1 = temp[1][0] + 1;
		var y1 = temp[1][1] + 1;
		if(x >= 0 && x < 15 && y >= 0 && y < 15 && x1 >= 0 && x1 < 15 && y1 >= 0 && y1 < 15) {
			if(points[x][y] == 1 || points[x1][y1] == 1) {
				//有黑旗
				return 1;
			}
			if(points[x][y] == 2 || points[x1][y1] == 2) {
				//有白旗
				return 2;
			}
		}
	}

	return 0;

}