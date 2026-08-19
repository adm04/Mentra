/**
 * MENTRA — CAREER READINESS APPLICATION
 * Interactive State Management, Discovery Quiz, Readiness Calculations & Action Flows
 */

// Core Application State
const appState = {
  user: {
    name: 'Arka',
    role: 'Product Designer',
    experience: '3+ years',
    goal: 'Get a new job',
    streakDays: 5
  },
  readiness: {
    overall: 72,
    categories: {
      resume: 90,
      portfolio: 75,
      interview: 60,
      profile: 80,
      jobSearch: 55
    }
  },
  quizCurrentIndex: 0,
  selectedQuizOption: null,
  inactivitySimulated: false,
  activeTaskId: null,
  tasks: [
    {
      id: 'task-1',
      title: 'Improve resume headline & summary',
      category: 'Resume',
      duration: '15 min',
      priority: 'high',
      boost: 8,
      completed: false,
      why: 'Recruiters spend ~6 seconds scanning. A strong headline clearly communicates your specialty as a Product Designer.',
      checklist: [
        'Rewrite headline to match target role',
        'Mention core expertise & design systems',
        'Add measurable business impact',
        'Review final version against ATS keywords'
      ]
    },
    {
      id: 'task-2',
      title: 'Complete portfolio case study impact section',
      category: 'Portfolio',
      duration: '30 min',
      priority: 'high',
      boost: 7,
      completed: false,
      why: 'Case studies with quantified outcomes increase interview callback rates by over 40%.',
      checklist: [
        'Document the initial baseline problem',
        'Show user research synthesis artifacts',
        'Highlight final measurable metrics (e.g. +22% conversion)',
        'Add live prototype walkthrough link'
      ]
    },
    {
      id: 'task-3',
      title: 'Practice 10 core behavioral interview questions',
      category: 'Interview',
      duration: '20 min',
      priority: 'high',
      boost: 6,
      completed: false,
      why: 'Practicing out loud improves delivery and reduces anxiety under pressure.',
      checklist: [
        'Answer "Tell me about yourself"',
        'Prepare 2 conflict-resolution stories (STAR method)',
        'Structure a response around a design compromise',
        'Time answers under 2.5 minutes'
      ]
    },
    {
      id: 'task-4',
      title: 'Update LinkedIn experience highlights',
      category: 'Profile',
      duration: '15 min',
      priority: 'medium',
      boost: 4,
      completed: false,
      why: 'Keeping your LinkedIn headline and featured projects synchronized boosts recruiter inbound reach.',
      checklist: [
        'Sync headline with resume title',
        'Pin top 2 design case studies to Featured section',
        'Update skills list with Figma and Design Systems'
      ]
    },
    {
      id: 'task-5',
      title: 'Create target company application tracker',
      category: 'Job Search',
      duration: '10 min',
      priority: 'medium',
      boost: 3,
      completed: false,
      why: 'Systematic tracking helps prioritize warm referrals over cold submissions.',
      checklist: [
        'List top 10 target design teams',
        'Identify 1 alumni or 2nd-degree connection per company',
        'Set weekly application cadence goals'
      ]
    }
  ]
};

// 8 Discovery Quiz Questions
const QUIZ_QUESTIONS = [
  {
    title: 'What are you preparing for?',
    subtitle: 'Select what best matches your current focus.',
    options: ['Getting a new job', 'Switching careers', 'Getting promoted', 'Preparing for interviews']
  },
  {
    title: 'How confident are you in your current resume?',
    subtitle: 'Evaluate your structure, impact bullets, and ATS readiness.',
    options: ['Not confident', 'Somewhat confident', 'Confident', 'Very confident']
  },
  {
    title: 'How ready is your portfolio?',
    subtitle: 'Consider case study depth, live links, and problem-solving narrative.',
    options: ["I don't have one", 'Needs major work', 'Mostly ready', 'Ready to share']
  },
  {
    title: 'How comfortable are you with interviews?',
    subtitle: 'Think about behavioral questions and live portfolio walkthroughs.',
    options: ['Very uncomfortable', 'Somewhat uncomfortable', 'Comfortable', 'Very comfortable']
  },
  {
    title: 'How often do you practice interview questions?',
    subtitle: 'Regular practice builds articulate STAR responses.',
    options: ['Never', 'Rarely', 'Sometimes', 'Regularly']
  },
  {
    title: 'How prepared are you for job applications?',
    subtitle: 'Tracking pipeline, tailored cover letters, and outreach strategy.',
    options: ['Just starting', 'Somewhat prepared', 'Mostly prepared', 'Fully prepared']
  },
  {
    title: 'How strong is your professional profile?',
    subtitle: 'LinkedIn, personal domain, and design community presence.',
    options: ['Needs work', 'Improving', 'Strong', 'Very strong']
  },
  {
    title: 'When do you want to be ready?',
    subtitle: 'This determines your daily plan pacing and priority sequencing.',
    options: ['This week', 'Within 2 weeks', 'Within a month', 'No specific deadline']
  }
];

// Predefined Mock Interview Questions
const MOCK_QUESTIONS = [
  'Tell me about a difficult product design trade-off you had to make and how you handled stakeholder alignment.',
  'Walk me through a project in your portfolio where your initial user assumption was proven wrong.',
  'How do you collaborate with engineering teams when technical constraints require simplifying your design?'
];
let currentMockQIndex = 0;

/**
 * Screen Navigation Router
 * @param {string} screenId 
 */
function goToScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.screen-view').forEach(s => s.classList.remove('active'));

  // Show target screen
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    const container = document.getElementById('screenContentArea');
    if (container) container.scrollTop = 0;
  }

  // Update top reviewer toolbar
  document.querySelectorAll('.flow-btn').forEach(btn => {
    const attr = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', attr.includes(`'${screenId}'`));
  });

  // Manage persistent bottom navigation visibility
  const bottomNav = document.getElementById('appBottomNav');
  const mainScreens = ['s-home', 's-plan', 's-progress', 's-profile'];
  if (bottomNav) {
    if (mainScreens.includes(screenId)) {
      bottomNav.style.display = 'flex';
    } else {
      bottomNav.style.display = 'none';
    }
  }

  // Update active bottom nav tab
  document.querySelectorAll('.nav-tab-item').forEach(tab => tab.classList.remove('active'));
  if (screenId === 's-home') document.getElementById('tab-home')?.classList.add('active');
  if (screenId === 's-plan') document.getElementById('tab-plan')?.classList.add('active');
  if (screenId === 's-progress') document.getElementById('tab-progress')?.classList.add('active');
  if (screenId === 's-profile') document.getElementById('tab-profile')?.classList.add('active');

  // Render UI updates if entering dashboard/plans
  if (screenId === 's-home' || screenId === 's-plan') {
    renderTasks();
  }
  updateReadinessDisplays();
}

/**
 * Start Discovery Quiz
 */
function startDiscoveryQuiz() {
  appState.quizCurrentIndex = 0;
  goToScreen('s-quiz');
  renderQuizQuestion();
}

/**
 * Render Current Quiz Question
 */
function renderQuizQuestion() {
  const q = QUIZ_QUESTIONS[appState.quizCurrentIndex];
  if (!q) return;

  const total = QUIZ_QUESTIONS.length;
  const progressPct = ((appState.quizCurrentIndex + 1) / total) * 100;

  document.getElementById('quizProgressBar').style.width = `${progressPct}%`;
  document.getElementById('quizStepCounter').textContent = `${appState.quizCurrentIndex + 1} of ${total}`;
  document.getElementById('quizQuestionTitle').textContent = q.title;
  document.getElementById('quizQuestionSubtitle').textContent = q.subtitle;

  const container = document.getElementById('quizOptionsContainer');
  container.innerHTML = '';

  q.options.forEach((opt, index) => {
    const card = document.createElement('div');
    card.className = `option-card ${index === 0 ? 'selected' : ''}`;
    card.onclick = () => selectQuizOption(card, opt);
    card.innerHTML = `
      <span class="option-text">${opt}</span>
      <div class="radio-circle">✓</div>
    `;
    container.appendChild(card);
  });

  appState.selectedQuizOption = q.options[0];
}

function selectQuizOption(cardElement, optionText) {
  const parent = cardElement.parentElement;
  parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');
  appState.selectedQuizOption = optionText;
}

/**
 * Next Quiz Question or Complete
 */
function nextQuizQuestion() {
  if (appState.quizCurrentIndex < QUIZ_QUESTIONS.length - 1) {
    appState.quizCurrentIndex++;
    renderQuizQuestion();
  } else {
    // Complete quiz -> Transition through calculation
    goToScreen('s-calculating');
    setTimeout(() => {
      goToScreen('s-readiness-result');
    }, 1200);
  }
}

/**
 * Render Task Cards in Home and Plan Screens
 */
function renderTasks() {
  const homeContainer = document.getElementById('homeTasksContainer');
  const planHighContainer = document.getElementById('planHighList');
  const planMediumContainer = document.getElementById('planMediumList');

  if (homeContainer) homeContainer.innerHTML = '';
  if (planHighContainer) planHighContainer.innerHTML = '';
  if (planMediumContainer) planMediumContainer.innerHTML = '';

  appState.tasks.forEach(task => {
    const card = createTaskCardElement(task);

    // Add to Home if not completed or recently completed
    if (homeContainer) {
      homeContainer.appendChild(card.cloneNode(true));
    }

    // Add to Plan according to priority
    if (task.priority === 'high' && planHighContainer) {
      planHighContainer.appendChild(card.cloneNode(true));
    } else if (task.priority === 'medium' && planMediumContainer) {
      planMediumContainer.appendChild(card.cloneNode(true));
    }
  });

  // Re-attach event listeners on cloned cards
  document.querySelectorAll('.task-card').forEach(c => {
    const id = c.getAttribute('data-task-id');
    c.onclick = () => openTaskDetail(id);
  });
}

function createTaskCardElement(task) {
  const card = document.createElement('div');
  card.className = `task-card ${task.completed ? 'completed' : ''}`;
  card.setAttribute('data-task-id', task.id);
  card.innerHTML = `
    <div class="task-check-circle">${task.completed ? '✓' : ''}</div>
    <div class="task-content">
      <div class="task-title">${task.title}</div>
      <div class="task-meta-row">
        <span>${task.duration} · ${task.category}</span>
        <span class="task-boost-tag">+${task.boost}% readiness</span>
      </div>
    </div>
  `;
  return card;
}

/**
 * Open Task Detail Modal & Checklist
 */
function openTaskDetail(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  appState.activeTaskId = taskId;
  document.getElementById('taskDetailCategory').textContent = `${task.category} · ${task.duration}`;
  document.getElementById('taskDetailTitle').textContent = task.title;

  const btn = document.getElementById('taskMarkCompleteBtn');
  if (task.completed) {
    btn.textContent = 'Completed ✓';
    btn.disabled = true;
    btn.style.background = 'var(--success-500)';
  } else {
    btn.textContent = `Mark Complete (+${task.boost}% Readiness) ✓`;
    btn.disabled = false;
    btn.style.background = 'var(--primary-600)';
  }

  // Populate checklist
  const checkContainer = document.getElementById('taskChecklistContainer');
  checkContainer.innerHTML = '';
  task.checklist.forEach(item => {
    const label = document.createElement('label');
    label.style.cssText = 'display:flex; align-items:center; gap:10px; font-size:13px; cursor:pointer;';
    label.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''} style="accent-color:var(--primary-600); width:18px; height:18px;">
      <span>${item}</span>
    `;
    checkContainer.appendChild(label);
  });

  openModal('modalTaskDetail');
}

/**
 * Complete Current Task & Update State Dynamically
 */
function completeCurrentTask() {
  const task = appState.tasks.find(t => t.id === appState.activeTaskId);
  if (!task || task.completed) return;

  task.completed = true;
  appState.readiness.overall = Math.min(100, appState.readiness.overall + task.boost);

  // Boost relevant category
  if (task.category === 'Resume') appState.readiness.categories.resume = 100;
  if (task.category === 'Portfolio') appState.readiness.categories.portfolio = Math.min(100, appState.readiness.categories.portfolio + 15);
  if (task.category === 'Interview') appState.readiness.categories.interview = Math.min(100, appState.readiness.categories.interview + 20);
  if (task.category === 'Profile') appState.readiness.categories.profile = 100;
  if (task.category === 'Job Search') appState.readiness.categories.jobSearch = Math.min(100, appState.readiness.categories.jobSearch + 25);

  updateReadinessDisplays();
  renderTasks();
  closeModal('modalTaskDetail');

  // Check if 100% reached
  if (appState.readiness.overall >= 100) {
    setTimeout(() => {
      goToScreen('s-celebration');
    }, 300);
  }
}

/**
 * Update Readiness Displays Across All Screens
 */
function updateReadinessDisplays() {
  const score = appState.readiness.overall;
  const toGo = Math.max(0, 100 - score);

  // Result Screen
  const resultNum = document.getElementById('resultScoreNumber');
  const resultFill = document.getElementById('resultScoreFill');
  if (resultNum) resultNum.textContent = `${score}%`;
  if (resultFill) resultFill.style.width = `${score}%`;

  // Home Screen
  const homeNum = document.getElementById('homeScoreNumber');
  const homeFill = document.getElementById('homeScoreFill');
  const homeToGo = document.getElementById('homeScoreToGoText');
  if (homeNum) homeNum.textContent = `${score}%`;
  if (homeFill) homeFill.style.width = `${score}%`;
  if (homeToGo) homeToGo.textContent = score >= 100 ? '100% Ready · All milestones achieved!' : `${toGo}% to go · Tap to view breakdown`;

  // Progress Screen
  const progNum = document.getElementById('progressOverallScore');
  const progFill = document.getElementById('progressOverallFill');
  if (progNum) progNum.textContent = `${score}%`;
  if (progFill) progFill.style.width = `${score}%`;

  // Sheet
  const sheetNum = document.getElementById('sheetScorePct');
  if (sheetNum) sheetNum.textContent = `${score}%`;

  // Category percentages
  const cats = appState.readiness.categories;
  updateCategoryRow('catResumePct', 'catResumeFill', 'sheetResumePct', cats.resume);
  updateCategoryRow('catPortfolioPct', 'catPortfolioFill', 'sheetPortfolioPct', cats.portfolio);
  updateCategoryRow('catInterviewPct', 'catInterviewFill', 'sheetInterviewPct', cats.interview);
  updateCategoryRow('catProfilePct', 'catProfileFill', 'sheetProfilePct', cats.profile);
  updateCategoryRow('catJobSearchPct', 'catJobSearchFill', 'sheetJobSearchPct', cats.jobSearch);
}

function updateCategoryRow(pctId, fillId, sheetId, val) {
  const p = document.getElementById(pctId);
  const f = document.getElementById(fillId);
  const s = document.getElementById(sheetId);
  if (p) p.textContent = `${val}%`;
  if (f) f.style.width = `${val}%`;
  if (s) s.textContent = `${val}%`;
}

/**
 * Simulate Reaching 100% Readiness
 */
function simulateFullReadiness() {
  appState.tasks.forEach(t => t.completed = true);
  appState.readiness.overall = 100;
  appState.readiness.categories = {
    resume: 100,
    portfolio: 100,
    interview: 100,
    profile: 100,
    jobSearch: 100
  };
  updateReadinessDisplays();
  renderTasks();
  goToScreen('s-celebration');
}

/**
 * Inactivity Simulation Toggle
 */
function toggleSimulateInactivity() {
  appState.inactivitySimulated = !appState.inactivitySimulated;
  const banner = document.getElementById('inactivityBanner');
  if (banner) {
    banner.style.display = appState.inactivitySimulated ? 'flex' : 'none';
  }
}

/**
 * Catch-Up & Reschedule Actions
 */
function openCatchUpModal() {
  openModal('modalCatchUp');
}

function confirmCatchUp() {
  closeModal('modalCatchUp');
  const banner = document.getElementById('missedTaskBanner');
  if (banner) banner.style.display = 'none';
  const inactBanner = document.getElementById('inactivityBanner');
  if (inactBanner) inactBanner.style.display = 'none';
  alert('🚀 Catch-Up Mode Active: Today\'s plan condensed to 25 minutes.');
}

function openRescheduleModal() {
  openModal('modalReschedule');
}

function confirmReschedule() {
  closeModal('modalReschedule');
  const banner = document.getElementById('missedTaskBanner');
  if (banner) banner.style.display = 'none';
  alert('📅 Task rescheduled for tomorrow. Your 5-day streak is preserved!');
}

/**
 * Explainable Score Bottom Sheet
 */
function openExplainableScoreModal() {
  openModal('modalExplainableScore');
}

/**
 * Mock Interview Helpers
 */
function selectInterviewType(chipEl, typeName) {
  chipEl.parentElement.querySelectorAll('.chip').forEach(c => {
    c.className = 'chip';
    c.style.background = 'var(--neutral-100)';
    c.style.color = 'var(--neutral-700)';
  });
  chipEl.className = 'chip chip-primary';
  chipEl.style.background = 'var(--primary-50)';
  chipEl.style.color = 'var(--primary-700)';
}

function nextMockQuestion() {
  currentMockQIndex = (currentMockQIndex + 1) % MOCK_QUESTIONS.length;
  document.getElementById('mockQText').textContent = `"${MOCK_QUESTIONS[currentMockQIndex]}"`;
}

/**
 * Single Selection Card Utility
 */
function selectCardSingle(cardElement) {
  cardElement.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');
}

/**
 * Modal Open/Close Utilities
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function closeAllModals(event) {
  if (event.target.classList.contains('modal-backdrop')) {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

/**
 * Reset All Assessment Data
 */
function resetAllData() {
  if (confirm('Reset your assessment and progress back to initial discovery state?')) {
    appState.readiness.overall = 72;
    appState.readiness.categories = { resume: 90, portfolio: 75, interview: 60, profile: 80, jobSearch: 55 };
    appState.tasks.forEach(t => t.completed = false);
    goToScreen('s-splash');
  }
}

// Initial setup on load
document.addEventListener('DOMContentLoaded', () => {
  renderTasks();
  updateReadinessDisplays();
});
