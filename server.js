const express = require('express');
var bcrypt = require('bcryptjs');
const cors = require('cors'); //to connect localhost servers

const app = express();

app.use(express.json()); //used for parsing
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Gega',
            email: 'gega@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
            },
    ],
    login: {
        id: '987',
        hash: '',
        email: 'john@gmail.com'
    }
}

app.get('/', (req, res) => {    
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    // Load hash from your password DB.
    bcrypt.compare("cookies", '$2a$10$zXSrCjYiyqeTSVrBGF8Qqutz4B/bQv8mB5Y5gaOrm4LbAvTXMsbXm', function(err, res) {
        console.log('first guess', res)
    });
    bcrypt.compare("not_bacon", '$2a$10$Ak1CpnnigW//QuJaYLOzoOp396XpgZqAMmb8S2wy.EGgBOOD.Yy1u', function(err, res) {
        console.log('second guess', res)
    });

    
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
            res.json(database.users[0]);
        }else{
            res.status(400).json('error logging in');
        }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
        console.log(hash);
    });
});
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found){
        res.status(400).json('not found');
    }
})

app.listen(3000, ()=>{
    console.log('app is running on port 3000');
});
