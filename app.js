
const routes = require('./routes/routes');
const cors = require('cors');
var express = require('express');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(cors());
app.listen( process.env.PORT || 3000, () => {
  console.log('Server running on port : ' + process.env.PORT);
});
module.exports = app;