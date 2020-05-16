var session = require('supertest-session');
const app = require('../app');
const registerSchema = require('../schemas/interaction/register');

var testSession = null;
beforeEach(function () {
  testSession = session(app);
});

describe('register', function () {
  it('should create a new user', async function () {
    const authRes = await testSession
      .get('/auth?client_id=oidc_client&redirect_uri=http://localhost:3000/oidc_redirect&response_type=code&prompt=register')
      .expect(302);

    await testSession
      .get(authRes.header.location)
      .expect('Content-Type', /json/)
      .expect(200, { ...registerSchema });

    await testSession
      .post(authRes.header.location)
      .send({
        email: 'test@example.com',
        password: 'testP4ssw0rd123',
        confirmPassword: 'testP4ssw0rd123'
      })
      .expect('Content-Type', /json/)
      .expect(200, '"done"');
  });
});
