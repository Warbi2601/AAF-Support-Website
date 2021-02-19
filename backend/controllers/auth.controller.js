const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// needs abstracting into an environment variable
const secret = "aaf2021secret";

exports.register = (req, res) => {
  const { email, password } = req.body;
  const user = new User({
    email,
    password,
  });
  user.save(function (err) {
    if (err) {
      console.log(err);
      res.status(500).send("Error registering your account, try again.");
    } else {
      // Issue token
      const payload = { email, _id: user._id };
      const token = jwt.sign(payload, secret, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true }).sendStatus(200);
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again",
      });
    } else if (!user) {
      res.status(401).json({
        error: "Incorrect email or password",
      });
    } else {
      user.isCorrectPassword(password, function (err, same) {
        if (err) {
          res.status(500).json({
            error: "Internal error please try again",
          });
        } else if (!same) {
          res.status(401).json({
            error: "Incorrect email or password",
          });
        } else {
          // Issue token
          const payload = { email, _id: user._id };
          const token = jwt.sign(payload, secret, {
            expiresIn: "1h",
          });

          //removes the password from the return object
          const { password, ...restOfUser } = user._doc;

          //returns auth cookie and user object for context
          res
            .cookie("token", token, { httpOnly: true })
            .status(200)
            .json(restOfUser);
        }
      });
    }
  });
};

exports.checkToken = (req, res) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  //we know the token definitely exists and is valid/verified here as its passed the withAuth check
  const { email } = jwt.decode(token);

  User.findOne({ email }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again",
      });
    } else {
      //removes the password from the return object
      const { password, ...restOfUser } = user._doc;

      //returns auth cookie and user object for context
      res.status(200).json(restOfUser);
    }
  });
};
