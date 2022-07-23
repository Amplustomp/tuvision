const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname + '/dist/tuvision'));
app.get('/*', function(req,res) {
res.sendFile(path.join(__dirname+
'/dist/tuvision/index.html'));});
app.listen(process.env.PORT || 8200);
