module.exports = function(app, client, VerifyToken) {

  // Get navigation security
  app.get('/security/navigation', VerifyToken, (req, res) => {
    client.query('SELECT asset_read, asset_log_read, company_read, '
                +'category_read, permission_read, role_read, '
                +'status_read, user_read, media_read '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get asset map security
  app.get('/security/asset/map', VerifyToken, (req, res) => {
    console.log(req.query)
    client.query('SELECT asset_map_update, asset_map_read '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err) {
        console.log(err)
        res.status(500).send('Failed to return security roles.') }
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get asset security
  app.get('/security/asset', VerifyToken, (req, res) => {
    client.query('SELECT asset_create, asset_update, asset_delete '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get company security
  app.get('/security/company', VerifyToken, (req, res) => {
    client.query('SELECT company_update '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get media security
  app.get('/security/media', VerifyToken, (req, res) => {
    client.query('SELECT media_create, media_update, media_delete '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get category security
  app.get('/security/category', VerifyToken, (req, res) => {
    client.query('SELECT category_create, category_update, category_delete '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get category security
  app.get('/security/status', VerifyToken, (req, res) => {
    client.query('SELECT status_create, status_update, status_delete '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get setings security
  app.get('/security/settings', VerifyToken, (req, res) => {
    client.query('SELECT category_create, category_read, category_update, category_delete '
                +'company_read, company_update, permission_read, permission_update, '
                +'role_create, role_read, role_update, role_delete, status_create, '
                +'status_read, status_update, status_delete '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get user security
  app.get('/security/user', VerifyToken, (req, res) => {
    client.query('SELECT user_create, user_update, user_delete '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get role security
  app.get('/security/role', VerifyToken, (req, res) => {
    client.query('SELECT role_create, role_update, role_delete '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Get permission security
  app.get('/security/permission', VerifyToken, (req, res) => {
    client.query('SELECT role_update '
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)', 
                [req.query.tenant_id, req.query.role_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return security roles.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

}