const burger = document.getElementById('burger');
const closeBurger = document.getElementById('close_burger');
const sideBar = document.querySelector('.left_cp_bar');
const overlay = document.querySelector('.overlay');

// Проверяем наличие всех необходимых элементов
if (burger && closeBurger && sideBar && overlay) {
    // При клике на бургер показываем меню
    burger.addEventListener('click', () => {
        sideBar.style.transform = 'translateX(0)';
        overlay.style.display = 'flex';
    });

    // При клике на крестик скрываем меню
    closeBurger.addEventListener('click', () => {
        sideBar.style.transform = 'translateX(-120%)';
        overlay.style.display = 'none';
    });
} else {
}

function toggleContactsPanel(width) {
    if (typeof width !== 'number') {
        return;
    }

    const panel = document.querySelector('.contacts_panel');
    const toggleButton = document.getElementById('open_contacts');

    if (!panel || !toggleButton) {
        return;
    }

    try {
        if (width <= 1920) {
            panel.classList.remove('active');
            toggleButton.classList.remove('active');
        } else {
            panel.classList.add('active');
            toggleButton.classList.add('active');
        }
    } catch (error) {
        console.error('Error toggling contacts panel:', error);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    toggleContactsPanel(window.innerWidth);

    // Слушатель изменения размера окна
    window.addEventListener('resize', () => {
        toggleContactsPanel(window.innerWidth);
    });
});