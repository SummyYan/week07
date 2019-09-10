const express = require('express');
let app = express();
let morgan = require('morgan');
// let moment = requre('moment');

let bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({// /?name=...&age=.. url encoded: check
    extended:false,//value to be a string or array
}));
app.use(bodyParser.json());// data useing json format : check

app.use(express.static('images'));
app.use(express.static('css'));
app.use(morgan('tiny'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const mongoose = require('mongoose');
const Developer = require('./models/developer');
const Task = require('./models/task');
let url = 'mongodb://localhost:27017/taskDB';
mongoose.connect(url, {
    useNewUrlParser: true
}, function (err) {
    if (err) {
        console.log('error in mongoose connection');
        throw err;
    } else {
        console.log('sucessfully connected');
    }
});

//
// let task= new Task({    
// });

// task.save(function(err){

// });
app.get('/',function (req,res) {
    res.sendFile(__dirname+'/index.html');
});

app.get('/listtasks', function (req,res) {
    Task.find().populate({path:'developer',select:'name'}).exec(function (err, result) {
        if (err) {} else {
            res.render('listtasks.html', {
                tasks: result
            });
        }
    });
});

app.get('/listdevelopers', function (req,res) {
    Developer.find().exec(function (err, result) {
        if (err) {} else {
            res.render('listdevelopers.html', {
                developers: result
            });
        }
    });
});

app.get('/newtask', function (req, res) {
    res.sendFile(__dirname + '/newtask.html');
});
app.post('/addtask', function (req, res) {
    let newTask = new Task({
        _id: new mongoose.Types.ObjectId(),
        taskName: req.body.taskName,
        // developer: req.body.developerId,
        developer: mongoose.Types.ObjectId(req.body.developerId),
        taskDue: req.body.taskDue,
        taskStatus: req.body.taskStatus,
        taskDesc: req.body.taskDesc,
    });
    newTask.save(function (err) {
        if (err) {
            res.send('failed to add task, please double check task info');
            console.log(err.toString());
        } else {
            console.log('task successfully added to DB');
            res.redirect('/listtasks');
        }
    });
});

app.get('/newdeveloper', function (req, res) {
    res.sendFile(__dirname + '/newdeveloper.html');
});
app.post('/adddeveloper', function (req, res) {
    let newDeveloper = new Developer({
        _id: new mongoose.Types.ObjectId(),
        name: {
            firstName: req.body.firstName,
            lastName: req.body.lastName
        },
        level: req.body.level,
        address: {
            state: req.body.state,
            suburb: req.body.suburb,
            street: req.body.street,
            unit: req.body.unit
        }
    });
    newDeveloper.save(function (err) {
        if (err) {
            res.send('cannot add this developer');
        } else {
            console.log('Developer successfully added to DB');
            res.redirect('/listdevelopers');
        }
    });
});

app.get('/deletetask',function(req,res){
    res.sendFile(__dirname+'/deletetask.html');
});
app.post('/task2Delete',function(req,res){
    Task.deleteOne({'_id': req.body.taskId},function (err,doc) {
        if (err) {
            res.send('task not found');
        } else {
            console.log(doc);
            res.redirect('/listtasks');
        }
    });
});

app.get('/deletecompleted',function (req,res) {
    let filter={'taskStatus': 'Complete'};
    Task.deleteMany(filter,function (err,doc) {
        if (err) {
            res.send('task not found');
        } else {
            console.log(doc);
            res.redirect('/listtasks');
        }
    })
});

app.get('/updatetask',function(req,res){
    res.sendFile(__dirname+'/updatetask.html');
});
app.post('/task2Update',function(req,res){
    let newStatus= req.body.newStatus
    let filter={'_id':req.body.taskId};
    Task.updateOne(filter,{$set:{'taskStatus':newStatus}},function (err,doc) {
        if(err){}else{
           console.log(doc); 
           res.redirect('/listtasks');
        }
    });
});


app.get('/display5',function(req,res){
    Task.find().sort({ taskName: -1 }).limit(5).populate({path:'developer',select:'name'}).exec(function (err, result) {
        if (err) {} else {
            res.render('listtasks.html', {
                tasks: result
            });
        }
    });
});
app.listen(8000, function (err) {
    if (err) {} else {
        console.log('running at http://localhost:8000/');
        
    }
});