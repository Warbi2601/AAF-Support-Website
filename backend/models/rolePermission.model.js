const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rolePermissionSchema = new Schema(
  {
    role: {
      type: String,
      required: true,
    },
    actions: {
      type: [Schema.Types.Mixed],
      required: true,
    },
  },
  {
    collection: "rolePermissions",
  }
);

module.exports = mongoose.model("RolePermission", rolePermissionSchema);
