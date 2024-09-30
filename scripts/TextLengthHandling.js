const postText = document.querySelector('.post-text ');
const MAX_TEXT_LENGTH = 250;
const fullText = postText.textContent;
let truncatedText = fullText;

if (fullText.length > MAX_TEXT_LENGTH) {
    truncatedText = fullText.substring(0, MAX_TEXT_LENGTH) + '... ';

    postText.textContent = truncatedText;
    const showMoreSpan = document.createElement('span');
    showMoreSpan.style.textDecoration = 'none';
    showMoreSpan.classList.add('text-warning');
    showMoreSpan.textContent = 'أعرض المزيد';
    showMoreSpan.style.cursor = 'pointer'; 
    postText.appendChild(showMoreSpan);

    showMoreSpan.addEventListener('click', () => {
        if (postText.textContent.includes(truncatedText)) {
            postText.textContent = fullText;  
            showMoreSpan.textContent = 'أعرض اقل';  
            postText.appendChild(showMoreSpan); 
        } else {
            postText.textContent = truncatedText;  
            showMoreSpan.textContent = 'أعرض المزيد';  
            postText.appendChild(showMoreSpan); 
        }
    });
}
// ==========================================================================

