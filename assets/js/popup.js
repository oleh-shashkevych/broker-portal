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

document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('popupOverlay');
    const modalTriggers = document.querySelectorAll('[data-modal-trigger]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal__close-btn');

    // --- Элементы для statusModal ---
    const statusModal = document.getElementById('statusModal');
    let callTypeSelect, saveStatusButton; // Объявляем переменные здесь

    if (statusModal) {
        callTypeSelect = statusModal.querySelector('#callType');
        saveStatusButton = statusModal.querySelector('.modal-btn__submit');
    }
    // ---------------------------------

    function openModal(modalElement) {
        if (!modalElement) {
            console.warn('Modal element not found to open.');
            return;
        }
        if (popupOverlay) {
            popupOverlay.classList.add('active');
        }
        modalElement.classList.add('active');
        document.body.classList.add('modal-open');

        // Сброс валидации при открытии statusModal
        if (modalElement.id === 'statusModal' && callTypeSelect) {
            callTypeSelect.classList.remove('input-error'); // Убираем класс ошибки, если есть
            removeValidationError(callTypeSelect); // Убираем сообщение об ошибке
        }
    }

    function closeModal(modalElement) {
        if (!modalElement) {
            console.warn('Modal element not found to close.');
            return;
        }
        if (popupOverlay) {
            popupOverlay.classList.remove('active');
        }
        modalElement.classList.remove('active');
        if (document.querySelectorAll('.modal.active').length === 0) {
            document.body.classList.remove('modal-open');
        }
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.dataset.modalTrigger;
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                openModal(targetModal);
            } else {
                console.warn(`Modal with ID "${modalId}" not found.`);
            }
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalToClose = this.closest('.modal');
            if (modalToClose) {
                closeModal(modalToClose);
            }
        });
    });

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // --- Валидация и сохранение для statusModal ---
    if (statusModal && callTypeSelect && saveStatusButton) {
        saveStatusButton.addEventListener('click', function(event) {
            event.preventDefault(); // Предотвращаем стандартное поведение кнопки submit, если это форма

            // Убираем предыдущие ошибки
            callTypeSelect.classList.remove('input-error');
            removeValidationError(callTypeSelect);

            if (callTypeSelect.value === "") {
                // Поле не выбрано
                console.warn('Outreach type is required.');
                callTypeSelect.classList.add('input-error'); // Добавляем класс для подсветки ошибки
                displayValidationError(callTypeSelect, 'Please select an outreach type.');
                // Можно также сфокусироваться на поле
                callTypeSelect.focus();
            } else {
                // Поле выбрано, выполняем "сохранение"
                console.log('Saving status with type:', callTypeSelect.value);
                // Здесь может быть ваш AJAX запрос или другая логика сохранения

                // Закрываем модальное окно после "успешного сохранения"
                closeModal(statusModal);
            }
        });

        // Опционально: сброс валидации при изменении значения
        callTypeSelect.addEventListener('change', function() {
            if (this.value !== "") {
                this.classList.remove('input-error');
                removeValidationError(this);
            }
        });

        // Опционально: сброс формы и валидации при клике на Reset
        const resetButton = statusModal.querySelector('.modal-btn__reset');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                // Если select находится внутри формы, можно использовать form.reset()
                // В данном случае просто сбросим значение select и уберем ошибки
                if (callTypeSelect) {
                    callTypeSelect.value = ""; // Сбрасываем на placeholder
                    callTypeSelect.classList.remove('input-error');
                    removeValidationError(callTypeSelect);
                }
                // Если есть другие поля в форме, их тоже нужно сбросить
            });
        }

    } else {
        if (!statusModal) console.warn('Status modal not found.');
        if (statusModal && !callTypeSelect) console.warn('Call type select not found in status modal.');
        if (statusModal && !saveStatusButton) console.warn('Save button not found in status modal.');
    }

    // --- Вспомогательные функции для отображения ошибок валидации ---
    function displayValidationError(field, message) {
        removeValidationError(field); // Удаляем старое сообщение, если есть
        const errorElement = document.createElement('div');
        errorElement.className = 'validation-error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.9em';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    function removeValidationError(field) {
        const nextSibling = field.nextSibling;
        if (nextSibling && nextSibling.classList && nextSibling.classList.contains('validation-error-message')) {
            nextSibling.remove();
        }
    }
});