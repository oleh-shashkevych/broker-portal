// Get the elements
const addFilesBtn = document.getElementById('addFilesBtn');
const popupOverlay = document.getElementById('popupOverlay');
const uploadPopup = document.getElementById('uploadPopup');
const closePopupBtn = document.getElementById('closePopupBtn');

// Function to open the popup
function openPopup() {
    popupOverlay.classList.add('active');
    uploadPopup.classList.add('active');
}

// Function to close the popup
function closePopup() {
    popupOverlay.classList.remove('active');
    uploadPopup.classList.remove('active');
}

// Event listeners
if (addFilesBtn) {
    addFilesBtn.addEventListener('click', openPopup);
}

if (closePopupBtn) {
    closePopupBtn.addEventListener('click', closePopup);
}

// Optional: Close popup if overlay is clicked (and not the popup content itself)
// if (popupOverlay) {
//     popupOverlay.addEventListener('click', function(event) {
//         // Check if the click is directly on the overlay and not on a child (the popup)
//         if (event.target === popupOverlay) {
//             closePopup();
//         }
//     });
// }