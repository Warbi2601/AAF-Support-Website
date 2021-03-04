const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const { roles } = require("./roles");
const RolePermission = require("./models/rolePermission.model");

exports.withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        // Check if token has expired
        res.locals.loggedInUser = await User.findById(decoded._id);
        next();
      }
    });
  }
};

exports.grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      const user = res.locals.loggedInUser;
      const permission = roles.can(user.role)[action](resource);
      if (!permission.granted) {
        return res.status(403).json({
          error: "You don't have the correct permission to perform this action",
        });
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

// exports.setLocalUser = async (req, res, next) => {
//   const token =
//     req.body.token ||
//     req.query.token ||
//     req.headers["x-access-token"] ||
//     req.cookies.token;

//   if (token) {
//     try {
//       const { _id, exp } = await jwt.verify(token, process.env.JWT_SECRET);

//     } catch (error) {
//       return res.status(401).json({
//         error: "JWT token not valid, please login to obtain a new one",
//       });
//     }
//     next();
//   } else {
//     next();
//   }
// };

exports.checkRole = async (req, res, next) => {
  try {
    const { ticket, action } = req.body;

    debugger;

    // request validation to ensure its a clean request
    if (!action) {
      res.status(500).json({
        error: "No update action defined",
      });
    }

    if (ticket._id !== req.params.id) {
      res.status(500).json({
        error: "The ticket doesn't match the ticket you're trying to update",
      });
    }

    const user = res.locals.loggedInUser;

    // get list of actions that this role can perform from the db
    let permission = await RolePermission.findOne({ role: user.role });

    console.log("PERM", permission);

    let actions = permission.actions;

    let canRunAction = actions
      ? actions?.some((item) => {
          return item.order === action;
        })
      : false;

    if (!canRunAction) {
      return res.status(403).json({
        error: "You don't have the correct permission to perform this action",
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};

// module.exports = withAuth;
