const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 4000;
const db = require('./db');
const ObjectID = require('mongoose').Types.ObjectId;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('index');
});


io.on('connection', (socket) => {
    socket.on('joined', (data) => {
        console.log('joined: ' + data);
    });

    socket.on('upload', (data) => {

        saveData(data);
    })
    //get_data
    socket.on('get_data', (data) => {

        getData();
    }
    )

    //delete
    socket.on('delete', (id) => {
        deleteData(id);
    }
    )

    //edit
    socket.on('edit', (data) => {
        editData(data);
    }
    )

});

// save the data to the database
const saveData = (data) => {
    let post = {
        name: data.name,
        email: data.email,
        phone: data.phone,

    }
    if (data._id) {
        db.collection('crud').updateOne({ _id: ObjectID(data._id) }, { $set: post }, (err, result) => {
            if (err) throw err;
            getData();
        }
        );
    }
    else {
        db.collection('crud').insertOne(post, function (err, res) {
            if (err) throw err;
            io.emit('saved', true);

        });
    }





}

//get_data
const getData = () => {
    db.collection('crud').find({}).toArray(function (err, result) {
        if (err) throw err;
        io.emit('res_data', result);
    }
    );
}

//deleteData
const deleteData = (id) => {
    db.collection('crud').deleteOne({ _id: new ObjectID(id) }, function (err, result) {
        if (err) throw err;
        io.emit('deleted', true);
    }
    );
}


//editData get data by id
const editData = (id) => {
    db.collection('crud').findOne({ _id: new ObjectID(id) }, function (err, result) {
        if (err) throw err;
        io.emit('edit_data', result);
    }
    );
}



http.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})
