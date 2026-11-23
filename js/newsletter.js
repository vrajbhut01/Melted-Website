/* Melted newsletter signup via Web3Forms.
   Needs WEB3FORMS_KEY (defined at the top of main.js). */
(function () {
    'use strict';

    var form = document.getElementById('newsletter-form');
    if (!form) return;

    var statusEl = document.getElementById('newsletter-status');
    var input = form.querySelector('input[type="email"]');
    var button = form.querySelector('button');
    var busy = false;

    function show(message, type) {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.setAttribute('data-state', type);
        statusEl.style.color = type === 'error' ? '#ff9b8a' : '#9be39b';
    }

    function validEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (busy || !input) return;

        // Bot trap: a real visitor never fills this hidden field.
        var trap = form.querySelector('[name="botcheck"]');
        if (trap && trap.checked) return;

        var email = input.value.trim();
        if (!validEmail(email)) {
            show('Please enter a valid email address.', 'error');
            input.focus();
            return;
        }

        var key = (typeof WEB3FORMS_KEY !== 'undefined') ? WEB3FORMS_KEY : '';
        if (!key) {
            show('Something went wrong. Please email vrajfoods01@gmail.com.', 'error');
            return;
        }

        busy = true;
        var originalLabel = button ? button.textContent : '';
        if (button) { button.disabled = true; button.textContent = 'Sending...'; }
        show('Sending...', 'info');

        var data = new FormData();
        data.append('access_key', key);
        data.append('email', email);
        data.append('subject', 'New Melted newsletter signup');
        data.append('from_name', 'Melted website');

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { Accept: 'application/json' },
            body: data
        })
            .then(function (response) { return response.json(); })
            .then(function (result) {
                if (result && result.success) {
                    show("You're in! We'll email you about new flavours and offers.", 'success');
                    form.reset();
                } else {
                    show('Something went wrong. Please email vrajfoods01@gmail.com.', 'error');
                }
            })
            .catch(function () {
                show('Something went wrong. Please email vrajfoods01@gmail.com.', 'error');
            })
            .then(function () {
                busy = false;
                if (button) { button.disabled = false; button.textContent = originalLabel; }
            });
    }, true);

    // If the button isn't a real submit button, make it submit the form.
    if (button) {
        button.addEventListener('click', function (event) {
            if (button.getAttribute('type') !== 'submit') {
                event.preventDefault();
                form.requestSubmit();
            }
        });
    }
})();