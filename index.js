import musicPlayer from './player.js';

const audio = document.querySelector('audio');
const playerContainer = document.getElementById('player');

musicPlayer.audio = document.createElement('audio');
musicPlayer.audio.src = 'MiSide_-_Menu_Update.mp3';
musicPlayer.player = playerContainer;
musicPlayer.initHTMLElements();

