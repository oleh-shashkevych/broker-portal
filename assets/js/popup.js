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

    // --- Елементи для statusModal ---
    const statusModal = document.getElementById('statusModal');
    let callTypeSelect, saveStatusButton;

    if (statusModal) {
        callTypeSelect = statusModal.querySelector('#callType');
        saveStatusButton = statusModal.querySelector('.modal-btn__submit');
    }

    // --- Елементи для addContactModal ---
    const addContactModal = document.getElementById('addContactModal');
    const addContactForm = document.getElementById('addContactForm');
    let saveContactButton, cancelContactButton;

    if (addContactModal) {
        saveContactButton = addContactModal.querySelector('#saveContactBtn');
        cancelContactButton = addContactModal.querySelector('#cancelContactBtn');
    }

    function openModal(modalElement) {
        if (!modalElement) {
            return;
        }
        if (popupOverlay) {
            popupOverlay.classList.add('active');
        }
        modalElement.classList.add('active');
        document.body.classList.add('modal-open');

        // Сброс валідації при відкритті statusModal
        if (modalElement.id === 'statusModal' && callTypeSelect) {
            callTypeSelect.classList.remove('input-error');
            removeValidationError(callTypeSelect);
        }

        // Сброс форми і валідації при відкритті addContactModal
        if (modalElement.id === 'addContactModal' && addContactForm) {
            resetAddContactForm();
        }
    }

    function closeModal(modalElement) {
        if (!modalElement) {
            return;
        }
        if (popupOverlay) {
            popupOverlay.classList.remove('active');
        }
        modalElement.classList.remove('active');
        if (document.querySelectorAll('.modal.active').length === 0) {
            document.body.classList.remove('modal-open');
        }

        // Сброс форми при закритті addContactModal
        if (modalElement.id === 'addContactModal' && addContactForm) {
            resetAddContactForm();
        }
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.dataset.modalTrigger;
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                openModal(targetModal);
            } else {
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
            // Блокуємо закриття addContactModal через Escape
            if (activeModal && activeModal.id !== 'addContactModal') {
                closeModal(activeModal);
            }
        }
    });

    // --- Валідація та збереження для statusModal ---
    if (statusModal && callTypeSelect && saveStatusButton) {
        saveStatusButton.addEventListener('click', function(event) {
            event.preventDefault();

            callTypeSelect.classList.remove('input-error');
            removeValidationError(callTypeSelect);

            if (callTypeSelect.value === "") {
                callTypeSelect.classList.add('input-error');
                displayValidationError(callTypeSelect, 'Please select an outreach type.');
                callTypeSelect.focus();
            } else {
                
                // Скидаємо селект після успішного збереження
                callTypeSelect.value = "";
                callTypeSelect.classList.remove('input-error');
                removeValidationError(callTypeSelect);
                
                closeModal(statusModal);
            }
        });

        callTypeSelect.addEventListener('change', function() {
            if (this.value !== "") {
                this.classList.remove('input-error');
                removeValidationError(this);
            }
        });

        const resetButton = statusModal.querySelector('.modal-btn__reset');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                if (callTypeSelect) {
                    callTypeSelect.value = "";
                    callTypeSelect.classList.remove('input-error');
                    removeValidationError(callTypeSelect);
                }
                closeModal(statusModal);
            });
        }
    }

    // --- Валідація та збереження для addContactModal ---
    if (addContactModal && addContactForm && saveContactButton && cancelContactButton) {
        
        // Обробка кнопки Save
        saveContactButton.addEventListener('click', function(event) {
            event.preventDefault();
            
            if (validateAddContactForm()) {
                // Всі поля валідні, можна зберігати
                const formData = new FormData(addContactForm);
                const contactData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    role: formData.get('role'),
                    phone: formData.get('phone'),
                    email: formData.get('email')
                };
                
                // Тут може бути AJAX запит для збереження
                
                closeModal(addContactModal);
            }
        });

        // Обробка кнопки Cancel
        cancelContactButton.addEventListener('click', function(event) {
            event.preventDefault();
            closeModal(addContactModal);
        });

        // Видалення помилок валідації при введенні в поля
        const formFields = addContactForm.querySelectorAll('input, select');
        formFields.forEach(field => {
            field.addEventListener('input', function() {
                if (this.classList.contains('input-error')) {
                    this.classList.remove('input-error');
                    removeValidationError(this);
                }
            });

            field.addEventListener('change', function() {
                if (this.classList.contains('input-error')) {
                    this.classList.remove('input-error');
                    removeValidationError(this);
                }
            });
        });

        // Додаємо маску телефону
        const phoneInput = addContactForm.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                applyPhoneMask(e.target);
            });
        }

        // Блокуємо цифри в полях імені та прізвища
        const nameFields = [
            addContactForm.querySelector('#firstName'),
            addContactForm.querySelector('#lastName')
        ];
        
        nameFields.forEach(field => {
            if (field) {
                field.addEventListener('input', function(e) {
                    // Видаляємо цифри з поля
                    const value = e.target.value;
                    const cleanValue = value.replace(/[0-9]/g, '');
                    if (value !== cleanValue) {
                        e.target.value = cleanValue;
                    }
                });
            }
        });
    }

    // --- Функції для addContactModal ---
    function validateAddContactForm() {
        if (!addContactForm) return false;

        let isValid = true;
        const fields = {
            firstName: addContactForm.querySelector('#firstName'),
            lastName: addContactForm.querySelector('#lastName'),
            role: addContactForm.querySelector('#role'),
            phone: addContactForm.querySelector('#phone'),
            email: addContactForm.querySelector('#email')
        };

        // Валідація First Name
        if (!fields.firstName.value.trim()) {
            showFieldError(fields.firstName, 'First name is required.');
            isValid = false;
        } else if (hasNumbers(fields.firstName.value)) {
            showFieldError(fields.firstName, 'First name cannot contain numbers.');
            isValid = false;
        }

        // Валідація Last Name
        if (!fields.lastName.value.trim()) {
            showFieldError(fields.lastName, 'Last name is required.');
            isValid = false;
        } else if (hasNumbers(fields.lastName.value)) {
            showFieldError(fields.lastName, 'Last name cannot contain numbers.');
            isValid = false;
        }

        // Валідація Role
        if (!fields.role.value) {
            showFieldError(fields.role, 'Please select a role.');
            isValid = false;
        }

        // Валідація Phone
        const phoneValue = fields.phone.value.trim();
        if (!phoneValue) {
            showFieldError(fields.phone, 'Phone number is required.');
            isValid = false;
        } else if (!isValidPhone(phoneValue)) {
            showFieldError(fields.phone, 'Please enter a valid phone number.');
            isValid = false;
        }

        // Валідація Email
        const emailValue = fields.email.value.trim();
        if (!emailValue) {
            showFieldError(fields.email, 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            showFieldError(fields.email, 'Please enter a valid email address.');
            isValid = false;
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('input-error');
        displayValidationError(field, message);
    }

    function resetAddContactForm() {
        if (!addContactForm) return;

        // Скидаємо форму
        addContactForm.reset();

        // Видаляємо всі помилки валідації
        const errorFields = addContactForm.querySelectorAll('.input-error');
        errorFields.forEach(field => {
            field.classList.remove('input-error');
            removeValidationError(field);
        });
    }

    // --- Функції валідації ---
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        // Видаляємо всі не-цифрові символи для перевірки
        const cleanPhone = phone.replace(/\D/g, '');
        // Перевіряємо, що залишилось від 10 до 15 цифр
        return cleanPhone.length >= 10 && cleanPhone.length <= 15;
    }

    function hasNumbers(text) {
        return /\d/.test(text);
    }

    function applyPhoneMask(input) {
        // Зберігаємо стару позицію курсору та стару довжину
        const oldPosition = input.selectionStart;
        const oldValue = input.value;
        const oldLength = oldValue.length;
        
        // Видаляємо всі не-цифрові символи
        let value = input.value.replace(/\D/g, '');
        
        // Обмежуємо довжину до 10 цифр
        value = value.substring(0, 10);
        
        // Застосовуємо маску (XXX) XXX-XXXX
        let formattedValue = '';
        if (value.length > 0) {
            if (value.length <= 3) {
                formattedValue = `(${value}`;
            } else if (value.length <= 6) {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
            }
        }
        
        // Оновлюємо значення поля
        input.value = formattedValue;
        
        // Обчислюємо нову позицію курсору
        const newLength = formattedValue.length;
        let newPosition = oldPosition;
        
        // Якщо довжина збільшилась (додались символи маски)
        if (newLength > oldLength) {
            // Визначаємо, скільки символів було додано
            const addedChars = newLength - oldLength;
            
            // Якщо користувач вводив цифру (а не видаляв)
            if (value.length * 2 >= oldLength) { // приблизна перевірка на введення
                newPosition = oldPosition + addedChars;
            }
        }
        // Якщо довжина зменшилась або залишилась такою ж
        else if (newLength <= oldLength) {
            // При видаленні залишаємо курсор на тому ж місці або трохи зміщуємо
            newPosition = Math.min(oldPosition, newLength);
        }
        
        // Переконуємось, що позиція не виходить за межі
        newPosition = Math.max(0, Math.min(newPosition, formattedValue.length));
        
        // Встановлюємо курсор
        setTimeout(() => {
            input.setSelectionRange(newPosition, newPosition);
        }, 0);
    }

    // --- Допоміжні функції для відображення помилок валідації ---
    function displayValidationError(field, message) {
        removeValidationError(field);
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