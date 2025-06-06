// Navigation toggle for mobile
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
    })
  }
})

// Song data
const songs = {
  forever: {
    title: "Our Forever",
    lyrics: [
      "In your eyes, I see my forever",
      "In your smile, I find my home",
      "Every moment spent together",
      "Makes my heart no longer roam",
      "",
      "You're the melody in my silence",
      "You're the color in my gray",
      "With you, life has found its balance",
      "Love grows stronger every day",
      "",
      "Through the seasons, through the years",
      "Hand in hand, we'll face it all",
      "Joy and laughter, hopes and fears",
      "Together we will stand tall",
      "",
      "This is our song, our love story",
      "Written in the stars above",
      "Every chapter filled with glory",
      "This is our eternal love",
    ],
  },
  memories: {
    title: "Beautiful Memories",
    lyrics: [
      "Remember when we first met",
      "That coffee shop on rainy day",
      "Your laugh, I can't forget",
      "It swept my fears away",
      "",
      "Dancing in the kitchen light",
      "Singing songs off-key",
      "Every moment feels so right",
      "You're all I'll ever need",
      "",
      "Beautiful memories we make",
      "Every single day",
      "Beautiful memories we take",
      "They'll never fade away",
      "",
      "From sunrise to the stars",
      "You're my favorite view",
      "No matter where we are",
      "I'm home when I'm with you",
    ],
  },
  journey: {
    title: "Our Journey",
    lyrics: [
      "Two paths that crossed one day",
      "In the most unexpected way",
      "Now we walk this road together",
      "Come what may, we'll face the weather",
      "",
      "Every step we take as one",
      "Every mile we've overcome",
      "Looking back at where we started",
      "Grateful for this journey hearted",
      "",
      "Our journey's just begun",
      "Adventures yet to come",
      "Hand in hand we'll run",
      "Until our race is won",
      "",
      "Through mountains high and valleys low",
      "Together we will grow",
      "This journey that we're on",
      "Will last beyond the dawn",
    ],
  },
  dreams: {
    title: "Shared Dreams",
    lyrics: [
      "We dream of little feet",
      "Running through our home",
      "We dream of growing old",
      "Never feeling alone",
      "",
      "We dream of distant shores",
      "Adventures yet unseen",
      "We dream of opening doors",
      "To places we've never been",
      "",
      "Shared dreams, shared hopes",
      "Building castles in the air",
      "Shared dreams, shared scopes",
      "A future beyond compare",
      "",
      "Every dream we share",
      "Makes our bond grow strong",
      "Every hope we dare",
      "Proves that we belong",
    ],
  },
  laughter: {
    title: "Endless Laughter",
    lyrics: [
      "Your silly jokes that make me smile",
      "Your funny faces, worth the while",
      "The way you dance when no one's looking",
      "The way you sing while you're cooking",
      "",
      "Laughter echoes through our days",
      "In so many different ways",
      "From morning giggles to midnight chuckles",
      "You help me through life's struggles",
      "",
      "Endless laughter, endless joy",
      "Like children with a favorite toy",
      "Endless laughter, endless fun",
      "Two hearts beating as one",
      "",
      "When the world gets heavy and dark",
      "Your laughter lights the spark",
      "That reminds me life is good",
      "When shared with you, as it should",
    ],
  },
  together: {
    title: "Always Together",
    lyrics: [
      "Promise me you'll never leave",
      "Promise me you'll always stay",
      "In your arms I do believe",
      "We'll find a way, come what may",
      "",
      "Always together, side by side",
      "Through the storm and through the calm",
      "Always together, you're my guide",
      "You're my shelter, you're my balm",
      "",
      "When the world tries to divide",
      "We'll stand strong, we won't hide",
      "When the future seems unclear",
      "I'm not afraid when you're here",
      "",
      "Always together, this I vow",
      "From this moment until forever",
      "Always together, here and now",
      "Nothing can break us, we'll never sever",
    ],
  },
}

let currentlyPlaying = false
let currentSong = null

function playSong(songKey) {
  const song = songs[songKey]
  if (!song) return

  currentSong = songKey

  // Update the display
  document.getElementById("current-song-title").textContent = song.title
  document.getElementById("song-lyrics").innerHTML = song.lyrics
    .map((line) => (line === "" ? "<br>" : `<p>${line}</p>`))
    .join("")

  // Show the song display section
  document.getElementById("song-display").style.display = "block"

  // Scroll to the song display
  document.getElementById("song-display").scrollIntoView({
    behavior: "smooth",
  })

  // Update play button
  updatePlayButton(false)
  document.getElementById("song-status").textContent = "Ready to play"
}

function togglePlayPause() {
  currentlyPlaying = !currentlyPlaying
  updatePlayButton(currentlyPlaying)

  if (currentlyPlaying) {
    document.getElementById("song-status").textContent = "Now playing..."
    // In a real implementation, you would start audio playback here
  } else {
    document.getElementById("song-status").textContent = "Paused"
    // In a real implementation, you would pause audio playback here
  }
}

function updatePlayButton(isPlaying) {
  const playPauseBtn = document.getElementById("play-pause-btn")
  const icon = playPauseBtn.querySelector("i")

  if (isPlaying) {
    icon.className = "fas fa-pause"
  } else {
    icon.className = "fas fa-play"
  }
}

function closeSong() {
  document.getElementById("song-display").style.display = "none"
  currentlyPlaying = false
  currentSong = null
  document.getElementById("song-status").textContent = "Ready to play"
}

// Add click event to song cards for better UX
document.addEventListener("DOMContentLoaded", () => {
  const songCards = document.querySelectorAll(".song-card")
  songCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (!e.target.classList.contains("play-btn")) {
        const songKey = this.getAttribute("data-song")
        playSong(songKey)
      }
    })
  })
})
