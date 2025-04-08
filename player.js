class MusicPlayer {
    constructor() {
        if (MusicPlayer.instance) {
        return MusicPlayer.instance;
        }
        MusicPlayer.instance = this;
        this.initStates();
    }

    initStates() {
        this.isFullscreen = false;
        this.audioLevel = 0.4; 
        this.isPlaying = false;
        this.currentTime = 0;
    }

    initHTMLElements() {
        this.playBtn = this.player.querySelector('#play');

        this.playProgress = this.player.querySelector('#play-progress');
        this.progressBar = this.playProgress.querySelector('.rectangle-prev');
        this.progressCircle = this.playProgress.querySelector('.circle');

        this.volumeProgress = this.player.querySelector('#volume-progress');
        this.volumeBar = this.volumeProgress.querySelector('.rectangle-prev');
        this.volumeCircle = this.volumeProgress.querySelector('.circle');

        this.currentSpan = this.player.querySelector('#current-span');
        this.endSpan = this.player.querySelector('#end-span');
        
        this.playDragging = new DragProgressBar(
            this.audio, this.playProgress, this.progressBar, this.progressCircle, 
            'play', () => this.setCurrentDuration()
        ); 

        this.initVolume();
        this.volumeDragging = new DragProgressBar(
            this.audio, this.volumeProgress, this.volumeBar, this.volumeCircle,
            'volume', () => this.setAudioLevel()
        );

        this.initEventListeners();
    }

    initVolume() {
        this.audio.volume = this.audioLevel;
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

        this.volumeProgress.addEventListener('click', (e) => this.volumeDragging.handleProgressClick(e));
        this.volumeProgress.addEventListener('mousedown', (e) => this.volumeDragging.startDragging(e));
        document.addEventListener('mousemove', (e) => this.volumeDragging.handleDrag(e));
        document.addEventListener('mouseup', (e) => {
            this.volumeDragging.stopDragging(e)
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

    setAudioLevel() {
        this.audioLevel = this.audio.volume;
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

        if (this.type == 'volume') { 
            this.updateProgress();
        }
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
                this.audio.volume = Math.max(0, Math.min(1, pos));;
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

            if (this.type == 'volume') {
                this.audio.volume = Math.max(0, Math.min(1, pos));
            }
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
                this.audio.volume = Math.max(0, Math.min(1, pos));
                this.updateProgress();
            }
        }
    }

    updateProgress() {
        if (!this.isDragging && this.type =='play' && this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = `${progress}%`;
            this.circle.style.left = `${progress - 1}%`;

            this.updateCallback();
        }
        if(!this.isDragging && this.type == 'volume' && this.audio.volume) {
            const volume = this.audio.volume * 100;
            this.progress.style.width = `${volume}%`; 
            this.circle.style.left = `${volume - 1}%`;

            this.updateCallback();
        }
    }
}


const musicPlayerInstance = new MusicPlayer();
export default musicPlayerInstance;