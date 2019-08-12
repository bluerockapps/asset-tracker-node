module.exports = function(app, client, VerifyToken) {

  const config = require('../../config');
  
  // get yard
  app.get('/yard/read', VerifyToken, (req, res) => {
    client.query('SELECT id, name, email, lat, lng, address_street, address_city, '
                +'address_prov_state, address_country, address_postal_zip,  '
                +'date_created, user_created '
                +'FROM public.yard '
                +'WHERE tenant_id = $1', 
    [req.query.tenant_id], (err, respon) => {
      if (err)
        res.status(500).send('Failed to get yard.');
      else
        res.status(200).send(respon.rows[0]);
    });
  });

  // Create yard
  app.post('/yard/create', VerifyToken, (req, res) => {
    client.query('INSERT INTO public.yard(tenant_id, name, '
                +'email, lat, lng, address_street, address_city, '
                +'address_prov_state, address_country, address_postal_zip, '
                +'date_created, user_created) '
                +'VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)', 
                [req.body.tenant_id, req.body.name, req.body.email, 
                req.body.lat, req.body.lng, req.body.address_street, 
                req.body.address_city, req.body.address_prov_state, 
                req.body.address_country, req.body.address_postal_zip, 
                new Date(), req.body.user_id], 
    (err, respon) => {
      if (err)
        res.status(500).send('Failed to create yard.');
      else
        res.status(200).send(respon.rows);
    });
  });

  // Update yard
  app.put('/yard/update', VerifyToken, (req, res) => {    
    var query = 'UPDATE public.company SET name = ($1), email = ($2), '
               +'lat = ($3), lng = ($4), address_street = ($5), '
               +'address_city = ($6), address_prov_state = ($7), '
               +'address_country = ($8), address_postal_zip = ($9) '
               +'WHERE id = ($10)'
    client.query(query, [req.body.name, req.body.email, req.body.lat, req.body.lng, 
                        req.body.address_street, req.body.address_city, 
                        req.body.address_prov_state, req.body.address_country, 
                        req.body.address_postal_zip, req.body.id], 
    (err, respon) => {
      if (err)
        res.status(500).send('Failed to update yard.');
      else
        res.status(200).send(respon.rows);
    });
  });

}