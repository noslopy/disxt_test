const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = (function() {
ac.grant("client")
 .readOwn("profile")
 .updateOwn("profile")
 
ac.grant("admin")
 .extend("client")
 .readAny("profile")

return ac;
})();