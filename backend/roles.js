const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function () {
  ac.grant("client") // normal user
    .readOwn("ticket")
    .updateOwn("ticket")
    .createOwn("ticket");

  ac.grant("support")
    .extend("client") // maybe shouldnt extend client?
    .readAny("ticket")
    .createAny("ticket");

  ac.grant("admin")
    // .extend("client") // maybe shouldnt extend client?
    .extend("support")
    .updateAny("ticket")
    .deleteAny("ticket");

  return ac;
})();
