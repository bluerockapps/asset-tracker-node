const fs        = require('fs');
const base64Img = require('base64-img');
const thumb     = require('node-thumbnail').thumb;

function createDir(req) {
  if (!fs.existsSync('assets/images/'+req.body.tenant_id+'/'))
    fs.mkdirSync('assets/images/'+req.body.tenant_id+'/');
}

function createThumb(filepath, path, width) {
  thumb({source: filepath, destination: path, width: width, quiet: true}, 
    function(err) {
      if (err)
        return err;
      else
        return;
  });
}

function writeMedia(req, res, next) {
  createDir(req);
  
  base64Img.img(req.body.content, 'assets/images/'+req.body.tenant_id+'/', 
                req.body.file_name.replace(/\.[^/.]+$/, ""), 
    function(err, filepath) {
      if (err)
        return res.status(500).send('Failed to write file.');
      else {
        createThumb(filepath, 'assets/images/'+req.body.tenant_id+'/', 40);
        if (err)
          return res.status(500).send('Failed to write file.');
        else
          next();
      } 
  });
}

module.exports = writeMedia;