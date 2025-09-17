const audio = document.getElementById("audio");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current");
const durationEl = document.getElementById("duration");
const playlistEl = document.getElementById("playlist");
const downloadBtn = document.getElementById("download");

let songs = [
  { title: "No Ithui Twarikuo ft Joseph Kamaru", artist: "Just Kaycode", src: "songs/Just Kaycode - No Ithui Twarikuo Remix.mp3", cover: "covers/ithui.jpg" },
  { title: "Twathiaga Tukenete ft Gathee wa Njeri", artist: "Just Kaycode", src: "songs/Just Kaycode - Twathiaga Tukenete ft Gathee wa Njeri.mp3", cover: "covers/tukenete.jpg" },
  { title: "Cangarara Mwomboko", artist: "Just Kaycode", src: "songs/Just Kaycode - Cangarara Mwomboko.mp3", cover: "covers/cangarara.jpg" },
  { title: "Njika na Njika Mwomboko", artist: "Just Kaycode", src: "songs/Just Kaycode - Njika na Njika Mwomboko.mp3", cover: "covers/njika.jpg" },
  { title: "Happiness", artist: "Just Kaycode", src: "songs/Just Kaycode - Happiness.mp3", cover: "covers/happiness.jpg" },
  { title: "Love Again", artist: "Just Kaycode", src: "songs/Just Kaycode - Love Again.mp3", cover: "covers/love.jpg" },
  { title: "Found You", artist: "Just Kaycode", src: "songs/Just Kaycode - Found You.mp3", cover: "covers/found.jpg" },
  { title: "Toi Et Moi", artist: "Just Kaycode", src: "songs/Just Kaycode - Toi Et Moi.mp3", cover: "covers/toi.jpg" }
];

let songIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Load song
function loadSong(index) {
  const song = songs[index];
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;
  downloadBtn.href = song.src;
  highlightPlaylist();
}

// Play / Pause
function playSong() {
  audio.play();
  playBtn.textContent = "⏸";
  isPlaying = true;
}
function pauseSong() {
  audio.pause();
  playBtn.textContent = "▶";
  isPlaying = false;
}

// Next / Prev
function nextSong() {
  if (isShuffle) {
    songIndex = Math.floor(Math.random() * songs.length);
  } else {
    songIndex = (songIndex + 1) % songs.length;
  }
  loadSong(songIndex);
  playSong();
}
function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songIndex);
  playSong();
}

// Time & Progress
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});
progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

// Ended behavior
audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong();
  } else {
    nextSong();
  }
});

// Playlist UI with duration
songs.forEach((song, index) => {
  const li = document.createElement("li");
  const left = document.createElement("span");
  const right = document.createElement("span");

  // left.textContent = `${song.title} - ${song.artist}`; // use this to include artist name on the playlist
  left.textContent = `${song.title}`;
  right.textContent = "--:--"; // placeholder duration

  li.appendChild(left);
  li.appendChild(right);
  li.dataset.index = index;

  li.addEventListener("click", () => {
    songIndex = index;
    loadSong(songIndex);
    playSong();
  });

  playlistEl.appendChild(li);

  // Load audio to get duration
  const tempAudio = new Audio(song.src);
  tempAudio.addEventListener("loadedmetadata", () => {
    right.textContent = formatTime(tempAudio.duration);
  });
});

function highlightPlaylist() {
  [...playlistEl.children].forEach((li, idx) => {
    li.classList.toggle("active", idx === songIndex);
  });
}

function formatTime(sec) {
  let m = Math.floor(sec / 60);
  let s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

// Button events
playBtn.addEventListener("click", () => isPlaying ? pauseSong() : playSong());
nextBtn.addEventListener("click", nextSong);
prevBtn.addEventListener("click", prevSong);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle("active", isShuffle);
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("active", isRepeat);
});

// Init
loadSong(songIndex);


