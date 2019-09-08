module.exports = function(app, client, VerifyToken) {

  // Get all assets
  app.get('/asset/read', VerifyToken, (req, res) => {
    client.query('SELECT a.id, a.name, a.unit_number, a.lat, a.lng, a.date_created, '
                +'a.yard_id, c.category, s.status, c.id as category_id, m.id as image, '
                +'m.file_name, s.id as status_id FROM public.asset a '
                +'LEFT JOIN public.category c ON a.category_id = c.id '
                +'LEFT JOIN public.asset_status s ON a.status_id = s.id '
                +'LEFT JOIN public.media m ON a.category_id = m.category_id '
                +'WHERE a.tenant_id = ($1) AND a.date_archived is null',
      [req.query.tenant_id],(err, respon) => {
      if (err)
        return res.status(500).send("There was a problem getting assets.")
      else 
        res.send(respon.rows); 
    });
  });

  // Get one asset
  app.get('/asset/', VerifyToken, (req, res) => {
    client.query('SELECT name, unit_number, category_id, status_id FROM public.asset '
                +'WHERE id = ($1)',
      [req.query.id],(err, respon) => {
      if (err) {
        return res.status(500).send("There was a problem getting assets.")
    } else 
        res.send(respon.rows[0]); 
    });
  });

  // Get asset vitals
  app.get('/asset/vitals', VerifyToken, (req, res) => {
    client.query('SELECT v.id, v. purchase_date, v.capital_cost, v.maintenance_cost, '
                +'v.hours_billed, v.hours_worked, v.asset_id, v.current_address, v.nearest_city, ' 
                +'a.lat, a.lng, a.unit_number FROM public.asset_vitals v '
                +'LEFT JOIN public.asset a ON a.id = v.asset_id '
                +'WHERE asset_id = ($1)',
      [req.query.id],(err, respon) => {
      if (err)
        return res.status(500).send("There was a problem getting the assets vitals.")
      else 
        res.send(respon.rows[0]); 
    });
  });

  //Get asset by status_id

  app.get('/asset/status', VerifyToken, (req, res) => {
    client.query('SELECT a.id, a.name, a.unit_number, a.lat, a.lng, a.date_created, '
                +'a.yard_id, c.category, s.status, c.id as category_id, m.id as image, '
                +'m.file_name, s.id as status_id FROM public.asset a '
                +'LEFT JOIN public.category c ON a.category_id = c.id '
                +'LEFT JOIN public.asset_status s ON a.status_id = s.id '
                +'LEFT JOIN public.media m ON a.category_id = m.category_id '
                +'WHERE a.status_id = ($1) AND a.date_archived is null',
      [req.query.id],(err, respon) => {
      if (err)
        return res.status(500).send("There was a problem getting statuses.")
      else
        res.send(respon.rows);
    });
  });

  //Get asset by category_id
  app.get('/asset/category', VerifyToken, (req, res) => {
    client.query('SELECT a.id, a.name, a.unit_number, a.lat, a.lng, a.date_created, '
                +'a.yard_id, c.category, s.status, c.id as category_id, m.id as image, '
                +'m.file_name, s.id as status_id FROM public.asset a '
                +'LEFT JOIN public.category c ON a.category_id = c.id '
                +'LEFT JOIN public.asset_status s ON a.status_id = s.id '
                +'LEFT JOIN public.media m ON a.category_id = m.category_id '
                +'WHERE a.category_id = ($1) AND a.date_archived is null',
      [req.query.id],(err, respon) => {
      if (err)
        return res.status(500).send("There was a problem getting categories.")
      else
        res.send(respon.rows);
    });
  });

  // Get yard assets
  app.get('/asset/yard/read', VerifyToken, (req, res) => {
    client.query('SELECT a.id, a.name, a.unit_number, a.lat, a.lng, a.date_created, '
                +'c.category, s.status, c.id as category_id, m.id as image, '
                +'m.file_name, s.id as status_id, y.name as yard_name '
                +'FROM public.asset a '
                +'LEFT JOIN public.category c ON a.category_id = c.id '
                +'LEFT JOIN public.asset_status s ON a.status_id = s.id '
                +'LEFT JOIN public.media m ON a.category_id = m.category_id '
                +'LEFT JOIN public.yard y ON a.yard_id = y.id '
                +'WHERE a.tenant_id = ($1) AND a.yard_id = ($2) AND a.date_archived is null',
      [req.query.tenant_id, req.query.yard_id],(err, respon) => {
      if (err)
        return res.status(500).send("There was a problem getting yard assets.")
      else 
        res.send(respon.rows); 
    });
  });

   // Get history for one asset
   app.get('/asset/history/read/id', VerifyToken, (req, res) => {
    client.query('SELECT * FROM public.asset_log '  
                +'WHERE unit_number = ' + req.query.id,
      (err, respon) => {
      if (err) 
        return res.status(500).send("There was a problem getting the history log for this asset.") 
      else 
        res.send(respon.rows);
    });
  });

  // Get all history
  app.get('/asset/history/read', VerifyToken, (req, res) => {
    client.query('SELECT * FROM public.asset_log LIMIT ' 
                + req.query.page_size + ' OFFSET ' 
                + (req.query.page_size * req.query.page_index),
      (err, respon) => {
      if (err)
        return res.status(500).send("There was a problem getting the history log.")
      else
        res.send(respon.rows);
    });
  });

  // Create asset
  app.post('/asset/create', VerifyToken, (req, res) => {
    client.query('INSERT INTO public.asset(name, tenant_id, unit_number, '
                +'category_id, status_id, date_created, user_created) '
                +'VALUES ($1,$2,$3,$4,$5,$6,$7)', 
                [req.body.name, req.body.tenant_id, req.body.unit_number, 
                req.body.category, req.body.status, new Date(), 
                req.body.user_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to create asset.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Update asset
  app.put('/asset/update', VerifyToken, (req, res) => {
    var query = 'UPDATE public.asset SET name = ($2), unit_number = ($3), '
                +'category_id = ($4), status_id = ($5) WHERE id = ($1)'
    client.query(query, [req.body.id, req.body.name, req.body.unit_number,
                        req.body.category, req.body.status], (err, respon) => {
      if (err)
        res.status(500).send('Failed to update asset.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Delete asset
  app.put('/asset/delete', VerifyToken, (req, res) => {
    var query = 'UPDATE public.asset SET date_archived = ($1), user_archived = ($2) '
               +'WHERE id = ($3)'
    client.query(query, [new Date(), req.body.user_id, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to delete asset.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Add asset to map
  app.put('/asset/map/add', VerifyToken, (req, res) => {
    var query = 'UPDATE public.asset SET lat = ($1), lng = ($2), yard_id = ($3), status_id = ($4) '
               +'WHERE id = ($5)'
    client.query(query, [req.body.lat, req.body.lng, null, 21, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to add asset to map.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Delete asset from map
  app.put('/asset/map/delete', VerifyToken, (req, res) => {
    var query = 'UPDATE public.asset SET lat = ($1), lng = ($2), yard_id = ($3), status_id = ($4) '
               +'WHERE id = ($5)'
    client.query(query, [req.body.lat, req.body.lng, 1, 22, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to add asset to map.');
      else
        res.status(200).send(respon.rows);
    });
  });
  
};
