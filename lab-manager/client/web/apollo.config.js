module.exports = {
  client: {
    service: {
      name: 'web',
      // URL to the GraphQL API
      url: 'http://localhost/api/',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
    ],
  },
}