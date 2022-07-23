const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/tuvision'));
app.get('/*', function(req,res) {
res.sendFile(res.sendFile('index.html', {root: 'dist/tuvision/'}));});
app.listen(process.env.PORT || 8200);

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
      return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}
app.use(requireHTTPS);
app.use(express.static('./dist/tuvision'));
