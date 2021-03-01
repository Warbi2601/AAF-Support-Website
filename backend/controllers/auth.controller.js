const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;
  const user = new User({
    email,
    password,
    firstName,
    lastName,
    role: role || "client",
  });

  user.save(async function (err) {
    if (err) {
      console.log(err);
      if (err.errors?.email) res.status(400).send("Email already taken");
      res.status(500).send("Error registering your account, try again.");
    } else {
      // Issue token
      const payload = { email, _id: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      //save token to db and return it
      user.accessToken = token;
      await user.save();
      res
        .cookie("token", token, { httpOnly: true })
        .status(200)
        // .json({
        //   data: { email: user.email, role: user.role },
        //   accessToken
        //  })
        .send("Registered successfully");
    }
  });
};

exports.login = (req, res) => {
  // setTimeout(() => {
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
      user.isCorrectPassword(password, async function (err, same) {
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
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });

          user.accessToken = token;
          user.save();
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
  // }, 10000);
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
