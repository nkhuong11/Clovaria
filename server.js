const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');

//import routes
authenticateRoutes = require('./routes/authenticate');
uploadRoutes = require('./routes/uploadRoutes');
getDataRoutes = require('./routes/getDataRoutes');
userFunctionalRoutes = require('./routes/userFunctionalRoutes');
//passport.use(new GoogleStrategy());
mongoose.connect(keys.mongoURI, { 
        useCreateIndex: true,
        useNewUrlParser: true 
      }).then(
        () => {console.log('Database is connected') },
        err => { console.log('Cannot connect to the database'+ err)}
      );

const app = express();
const server = require('http').createServer(app); 
const io = module.exports.io =  require('socket.io')(server);
const SocketManager = require('./socketManager');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize())
require('./services/passport')(passport);

//Routes
app.use('/api/users', authenticateRoutes, userFunctionalRoutes); //register, login and other functional
app.use('/api/upload', uploadRoutes);
app.use('/api/get', getDataRoutes);

if(process.env.NODE_ENV === 'production') {
  const path = require('path');
  //Express will server up production assets like main.js, main.css file
  app.use(express.static(path.join(__dirname, 'client/build')));
  //Express will server index.html file if it doesn't recognize the route
  app.get('*', (req, res) => {
    //res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
  });
}

//Socket
io.on('connection', SocketManager );

// io.on('connection', function(socket){
//   console.log(socket.id + ': connected');
//   socket.emit('id', socket.id);

//   socket.on('disconnect', function(){
//     console.log(socket.id + ': disconnected')
//   })

//   socket.on('newMessage', data => {
//     io.sockets.emit('newMessage', {data: data, id: socket.id});
//     console.log(data);
//   })

// });


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}.`)
});



