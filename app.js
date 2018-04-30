require('dotenv').config();
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'jwt',
    charset: 'utf8',
  },
});
const bookshelf = require('bookshelf')(knex)
const securePassword = require('bookshelf-secure-password');
bookshelf.plugin(securePassword);

module.exports = bookshelf;

const app = express();

//middlewares
app.use(morgan('dev'))
app.use(bodyParser.json())


//routes
app.use('/users', require('./routes/users'))


//start the server
const PORT = process.env.PORT || 3500;

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
})