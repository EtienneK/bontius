module.exports = {
  schema: {
    title: 'Register',
    type: 'object',
    required: [
      'email',
      'password',
      'confirmPassword'
    ],
    properties: {
      email: {
        type: 'string',
        title: 'Email'
      },
      password: {
        type: 'string',
        title: 'Password',
        minLength: 6,
        maxLength: 255
      },
      confirmPassword: {
        type: 'string',
        title: 'Confirm password',
        minLength: 6,
        maxLength: 255
      }
    }
  }
};
