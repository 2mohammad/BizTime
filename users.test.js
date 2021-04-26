process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testUser;
beforeEach(async () => {
     const result = await db.query()
     testUser = result.rows[0]
})

afterEach(async () =>{
    await db.query()
})

afterAll(async () => {
    await db.end()
})
describe("HOPE THIS WORKS", () => {
    test("BLAH", () =>{
        console.log(testUser);
        expect(1).toBe(1);
    })
})

describe("GET /users", () =>{
    test("Get a list with one user", async()=>{
        const res = await request(app).get('/users')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ "users": [testUser] })
    })
})

describe("GET /users/:id", () =>{
    test("Get a single user", async()=>{
        const res = await request(app).get()
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ user: testUser })
    })
    test("Responds with a 404 for invalid id", async()=>{
        const res = await request(app).get()
        expect(res.statusCode).toBe(404)
    })
})

describe("POST /users", ()=> {
    test("Created a single user", async()=>{
        const res = await request(app).post('/users').send({ name: 'BillyBob', type: 'staff' });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({
            user: {id: expect.any(Number), name: 'BillyBob', type: 'staff'}
        })
    })
})

describe("PATCH /users/:id", ()=> {
    test("Updates a single user", async()=>{
        const res = await request(app).patch().send({ name: 'BillyBob', type: 'staff' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            user: {id: testUser.id, name: 'BillyBob', type: 'staff'}
        })
    })
    test("Updates a non existent user", async()=>{
        const res = await request(app).patch().send({ name: 'BillyBob', type: 'staff' });
        expect(res.statusCode).toBe(404);
    })
})

describe("DELETE /users/:id", ()=> {
    test("Delete a single user", async()=>{
        const res = await request(app).delete();
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({msg: 'Deleted'})
    })
    test("Delete a non existent user", async()=>{
        const res = await request(app).patch().send({ name: 'BillyBob', type: 'staff' });
        expect(res.statusCode).toBe(404);
    })
})
