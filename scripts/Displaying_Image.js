// ==================================================== getting Images ====================================================
const showFullImageBtn = document.getElementById('show-full-image-btn');
const fullImageModal = document.getElementById('full-image-modal');
const closeModal = document.getElementById('close-modal');
const postImage = document.querySelector('.PostImg');  
const fullImage = document.querySelector('.image-modal img');
const layer = document.querySelector(".layer")

// ==================================================== Function to show image and close it ====================================================
showFullImageBtn.addEventListener('click', () => {
    fullImage.src = postImage.src;  // Use the same image source in the modal
    fullImageModal.classList.remove('d-none');
});

closeModal.addEventListener('click', () => {
    fullImageModal.classList.add('d-none');
});

fullImageModal.addEventListener('click', (e) => {
    if (e.target === fullImageModal) {
        fullImageModal.classList.add('d-none');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        fullImageModal.classList.add('d-none');
    }
});

// ================================================= displaying Image ====================================================
const MAX_WIDTH = 500;  
const MAX_HEIGHT = 300; 

// Function to handle the image preview logic
function checkAndHandleImagePreview() {
    const imageWidth = postImage.naturalWidth;
    const imageHeight = postImage.naturalHeight;

    // Check if the image exceeds the max width or height
    if (imageWidth > MAX_WIDTH || imageHeight > MAX_HEIGHT) {
        showFullImageBtn.style.display = 'block';  // Show the 'Show Full Image' button
        postImage.style.maxHeight = `${MAX_HEIGHT}px`;  // Limit the height for preview
        postImage.style.cursor = 'pointer';
    } else {
        // If the image is smaller, just show it without the preview functionality
        showFullImageBtn.style.display = 'none';
        postImage.style.maxHeight = 'auto';  // Reset to auto for smaller images
        layer.style.opacity='0%';

    }
}

// Add the load event listener for when the image is fully loaded
postImage.addEventListener('load', checkAndHandleImagePreview);

// Set an interval to check the image size every second (optional, if image changes dynamically)
setInterval(checkAndHandleImagePreview, 1000);

// Event listener for closing the modal
closeModal.addEventListener('click', () => {
    fullImageModal.classList.add('d-none');  // Hide the modal when clicking 'X'
});
