function validatePasswordStrength(password: string): { isValid: boolean; message?: string } {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (password.length < minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${minLength} characters long.`,
    };
  }

  if (!hasUpperCase) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter.',
    };
  }

  if (!hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one number.',
    };
  }

  if (!hasSpecialChar) {
    return {
      isValid: false,
      message: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{};\'"\\|,.<>/?)',
    };
  }

  return { isValid: true };
}

export default validatePasswordStrength;
