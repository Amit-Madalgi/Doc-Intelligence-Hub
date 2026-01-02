// A simple character-based text splitter for demonstration
const chunkText = (text, chunkSize = 1000, chunkOverlap = 200) => {
    const chunks = [];
    if (!text) return chunks;

    for (let i = 0; i < text.length; i += chunkSize - chunkOverlap) {
        let end = Math.min(i + chunkSize, text.length);
        
        // Ensure we don't start the last chunk too far back if the overlap is large
        if (end === text.length && text.length - i < chunkOverlap) {
            i = text.length - chunkSize; // Adjust start index for the last chunk
            if (i < 0) i = 0;
            end = text.length;
        }

        chunks.push({ 
            text: text.substring(i, end).trim() 
        });

        if (end === text.length) break;
    }
    return chunks;
};

module.exports = { chunkText };