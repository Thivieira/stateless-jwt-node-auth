const JWT = require('jsonwebtoken');
const bookshelf = require('../app');
const User = require('../models/users')(bookshelf);

signToken = user => {
  return JWT.sign(
    {
      iss: 'smart_server',
      sub: user.get('id'),
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    },
    process.env.JWT_SECRET,
  ); //current time //current time + 1 day ahead
};

module.exports = {
  signUp: async (req, res, next) => {
    //email and password

    console.log('usersController.signUp() called!');
    const { email, password } = req.value.body;

    //check if there is a user with the same email
    const foundUser = await User.forge()
      .where({ email })
      .fetch();
    if (foundUser) {
      return res.status(403).json({ error: 'Email is already in use' });
    }
    //create new user
    const newUser = new User({
      email,
      password,
    });
    await newUser.save();

    // generate the token

    const token = signToken(newUser);

    //respond with token
    //res.json({user:'created'})
    res.status(200).json({ token: "JWT "+token });
  },
  signIn: async (req, res, next) => {
    //generate token
    const token = signToken(req.user);
    res.status(200).json({ token: 'JWT ' + token });
    console.log('Sucessfull login!');
  },
  secret: async (req, res, next) => {
    console.log('I managed to get here!');
    res.status(200).json({msg:'this is a secret resource'})
  },
};
