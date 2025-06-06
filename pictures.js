// Sample photos data
const photos = [
  {
    id: 1,
    title: "Our First Date",
    description: "The day we knew we were meant to be together. Coffee turned into hours of conversation.",
    date: "2023-01-15",
    location: "Central Park Cafe",
    image: "/placeholder.svg?height=400&width=400",
    approved: true,
  },
  {
    id: 2,
    title: "Beach Sunset",
    description: "Watching the sunset together by the ocean. The perfect end to a perfect day.",
    date: "2023-06-20",
    location: "Malibu Beach",
    image: "/placeholder.svg?height=400&width=400",
    approved: true,
  },
  {
    id: 3,
    title: "Anniversary Dinner",
    description: "Celebrating our love with a romantic dinner. One year of beautiful memories.",
    date: "2024-01-15",
    location: "Le Bernardin",
    image: "/placeholder.svg?height=400&width=400",
    approved: true,
  },
  {
    id: 4,
    title: "Mountain Hike",
    description: "Adventure together in the mountains. Reaching new heights, literally and figuratively.",
    date: "2023-09-10",
    location: "Rocky Mountains",
    image: "/placeholder.svg?height=400&width=400",
    approved: true,
  },
  {
    id: 5,
    title: "Cooking Together",
    description: "Making pasta from scratch. It was messy but so much fun!",
    date: "2023-11-25",
    location: "Our Kitchen",
    image: "/placeholder.svg?height=400&width=400",
    approved: true,
  },
  {
    id: 6,
    title: "Concert Night",
    description: "Dancing to our favorite band. The night we sang our hearts out.",
    date: "2023-08-14",
    location: "Madison Square Garden",
    image: "/placeholder.svg?height=400&width=400",
    approved: true,
  },
]

// Load photos when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadPhotos()
  setupUploadForm()
})

function loadPhotos() {
  const galleryGrid = document.getElementById("gallery-grid")
  galleryGrid.innerHTML = ""

  const approvedPhotos = photos.filter((photo) => photo.approved)

  approvedPhotos.forEach((photo) => {
    const photoElement = createPhotoElement(photo)
    galleryGrid.appendChild(photoElement)
  })
}

function createPhotoElement(photo) {
  const photoDiv = document.createElement("div")
  photoDiv.className = "photo-item"
  photoDiv.onclick = () => openModal(photo)

  photoDiv.innerHTML = `
        <div class="photo-image">
            <i class="fas fa-heart"></i>
        </div>
        <div class="photo-info">
            <h3>${photo.title}</h3>
            <p>${photo.description}</p>
            <div class="photo-details">
                <span><i class="fas fa-calendar"></i> ${formatDate(photo.date)}</span>
                ${photo.location ? `<span><i class="fas fa-map-marker-alt"></i> ${photo.location}</span>` : ""}
            </div>
        </div>
    `

  return photoDiv
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function showUploadForm() {
  document.getElementById("upload-section").style.display = "block"
  document.getElementById("upload-section").scrollIntoView({ behavior: "smooth" })
}

function hideUploadForm() {
  document.getElementById("upload-section").style.display = "none"
  document.getElementById("photo-upload-form").reset()
}

function setupUploadForm() {
  const form = document.getElementById("photo-upload-form")
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    const newPhoto = {
      id: photos.length + 1,
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      location: formData.get("location"),
      image: "/placeholder.svg?height=400&width=400", // In real app, this would be the uploaded image
      approved: false, // Needs admin approval
    }

    photos.push(newPhoto)

    // Show success message
    alert("Photo uploaded successfully! It will appear in the gallery after admin approval.")

    hideUploadForm()
  })
}

function openModal(photo) {
  const modal = document.getElementById("photo-modal")
  const modalImage = document.getElementById("modal-image")
  const modalTitle = document.getElementById("modal-title")
  const modalDescription = document.getElementById("modal-description")
  const modalDate = document.getElementById("modal-date")
  const modalLocation = document.getElementById("modal-location")

  modalImage.src = photo.image
  modalImage.alt = photo.title
  modalTitle.textContent = photo.title
  modalDescription.textContent = photo.description
  modalDate.textContent = formatDate(photo.date)
  modalLocation.textContent = photo.location || ""

  modal.style.display = "flex"
  document.body.style.overflow = "hidden"
}

function closeModal() {
  const modal = document.getElementById("photo-modal")
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

// Close modal when clicking outside
document.getElementById("photo-modal").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal()
  }
})

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal()
  }
})
