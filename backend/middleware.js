const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const { checkTicketActionAccess, getActionByID } = require("./roles");

exports.withAuth = (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"] || //used in postman
    req.cookies.token;

  if (!token) {
    res.status(401).send("Unauthorized: No token provided");
  } else {
    jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
      if (err) {
        res.status(401).send("Unauthorized: Invalid token");
      } else {
        // Check if token is valid and set to locals if not
        res.locals.loggedInUser = await User.findById(decoded._id);
        next();
      }
    });
  }
};

exports.checkRoleTicketAction = async (req, res, next) => {
  try {
    const { ticket, action } = req.body;

    // request validation to ensure its a clean request
    if (!action) {
      return res.status(500).json({
        error: "No ticket action defined",
      });
    }

    //get action object from the ID
    let actionObj = getActionByID(action);

    // if the ticket action is an update then we need to check its updating the correct ticket from the ID
    if (actionObj.type === "update" && ticket._id !== req.params.id) {
      return res.status(500).json({
        error: "The ticket doesn't match the ticket you're trying to update",
      });
    }

    const user = res.locals.loggedInUser;

    // checks to see if that user can run that action
    const canRunAction = checkTicketActionAccess(user, action);

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

exports.checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = res.locals.loggedInUser;

      //check if their role matches the ones defined as having access in the roles array
      const isValid = roles.some((x) => x === user.role);

      if (!isValid) {
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
