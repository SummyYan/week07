const mongoose =require('mongoose');

let developerSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,//add () will execute a function, but we want a reference here
    name:{
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level:{
        type: String,
        validate:{
            validator: function (newLevel) {
                return newLevel==='BEGINNER' || newLevel==='EXPERT';
            }
        }
    },
    address:{
        state: String,
        suburb: String,
        street: String,
        unit: String
    }

});

module.exports= mongoose.model('Developer',developerSchema);

// var developerModel= mongoose.model('Developer', developerSchema);
// module.exports= developerModel;