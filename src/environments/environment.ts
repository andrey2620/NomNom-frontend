// Alternatively, you can use:
const apiUrls = process.env['NODE_ENV'] === 'development' ? 'http://localhost:8080' : 'https://andrey.tail29d229.ts.net';

export const environment = {
  production: false,
  apiUrl: apiUrls,
  dev: true,
};
