/**
	NyanServer Game Sound System
	   Requires soundmanager2
	http://identsoft.org/nyangame
**/


// Sound constants to use later
var SND_LIVE		= 0,
	SND_GROUNDPOWER	= 1,
	SND_CHERRY		= 2,
	SND_APPLE 		= 3,
	SND_HUESOS 		= 4;
	
var soundFiles = [
					"./sounds/live.mp3",
                    "./sounds/apple.mp3",
					"./sounds/cherry.mp3",
                    "./sounds/ground.mp3",
					"./sounds/huesos.mp3"
				 ];
				 
				 
// Minimal Radio Volume
var RADIO_MIN_VOL = 10,

// Maximal Radio Volume
	RADIO_MAX_VOL = 100,

// Attenuation speed. 1 unit per RADIO_ATT_DEL ms.
	RADIO_ATT_DEL = 10; // ms

				 
var soundObjects = [];
var radioPlayer = null;

var seReady = false;

/*
	Sound Initializing.
	Preloads all sounds to prevent the game from lags,
	prepares all the system to work. 
	Run this when you're initializing your game.
*/
function soundInit()
{
	soundManager.setup({
		url: 'https://static.https.cat/smswf/',
		ontimeout: function ()
		{
			alert("We are sorry, but our sound engine could not start up.");
		},
		onready: function()
		{
			for (i = 0; i < soundFiles.length; i++)
			{
				soundObjects[i] = soundManager.createSound(
				{
					id : "snd"+i,
					allowScriptAccess: 'always',
					url : soundFiles[i],
				});
				
				soundObjects[i].load();
			}
			seReady = true;
			radioPlay();
		}
	});
}

/*
	Main function to play a sound
	Use constants above to play different game sounds,
	for example, to sound a collision of Nyan with Huesos,
	use this: playSound(SND_HUESOS);
*/
function playSound (soundID)
{
	if (seReady)
		soundObjects[soundID].play();
}



/*
	Random Word Generation Functions.
	Used to suppress the cache and play actual radio stream
*/
function rnd(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randword()
{
    var s = '';
    var ltr = 'qwertyuiopasdfghjklzxcvbnm';
    while (s.length < 20)
    {
        s += ltr[rnd(0, 20)];
    }
    return s;
}


/*
	Use this function to start radio stream.
*/
function radioPlay()
{	
	if (seReady)
	{
		radioPlayer = soundManager.createSound(
		{
			id: 'radio',
			allowScriptAccess: 'always',
			volume: 100,
			url: 'https://station.waveradio.org/nyan?' + randword()
		});
		radioPlayer.play();
	}
}

/*
	Use this to shut down the radio
*/
function radioStop()
{
	if (seReady)
	{
		radioPlayer.stop();
		radioPlayer.destruct();
		radioPlayer = null;
	}
}

function radioAttenuate(toMinLevel)
{
	if (!seReady || radioPlayer == null)
		return;

	var volChg = (toMinLevel) ? -1 : 1,
		volResult = radioPlayer.volume + volChg;
		
	if (!(volResult > RADIO_MAX_VOL || volResult < RADIO_MIN_VOL))
	{
		radioPlayer.setVolume(volResult);
		setTimeout(function(){radioAttenuate(toMinLevel)}, RADIO_ATT_DEL);
	}		
}

