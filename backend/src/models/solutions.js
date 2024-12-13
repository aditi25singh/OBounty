const mongoose = require('mongoose')

const solutionSchema = new mongoose.Schema(
    {
        user : {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
        },

        issue : {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
        },

        prURL : {
            type: String,
            required: true
        },

        additionalComments : {
            type: String,
            required: false
        },

        negativeVotes : {
            type: Number,
        },

        positiveVotes : {
            type: Number
        }
    },
    {
        timestamps: true
    }
)

const Solution = mongoose.model('Solution', solutionSchema);
module.exports = Solution;