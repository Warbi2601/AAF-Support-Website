const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let animalSchema = new Schema(
  {
    name: {
      type: String,
    },
    species: {
      type: String,
    },
    breed: {
      type: String,
    },
    age: {
      type: Number,
    },
    colour: {
      type: String,
    },
  },
  {
    collection: "animals",
  }
);

module.exports = mongoose.model("Animal", animalSchema);

// module.exports = (mongoose) => {
//   var Animal = mongoose.model(
//     "animal",
//     mongoose.Schema({
//       name: String,
//       species: String,
//       breed: String,
//       age: Number,
//       colour: String,
//     })
//   );
//   return Animal;
// };
