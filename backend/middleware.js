const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const { checkTicketActionAccess, getActionByID } = require("./roles");

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

exports.checkRole = async (req, res, next) => {
  try {
    const { ticket, action } = req.body;

    // request validation to ensure its a clean request
    if (!action) {
      res.status(500).json({
        error: "No ticket action defined",
      });
    }

    let actionObj = getActionByID(action);

    // if the ticket action is an update then we need to check its updating the correct ticket from the ID
    if (actionObj.type === "update" && ticket._id !== req.params.id) {
      res.status(500).json({
        error: "The ticket doesn't match the ticket you're trying to update",
      });
    }

    const user = res.locals.loggedInUser;

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
