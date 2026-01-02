const mongoose = require('mongoose');

const queryHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    query: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    references: [{ // Store the source info that was sent to the frontend
        fileName: { type: String },
        excerpt: { type: String },
    }],
}, {
    timestamps: true,
});

const QueryHistory = mongoose.model('QueryHistory', queryHistorySchema);

module.exports = QueryHistory;