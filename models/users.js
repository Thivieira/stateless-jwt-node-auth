module.exports = bookshelf =>
  bookshelf.Model.extend({
    tableName: 'users',
    hasSecurePassword: true,
  });
