const express = require('express');
const http = require('http');
const cors = require('cors');
const socketio = require('socket.io')
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');

//Socket Events
const socketEvents = require('./utils/socket'); 

//import routes
authenticateRoutes = require('./routes/authenticate');
getDataRoutes = require('./routes/getDataRoutes');
userFunctionalRoutes = require('./routes/userFunctionalRoutes');


//  CONNECT DATABASE

mongoose.connect(keys.mongoURI, { 
        useCreateIndex: true,
        useNewUrlParser: true 
      }).then(
        () => {console.log('Database is connected') },
        err => { console.log('Cannot connect to the database'+ err)}
      );

const app = express();
const server = http.createServer(app); 
const socket =  socketio(server);

//  APP CONFIG

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize())
require('./services/passport')(passport);

mySocketEvents = new socketEvents(socket).socketConfig();

//  ROUTES

app.use('/api/user', authenticateRoutes, userFunctionalRoutes); //register, login and other functional
app.use('/api/get', getDataRoutes);


if(process.env.NODE_ENV === 'production') {
  console.log('PRODUCTION')
  const path = require('path');
  //Express will server up production assets like main.js, main.css file
  app.use(express.static(path.join(__dirname, 'client/build')));
  //Express will server index.html file if it doesn't recognize the route
  app.get('*', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
}

const PORT = process.env.PORT || 5000;

//  START SERVER

server.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}.`)
});



