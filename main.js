const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var cors = require('cors')
require('dotenv').config();//used to store sensitive information such as API keys, database passwords
const app = express();
app.use(cors())
app.use(express.json());

app.use('/uploads', express.static('uploads'))

require('./routes/user.route')(app) // we use app here to add routes to the HTTP server object, so that incoming requests can be handled properly.
require('./routes/designation.route')(app)
require('./routes/department.route')(app)
require ('./routes/leave.route')(app)
require('./routes/leave.type.route')(app)
require('./routes/company.route')(app)


mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,//which are used to avoid some deprecation warnings
                            //.option is used to parse the MongoDB connection string using the MongoDB driver's new connection string parser.
    useUnifiedTopology: true, //option is used to enable the new Server Discovery and Monitoring engine in the MongoDB driver.
                             // This engine provides improved performance and better handling of replica sets and sharded clusters. 
  })
  .then(() => {console.log("Database is connected sucessfully")})
  .catch((err) => {console.log("error", err.message)});


const port = process.env.PORT || 7000;
app.listen(port, () => {console.log(`Server is listening on port ${port}`);});