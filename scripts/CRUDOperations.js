// Get the card container element
const cardContainer = document.querySelector('.cardContainer');
const CurrentUser = JSON.parse(localStorage.getItem("Currentuser")); // Fetch CurrentUser from local storage
const CurrentUserId = CurrentUser.id; // Store CurrentUserId globally for reuse
let authToken = localStorage.getItem('token'); // Fetch token from local storage

// Variables to manage pagination and loading state
let currentPage = 1;
let isLoading = false;

function gettingPosts(page = 1) {
    if (isLoading) return;
    isLoading = true;

    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=8&page=${page}`)
        .then(response => {
            let posts = response.data.data;

            posts.forEach(post => {
                let newCard = document.createElement('div');
                newCard.className = 'card p-3 my-3 w-100 rounded-lg';

                // Create post card HTML
                newCard.innerHTML = `
                    <div class="d-flex align-items-center animate animate__fadeInUp">
                        <img src="${post.author.profile_image || 'https://via.placeholder.com/48'}" 
                            alt="Profile Image" 
                            class="rounded-circle border border-2" 
                            style="width: 48px; height: 48px; object-fit: cover;">
                        <div class="ms-2 d-flex flex-column me-2">
                            <span class="fw-bold text-light">${post.author.name}</span>
                            <span dir="ltr" class="text-light">@${post.author.username}</span>
                        </div>
                    </div>
                    <!-- Post Content -->
                    <div class="tweet-content my-2 px-1">
                        <p class="mb-1 post-text">${post.body}</p>
                    </div>
                    <!-- Post Image -->
                    <div class="post-img mb-3 text-center rounded-1 position-relative border-top border-bottom border-2 border-light">
                        <div class="layer d-flex flex-row align-items-center justify-content-center w-100 h-100">
                            <button class="btn btn-light fw-bold show-full-image-btn ${post.image ? '' : 'd-none'}" 
                                    data-post-id="${post.id}">
                                <i class="fa-solid fa-expand"></i>
                            </button>
                        </div>
                        <img src="${post.image || 'https://via.placeholder.com/250x250'}" 
                            class="img-fluid PostImg rounded-2" 
                            alt="No Image for this post">
                    </div>
                    <!-- Post Reactions -->
                    <div class="post-reactions d-flex justify-content-between pt-3">
                        <div>
                            <a href="#" class="mx-2"><i class="fa-regular fa-heart text-danger"></i> أعجاب</a>
                            <a class="mx-2" data-bs-toggle="collapse" href="#collapseComments${post.id}" role="button" aria-expanded="false" aria-controls="collapseComments${post.id}">
                                <i class="fa-regular fa-comment-dots text-success"></i> تعليق
                            </a>
                            <a href="#" 
                                class="mx-2 edit-btn hidden " 
                                data-bs-toggle="offcanvas" 
                                data-bs-target="#staticBackdrop" 
                                aria-controls="staticBackdrop">
                                <i class="fa-solid fa-pen-to-square text-warning"></i> تعديل
                            </a>

                            <a href="#" class="mx-2 DeleteBtn hidden"><i class="fa-solid fa-trash-can text-danger"></i> حذف</a>

                        </div>
                    </div>
                    <!-- Comments Section -->
                    <div class="collapse my-2" id="collapseComments${post.id}">
                        <div class="post-comments text-light px-3 py-3 mt-2 rounded-2 border border-1 border-light">
                            <p id="comments-count-${post.id}">عدد التعليقات: 0</p>
                            <div id="comments-container-${post.id}">
                                <p>Loading comments...</p>
                            </div>
                            <!-- Write Comment Section -->
                            <div class="write-comment d-flex align-items-center p-2 rounded mt-3 shadow-sm">
                                <input class="form-control me-2 commentText" type="text" placeholder="أضف تعليقك هنا..." style="border-radius: 25px;">
                                <button onclick="PublishWrittenComment(${post.id})" class="btn btn-primary me-2 publishComment" style="border-radius: 25px;">
                                    <i class="fa-solid fa-paper-plane"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <!-- Full Image Modal -->
                    <div id="full-image-modal-${post.id}" class="image-modal d-none">
                        <div class="modal-content">
                            <span class="close-modal fw-bolder">&times;</span>
                            <img src="${post.image || 'https://via.placeholder.com/250x250'}" 
                                class="img-fluid border border-2 border-light" 
                                alt="Full Image">
                        </div>
                    </div>`;

                cardContainer.appendChild(newCard);
                checkTheUser(post.author.id, CurrentUserId, newCard , post.id);
                fetchCommentsForPost(post.id);

                // Show full image modal logic
                const showFullImageBtn = newCard.querySelector('.show-full-image-btn');
                const fullImageModal = newCard.querySelector(`#full-image-modal-${post.id}`);
                const closeModalBtn = fullImageModal.querySelector('.close-modal');
                const postImage = newCard.querySelector('.PostImg');
                const fullImage = fullImageModal.querySelector('img');

                // Check if image needs preview logic
                function checkAndHandleImagePreview() {
                    const MAX_WIDTH = 500;
                    const MAX_HEIGHT = 300;
                    const DEFAULT_WIDTH = 600;
                    const DEFAULT_HEIGHT = 400;

                    const imageWidth = postImage.naturalWidth;
                    const imageHeight = postImage.naturalHeight;

                    if (imageWidth > MAX_WIDTH || imageHeight > MAX_HEIGHT) {
                        showFullImageBtn.classList.remove('d-none');
                        postImage.style.maxHeight = `${MAX_HEIGHT}px`;
                        postImage.style.maxWidth = `${MAX_WIDTH}px`;
                    } else {
                        postImage.style.maxHeight = `${DEFAULT_HEIGHT}px`;
                        postImage.style.maxWidth = `${DEFAULT_WIDTH}px`;
                        showFullImageBtn.classList.add('d-none');
                    }
                }

                postImage.addEventListener('load', checkAndHandleImagePreview);

                // Event listeners for full image modal
                showFullImageBtn.addEventListener('click', () => {
                    fullImageModal.classList.remove('d-none');
                    fullImage.src = postImage.src;
                });

                closeModalBtn.addEventListener('click', () => {
                    fullImageModal.classList.add('d-none');
                });

                fullImageModal.addEventListener('click', (e) => {
                    if (e.target === fullImageModal) {
                        fullImageModal.classList.add('d-none');
                    }
                });
            });

            currentPage = page;
        
        })
        .catch(error => {
            console.log(error);
        })
        .finally(() => {
            isLoading = false;
        });
}   

// !============================= Update Post =============================
function checkTheUser(authorId, userId, newCard, postId) {
    if (newCard && authorId == userId) {
        let editBtn = newCard.querySelector('.edit-btn');
        let deleteBtn = newCard.querySelector('.DeleteBtn');
        let postText = newCard.querySelector('.post-text').textContent;
        let postImg = newCard.querySelector('.PostImg').src;

        // Show edit and delete buttons
        editBtn.classList.remove('hidden');
        deleteBtn.classList.remove('hidden');

        // Edit button click event
        editBtn.addEventListener('click', () => {
            console.log('Editing post:', postId);

            let offcanvasText = document.querySelector('.offcanvasText');
            let imagePreview = document.querySelector('#imagePreview');

            offcanvasText.value = postText;
            if (postImg) {
                imagePreview.src = postImg;
                imagePreview.classList.remove('d-none');
            } else {
                imagePreview.classList.add('d-none');
            }

            // Submit button for changes
            let submitChangesBtn = document.querySelector('.submit-changes-btn');
            // Remove previous event listener to avoid duplicates
            submitChangesBtn.replaceWith(submitChangesBtn.cloneNode(true)); 
            submitChangesBtn = document.querySelector('.submit-changes-btn'); 

            submitChangesBtn.addEventListener('click', () => {
                console.log('Submitting changes for post:', postId);

                let newPostText = offcanvasText.value;
                let uploadNewImage = document.querySelector('#formFile').files[0];

                if (uploadNewImage) {
                    let formData = new FormData();
                    formData.append('body', newPostText);
                    formData.append('image', uploadNewImage);  // Attach image file

                    console.log("FormData prepared with new image.");

                    // Ensure authToken is valid
                    let authToken = localStorage.getItem('token');
                    if (!authToken) {
                        alert('You are not authorized. Please log in.');
                        return;
                    }

                    // Send the FormData via Axios
                    axios.put(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${authToken}`
                        }
                    })
                    .then(response => {
                        console.log('Post updated successfully:', response.data);
                        alert('Post updated successfully');
                        window.location.reload(); 
                    })
                    .catch(error => {
                        console.error('Error updating post:', error.response ? error.response.data : error.message);
                        alert('Error updating post. Please try again.');
                    });

                } else {
                    // No new image, we can send JSON data
                    let postData = {
                        body: newPostText
                    };

                    // Log the JSON data for debugging
                    console.log("JSON data:", JSON.stringify(postData));

                    // Ensure authToken is valid
                    let authToken = localStorage.getItem('token');
                    if (!authToken) {
                        alert('You are not authorized. Please log in.');
                        return;
                    }

                    // Send the JSON data via Axios
                    axios.put(`https://tarmeezacademy.com/api/v1/posts/${postId}`, postData, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${authToken}`
                        }
                    })
                    .then(response => {
                        console.log('Post updated successfully:', response.data);
                        alert('Post updated successfully');
                        window.location.reload(); 
                    })
                    .catch(error => {
                        console.error('Error updating post:', error.response ? error.response.data : error.message);
                        alert('Error updating post. Please try again.');
                    });
                }
            });
        });
// !============================= Delete Post ============================

        deleteBtn.addEventListener('click', () => {
            alert('Deleting post:'+postId); 
            axios.delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`, {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                console.log('Post Deleted successfully:', response.data);
                alert('Post Deleted successfully');
                window.location.reload(); 
            })
            .catch(error => {
                console.error('Error deleting post:', error.response ? error.response.data : error.message);
                alert('Error deleting post. Please try again.');
            });
           
        });
    }
}


// !============================= Fetch comments for a specific post ============================
function fetchCommentsForPost(postId) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${postId}?comments`)
        .then(response => {
            let comments = response.data.data.comments;

            document.getElementById(`comments-count-${postId}`).innerHTML = `عدد التعليقات: ${comments.length}`;
            let commentsContainer = document.getElementById(`comments-container-${postId}`);
            commentsContainer.innerHTML = '';

            if (comments.length > 0) {
                comments.forEach(comment => {
                    let commentElement = `
                        <div class="comment border border-1 border-light rounded-2 p-2 d-flex align-items-start mb-3">
                            <img src="${comment.author.profile_image || 'https://via.placeholder.com/48'}" 
                                alt="Profile Image" 
                                class="rounded-circle border border-2" 
                                style="width: 48px; height: 48px; object-fit: cover;">
                            <div class="ms-2 d-flex flex-column me-2 w-100">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex flex-column">
                                        <span class="fw-bold text-light">${comment.author.name}</span>
                                        <span dir="ltr" class="text-light">@${comment.author.username}</span>
                                    </div>
                                </div>
                                <div class="comment-content p-2 bg-white text-dark border rounded shadow-sm mt-2">
                                    <p class="mb-0">${comment.body}</p>
                                </div>
                            </div>
                        </div>`;
                    commentsContainer.innerHTML += commentElement;
                });
            } else {
                commentsContainer.innerHTML = '<p>لا توجد تعليقات بعد.</p>';
            }
        })
        .catch(error => {
            console.log(`Failed to fetch comments for post ${postId}:`, error);
        });
}
// !============================= Handle expanding/collapsing post creation section =============================
document.querySelector('.writePost').addEventListener('click', () => {
    const creatingPost = document.querySelector('.creatingPost');
    if (!creatingPost.classList.contains('expanding')) {
        creatingPost.style.height = creatingPost.scrollHeight + "px";
        creatingPost.style.opacity = 1;
        setTimeout(() => {
            creatingPost.style.height = 'auto';
        }, 600);
        creatingPost.classList.add('expanding');
    } else {
        creatingPost.style.height = creatingPost.scrollHeight + "px";
        creatingPost.style.opacity = 0;
        creatingPost.offsetHeight;
        creatingPost.style.height = 0;
        creatingPost.classList.remove('expanding');
    }
});

// !============================= Check authorization and fetch posts =============================
function Authorization() {
    let token = localStorage.getItem('token');
    if (token) {
        gettingPosts();
    } else {
        window.location.href = "../index.html";
    }
}
// Call authorization function on load
Authorization();

// !============================= Handling Form Elements =============================
document.addEventListener('DOMContentLoaded', () => {
    let userInformation = JSON.parse(localStorage.getItem('Currentuser'));
    const creatorName = document.querySelector('.creatorName');
    const creatorImage = document.querySelector('.creatorImage');
    const creatorUsername = document.querySelector('.creatorUsername');
    if (userInformation && userInformation.username && userInformation.profile_image) {
        if (creatorName) creatorName.textContent = userInformation.name;
        if (creatorImage) {
            creatorImage.src = userInformation.profile_image;
            creatorImage.alt = "User Profile Image";
        }
        if (creatorUsername) creatorUsername.textContent = userInformation.username + "@";
    } else {
        console.log("User information is missing.");
    }
});

// !============================= Retrieve data from local storage =============================
let currentUserImage = document.querySelector(".currentUserImage");
let currentUserName = document.querySelector(".currentUserName");
let token = localStorage.getItem('token');
let userInfo = JSON.parse(localStorage.getItem('Currentuser'));
if (userInfo && userInfo.username && userInfo.profile_image) {
    currentUserName.textContent = userInfo.name;
    currentUserImage.src = userInfo.profile_image;
    currentUserImage.alt = "User Profile Image";
} else {
    console.log("User information is missing.");
}

// !============================= Create Post =============================
document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.querySelector('.submit-btn');
    const postInfoText = document.querySelector('.postInfoText textarea');
    const fileInput = document.querySelector('#formFile');

    submitButton?.addEventListener('click', (event) => {
        event.preventDefault();

        let postBody = postInfoText?.value;
        let postImage = fileInput?.files[0];

        if (!postBody || !postImage) {
            alert('Please fill in all required fields.');
            return;
        }

        let formData = new FormData();
        formData.append('body', postBody);
        formData.append('image', postImage);

        let authToken = localStorage.getItem('token');
        
        if (authToken) {
            axios.post('https://tarmeezacademy.com/api/v1/posts', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${authToken}`
                }
            })
            .then(response => {
                alert('Post created successfully');
                window.location.href = "./main.html";
            })
            .catch(error => {
                console.error('Error creating post:', error);
                alert('Error creating post. Please try again.');
            });
        } else {
            alert('You are not authorized. Please log in.');
        }
    });
});

// !============================= Logout functionality =============================
let logoutbtn = document.querySelector(".logout-btn");
logoutbtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Currentuser');
    window.location.href = "../index.html";
});

// !============================= Pagination =============================
window.addEventListener("scroll", handlingInfiniteScroll);
function handlingInfiniteScroll() {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
        gettingPosts(currentPage + 1);
    }
}

// !============================= Create Comment =============================
function PublishWrittenComment(post_id){
    let CommentBody = document.querySelector(`#collapseComments${post_id} .commentText`).value;
    let authToken = localStorage.getItem('token');

    if (CommentBody && authToken) {
        axios.post('https://tarmeezacademy.com/api/v1/posts/' + post_id + '/comments', {
            body: CommentBody
        }, {
            headers: {
                'Authorization': 'Bearer ' + authToken
            }
        })
        .then(() => {
            alert('Comment published successfully');
            fetchCommentsForPost(post_id);
            document.querySelector(`#collapseComments${post_id} .commentText`).value = "";
        })
        .catch(error => {
            console.error('Error adding comment:', error);
            alert('Failed to add comment. Please try again.');
        });
    } else {
        alert('Comment cannot be empty or user not authenticated.');
    }
}
