import {
  generateContentWithRetry,
  embedContentWithRetry,
  GEMINI_PRIMARY_MODEL,
  GEMINI_EMBEDDING_MODEL
} from '../config/gemini.js';

/**
 * Calculates standard Cosine Similarity between two dense vector embeddings.
 * @param {Array<number>} vecA
 * @param {Array<number>} vecB
 * @returns {number} Value between -1.0 and 1.0 (or 0 if invalid)
 */
export function calculateCosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB)) return 0;
  if (vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i];
    const b = vecB[i];
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

/**
 * Splits document text into semantically cohesive chunks of 500–800 tokens
 * with a sliding window overlap of ~100-150 tokens.
 *
 * Preserves structural document metadata (Page numbers, Section headers, document progress).
 *
 * @param {string} documentText
 * @param {Object} [options]
 * @param {number} [options.targetTokens=650] - Target tokens per chunk (500-800)
 * @param {number} [options.overlapTokens=120] - Overlap tokens between adjacent chunks
 * @returns {Array<{ chunkIndex: number, text: string, tokenEstimate: number, page: number, section: string, approximatePosition: string }>}
 */
export function chunkDocument(documentText, { targetTokens = 650, overlapTokens = 120 } = {}) {
  if (!documentText || typeof documentText !== 'string') return [];

  const rawText = documentText.trim();
  if (rawText.length === 0) return [];

  const totalLength = rawText.length;
  // Estimate tokens (~3.8 characters per token on average for English / legal procurement text)
  const CHARS_PER_TOKEN = 3.8;
  const targetChars = Math.round(targetTokens * CHARS_PER_TOKEN); // ~2470 chars
  const overlapChars = Math.round(overlapTokens * CHARS_PER_TOKEN); // ~450 chars

  // Section header matcher (e.g., "Section 1", "3.1 Eligibility Criteria", "CHAPTER 2", "Clause 14", "ANNEXURE I")
  const sectionHeaderRegex = /^(?:Section|SECTION|Chapter|CHAPTER|Annexure|ANNEXURE|Clause|CLAUSE|Schedule|SCHEDULE|\d+\.\d+)\s*[\d\.\w\s:-]{2,80}$/i;

  // Split into paragraphs / logical text blocks
  const rawParagraphs = rawText.split(/(?:\r?\n){2,}/);
  const blocks = [];

  for (const para of rawParagraphs) {
    const trimmed = para.trim();
    if (trimmed.length > 0) {
      blocks.push(trimmed);
    }
  }

  // If no clear paragraphs, split by single newline
  const paragraphs = blocks.length > 0 ? blocks : rawText.split(/\n+/).map((p) => p.trim()).filter(Boolean);

  const chunks = [];
  let currentBuffer = '';
  let currentStartChar = 0;
  let charCounter = 0;
  let currentPage = 1;
  let currentSection = 'General Specifications';
  let runningWordCount = 0;
  const estWordsPerPage = 450;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const paraLength = para.length;

    // Detect explicit page indicators
    const pageMatch = /PAGE\s*(\d+)/i.exec(para);
    if (pageMatch && pageMatch[1]) {
      currentPage = parseInt(pageMatch[1], 10);
    } else if (para.includes('\f')) {
      currentPage++;
    }

    // Detect section titles
    if (sectionHeaderRegex.test(para) && para.length < 120) {
      currentSection = para.replace(/^[:\-\s]+|[:\-\s]+$/g, '');
    }

    const paraWords = para.split(/\s+/).filter(Boolean);
    runningWordCount += paraWords.length;

    if (!pageMatch && runningWordCount > 0) {
      currentPage = Math.max(1, Math.ceil(runningWordCount / estWordsPerPage));
    }

    if (currentBuffer.length === 0) {
      currentStartChar = charCounter;
    }

    currentBuffer += (currentBuffer.length > 0 ? '\n\n' : '') + para;
    charCounter += paraLength + 2;

    const currentTokenEst = Math.round(currentBuffer.length / CHARS_PER_TOKEN);

    // If buffer reached target size or reached the final paragraph, emit chunk
    if (currentTokenEst >= targetTokens || i === paragraphs.length - 1) {
      const chunkTextStr = currentBuffer.trim();

      if (chunkTextStr.length > 0) {
        const approxPct = Math.round((currentStartChar / Math.max(1, totalLength)) * 100);
        let positionDesc = `Page ${currentPage} (~${approxPct}% into document)`;
        if (approxPct < 15) positionDesc = `Page ${currentPage} (Beginning of tender)`;
        else if (approxPct > 85) positionDesc = `Page ${currentPage} (End of tender)`;

        chunks.push({
          chunkIndex: chunks.length + 1,
          text: chunkTextStr,
          tokenEstimate: Math.round(chunkTextStr.length / CHARS_PER_TOKEN),
          page: currentPage,
          section: currentSection,
          approximatePosition: positionDesc
        });
      }

      // Handle sliding window overlap
      if (currentBuffer.length > overlapChars && i < paragraphs.length - 1) {
        // Take the trailing slice for overlap
        const slicePoint = Math.max(0, currentBuffer.length - overlapChars);
        const nextBufferStart = currentBuffer.slice(slicePoint);
        // Clean to nearest word boundary
        const wordBoundary = nextBufferStart.indexOf(' ');
        currentBuffer = wordBoundary !== -1 ? nextBufferStart.slice(wordBoundary + 1) : nextBufferStart;
      } else {
        currentBuffer = '';
      }
    }
  }

  // Guarantee at least 1 chunk for non-empty text
  if (chunks.length === 0 && rawText.length > 0) {
    chunks.push({
      chunkIndex: 1,
      text: rawText,
      tokenEstimate: Math.round(rawText.length / CHARS_PER_TOKEN),
      page: 1,
      section: 'Main Document',
      approximatePosition: 'Page 1 (Complete Text)'
    });
  }

  return chunks;
}

/**
 * Cache for chunk embeddings to avoid re-embedding unchanged documents across multiple chat turns.
 */
const documentEmbeddingCache = new Map();

/**
 * Chat & RAG Service powered exclusively by the Gemini API.
 */
export class ChatService {
  /**
   * Generates embeddings for an array of document chunks using Gemini embedding model.
   * @param {Array<{ text: string }>} chunks
   * @param {string} cacheKey
   * @returns {Promise<Array<Array<number>>>}
   */
  static async getChunkEmbeddings(chunks, cacheKey) {
    if (cacheKey && documentEmbeddingCache.has(cacheKey)) {
      const cached = documentEmbeddingCache.get(cacheKey);
      if (cached && cached.length === chunks.length) {
        return cached;
      }
    }

    const chunkTexts = chunks.map((c) => c.text);
    const BATCH_SIZE = 10;
    const allEmbeddings = [];

    for (let i = 0; i < chunkTexts.length; i += BATCH_SIZE) {
      const batch = chunkTexts.slice(i, i + BATCH_SIZE);

      if (batch.length === 1) {
        const emb = await embedContentWithRetry({
          contents: batch[0],
          model: GEMINI_EMBEDDING_MODEL
        });
        allEmbeddings.push(Array.isArray(emb) && Array.isArray(emb[0]) ? emb[0] : emb);
      } else {
        const batchResults = await embedContentWithRetry({
          contents: batch,
          model: GEMINI_EMBEDDING_MODEL
        });

        if (Array.isArray(batchResults)) {
          for (const item of batchResults) {
            allEmbeddings.push(Array.isArray(item) ? item : [item]);
          }
        }
      }
    }

    if (cacheKey && allEmbeddings.length === chunks.length) {
      documentEmbeddingCache.set(cacheKey, allEmbeddings);
      // Keep cache small (max 20 documents)
      if (documentEmbeddingCache.size > 20) {
        const firstKey = documentEmbeddingCache.keys().next().value;
        documentEmbeddingCache.delete(firstKey);
      }
    }

    return allEmbeddings;
  }

  /**
   * Core RAG pipeline for Question-Answering using Gemini embeddings and generative model.
   *
   * 1. Semantically chunks document or uses provided chunks (500–800 tokens with overlap).
   * 2. Generates dense embeddings using Gemini API (gemini-embedding-2-preview).
   * 3. Performs Cosine Similarity vector search against the user question.
   * 4. Synthesizes high-precision answers with explicit citations, context, and source references.
   *
   * @param {Object} params
   * @param {string} params.question - User's procurement inquiry
   * @param {string} [params.documentText] - Complete tender document text
   * @param {Array<string|Object>} [params.chunks] - Pre-chunked document segments
   * @param {string} [params.tenderId] - Optional tender identifier for embedding caching
   * @returns {Promise<{ answer: string, context: string, sources: Array<Object>, citation: Object }>}
   */
  static async answerQuestion({ question, documentText, chunks: inputChunks, tenderId = null }) {
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      throw new Error('Question is required for AI Question-Answering.');
    }

    const cleanQuestion = question.trim();

    // 1. Normalize chunks from inputChunks or compute from documentText
    let chunks = [];
    if (Array.isArray(inputChunks) && inputChunks.length > 0) {
      chunks = inputChunks.map((item, idx) => {
        if (typeof item === 'string') {
          return {
            chunkIndex: idx + 1,
            text: item.trim(),
            page: idx + 1,
            section: `Uploaded Chunk ${idx + 1}`,
            approximatePosition: `Chunk ${idx + 1}`
          };
        }
        return {
          chunkIndex: item.chunkIndex || idx + 1,
          text: (item.text || item.content || '').trim(),
          page: item.page || idx + 1,
          section: item.section || item.title || `Section ${idx + 1}`,
          approximatePosition: item.approximatePosition || `Page ${item.page || idx + 1}`
        };
      }).filter((c) => c.text.length > 0);
    } else if (documentText && typeof documentText === 'string' && documentText.trim().length > 0) {
      chunks = chunkDocument(documentText, { targetTokens: 650, overlapTokens: 120 });
    }

    if (chunks.length === 0) {
      throw new Error('No readable document text or chunks provided to evaluate answers.');
    }

    let topChunks = [];

    try {
      // 2. Embed the question using Gemini embedding model
      const questionEmbeddingRaw = await embedContentWithRetry({
        contents: cleanQuestion,
        model: GEMINI_EMBEDDING_MODEL
      });

      const questionVector = Array.isArray(questionEmbeddingRaw) && Array.isArray(questionEmbeddingRaw[0])
        ? questionEmbeddingRaw[0]
        : questionEmbeddingRaw;

      // 3. Embed document chunks using Gemini embedding model
      const cacheKey = tenderId ? `tender-${tenderId}-${chunks.length}` : null;
      const chunkEmbeddings = await this.getChunkEmbeddings(chunks, cacheKey);

      // 4. Vector similarity search (Cosine Similarity ranking)
      const scoredChunks = chunks.map((chunk, idx) => {
        const chunkVector = chunkEmbeddings[idx] || [];
        const similarity = calculateCosineSimilarity(questionVector, chunkVector);
        return {
          ...chunk,
          similarity: Number.isFinite(similarity) ? Math.round(similarity * 1000) / 1000 : 0
        };
      });

      // Sort by cosine similarity descending
      scoredChunks.sort((a, b) => b.similarity - a.similarity);
      topChunks = scoredChunks.slice(0, 4);
    } catch (embedErr) {
      console.warn('Vector embedding retrieval fallback to keyword lexical search:', embedErr.message);
      // Lexical keyword matching fallback
      const qTokens = cleanQuestion.toLowerCase().split(/[\s,.;:?!-]+/).filter((w) => w.length > 2);
      const scored = chunks.map((chunk) => {
        const textLower = chunk.text.toLowerCase();
        let matchCount = 0;
        for (const token of qTokens) {
          if (textLower.includes(token)) matchCount += 1;
        }
        return {
          ...chunk,
          similarity: Math.min(1.0, matchCount / (qTokens.length || 1))
        };
      });
      scored.sort((a, b) => b.similarity - a.similarity);
      topChunks = scored.slice(0, 4);
    }

    if (topChunks.length === 0) {
      topChunks = chunks.slice(0, 3);
    }

    // 5. Structure Context and Sources
    const sources = topChunks.map((chunk) => ({
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
      similarity: chunk.similarity,
      page: chunk.page || null,
      section: chunk.section || 'General',
      approximatePosition: chunk.approximatePosition || `Page ${chunk.page || 1}`
    }));

    const contextPayload = topChunks
      .map(
        (c, idx) =>
          `[EXCERPT ${idx + 1} | Page ${c.page || 'N/A'} | Section: "${c.section || 'General'}" | Relevance Score: ${c.similarity}]\n${c.text}`
      )
      .join('\n\n====================\n\n');

    // 6. High-Precision Prompt with Structured Source Grounding
    const systemInstruction = `You are TenderIQ's Senior AI Procurement & Contracts Analyst.
Your responsibility is to analyze tender/RFP documentation and provide fact-based, audit-grade answers to the user's questions based EXCLUSIVELY on the provided document excerpts.

STRICT OPERATIONAL GUIDELINES:
1. STRICT DOCUMENT FIDELITY: Answer solely using information present in the excerpts. Never fabricate clauses, dates, financial amounts, or conditions.
2. ACCURATE CITATIONS: When mentioning criteria, penalties, values, or requirements, cite the source page or section from the excerpt header (e.g. "[Page 4, Section: Eligibility]").
3. STRUCTURED & CONCISE:
   - Provide a direct, authoritative summary first.
   - Use bullet points for specific numbers, conditions, and requirements.
   - If applicable, clarify any conditions, caveats, or mandatory submission documents.
4. INFORMATION GAPS: If the requested information is absent or only partially addressed in the provided excerpts, explicitly declare what details are verified and what specific points are missing from the text.`;

    const userPrompt = `DOCUMENT EXCERPTS FROM TENDER:
====================
${contextPayload}
====================

USER PROCUREMENT INQUIRY:
${cleanQuestion}

Please provide an accurate, well-structured answer with precise citations based strictly on the excerpts above.`;

    let answer = '';
    try {
      const geminiResponse = await generateContentWithRetry({
        model: GEMINI_PRIMARY_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.15,
          topP: 0.95
        }
      });

      const generated = geminiResponse.text?.trim();
      if (generated && generated.length > 0) {
        answer = generated;
      }
    } catch (genErr) {
      console.warn('Gemini generative chat fallback:', genErr.message);
    }

    if (!answer) {
      // Heuristic extractive summary based on top relevant excerpts
      const bestExcerpt = topChunks[0] || { text: (documentText || '').slice(0, 500), section: 'General', page: 1 };
      answer = `Based on the tender specifications (${bestExcerpt.section || 'Section Criteria'}, Page ${bestExcerpt.page || 1}):\n\n` +
        bestExcerpt.text.split('\n').slice(0, 5).join('\n') +
        `\n\n📌 **Source Reference**: [Page ${bestExcerpt.page || 1}, ${bestExcerpt.section || 'General Conditions'}]`;
    }

    const citation = sources.length > 0 ? {
      docName: 'Tender Document',
      clause: sources[0].section || 'Contract Specifications',
      page: sources[0].page || 1,
      quote: sources[0].text ? sources[0].text.substring(0, 180) + '...' : ''
    } : null;

    return {
      answer,
      context: contextPayload,
      sources,
      citation
    };
  }
}

export default ChatService;
