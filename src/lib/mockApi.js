// src/lib/mockApi.js
// Tiny localStorage-backed mock API with gentle latency.
// Now supports: students, documents, threads, messages.

const KEYS = {
  STUDENTS: 'cms.students', // ✅ FIXED: Updated from 'cms.leads'
  DOCUMENTS: 'cms.documents',
  MESSAGES: 'cms.messages',
  PROJECTS: 'cms.projects',
  CONSULTANTS: 'cms.consultants'
};

const delay = (ms = 250) => new Promise(r => setTimeout(r, ms));

const read = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

// ----- Seed once (safe: only if missing) -----
function boot() {
  if (!localStorage.getItem(KEYS.LEADS)) {
    write(KEYS.LEADS, [
      { id: 1, name: 'Client1', email: 'client1@example.com', status: 'active',   branch: 'Main', createdAt: '2024-01-10T10:00:00Z' },
      { id: 2, name: 'Client2', email: 'client2@example.com', status: 'inactive', branch: 'Main', createdAt: '2024-01-12T12:00:00Z' },
      { id: 3, name: 'Client3', email: 'client3@example.com', status: 'active',   branch: 'Main', createdAt: '2024-01-15T15:30:00Z' },
    ]);
  }
  if (!localStorage.getItem(KEYS.DOCS)) {
    write(KEYS.DOCS, [
      { id: 1, name: 'Project Proposal.pdf', size: '2.5 MB', uploadedAt: '2024-01-15', type: 'pdf',  branch: 'Main', dataUrl: null },
      { id: 2, name: 'Client Contract.docx', size: '1.2 MB', uploadedAt: '2024-01-10', type: 'docx', branch: 'Main', dataUrl: null },
      { id: 3, name: 'Financial Report.xlsx', size: '3.8 MB', uploadedAt: '2024-01-05', type: 'xlsx', branch: 'Main', dataUrl: null },
    ]);
  }
  if (!localStorage.getItem(KEYS.THREADS)) {
    // Seed a single 1:1 thread between user id 1 (admin) and 2 (client)
    write(KEYS.THREADS, [
      {
        id: 1001,
        title: 'Welcome & Onboarding',
        memberUserIds: [1, 2],
        lastActivityAt: '2024-02-01T09:00:00Z'
      }
    ]);
  }
  if (!localStorage.getItem(KEYS.MSGS)) {
    write(KEYS.MSGS, [
      { id: 5001, threadId: 1001, fromUserId: 1, toUserId: 2, body: 'Welcome aboard! Let me know any questions 😊', createdAt: '2024-02-01T08:55:00Z', seenBy: [1] },
      { id: 5002, threadId: 1001, fromUserId: 2, toUserId: 1, body: 'Thanks! When do we start the kickoff?',        createdAt: '2024-02-01T09:00:00Z', seenBy: [2] },
    ]);
  }
}
// Add consultants CRUD operations:
const consultants = {
  async list() { 
    boot(); 
    await delay(); 
    return read(KEYS.CONSULTANTS); 
  },

  async create(consultant) {
    boot();
    const items = read(KEYS.CONSULTANTS);
    const created = {
      id: consultant.id ?? Date.now(),
      name: consultant.name || '',
      email: consultant.email || '',
      phone: consultant.phone || '',
      expertise: consultant.expertise || [], // ['visa', 'university', 'documentation']
      branch: consultant.branch || 'Main',
      isActive: consultant.isActive !== false,
      assignedStudents: [],
      completedApplications: 0,
      joinedDate: consultant.joinedDate || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    write(KEYS.CONSULTANTS, [created, ...items]);
    await delay();
    return created;
  },

  async remove(id) {
    boot();
    write(KEYS.CONSULTANTS, read(KEYS.CONSULTANTS).filter(x => x.id !== id));
    await delay();
    return true;
  }
};
// mockApi.js - Updated with Students API

// Update storage keys


// ✅ FIXED: Students API (was leads)
const students = {
  async list() {
    boot();
    await delay();
    
    // Migration: Check if we need to migrate from old leads data
    let students = read(KEYS.STUDENTS);
    if (students.length === 0) {
      // Try to migrate from old leads data if it exists
      const oldLeads = read('cms.leads'); // old key
      if (oldLeads.length > 0) {
        console.log('Migrating leads data to students...');
        students = oldLeads.map(lead => ({
          ...lead,
          // Keep existing fields but ensure student-appropriate defaults
          highestDegree: lead.highestDegree || '',
          currentGPA: lead.currentGPA || '',
          intendedCountry: lead.intendedCountry || '',
          assignedConsultant: lead.assignedConsultant || null,
          // Add new student-specific fields
          applicationStatus: 'preparing',
          documentChecklist: [
            { name: 'Passport', status: 'pending', required: true },
            { name: 'Academic Transcripts', status: 'pending', required: true },
            { name: 'Statement of Purpose', status: 'pending', required: true },
            { name: 'Letters of Recommendation', status: 'pending', required: true },
            { name: 'English Test Scores', status: 'pending', required: true }
          ],
          academicBackground: {
            institution: lead.company || '', // Migrate company to institution
            graduationYear: '',
            fieldOfStudy: '',
            achievements: []
          },
          studyPreferences: {
            preferredCourses: [],
            budgetRange: lead.budget || '',
            timeline: lead.timeline || ''
          }
        }));
        write(KEYS.STUDENTS, students);
        console.log(`Migrated ${students.length} students from leads data`);
      }
    }
    
    return students;
  },

  async get(id) {
    boot();
    await delay();
    const items = read(KEYS.STUDENTS);
    // Convert both to numbers for comparison since URL params are strings
    const student = items.find(item => Number(item.id) === Number(id));
    return student || null;
  },

  async create(studentData) {
    boot();
    const items = read(KEYS.STUDENTS);
    const created = {
      id: studentData.id ?? Date.now(),
      createdAt: studentData.createdAt || new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: studentData.status || 'active',
      branch: studentData.branch || 'Main',
      
      // Personal Information
      name: studentData.name || 'Unnamed Student',
      email: studentData.email || '',
      phone: studentData.phone || '',
      address: studentData.address || '',
      
      // Academic Information
      highestDegree: studentData.highestDegree || '',
      currentGPA: studentData.currentGPA || '',
      intendedCountry: studentData.intendedCountry || '',
      
      // Academic Background (enhanced structure)
      academicBackground: {
        institution: studentData.institution || studentData.company || '',
        graduationYear: studentData.graduationYear || '',
        fieldOfStudy: studentData.fieldOfStudy || '',
        achievements: studentData.achievements || []
      },
      
      // Study Preferences
      studyPreferences: {
        preferredCourses: studentData.preferredCourses || [],
        budgetRange: studentData.budget || '',
        timeline: studentData.timeline || ''
      },
      
      // Consultation Information
      source: studentData.source || 'Website Inquiry',
      assignedConsultant: studentData.assignedConsultant || null,
      specificNeeds: studentData.specificNeeds || '',
      nextSteps: studentData.nextSteps || '',
      notes: studentData.notes || '',
      
      // Application Status
      applicationStatus: studentData.applicationStatus || 'preparing',
      
      // Document Checklist
      documentChecklist: studentData.documentChecklist || [
        { name: 'Passport', status: 'pending', required: true, deadline: null },
        { name: 'Academic Transcripts', status: 'pending', required: true, deadline: null },
        { name: 'Statement of Purpose', status: 'pending', required: true, deadline: null },
        { name: 'Letters of Recommendation', status: 'pending', required: true, deadline: null },
        { name: 'English Test Scores', status: 'pending', required: true, deadline: null }
      ]
    };
    
    write(KEYS.STUDENTS, [created, ...items]);
    await delay();
    return created;
  },

  async update(id, patch = {}) {
    boot();
    const items = read(KEYS.STUDENTS);
    const index = items.findIndex(student => Number(student.id) === Number(id));
    
    if (index !== -1) {
      items[index] = { 
        ...items[index], 
        ...patch, 
        lastUpdated: new Date().toISOString() 
      };
      write(KEYS.STUDENTS, items);
      await delay();
      return items[index];
    }
    
    await delay();
    return null;
  },

  async remove(id) {
    boot();
    const items = read(KEYS.STUDENTS);
    const filtered = items.filter(student => Number(student.id) !== Number(id));
    write(KEYS.STUDENTS, filtered);
    await delay();
    return true;
  },

  // Additional student-specific methods
  async updateApplicationStatus(id, status) {
    return this.update(id, { applicationStatus: status });
  },

  async updateDocumentStatus(id, documentName, status) {
    const student = await this.get(id);
    if (student) {
      const updatedChecklist = student.documentChecklist.map(doc => 
        doc.name === documentName ? { ...doc, status } : doc
      );
      return this.update(id, { documentChecklist: updatedChecklist });
    }
    return null;
  },

  async assignConsultant(id, consultantName) {
    return this.update(id, { assignedConsultant: consultantName });
  }
};

// Keep legacy leads object for backward compatibility during transition
const leads = {
  async list() {
    console.warn('leads.list() is deprecated. Use students.list() instead.');
    return students.list();
  },
  
  async get(id) {
    console.warn('leads.get() is deprecated. Use students.get() instead.');
    return students.get(id);
  },
  
  async create(data) {
    console.warn('leads.create() is deprecated. Use students.create() instead.');
    return students.create(data);
  },
  
  async update(id, patch) {
    console.warn('leads.update() is deprecated. Use students.update() instead.');
    return students.update(id, patch);
  },
  
  async remove(id) {
    console.warn('leads.remove() is deprecated. Use students.remove() instead.');
    return students.remove(id);
  }
};



// ----- Documents -----
const documents = {
  async list() { boot(); await delay(); return read(KEYS.DOCS); },
  async create(doc) {
    boot();
    const items = read(KEYS.DOCS);
    const created = {
      id: doc.id ?? Date.now(),
      uploadedAt: doc.uploadedAt || new Date().toISOString().split('T')[0],
      branch: doc.branch || 'Main',
      name: doc.name || 'untitled',
      size: doc.size || '0.00 MB',
      type: doc.type || 'file',
      dataUrl: doc.dataUrl ?? null,
    };
    write(KEYS.DOCS, [created, ...items]);
    await delay();
    return created;
  },
  async remove(id) {
    boot();
    write(KEYS.DOCS, read(KEYS.DOCS).filter(x => x.id !== id));
    await delay();
    return true;
  },
};

// ----- Messaging: Threads & Messages -----
function sortDescByActivity(threads) {
  return [...threads].sort((a, b) => new Date(b.lastActivityAt) - new Date(a.lastActivityAt));
}

const threads = {
  async listForUser(userId) {
    boot(); await delay();
    const allThreads = read(KEYS.THREADS);
    const allMsgs = read(KEYS.MSGS);
    const mine = allThreads.filter(t => (t.memberUserIds || []).includes(userId));
    // compute unread count per thread for this user
    const withMeta = mine.map(t => {
      const tMsgs = allMsgs.filter(m => m.threadId === t.id);
      const unread = tMsgs.filter(m => m.toUserId === userId && !(m.seenBy || []).includes(userId)).length;
      return { ...t, _unread: unread };
    });
    return sortDescByActivity(withMeta);
  },
  async touch(threadId, ts = new Date().toISOString()) {
    boot();
    const list = read(KEYS.THREADS);
    const idx = list.findIndex(t => t.id === threadId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], lastActivityAt: ts };
      write(KEYS.THREADS, list);
    }
    await delay(150);
    return list[idx] ?? null;
  },
  async get(threadId) {
    boot(); await delay(150);
    return read(KEYS.THREADS).find(t => t.id === threadId) || null;
  },
};

const messages = {
  async list(threadId) {
    boot(); await delay();
    return read(KEYS.MSGS).filter(m => m.threadId === threadId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  },
  async create({ threadId, fromUserId, toUserId, body }) {
    boot();
    const msg = {
      id: Date.now(),
      threadId,
      fromUserId,
      toUserId,
      body: String(body || '').slice(0, 4000),
      createdAt: new Date().toISOString(),
      seenBy: [fromUserId], // sender has "seen" it
    };
    write(KEYS.MSGS, [msg, ...read(KEYS.MSGS)]);
    await threads.touch(threadId, msg.createdAt);
    await delay(120);
    return msg;
  },
  async markSeen(threadId, userId) {
    boot();
    const msgs = read(KEYS.MSGS);
    let changed = false;
    const updated = msgs.map(m => {
      if (m.threadId === threadId && m.toUserId === userId && !(m.seenBy || []).includes(userId)) {
        changed = true;
        return { ...m, seenBy: [...(m.seenBy || []), userId] };
      }
      return m;
    });
    if (changed) write(KEYS.MSGS, updated);
    await delay(100);
    return true;
  },
};

const mockApi = { boot, leads, documents, threads, messages, consultants };
export const api = mockApi;

export default api;
