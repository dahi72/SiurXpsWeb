module.exports = {
    rules: {
      'no-restricted-globals': [
        'error',
        'event',
        'fdescribe',
        {
          name: 'self',
          message: 'Do not use `self` as a global variable.'
        }
      ]
    }
  }
  