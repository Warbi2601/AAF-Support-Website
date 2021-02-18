var express = require("express");
var router = express.Router();

//Require controller
var animalController = require("../controllers/animal.controller");

const animalSchema = require("../models/animal.model");

router.route("/create-animal").post((req, res, next) => {
  animalSchema.create(req.body, (error, data) => {
    if (error) {
      return next(error);
    } else {
      console.log("New Animal Data --> ", data);
      res.json(data);
    }
  });
});

// router.get("/", function (req, res, next) {
//   res.json({ message: "Welcome to the petshop api." });
// });

// // Create a new pet
// router.post("/pets/", animalController.create);

// Retrieve all animals
// router.get("/pets/", animalController.findAll);
router.get("/animal-list", function (req, res) {
  animalSchema.find({}).then(function (animals) {
    res.send(animals);
  });
});

// // Retrieve a single pet with id
// router.get("/pets/:id", animalController.findOne);

// // Update a pet with id
// router.put("/pets/:id", animalController.update);

// // Delete a pet with id
// router.delete("/pets/:id", animalController.delete);
router.delete("/delete-animal/:id", function (req, res) {
  animalSchema.deleteOne({ _id: req.params.id }).then(function (error) {
    res.send(error);
  });
});

// // Delete all animals of the database
// router.delete("/pets/", animalController.deleteAll);

module.exports = router;
