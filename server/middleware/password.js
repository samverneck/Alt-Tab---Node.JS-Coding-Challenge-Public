'use strict'
const crypto = require('crypto')
const SaltLength = 9;

// function to create hash for password
function createHash(password) {
  let salt = generateSalt(SaltLength);
  let hash = md5(password + salt);
  return salt + hash;
}

// function to validate hash for password
function validateHash(hash, password) {
  let salt = hash.substr(0, SaltLength);
  let validHash = salt + md5(password + salt);
  return hash === validHash;
}

// function to generate salt length
function generateSalt(len) {
  let set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
  setLen = set.length,
  salt = '';
  for (let i = 0; i < len; i++) {
    let p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

// function to create hash md5 cryptografy, update string, digest hex
const md5 = (string) => crypto.createHash('md5').update(string).digest('hex');

module.exports = {
  'hash': createHash,
  'validate': validateHash
};
