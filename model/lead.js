var mongoose = require('mongoose');
// define the schema for our lead model
var leadSchema = mongoose.Schema({
            category : String,
            subCategory : String,
            subject : String,
            priceRangeFrom: String,
            priceRangeTo : String,
            activeStatus : String,
            fromDate : Date,
            toDate  :  Date,
            country: String,
            zipCode: String,
            limit: Number,
            detail:String,
            createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            createdDate : { type: Date, 'default': Date.now },
            comments : [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
            images : [{
            	        imageName : String,
            	        mimeType : String,
            	        url : String
            	     }]

});

// create the model for leads and expose it to our app
module.exports = mongoose.model('Lead', leadSchema);