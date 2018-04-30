const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const bookshelf = require('./app');
const User = require('./models/users')(bookshelf);

//jwt strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      /* jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), */
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        //find the user specified in token
        const user = await User.forge().where({ id: payload.sub });

        //if user doesn't exists, handle it
        if (!user) {
          return done(null, false);
        }

        // otherwise, return the user
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    },
  ),
);

//local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        //find the user given the email

        const user = await User.forge({ email }).fetch();

        //if not handle it

        if (!user) {
          return done(null, false);
        }

        //if user found check weather the password is correct, if not handle it
        const authenticatedUser = await user.authenticate(password);

        if (!authenticatedUser) {
          console.log('not')
          return done(null, false);
        }

        //otherwise return the user
        done(null, user);
      } catch (error) {
        console.log('error catched')
        done(error, false);
      }
    },
  ),
);
