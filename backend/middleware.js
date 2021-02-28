const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const { roles } = require("./roles");

exports.withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  console.log("Cookies", req.cookies);

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        req.email = decoded.email;
        req.userID = decoded._id;
        next();
      }
    });
  }
};

exports.grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      debugger;
      const user = res.locals.loggedInUser;
      const permission = roles.can(user.role)[action](resource);
      if (!permission.granted) {
        return res.status(401).json({
          error: "You don't have the correct permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

exports.setLocalUser = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (token) {
    const { _id, exp } = await jwt.verify(token, process.env.JWT_SECRET);
    // Check if token has expired
    if (exp < Date.now().valueOf() / 1000) {
      return res.status(401).json({
        error: "JWT token has expired, please login to obtain a new one",
      });
    }
    res.locals.loggedInUser = await User.findById(_id);
    next();
  } else {
    next();
  }
};

// module.exports = withAuth;
