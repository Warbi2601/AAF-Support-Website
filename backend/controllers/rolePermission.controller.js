const RolePermission = require("../models/rolePermission.model");

exports.getPermissionForRole = (req, res) => {
  const user = res.locals.loggedInUser;

  RolePermission.findOne({ role: user.role }, function (err, rolePermission) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error getting permissions please try again",
      });
    } else {
      res.status(200).json(rolePermission.actions);
    }
  });
};
