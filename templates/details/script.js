function getButton(id) { return document.getElementById(id); }
function getPanel(selector) { return document.querySelector(selector); }

const openChatBTN = checkElement(getButton('open_chat'));
const chat = getPanel('.chat');


// NEW NOTIFICATION LEADS CODE START
function updateBorders() {
	if (
		!openChatBTN.classList.contains('active') &&
		!openNotesBTN.classList.contains('active') &&
		!openContactsBTN.classList.contains('active')
	) {
		if(openChatBTN) openChatBTN.classList.add('no-active');
		if(openNotesBTN) openNotesBTN.classList.add('no-active');
		if(openContactsBTN) openContactsBTN.classList.add('no-active');
	} else {
		openChatBTN.classList.remove('no-active');
		openNotesBTN.classList.remove('no-active');
		openContactsBTN.classList.remove('no-active');
	}
}

function checkElement(element){
	if(element){
		return element;
	}
}
// NEW NOTIFICATION LEADS CODE END

// NEW NOTIFICATION LEADS CODE START
openChatBTN.addEventListener('click', () => {
	const isActive = chat.classList.contains('active');
	resetAll();
	if (!isActive) {
		checkElement(chat).classList.add('active');
		checkElement(openChatBTN).classList.add('active');
	}
	updateBorders();
});

function resetAll() {
	checkElement(chat).classList.remove('active');
	checkElement(openChatBTN).classList.remove('active');
	
}
// NEW NOTIFICATION LEADS CODE END



const changeChatOpened = document.querySelector('.opened_chat-head--back');
const chatDetailsBTNs = document.querySelectorAll('.chat_item');

changeChatOpened.addEventListener('click', () => {
	chat.classList.toggle('open');
});

chatDetailsBTNs.forEach(btn => {
	btn.addEventListener('click', () => {
		chat.classList.toggle('open');
	});
});

// NEW NOTIFICATION LEADS CODE START
document.addEventListener('DOMContentLoaded', () => {
	const popupOverlay = document.getElementById('popupOverlay');

	const popups = {
		email: {
			trigger: 'contactsPanelPopupEmail',
			popup: 'emailPopup',
			form: 'emailForm',
			borrower: 'emailBorrower',
			note: 'emailNote',
			counter: 'emailNoteCounter',
		},
		call: {
			trigger: 'contactsPanelPopuPhone',
			popup: 'callPopup',
			form: 'callForm',
			borrower: 'callBorrower',
			note: 'callNote',
			counter: 'callNoteCounter',
		},
		sms: {
			trigger: 'contactsPanelPopuNote',
			popup: 'smsPopup',
			form: 'smsForm',
			borrower: 'smsBorrower',
			note: 'smsNote',
			counter: 'smsNoteCounter',
		},
	};

	// Open popup on trigger
	Object.values(popups).forEach(({ trigger, popup, borrower, note, counter }) => {
		document.getElementById(trigger)?.addEventListener('click', () => {
			resetForm(popup);
			populateBorrowers(borrower);
			updateNoteCounter(note, counter);
			document.getElementById(popup).classList.add('active');
			popupOverlay.classList.add('active');
		});
	});

	// Close popups
	document.querySelectorAll('.popup-close').forEach(btn => {
		btn.addEventListener('click', () => {
			const popupId = btn.getAttribute('data-close');
			document.getElementById(popupId).classList.remove('active');
			popupOverlay.classList.remove('active');
		});
	});

	document.querySelectorAll('.popup form').forEach(form => {
		form.querySelectorAll('input, textarea, select').forEach(field => {
			field.addEventListener('input', () => {
				const group = field.closest('.form-group');
				if (group?.classList.contains('invalid')) {
					group.classList.remove('invalid');
				}
			});
			field.addEventListener('change', () => {
				const group = field.closest('.form-group');
				if (group?.classList.contains('invalid')) {
					group.classList.remove('invalid');
				}
			});
		});
	});

	// Validation and submission
	Object.values(popups).forEach(({ form, borrower, note, popup }) => {
		const formEl = document.getElementById(form);
		if (formEl) { // Хорошая практика - проверять и formEl
			formEl.addEventListener('submit', e => {
				e.preventDefault();
				const valid = validateFields([borrower, note, ...(form === 'callForm' ? ['callType'] : [])]);
				if (valid) {
					const popupEl = document.getElementById(popup);
					if (popupEl) popupEl.classList.remove('active');
					if (popupOverlay) popupOverlay.classList.remove('active'); // Убедитесь, что popupOverlay определен
				}
			});
		} else {
		}

		// Live character counter
		const noteEl = document.getElementById(note);
		const counterEl = document.getElementById(`${note}Counter`);

		if (noteEl) { // <-- ДОБАВЬТЕ ЭТУ ПРОВЕРКУ
			noteEl.addEventListener('input', () => {
				// Убедитесь, что counterEl тоже существует, если он обязателен для updateNoteCounter
				if (counterEl) {
					updateNoteCounter(note, counterEl);
				} else {
					console.warn(`Элемент счетчика "<span class="math-inline">\{note\}Counter" не найден для заметки "</span>{note}".`);
					// Возможно, просто вызвать updateNoteCounter без counterEl или с null, если функция это обрабатывает
					// updateNoteCounter(note, null);
				}
			});
		} else {
		}
	});

	function resetForm(popupId) {
		const popup = document.getElementById(popupId);
		const form = popup.querySelector('form');
		form.reset();
		popup.querySelectorAll('.form-group.invalid').forEach(g => g.classList.remove('invalid'));
	
		// Reset counter if there's a note textarea
		const note = popup.querySelector('textarea');
		const counter = popup.querySelector('.char-counter');
		if (note && counter) {
			const max = parseInt(note.getAttribute('maxlength'), 10);
			counter.textContent = `${max} characters left`;
		}
	}	

	function populateBorrowers(selectId) {
		const select = document.getElementById(selectId);
		select.innerHTML = '<option value="" disabled selected>Select borrower...</option>';
		for (let i = 0; i < 5; i++) {
			const option = document.createElement('option');
			const id = Math.floor(Math.random() * 1000);
			option.value = `borrower_${id}`;
			option.textContent = `Borrower ${id}`;
			select.appendChild(option);
		}
	}

	function validateFields(ids) {
		let valid = true;
		ids.forEach(id => {
			const el = document.getElementById(id);
			const group = el.closest('.form-group');
			const value = el.value.trim();
			const isNote = id.toLowerCase().includes('note');

			if (!value || (isNote && !/^[\w\s.,;:!?()'"-а-яА-ЯіїєґІЇЄҐ]{1,100}$/.test(value))) {
				group?.classList.add('invalid');
				valid = false;
			} else {
				group?.classList.remove('invalid');
			}
		});
		return valid;
	}

	function updateNoteCounter(noteId, counterEl) {
		const note = document.getElementById(noteId);
		const max = parseInt(note.getAttribute('maxlength'), 10);
		counterEl.textContent = `${max - note.value.length} characters left`;
	}
});
// NEW NOTIFICATION LEADS CODE END