if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://general:Bs6Lfell6HuhOB09@tjdatclassroomresponse.s9cp2sx.mongodb.net/tjdat?retryWrites=true&w=majority";

const PORT = process.env.PORT || 3000;

const routes = require('./routes/routes.js');

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

let collection;
async function run() {
    try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
      collection = client.db("tjdat").collection("tjdat");
    } finally {
      // Ensures that the client will close when you finish/error
    }
  }
run().catch(console.dir);

const initializePassport = require('./passport-config')
initializePassport(passport, 
    email => collection.findOne({ email: email }),
    id => collection.findOne({ id: id })
)

app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
app.use('/', routes);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', checkAuthenticated, async (req, res) => {
    
    //console.log("Session:", req.session.passport.user);
    user = await collection.findOne({ id: req.session.passport.user });
    //console.log('User:', user); 
    res.render('index.ejs', {
      id: user.id,
      name: user.name,
      role: user.isTeacher,
      classList: user.classList
    });
})

app.get('student-class')
{
  //find class that student is in and inputed, pass in the class info
  res.render('student-class.ejs', {questions: })
}

app.post('/', checkAuthenticated, async (req, res, next) => {
    
});

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

app.post('/login', checkNotAuthenticated, async (req, res, next) => {
    console.log('login route called');
    try {
      const user = await collection.findOne({ email: req.body.email });
      if (!user) {
        return res.redirect('/login');
      }
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (passwordMatch) {
        req.login({ id: user.id, name: user.name, email: user.email, role: user.isTeacher }, (err) => {
          if (err) {
            console.log('Error:', err);
            return next(err);
          }
            console.log('User:', user);
            //res.redirect(`/?id=${user.id}&name=${user.name}&role=${user.isTeacher}&classList=${user.classList}`);
            res.redirect('/');
      });
      } else {
        return res.redirect('/login');
      }
    } catch (err) {
      console.log('Error:', err);
      return next(err);
    }
});

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

app.post('/register', checkNotAuthenticated, async (req, res) => {
    console.log('register route called');
    try 
    {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        console.log('hashedPassword:', hashedPassword);
        trole = false;
        if (req.body.role === "true")
        {
          trole = true;
        }
        //Push to database
        await collection.insertOne(
          {
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            classList: [],
            isTeacher: trole
          });
        res.redirect('/login');
    } catch (err) {
        console.log('error:', err);
        res.redirect('/register');
    }
});

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

app.delete('/logout', (req, res) => {
    req.logOut((err) => {
        if(err) {
            return next(err)
        }
        res.redirect('/login')
    })
})

app.post('/join-class', async (req, res) => {
    classID = req.body.classID;
    master = await collection.findOne({type: "masterlist"});
    masterlist = master.classes;
    masterlist_str = masterlist.join(',');
    const user = await collection.findOne({ id: req.body.id });
    user_classList = user.classList;
    user_classlist_str = user.classList.join(',')

    // Check if classID (submitted by student user) is in masterlist, if so, add it to their classList in database, if not, dont.
    if (masterlist_str.includes(classID) && !user_classlist_str.includes(classID)) {
      //console.log(`ADD IT TO THE USER`);
      user_classList.push(classID);
      const filter = { id: user.id };
      const updateDoc = {
        $set: {
          classList: user_classList
        },
      };
      const result = await collection.updateOne(filter, updateDoc, { upsert: true })

    } else {
      console.log(`DO NOT ADD IT TO THE USER`);
    }

    
    //res.redirect(`/?id=${user.id}&name=${user.name}&role=${user.isTeacher}&classList=${user.classList}`);
    res.redirect('/');
});

app.post('/create-class', async (req, res) => {
    classID = req.body.classID;
    master = await collection.findOne({type: "masterlist"});
    masterlist = master.classes;
    masterlist_str = masterlist.join(',');
    const user = await collection.findOne({ id: req.body.id });
    user_classList = user.classList;
    user_classlist_str = user.classList.join(',')

    // Check if classID (submitted by teacher user) is in masterlist, if not, add it to their classList and masterlist in database, if not, dont.
    if (!masterlist_str.includes(classID) && !user_classlist_str.includes(classID)) {
      //console.log(`ADD IT TO THE USER`);
      user_classList.push(classID);
      const filter1 = { id: user.id };
      const updateDoc1 = {
        $set: {
          classList: user_classList
        },
      };
      const result1 = await collection.updateOne(filter1, updateDoc1, { upsert: true })
      //Add it to the masterlist
      masterlist.push(classID);
      const filter2 = {type: master.type};
      const updateDoc2 = {
        $set: {
          classes: masterlist
        },
      };
      const result2 = await collection.updateOne(filter2, updateDoc2, { upsert: true })
    }
    res.redirect('/');
});

app.post('/view-class', async (req, res) => {
  //user id and class id have been passed in
  //depending on structure, can either send teacher to a manage class(poll) page or 
  //student to participate(?) page
  classname = req.body.item;
  const user = await collection.findOne({ id: req.body.id });
  if(user.isTeacher === "false")
  {
    res.render("/student-class");
  }
})

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

app.listen(PORT, function() {
    console.log(`Server running on port ${PORT}`);
  });

process.on('SIGINT', () => {
    client.close().then(() => {
    console.log('MongoDB client disconnected');
    process.exit(0);
    });
});
