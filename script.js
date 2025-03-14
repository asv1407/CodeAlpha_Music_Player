const musicContainer = document.getElementById('music-container');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

const audio = document.getElementById('audio');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const title = document.getElementById('title');
const cover = document.getElementById('cover');
const currTime = document.querySelector('#currTime');
const durTime = document.querySelector('#durTime');

// Song titles and metadata
const songs = ['hey', 'summer', 'maniac', 'PagalWorld', 'ukulele'];
let songIndex = 2; // Start at 'ukulele'

// Initially load song details into DOM
loadSong(songs[songIndex]);

// Function to load song details (title, source, and cover)
function loadSong(song) {
  title.innerText = song;
  audio.src = `music/${song}.mp3`;
  cover.src = `images/${song}.jpg`;
  updateGraphLevel(); // Update graph level when song is loaded
}

// Play song
function playSong() {
  musicContainer.classList.add('play');
  playBtn.querySelector('i.fas').classList.replace('fa-play', 'fa-pause');
  audio.play();
}

// Pause song
function pauseSong() {
  musicContainer.classList.remove('play');
  playBtn.querySelector('i.fas').classList.replace('fa-pause', 'fa-play');
  audio.pause();
}

// Previous song
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length; // Wrap around when reaching the beginning
  loadSong(songs[songIndex]);
  playSong();
}

// Next song
function nextSong() {
  songIndex = (songIndex + 1) % songs.length; // Wrap around when reaching the end
  loadSong(songs[songIndex]);
  playSong();
}

// Update progress bar
function updateProgress(e) {
  const { duration, currentTime } = e.srcElement;
  if (duration && currentTime) {
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;
  }
}

// Update the graph-level beat fill (based on current progress)
function updateGraphLevel() {
  const { duration, currentTime } = audio;
  if (duration && currentTime) {
    const progressPercent = (currentTime / duration) * 100;
    const levelFill = document.querySelector('.level-fill');
    levelFill.style.width = `${progressPercent}%`;
  }
}

// Set progress bar based on user click
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
}

// Format time in MM:SS
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes < 10 ? '0' + minutes : minutes}:${secs < 10 ? '0' + secs : secs}`;
}

// Update current time and duration
function updateTimeDisplay() {
  const { duration, currentTime } = audio;
  if (!isNaN(duration)) {
    currTime.innerText = formatTime(currentTime);
    durTime.innerText = formatTime(duration);
  }
}

// Event listeners
playBtn.addEventListener('click', () => {
  const isPlaying = musicContainer.classList.contains('play');
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// Update progress bar and time display
audio.addEventListener('timeupdate', (e) => {
  updateProgress(e);
  updateTimeDisplay();
  updateGraphLevel(); // Update the graph-level progress
});

// Allow user to click on the progress bar to change the song's position
progressContainer.addEventListener('click', setProgress);

// Automatically move to the next song when current song ends
audio.addEventListener('ended', nextSong);
