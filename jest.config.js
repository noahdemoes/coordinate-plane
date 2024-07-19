module.exports = {
    moduleFileExtensions: [
      'js',
      'vue'
    ],
    transform: {
      '^.+\\.vue$': 'vue-jest',
      '^.+\\.js$': 'babel-jest'
    },
    testMatch: [
      '**/tests/unit/**/*.spec.js'
    ],
    transformIgnorePatterns: ["/node_modules/(?!vue-awesome)"]
  };
  