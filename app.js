/**
 * MENTRA — CAREER RESTART & LEARNING MOBILE APPLICATION
 * Application State, Interactive User Flows, Programme Routing & Real-World Actions
 */

// Application State
const appState = {
  user: {
    name: 'Arka',
    goal: 'Switch careers',
    experience: 'Intermediate',
    interest: 'Product Design',
    targetRole: 'Product Designer',
    streak: 5
  },
  enrolledProgramme: {
    title: 'Product Design Career Accelerator',
    progressPct: 42,
    completedModules: 4,
    totalModules: 10
  },
  readiness: {
    overall: 72,
    categories: {
      resume: 90,
      portfolio: 75,
      skills: 80,
      interview: 60,
      profile: 82,
      applications: 55
    }
  },
  assignment: {
    title: 'Portfolio Case Study: User Research Synthesis',
    status: 'Not started',
    fileAttached: false
  },
  inactivitySimulated: false,
  currentInterviewQIndex: 0
};

const INTERVIEW_QUESTIONS = [
  'Tell me about a difficult product design decision you had to make and how you handled stakeholder pushback.',
  'Walk me through a case study where user research fundamentally changed your product direction.',
  'How do you balance aesthetic design craft with engineering feasibility under tight sprint constraints?'
];

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

  // Update top toolbar
  document.querySelectorAll('.flow-btn').forEach(btn => {
    const attr = btn.getAttribute('onclick') || '';
    btn.classList.toggle('active', attr.includes(`'${screenId}'`));
  });

  // Persistent bottom navigation visibility
  const bottomNav = document.getElementById('appBottomNav');
  const mainScreens = ['s-home', 's-learn', 's-progress', 's-profile'];
  if (bottomNav) {
    bottomNav.style.display = mainScreens.includes(screenId) ? 'flex' : 'none';
  }

  // Active bottom nav tab
  document.querySelectorAll('.nav-tab-item').forEach(tab => tab.classList.remove('active'));
  if (screenId === 's-home') document.getElementById('tab-home')?.classList.add('active');
  if (screenId === 's-learn') document.getElementById('tab-learn')?.classList.add('active');
  if (screenId === 's-progress') document.getElementById('tab-progress')?.classList.add('active');
  if (screenId === 's-profile') document.getElementById('tab-profile')?.classList.add('active');

  updateUIElements();
}

/**
 * Selection Handlers for Onboarding/Quiz Steps
 */
function selectGoalOption(cardElement, goalVal) {
  selectCardSingle(cardElement);
  appState.user.goal = goalVal;
}

function selectExperienceOption(cardElement, expVal) {
  selectCardSingle(cardElement);
  appState.user.experience = expVal;
}

function selectInterestOption(cardElement, intVal) {
  selectCardSingle(cardElement);
  appState.user.interest = intVal;
}

function selectCardSingle(cardElement) {
  cardElement.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  cardElement.classList.add('selected');
}

/**
 * Enrolment Confirmation
 */
function enrollInProgramme() {
  goToScreen('s-home');
  alert('🎉 You are officially enrolled in the Product Design Career Accelerator! Your learning dashboard is ready.');
}

/**
 * Assignment Simulation & Submission
 */
function simulateAssignmentFile() {
  appState.assignment.fileAttached = true;
  const prompt = document.getElementById('fileUploadPrompt');
  if (prompt) {
    prompt.innerHTML = '✓ Attached: <strong>Portfolio_CaseStudy_Synthesis_Arka.pdf</strong> (1.8 MB)';
    prompt.style.color = 'var(--success-700)';
  }
}

function submitAssignmentWork() {
  if (!appState.assignment.fileAttached) {
    simulateAssignmentFile();
  }

  appState.assignment.status = 'Submitted';
  appState.readiness.overall = Math.min(100, appState.readiness.overall + 8);
  appState.readiness.categories.portfolio = 90;
  appState.enrolledProgramme.progressPct = 50;

  // Update Next Action on dashboard
  const nextTitle = document.getElementById('nextActionTitle');
  const nextBtn = document.getElementById('nextActionBtn');
  if (nextTitle) nextTitle.textContent = 'Prepare for Thursday Live Portfolio Review';
  if (nextBtn) {
    nextBtn.textContent = 'View Session Details →';
    nextBtn.onclick = () => goToScreen('s-live-session');
  }

  updateUIElements();
  goToScreen('s-home');

  setTimeout(() => {
    alert('✅ Assignment Submitted! Status updated to "Under Review". Career readiness increased to 80%!');
  }, 300);
}

/**
 * Live Session Q Handler
 */
function nextInterviewQ() {
  appState.currentInterviewQIndex = (appState.currentInterviewQIndex + 1) % INTERVIEW_QUESTIONS.length;
  const textEl = document.getElementById('interviewQText');
  if (textEl) {
    textEl.textContent = `"${INTERVIEW_QUESTIONS[appState.currentInterviewQIndex]}"`;
  }
}

/**
 * Catch-Up & Reschedule Modal Triggers
 */
function openCatchUpModal() {
  openModal('modalCatchUp');
}

function confirmCatchUp() {
  closeModal('modalCatchUp');
  document.getElementById('missedDeadlineBanner')?.style.setProperty('display', 'none');
  document.getElementById('inactivityBanner')?.style.setProperty('display', 'none');
  alert('🚀 Catch-Up Mode Activated: Today\'s study time condensed to 25 minutes.');
}

function openRescheduleModal() {
  openModal('modalReschedule');
}

function confirmReschedule() {
  closeModal('modalReschedule');
  document.getElementById('missedDeadlineBanner')?.style.setProperty('display', 'none');
  alert('📅 Task rescheduled for tomorrow. Your 5-day streak remains protected!');
}

/**
 * Inactivity Simulation
 */
function toggleSimulateInactivity() {
  appState.inactivitySimulated = !appState.inactivitySimulated;
  const banner = document.getElementById('inactivityBanner');
  if (banner) {
    banner.style.display = appState.inactivitySimulated ? 'block' : 'none';
  }
}

/**
 * Full Readiness Simulator
 */
function simulateFullReadiness() {
  appState.readiness.overall = 100;
  appState.enrolledProgramme.progressPct = 100;
  appState.enrolledProgramme.completedModules = 10;
  appState.readiness.categories = {
    resume: 100,
    portfolio: 100,
    skills: 100,
    interview: 100,
    profile: 100,
    applications: 100
  };
  updateUIElements();
  goToScreen('s-celebration');
}

/**
 * Explainable Readiness Modal
 */
function openExplainableReadinessModal() {
  openModal('modalExplainableReadiness');
}

/**
 * Update UI Indicators
 */
function updateUIElements() {
  const r = appState.readiness.overall;
  const p = appState.enrolledProgramme.progressPct;

  // Rings & Badges
  const ringR = document.getElementById('progRingReadiness');
  const ringP = document.getElementById('progRingProgramme');
  const sheetScore = document.getElementById('sheetScoreNum');
  if (ringR) ringR.textContent = `${r}%`;
  if (ringP) ringP.textContent = `${p}%`;
  if (sheetScore) sheetScore.textContent = `${r}%`;

  // Programme Progress on Dashboard
  const dashProgFill = document.getElementById('dashProgFill');
  const dashProgPct = document.getElementById('dashProgPct');
  if (dashProgFill) dashProgFill.style.width = `${p}%`;
  if (dashProgPct) dashProgPct.textContent = `${p}% complete`;

  // Assignment Badges
  const dashBadge = document.getElementById('dashAssignmentBadge');
  const detailBadge = document.getElementById('assignDetailBadge');
  if (dashBadge && appState.assignment.status === 'Submitted') {
    dashBadge.className = 'chip chip-success';
    dashBadge.textContent = 'Submitted ✓';
  }
  if (detailBadge && appState.assignment.status === 'Submitted') {
    detailBadge.className = 'chip chip-success';
    detailBadge.textContent = 'Submitted · Under Review';
  }
}

/**
 * Modal Utilities
 */
function openModal(id) {
  document.getElementById(id)?.classList.add('active');
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('active');
}

function closeAllModals(event) {
  if (event.target.classList.contains('modal-backdrop')) {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

/**
 * Reset Progress
 */
function resetAllProgress() {
  if (confirm('Reset your enrolment and progress back to step 1?')) {
    appState.readiness.overall = 72;
    appState.enrolledProgramme.progressPct = 42;
    appState.assignment.status = 'Not started';
    appState.assignment.fileAttached = false;
    goToScreen('s-splash');
  }
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
  updateUIElements();
});
