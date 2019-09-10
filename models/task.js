const mongoose =require('mongoose');

let taskSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    // taskID:{
    //     type: Number,
    //     required: true
    // },
    taskName: String,
    developer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Developer'
    },
    taskDue: Date,
    taskStatus: {
        type: String,
        validate:{
            validator: function(newStatus){
                return newStatus === 'InProgress' || newStatus === 'Complete'
            },
            message: 'Invalid Status'
        }
    },
    taskDesc: String
});

// taskSchema.pre('save',function(){
//     this.taskDue='';
// })

module.exports= mongoose.model('Task',taskSchema);