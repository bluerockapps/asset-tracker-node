module.exports = function(app, client, VerifyToken) {

  // Get categories
  app.get('/category/read', VerifyToken, (req, res) => {
    client.query('SELECT id, category FROM public.category '
                +'WHERE tenant_id = ($1) AND date_archived is null '
                +'ORDER BY category', [req.query.tenant_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to get categories.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Create category
  app.post('/category/create', VerifyToken, (req, res) => {
    client.query('INSERT INTO public.category(category, tenant_id, date_created, user_created) '
                +'VALUES ($1,$2,$3,$4)', 
                [req.body.category, req.body.tenant_id, new Date(), req.body.user_id], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to create category.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Update category
  app.put('/category/update', VerifyToken, (req, res) => {
    var query = 'UPDATE public.category SET category = ($1) WHERE id = ($2)'
    client.query(query, [req.body.category, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to update category.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Delete category
  app.put('/category/delete', VerifyToken, (req, res) => {
    var query = 'UPDATE public.category SET date_archived = ($1), user_archived = ($2) '
               +'WHERE id = ($3)'
    client.query(query, [new Date(), req.body.user_id, req.body.id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to delete category.');
      else
        res.status(200).send(respon.rows);
    });
  });
  
};
