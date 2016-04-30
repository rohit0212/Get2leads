var mongoose = require('mongoose');
// define the schema for our lead model
var commentSchema = mongoose.Schema({
                comment : String,
                createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                createdDate : { type: Date, 'default': Date.now },
                replies : [{
                    replyComment : String,
                    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                    createdDate : { type: Date, 'default': Date.now }
                }]

            });

// create the model for leads and expose it to our app
module.exports = mongoose.model('Comment', commentSchema);