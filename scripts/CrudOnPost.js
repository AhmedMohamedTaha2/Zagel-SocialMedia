//! =============================================== Getting Elements ===============================================
const creatingPost = document.querySelector('.creatingPost');
const creatorInfo = creatingPost?.querySelector('.creatorInfo');
const creatorImage = creatorInfo?.querySelector('img');
const creatorName = creatorInfo?.querySelector('.creatorName');
const creatorUsername = creatorInfo?.querySelector('p:nth-child(2)');
const postInfoText = creatingPost?.querySelector('.postInfoText textarea');
const extrasSection = creatingPost?.querySelector('.extras');
const fileInput = extrasSection?.querySelector('#formFile');
const selectOptions = extrasSection?.querySelector('#selectOptions');
const submitButton = creatingPost?.querySelector('.d-flex button');
const writePostButton = document.querySelector('.writePost');

console.log({
  creatingPost,
  creatorInfo,
  creatorImage,
  creatorName,
  creatorUsername,
  postInfoText,
  fileInput,
  selectOptions,
  submitButton,
  writePostButton
});

// Retrieve the authentication token from local storage
const authToken = localStorage.getItem('token');

//! =============================================== Handling Form Elements ===============================================
// Putting user info in creating form 
let userInformation = JSON.parse(localStorage.getItem('Currentuser'));
if (userInformation && userInformation.username && userInformation.profile_image) {
    console.log(userInformation);
    if (creatorName) creatorName.textContent = userInformation.name;
    if (creatorImage) {
        creatorImage.src = userInformation.profile_image;
        creatorImage.alt = "User Profile Image";
    }
    if (creatorUsername) creatorUsername.textContent = userInformation.username;
} else {
    console.log("User information is missing.");
}

// Getting the tags from the API 
let availableTags = "";
axios.get('https://tarmeezacademy.com/api/v1/tags')
  .then(function (response) {
    availableTags = response.data.data;
    // console.log(availableTags);
    if (selectOptions) {
        selectOptions.innerHTML = `
        <option disabled default selected value="">أختر الهاشتاج المناسب</option>
        ${availableTags.map(tag => `<option class="SelectedTag" value="${tag.name}">${tag.arabic_name}</option>`).join('')}
        `;
    }
  })
  .catch(function (error) {
    console.log(error);
  });

//! =============================================== Create Post ===============================================
// Handle the submit button click event
submitButton?.addEventListener('click', () => {
    let postBody = postInfoText?.value;
    let postImage = fileInput?.files[0];
    
    // Collect all selected tags
    let selectedTags = Array.from(selectOptions.selectedOptions).map(option => option.value);

    // Validate required fields
    if (!postBody || !postImage || selectedTags.length === 0) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create a FormData object
    let formData = new FormData();
    formData.append('body', postBody);
    formData.append('image', postImage);

    // Append each selected tag to the FormData object
    selectedTags.forEach(tag => {
        formData.append('tags[]', tag); // Assuming the API expects 'tags[]' array format for multiple tags
    });

    if (authToken) {
        // Sending POST request to the API
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
        console.error('Authorization token is missing.');
        alert('You are not authorized. Please log in.');
    }
});
