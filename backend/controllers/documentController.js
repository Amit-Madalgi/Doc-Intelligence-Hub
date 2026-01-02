const Document = require('../models/Document');
const QueryHistory = require('../models/QueryHistory');
const pdfParse = require("pdf-parse");
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { chunkText } = require('../utils/ragUtils');

// --- RAG Constants ---
const EMBEDDING_MODEL = 'text-embedding-004';
const CHAT_MODEL = 'gemini-pro';
const VECTOR_INDEX_NAME = 'vector_index';
const K_NEAREST_NEIGHBORS = 5;

// --- Upload Document ---
const uploadDocument = async (req, res) => {
  const { file } = req;
  const { user } = req;

  if (!file) return res.status(400).json({ message: 'Please upload a file' });

  let newDocument = null;

  try {
    // 1. Create DB record
    newDocument = await Document.create({
      user: user._id,
      fileName: file.originalname,
      filePath: file.path,
      status: 'processing',
    });

    let textContent = "";

    // 2. PDF or Text processing
    if (file.mimetype.includes("pdf")) {
      console.log("Reading PDF...");
      const buffer = fs.readFileSync(file.path);
      console.log("Buffer size:", buffer.length);

      const parsed = await pdfParse(buffer);
      console.log("PDF extracted text length:", parsed.text.length);

      textContent = parsed.text;
    } else if (file.mimetype === "text/plain") {
      textContent = fs.readFileSync(file.path, "utf8");
    }

    // 3. Chunk text
    const textChunks = chunkText(textContent);

    // 4. Initialize Gemini AI for embeddings
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const embedModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

    // 5. Embed chunks
    const embeddedChunks = [];
    for (const chunk of textChunks) {
      const resp = await embedModel.embedContent({
        content: { parts: [{ text: chunk.text }] }
      });

      embeddedChunks.push({
        text: chunk.text,
        embedding: resp.embedding.values
      });
    }

    // 6. Save chunks into DB
    newDocument.chunks = embeddedChunks;
    newDocument.status = "ready";
    await newDocument.save();

    // 7. Delete temporary uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.status(201).json(newDocument);

  } catch (error) {
    console.error("Document Processing Error:", error);

    if (newDocument) {
      newDocument.status = "failed";
      await newDocument.save();
    }

    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);

    res.status(500).json({ message: error.message });
  }
};

// --- Get Documents ---
const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user._id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Search Documents (Vector RAG) ---
const searchDocuments = async (req, res) => {
  const { query } = req.body;
  const { user } = req;

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const embedModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

    // 1. Embed query
    const resp = await embedModel.embedContent({
      content: { parts: [{ text: query }] }
    });
    const queryVector = resp.embedding.values;

    // 2. Vector Search
    const relevantChunks = await Document.aggregate([
      { $unwind: "$chunks" },
      {
        $vectorSearch: {
          index: "vector_index",
          path: "chunks.embedding",
          queryVector: queryVector,
          numCandidates: 200,
          limit: K_NEAREST_NEIGHBORS
        }
      },
      {
        $match: {
          user: user._id,
          status: "ready"
        }
      },
      {
        $project: {
          _id: 0,
          chunkText: "$chunks.text",
          fileName: "$fileName",
          score: { $meta: "vectorSearchScore" }
        }
      },
      { $sort: { score: -1 } }
    ]);

    if (relevantChunks.length === 0) {
      return res.json({
        answer: "No relevant information found in your uploaded documents.",
        source: []
      });
    }

    // 3. Build context
    const context = relevantChunks.map(c => c.chunkText).join("\n---\n");

    const prompt = `
Answer strictly from the following context.
If the context does not contain the answer, say:
"I cannot answer based on the documents."

CONTEXT:
${context}

QUESTION:
${query}

ANSWER:
`;

    // 4. Generate answer
    const chatModel = genAI.getGenerativeModel({ model: CHAT_MODEL });
    const result = await chatModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const answerText = result.text.trim();

    // 5. Build references
    const references = [];
    const seen = new Set();
    for (const chunk of relevantChunks) {
      if (!seen.has(chunk.fileName)) {
        seen.add(chunk.fileName);
        references.push({
          fileName: chunk.fileName,
          excerpt: chunk.chunkText.substring(0, 120) + "..."
        });
      }
    }

    await QueryHistory.create({
      user: user._id,
      query,
      answer: answerText,
      references
    });

    res.json({ answer: answerText, source: references });

  } catch (error) {
    console.error("RAG Search Error:", error);
    res.status(500).json({ message: "Error during RAG search." });
  }
};


// --- Get Query History ---
const getQueryHistory = async (req, res) => {
  try {
    const history = await QueryHistory.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  searchDocuments,
  getQueryHistory
};
