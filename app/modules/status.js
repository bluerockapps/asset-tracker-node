module.exports = function(app, client, VerifyToken) {

  // Get all statuses
  app.get('/status/read', VerifyToken, (req, res) => {
    client.query('SELECT id, status FROM public.asset_status '
                +'WHERE tenant_id = ($1) AND date_archived is null '
                +'ORDER BY status', [req.query.tenant_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to return statuses.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Create status
  app.post('/status/create', VerifyToken, (req, res) => {
    client.query('INSERT INTO public.asset_status(status, tenant_id, date_created, user_created) '
                +'VALUES ($1,$2,$3,$4)', 
                [req.body.status, req.body.tenant_id, new Date(), req.body.user_id], 
      (err, respon) => {
      if (err){
        console.log(err)
        res.status(500).send('Failed to create status.');
      }
        
      else
        res.status(200).send(respon.rows);
    });
  });

  // Update status
  app.put('/status/update', VerifyToken, (req, res) => {
    var query = 'UPDATE public.asset_status SET status = ($1) WHERE id = ($2)'
    client.query(query, [req.body.status, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to update status.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Delete status
  app.put('/status/delete', VerifyToken, (req, res) => {
    var query = 'UPDATE public.asset_status SET date_archived = ($1), user_archived = ($2) '
               +'WHERE id = ($3)'
    client.query(query, [new Date(), req.body.user_id, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to delete status.');
      else
        res.status(200).send(respon.rows);
    });
  });
  
};
