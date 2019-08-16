module.exports = function(app, client, bluerockappsAPI, VerifyToken) {
  
  const jwt    = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');

  app.get('/auth', VerifyToken, function(req, res) {

    var token = req.headers['x-access-token'];
  
    if (!token) 
      return res.status(401).send('No token provided.');
    
    jwt.verify(token, bluerockappsAPI.consumerSecret, function(err, decoded) {
      if (err) 
        return res.status(500).send('Failed to authenticate token.');
      
      res.status(200).send(decoded);
    });
  });
  
  app.post('/login', function(req, res) {
    client.query('SELECT id, tenant_id, role_id, password FROM public.user WHERE email = $1', 
    [req.body.email], (err, respon) => {
      if (err) 
        return res.status(500).send('Error on the server.');
      if (!respon.rows[0]) 
        return res.status(404).send('No user found.');
      
      var passwordIsValid = bcrypt.compareSync(req.body.password, respon.rows[0].password);
      if (!passwordIsValid) 
        return res.status(401).send('Failed to authenticate.');
  
      var token = jwt.sign({ id: respon.rows[0].id }, bluerockappsAPI.consumerSecret, {
        expiresIn: 86400
      });
      
      res.status(200).send({ auth: true, token: token, user: respon.rows[0] });
    });
  });

  app.use('/register', function(req, res, next) {
    client.query('SELECT id FROM public.user WHERE email = $1', 
      [req.body.email], (err, respon) => {
      if (err)
        return res.status(500).send("There was a problem registering the user.")
      else {
        if (respon.rows[0])
          return res.status(403).send('Email already registered.');
        else
          next();
      }
    });
  });

  app.post('/register', function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    client.query('INSERT INTO public.user(tenant_id, role_id, first_name, last_name, password, '
                +'email, date_created, user_created) '
                +'VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning id', 
                [bluerockappsAPI.tenantId, 2, req.body.firstName, req.body.lastName, 
                hashedPassword, req.body.email, new Date(), 1], (err, respon) => {
      if (err)
        return res.status(500).send("There was a problem registering the user.")
      else {
        var token = jwt.sign({ id: respon.rows[0].id }, bluerockappsAPI.consumerSecret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
      }
    });
  });

  app.use('/verify', function(req, res, next) {
    client.query('SELECT id FROM public.user WHERE email = $1 AND status = $2', 
      [req.body.email, 'InActive'], (err, respon) => {
      if (err)
        return res.status(500).send("There was a problem verfifing the user.")
      else {
        if (!respon.rows[0])
          return res.status(403).send('Email already verified.');
        else
          next();
      }
    });
  });

  app.post('/verify', function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    var query = 'UPDATE public.user SET role_id = ($1), status = ($2), '
                +'password = ($3) '
                +'WHERE email = ($4) returning id' 
      client.query(query, [2, 'Active', hashedPassword, req.body.email], 
        (err, respon) => {
        if (err)
          return res.status(500).send("There was a problem verifing the user.")
        else {
          var token = jwt.sign({ id: respon.rows[0].id }, bluerockappsAPI.consumerSecret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ auth: true, token: token });
        }
    });
  });

}