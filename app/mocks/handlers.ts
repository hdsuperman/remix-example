import { http, HttpResponse, passthrough } from 'msw';

export const handlers = [
  http.get('/app/**', () => passthrough()),
  http.get('https://api.example.com/user', () => {
    return HttpResponse.json({ firstName: 'John', lastName: 'Maverick' });
  }),
];
