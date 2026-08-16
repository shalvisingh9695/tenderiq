import { generateContentWithRetry, GEMINI_PRIMARY_MODEL } from '../config/gemini.js';

/**
 * Splits document text into structured chunks with page numbers, section headers, and approximate positions.
 */
function chunkDocumentWithMetadata(documentText, targetWordCount = 400) {
  if (!documentText || typeof documentText !== 'string') return [];

  const totalLength = documentText.length;
  if (totalLength === 0) return [];

  // Check if text contains explicit page markers (e.g., "--- PAGE 1 ---", "Page 2", "Page 3 of 10", "\f")
  const pageMarkerRegex = /(?:---+\s*PAGE\s*(\d+)\s*---+)|(?:\n\s*Page\s*(\d+)\b)|(?:\f)/gi;
  const hasPageMarkers = pageMarkerRegex.test(documentText);

  // Section header regex (e.g., "Section 1", "3.1 Eligibility", "CHAPTER 2", "ANNEXURE I")
  const sectionHeaderRegex = /^(?:Section|SECTION|Chapter|CHAPTER|Annexure|ANNEXURE|Clause|CLAUSE|\d+\.\d+)\s*[\d\.\w\s:-]{2,60}$/i;

  const paragraphs = documentText.split(/\n+/).map(p => p.trim()).filter(Boolean);
  const chunks = [];

  let currentWords = [];
  let currentStartChar = 0;
  let charCounter = 0;
  let currentPage = 1;
  let currentSection = 'General Document';

  // Words per estimated page (standard PDF page ~ 400-500 words)
  const estWordsPerPage = 400;
  let runningWordCount = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    const paraWords = para.split(/\s+/).filter(Boolean);
    const paraLength = para.length;

    // Check for explicit page markers in paragraph
    const pageMatch = /PAGE\s*(\d+)/i.exec(para);
    if (pageMatch && pageMatch[1]) {
      currentPage = parseInt(pageMatch[1], 10);
    } else if (para.includes('\f')) {
      currentPage++;
    }

    // Check for section header
    if (sectionHeaderRegex.test(para) && para.length < 100) {
      currentSection = para.replace(/^[:\-\s]+|[:\-\s]+$/g, '');
    }

    if (currentWords.length === 0) {
      currentStartChar = charCounter;
    }

    currentWords.push(...paraWords);
    runningWordCount += paraWords.length;
    charCounter += paraLength + 1;

    // Estimate page number if no explicit markers were found
    if (!hasPageMarkers && runningWordCount > 0) {
      currentPage = Math.max(1, Math.ceil(runningWordCount / estWordsPerPage));
    }

    // Flush chunk if target word count reached or end of document
    if (currentWords.length >= targetWordCount || i === paragraphs.length - 1) {
      const chunkTextStr = currentWords.join(' ');
      const approxPct = Math.round((currentStartChar / Math.max(1, totalLength)) * 100);
      let positionDesc = `Page ${currentPage} (~${approxPct}% of document)`;

      if (approxPct < 15) positionDesc = `Page ${currentPage} (Beginning of document)`;
      else if (approxPct > 85) positionDesc = `Page ${currentPage} (End of document)`;

      chunks.push({
        text: chunkTextStr,
        page: currentPage,
        section: currentSection,
        approximatePosition: positionDesc
      });

      currentWords = [];
    }
  }

  // Fallback if no chunks generated
  if (chunks.length === 0 && documentText.trim().length > 0) {
    chunks.push({
      text: documentText.trim(),
      page: 1,
      section: 'Main Document',
      approximatePosition: 'Page 1 (Full Document)'
    });
  }

  return chunks;
}

/**
 * Extracts key keywords from a question string, removing common stop words.
 */
function extractKeywords(question) {
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were', 'will',
    'with', 'what', 'where', 'when', 'who', 'how', 'why', 'can', 'could', 'should',
    'would', 'does', 'do', 'did', 'there', 'tell', 'me', 'about', 'show', 'give',
    'please', 'list', 'explain'
  ]);

  return String(question || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length >= 2 && !stopWords.has(word));
}

/**
 * Calculates keyword relevance match score for a text chunk.
 */
function calculateRelevance(chunkTextStr, keywords) {
  if (!keywords || keywords.length === 0) return 0;
  const lowerChunk = chunkTextStr.toLowerCase();
  let matches = 0;

  keywords.forEach(kw => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
    const count = (lowerChunk.match(regex) || []).length;
    matches += count;
  });

  return matches;
}

/**
 * Chat Service for TenderIQ AI RAG Assistant with PDF Source Highlighting metadata
 */
export class ChatService {
  /**
   * Answers a user question using RAG over the document text.
   * @param {Object} params
   * @param {string} params.question
   * @param {string} params.documentText
   * @returns {Promise<{ answer: string, sources: Array<{ text: string, relevance: number, page: number|null, section: string|null, approximatePosition: string|null }> }>}
   */
  static async answerQuestion({ question, documentText }) {
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      throw new Error('Question is required for AI Chat.');
    }

    if (!documentText || typeof documentText !== 'string' || documentText.trim().length === 0) {
      throw new Error('Document text is required for AI Chat.');
    }

    // 1. Chunk document text with page, section, and position metadata (~300-500 words per chunk)
    const chunks = chunkDocumentWithMetadata(documentText, 400);

    // 2. Extract keywords & calculate keyword relevance match
    const keywords = extractKeywords(question);

    const rankedChunks = chunks.map((chunkObj, index) => {
      const matchScore = calculateRelevance(chunkObj.text, keywords);
      return { chunk: chunkObj, matchScore, index };
    });

    // Sort chunks by match score descending
    rankedChunks.sort((a, b) => b.matchScore - a.matchScore);

    // Pick top 3 relevant chunks
    const topRanked = rankedChunks.slice(0, 3);

    // If top score is 0, preserve document order for top 3 chunks
    if (topRanked.length > 0 && topRanked[0].matchScore === 0) {
      topRanked.sort((a, b) => a.index - b.index);
    }

    // Format sources with calculated relevance score (0 - 1), page, section, and approximatePosition
    const maxScore = topRanked[0]?.matchScore || 1;
    const sources = topRanked.map(item => {
      let relevance = 0.50;
      if (item.matchScore > 0) {
        relevance = Math.min(0.98, Math.max(0.65, Math.round((item.matchScore / (maxScore + 2) + 0.65) * 100) / 100));
      }
      return {
        text: item.chunk.text,
        relevance,
        page: Number.isInteger(item.chunk.page) ? item.chunk.page : null,
        section: item.chunk.section || null,
        approximatePosition: item.chunk.approximatePosition || null
      };
    });

    const contextText = topRanked.map((item, idx) =>
      `--- CONTEXT CHUNK ${idx + 1} (Page ${item.chunk.page || 'N/A'}, Section: ${item.chunk.section || 'General'}, Position: ${item.chunk.approximatePosition || 'N/A'}) ---\n${item.chunk.text}`
    ).join('\n\n');

    // 3. Call Gemini (gemini-3.1-flash-lite with retry)
    let answer = '';

    try {
      const systemPrompt = `You are TenderIQ's AI Procurement Assistant.
Answer the user's question about the tender document clearly, accurately, and concisely based strictly on the provided document context chunks.

RULES:
- Use ONLY the provided document context chunks.
- Be clear, direct, and professional.
- Refer to page numbers or section headings if mentioned in the context headers.
- Do not make up facts or hallucinate details not mentioned in the context.
- If the details are not present in the excerpts, clearly state what information is available and what is missing.`;

      const userPrompt = `DOCUMENT CONTEXT EXCERPTS:
${contextText}

USER QUESTION:
${question}`;

      const response = await generateContentWithRetry({
        model: GEMINI_PRIMARY_MODEL,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2
        }
      });

      if (response.text) {
        answer = response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini chat service warning:', err.message || err);
    }

    // Fallback answer if response is empty or error occurred
    if (!answer) {
      answer = `Based on the tender document context excerpts retrieved:\n\n${topRanked.map(t => `• ${t.chunk.text.slice(0, 220)}...`).join('\n\n')}`;
    }

    return {
      answer,
      sources
    };
  }
}
