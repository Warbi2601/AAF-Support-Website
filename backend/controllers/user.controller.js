const User = require("../models/user.model");

exports.getUser = (req, res) => {
  let id = req.params.id;
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
      res.status(500).send({
        message: err.message || "An error occurred while retrieving Users.",
      });
    });
};

exports.deleteUser = (req, res) => {
  let userID = req.params.id;
  User.deleteOne({ _id: userID }, function (err) {
    if (err)
      res.status(500).json({
        error: "Error deleting the user",
      });
    res.status(200).json({
      success: "User successfully deleted",
    });
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
        if (password) user.password = password;
        if (role) user.role = role;

        user.save();

        res.status(200).json({
          success: "User updated",
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
