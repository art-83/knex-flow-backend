import { describe, it, expect } from 'vitest';

import { validatePasswordStrength } from '../../src/modules/users/utils/validate-password-strength';
import { TEST_PASSWORD } from '../helpers/constants';

describe('validatePasswordStrength', () => {
  it('accepts a strong password', () => {
    expect(validatePasswordStrength(TEST_PASSWORD).isValid).toBe(true);
  });

  it('rejects passwords without uppercase letters', () => {
    expect(validatePasswordStrength('test123!').isValid).toBe(false);
  });

  it('rejects passwords without numbers', () => {
    expect(validatePasswordStrength('Testtest!').isValid).toBe(false);
  });

  it('rejects passwords without special characters', () => {
    expect(validatePasswordStrength('Test1234').isValid).toBe(false);
  });
});
