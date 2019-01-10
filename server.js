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
uploadRoutes = require('./routes/uploadRoutes');
getDataRoutes = require('./routes/getDataRoutes');
userFunctionalRoutes = require('./routes/userFunctionalRoutes');


// class Server {
//   constructor() {
//     this.port = process.env.PORT || 5000;
//     this.host = 'localhost';

//     this.app = express();
//     this.server = http.createServer(this.app);
//     this.socket = socketio(this.server);
//   }

//   appConnectDB() {
//     mongoose.connect(keys.mongoURI, { 
//       useCreateIndex: true,
//       useNewUrlParser: true 
//     }).then(
//       () => {console.log('Database is connected') },
//       err => { console.log('Cannot connect to the database'+ err)}
//     );
//   }

//   appConfig() {
//     this.app.use(cors());
//     this.app.use(bodyParser.urlencoded({ extended: false }));
//     this.app.use(bodyParser.json());
//     this.app.use(passport.initialize())
//     require('./services/passport')(passport);
//     new socketEvents(this.socket).socketConfig();
//   }

//   includeRoutes(){
//     this.app.use('/api/user', authenticateRoutes, userFunctionalRoutes); //register, login and other functional
//     this.app.use('/api/upload', uploadRoutes);
//     this.app.use('/api/get', getDataRoutes);
//   }

//   appExecute(){
//     this.appConfig();
//     this.appConnectDB()
//     this.includeRoutes();

//     if(process.env.NODE_ENV === 'production') {
//       console.log('PRODUCTION')
//       const path = require('path');
//       //Express will server up production assets like main.js, main.css file
//       this.app.use(express.static(path.join(__dirname, 'client/build')));
//       //Express will server index.html file if it doesn't recognize the route
//       this.app.get('*', (req, res) => {
//         //res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//         res.sendFile(path.join(__dirname+'/client/build/index.html'));
//       });
//     }

//     this.server.listen(this.port, () => {
//         console.log(`Server started on http://${this.host}:${this.port}`);
//     });
//   }
// }

// const app = new Server();
// app.appExecute();


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
app.use('/api/upload', uploadRoutes);
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



