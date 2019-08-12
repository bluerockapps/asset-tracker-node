module.exports = function(app, client, VerifyToken) {

  // Get roles
  app.get('/role/read', VerifyToken, (req, res) => {
    client.query('SELECT id, role, date_created, user_created FROM public.role '
                +'WHERE tenant_id = ($1) AND date_archived is null '
                +'ORDER BY role', [req.query.tenant_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return roles.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Create role
  app.post('/role/create', VerifyToken, (req, res) => {
    client.query('INSERT INTO public.role(role, tenant_id, date_created, user_created) '
                +'VALUES ($1,$2,$3,$4)', 
                [req.body.role, req.body.tenant_id, new Date(), req.body.user_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to create role.');
      else
        res.status(200).send({message: 'Role created.'});
    });
  });

  // Update role
  app.put('/role/update', VerifyToken, (req, res) => {
    var query = 'UPDATE public.role SET role = ($1) WHERE id = ($2)'
    client.query(query, [req.body.role, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to update role.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Delete role
  app.use('/role/delete', VerifyToken, (req, res, next) => {
    var query = 'UPDATE public.role SET date_archived = ($1), user_archive = ($2) '
                +'WHERE id = ($3)'
    client.query(query, [new Date(), req.body.user_id, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to delete role.');
      else
        next();
    });
  });

  app.put('/role/delete', (req, res) => {
    var query = 'UPDATE public.permission SET date_archived = ($1), user_archived = ($2) '
                +'WHERE role_id = ($3)'
    client.query(query, [new Date(), req.body.user_id, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to delete permissions.');
      else
        res.status(200).send(respon.rows);
    });
  });

}