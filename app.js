/**
 * MENTRA — AI Learning Companion Mobile App Prototype
 * Application Logic, Screen Routing & Interactive Handlers
 */

// Selected state
let userProfile = {
  goal: 'Study & Academics 🎓',
  learningStyle: 'Bite-sized & Interactive ⚡',
  currentConcept: 'Feedback & Retention',
  assignmentSubmitted: false,
  readinessPct: 63
};

// AI Knowledge Base responses for live tutor simulation
const AI_RESPONSES = {
  'explain about ultra-learning': {
    title: 'Ultra-Learning Breakdown 🚀',
    body: `<strong>Ultra-Learning</strong> is a strategy for aggressive, self-directed skill acquisition.
    <br><br>
    <strong>3 Core Principles:</strong>
    <ol style="margin-left: 18px; margin-top: 6px;">
      <li><strong>Meta-Learning:</strong> First map out <em>how</em> to learn the subject.</li>
      <li><strong>Directness:</strong> Practice by actually executing the real task.</li>
      <li><strong>Feedback:</strong> Seek rapid, unvarnished feedback loops.</li>
    </ol>`,
    actionText: 'Explore Ultra-Learning Module →',
    actionScreen: 's-topic-detail'
  },
  'explain this topic simply': {
    title: 'Ultra-Learning in Plain English 💡',
    body: `Think of Ultra-Learning like training for a marathon: instead of just reading books about running, you put on your shoes, track your split times on day 1, and isolate your weakest muscle groups to improve faster.`,
    actionText: 'Review Key Concepts →',
    actionScreen: 's-topic-detail'
  },
  'create a learning plan': {
    title: 'Personalized 7-Day Ultra-Learning Plan 📅',
    body: `<strong>Day 1–2:</strong> Deconstruct the domain into core concepts.<br>
           <strong>Day 3–5:</strong> 90-minute deep-work drills on your biggest bottleneck.<br>
           <strong>Day 6:</strong> Build a real-world synthesis project.<br>
           <strong>Day 7:</strong> AI retention quiz & feedback review.`,
    actionText: 'Start Day 1 Module →',
    actionScreen: 's-topic-detail'
  },
  'summarize key concepts': {
    title: 'Key Concepts Summary 📌',
    body: `1. <strong>Meta-Learning:</strong> Drawing the knowledge map.<br>
           2. <strong>Focus:</strong> Eliminating cognitive drag.<br>
           3. <strong>Directness:</strong> Real-world execution.<br>
           4. <strong>Drill:</strong> Isolating the rate-limiting step.<br>
           5. <strong>Retention:</strong> Spaced active recall.`,
    actionText: 'Take Practice Drill →',
    actionScreen: 's-assignment'
  }
};

/**
 * Screen Navigation Router
 * @param {string} screenId 
 */
function navigateToScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen-view').forEach(view => {
    view.classList.remove('active');
  });

  // Activate selected screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.add('active');
    // Scroll container back to top
    const container = document.getElementById('screenContentArea');
    if (container) container.scrollTop = 0;
  }

  // Update top quick nav bar
  document.querySelectorAll('.quick-nav-btn').forEach(btn => {
    const onclickAttr = btn.getAttribute('onclick') || '';
    if (onclickAttr.includes(`'${screenId}'`)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update bottom tab navigation
  const bottomNav = document.getElementById('appBottomNav');
  if (screenId === 's-welcome' || screenId === 's-goal' || screenId === 's-step2') {
    if (bottomNav) bottomNav.style.display = 'none';
  } else {
    if (bottomNav) bottomNav.style.display = 'flex';
  }

  // Set active bottom tab
  document.querySelectorAll('.nav-tab-item').forEach(tab => tab.classList.remove('active'));
  if (screenId === 's-home') {
    const homeTab = document.getElementById('tab-home');
    if (homeTab) homeTab.classList.add('active');
  } else if (screenId === 's-ai-chat') {
    const aiTab = document.getElementById('tab-ai');
    if (aiTab) aiTab.classList.add('active');
  } else if (screenId === 's-topic-detail') {
    const topicsTab = document.getElementById('tab-topics');
    if (topicsTab) topicsTab.classList.add('active');
  } else if (screenId === 's-progress' || screenId === 's-assignment') {
    const profTab = document.getElementById('tab-profile');
    if (profTab) profTab.classList.add('active');
  }
}

/**
 * Goal Option Card Selection
 */
function selectGoalCard(cardElement, goalName) {
  const parent = cardElement.parentElement;
  parent.querySelectorAll('.goal-option-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');

  userProfile.goal = goalName;
  const goalBadgeText = document.getElementById('currentGoalText');
  if (goalBadgeText) {
    goalBadgeText.textContent = goalName.replace(/[\uD800-\uDFFF].*/, '').trim();
  }

  const continueBtn = document.getElementById('goalContinueBtn');
  if (continueBtn) {
    continueBtn.disabled = false;
  }
}

/**
 * Single Selection Helper
 */
function selectCardSingle(cardElement) {
  const parent = cardElement.parentElement;
  parent.querySelectorAll('.goal-option-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');
}

/**
 * Plan Generation Simulation
 */
function launchAIPlanGeneration() {
  const btn = event.target;
  btn.innerHTML = '✨ Generating AI Learning Path...';
  btn.style.opacity = '0.85';

  setTimeout(() => {
    navigateToScreen('s-home');
    btn.innerHTML = 'Generate My Learning Path ✨';
    btn.style.opacity = '1';
  }, 700);
}

/**
 * Trigger Home Search Query
 */
function submitHomePrompt() {
  const input = document.getElementById('homeSearchPrompt');
  const query = input ? input.value.trim() : 'Explain about Ultra-learning';
  if (!query) return;

  triggerChatQuery(query);
}

function handleHomeSearchKeyPress(event) {
  if (event.key === 'Enter') {
    submitHomePrompt();
  }
}

/**
 * Trigger Quick Prompt Chips from Hero Card
 */
function triggerQuickPrompt(chipText) {
  triggerChatQuery(chipText);
}

/**
 * Chat Simulation Engine
 */
function triggerChatQuery(query) {
  navigateToScreen('s-ai-chat');
  const chatBox = document.getElementById('chatMessagesBox');
  if (!chatBox) return;

  // Add User message
  const userBubble = document.createElement('div');
  userBubble.className = 'chat-bubble user';
  userBubble.textContent = query;
  chatBox.appendChild(userBubble);

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;

  // AI Thinking indicator
  const typingBubble = document.createElement('div');
  typingBubble.className = 'chat-bubble ai';
  typingBubble.innerHTML = '<em>Mentra is thinking... 💭</em>';
  chatBox.appendChild(typingBubble);
  chatBox.scrollTop = chatBox.scrollHeight;

  setTimeout(() => {
    typingBubble.remove();

    const normalizedKey = query.toLowerCase().trim();
    const responseData = AI_RESPONSES[normalizedKey] || {
      title: `Learning Companion Insight on "${query}"`,
      body: `Mentra AI analyzed your inquiry about <strong>${escapeHtml(query)}</strong>.
             By connecting this to first-principles thinking and immediate practice drills, you can retain this concept with 3x higher recall.`,
      actionText: 'Deep-dive in Detail Topics →',
      actionScreen: 's-topic-detail'
    };

    const aiBubble = document.createElement('div');
    aiBubble.className = 'chat-bubble ai';
    aiBubble.innerHTML = `
      <strong>${responseData.title}</strong><br>
      ${responseData.body}
      <div class="chat-interactive-card" style="margin-top:10px;">
        <button class="btn-primary" style="height:36px; font-size:12px; width:auto; padding:0 14px;" onclick="navigateToScreen('${responseData.actionScreen}')">
          ${responseData.actionText}
        </button>
      </div>
    `;

    chatBox.appendChild(aiBubble);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 600);
}

function sendChatMessage() {
  const input = document.getElementById('chatInputText');
  if (!input || !input.value.trim()) return;
  const msg = input.value.trim();
  input.value = '';
  triggerChatQuery(msg);
}

function handleChatInputKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

/**
 * Ask Mentra About a Specific Concept
 */
function askMentraAboutConcept(conceptName) {
  triggerChatQuery(`Explain ${conceptName} in detail`);
}

/**
 * Concept Accordion Toggle
 */
function toggleAccordion(btnElement) {
  const item = btnElement.closest('.concept-accordion-item');
  const body = item.querySelector('.concept-body');
  if (!body) return;

  const isCurrentlyOpen = body.style.display === 'block';

  // Optional: close other accordions
  document.querySelectorAll('.concept-accordion-item .concept-body').forEach(b => {
    b.style.display = 'none';
  });
  document.querySelectorAll('.concept-accordion-item').forEach(i => {
    i.classList.remove('active-lesson');
  });

  if (!isCurrentlyOpen) {
    body.style.display = 'block';
    item.classList.add('active-lesson');
  }
}

/**
 * File Upload Simulation for Assignment
 */
function simulateFileUpload() {
  const container = document.getElementById('dropzoneContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="submitted-file-card">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:20px;">📄</span>
        <div>
          <div style="font-size:13.5px; font-weight:700; color:var(--neutral-900);">User_Research_Synthesis_Alex.pdf</div>
          <div style="font-size:11px; color:var(--success-700);">Ready to submit · 1.4 MB</div>
        </div>
      </div>
      <span style="background:#FFFFFF; color:#027A48; border:1px solid #A6F4C5; padding:3px 8px; border-radius:6px; font-size:11px;">✓ Ready</span>
    </div>
  `;
}

/**
 * Assignment Submission
 */
function submitAssignment() {
  const btn = document.getElementById('submitAssignmentBtn');
  const badge = document.getElementById('assignmentBadge');
  const container = document.getElementById('dropzoneContainer');

  if (container && !container.querySelector('.submitted-file-card')) {
    simulateFileUpload();
  }

  if (badge) {
    badge.className = 'concept-status-badge badge-completed';
    badge.style.background = '#ECFDF3';
    badge.style.color = '#027A48';
    badge.textContent = '● Submitted';
  }

  if (btn) {
    btn.textContent = 'Submitted ✓ (AI Grading)';
    btn.style.background = 'var(--success-500)';
    btn.style.boxShadow = 'none';
    btn.disabled = true;
  }

  userProfile.assignmentSubmitted = true;
  userProfile.readinessPct = 78;

  setTimeout(() => {
    alert('🎉 Drill Submitted! Mentra AI has graded your synthesis: Score 94/100. Readiness boosted to 78%!');
  }, 400);
}

/**
 * Toggle Readiness Details Box
 */
function toggleReadinessWhy() {
  const box = document.getElementById('readinessWhyBox');
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
}

/**
 * Toggle Design Inspector Drawer
 */
function toggleInspector() {
  const drawer = document.getElementById('inspectorDrawer');
  if (drawer) {
    drawer.classList.toggle('open');
  }
}

/**
 * Helper to escape HTML characters
 */
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  console.log('Mentra AI Learning Companion initialized.');
});
