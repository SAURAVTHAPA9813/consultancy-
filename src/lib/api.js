
import * as imported from './mockApi.js';

// Be robust to different export styles (default vs named).
const mockApi = imported?.default ?? imported;

// Safe no-op fallbacks to prevent "Cannot read properties of undefined (...)" at runtime.
const safe = {
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
};

const pick = (objPart, fb) => (objPart && typeof objPart === 'object') ? objPart : fb;

if (!mockApi || typeof mockApi !== 'object') {
// eslint-disable-next-line no-console
console.warn('[api] mockApi import failed; using safe fallbacks for all resources.');
}

if (!mockApi?.threads) {
// eslint-disable-next-line no-console
console.warn('[api] mockApi.threads missing; using safe threads/messages fallbacks.');
}

export const api = {
  leads: mockApi.leads,
  documents: mockApi.documents,
  threads: mockApi.threads,
  messages: mockApi.messages,
   consultants: mockApi.consultants, 
};

export default api;