const path      = require('path');
const fs        = require('fs');
const base64Img = require('base64-img');

function createDir(req) {
  if (!fs.existsSync('assets/profiles/'+req.body.tenant_id+'/'))
    fs.mkdirSync('assets/profiles/'+req.body.tenant_id+'/');
}

function writeCompany(req, res, next) {
  createDir(req);

  base64Img.img(req.body.content, 'assets/profiles/'+req.body.tenant_id+'/',
               'company-'+req.body.id.toString(),
  function(err, filepath) {
    if (err) 
      return res.status(500).send('Failed to write file.');
    else
      next();
  });
}

module.exports = writeCompany;