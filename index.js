import musicPlayer from './player.js';

const audio = document.querySelector('audio');
const playerContainer = document.getElementById('player');

musicPlayer.audio = audio;
musicPlayer.player = playerContainer;
musicPlayer.initHTMLElements();

