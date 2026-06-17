export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Keep conventional commit format (type + subject), drop stylistic constraints.
    'subject-full-stop': [0],
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
    'body-leading-blank': [0],
    'footer-leading-blank': [0],
    'subject-case': [0],
    'scope-case': [0],
    'type-case': [0],
  },
};
