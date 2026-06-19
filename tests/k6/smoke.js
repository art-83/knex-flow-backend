import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = __ENV.BASE_URL ?? 'http://localhost:3000';
const email = __ENV.SMOKE_EMAIL ?? 'smoke@test.example.com';
const password = __ENV.SMOKE_PASSWORD ?? 'Test123!';

export const options = {
  vus: 1,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function smokeTest() {
  const healthResponse = http.get(`${baseUrl}/health`);
  check(healthResponse, {
    'health status is 200': response => response.status === 200,
  });

  const loginResponse = http.post(`${baseUrl}/auth/login`, JSON.stringify({ email, password }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginResponse, {
    'login status is 200 or 401': response => response.status === 200 || response.status === 401,
  });

  const publicEventsResponse = http.get(`${baseUrl}/public/events`);
  check(publicEventsResponse, {
    'public events status is 200': response => response.status === 200,
  });

  sleep(1);
}
