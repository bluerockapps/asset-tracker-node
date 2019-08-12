module.exports = function(app, client, VerifyToken) {

  const config = require('../../config');
  
  // get company  
  app.get('/company/read', VerifyToken, (req, res) => {
    client.query('SELECT id, company_name, first_name, last_name, email, '
                +'address_street, address_city, address_prov_state, '
                +'address_country, address_postal_zip, company_image, '
                +'lat, lng, date_created, user_created '
                +'FROM public.company '
                +'WHERE tenant_id = $1', 
    [req.query.tenant_id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to get company.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Create company
  app.post('/company/create', VerifyToken, (req, res) => {
    client.query('INSERT INTO public.company(tenant_id, company_name, '
                +'first_name, last_name, email, address_street, address_city, '
                +'address_prov_state, address_country, address_postal_zip, '
                +'date_created, user_created) '
                +'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', 
                [req.body.tenant_id, req.body.company_name, req.body.first_name, 
                req.body.last_name, req.body.email, req.body.address_street, 
                req.body.address_city, req.body.address_prov_state, 
                req.body.address_country, req.body.address_postal_zip, 
                new Date(), req.body.user_id], 
    (err, respon) => {
      if (err)
        res.status(500).send('Failed to create company.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Update company
  app.put('/company/update', VerifyToken, (req, res) => {    
    var query = 'UPDATE public.company SET company_name = ($1),  '
               +'first_name = ($2), last_name = ($3), email = ($4),  '
               +'address_street = ($5), address_city = ($6),  '
               +'address_prov_state = ($7), address_country = ($8), '
               +'address_postal_zip = ($9) '
               +'WHERE id = ($10)'
    client.query(query, [req.body.company_name, req.body.first_name, req.body.last_name, 
                        req.body.email, req.body.address_street, req.body.address_city, 
                        req.body.address_prov_state, req.body.address_country, 
                        req.body.address_postal_zip, req.body.id], 
    (err, respon) => {
      if (err)
        res.status(500).send('Failed to update company.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Get branding
  app.get('/company/branding', VerifyToken, (req, res) => {
    client.query('SELECT tenant_id, company_image FROM public.company '
                +'WHERE tenant_id = $1', 
    [config.bluerockappsAPI.tenantId], (err, respon) => {
      if (err)
        res.status(500).send('Failed to get company logo.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

}