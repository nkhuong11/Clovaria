const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');

const keys = require('./config/keys');
require('./models/User');

//import routes
authenticateRoutes = require('./routes/authenticate');

//passport.use(new GoogleStrategy());
mongoose.connect(keys.mongoURI, { useNewUrlParser: true }).then(
  () => {console.log('Database is connected') },
  err => { console.log('Cannot connect to the database'+ err)}
);

let schema = buildSchema(`
    type User {
        id : String!
        nickname : String!
        avatar : String!
    }

    type Post {
        id: String!
        user: User!
        caption : String!
        image : String!
    }

    type Query{
        user(id: String) : User!
        post(user_id: String, post_id: String) : Post!
        posts(user_id: String) : [Post]
    }
`);


let userslist = {
    a: {
      id: "a",
      nickname: "Chris",
      avatar: "https://www.laravelnigeria.com/img/chris.jpg"
    },
  };

let postslist = {
    a: {
        a: {
        id: "a",
        user: userslist["a"],
        caption: "Moving the community!",
        image: "https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg"
        },
        b: {
        id: "b",
        user: userslist["a"],
        caption: "Angular Book :)",
        image:
            "https://cdn-images-1.medium.com/max/1000/1*ltLfTw87lE-Dqt-BKNdj1A.jpeg"
        },
        c: {
        id: "c",
        user: userslist["a"],
        caption: "Me at Frontstack.io",
        image: "https://pbs.twimg.com/media/DNNhrp6W0AAbk7Y.jpg:large"
        },
        d: {
        id: "d",
        user: userslist["a"],
        caption: "Moving the community!",
        image: "https://pbs.twimg.com/media/DOXI0IEXkAAkokm.jpg"
        }
    }
};



let root = {
    user: function({ id }) {
      return userslist[id];
    },
    post: function({ user_id , post_id }) {
      return postslist[user_id][post_id];
    },
    posts: function({ user_id }){
      return Object.values(postslist[user_id]);
    }
  };

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(passport.initialize())
require('./services/passport')(passport);
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

//Routes
app.use('/api/users', authenticateRoutes); //register and login

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}.`)
});