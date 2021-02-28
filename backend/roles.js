const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("user").readOwn("ticket").updateOwn("ticket").createOwn("ticket");

  ac.grant("agent").extend("user").readAny("ticket").createAny("ticket"); // maybe shouldnt extend user?

  ac.grant("admin")
    .extend("user") // maybe shouldnt extend user?
    .extend("agent")
    .updateAny("ticket")
    .deleteAny("ticket");

  return ac;
})();
