const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user").readOwn("profile").updateOwn("profile");

  ac.grant("agent").extend("user").readAny("profile"); // maybe shouldnt extend user?

  ac.grant("admin")
    .extend("user") // maybe shouldnt extend user?
    .extend("agent")
    .updateAny("profile")
    .deleteAny("profile");

  return ac;
})();
