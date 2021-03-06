// game implementation
const LEFT_KEY 	= 37;
const UP_KEY 	= 38;
const RIGHT_KEY = 39;
const DOWN_KEY 	= 40;
const WIDTH 	= 720;
const HEIGHT 	= 540;
const MAG		= 6;
const MESH		= 24;
const TIMER_INTERVAL = 33;
const INIT_BALL = 10;

var gStyle = "#ff00ff";
var gX = WIDTH / 2;
var gY = HEIGHT - MESH * 3;
var gScore = 0;
var gLife = 8;
var gKey = new Uint8Array( 0x100 );
var gTimer;
var gBall = [];
var speed = 0;
var bspeed = 0;
var text = ["", "", "", "", "", ""];
var log = ["0","0","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-","-"];
var xymCount = 0;
var cmdCount = 0;
var textCount = 0;
var ballCount = 0;
var gColor = [ "#ffcc00", "#00ffff", "#00ff99" ];

class Ball {
	constructor( c ) {
		this.mX = WIDTH / 2;
		this.mY = MESH * 5; 
		let	a = Math.random() * Math.PI * 2;
		this.mDX = Math.cos( a );
		this.mDY = Math.sin( a );
		this.mStyle = gColor[ c ];
	}

	draw( g ) {
		g.fillStyle = this.mStyle;
		g.fillRect( this.mX - MAG, this.mY - MAG, MAG * 2, MAG * 2 );
	}

	tick() {
		if( IsInRect( this.mX, this.mY, gX, gY, MESH, MESH ) ) {
			return( true );
		}

		this.mX += this.mDX;
		this.mY += this.mDY;

		if( this.mX < MESH || this.mX > WIDTH - MESH ) {
			this.mDX = -this.mDX;
			this.mX += this.mDX;
			gScore++;
		}
		if( this.mY < MESH || this.mY > HEIGHT - MESH ) {
			this.mDY = -this.mDY;
			this.mY += this.mDY;
			gScore++;
		}

		return( false );
	}
}

function IsInRect( x, y, rx, ry, rw, rh ) {
	return( rx < x && x < rx + rw && ry < y && y < ry + rh );
}

function draw() {
	let	g = document.getElementById( "main" ).getContext( "2d" );

	g.fillStyle = "#ffffff";
	g.fillRect( 0, 0, WIDTH, HEIGHT );
	g.fillStyle = "#000000";
	g.fillRect( MESH, MESH, WIDTH - MESH * 2, HEIGHT - MESH * 2 );

	g.fillStyle = gStyle;
	g.fillRect( gX, gY, MESH, MESH );

	for( let b of gBall ) {
		b.draw( g );
	}

	g.font = "24px monospace";
	g.fillStyle = "#000000";
	g.fillText( "SCORE " + gScore, MESH * 2, MESH - 2 );
	g.fillText( "LIFE " + gLife, MESH * 25, MESH - 2 );
	g.fillText( "S Y M B A L L", WIDTH / 2 - MESH * 3, MESH - 2 );

	g.fillStyle = "#777777";
	g.fillText( text[0], 270, 180 );
	g.fillText( text[1], 80,  270 );
	g.fillText( text[2], 80,  420 );
	g.fillText( text[3], 80,  120 );
	g.fillText( text[4], 270, 480 );
	g.fillText( text[5], 270, 330 );

	g.font = "20px monospace";
	g.fillStyle = "#dddddd";
	g.fillText( "???????????????????????????????????????????????????????????????????????????????????????", MESH, HEIGHT + MESH );
	g.fillText( "?????????NCJELEW7XZAYFS56PXW5RCL5CWABTT5YVLO6BFY", MESH, HEIGHT + MESH * 2);
	g.fillText( "XYM????????????0.000001??????", MESH, HEIGHT + MESH * 3);
	g.fillText( "???????????????????????????????????????????????????????????????????????????", MESH, HEIGHT + MESH * 4);
	g.fillText( " ball_up??????????????????3???????????????", MESH, HEIGHT + MESH * 5);
	g.fillText( " life_up??????????????????2??????????????????", MESH, HEIGHT + MESH * 6);
	g.fillText( " speed_up????????????????????????????????????????????????", MESH, HEIGHT + MESH * 7);
	g.fillText( " speed_down????????????????????????????????????????????????", MESH, HEIGHT + MESH * 8);
	g.fillText( " score_up??????????????????XYM????????????????????????????????????", MESH, HEIGHT + MESH * 9);
	g.fillText( " ????????????????????????????????????????????????????????????", MESH, HEIGHT + MESH * 10);

	g.fillStyle = "#202020";
	g.fillRect( WIDTH, 0, WIDTH + MESH * 10, HEIGHT );

	g.fillStyle = "#dddddd";
	g.fillText( "XYM:" + log[0], WIDTH + MESH / 2, MESH );
	g.fillText( "Tx :" + log[1], WIDTH + MESH / 2, MESH * 2);
	for( let i = 2; i < log.length; i++ ) {
		g.fillText( log[i], WIDTH + MESH / 2, MESH * (i + 2) );
	}
	
	if( gLife <= 0 ) {
		g.font = "48px monospace";
		g.fillStyle = "#ffffff";
		g.fillText( "GAME OVER", WIDTH / 2 - MESH * 4.5, HEIGHT / 2 );
	}
}

function start() {
	for( let i = 0; i < INIT_BALL; i++ ) {
		gBall.push( new Ball( ballCount % 3 ) );
		ballCount++;
	}
}

function tick() {
	if( gLife <= 0 ) {
		return;
	}

	gX = Math.max( MESH             , gX - gKey[ LEFT_KEY ] * ( MAG + speed ) );
	gX = Math.min( WIDTH - MESH * 2 , gX + gKey[ RIGHT_KEY ] * ( MAG + speed ) );
	gY = Math.max( MESH             , gY - gKey[ UP_KEY ] * ( MAG + speed ) );
	gY = Math.min( HEIGHT - MESH * 2, gY + gKey[ DOWN_KEY ] * ( MAG + speed ) );

	for( let i = 0; i < 4 + gScore / 36 - textCount / 5 + bspeed; i++ ) {
		for( let i = gBall.length - 2; i >= 0; i-- ) {
			if( gBall[ i ].tick() ) {
				gLife--;
				gBall.splice( i, 1 );
			}
		}
	}

	for( let i = 0; i < 16; i++ ) {
		if( gBall[ gBall.length - 1 ].tick() ) {
			gLife--;
			gBall.splice( gBall.length - 1, 1 );
		}
	}

	if ( gBall.length <= 3 ) {
		gBall.push( new Ball( ballCount % 3 ) );
		ballCount++;
	}
}

function onPaint() {
	if( !gTimer ) {
		gTimer = performance.now();
	}

	if( gTimer + TIMER_INTERVAL < performance.now() ) {
		gTimer += TIMER_INTERVAL;
		tick();
		draw();
	}

	requestAnimationFrame( onPaint );
}

window.onkeydown = function( ev ) {
	if ( ( ev.keyCode >= LEFT_KEY ) && ( ev.keyCode <= DOWN_KEY ) ) {
		ev.preventDefault();
		gKey[ ev.keyCode ] = 1;
	}
}

window.onkeyup = function( ev ) {
	if ( ( ev.keyCode >= LEFT_KEY ) && ( ev.keyCode <= DOWN_KEY ) ) {
		ev.preventDefault();
		gKey[ ev.keyCode ] = 0;
	}
}

window.onload = function() {
	start();
	requestAnimationFrame( onPaint );
}

// Symbol websocket
var ws = new WebSocket( "wss://zzz-symbol.link:3001/ws" );
ws.onopen = function ( event ) {
	console.log( "connection opened" );
}

ws.onmessage=function( event ) {
	response=JSON.parse( event.data );
	console.log( response );
	if('uid' in response) { 
		uid=response.uid;
		transaction= '{"uid":"'+uid+'", "subscribe":"unconfirmedAdded/NCJELEW7XZAYFS56PXW5RCL5CWABTT5YVLO6BFY"}'
		ws.send( transaction );
		console.log( response.topic );
	}
	if(response.topic == "unconfirmedAdded/NCJELEW7XZAYFS56PXW5RCL5CWABTT5YVLO6BFY") {
		var index = 2;
		var message = "";
		var str = response.data.transaction.message;
		var len = str.length;
		if ( len == 0 ) return;

		var amount = parseInt(response.data.transaction.mosaics[0].amount);
		if( response.data.transaction.mosaics[0].id == "6BED913FA20223F8" ) {
			if( amount >= 1 ) {
				var textDecoder = new TextDecoder( "utf-8", { fatal: true } );
				var array = [];
				for(let i = 2; i < len; i += 2) {
					array.push(parseInt( str.slice( i, i + 2 ), 16 ));
				}
				var buffer = Uint8Array.from(array);
				try {
					var message = textDecoder.decode( buffer );
				}
				catch( e ) {
					if( e.name == "TypeError" );
					console.log( e.name );
					return;
				}

				if( message == "ball_add" ) {
					console.log( "ball add command" );
					var addNum = 0;
					if( gBall.length <= 12 ) {
						addNum = 3;
					}
					else if( gBall.length <= 18 ) {
						addNum = 2;
					}
					else addNum = 1;
					for( let i = 0; i < addNum; i++ ) {
						gBall.push( new Ball( ballCount % 3 ) );
						ballCount++;
					}
				}
				else if( message == "life_up" ) {
					console.log( "life up command" );
					gLife += 2;
					gBall.push( new Ball( ballCount % 3 ) );
					ballCount++;
				}
				else if( message == "speed_up" ) {
					console.log( "speed up command" );
					if ( speed <= 40 ) speed += 4;
				}
				else if( message == "speed_down" ) {
					console.log( "speed down command" );
					if ( speed > 4 ) speed -= 4;
				}
				else if( message == "score_up" ) {
					console.log( "score up command" );
					gScore += amount / 1000000;
				}
				else if( message == "bspeed_up" ) {
					bspeed += amount / 1000000;
				}
				else if( message == "bspeed_down" ) {
					bspeed -= amount / 1000000;
				}
				else {
					console.log( "message command" );
					text[textCount % 6] = message + " [" + ( amount / 1000000 ) + "XYM]";
					textCount++;
				}
				cmdCount++;
				xymCount += amount / 1000000;
				log[0] = xymCount;
				log[1] = cmdCount;
				for( let i = log.length - 1; i >= 3; i-- ) {
					log[i] = log[i - 1];
				}
				log[2] = message;
				console.log( "end" );
			}
		}
	}
}

ws.onclose = function( event ) {
	console.log( "connection closed" );
}

ws.onerror = function() {
	console.log( "connection error" );
}
