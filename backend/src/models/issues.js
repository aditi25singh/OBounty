const mongoose = require('mongoose')

const issueSchema = new mongoose.Schema(
    {
        user : {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
        },

        createdBy : {
            type: String,
        },
        
        createdAvatar : {
            type: String
        },

        isOpen : {
            type : mongoose.SchemaTypes.Boolean,
            required: true
        },

        isBest : {
            type : mongoose.SchemaTypes.Boolean,
            required: true
        },

        url : {
            type: String,
            required: true
        },

        issueTitle : {
            type: String,
            required: true
        },

        issueDescription : {
            type: String,
            required: true
        },

        backers: {
            type: [mongoose.Schema.ObjectId]
        },

        solutions : {
            type: [mongoose.Schema.ObjectId]
        },

        amount : {
            type : Number,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const Issue = mongoose.model('Issue', issueSchema);
  
module.exports = Issue;