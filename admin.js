// Declare the photos variable
const photos = [
  {
    id: 1,
    title: "Photo 1",
    description: "Description 1",
    date: "2023-01-01",
    approved: false,
    location: "Location 1",
  },
  { id: 2, title: "Photo 2", description: "Description 2", date: "2023-01-02", approved: true, location: "Location 2" },
  { id: 3, title: "Photo 3", description: "Description 3", date: "2023-01-03", approved: false, location: "" },
]

// Get pending photos from the main photos array
function getPendingPhotos() {
  // In a real app, this would fetch from a server
  return photos.filter((photo) => !photo.approved)
}

// Load pending photos when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadPendingPhotos()
})

function loadPendingPhotos() {
  const container = document.getElementById("pending-photos-container")
  const pendingPhotos = getPendingPhotos()

  if (pendingPhotos.length === 0) {
    container.innerHTML = `
            <div class="no-pending">
                <i class="fas fa-check-circle"></i>
                <h3>No Pending Photos</h3>
                <p>All photos have been reviewed. New uploads will appear here.</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 3rem; color: #333; font-size: 2.5rem;">
            Pending Photos (${pendingPhotos.length})
        </h2>
        <div class="pending-grid">
            ${pendingPhotos.map((photo) => createPendingPhotoHTML(photo)).join("")}
        </div>
    `
}

function createPendingPhotoHTML(photo) {
  return `
        <div class="pending-item">
            <div class="pending-header">
                <h3>${photo.title}</h3>
                <div class="pending-status">
                    <i class="fas fa-clock"></i>
                    Pending
                </div>
            </div>
            
            <div class="pending-image">
                <i class="fas fa-image"></i>
                <span>Photo Preview</span>
            </div>
            
            <div class="pending-info">
                <p>${photo.description}</p>
            </div>
            
            <div class="pending-details">
                <p><strong>Date:</strong> ${formatDate(photo.date)}</p>
                ${photo.location ? `<p><strong>Location:</strong> ${photo.location}</p>` : ""}
                <p><strong>Uploaded:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="pending-actions">
                <button class="approve-btn" onclick="approvePhoto(${photo.id})">
                    <i class="fas fa-check"></i>
                    Approve
                </button>
                <button class="reject-btn" onclick="rejectPhoto(${photo.id})">
                    <i class="fas fa-times"></i>
                    Reject
                </button>
            </div>
        </div>
    `
}

function approvePhoto(photoId) {
  const photoIndex = photos.findIndex((photo) => photo.id === photoId)
  if (photoIndex !== -1) {
    photos[photoIndex].approved = true

    // Show success message
    showNotification("Photo approved successfully!", "success")

    // Reload pending photos
    loadPendingPhotos()
  }
}

function rejectPhoto(photoId) {
  const photoIndex = photos.findIndex((photo) => photo.id === photoId)
  if (photoIndex !== -1) {
    photos.splice(photoIndex, 1)

    // Show success message
    showNotification("Photo rejected and removed.", "info")

    // Reload pending photos
    loadPendingPhotos()
  }
}

function showNotification(message, type) {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check" : "info"}-circle"></i>
        ${message}
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#4caf50" : "#2196f3"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        animation: slideIn 0.3s ease;
    `

  // Add animation
  const style = document.createElement("style")
  style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `
  document.head.appendChild(style)

  // Add to page
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideIn 0.3s ease reverse"
    setTimeout(() => {
      document.body.removeChild(notification)
      document.head.removeChild(style)
    }, 300)
  }, 3000)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
