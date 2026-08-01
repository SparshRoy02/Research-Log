const axios = require('axios');

const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:3b';

/**
 * Send request to Ollama generate endpoint
 */
async function callOllama(prompt, systemPrompt = '') {
  try {
    const response = await axios.post(`${OLLAMA_HOST}/api/generate`, {
      model: OLLAMA_MODEL,
      prompt: prompt,
      system: systemPrompt,
      stream: false,
      options: {
        temperature: 0.7,
      }
    }, {
      timeout: 180000 // 3 minutes timeout for slow local models
    });

    return response.data.response;
  } catch (error) {
    console.error('Ollama connection error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      throw new Error(`Could not connect to Ollama. Make sure Ollama is running locally on port 11434 and you have pulled the model via 'ollama run ${OLLAMA_MODEL}'.`);
    }
    throw error;
  }
}

/**
 * Generate 3 distinct search queries for a given research topic
 */
async function generateSearchQueries(topic) {
  const systemPrompt = `You are a research query planner. Your goal is to break down the user's research topic into 3 distinct, specific search queries that can be used on a search engine to gather high-quality information. Output ONLY the 3 queries, one per line. Do not include numbering, bullets, introduction, or explanations.`;
  const prompt = `Topic: "${topic}"\n\nGenerate 3 search queries to find the most relevant, up-to-date, and accurate information on this topic.`;

  try {
    const responseText = await callOllama(prompt, systemPrompt);
    const queries = responseText
      .split('\n')
      .map(q => q.replace(/^\d+\.\s*/, '').replace(/^[-*]\s*/, '').trim())
      .filter(q => q.length > 0)
      .slice(0, 3);
    
    if (queries.length > 0) return queries;
    return [topic];
  } catch (error) {
    console.warn('Ollama queries generation failed, using fallback query:', error.message);
    return [topic, `${topic} latest news`, `${topic} analysis`];
  }
}

/**
 * Synthesize gathered sources into a comprehensive markdown research report
 */
async function generateResearchReport(topic, sources) {
  const sourcesText = sources.map((s, idx) => `[Source ${idx + 1}] Title: ${s.title}\nURL: ${s.url}\nSnippet: ${s.snippet}\n`).join('\n');
  
  const systemPrompt = `You are an elite research agent. Your task is to write a highly detailed, professional, and comprehensive research report on the requested topic based ONLY on the provided sources. 
Structure your report with:
- An Executive Summary
- Key Themes & Findings (broken down into subsections with detailed analysis)
- Technical Details or Market Statistics (if relevant)
- Strategic Recommendations
- References (list the sources and their URLs)

Write in a formal, objective tone. Use clean, extensive Markdown formatting (headings, lists, bold text, and tables where helpful). Do not include filler words.`;

  const prompt = `Research Topic: "${topic}"\n\nHere are the search findings/sources collected:\n${sourcesText}\n\nPlease compile the final report. Make sure to synthesize the information, resolve any contradictions, cite the source index (e.g. [1], [2]), and list references at the end.`;

  try {
    return await callOllama(prompt, systemPrompt);
  } catch (error) {
    console.error('Ollama report generation failed:', error.message);
    return `# Research Report: ${topic}
    
## Error: Ollama Offline
We were unable to communicate with Ollama to generate a synthesized report. Please ensure Ollama is running locally and that you have pulled the model using:
\`\`\`bash
ollama run ${OLLAMA_MODEL}
\`\`\`

### Collected Search Findings (Raw Snippets)
${sources.map((s, idx) => `- **[${s.title}](${s.url})**: ${s.snippet}`).join('\n')}
`;
  }
}

module.exports = {
  generateSearchQueries,
  generateResearchReport,
  OLLAMA_MODEL
};
