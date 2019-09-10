const mongoose = require('mongoose');
const Flight = require('./travelschema');
mongoose.connect('mongodb://localhost:27017/Travel', function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
    }
    else{
        console.log('Successfully connected');
        let flight1 = new Flight({
            _id: new mongoose.Types.ObjectId(),
            from:'MEL',
            to:'JNB',
            airline:'VA',
            cost: 2500
        });
        flight1.save(function (err) {
            if (err){
            }
            else{
                console.log('Flight successfully Added to DB');
            }

        });
    }

});