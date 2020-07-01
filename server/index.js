const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
const ratelimit = require("express-rate-limit");

const app = express();

const db = monk('localhost/MCTwitter');
const thoughts = db.get('thoughts');
const filter = new Filter;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message: 'Thinkinggg...'
    });
});

app.get('/thoughts', (req,res) => {
    thoughts
        .find()
        .then(thoughts => {
            res.json(thoughts);
        });

});

function isValidThought(thought){
    return thought.name && thought.name.toString().trim() !== ''&&
        thought.content && thought.content.toString().trim() !== '';
}

app.use(ratelimit({
    windowMs: 10*1000, //10 seconds
    max:1
}));

app.post('/thoughts', (req,res) =>{
    if(isValidThought(req.body)){
        //Integrate with DB.
        
        const thought ={
            name: filter.clean(req.body.name.toString()),
            content: filter.clean(req.body.content.toString()),
            created: new Date()
        };

        thoughts 
            .insert(thought)
            .then(createdthought =>{
                res.json(createdthought);
            });

    } else{
        res.status(422);
        res.json({
            message: 'Please enter valid name and content.'
        })
    }
})

app.listen(5000, () => {
    console.log('Listening on port 5000');  
});