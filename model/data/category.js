var categories ={
    house_service :{
         description : 'House Service',
         subCategory : {
             gardening : 'Gardening',
             cleaning : 'Cleaning'
         }
    },
    developer :{
        description : 'Developer',
        subCategory : {
            java_developer : 'Java Developer',
            dot_net_developer : 'Dot Net Developer',
            python_developer : 'Python Developer',
            java_developer : 'Java Developer'
        }
    },

    /* Function for getting sub category of category*/
    getSubCategory : function( req, res, next) {
        req.subCategory = categories[req.query.category]['subCategory'];
        return next();
    }
}

module.exports = categories;