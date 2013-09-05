var get = {};

// Route /, test home page
get['/'] = function (req, res) {
  // Add some info to content
  req.content.version = process.version;
  req.content.envmode = process.env.NODE_ENV;

  res.set('Content-Type', 'text/html');
  res.render('page/home', req.content);
};

// Route /404, test 404 page
get['/404'] = function (req, res, next) {
  next();
};

// Route /403, test custom error
get['/403'] = function(req, res, next) {
  var err = new Error('Not allowed!');
  err.status = 403;
  next(err);
};

// Route /500, test base error 
get['/500'] = function (req, res, next) {
  next(new Error('Cat vs Keyboard!'));
};

exports.route = function(serv) {
  for (var r in get) {
    serv.get(r, get[r]);
  }
};
