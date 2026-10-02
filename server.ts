import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Google Gemini AI if GEMINI_API_KEY is present
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Kisii Cluster Portal API',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Permission-Aware AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { query, userRole, clusterId, authorizedContext } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Context provided has ALREADY been filtered strictly by user permissions and cluster on client/server verification
    const activitiesContext = (authorizedContext?.activities || [])
      .map(
        (a: any) =>
          `- [Activity] ${a.title} | Type: ${a.activity_type} | Locality: ${a.locality_name || a.locality_id} | Date: ${a.start_time} to ${a.end_time} | Location: ${a.location} | Visibility: ${a.visibility}`
      )
      .join('\n');

    const groupsContext = (authorizedContext?.groups || [])
      .map(
        (g: any) =>
          `- [Group] ${g.name} | Type: ${g.group_type} | Locality: ${g.locality_name || g.locality_id} | Meets: ${g.meeting_day} at ${g.meeting_time} | Location: ${g.location}`
      )
      .join('\n');

    const announcementsContext = (authorizedContext?.announcements || [])
      .map(
        (an: any) =>
          `- [Announcement] ${an.title} | Published: ${an.published_at} | Content: ${an.content}`
      )
      .join('\n');

    const documentsContext = (authorizedContext?.documents || [])
      .map(
        (d: any) =>
          `- [Document] ${d.title} | Category: ${d.category} | Description: ${d.description}`
      )
      .join('\n');

    const knowledgeChunksContext = (authorizedContext?.knowledgeChunks || [])
      .map(
        (c: any) =>
          `- [Knowledge Chunk from "${c.document_title}"]: ${c.content}`
      )
      .join('\n');

    const fullContext = `
AUTHORIZED RECORDS FOR CLUSTER (${clusterId || 'Kisii Cluster'}, Role: ${userRole || 'public'}):

ACTIVITIES:
${activitiesContext || 'None'}

GROUPS:
${groupsContext || 'None'}

ANNOUNCEMENTS:
${announcementsContext || 'None'}

DOCUMENTS & RESOURCES:
${documentsContext || 'None'}

KNOWLEDGE BASE CHUNKS:
${knowledgeChunksContext || 'None'}
`;

    // If Gemini client is available, generate response
    if (aiClient) {
      const prompt = `
You are the "Kisii Cluster Assistant", a calm, trustworthy, and precise assistant for the Kisii Cluster Portal.

CRITICAL INSTRUCTIONS:
1. You may ONLY use the approved cluster information provided in the context below.
2. NEVER invent activities, dates, names, locations, phone numbers, groups, documents, or policies.
3. If information cannot be found in the authorized context, you MUST respond:
   "I couldn't find approved information about that in the cluster portal."
4. Format your response cleanly with bullet points and clear timings when appropriate.
5. If relevant, mention the source activity or document name.
6. The user has role: "${userRole || 'public'}".

CONTEXT:
${fullContext}

USER QUESTION:
${query}
`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      return res.json({
        answer: response.text || "I couldn't find approved information about that in the cluster portal.",
        sources: [
          ...(authorizedContext?.activities || []).slice(0, 3).map((a: any) => ({ type: 'activity', id: a.id, title: a.title })),
          ...(authorizedContext?.groups || []).slice(0, 3).map((g: any) => ({ type: 'group', id: g.id, title: g.name })),
          ...(authorizedContext?.documents || []).slice(0, 3).map((d: any) => ({ type: 'document', id: d.id, title: d.title })),
        ],
        model: 'gemini-3.8-flash',
      });
    }

    // Fallback deterministic RAG generator if API key is not configured or in offline preview
    const queryLower = query.toLowerCase();
    let answer = '';
    const sources: any[] = [];

    if (queryLower.includes('weekend') || queryLower.includes('saturday') || queryLower.includes('sunday') || queryLower.includes('activit')) {
      const matched = (authorizedContext?.activities || []).filter((a: any) => {
        const text = `${a.title} ${a.activity_type} ${a.location} ${a.start_time}`.toLowerCase();
        return queryLower.split(' ').some((word: string) => word.length > 3 && text.includes(word)) || text.includes('saturday') || text.includes('weekend');
      });

      if (matched.length > 0) {
        answer = `I found ${matched.length} approved activities in the cluster:\n\n` +
          matched.map((a: any) => `• **${a.title}** (${a.activity_type})\n  Time: ${new Date(a.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n  Location: ${a.location} (${a.locality_name || 'Kisii'})\n`).join('\n') +
          `\nYou can view full details for any activity in the Activities section.`;
        matched.forEach((m: any) => sources.push({ type: 'activity', id: m.id, title: m.title }));
      }
    } else if (queryLower.includes('group') || queryLower.includes('study circle') || queryLower.includes('devotional') || queryLower.includes('children')) {
      const matched = (authorizedContext?.groups || []).filter((g: any) => {
        const text = `${g.name} ${g.group_type} ${g.location}`.toLowerCase();
        return queryLower.split(' ').some((word: string) => word.length > 3 && text.includes(word)) || text.includes('devotional') || text.includes('study circle');
      });

      if (matched.length > 0) {
        answer = `Here are the approved groups matching your query:\n\n` +
          matched.map((g: any) => `• **${g.name}** (${g.group_type})\n  Schedule: Every ${g.meeting_day} at ${g.meeting_time}\n  Location: ${g.location}\n`).join('\n') +
          `\nFor more details or to connect, check the Groups tab.`;
        matched.forEach((g: any) => sources.push({ type: 'group', id: g.id, title: g.name }));
      }
    } else if (queryLower.includes('document') || queryLower.includes('resource') || queryLower.includes('guideline') || queryLower.includes('material')) {
      const matched = (authorizedContext?.documents || []).slice(0, 4);
      if (matched.length > 0) {
        answer = `Here are approved cluster resources available for your role (${userRole}):\n\n` +
          matched.map((d: any) => `• **${d.title}** [${d.category}]\n  ${d.description}`).join('\n\n') +
          `\nYou can download or view them in the Documents Library.`;
        matched.forEach((d: any) => sources.push({ type: 'document', id: d.id, title: d.title }));
      }
    }

    if (!answer) {
      // Check announcements
      const matchedAnn = (authorizedContext?.announcements || []).filter((an: any) => {
        const text = `${an.title} ${an.content}`.toLowerCase();
        return queryLower.split(' ').some((word: string) => word.length > 3 && text.includes(word));
      });
      if (matchedAnn.length > 0) {
        answer = `I found approved announcements regarding this topic:\n\n` +
          matchedAnn.map((an: any) => `• **${an.title}** (${new Date(an.published_at).toLocaleDateString()}):\n  ${an.content}`).join('\n\n');
        matchedAnn.forEach((a: any) => sources.push({ type: 'announcement', id: a.id, title: a.title }));
      } else {
        answer = "I couldn't find approved information about that in the cluster portal.";
      }
    }

    return res.json({
      answer,
      sources,
      model: 'cluster-rag-engine',
    });
  } catch (error: any) {
    console.error('AI chat endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error processing AI query' });
  }
});

// Vite middleware in development
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('index.html', { root: 'dist' });
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Kisii Cluster Portal running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
