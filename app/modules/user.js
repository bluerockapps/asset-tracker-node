module.exports = function(app, client, VerifyToken) {

  const WriteProfile = require('../controllers/write-profile');
  const config       = require('../../config');

  // Get user by email
  app.get('/user/email', VerifyToken, (req, res) => {
    client.query('SELECT id, tenant_id, first_name, last_name, email, date_created, '
                +'role_id, profile_image '
                +'FROM public.user '
                +'WHERE email = ($1)', 
    [req.query.email], 
      (err, respon) => {
        if (err)
          res.status(500).send({ user: false, message: 'Failed to return user.' });
        else
          res.status(200).send(respon.rows[0]);
    });
  });

  // Get all users
  app.get('/user/read', VerifyToken, (req, res) => {
    client.query('SELECT u.first_name, u.last_name, u.email, u.date_created, u.status, r.role '
                +'FROM public.user u '
                +'JOIN role r ON u.role_id = r.id WHERE u.tenant_id = ($1) '
                +'AND u.id <> 1 ORDER BY u.last_name', [req.query.tenant_id], 
      (err, respon) => {
        if (err)
          res.status(500).send({ user: false, message: 'Failed to return users.' });
        else
          res.status(200).send(respon.rows);
    });
  });

  // Create user
  app.use('/user/create', VerifyToken, (req, res, next) => {
    client.query('SELECT id FROM public.user WHERE tenant_id = $1 and email = $2', 
      [req.body.bluerockappsAPI, req.body.email], (err, respon) => {
      if (err)
        return res.status(500).send("There was a problem getting user email.")
      else {
        if (respon.rows[0])
          return res.status(403).send('Email already exists.');
        else
          next();
      }
    });
  });

  app.post('/user/create', (req, res) => {
    client.query('INSERT INTO public.user(tenant_id, role_id, status, '
                +'first_name, last_name, email, date_created, user_created) '
                +'VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', 
                [req.body.tenant_id, req.body.role_id, req.body.status, 
                req.body.first_name, req.body.last_name, req.body.email, 
                new Date(), req.body.user_id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to create user.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Update user
  app.put('/user/update', VerifyToken, (req, res) => {
    var query = 'UPDATE public.user SET role_id = ($2), status = ($3), '
                +'first_name = ($4), last_name = ($5), email = ($6) '
                +'WHERE id = ($1)'
    client.query(query, [req.body.id, req.body.role.id, req.body.status, 
                        req.body.first_name, req.body.last_name, 
                        req.body.email], (err, respon) => {
      if (err)
        res.status(500).send('Failed to update user.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Delete user
  app.put('/user/delete', VerifyToken, (req, res) => {
    var query = 'UPDATE public.user SET date_archived = ($1), user_archived = ($2) '
               +'WHERE id = ($3)'
    client.query(query, [new Date(), req.body.user_id, req.body.id], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to delete user.');
        else
          res.status(200).send(respon.rows);
    });
  });

  // Update profile
  app.put('/user/profile/update', VerifyToken, WriteProfile, (req, res) => {
    var query = 'UPDATE user SET first_name = ($1), last_name = ($2) '
                +'email WHERE id = ($3)'
    client.query(query, [req.body.first_name, req.body.last_name, 
                        req.body.email], (err, respon) => {
      if (err)
        res.status(500).send('Failed to update profile.');
      else 
        res.status(200).send(respon.rows);
    });
  });
  
};
