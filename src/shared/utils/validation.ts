/**
 * Validation utility functions
 * Form validation, data validation
 */

import { VALIDATION_RULES } from '@/shared/constants';

/**
 * E-posta validasyonu
 */
export function validateEmail(email: string): boolean {
  return VALIDATION_RULES.EMAIL.PATTERN.test(email);
}

/**
 * Şifrə validasyonu
 */
export function validatePassword(password: string): boolean {
  return password.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH &&
         password.length <= VALIDATION_RULES.PASSWORD.MAX_LENGTH;
}

/**
 * Ad validasyonu
 */
export function validateName(name: string): boolean {
  return name.trim().length >= VALIDATION_RULES.NAME.MIN_LENGTH &&
         name.trim().length <= VALIDATION_RULES.NAME.MAX_LENGTH;
}

/**
 * Qiymət validasyonu
 */
export function validatePrice(price: string | number): boolean {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return !isNaN(numPrice) && 
         numPrice >= VALIDATION_RULES.PRICE.MIN &&
         numPrice <= VALIDATION_RULES.PRICE.MAX;
}

/**
 * Boş mətn kontrolü
 */
export function isEmpty(value: string): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Genel form validasyon objesi
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Login form validasyonu
 */
export function validateLoginForm(email: string, password: string): ValidationResult {
  const errors: Record<string, string> = {};

  if (isEmpty(email)) {
    errors.email = 'E-poçt ünvanı mütləqdir';
  } else if (!validateEmail(email)) {
    errors.email = 'Düzgün e-poçt ünvanı daxil edin';
  }

  if (isEmpty(password)) {
    errors.password = 'Şifrə mütləqdir';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Register form validasyonu
 */
export function validateRegisterForm(
  name: string,
  email: string,
  phone: string,
  password: string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (isEmpty(name)) {
    errors.name = 'Ad mütləqdir';
  } else if (!validateName(name)) {
    errors.name = `Ad ${VALIDATION_RULES.NAME.MIN_LENGTH}-${VALIDATION_RULES.NAME.MAX_LENGTH} simvol arasında olmalıdır`;
  }

  if (isEmpty(email)) {
    errors.email = 'E-poçt ünvanı mütləqdir';
  } else if (!validateEmail(email)) {
    errors.email = 'Düzgün e-poçt ünvanı daxil edin';
  }

  if (isEmpty(phone)) {
    errors.phone = 'Telefon nömrəsi mütləqdir';
  } else if (phone.replace(/\D/g, '').length < VALIDATION_RULES.PHONE.MIN_LENGTH) {
    errors.phone = 'Düzgün telefon nömrəsi daxil edin';
  }

  if (isEmpty(password)) {
    errors.password = 'Şifrə mütləqdir';
  } else if (!validatePassword(password)) {
    errors.password = `Şifrə ən azı ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} simvoldan ibarət olmalıdır`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Phone number add form validasyonu
 */
export function validatePhoneAddForm(
  phoneNumber: string,
  price: string,
  contactPhone: string,
  type: string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (isEmpty(phoneNumber)) {
    errors.phoneNumber = 'Telefon nömrəsi mütləqdir';
  } else if (phoneNumber.replace(/\D/g, '').length < 7) {
    errors.phoneNumber = 'Telefon nömrəsi ən azı 7 rəqəmdən ibarət olmalıdır';
  }

  if (isEmpty(price)) {
    errors.price = 'Qiymət mütləqdir';
  } else if (!validatePrice(price)) {
    errors.price = 'Düzgün qiymət daxil edin';
  }

  if (isEmpty(contactPhone)) {
    errors.contactPhone = 'Əlaqə nömrəsi mütləqdir';
  }

  if (isEmpty(type)) {
    errors.type = 'Növ seçimi mütləqdir';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Feedback form validasyonu
 */
export function validateFeedbackForm(
  name: string,
  email: string,
  subject: string,
  message: string,
  feedbackType: string
): ValidationResult {
  const errors: Record<string, string> = {};

  if (isEmpty(name)) {
    errors.name = 'Ad mütləqdir';
  } else if (!validateName(name)) {
    errors.name = 'Ad çox qısa və ya çox uzundur';
  }

  if (isEmpty(email)) {
    errors.email = 'E-poçt ünvanı mütləqdir';
  } else if (!validateEmail(email)) {
    errors.email = 'Düzgün e-poçt ünvanı daxil edin';
  }

  if (isEmpty(subject)) {
    errors.subject = 'Mövzu mütləqdir';
  }

  if (isEmpty(message)) {
    errors.message = 'Mesaj mütləqdir';
  } else if (message.trim().length < 10) {
    errors.message = 'Mesaj çox qısadır (ən azı 10 simvol)';
  }

  if (isEmpty(feedbackType)) {
    errors.feedbackType = 'Feedback növü seçimi mütləqdir';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
