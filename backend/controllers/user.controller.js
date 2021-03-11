const User = require("../models/user.model");

exports.getUser = (req, res) => {
  let id = req.params.id;

  const user = res.locals.loggedInUser;

  // make it so a client can only hit this endpoint if they are getting info about themseleves
  if (user.role === "client" && id !== user._id) {
    return res.status(403).json({
      error: "You don't have the correct permission to perform this action",
    });
  }

  User.findOne({ _id: id }, function (err, user) {
    if (err) {
      console.error(err);
      res.status(500).json({
        error: "Internal error please try again",
      });
    } else {
      res.status(200).json(user);
    }
  })
    .populate("loggedBy")
    .populate("loggedFor")
    .populate("assignedTo");
};

exports.getAllUsers = (req, res) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).json({
        error: err.message || "An error occurred while retrieving Users.",
      });
    });
};

exports.deleteUser = (req, res) => {
  let userID = req.params.id;
  User.deleteOne({ _id: userID }, function (err) {
    if (err) {
      res.status(500).json({
        error: "Error deleting the user",
      });
    } else {
      res.status(200).json({
        success: "User successfully deleted",
      });
    }
  });
};

exports.updateUser = async (req, res) => {
  try {
    const userID = req.params.id;

    const { password, role } = req.body;

    User.findOne({ _id: userID }, function (err, user) {
      if (err) {
        console.error(err);
        res.status(500).json({
          error: "Internal error please try again",
        });
      } else {
        // build up the success message to be clear on what has been updated
        let successMsg = "";
        if (password) {
          user.password = password;
          successMsg = "Password updated";
        }
        if (role) {
          user.role = role;
          successMsg = "Role updated";
        }
        if (password && role) successMsg = "Password and role updated";

        user.save();

        res.status(200).json({
          success: successMsg,
        });
      }
    });

    // const updatedUser = await User.findOneAndUpdate(
    //   { _id: userID }, // find filter
    //   propsToUpdate, // new props
    //   // If `new` isn't true, `findOneAndUpdate()` will return the
    //   // document as it was _before_ it was updated.
    //   { new: true }
    // );

    // // If the function returns null then it didnt update
    // if (!updatedUser)
    //   res.status(500).json({
    //     error: "Something went wrong when updating the user",
    //   });

    // res.status(200).json({
    //   success: "User updated",
    // });
  } catch (err) {
    res.status(500).json({
      error: "Something went wrong when updating the user",
    });
  }
};
