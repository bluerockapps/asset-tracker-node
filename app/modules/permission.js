module.exports = function(app, client, VerifyToken) {

// Get user permissions
  app.get('/permission/read', VerifyToken, (req, res) => {
    client.query('SELECT id, role_id, asset_create, asset_read, asset_update, '
                +'asset_delete, asset_log_read, category_create, category_read, '
                +'category_update, category_delete, company_read, company_update, '
                +'media_create, media_read, media_update, media_delete, '
                +'permission_read, permission_update, role_create, role_read, '
                +'role_update, role_delete, status_create, status_read, '
                +'status_update, status_delete, user_create, user_read, '
                +'user_update, user_delete, date_created, user_created, ' 
                +'asset_map_update, asset_map_read ' 
                +'FROM public.permission '
                +'WHERE tenant_id = ($1) AND role_id = ($2)',
    [req.query.tenant_id, req.query.role_id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to return permissions.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

// Update permissions
  app.put('/permission/update', VerifyToken, (req, res) => {    
    var query = 'UPDATE public.permission SET asset_create = ($3), '
                +'asset_read = ($4), asset_update = ($5), asset_delete = ($6), '
                +'asset_log_read = ($7), category_create = ($8), '
                +'category_read = ($9), category_update = ($10), category_delete = ($11), '
                +'company_read = ($12), company_update = ($13), media_create = ($14), '
                +'media_read = ($15), media_update = ($16), media_delete = ($17), '
                +'permission_read = ($18), permission_update = ($19),'
                +'role_create = ($20), role_read = ($21), role_update = ($22),'
                +'role_delete = ($23), status_create = ($24), status_read = ($25),'
                +'status_update = ($26), status_delete = ($27), user_create = ($28),'
                +'user_read = ($29), user_update = ($30), user_delete = ($31),'
                +'date_created = ($32), user_created = ($33), '
                +'asset_map_update = ($34), asset_map_read =($35) WHERE tenant_id = ($1) '
                +'AND role_id = ($2)'
    client.query(query, [req.body.tenant_id, req.body.role_id, req.body.asset_create, req.body.asset_read,
                        req.body.asset_update, req.body.asset_delete, req.body.asset_log_read,
                        req.body.category_create, req.body.category_read,
                        req.body.category_update, req.body.category_delete, req.body.company_read,
                        req.body.company_update, req.body.media_create, req.body.media_read,
                        req.body.media_update, req.body.media_delete, 
                        req.body.permission_read, req.body.permission_update, req.body.role_create, 
                        req.body.role_read, req.body.role_update, req.body.role_delete, 
                        req.body.status_create, req.body.status_read, req.body.status_update, 
                        req.body.status_delete,req.body.user_create, req.body.user_read, 
                        req.body.user_update, req.body.user_delete, req.body.date_created, 
                        req.body.user_created, req.body.asset_map_update, req.body.asset_map_read], 
      (err, respon) => {
        if (err)
          res.status(500).send('Failed to update permissions.');
        else
          res.status(200).send({message: 'Permissions updated.'});
    });
  });

  // Create role
  app.post('/permission/create', VerifyToken, (req, res) => {
    client.query('INSERT INTO public.permission(tenant_id, role_id, asset_create, '
                +'asset_read, asset_update, asset_delete, asset_log_read '
                +'category_create, category_read, category_update, category_delete, '
                +'company_read, company_update, media_create, media_update, '
                +'media_read, media_delete, permission_read, permission_update, '
                +'role_create, role_read, role_update, role_delete, status_create, '
                +'status_read, status_update, status_delete, user_create, user_read, '
                +'user_update, user_delete, date_created, user_created, asset_map_update, asset_map_read) '
                +'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,'
                +'$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35)', 
                [req.body.tenant_id, req.body.role_id, req.body.asset_create, 
                req.body.asset_read, req.body.asset_update, req.body.asset_delete, 
                req.body.asset_log_read, req.body.category_create, 
                req.body.category_read, req.body.category_update, req.body.category_delete, 
                req.body.company_read, req.body.company_update, req.body.media_create, 
                req.body.media_update, req.body.media_read, req.body.media_delete, 
                req.body.permission_read, req.body.permission_update, 
                req.body.role_create, req.body.role_read, req.body.role_update, 
                req.body.role_delete, req.body.status_create, req.body.status_read, 
                req.body.status_update, req.body.status_delete, req.body.user_create, 
                req.body.user_read, req.body.user_update, req.body.user_delete, new Date(), 
                req.body.user_id, req.body.asset_map_update, req.body.asset_map_read], 
      (err, respon) => {
      if (err)
        res.status(500).send('Failed to create permissions.');
      else
        res.status(200).send({message: 'Permissions created.'});
    });
  });

}