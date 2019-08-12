const VerifyToken = require('../controllers/verify-token');

const auth       = require('../modules/auth.js');
const user       = require('../modules/user.js');
const asset      = require('../modules/asset.js');
const category   = require('../modules/category.js');
const company    = require('../modules/company.js');
const permission = require('../modules/permission.js');
const security   = require('../modules/security.js');
const role       = require('../modules/role.js');
const yard       = require('../modules/yard.js');
const status     = require('../modules/status.js');
const media      = require('../modules/media.js');
// const xeroapi    = require('../modules/api/xero-api.js');
// const stripeapi  = require('../modules/api/stripe-api.js');

module.exports = function(app, pg, bluerockappsAPI) {
  auth       (app, pg, bluerockappsAPI, VerifyToken);
  asset      (app, pg, VerifyToken);
  user       (app, pg, VerifyToken);
  category   (app, pg, VerifyToken);
  company    (app, pg, VerifyToken);
  permission (app, pg, VerifyToken);
  security   (app, pg, VerifyToken);
  role       (app, pg, VerifyToken);
  yard       (app, pg, VerifyToken);
  status     (app, pg, VerifyToken);
  media      (app, pg, VerifyToken);
  // stripeapi   (app, db, stripe);
  // xeroapi     (app, db, xero);
};