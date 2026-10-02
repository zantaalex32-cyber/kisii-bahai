import { UserProfile, AiChatMessage } from '../types';
import { StorageDB } from './storage';
import { canViewActivity, canViewDocument, canViewAnnouncement, canViewByVisibility } from './permissions';

export interface AssistantResponse {
  answer: string;
  sources: Array<{ type: string; id: string; title: string }>;
  model: string;
}

export async function askClusterAssistant(query: string, user: UserProfile): Promise<AssistantResponse> {
  // STEP 1: Verify user cluster and permissions
  const cluster = StorageDB.getCluster();
  if (user.cluster_id !== cluster.id && user.role !== 'super_admin') {
    return {
      answer: "Unauthorized: Your account is not configured for Kisii Cluster.",
      sources: [],
      model: 'security-boundary-gate',
    };
  }

  // STEP 2: Filter database records strictly to authorized visibility for this user
  const rawActivities = StorageDB.getActivities();
  const rawGroups = StorageDB.getGroups();
  const rawAnnouncements = StorageDB.getAnnouncements();
  const rawDocuments = StorageDB.getDocuments();
  const rawChunks = StorageDB.getKnowledgeChunks();

  const authorizedActivities = rawActivities.filter((act) => canViewActivity(user.role, act, user.id));
  const authorizedGroups = rawGroups.filter((grp) => canViewByVisibility(user.role, grp.visibility));
  const authorizedAnnouncements = rawAnnouncements.filter((ann) => canViewAnnouncement(user.role, ann));
  const authorizedDocuments = rawDocuments.filter((doc) => canViewDocument(user.role, doc));
  const authorizedChunks = rawChunks.filter((chk) => canViewByVisibility(user.role, chk.visibility));

  // Build authorized sanitized payload
  const authorizedContext = {
    activities: authorizedActivities.map((a) => ({
      id: a.id,
      title: a.title,
      activity_type: a.activity_type,
      start_time: a.start_time,
      end_time: a.end_time,
      location: a.location,
      locality_name: a.locality_name,
      visibility: a.visibility,
    })),
    groups: authorizedGroups.map((g) => ({
      id: g.id,
      name: g.name,
      group_type: g.group_type,
      meeting_day: g.meeting_day,
      meeting_time: g.meeting_time,
      location: g.location,
      locality_name: g.locality_name,
    })),
    announcements: authorizedAnnouncements.map((an) => ({
      id: an.id,
      title: an.title,
      content: an.content,
      published_at: an.published_at,
    })),
    documents: authorizedDocuments.map((d) => ({
      id: d.id,
      title: d.title,
      category: d.category,
      description: d.description,
    })),
    knowledgeChunks: authorizedChunks.map((c) => ({
      id: c.id,
      document_title: c.document_title,
      content: c.content,
    })),
  };

  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        userRole: user.role,
        clusterId: cluster.id,
        authorizedContext,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return {
        answer: data.answer || "I couldn't find approved information about that in the cluster portal.",
        sources: data.sources || [],
        model: data.model || 'gemini-3.8-flash',
      };
    }
  } catch (err) {
    console.warn('Network call to /api/ai/chat failed, evaluating with local RAG engine:', err);
  }

  // Client-side grounded RAG fallback with zero-hallucination guarantee
  const qLower = query.toLowerCase();
  const matchedActivities = authorizedActivities.filter((a) => {
    const text = `${a.title} ${a.activity_type} ${a.location} ${a.description}`.toLowerCase();
    return qLower.split(' ').some((w) => w.length > 3 && text.includes(w)) ||
      (qLower.includes('weekend') || qLower.includes('saturday') || qLower.includes('sunday'));
  });

  const matchedGroups = authorizedGroups.filter((g) => {
    const text = `${g.name} ${g.group_type} ${g.location}`.toLowerCase();
    return qLower.split(' ').some((w) => w.length > 3 && text.includes(w)) ||
      (qLower.includes('study circle') && g.group_type === 'Study Circle') ||
      (qLower.includes('devotional') && g.group_type === 'Devotional Meeting');
  });

  const matchedDocs = authorizedDocuments.filter((d) => {
    const text = `${d.title} ${d.category} ${d.description}`.toLowerCase();
    return qLower.split(' ').some((w) => w.length > 3 && text.includes(w)) ||
      (qLower.includes('resource') || qLower.includes('guideline') || qLower.includes('document'));
  });

  if (matchedActivities.length > 0) {
    const lines = matchedActivities.map((a) =>
      `• **${a.title}** (${a.activity_type})\n  Date: ${new Date(a.start_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}\n  Location: ${a.location} (${a.locality_name || 'Kisii Central'})`
    );
    return {
      answer: `I found ${matchedActivities.length} approved activities for your request:\n\n${lines.join('\n\n')}\n\nYou can select any item above to view authorized details.`,
      sources: matchedActivities.map((a) => ({ type: 'activity', id: a.id, title: a.title })),
      model: 'client-rag-fallback',
    };
  }

  if (matchedGroups.length > 0) {
    const lines = matchedGroups.map((g) =>
      `• **${g.name}** (${g.group_type})\n  Meets: Every ${g.meeting_day} at ${g.meeting_time}\n  Location: ${g.location}`
    );
    return {
      answer: `I found ${matchedGroups.length} approved groups active in the cluster:\n\n${lines.join('\n\n')}\n\nVisit the Groups tab for meeting locations and schedules.`,
      sources: matchedGroups.map((g) => ({ type: 'group', id: g.id, title: g.name })),
      model: 'client-rag-fallback',
    };
  }

  if (matchedDocs.length > 0) {
    const lines = matchedDocs.map((d) =>
      `• **${d.title}** [${d.category}]\n  ${d.description}`
    );
    return {
      answer: `Here are approved documents available for your role:\n\n${lines.join('\n\n')}\n\nYou can access or download these in the Documents section.`,
      sources: matchedDocs.map((d) => ({ type: 'document', id: d.id, title: d.title })),
      model: 'client-rag-fallback',
    };
  }

  return {
    answer: "I couldn't find approved information about that in the cluster portal.",
    sources: [],
    model: 'client-rag-fallback',
  };
}
