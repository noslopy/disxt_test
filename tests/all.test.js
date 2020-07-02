const app = require('../app')
const supertest = require('supertest');
const request = supertest(app)

// I skipped creating helpers, factories but it would be better that way

describe('Endpoints', () => {
  let admin_token
  let client_token
  let product_id

  it('Refuses request without logged in user', async done => {
    const res = await request.get('/products')
    expect(res.status).toBe(401);
    done()
  })

  it('Create admin user', async done => {
    const res = await request.post('/signup')
      .query({ username: "asd@asd.com", name: "Test User", lastname: "Test", age: 21, password: "password1", role: "admin" })
    expect(res.body.data.username).toBe("asd@asd.com");
    done()
  })

  it('Login admin user', async done => {
    const res = await request.post('/login').query({ username: "asd@asd.com", password: "password1" })
    expect(res.status).toBe(200);
    admin_token = res.body.accessToken
    done()
  })

  it('Create product with admin user', async done => {
    const res = await request.post('/products/new')
      .set('x-access-token', admin_token)
      .query({ name: "item", price: 2, description: "the item" })
    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("item");
    product_id = res.body.data.id
    done()
  })

  it('Read all products with admin user', async done => {
    const res = await request.get('/products').set('x-access-token', admin_token)
    expect(res.status).toBe(200);
    expect(res.body.data.length).not.toBe(0);
    done()
  })

  it('Read single product with admin user', async done => {
    const res = await request.get(`/product/${product_id}`).set('x-access-token', admin_token)
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(product_id);
    done()
  })

  it('Update product with admin user', async done => {
    const res = await request.put(`/product/${product_id}`).set('x-access-token', admin_token).query({ description: "the item is awesome" })
    expect(res.status).toBe(200);
    expect(res.body.data.description).toBe("the item is awesome");
    done()
  })

  it('Create client user', async done => {
    const res = await request.post('/signup')
      .query({ username: "asd1@asd1.com", name: "Test User", lastname: "Test", age: 19, password: "password2", role: "client" })
    expect(res.body.data.username).toBe("asd1@asd1.com");
    done()
  })

  it('Login client user', async done => {
    const res = await request.post('/login').query({ username: "asd1@asd1.com", password: "password2" })
    expect(res.status).toBe(200);
    client_token = res.body.accessToken
    done()
  })

  it('Create product with client user', async done => {
    const res = await request.post('/products/new')
      .set('x-access-token', client_token)
      .query({ name: "item", price: 2, description: "the item" })
    expect(res.status).toBe(401);
    done()
  })

  // Same Behavior with update, delete endpoints when accessed by client user, I just skipped doing them as well

  it('Read single product with admin user', async done => {
    const res = await request.get(`/product/${product_id}`).set('x-access-token', client_token)
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(product_id);
    done()
  })

  it('Read all products with client user', async done => {
    const res = await request.get('/products').set('x-access-token', client_token)
    expect(res.status).toBe(200);
    expect(res.body.data.length).not.toBe(0);
    done()
  })

  it('Delete product with admin user', async done => {
    const res = await request.delete(`/product/${product_id}`).set('x-access-token', admin_token)
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Product has been deleted");
    done()
  })
})
