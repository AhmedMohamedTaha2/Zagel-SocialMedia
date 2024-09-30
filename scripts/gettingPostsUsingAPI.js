// Get the card container element
const cardContainer = document.querySelector('.cardContainer');

// !=========================================================== Fetch posts from API and display them =========================================================== 
function gettingPosts() {
    axios.get('https://tarmeezacademy.com/api/v1/posts')
        .then(function (response) {
            // Clear the existing content of the card container
            cardContainer.innerHTML = "";
            let posts = response.data.data;

            // Loop through each post and create a card
            posts.forEach(post => {
                let newCard = document.createElement('div');
                newCard.className = 'card p-3 my-3 w-100 rounded-lg';

                newCard.innerHTML = `
                <div class="d-flex align-items-center">
                    <img src="${post.author.profile_image || 'https://via.placeholder.com/48'}" 
                         alt="Profile Image" 
                         class="rounded-circle border border-2" 
                         style="width: 48px; height: 48px; object-fit: cover;">
                    <div class="ms-2 d-flex flex-column me-2">
                        <span class="fw-bold text-light">${post.author.name}</span>
                        <span dir="ltr" class="text-light">@${post.author.username}</span>
                    </div>
                </div>

                <!-- Tweet Content -->
                <div class="tweet-content my-2 px-1">
                    <p class="mb-1 post-text">${post.body}</p>
                </div>

                <!-- Post Image with Preview -->
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
                        <a href="#" class="mx-2"><i class="fa-regular fa-bookmark text-info"></i> حفظ</a>
                    </div>
                    <div>
                        ${post.tags.map(tag => `<a href="#" class="badge bg-secondary">#${tag.name}</a>`).join(' ')}
                    </div>
                </div>

                <!-- Comments Section -->
                <div class="collapse my-2" id="collapseComments${post.id}">
                    <div class="post-comments text-light px-3 py-3 mt-2 rounded-2 border border-1 border-light">
                        <p>عدد التعليقات: ${post.comments_count}</p>
                        ${post.comments && post.comments.length > 0 ? post.comments.map(comment => `
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
                                        <small class="text-light"><i class="fa-solid fa-calendar-days"></i> ${comment.created_at}</small>
                                    </div>
                                    <div class="comment-content p-2 bg-white text-dark border rounded shadow-sm mt-2">
                                        <p class="mb-0">${comment.body}</p>
                                    </div>
                                </div>
                            </div>
                        `).join('') : '<p>لا توجد تعليقات بعد.</p>'}

                        <!-- Write Comment Section -->
                        <div class="write-comment d-flex align-items-center p-2 rounded mt-3 shadow-sm">
                            <input class="form-control me-2" type="text" placeholder="أضف تعليقك هنا..." style="border-radius: 25px;">
                            <button class="btn btn-primary me-2" style="border-radius: 25px;">
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
                </div>
            `;

                cardContainer.appendChild(newCard);

                // Elements for the image modal logic
                const showFullImageBtn = newCard.querySelector(`.show-full-image-btn`);
                const fullImageModal = newCard.querySelector(`#full-image-modal-${post.id}`);
                const closeModalBtn = fullImageModal.querySelector('.close-modal');
                const postImage = newCard.querySelector('.PostImg');
                const fullImage = fullImageModal.querySelector('img');

                // Image preview logic
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
        })
        .catch(function (error) {
            console.log(error);
        });
}
// !========================================================= Handle expanding/collapsing post creation section =========================================================
document.querySelector('.writePost').addEventListener('click', function () {
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
        creatingPost.offsetHeight; // Trigger a reflow
        creatingPost.style.height = 0;
        creatingPost.classList.remove('expanding');
    }
});
// !=========================================================== Check authorization and fetch posts ===========================================================
function Authorization() {
    let token = localStorage.getItem('token');
    if (token) {
        gettingPosts();
    } else {
        window.location.href = "../index.html";
    }
}
// ! Call authorization function on load
Authorization();
// ! ========================================================= Logout functionality =========================================================
let logoutbtn = document.querySelector(".logout-btn");
logoutbtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('Currentuser');
    window.location.href = "../index.html";
});
// !========================================================= Retrieve data from local storage =========================================================
let currentUserImage = document.querySelector(".currentUserImage");
let currentUserName = document.querySelector(".currentUserName");
let token = localStorage.getItem('token');
let userInfo = JSON.parse(localStorage.getItem('Currentuser'));

if (userInfo && userInfo.username && userInfo.profile_image) {
    // console.log(userInfo);
    currentUserName.textContent = userInfo.name;
    currentUserImage.src = userInfo.profile_image;
    currentUserImage.alt = "User Profile Image";
} else {
    console.log("User information is missing.");
}
// !========================================================= Writting new Post =========================================================
