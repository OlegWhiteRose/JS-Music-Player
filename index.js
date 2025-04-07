import MusicPlayer from "./player.js";

const audio = document.querySelector('audio');
const player = document.getElementById('player');

const musicPlayer = new MusicPlayer(audio, player);