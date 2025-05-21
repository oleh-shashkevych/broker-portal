// Notification Dropdown
const notificationButton = document.getElementById('notification-button');
const notificationDropdown = document.getElementById('notification-list');

function toggleDropdown() {
    notificationDropdown.classList.toggle('active');
}

function closeDropdown() {
    notificationDropdown.classList.remove('active');
}

notificationButton?.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleDropdown();
    // Блок с удалением классов quote/chat/external/internal — удалён
});

document.addEventListener('click', function (e) {
    if (!notificationDropdown.contains(e.target) && !notificationButton.contains(e.target)) {
        closeDropdown();
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeDropdown();

        document.querySelectorAll('.table-dropdown.active').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});