$(document).ready(function () {
    // Ініціалізація Select2 для поля "Program Type"
    // Важливо: залишаємо dropdownParent, оскільки це загалом добра практика для позиціонування випадаючого списку.
    // Якщо батьківський елемент (div.multiple-select) знаходиться всередині .right_cp_bar,
    // це допомагає select2 краще розраховувати позицію.
    $('#currently-offer-customers').select2({
        selectAll: false,
        width: "100%",
        placeholder: "Choose...",
        closeOnSelect: false,
        minimumResultsForSearch: -1,
        dropdownParent: $('#currently-offer-customers').parent() // Встановлюємо батьківський елемент
    });

    // Ініціалізація Select2 для полів "File Type"
    // Використовуємо .each() для коректного встановлення dropdownParent для кожного екземпляра
    $('.basic-single').each(function() {
        $(this).select2({
            selectAll: false,
            width: "100%",
            placeholder: "Please Select...",
            minimumResultsForSearch: -1,
            templateResult: function (data, container) {
                if (data.element) {
                    $(container).addClass("single-select-option");
                }
                return data.text;
            },
            dropdownParent: $(this).parent() // Встановлюємо батьківський елемент для кожного
        });
    });

    const $scrollLockingSelects = $('.basic-multiple, .basic-single');
    const $scrollableContainer = $('.right_cp_bar'); // Ваш блок з прокруткою
    let originalContainerOverflowY = ''; // Зберігаємо оригінальний стиль overflow-y

    $scrollLockingSelects.on('select2:open', function (e) {
        // Перевіряємо, чи прокрутка вже заблокована (наприклад, іншим select2)
        // і чи існує контейнер для прокрутки
        if ($scrollableContainer.length && $scrollableContainer.css('overflow-y') !== 'hidden') {
            originalContainerOverflowY = $scrollableContainer.css('overflow-y');
            $scrollableContainer.css('overflow-y', 'hidden');
        }
    });

    $scrollLockingSelects.on('select2:close', function (e) {
        // Перевіряємо, чи є ще відкриті select2, що блокують прокрутку
        let stillOpenCount = 0;
        $scrollLockingSelects.each(function() {
            // Перевіряємо, чи існує екземпляр select2 і чи він відкритий
            if ($(this).data('select2') && $(this).data('select2').isOpen && $(this).data('select2').isOpen()) {
                stillOpenCount++;
            }
        });

        // Якщо це був останній відкритий select2, розблоковуємо прокрутку
        if (stillOpenCount === 0 && $scrollableContainer.length) {
            $scrollableContainer.css('overflow-y', originalContainerOverflowY || ''); // Відновлюємо оригінальний стиль або стандартний
            originalContainerOverflowY = ''; // Скидаємо збережене значення
        }
    });

    $('.phone-number').keydown(function (e) {
        const key = e.which || e.charCode || e.keyCode || 0;
        $phone = $(this);

        // Don't let them remove the starting '('
        if ($phone.val().length === 1 && (key === 8 || key === 46)) {
            $phone.val('(');
            return false;
        }
        // Reset if they highlight and type over first char.
        else if ($phone.val().charAt(0) !== '(') {
            $phone.val('(' + String.fromCharCode(e.keyCode) + '');
        }

        // Auto-format- do not expose the mask as the user begins to type
        if (key !== 8 && key !== 9) {
            if ($phone.val().length === 4) {
                $phone.val($phone.val() + ')');
            }
            if ($phone.val().length === 5) {
                $phone.val($phone.val() + ' ');
            }
            if ($phone.val().length === 9) {
                $phone.val($phone.val() + '-');
            }
        }

        // Allow numeric (and tab, backspace, delete) keys only
        return (key == 8 ||
            key == 9 ||
            key == 46 ||
            (key >= 48 && key <= 57) ||
            (key >= 96 && key <= 105));
    })

        .bind('focus click', function () {
            $phone = $(this);

            if ($phone.val().length === 0) {
                $phone.val('(');
            }
            else {
                $phone.val('').val($phone.val()); // Ensure cursor remains at the end
            }
        })

        .blur(function () {
            $phone = $(this);

            if ($phone.val() === '(') {
                $phone.val('');
            }
        });

    $.ajaxSetup({
        headers: {
            api_key: "9ecda589c54766ee3f4a84886ebf2f2e",
        },
    });

    $("#fileuploader").uploadFile({
        url: "https://api.imghippo.com/v1/upload",
        dragdropWidth: "100%",
        showDelete: true,
        // showFileSize: false,
        customProgressBar: function (obj, s) {
            $(".ajax-file-upload-container").text("");
            console.log("obj,s", obj, s);
            count = 0;
            this.statusbar = $("<div class='ajax-file-upload-statusbar'></div>");
            this.filename = $("<div class='ajax-file-upload-filename'></div>").appendTo(this.statusbar);

            console.log("sdsd", obj);
            console.log("sdsd", s);
            console.log("sdsd", obj.existingFileNames);


            const data = obj.existingFileNames[obj.existingFileNames.length - 1].split(" ");


            $("<div class='name'>" + data[0] + "</div>").appendTo(this.statusbar);
            $("<div class='size'>" + data[1] + "</div>").appendTo(this.statusbar);
            this.progressDiv = $("<div class='ajax-file-upload-progress'>").appendTo(this.statusbar).hide();
            this.progressbar = $("<div class='ajax-file-upload-bar'></div>").appendTo(this.progressDiv);
            this.abort = $("<div>" + s.abortStr + "</div>").appendTo(this.statusbar).hide();
            this.cancel = $("<div>" + s.cancelStr + "</div>").appendTo(this.statusbar).hide();
            this.done = $("<div>" + s.doneStr + "</div>").appendTo(this.statusbar).hide();
            this.download = $("<div>" + s.downloadStr + "</div>").appendTo(this.statusbar).hide();
            this.del = $("<div>" + s.deleteStr + "</div>").appendTo(this.statusbar).hide();

            this.abort.addClass("ajax-file-upload-red");
            this.done.addClass("ajax-file-upload-green");
            this.download.addClass("ajax-file-upload-green");
            this.cancel.addClass("ajax-file-upload-red");
            this.del.addClass("ajax-file-upload-red");
            return this;
        }
    });

    const taxIdInput = document.getElementById('tax-id');

    // Функция для применения маски
    function applyMask(value) {
        // Удаляем все нецифровые символы
        const numbers = value.replace(/\D/g, '');

        // Ограничиваем до 9 цифр
        const limited = numbers.substring(0, 9);

        // Применяем маску 99-9999999
        if (limited.length <= 2) {
            return limited;
        } else {
            return limited.substring(0, 2) + '-' + limited.substring(2);
        }
    }

    // Обработка ввода
    taxIdInput.addEventListener('input', function (e) {
        const cursorPosition = e.target.selectionStart;
        const oldValue = e.target.value;
        const newValue = applyMask(oldValue);

        e.target.value = newValue;

        // Корректируем позицию курсора
        let newCursorPosition = cursorPosition;

        // Если добавился дефис (переход с 2 на 3 цифру)
        if (newValue.length > oldValue.length && newValue.includes('-') && oldValue.length === 2) {
            // Курсор должен быть после дефиса
            newCursorPosition = cursorPosition + 1;
        } else if (newValue.length > oldValue.length && newValue[cursorPosition - 1] === '-') {
            // Если курсор находится на дефисе, перемещаем его после дефиса
            newCursorPosition = cursorPosition + 1;
        }

        // Устанавливаем позицию курсора
        setTimeout(() => {
            e.target.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
    });

    // Обработка вставки
    taxIdInput.addEventListener('paste', function (e) {
        e.preventDefault();
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');
        const maskedValue = applyMask(pastedText);
        e.target.value = maskedValue;
    });

    // Обработка удаления
    taxIdInput.addEventListener('keydown', function (e) {
        const cursorPosition = e.target.selectionStart;
        const value = e.target.value;

        // Если нажат Backspace и курсор находится после дефиса
        if (e.key === 'Backspace' && cursorPosition > 0 && value[cursorPosition - 1] === '-') {
            e.preventDefault();
            // Удаляем символ перед дефисом
            const newValue = value.substring(0, cursorPosition - 2) + value.substring(cursorPosition);
            e.target.value = applyMask(newValue);

            // Устанавливаем курсор
            setTimeout(() => {
                e.target.setSelectionRange(cursorPosition - 2, cursorPosition - 2);
            }, 0);
        }
    });
});