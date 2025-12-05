// Header Background___________________________________________________________________________________________

const pathName = window.location.pathname
const pageName = pathName.split("/").pop();

if(pageName === "index.html"){
    document.querySelector(".home").classList.add("activeLink");
}

if(pageName === "profile.html"){
    document.querySelector(".profile").classList.add("activeLink");
}
if(pageName === "music.html"){
    document.querySelector(".music").classList.add("activeLink");
}
if(pageName === "mixes.html"){
    document.querySelector(".mixes").classList.add("activeLink");
}
if(pageName === "contacts.html"){
    document.querySelector(".contacts").classList.add("activeLink");
}


const Header = document.querySelector('.header');

window.addEventListener( 'scroll', function(){
    if(this.scrollY > 20){
        Header.classList.add( 'bgColor' );
    }
    else{
        Header.classList.remove( 'bgColor' )
    }
} )

// Hamburger Menu___________________________________________________________________________________________

hamburger = document.querySelector('.hamburger');
hamburger.onclick = function() {
    navBar = document.querySelector(".navbar");
    navBar.classList.toggle("active");
    hamburger.classList.toggle("active")
}



// Hero SLider___________________________________________________________________________________________________

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".image-slide");
  let current = 0;
  const duration = 5000; // 5 seconds per slide

  // Initialize first slide
  slides[current].classList.add("active");

  function showNextSlide() {
    const next = (current + 1) % slides.length;

    slides[current].classList.remove("active");
    slides[next].classList.add("active");

    current = next;
  }

  setInterval(showNextSlide, duration);
});



// PROFILE PAGE_______________________________________________________________________________________________
// _________________________________________________________________________________________________________

  const pdfUrl = "https://drive.google.com/file/d/1KMvZLCpYTFR9q_4yGlxOfOdqeU64LIBu/view?usp=drive_link"; // 🔗 Replace with your PDF URL
  const encodedPdfUrl = encodeURIComponent(pdfUrl); // 🔒 Encoded version

    // Open modal
    function openModal() {
      document.getElementById("shareModal").style.display = "flex";
      setShareLinks();
    }

    // Close modal
    function closeModal() {
      document.getElementById("shareModal").style.display = "none";
    }

    // Setup share links
    function setShareLinks() {
      document.getElementById("gmailShare").href =
        `https://mail.google.com/mail/?view=cm&fs=1&su=Download Just Kaycode's Profile: &body=${encodedPdfUrl}`;
      
      document.getElementById("whatsappShare").href =
        `https://wa.me/?text=${encodeURIComponent("Download Just Kaycode's Profile:  ")}${encodedPdfUrl}`;
      
  
      // Show encoded link above Copy button
      // document.getElementById("pdfLinkDisplay").textContent = encodedPdfUrl;
    }

  



// MIXES PAGE_______________________________________________________________________________________________
// _________________________________________________________________________________________________________


  const API_KEY = "AIzaSyCPY31i4YmZ03Ku70H-Qlm8U7wsU0u6uT4"; // replace with your YouTube API key
  const videosContainer = document.getElementById("videos");
  const searchInput = document.getElementById("search");
  const popup = document.getElementById("popup");
  const closeBtn = document.getElementById("closeBtn");
  let player;
  let allVideos = [];

  // Load YouTube IFrame Player API
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(tag);

  function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
      height: "500",
      width: "100%",
      videoId: "",
      playerVars: { autoplay: 1, controls: 1, rel: 0 }
    });
  }

  const loadingDiv = document.getElementById("loading");
const videosDiv = document.getElementById("videos");

async function fetchVideos(playlistId) {
  // Show loading
  loadingDiv.style.display = "block";
  videosDiv.innerHTML = "";

  try {
    let url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${API_KEY}`;
    let response = await fetch(url);
    let data = await response.json();

    let videos = await Promise.all(data.items.map(async item => {
      let videoId = item.snippet.resourceId.videoId;

      // fetch statistics
      let statsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoId}&key=${API_KEY}`
      );
      let statsData = await statsRes.json();
      let stats = statsData.items[0];

      return {
        id: videoId,
        title: stats.snippet.title,
        thumbnail: stats.snippet.thumbnails.medium.url,
        views: stats.statistics.viewCount,
        channel: stats.snippet.channelTitle,
        playlistId: playlistId
      };
    }));

    renderVideos(videos);
  } catch (error) {
    videosDiv.innerHTML = "<p style='text-align:center;color:red;'>Failed to load videos.</p>";
    console.error(error);
  } finally {
    // Hide loading
    loadingDiv.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchVideos("PLX5_l-5U-rRsOiFT99du9FBZGAlBXO-37");
});

  // Fetch videos from playlist
  // Fetch videos from a playlist with stats
async function fetchPlaylist(playlistId) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=25&playlistId=${playlistId}&key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  const videoIds = data.items.map(item => item.snippet.resourceId.videoId).join(",");

  // Fetch video stats (views, publishedAt, etc.)
  const statsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIds}&key=${API_KEY}`;
  const statsRes = await fetch(statsUrl);
  const statsData = await statsRes.json();

  const statsMap = {};
  statsData.items.forEach(v => {
    statsMap[v.id] = {
      views: v.statistics.viewCount,
      publishedAt: v.snippet.publishedAt
    };
  });

  // Combine snippet + stats
  return data.items.map(item => {
    const videoId = item.snippet.resourceId.videoId;
    return {
      id: videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channel: item.snippet.videoOwnerChannelTitle,
      playlistId: playlistId,
      views: statsMap[videoId]?.views || 0,
      publishedAt: statsMap[videoId]?.publishedAt || ""
    };
  });
}



  // Fetch from all playlists
  async function fetchAllPlaylists() {
    const playlistBtns = document.querySelectorAll(".sidebar button[data-playlist]:not([data-playlist='all'])");
    let merged = [];
    for (let btn of playlistBtns) {
      const vids = await fetchPlaylist(btn.dataset.playlist);
      merged = merged.concat(vids);
    }
    // Sort by upload date (newest first)
    merged.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return merged;
  }


  // Render videos
  function renderVideos(videos) {
    videosContainer.innerHTML = "";
    videos.forEach(video => {
      const viewsFormatted = new Intl.NumberFormat().format(video.views);
      const div = document.createElement("div");
      div.className = "video-card";
      div.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}">
        <h4>${video.title}</h4>
        <p>${viewsFormatted} views</p>
      `;
      div.onclick = () => openPopup(video.id, video.playlistId);
      videosContainer.appendChild(div);
    });
  }


  // Popup player
  function openPopup(videoId) {
    popup.style.display = "flex";
    player.loadVideoById(videoId);
  }
  closeBtn.onclick = () => {
    popup.style.display = "none";
    player.stopVideo();
  };

  // Sidebar filtering
  document.querySelectorAll(".sidebar button").forEach(btn => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.dataset.playlist === "all") {
        allVideos = await fetchAllPlaylists();
        renderVideos(allVideos);
      } else {
        const videos = await fetchPlaylist(btn.dataset.playlist);
        renderVideos(videos);
      }
    });
  });

  // Search
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allVideos.filter(v => v.title.toLowerCase().includes(query));
    renderVideos(filtered);
  });

  // Load all playlists by default
  async function init() {
    allVideos = await fetchAllPlaylists();
    renderVideos(allVideos);
  }
  init();


// CONTACTS PAGE ________________________________________________________________________________________
// ______________________________________________________________________________________________________


// Contact Form_____________________________________________________________________________________________

const inputs = document.querySelectorAll(".input");

function focusFunc() {
  let parent = this.parentNode;
  parent.classList.add("focus");
}

function blurFunc() {
  let parent = this.parentNode;
  if (this.value == "") {
    parent.classList.remove("focus");
  }
}

inputs.forEach((input) => {
  input.addEventListener("focus", focusFunc);
  input.addEventListener("blur", blurFunc);
});

