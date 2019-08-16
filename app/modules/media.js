module.exports = function(app, client, VerifyToken) {

  const WriteMedia   = require('../controllers/write-media');
  const WriteProfile = require('../controllers/write-profile');
  const WriteCompany = require('../controllers/write-company');

  // Get all media
  app.get('/media/read', VerifyToken, (req, res) => {
    client.query('SELECT m.id, m.file_name, m.description, m.category_id, '
                +'m.date_created, m.user_created FROM public.media m '
                +'LEFT JOIN public.user u ON m.user_created = u.id '
                +'WHERE m.tenant_id = ($1) AND m.date_archived is null '
                +'ORDER BY m.id DESC', [req.query.tenant_id], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to return media.');
        else
          res.status(200).send(respon.rows);
    });
  });

  // Create media
  app.use('/media/create', VerifyToken, WriteMedia, (req, res, next) => {
    client.query('SELECT id FROM public.media '
                +'WHERE tenant_id = ($1) AND file_name = ($2)', 
                [req.body.tenant_id, req.body.file_name], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to create media.');
        else {
          if (!respon.rows[0])
            next();
          else
            res.status(200).send(respon.rows);
        }
         
    });
  });

  app.post('/media/create', (req, res) => {
    client.query('INSERT INTO public.media(tenant_id, file_name, description, '
                +'date_created, user_created) '
                +'VALUES ($1,$2,$3,$4,$5)', 
                [req.body.tenant_id, req.body.file_name, req.body.description, 
                new Date(), req.body.user_id], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to create media.');
        else
          res.status(200).send(respon.rows);
    });
  });

  // Update media
  app.put('/media/update', VerifyToken, (req, res) => {
    var query = 'UPDATE public.media SET file_name = ($1), description = ($2), '
                +'category_id = ($3) WHERE id = ($4)'
    client.query(query, [req.body.file_name, req.body.description, 
                        req.body.category_id, req.body.id], 
      (err, respon) => {
        if (err){
          console.log(err)
          res.status(500).send('Failed to update status.');
        }
          
        else
          res.status(200).send(respon.rows);
    });
  });

  // Delete media
  app.put('/media/delete', VerifyToken, (req, res) => {
    var query = 'UPDATE public.media SET date_archived = ($1), user_archived = ($2) '
               +'WHERE id = ($3)'
    client.query(query, [new Date(), req.body.user_id, req.body.id], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to delete status.');
        else
          res.status(200).send(respon.rows);
    });
  });

  // Save profile image
  app.use('/media/profile', VerifyToken, WriteProfile, (req, res) => {
    var file_ext = req.body.file_name.split('.').pop();
    var query = 'UPDATE public.user SET profile_image = ($1) WHERE id = ($2)'
    client.query(query, ['profile-'+req.body.id+'.'+file_ext, req.body.id], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to save profile image.');
        else
          res.status(200).send(respon.rows);
    });
  });

  // Save company image
  app.use('/media/company', VerifyToken, WriteCompany, (req, res, next) => {
    var file_ext = req.body.file_name.split('.').pop();
    var query = 'UPDATE public.company SET company_image = ($1) WHERE id = ($2)'
    client.query(query, ['company-'+req.body.id+'.'+file_ext, req.body.id], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to save company image.');
        else
          res.status(200).send(respon.rows);
    });
  });
  
};
