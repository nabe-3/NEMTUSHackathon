// game implementation
const WIDTH = 720;
const HEIGHT = 540;
const MAG = 6;
const MESH = 24;
const TIMER_INTERVAL = 33;

var gStyle = "#ff00ff";
var gX = WIDTH / 2;
var gY = HEIGHT - MESH * 3;
var gScore = 0;
var gLife = 5;
var gKey = new Uint8Array( 0x100 );
var gTimer;
var gBall = [];
var speed = 0;
var text = ["", "", "", "", "", ""];
var textCount = 0;
var gColor = [ "#ff0000", "#00ffff", "#00ff00", "#ffff00" ];

class Ball {
	constructor( c ) {
		this.mX = WIDTH / 2;
		this.mY = MESH;
		let	a = Math.random() * 2.5 + ( Math.PI - 2.5 ) / 2;
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
	g.fillText( text[0], 300, 180 );
	g.fillText( text[1], 80,  270 );
	g.fillText( text[2], 80,  420 );
	g.fillText( text[3], 80,  120 );
	g.fillText( text[4], 300, 480 );
	g.fillText( text[5], 300, 330 );

	if( gLife <= 0 ) {
	    g.font = "48px monospace";
	    g.fillStyle = "#ffffff";
		g.fillText( "GAME OVER", WIDTH / 2 - MESH * 4.5, HEIGHT / 2 );
	}
}

function start() {
	for( let i = 0; i < 10; i++ ) {
		gBall.push( new Ball( i & 3 ) );
	}
}

function tick() {
	if( gLife <= 0 ) {
		return;
	}

	gX = Math.max( MESH             , gX - gKey[ 37 ] * ( MAG + speed ) );
	gX = Math.min( WIDTH - MESH * 2 , gX + gKey[ 39 ] * ( MAG + speed ) );
	gY = Math.max( MESH             , gY - gKey[ 38 ] * ( MAG + speed ) );
	gY = Math.min( HEIGHT - MESH * 2, gY + gKey[ 40 ] * ( MAG + speed ) );

	for( let i = 0; i < 4 + gScore / 20; i++ ) {
		for( let i = gBall.length - 1; i >= 0; i-- ) {
			if( gBall[ i ].tick() ) {
				gLife--;
				gBall.splice( i, 1 );
			}
		}
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
	gKey[ ev.keyCode ] = 1;
}

window.onkeyup = function( ev ) {
	gKey[ ev.keyCode ] = 0;
}

window.onload = function() {
	start();
	requestAnimationFrame( onPaint );
}

// Symbol websocket
var ws = new WebSocket( 'wss://zzz-symbol.link:3001/ws' );
ws.onopen = function ( event ) {
    console.log( "connection opened" );
}

ws.onmessage=function( event ) {
    response=JSON.parse( event.data );
    console.log( response );
    if('uid' in response) { 
        uid=response.uid;
        transaction= '{"uid":"'+uid+'","subscribe":"unconfirmedAdded/NCJELEW7XZAYFS56PXW5RCL5CWABTT5YVLO6BFY"}'
        ws.send( transaction );
        console.log( response.topic );
    }
    if(response.topic == "unconfirmedAdded/NCJELEW7XZAYFS56PXW5RCL5CWABTT5YVLO6BFY") {
        var index = 2;
        var message = "";
        var str = response.data.transaction.message;
        var len = str.length;

        var amount = parseInt(response.data.transaction.mosaics[0].amount)/1000000;
        if( response.data.transaction.mosaics[0].id == "6BED913FA20223F8" ) {
            if( amount >= 1 ) {
                while ( index < len ) {
                    var tmpstr = str.substr( index, 2 );
                    message += String.fromCharCode( parseInt( tmpstr, 16 ) );
                    index += 2;
                }
                console.log( "message:" + message );

                if( message == "ball_add" ) {
					console.log("ball add command");
					gBall.push( new Ball( 0 ) );
					gBall.push( new Ball( 1 ) );
					gBall.push( new Ball( 2 ) );
				}
                else if( message == "life_up" ) {
					console.log("life up command");
					gLife += 2;
					gBall.push( new Ball( 3 ) );
				}
                else if( message == "speed_up" ) {
					console.log("speed up command");
					if ( speed <= 16 ) speed += 4;
				}
				else if ( message == "speed_down" ) {
					console.log("speed down command");
					if ( speed > 4 ) speed -= 4;
				}
				else if( message == "score_up" ) {
					console.log("score up command");
					gScore += amount;
				}
                else {
					console.log("message command");
                    text[textCount % 6] = message+" ["+amount+"XYM]";
                    textCount++;
                }
				console.log("end");
            }
        }
    }
}

ws.onclose = function( event ) {
    console.log("connection closed" );
}

ws.onerror = function() {
    console.log( "connection error" );
}
