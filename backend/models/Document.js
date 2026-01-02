const mongoose = require('mongoose');

// Define a sub-schema for document chunks
const chunkSchema = new mongoose.Schema({
    text: { type: String, required: true },
    // CRITICAL for RAG: Array of Numbers for the vector embedding
    embedding: { type: [Number], required: true }, 
}, { _id: false });

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String,
        required: true,
    },
    // The RAG pipeline relies on chunks, not one large 'content' field
    chunks: [chunkSchema], 
    status: {
        type: String,
        required: true,
        // Status updated: 'ready' means chunks/embeddings are stored
        enum: ['processing', 'ready', 'failed'],
        default: 'processing',
    },
}, {
    timestamps: true,
});

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;