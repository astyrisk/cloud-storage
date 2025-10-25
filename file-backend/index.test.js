const request = require('supertest');
const multer = require('multer');
const app = require('./index');
const { exec } = require('child_process');
const firebase = require('firebase-admin');
const serviceAccount = require('./file-4cacd-firebase-adminsdk-7d5di-0f4e2238db.json');

describe('GET /', () => {
  it('should return "Hello, world!"', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello, world!');
  });
});


// Mock firebase-admin
jest.mock('firebase-admin', () => ({
  storage: jest.fn(() => ({
    bucket: jest.fn(() => ({
      file: jest.fn(() => ({
        createWriteStream: jest.fn(() => {
          const stream = {
            on: jest.fn((event, callback) => {
              if (event === 'finish') callback();
            }),
            end: jest.fn(),
          };
          return stream;
        }),
        makePublic: jest.fn(() => Promise.resolve()),
      })),
      name: 'mocked-bucket',
    })),
  })),
  credential: {
    cert: jest.fn(() => ({})), // Mock the cert method
  },
  initializeApp: jest.fn(), // Mock initializeApp
}));

describe('POST /upload/firebase', () => {
  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app).post('/upload/firebase');
    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'No file uploaded.' });
  });

  it('should return a public URL on successful upload', async () => {
    const fileBuffer = Buffer.from('dummy content');
    const res = await request(app)
      .post('/upload/firebase')
      .attach('file', fileBuffer, 'test-file.txt'); // Simulates file upload

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body.url).toContain('https://firebasestorage.googleapis.com');
  });
});


jest.mock('child_process', () => ({
  exec: jest.fn(),
}));


describe('POST /upload/local', () => {
  beforeAll(() => {
    // Suppress console.error during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restore console.error after tests
    console.error.mockRestore();
  });

  it('should return 400 if no file is uploaded', async () => {
    const res = await request(app).post('/upload/local');
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe('No file uploaded.');
  });

  it('should return metadata and file hash on successful upload', async () => {
    const fileBuffer = Buffer.from('dummy content');

    // Mock exiftool execution
    exec.mockImplementationOnce((command, callback) => {
      if (command.includes('exiftool')) {
        callback(null, JSON.stringify([{ FileName: 'test-file.txt', FileSize: '12 bytes' }]), null);
      }
    });

    // Mock openssl execution
    exec.mockImplementationOnce((command, callback) => {
      if (command.includes('openssl md5')) {
        callback(null, 'MD5 (test-file.txt) = abc123def4567890', null);
      }
    });

    const res = await request(app)
      .post('/upload/local')
      .attach('file', fileBuffer, 'test-file.txt');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      metadata: [{ FileName: 'test-file.txt', FileSize: '12 bytes' }],
      fileHash: 'abc123def4567890',
    });
  });

  it('should handle errors from exiftool command', async () => {
    const fileBuffer = Buffer.from('dummy content');

    // Mock exiftool execution to return an error
    exec.mockImplementationOnce((command, callback) => {
      if (command.includes('exiftool')) {
        callback(new Error('Exiftool error'), null, null);
      }
    });

    const res = await request(app)
      .post('/upload/local')
      .attach('file', fileBuffer, 'test-file.txt');

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Internal server error.');
  });

  it('should handle errors from openssl command', async () => {
    const fileBuffer = Buffer.from('dummy content');

    // Mock successful exiftool execution
    exec.mockImplementationOnce((command, callback) => {
      if (command.includes('exiftool')) {
        callback(null, JSON.stringify([{ FileName: 'test-file.txt', FileSize: '12 bytes' }]), null);
      }
    });

    // Mock openssl execution to return an error
    exec.mockImplementationOnce((command, callback) => {
      if (command.includes('openssl md5')) {
        callback(new Error('OpenSSL error'), null, null);
      }
    });

    const res = await request(app)
      .post('/upload/local')
      .attach('file', fileBuffer, 'test-file.txt');

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Internal server error.');
  });
});
