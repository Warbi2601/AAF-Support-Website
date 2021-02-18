const db = require("../models");
const Animal = db.animals;

// Create and Save a new Animal
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Content can not be empty!" });
    return;
  }

  // Create a Animal model object
  const animal = new Animal({
    name: req.body.name,
    species: req.body.species,
    breed: req.body.breed,
    age: req.body.age,
    colour: req.body.colour,
  });

  // Save Animal in the database
  animal
    .save()
    .then((data) => {
      console.log("Animal saved in the database: " + data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Animal.",
      });
    });
};

// Retrieve all Animals from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  //We use req.query.name to get query string from the Request and consider it as condition for findAll() method.
  var condition = name
    ? { name: { $regex: new RegExp(name), $options: "i" } }
    : {};
  Animal.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Animals.",
      });
    });
};

// Find a single Animal with an id
exports.findOne = (req, res) => {};

// Update a Animal by the id in the request
exports.update = (req, res) => {};

// Delete a Animal with the specified id in the request
exports.delete = (req, res) => {};

// Delete all Animal from the database.
exports.deleteAll = (req, res) => {};
