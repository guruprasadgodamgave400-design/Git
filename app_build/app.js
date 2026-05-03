/* ============================================================
   app.js — AI Chatbot for Coaching Institute
   Connects to Node.js backend → Ollama (llama3)
   ============================================================ */

const API_URL = 'http://localhost:3000/chat';

// ─── DOM References ────────────────────────────────────────────────────────────
const chatToggleBtn  = document.getElementById('chat-toggle-btn');
const chatPanel      = document.getElementById('chat-panel');
const chatCloseX     = document.getElementById('chat-close-x');
const chatMessages   = document.getElementById('chat-messages');
const chatInput      = document.getElementById('chat-input');
const chatSendBtn    = document.getElementById('chat-send-btn');
const chatIconOpen   = document.getElementById('chat-icon-open');
const chatIconClose  = document.getElementById('chat-icon-close');

// ─── State ─────────────────────────────────────────────────────────────────────
let isOpen    = false;
let isLoading = false;

// ─── Toggle Chat Panel ─────────────────────────────────────────────────────────
function toggleChat() {
    isOpen = !isOpen;
    chatPanel.classList.toggle('chat-open', isOpen);
    chatIconOpen.style.display  = isOpen ? 'none'         : 'inline-block';
    chatIconClose.style.display = isOpen ? 'inline-block' : 'none';

    if (isOpen) {
        // Show welcome message on first open
        if (chatMessages.children.length === 0) {
            appendMessage(
                'ai',
                '👋 Hi! I\'m your AI Coaching Assistant.\n\nI can help you with:\n• MPSC & UPSC exam preparation\n• Study strategies and tips\n• Subject explanations\n• Current affairs guidance\n\nHow can I help you today?'
            );
        }
        setTimeout(() => chatInput.focus(), 300);
    }
}

chatToggleBtn.addEventListener('click', toggleChat);
chatCloseX.addEventListener('click', toggleChat);

// ─── Send Message ──────────────────────────────────────────────────────────────
async function sendMessage() {
    const text = chatInput.value.trim();

    // Validation
    if (!text) {
        chatInput.focus();
        chatInput.style.borderColor = '#e74c3c';
        setTimeout(() => { chatInput.style.borderColor = ''; }, 1500);
        return;
    }

    if (isLoading) return;

    // Render user bubble and clear input
    appendMessage('user', text);
    chatInput.value = '';
    chatInput.style.height = 'auto';

    // Show loading state
    isLoading = true;
    chatSendBtn.disabled = true;
    const loadingEl = appendLoading();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Server error: ${response.status}`);
        }

        removeLoading(loadingEl);
        appendMessage('ai', data.reply || 'I received your message but couldn\'t generate a response.');

    } catch (err) {
        removeLoading(loadingEl);
        console.error('Chat error:', err);

        let errorMsg = '⚠️ Something went wrong. Please try again.';

        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
            errorMsg = '🔌 Cannot connect to the backend. Please make sure the server is running:\n\nnode backend/server.js';
        } else if (err.message.includes('Ollama')) {
            errorMsg = '🤖 ' + err.message;
        } else if (err.message) {
            errorMsg = '⚠️ ' + err.message;
        }

        appendMessage('error', errorMsg);
    } finally {
        isLoading = false;
        chatSendBtn.disabled = false;
        chatInput.focus();
    }
}

// ─── Append Message Bubble ─────────────────────────────────────────────────────
function appendMessage(type, text) {
    const isUser  = type === 'user';
    const isError = type === 'error';

    const row = document.createElement('div');
    row.className = `chat-bubble-row ${isUser ? 'user-row' : ''}`;

    const avatar = document.createElement('div');
    avatar.className = `chat-bubble-avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`;
    avatar.innerHTML = isUser
        ? '<i class="fas fa-user"></i>'
        : '<i class="fas fa-robot"></i>';

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${isUser ? 'user-bubble' : isError ? 'ai-bubble error-bubble' : 'ai-bubble'}`;
    bubble.textContent = text;

    row.appendChild(avatar);
    row.appendChild(bubble);
    chatMessages.appendChild(row);
    scrollToBottom();

    return row;
}

// ─── Loading Indicator ─────────────────────────────────────────────────────────
function appendLoading() {
    const row = document.createElement('div');
    row.className = 'chat-loading-row';

    const avatar = document.createElement('div');
    avatar.className = 'chat-bubble-avatar ai-avatar';
    avatar.innerHTML = '<i class="fas fa-robot"></i>';

    const dots = document.createElement('div');
    dots.className = 'chat-loading-dots';
    dots.innerHTML = '<span></span><span></span><span></span>';

    row.appendChild(avatar);
    row.appendChild(dots);
    chatMessages.appendChild(row);
    scrollToBottom();

    return row;
}

function removeLoading(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

// ─── Scroll to Bottom ──────────────────────────────────────────────────────────
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ─── Keyboard Events ──────────────────────────────────────────────────────────
chatInput.addEventListener('keydown', (e) => {
    // Enter without Shift → send message
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Auto-resize textarea as user types
chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
});

chatSendBtn.addEventListener('click', sendMessage);

// ─── Scroll Animations (existing site functionality) ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));
});
