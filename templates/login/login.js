$(document).ready(function () {

    // --- 1. Налаштування елементів ---
    const loaderElement = $('#page-loader');
    const loginWrapper = $('.login-wrapper');
    const pageLogoContainer = document.getElementById('lottie-logo');
    const loaderLogoContainer = document.getElementById('loader-lottie-logo');
    
    let pageLogoAnimation; // Змінна для анімації на сторінці
    let loaderHidingStarted = false; // Прапор, щоб логіка зникнення спрацювала лише раз

    // --- 2. Ініціалізація Lottie анімації НА СТОРІНЦІ ---
    try {
        pageLogoAnimation = lottie.loadAnimation({
            container: pageLogoContainer,
            renderer: 'svg',
            loop: true,
            autoplay: false, // Не запускаємо її одразу
            path: 'img/logo.json' 
        });
    } catch (error) {
        console.error("Page Lottie animation failed to load:", error);
        $(pageLogoContainer).text('Fundshop'); 
    }

    // --- 3. Функція для плавного зникнення лоадера і показу сторінки ---
    function hideLoaderAndShowPage() {
        // Перевіряємо, чи не почали ми вже ховати лоадер
        if (loaderHidingStarted) {
            return;
        }
        loaderHidingStarted = true;

        // Плавно ховаємо лоадер
        loaderElement.removeClass('is-visible').addClass('is-hiding');
        
        // Плавно показуємо контент сторінки
        loginWrapper.addClass('is-visible');

        // Тепер запускаємо анімацію лого на сторінці (яка буде в циклі)
        if (pageLogoAnimation) {
            pageLogoAnimation.play();
        }

        // Видаляємо лоадер з DOM через 500мс (час = transition з CSS)
        setTimeout(function() {
            // loaderElement.remove();
        }, 500); 
    }

    // --- 4. Ініціалізація Lottie анімації ЛОАДЕРА ---
    try {
        const loaderAnimation = lottie.loadAnimation({
            container: loaderLogoContainer,
            renderer: 'svg',
            loop: false, 
            autoplay: true, 
            path: 'img/logo.json' 
        });

        loaderAnimation.addEventListener('DOMLoaded', function() {
        });

        // Плавно показуємо лоадер
        loaderElement.addClass('is-visible');

        // --- 5. Слухач кадрів анімації лоадера ---
        loaderAnimation.addEventListener('enterFrame', function(e) { // 'e' тут можна навіть прибрати, але нехай лишається
            
            // !!! 1. ВИПРАВЛЕННЯ ТУТ:
            // Беремо кадр з 'loaderAnimation', а не з 'e'

            
            const CUT_OFF_FRAME = 120; 
            
            // !!! 2. ВИПРАВЛЕННЯ ТУТ:
            if (loaderAnimation.currentFrame >= CUT_OFF_FRAME) {
                

                loaderAnimation.pause();
                hideLoaderAndShowPage();
            }
        });

        // Ми залишаємо 'complete' як резервний варіант
        loaderAnimation.addEventListener('complete', function() {
            hideLoaderAndShowPage();
        });

    } catch (error) {
        console.error("Loader Lottie animation failed to load:", error);
        // Якщо анімація лоадера впала, просто показуємо сторінку
        loaderElement.remove();
        loginWrapper.addClass('is-visible');
        if (pageLogoAnimation) {
            pageLogoAnimation.play(); // І запускаємо анімацію на сторінці
        }
    }


    // --- 6. Валідація форми (Цей код залишається без змін) ---
    const loginForm = $('#login-form');
    // ... (решта коду валідації без змін) ...
    const emailInput = $('#email');
    const passwordInput = $('#password');
    const emailError = $('#email-error');
    const passwordError = $('#password-error');

    loginForm.on('submit', function (e) {
        e.preventDefault(); 
        
        let isValid = true;

        emailInput.removeClass('is-invalid');
        passwordInput.removeClass('is-invalid');
        emailError.text('');
        passwordError.text('');

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

        const passwordVal = passwordInput.val().trim();
        if (passwordVal === '') {
            isValid = false;
            passwordInput.addClass('is-invalid');
            passwordError.text('Password is required.');
        }

        if (isValid) {
            alert('Form is valid and would be submitted!');
        } 
    });

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

});