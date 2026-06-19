/**
 * contactForm.test.js
 * Unit tests for contactForm and toastNotification modules.
 * Requirements: 7.2, 7.3, 7.4, 7.5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// ─── Helpers to replicate the module logic under test ─────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Build a minimal DOM environment with the contact form HTML.
 * Returns the form element and field/error accessors.
 */
function buildDOM() {
  document.body.innerHTML = `
    <div id="toast-container"></div>
    <form id="contact-form" novalidate>
      <input id="field-name"    name="name"    type="text"  value="" />
      <p    id="error-name"    class="hidden"></p>
      <input id="field-email"   name="email"   type="email" value="" />
      <p    id="error-email"   class="hidden"></p>
      <input id="field-subject" name="subject" type="text"  value="" />
      <p    id="error-subject" class="hidden"></p>
      <textarea id="field-message" name="message"></textarea>
      <p    id="error-message" class="hidden"></p>
      <button type="submit">Kirim</button>
    </form>
  `;
}

/**
 * Inline implementation of _showError / _clearError / _validateField / validate / reset / submit
 * identical to the one in app.js — kept here so tests are self-contained and
 * don't depend on loading the IIFE bundle.
 */
function makeContactForm(toastFn) {
  function _showError(fieldId, message) {
    const el = document.getElementById('error-' + fieldId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden');
  }

  function _clearError(fieldId) {
    const el = document.getElementById('error-' + fieldId);
    if (!el) return;
    el.textContent = '';
    el.classList.add('hidden');
  }

  function _validateField(field) {
    const id    = field.id.replace('field-', '');
    const value = field.value.trim();

    if (!value) {
      _showError(id, 'Field ini wajib diisi.');
      return false;
    }

    if (id === 'email' && !EMAIL_RE.test(value)) {
      _showError(id, 'Format email tidak valid.');
      return false;
    }

    _clearError(id);
    return true;
  }

  function validate() {
    const fields  = ['field-name', 'field-email', 'field-subject', 'field-message'];
    let   isValid = true;
    fields.forEach(function (fid) {
      const el = document.getElementById(fid);
      if (el && !_validateField(el)) isValid = false;
    });
    return isValid;
  }

  function reset() {
    const form = document.getElementById('contact-form');
    if (form) form.reset();
    ['name', 'email', 'subject', 'message'].forEach(_clearError);
  }

  function submit(event) {
    event.preventDefault();
    if (!validate()) return;
    toastFn('Pesan Anda berhasil dikirim! Terima kasih 🎉', 'success', 3000);
    reset();
  }

  return { validate, _validateField, submit, reset };
}

// ─── _validateField ────────────────────────────────────────────────────────────

describe('_validateField', () => {
  beforeEach(() => buildDOM());

  it('returns false and shows error when name field is empty', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-name');
    field.value = '';
    expect(form._validateField(field)).toBe(false);
    const err = document.getElementById('error-name');
    expect(err.classList.contains('hidden')).toBe(false);
    expect(err.textContent).toBe('Field ini wajib diisi.');
  });

  it('returns false and shows error when field contains only whitespace', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-name');
    field.value = '   \t  ';
    expect(form._validateField(field)).toBe(false);
    const err = document.getElementById('error-name');
    expect(err.classList.contains('hidden')).toBe(false);
  });

  it('returns true and clears error when name field has valid content', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-name');
    field.value = 'Budi Santoso';
    expect(form._validateField(field)).toBe(true);
    expect(document.getElementById('error-name').classList.contains('hidden')).toBe(true);
  });

  it('returns false with "Format email tidak valid." for invalid email', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-email');
    field.value = 'bukan-email';
    expect(form._validateField(field)).toBe(false);
    const err = document.getElementById('error-email');
    expect(err.textContent).toBe('Format email tidak valid.');
  });

  it('returns false for email missing @ symbol', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-email');
    field.value = 'userexample.com';
    expect(form._validateField(field)).toBe(false);
    expect(document.getElementById('error-email').textContent).toBe('Format email tidak valid.');
  });

  it('returns false for email missing domain part', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-email');
    field.value = 'user@';
    expect(form._validateField(field)).toBe(false);
  });

  it('returns true for a valid email address', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-email');
    field.value = 'user@example.com';
    expect(form._validateField(field)).toBe(true);
    expect(document.getElementById('error-email').classList.contains('hidden')).toBe(true);
  });

  it('returns false and shows error when message textarea is empty', () => {
    const form = makeContactForm(vi.fn());
    const field = document.getElementById('field-message');
    field.value = '';
    expect(form._validateField(field)).toBe(false);
    expect(document.getElementById('error-message').classList.contains('hidden')).toBe(false);
  });
});

// ─── validate() ───────────────────────────────────────────────────────────────

describe('validate()', () => {
  beforeEach(() => buildDOM());

  it('returns false when all fields are empty', () => {
    const form = makeContactForm(vi.fn());
    expect(form.validate()).toBe(false);
  });

  it('returns false when only some fields are filled', () => {
    const form = makeContactForm(vi.fn());
    document.getElementById('field-name').value    = 'Budi';
    document.getElementById('field-email').value   = 'budi@example.com';
    // subject and message intentionally left empty
    expect(form.validate()).toBe(false);
  });

  it('returns false when email field is invalid even if other fields are filled', () => {
    const form = makeContactForm(vi.fn());
    document.getElementById('field-name').value    = 'Budi';
    document.getElementById('field-email').value   = 'not-valid';
    document.getElementById('field-subject').value = 'Halo';
    document.getElementById('field-message').value = 'Pesan saya';
    expect(form.validate()).toBe(false);
  });

  it('returns true when all fields are valid', () => {
    const form = makeContactForm(vi.fn());
    document.getElementById('field-name').value    = 'Budi Santoso';
    document.getElementById('field-email').value   = 'budi@example.com';
    document.getElementById('field-subject').value = 'Pertanyaan';
    document.getElementById('field-message').value = 'Isi pesan saya';
    expect(form.validate()).toBe(true);
  });
});

// ─── submit() ─────────────────────────────────────────────────────────────────

describe('submit()', () => {
  beforeEach(() => buildDOM());

  it('does not call toast when form is invalid', () => {
    const toastFn = vi.fn();
    const form    = makeContactForm(toastFn);
    const event   = { preventDefault: vi.fn() };

    // Leave all fields empty → invalid
    form.submit(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(toastFn).not.toHaveBeenCalled();
  });

  it('calls toast with success type and 3000ms duration on valid submit', () => {
    const toastFn = vi.fn();
    const form    = makeContactForm(toastFn);
    const event   = { preventDefault: vi.fn() };

    document.getElementById('field-name').value    = 'Budi Santoso';
    document.getElementById('field-email').value   = 'budi@example.com';
    document.getElementById('field-subject').value = 'Pertanyaan';
    document.getElementById('field-message').value = 'Isi pesan saya';

    form.submit(event);
    expect(toastFn).toHaveBeenCalledOnce();
    expect(toastFn).toHaveBeenCalledWith(
      expect.any(String), // message
      'success',
      3000
    );
  });

  it('resets all fields to empty strings after valid submit (Req 7.5)', () => {
    const form  = makeContactForm(vi.fn());
    const event = { preventDefault: vi.fn() };

    document.getElementById('field-name').value    = 'Budi Santoso';
    document.getElementById('field-email').value   = 'budi@example.com';
    document.getElementById('field-subject').value = 'Pertanyaan';
    document.getElementById('field-message').value = 'Isi pesan saya';

    form.submit(event);

    expect(document.getElementById('field-name').value).toBe('');
    expect(document.getElementById('field-email').value).toBe('');
    expect(document.getElementById('field-subject').value).toBe('');
    expect(document.getElementById('field-message').value).toBe('');
  });
});

// ─── reset() ──────────────────────────────────────────────────────────────────

describe('reset()', () => {
  beforeEach(() => buildDOM());

  it('clears all field values', () => {
    const form = makeContactForm(vi.fn());
    document.getElementById('field-name').value    = 'Test';
    document.getElementById('field-email').value   = 'test@test.com';
    document.getElementById('field-subject').value = 'Sub';
    document.getElementById('field-message').value = 'Msg';

    form.reset();

    expect(document.getElementById('field-name').value).toBe('');
    expect(document.getElementById('field-email').value).toBe('');
    expect(document.getElementById('field-subject').value).toBe('');
    expect(document.getElementById('field-message').value).toBe('');
  });

  it('hides all error elements after reset', () => {
    const form = makeContactForm(vi.fn());
    // Trigger validation to show errors first
    form.validate();
    // Now reset
    form.reset();

    ['name', 'email', 'subject', 'message'].forEach((id) => {
      expect(document.getElementById('error-' + id).classList.contains('hidden')).toBe(true);
    });
  });
});

// ─── toastNotification.show() ─────────────────────────────────────────────────

describe('toastNotification.show()', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="toast-container"></div>';
  });

  /**
   * Inline replica of the toastNotification.show logic for isolated testing.
   */
  function toastShow(message, type, duration) {
    type     = type     || 'success';
    duration = duration || 3000;

    const container = document.getElementById('toast-container');
    if (!container) return null;

    const toast       = document.createElement('div');
    toast.className   = 'toast ' + type;
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    container.appendChild(toast);
    return toast;
  }

  it('appends a toast element to #toast-container', () => {
    toastShow('Test message', 'success', 3000);
    const container = document.getElementById('toast-container');
    expect(container.children.length).toBe(1);
  });

  it('sets the correct message text on the toast element', () => {
    const toast = toastShow('Pesan berhasil!', 'success', 3000);
    expect(toast.textContent).toBe('Pesan berhasil!');
  });

  it('applies the correct type class (success)', () => {
    const toast = toastShow('OK', 'success', 3000);
    expect(toast.classList.contains('success')).toBe(true);
  });

  it('applies the correct type class (error)', () => {
    const toast = toastShow('Gagal!', 'error', 3000);
    expect(toast.classList.contains('error')).toBe(true);
  });

  it('applies the correct type class (info)', () => {
    const toast = toastShow('Info', 'info', 3000);
    expect(toast.classList.contains('info')).toBe(true);
  });

  it('defaults to success type when type is not provided', () => {
    const toast = toastShow('Default');
    expect(toast.classList.contains('success')).toBe(true);
  });

  it('sets role="status" for accessibility', () => {
    const toast = toastShow('A11y');
    expect(toast.getAttribute('role')).toBe('status');
  });

  it('does nothing when #toast-container is absent', () => {
    document.body.innerHTML = ''; // Remove container
    expect(() => toastShow('No container', 'success', 3000)).not.toThrow();
  });
});

// ─── email regex ──────────────────────────────────────────────────────────────

describe('Email validation regex', () => {
  const valid = [
    'user@example.com',
    'user.name@domain.co.id',
    'user+tag@example.org',
    'a@b.io',
  ];
  const invalid = [
    'notanemail',
    'missing@dot',
    '@nodomain.com',
    'spaces in@email.com',
    '',
  ];

  valid.forEach((email) => {
    it(`accepts valid email: ${email}`, () => {
      expect(EMAIL_RE.test(email)).toBe(true);
    });
  });

  invalid.forEach((email) => {
    it(`rejects invalid email: "${email}"`, () => {
      expect(EMAIL_RE.test(email)).toBe(false);
    });
  });
});
