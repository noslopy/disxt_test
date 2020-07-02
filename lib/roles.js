const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
  ac.grant("client")
  .readAny("product")
  
  ac.grant("admin")
  .extend("client")
  .createOwn("product")
  .updateAny("product")
  .deleteAny("product")
  
  return ac;
})();