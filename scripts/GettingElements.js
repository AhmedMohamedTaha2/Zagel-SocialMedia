// 1. Navbar Elements
const navbarBrand = document.querySelector('.navbar-brand');  // Brand logo
const navbarToggle = document.querySelector('.navbar-toggler');  // Navbar toggle button
const navbarMenu = document.querySelector('#nav_lc_hm');  // Collapsible navbar menu
const navItems = document.querySelectorAll('.navbar-nav .nav-item');  // All nav items
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');  // All nav links
const dropdownMenu = document.querySelector('.dropdown-menu');  // Dropdown in navbar
const dropdownLinks = document.querySelectorAll('.dropdown-item');  // Links inside the dropdown
// 2. Profile Section
const profileImage = document.querySelector('.card .rounded-circle');  // Profile image in the post
const profileName = document.querySelector('.card .fw-bold.fs-lg');  // Profile name in the post
const postDate = document.querySelector('.card .datte span');  // Post date
// 3. Post Content
// const postText = document.querySelector('.post-text p');  // Post text content
// const postImageContainer = document.querySelector('.post-img');  // Post image container
// const postImage = document.querySelector('.PostImg');  // Post image itself
// let showFullImageBtn = document.getElementById('show-full-image-btn');
 // Button to show full image
// 4. Post Reactions
const likeButton = document.querySelector('.fa-heart');  // Like button
const commentToggleButton = document.querySelector('[data-bs-toggle="collapse"]');  // Toggle for comments
const saveButton = document.querySelector('.fa-bookmark');  // Save button
const reactionButtons = document.querySelectorAll('.post-reactions a');  // All reaction buttons (like, comment, save)
// 5. Hashtags
const hashtags = document.querySelectorAll('.badge');  // Hashtags section
// 6. Comments Section
const commentSection = document.querySelector('.post-comments');  // Comments container
const commentBlocks = document.querySelectorAll('.comment');  // Each comment block
const commentImages = document.querySelectorAll('.comment img');  // Profile images in comments
const commentContent = document.querySelectorAll('.comment-content p');  // Text content of each comment
const commentDates = document.querySelectorAll('.comment-date span');  // Date for each comment
// 7. Comment Form
const commentInput = document.querySelector('.write-comment input');  // Input field for new comments
const submitCommentButton = document.querySelector('.write-comment button');  // Submit comment button
// 8. Full Image Modal Elements
// const fullImageModal = document.getElementById('full-image-modal');  // Full image modal
// const fullImage = document.querySelector('.image-modal img');  // Full image inside the modal
// const closeModal = document.getElementById('close-modal');  // Close button for the modal

// 9. Post Action Buttons
const actionButtons = document.querySelectorAll('.post-reactions a');  // Like, Comment, Save buttons

// 10. Additional Elements
const postCard = document.querySelector('.card');  // The entire post card container
const collapseCommentsSection = document.querySelector('#collapseExample');  // Collapsible comments section

// Example usage: Log some elements to the console
// console.log(navbarBrand, profileName, postText, postImage, commentSection, actionButtons);
// ===================================================================================================

