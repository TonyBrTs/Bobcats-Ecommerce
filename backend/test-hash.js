// generate-hash.js
const bcrypt = require('bcryptjs');

const plainPassword = 'admin';

bcrypt.hash(plainPassword, 10).then(hash => {
  console.log('Nuevo hash:', hash);
});