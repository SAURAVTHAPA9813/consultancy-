
import * as imported from './mockApi.js';

// Be robust to different export styles (default vs named).
const mockApi = imported?.default ?? imported;

// Safe fallbacks to prevent runtime "Cannot read properties of undefined" errors.
const safe = {
  students: {
    list: async () => [],
    get: async () => null,
    create: async (x) => ({ ...x, id: Date.now(), createdAt: new Date().toISOString(), status: x?.status ?? 'active' }),
    update: async () => null,
    remove: async () => true,
  },
  leads: {
    list: async () => [],
    create: async (x) => ({ ...x, id: Date.now(), createdAt: new Date().toISOString() }),
    update: async () => null,
    remove: async () => true,
  },
  documents: {
    list: async () => [],
    create: async (x) => ({ ...x, id: Date.now(), uploadedAt: new Date().toISOString().split('T')[0] }),
    remove: async () => true,
  },
  threads: {
    listForUser: async () => [],
    get: async () => null,
    touch: async () => null,
  },
  messages: {
    list: async () => [],
    create: async (m) => ({ ...m, id: Date.now(), createdAt: new Date().toISOString(), seenBy: [m.fromUserId].filter(Boolean) }),
    markSeen: async () => true,
  },
  consultants: {
    list: async () => [],
    create: async (x) => ({ ...x, id: Date.now(), createdAt: new Date().toISOString() }),
    remove: async () => true,
  },
};

if (!mockApi || typeof mockApi !== 'object') {
  // eslint-disable-next-line no-console
  console.warn('[api] mockApi import failed; using safe fallbacks for all resources.');
}

export const api = {
  // Prefer real impl if present, otherwise safe fallbacks
  students: mockApi?.students ?? safe.students,
  leads: mockApi?.leads ?? safe.leads,
  documents: mockApi?.documents ?? safe.documents,
  threads: mockApi?.threads ?? safe.threads,
  messages: mockApi?.messages ?? safe.messages,
  consultants: mockApi?.consultants ?? safe.consultants,
};

export default api;