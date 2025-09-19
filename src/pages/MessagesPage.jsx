 // src/pages/MessagesPage.jsx
import React, { useEffect, useRef, useState } from 'react';
 import { useAuth } from '@/components/AuthContext.jsx';
 import { api } from '@/lib/api.js'              // if in src/lib, use '@/lib/api.js'
 import styles from '@styles/InboxLists.module.css';
 import layoutStyles from '@styles/Layout.module.css';
 import buttonStyles from '@styles/Buttons.module.css';


export default function MessagesPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const [threads, setThreads] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const endRef = useRef(null);
  const taRef = useRef(null);

  // Load only threads containing current user
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoadingThreads(true);
      // FIXED: Removed .messaging
      const ts = await api.threads.listForUser(userId);
      setThreads(ts);
      setLoadingThreads(false);
      if (!activeId && ts.length) setActiveId(ts[0].id);
    })();
  }, [userId]);

  // Load messages for selected thread and mark incoming as seen
  useEffect(() => {
    if (!userId || !activeId) return;
    (async () => {
      setLoadingMsgs(true);
      // FIXED: Removed .messaging
      const msgs = await api.messages.list(activeId);
      setMessages(msgs);
      // FIXED: Removed .messaging
      await api.messages.markSeen(activeId, userId);
      // refresh threads so unread dots update
      // FIXED: Removed .messaging
      const ts = await api.threads.listForUser(userId);
      setThreads(ts);
      setLoadingMsgs(false);
      // focus input and scroll
      setTimeout(() => {
        taRef.current?.focus();
        endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 0);
    })();
  }, [userId, activeId]);

  const onSend = async () => {
    const text = (input || '').trim();
    if (!text) return; // ignore blanks
    const thread = threads.find(t => t.id === activeId);
    if (!thread) return;
    // naive 1:1: choose first other member as recipient
    const toId = (thread.memberUserIds || []).find(id => id !== userId) || null;
    // FIXED: Removed .messaging
    const msg = await api.messages.create({
      threadId: activeId,
      fromUserId: userId,
      toUserId: toId,
      body: text,
    });
    setMessages(prev => [...prev, msg]);
    setInput('');
    // Move thread to top
    // FIXED: Removed .messaging
    const ts = await api.threads.listForUser(userId);
    setThreads(ts);
    // Autoscroll
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }), 0);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const unreadDot = (t) => t._unread > 0 ? <span className={styles['inbox__dot']} aria-hidden="true" /> : null;

  return (
    <div className={styles['inbox']}>
      {/* LEFT: Threads */}
      <aside className={styles['inbox__sidebar']}>
        <div className={styles['inbox__sidebar-header']}>Messages</div>
        {loadingThreads ? (
          <div className={styles['inbox__empty']}>Loading threads…</div>
        ) : threads.length === 0 ? (
          <div className={styles['inbox__empty']}>No threads yet</div>
        ) : (
          <ul className={styles['inbox__threads']}>
            {threads.map(t => (
              <li
                key={t.id}
                className={`${styles['inbox__thread']} ${t.id === activeId ? styles['inbox__thread--active'] : ''}`}
                onClick={() => setActiveId(t.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveId(t.id)}
              >
                <div className={styles['inbox__thread-title']}>
                  {t.title}
                  {unreadDot(t)}
                </div>
                <div className={styles['inbox__thread-meta']}>
                  Last activity {new Date(t.lastActivityAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* RIGHT: Messages */}
      <section className={styles['inbox__content']}>
        {!activeId ? (
          <div className={styles['inbox__placeholder']}>Select a thread to start</div>
        ) : (
          <>
            <div className={styles['inbox__messages']}>
              {loadingMsgs ? (
                <div className={styles['inbox__empty']}>Loading…</div>
              ) : messages.length === 0 ? (
                <div className={styles['inbox__empty']}>No messages yet</div>
              ) : (
                messages.map(m => {
                  const mine = m.fromUserId === userId;
                  return (
                    <div key={m.id} className={`${styles['msg']} ${mine ? styles['msg--out'] : styles['msg--in']}`}>
                      <div className="msg__body">{m.body}</div>
                      <div className={styles['msg__meta']}>{new Date(m.createdAt).toLocaleString()}</div>
                    </div>
                  );
                })
              )}
              <div ref={endRef} />
            </div>

            <div className={styles['inbox__composer']}>
              <textarea
                ref={taRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                className={styles['inbox__input']}
                rows={2}
              />
              <button onClick={onSend} className={styles['inbox__send']} disabled={!input.trim()}>
                Send
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}