class MusicPlayer {
    constructor() {
        if (MusicPlayer.instance) {
        return MusicPlayer.instance;
        }
        MusicPlayer.instance = this;
        this.initStates();
    }

    initHTMLElements() {
        this.playBtn = this.player.querySelector('#play');
        this.playProgress = this.player.querySelector('#play-progress');
        this.progressBar = this.playProgress.querySelector('.rectangle-prev');
        this.progressCircle = this.playProgress.querySelector('.circle');

        this.currentSpan = this.player.querySelector('#current-span');
        this.endSpan = this.player.querySelector('#end-span');
        
        this.playDragging = new DragProgressBar(
            this.audio, this.playProgress, this.progressBar, this.progressCircle, 
            'play', () => this.setCurrentDuration()
        ); 

        this.initEventListeners();
    }

    initStates() {
        this.isFullscreen = false;
        this.audioLevel = 1; 
        this.isPlaying = false;
        this.currentTime = 0;
    }

    initEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlay());

        this.playProgress.addEventListener('click', (e) => this.playDragging.handleProgressClick(e));
        this.playProgress.addEventListener('mousedown', (e) => this.playDragging.startDragging(e));
        document.addEventListener('mousemove', (e) => this.playDragging.handleDrag(e));
        document.addEventListener('mouseup', (e) => {
            this.playDragging.stopDragging(e)

            if (this.isPlaying) {
                this.audio.play();
            }
        });
        
        this.audio.addEventListener('timeupdate', () => this.playDragging.updateProgress());
    }

    setDuration() {
        const duration = this.audio.duration || 0;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        
        this.endTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.endSpan.innerHTML = this.endTime;
    }

    setCurrentDuration() {
        const duration = this.audio.currentTime || 0;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        
        this.currentTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        this.currentSpan.innerHTML = this.currentTime;
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        if (this.isPlaying) {
            this.audio.play();
            this.playBtn.src = "img/player-pause.svg";
        } else {
            this.audio.pause();
            this.playBtn.src = "img/player-play.svg";
        }
    }
}

class DragProgressBar {
    constructor(audio, fullProgress, progress, circle, type, updateCallback) {
        this.audio = audio;
        this.fullProgress = fullProgress;
        this.progress = progress;
        this.circle = circle;
        this.isDragging = false;
        this.type = type;
        this.updateCallback = updateCallback;
    }

    stopDragging(e) {
        if (this.isDragging) {
            this.isDragging = false;
            this.fullProgress.classList.remove('dragging'); 
            const rect = this.fullProgress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;

            if (this.type == 'play') {
                this.audio.currentTime = pos * this.audio.duration;
            }
            if (this.type == 'volume') {

            }
        }
    }

    handleDrag(e) {
        if (this.isDragging) {
            const rect = this.fullProgress.getBoundingClientRect();
            let pos = (e.clientX - rect.left) / rect.width;
            pos = Math.max(0, Math.min(1, pos));
            this.progress.style.width = `${pos * 100}%`;
            this.circle.style.left = `${pos * 100 - 1}%`;
        }
    }

    startDragging(e) {
        this.isDragging = true;
        this.fullProgress.classList.add('dragging');
    }

    handleProgressClick(e) {
        if (!this.isDragging) {
            const rect = this.fullProgress.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;

            if (this.type == 'play') {
                this.audio.currentTime = pos * this.audio.duration;
            }
            if (this.type == 'volume') {

            }
        }
    }

    updateProgress() {
        if (!this.isDragging && this.type =='play' && this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${progress}%`;
            this.circle.style.left = `${progress - 1}%`;

            if (this.updateCallback) {
                this.updateCallback();
            }
        }
        if(!this.isDragging && this.type == 'volume') {

        }
    }
}


const musicPlayerInstance = new MusicPlayer();
export default musicPlayerInstance;