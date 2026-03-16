function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next(); // user is logged in
    }
  
    res.redirect('/login'); // not logged in
  }
  
  module.exports = { isAuthenticated };
  