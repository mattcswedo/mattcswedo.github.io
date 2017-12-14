var tracks = [{
	"track": 1,
	"name": "A Shot Of Sunshine",
	"length": "1:23",
	"file": "A_Shot_Of_Sunshine",
	"categories": {
		"genre": "rock pop",
		"mood": "happy upbeat playful",
		"tempo": "moderate-fast"
	},
}, {
	"track": 2,
	"name": "Funky Angelenos",
	"length": "2:22",
	"file": "Funky_Angelenos",
	"categories": {
		"genre": "funk rock",
		"mood": "positive groovy",
		"tempo": "moderate"
	},
}, {
	"track": 3,
	"name": "Imperator Rock",
	"length": "1:41",
	"file": "Imperator_Rock",
	"categories": {
		"genre": "rock indie",
		"mood": "upbeat triumphant playful",
		"tempo": "moderate"
	},
}, {
	"track": 4,
	"name": "King Me",
	"length": "0:31",
	"file": "King_Me",
	"categories": {
		"genre": "rock hard-rock punk",
		"mood": "triumphant angsty",
		"tempo": "fast"
	},
}, {
	"track": 5,
	"name": "Pops Won't Be Tamed",
	"length": "1:02",
	"file": "Pops_Wont_Be_Tamed",
	"categories": {
		"genre": "pop rock",
		"mood": "contemplative hopeful playful",
		"tempo": "moderate"
	},
}, {
	"track": 6,
	"name": "That's The Space Ticket",
	"length": "1:53",
	"file": "Thats_The_Space_Ticket",
	"categories": {
		"genre": "orchestral film score",
		"mood": "suspense mystery scary",
		"tempo": "moderate-slow"
	},
}, {
	"track": 7,
	"name": "The Visitor Score Bounce",
	"length": "3:31",
	"file": "The_Visitor_Score_Bounce",
	"categories": {
		"genre": "orchestral film-score",
		"mood": "suspense horror scary",
		"tempo": "slow"
	}
}];

jQuery(function ($) {
	'use strict'
	var supportsAudio = !!document.createElement('audio').canPlayType;
	if (supportsAudio) {
		var index = 0,
			playing = false,
			mediaPath = './audio/',
			extension = '',
			selected_tracks = tracks,
			buildPlaylist = function() {
				$.each(selected_tracks, function(key, value) {
				var trackNumber = value.track,
					trackName = value.name,
					trackLength = value.length;
				if (trackNumber.toString().length === 1) {
					trackNumber = '0' + trackNumber;
				} else {
					trackNumber = '' + trackNumber;
				}
				$('#plList').append('<li><div class="plItem"><div class="plNum">' + trackNumber + '.</div><div class="plTitle">' + trackName + '</div><div class="plLength">' + trackLength + '</div></div></li>');
			})},
			trackCount = selected_tracks.length,
			npAction = $('#npAction'),
			npTitle = $('#npTitle'),
			audio = $('#audio1').bind('play', function () {
				playing = true;
				npAction.text('Now Playing:');
			}).bind('pause', function () {
				playing = false;
				npAction.text('Paused On:');
			}).bind('ended', function () {
				npAction.text('Paused...');
				if ((index + 1) < trackCount) {
					index++;
					loadTrack(index);
					audio.play();
				} else {
					audio.pause();
					index = 0;
					loadTrack(index);
				}
			}).get(0);
		buildPlaylist();
		var keys = Object.keys(tracks[0].categories),
			subcategories,
			curList;
		for (var i=0; i<keys.length; i++){
			curList = [];
			subcategories = '';
			for(var j=0; j<tracks.length; j++){
				$.each(tracks[j]['categories'][keys[i]].split(" "), function(key, value){
					if(curList.indexOf(value) == -1){
						curList.push(value);
					}
				})
			}
			for(var j=0; j<curList.length; j++){
				subcategories += '<li class="list-group-item" data-scg="' + curList[j] + '">' + curList[j] + '</li>';
			}
			
			$('#cgcontainer').append(
				'<div class="panel panel-default">' +
					'<div class="panel-heading">' +
						'<a data-toggle="collapse" data-parent="#cgcontainer" href="#collapse' + i + '">' + keys[i] + '</a>' +
					'</div>' +
					'<div id="collapse' + i + '" class="panel-collapse collapse">' +
						'<ul class="list-group" data-cg="' + keys[i] + '">' +
							subcategories +
						'</ul>' +
					'</div>' +
				'</div>'
			);
		}
		var btnPrev = $('#btnPrev').click(function () {
				if ((index - 1) > -1) {
					index--;
					loadTrack(index);
					if (playing) {
						audio.play();
					}
				} else {
					audio.pause();
					index = 0;
					loadTrack(index);
				}
			}),
			btnNext = $('#btnNext').click(function () {
				if ((index + 1) < trackCount) {
					index++;
					loadTrack(index);
					if (playing) {
						audio.play();
					}
				} else {
					audio.pause();
					index = 0;
					loadTrack(index);
				}
			}),
			li = $('#plList li').click(function (e) {
				var id = parseInt($(this).index());
				if (id !== index) {
					playTrack(id);
				}
			}),
			cg = $('#cgcontainer li').click(function (e) {
				var cgcontainer = $('#cgcontainer')
				cgcontainer.find('.show').removeClass('show');
				cgcontainer.find('.active').removeClass('active');
				$(this).addClass('active');
				var cg = e.target.parentElement.dataset.cg,
					scg = e.target.dataset.scg;
				selected_tracks = [];
				var keys;
				for(var i=0; i<tracks.length; i++){
					if(tracks[i]['categories'][cg].split(" ").indexOf(scg) !== -1){
						selected_tracks.push(tracks[i]);
					}
				}
				$('#plList').empty();
				buildPlaylist();
				li = $('#plList li').click(function () {
					var id = parseInt($(this).index());
					playTrack(id);
				})
			}),
			loadTrack = function (id) {
				$('.plSel').removeClass('plSel');
				$('#plList li:eq(' + id + ')').addClass('plSel');
				npTitle.text(selected_tracks[id].name);
				index = id;
				audio.src = mediaPath + selected_tracks[id].file + extension;
			},
			playTrack = function (id) {
				loadTrack(id);
				audio.play();
			};
		extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
		loadTrack(index);
	}
});

plyr.setup($('#audio1'), {});
