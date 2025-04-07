export default class MusicPlayer {
    counstructor(audio, player) {
        this.audio = audio;
        this.player = player;
        console.log(this.audio);
    }

    initHTMLElements() {
        this.playBtn = this.player.getElementById('play');
        console.log(this.playBtn);
    }

    initStates() {
        this.isFullscreen = false;
        this.audioLevel = 50;
        this.playbackPosition = 0;
        this.isPlaying = false;
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
    }
}