const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,

  facebook: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  }
}, { timestamps: true });

/**
 * Password hash middleware.
 */
accountSchema.pre('save', function save(next) {
  const account = this;
  if (!account.isModified('password')) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(account.password, salt, (err, hash) => {
      if (err) { return next(err); }
      account.password = hash;
      next();
    });
  });
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
