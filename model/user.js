// app/model/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
    local               : {
        email           : String,
        password        : String,
        userType        : String,
        isVerified      : Boolean,
        profileImageUrl : String, 
        userDetails  : {
            commPreferences   :      String,
            contactDetails   : {
                firstName      :   String,
                lastName       :   String,
                contactPhone   :   String,
                sex            :   String,
                dob            : {
                    month    :   String,
                    date     :   String,
                    year     :   String
                },
                address1      :   String,
                address2      :   String,
                city          :   String,
                postalCode    :   String,
                country       :   String
            },
            businessDetails   : {
                aboutBusiness      :   String,
                companyName        :   String,
                address1           :   String,
                address2           :   String,
                city               :   String,
                postalCode         :   String,
                country            :   String,
                primaryPhone       :   String,
                secondryPhone      :   String,
                fax                :   String,
                website            :   String
            },
            leadCategories : [{
                active : Boolean,
                category : String,
                subCategory : String
            }]
        }
    },
    facebook         : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    },
    twitter          : {
        id           : String,
        token        : String,
        displayName  : String,
        username     : String
    },
    google           : {
        id           : String,
        token        : String,
        email        : String,
        name         : String
    }

});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);