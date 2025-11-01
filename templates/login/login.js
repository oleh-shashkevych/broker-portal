$(document).ready(function () {
    
    // 1. Ініціалізація Lottie анімації
    try {
        lottie.loadAnimation({
            container: document.getElementById('lottie-logo'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'img/logo.json' // Переконайся, що шлях правильний
        });
    } catch (error) {
        console.error("Lottie animation failed to load:", error);
        // Можна показати статичний логотип, якщо lottie не завантажився
        $('#lottie-logo').text('Fundshop'); 
    }


    // 2. Валідація форми
    const loginForm = $('#login-form');
    const emailInput = $('#email');
    const passwordInput = $('#password');
    const emailError = $('#email-error');
    const passwordError = $('#password-error');

    loginForm.on('submit', function (e) {
        e.preventDefault(); // Забороняємо стандартну відправку форми
        
        let isValid = true;

        // Скидаємо попередні помилки
        emailInput.removeClass('is-invalid');
        passwordInput.removeClass('is-invalid');
        emailError.text('');
        passwordError.text('');

        // --- Перевірка Email ---
        const emailVal = emailInput.val().trim();
        if (emailVal === '') {
            isValid = false;
            emailInput.addClass('is-invalid');
            emailError.text('Email is required.');
        } else if (!isValidEmail(emailVal)) {
            isValid = false;
            emailInput.addClass('is-invalid');
            emailError.text('Please enter a valid email address.');
        }

        // --- Перевірка Password ---
        const passwordVal = passwordInput.val().trim();
        if (passwordVal === '') {
            isValid = false;
            passwordInput.addClass('is-invalid');
            passwordError.text('Password is required.');
        }

        // --- Умовна відправка ---
        if (isValid) {
            // Якщо все добре, ми "відправляємо" дані
            // (в реальному проекті тут був би AJAX або submit())
            alert('Form is valid and would be submitted!');
            
            // Наприклад, можна очистити форму:
            // loginForm[0].reset();
        } else {
            // Якщо є помилки, нічого не робимо,
            // користувач побачить повідомлення про помилки
        }
    });

    // Допоміжна функція для валідації email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

});