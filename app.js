/**
 * MENTRA — CAREER RESTART & LEARNING MOBILE APPLICATION
 * Application State, Interactive User Flows, Programme Personalization & Action Handlers
 */

// Global Application State
const appState = {
  user: {
    name: 'Arka',
    goal: 'Restart after a career break',
    targetRole: 'Product Designer',
    experienceYears: 3,
    careerBreak: '8 months',
    breakReasons: ['Burnout', 'Wanted a career change'],
    breakNote: 'Needed time to recharge and recalibrate my career direction towards digital product design.',
    confidenceLevel: 3,
    confidentSkills: ['UI design', 'Wireframing', 'Prototyping'],
    biggestChallenge: "My portfolio isn't strong enough",
    successMetric: 'Build a strong portfolio',
    targetTimeline: 'Within 3 months',
    weeklyCommitment: '4-6 hours'
  },
  enrolled: false,
  programme: {
    title: 'Product Design Career Accelerator',
    matchPct: 92,
    durationWeeks: 8,
    weeklyHours: 5,
    modulesCount: 8,
    liveSessionsCount: 4,
    progressPct: 42,
    completedModules: 2
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
  videoLesson: {
    isPlaying: false,
    currentTime: 142, // in seconds (2:22)
    duration: 720, // in seconds (12:00)
    speed: 1,
    completed: false
  },
  pdfLesson: {
    currentPage: 3,
    totalPages: 8,
    completed: false
  },
  assignment: {
    title: 'Portfolio Case Study: User Research Synthesis',
    status: 'In Progress',
    fileAttached: false,
    fileName: 'Portfolio_CaseStudy_Synthesis_Draft.pdf',
    linkUrl: 'https://figma.com/@arka/case-study-synthesis',
    notes: 'Synthesized 5 user interviews on onboarding drop-off.'
  },
  liveSession: {
    title: 'Portfolio Review Workshop',
    instructor: 'Sarah Johnson',
    instructorTitle: 'Staff Product Designer @ Linear',
    time: 'Thursday · 7:00 PM',
    duration: '45 min',
    isJoined: false
  },
  mockInterview: {
    currentIndex: 0,
    isRecording: false,
    questions: [
      {
        type: 'Behavioral & Career Transition',
        q: 'Tell me about how you handled your 8-month career break and what motivated your transition to Product Design.',
        tip: 'Focus on proactive learning, skill refresh, and intentional focus on user-centric product craft.'
      },
      {
        type: 'Product Thinking & Conflict',
        q: 'Walk me through a time when user research conflicted with engineering constraints or business deadlines.',
        tip: 'Highlight compromise, phased rollout, and how you maintained user empathy without blocking delivery.'
      },
      {
        type: 'Design Craft & Systems',
        q: 'How do you approach designing scalable components that adhere strictly to design system tokens?',
        tip: 'Discuss atomic design, variant states, accessibility tokens, and cross-functional handoff with developers.'
      }
    ]
  },
  inactivitySimulated: false
};

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
  const mainTabs = ['s-home', 's-learn', 's-progress', 's-profile'];
  if (bottomNav) {
    bottomNav.style.display = mainTabs.includes(screenId) ? 'flex' : 'none';
  }

  // Active bottom nav tab state
  document.querySelectorAll('.nav-tab-item').forEach(tab => tab.classList.remove('active'));
  if (screenId === 's-home') document.getElementById('tab-home')?.classList.add('active');
  if (screenId === 's-learn') document.getElementById('tab-learn')?.classList.add('active');
  if (screenId === 's-progress') document.getElementById('tab-progress')?.classList.add('active');
  if (screenId === 's-profile') document.getElementById('tab-profile')?.classList.add('active');

  // If navigating to dynamic screens, compile and refresh content
  if (screenId === 's-personalization-summary') {
    renderPersonalizationSummary();
  } else if (screenId === 's-reassurance-trust') {
    renderReassuranceScreen();
  } else if (screenId === 's-personalized-roadmap') {
    renderPersonalizedRoadmap();
  } else if (screenId === 's-programme-recommendation') {
    renderProgrammeRecommendation();
  }

  updateUIElements();
}

/**
 * -----------------------------------------------------------------------------
 * 10-STEP ONBOARDING QUESTION HANDLERS
 * -----------------------------------------------------------------------------
 */

// Question 1: Career Goal
function selectOnboardGoal(el, val) {
  selectSingleOptionCard(el);
  appState.user.goal = val;
}

// Question 2: Target Role
function selectOnboardRole(el, val) {
  selectSingleOptionCard(el);
  appState.user.targetRole = val;
  const otherInput = document.getElementById('customRoleInput');
  if (otherInput) {
    otherInput.style.display = val === 'Other' ? 'block' : 'none';
    if (val === 'Other') otherInput.focus();
  }
}

function handleCustomRoleInput(inputEl) {
  if (inputEl.value.trim()) {
    appState.user.targetRole = inputEl.value.trim();
  }
}

// Question 3: Experience Years & Break Duration
function selectExperienceYears(el, years) {
  el.parentElement.querySelectorAll('.number-btn').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
  appState.user.experienceYears = years;
}

function selectBreakDuration(el, duration) {
  selectSingleOptionCard(el);
  appState.user.careerBreak = duration;
}

// Question 4: Reason for Career Break (Multi-select)
function toggleBreakReason(el, reason) {
  el.classList.toggle('selected');
  const index = appState.user.breakReasons.indexOf(reason);
  if (index > -1) {
    appState.user.breakReasons.splice(index, 1);
  } else {
    appState.user.breakReasons.push(reason);
  }
}

function handleBreakNoteInput(textareaEl) {
  appState.user.breakNote = textareaEl.value;
}

// Question 5: Confidence Rating (1-5 visual scale)
function selectConfidenceLevel(num) {
  appState.user.confidenceLevel = num;
  document.querySelectorAll('.confidence-box').forEach((box, idx) => {
    box.classList.toggle('selected', (idx + 1) === num);
  });

  const feedbackMap = {
    1: "It's completely normal to feel uncertain after time away. We'll start with foundational refreshes so you never feel out of your depth.",
    2: "Taking time away can make things feel unfamiliar. We'll guide you step-by-step to rebuild clarity and momentum.",
    3: "That's completely normal after a career break. We'll help you identify what has changed and what you already know.",
    4: "Great foundation! You have solid instincts and we'll focus on closing specific industry craft and portfolio gaps.",
    5: "Awesome! You're ready to hit the ground running. We'll fast-track your portfolio packaging and interview readiness."
  };

  const noteEl = document.getElementById('confidenceReassuranceText');
  if (noteEl) {
    noteEl.textContent = feedbackMap[num] || feedbackMap[3];
  }
}

// Question 6: Confident Skills (Multi-select)
function toggleConfidentSkill(el, skill) {
  el.classList.toggle('selected');
  const idx = appState.user.confidentSkills.indexOf(skill);
  if (idx > -1) {
    appState.user.confidentSkills.splice(idx, 1);
  } else {
    appState.user.confidentSkills.push(skill);
  }
}

// Question 7: Biggest Challenge
function selectBiggestChallenge(el, challenge) {
  selectSingleOptionCard(el);
  appState.user.biggestChallenge = challenge;
}

// Question 8: Success Metric
function selectSuccessMetric(el, metric) {
  selectSingleOptionCard(el);
  appState.user.successMetric = metric;
}

// Question 9: Target Move Timeline
function selectTimeline(el, timeline) {
  selectSingleOptionCard(el);
  appState.user.targetTimeline = timeline;
}

// Question 10: Weekly Commitment
function selectWeeklyCommitment(el, hours) {
  selectSingleOptionCard(el);
  appState.user.weeklyCommitment = hours;
}

// Helper: Single-select Option Card
function selectSingleOptionCard(cardEl) {
  cardEl.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
}

/**
 * -----------------------------------------------------------------------------
 * DYNAMIC PERSONALIZATION RENDERING
 * -----------------------------------------------------------------------------
 */

function renderPersonalizationSummary() {
  const u = appState.user;
  
  // Set elements
  const goalEl = document.getElementById('sumGoal');
  const expEl = document.getElementById('sumExperience');
  const breakEl = document.getElementById('sumBreak');
  const confEl = document.getElementById('sumConfidence');
  const skillsEl = document.getElementById('sumSkills');
  const focusEl = document.getElementById('sumFocusAreas');
  const quoteEl = document.getElementById('sumReassuranceQuote');

  if (goalEl) goalEl.textContent = `${u.goal} → ${u.targetRole}`;
  if (expEl) expEl.textContent = `${u.experienceYears} years experience`;
  if (breakEl) breakEl.textContent = u.careerBreak;
  if (confEl) confEl.textContent = `${u.confidenceLevel} / 5 (${u.confidenceLevel >= 4 ? 'High' : u.confidenceLevel === 3 ? 'Moderate' : 'Rebuilding'})`;
  
  if (skillsEl) {
    skillsEl.innerHTML = u.confidentSkills.length > 0 
      ? u.confidentSkills.map(s => `<span class="chip chip-success" style="font-size:11.5px; padding:2px 8px;">✓ ${s}</span>`).join(' ')
      : '<span class="chip chip-neutral" style="font-size:11.5px;">Foundations refresh</span>';
  }

  // Derive Focus Areas dynamically based on Challenge & Target Role
  const focusAreas = [];
  if (u.biggestChallenge.includes('portfolio') || u.biggestChallenge.includes('outdated')) {
    focusAreas.push('2 End-to-End Case Studies');
  }
  if (u.biggestChallenge.includes('explain') || u.biggestChallenge.includes('interview')) {
    focusAreas.push('Career Break Storytelling');
  }
  focusAreas.push('Product Thinking & Research');
  focusAreas.push('Design Systems & Tokens');

  if (focusEl) {
    focusEl.innerHTML = focusAreas.map(f => `<span class="chip chip-primary" style="font-size:11.5px; padding:2px 8px;">★ ${f}</span>`).join(' ');
  }

  if (quoteEl) {
    quoteEl.innerHTML = `<strong>You're not starting from zero.</strong> You have ${u.experienceYears} years of background we can build upon. Because you've been away for ${u.careerBreak}, we'll prioritize a refresh on modern industry practices before launching into portfolio creation.`;
  }
}

function renderReassuranceScreen() {
  const u = appState.user;
  const roleEl = document.getElementById('reassureRoleTitle');
  const breakCallout = document.getElementById('reassureBreakNote');

  if (roleEl) roleEl.textContent = `You chose ${u.targetRole}. You're not alone.`;
  if (breakCallout) {
    breakCallout.textContent = `Thousands of professionals with ${u.experienceYears} years of experience and a career break of ${u.careerBreak} have rebuilt confidence through structured, step-by-step guidance.`;
  }
}

function renderPersonalizedRoadmap() {
  const u = appState.user;
  const durationEl = document.getElementById('roadmapDurationTag');
  const noteEl = document.getElementById('roadmapPersonalNote');

  if (durationEl) durationEl.textContent = `8 weeks · ~${u.weeklyCommitment.split(' ')[0]} hrs/week`;
  if (noteEl) {
    noteEl.innerHTML = `<strong>Tailored for ${u.name}:</strong> Calibrated for your <strong>${u.careerBreak}</strong> break and focused on addressing your challenge: <em>"${u.biggestChallenge}"</em>.`;
  }
}

function renderProgrammeRecommendation() {
  const u = appState.user;
  const titleEl = document.getElementById('recProgTitle');
  const whyBox = document.getElementById('recWhyList');

  if (titleEl) titleEl.textContent = `${u.targetRole.toUpperCase()} CAREER ACCELERATOR`;
  if (whyBox) {
    whyBox.innerHTML = `
      <div class="prog-why-item">✓ Matches your ${u.experienceYears} years of experience</div>
      <div class="prog-why-item">✓ Builds on your existing skills (${u.confidentSkills.slice(0, 2).join(', ') || 'design foundations'})</div>
      <div class="prog-why-item">✓ Directly addresses your challenge: ${u.biggestChallenge}</div>
      <div class="prog-why-item">✓ Fits your ${u.weeklyCommitment} weekly commitment</div>
      <div class="prog-why-item">✓ Structured to help you restart within ${u.targetTimeline.toLowerCase()}</div>
    `;
  }
}

/**
 * -----------------------------------------------------------------------------
 * VALUE-FIRST ENROLMENT & TRIAL
 * -----------------------------------------------------------------------------
 */

function startFreeTrial() {
  appState.enrolled = true;
  goToScreen('s-home');
  showToast('🎉 Free 2-Day Experience Activated! Module 1 and Mentor Call unlocked.');
}

function enrollInProgramme() {
  appState.enrolled = true;
  goToScreen('s-home');
  showToast('🚀 Enrolled in Product Design Career Accelerator!');
}

function bookFreeMentorCall() {
  openModal('modalMentorCall');
}

function confirmMentorCallBooking() {
  closeModal('modalMentorCall');
  showToast('📅 15-Min Career Guidance Call booked with Sarah Johnson for Friday 4:00 PM!');
}

/**
 * -----------------------------------------------------------------------------
 * VIDEO PLAYER CONTROLS (Simulated LMS Video Player)
 * -----------------------------------------------------------------------------
 */

function toggleVideoPlay() {
  appState.videoLesson.isPlaying = !appState.videoLesson.isPlaying;
  const playBtn = document.getElementById('videoPlayBtnLarge');
  const barPlayBtn = document.getElementById('videoControlPlayBtn');

  if (playBtn) playBtn.textContent = appState.videoLesson.isPlaying ? '❚❚' : '▶';
  if (barPlayBtn) barPlayBtn.textContent = appState.videoLesson.isPlaying ? 'Pause' : 'Play';
  
  if (appState.videoLesson.isPlaying) {
    showToast('▶ Video playing: Conducting Effective User Interviews');
  }
}

function setVideoSpeed(speed) {
  appState.videoLesson.speed = speed;
  document.querySelectorAll('.speed-pill').forEach(p => {
    p.classList.toggle('active', p.textContent.includes(`${speed}x`));
  });
  showToast(`⚡ Playback speed set to ${speed}x`);
}

function completeVideoLesson() {
  appState.videoLesson.completed = true;
  appState.readiness.overall = Math.min(100, appState.readiness.overall + 3);
  appState.programme.progressPct = Math.min(100, appState.programme.progressPct + 4);
  
  updateUIElements();
  goToScreen('s-module-detail');
  showToast('✓ Video Lesson completed! Module progress updated.');
}

/**
 * -----------------------------------------------------------------------------
 * PDF LESSON CONTROLS (Simulated PDF Viewer)
 * -----------------------------------------------------------------------------
 */

function nextPdfPage() {
  if (appState.pdfLesson.currentPage < appState.pdfLesson.totalPages) {
    appState.pdfLesson.currentPage++;
    updatePdfUI();
  }
}

function prevPdfPage() {
  if (appState.pdfLesson.currentPage > 1) {
    appState.pdfLesson.currentPage--;
    updatePdfUI();
  }
}

function updatePdfUI() {
  const pageNum = document.getElementById('pdfPageNum');
  const pageContent = document.getElementById('pdfContentSheet');
  
  if (pageNum) pageNum.textContent = `Page ${appState.pdfLesson.currentPage} of ${appState.pdfLesson.totalPages}`;
  
  if (pageContent) {
    const pagesText = {
      1: "<h3>1. Overview of Research Synthesis</h3><p>User research synthesis transforms messy qualitative interview transcripts into clear, structured behavioral patterns.</p>",
      2: "<h3>2. Affinity Mapping Framework</h3><p>Cluster quotes by user pain points, workarounds, and underlying emotional goals rather than feature requests.</p>",
      3: "<h3>3. Identifying the Primary Friction Point</h3><p>Focus on drop-off moments where user expectations diverge from system state feedback.</p>",
      4: "<h3>4. Translating Insights to Opportunity Areas</h3><p>Structure findings using 'How Might We' prompts backed by verified user evidence.</p>",
      5: "<h3>5. Stakeholder Communication</h3><p>Present findings using succinct quote evidence and video highlights to build team consensus.</p>",
      6: "<h3>6. Real-World Case Study Example</h3><p>How an 8-person fintech team resolved onboarding abandonment by restructuring identity verification.</p>",
      7: "<h3>7. Common Synthesis Traps</h3><p>Avoid confirmation bias and over-indexing on single vocal participant requests.</p>",
      8: "<h3>8. Deliverable Checklist</h3><p>Ensure your synthesis document includes Executive Summary, 3 Core Themes, and Next Action Recommendations.</p>"
    };
    pageContent.innerHTML = pagesText[appState.pdfLesson.currentPage] || pagesText[3];
  }
}

function completePdfLesson() {
  appState.pdfLesson.completed = true;
  appState.readiness.overall = Math.min(100, appState.readiness.overall + 3);
  appState.programme.progressPct = Math.min(100, appState.programme.progressPct + 4);
  
  updateUIElements();
  goToScreen('s-module-detail');
  showToast('✓ PDF Resource completed! Career readiness increased.');
}

/**
 * -----------------------------------------------------------------------------
 * ASSIGNMENT WORKBENCH & SUBMISSION
 * -----------------------------------------------------------------------------
 */

function simulateAssignmentFile() {
  appState.assignment.fileAttached = true;
  const prompt = document.getElementById('fileUploadPrompt');
  if (prompt) {
    prompt.innerHTML = '✓ Attached: <strong>Portfolio_CaseStudy_Synthesis_Arka.pdf</strong> (2.4 MB)';
    prompt.style.color = 'var(--success-700)';
  }
  showToast('📄 Document attached: Portfolio_CaseStudy_Synthesis_Arka.pdf');
}

function submitAssignmentWork() {
  if (!appState.assignment.fileAttached) {
    simulateAssignmentFile();
  }

  appState.assignment.status = 'Submitted';
  appState.readiness.overall = Math.min(100, appState.readiness.overall + 8);
  appState.readiness.categories.portfolio = 90;
  appState.programme.progressPct = 50;

  // Update Next Action dynamically
  const nextTitle = document.getElementById('nextActionTitle');
  const nextBtn = document.getElementById('nextActionBtn');
  if (nextTitle) nextTitle.textContent = 'Prepare for Thursday Live Portfolio Review Workshop';
  if (nextBtn) {
    nextBtn.textContent = 'View Live Workshop Details →';
    nextBtn.onclick = () => goToScreen('s-live-session');
  }

  updateUIElements();
  goToScreen('s-home');
  showToast('✅ Assignment Submitted! Status updated to "Under Review". Career readiness increased to 80%!');
}

/**
 * -----------------------------------------------------------------------------
 * LIVE SESSION & COHORT INTERACTION
 * -----------------------------------------------------------------------------
 */

function joinLiveRoom() {
  appState.liveSession.isJoined = true;
  showToast('🎥 Connecting to Live Room with Sarah Johnson and 24 cohort peers...');
}

function sendLiveChat() {
  const input = document.getElementById('liveChatInput');
  const stream = document.getElementById('liveChatStream');
  if (input && input.value.trim() && stream) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg';
    msg.innerHTML = `<strong>You:</strong> <span>${input.value.trim()}</span>`;
    stream.appendChild(msg);
    input.value = '';
    stream.scrollTop = stream.scrollHeight;
  }
}

/**
 * -----------------------------------------------------------------------------
 * MOCK INTERVIEW SIMULATOR
 * -----------------------------------------------------------------------------
 */

function nextInterviewQ() {
  const mi = appState.mockInterview;
  mi.currentIndex = (mi.currentIndex + 1) % mi.questions.length;
  renderMockInterview();
}

function prevInterviewQ() {
  const mi = appState.mockInterview;
  mi.currentIndex = (mi.currentIndex - 1 + mi.questions.length) % mi.questions.length;
  renderMockInterview();
}

function toggleInterviewRecording() {
  appState.mockInterview.isRecording = !appState.mockInterview.isRecording;
  const btn = document.getElementById('recordAudioBtn');
  const status = document.getElementById('recordStatusBadge');

  if (btn) {
    btn.textContent = appState.mockInterview.isRecording ? '⏹ Stop & Analyze Answer' : '🎙️ Record Practice Answer';
    btn.style.background = appState.mockInterview.isRecording ? 'var(--error-600)' : 'var(--primary-600)';
  }
  if (status) {
    status.style.display = appState.mockInterview.isRecording ? 'inline-block' : 'none';
  }
  if (!appState.mockInterview.isRecording) {
    showToast('✓ Answer captured. Mentor rubric verified structure & clarity.');
  }
}

function renderMockInterview() {
  const item = appState.mockInterview.questions[appState.mockInterview.currentIndex];
  const qType = document.getElementById('interviewQType');
  const qText = document.getElementById('interviewQText');
  const qTip = document.getElementById('interviewQTip');
  const qNum = document.getElementById('interviewQNum');

  if (qType) qType.textContent = item.type;
  if (qText) qText.textContent = `"${item.q}"`;
  if (qTip) qTip.textContent = item.tip;
  if (qNum) qNum.textContent = `Question ${appState.mockInterview.currentIndex + 1} of ${appState.mockInterview.questions.length}`;
}

/**
 * -----------------------------------------------------------------------------
 * RE-ENGAGEMENT, CATCH-UP & RESCHEDULE
 * -----------------------------------------------------------------------------
 */

function toggleSimulateInactivity() {
  appState.inactivitySimulated = !appState.inactivitySimulated;
  const banner = document.getElementById('inactivityBanner');
  if (banner) {
    banner.style.display = appState.inactivitySimulated ? 'block' : 'none';
  }
  showToast(appState.inactivitySimulated ? '⚡ Inactivity mode simulated (5 days away)' : 'Active mode restored');
}

function openCatchUpModal() {
  openModal('modalCatchUp');
}

function confirmCatchUp() {
  closeModal('modalCatchUp');
  document.getElementById('missedDeadlineBanner')?.style.setProperty('display', 'none');
  document.getElementById('inactivityBanner')?.style.setProperty('display', 'none');
  showToast('🚀 Catch-Up Mode Activated: Session condensed to 25 mins without guilt.');
}

function openRescheduleModal() {
  openModal('modalReschedule');
}

function confirmReschedule() {
  closeModal('modalReschedule');
  document.getElementById('missedDeadlineBanner')?.style.setProperty('display', 'none');
  showToast('📅 Task rescheduled for tomorrow. Your streak remains protected!');
}

/**
 * -----------------------------------------------------------------------------
 * FULL READINESS & RESET
 * -----------------------------------------------------------------------------
 */

function simulateFullReadiness() {
  appState.readiness.overall = 100;
  appState.programme.progressPct = 100;
  appState.programme.completedModules = 8;
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
  showToast('🏆 100% Career Ready achieved! All requirements verified.');
}

function resetAllProgress() {
  appState.readiness.overall = 72;
  appState.programme.progressPct = 42;
  appState.assignment.status = 'In Progress';
  appState.assignment.fileAttached = false;
  appState.inactivitySimulated = false;
  goToScreen('s-splash');
  showToast('🔄 App reset to initial onboarding state.');
}

/**
 * -----------------------------------------------------------------------------
 * MODAL HELPERS
 * -----------------------------------------------------------------------------
 */

function openModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.add('active');
}

function closeModal(modalId) {
  const m = document.getElementById(modalId);
  if (m) m.classList.remove('active');
}

function closeAllModals(event) {
  if (event.target.classList.contains('modal-backdrop')) {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
  }
}

/**
 * -----------------------------------------------------------------------------
 * UI SYNC & TOAST NOTIFICATION
 * -----------------------------------------------------------------------------
 */

function updateUIElements() {
  const r = appState.readiness.overall;
  const p = appState.programme.progressPct;

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

  // Assignment Badge
  const assignBadge = document.getElementById('dashAssignmentBadge');
  const assignDetailBadge = document.getElementById('assignDetailBadge');
  if (assignBadge) {
    assignBadge.textContent = appState.assignment.status;
    assignBadge.className = `chip ${appState.assignment.status === 'Submitted' ? 'chip-success' : 'chip-warning'}`;
  }
  if (assignDetailBadge) {
    assignDetailBadge.textContent = appState.assignment.status;
    assignDetailBadge.className = `chip ${appState.assignment.status === 'Submitted' ? 'chip-success' : 'chip-warning'}`;
  }
}

function showToast(msg) {
  const existing = document.getElementById('mentraToast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'mentraToast';
  toast.style.position = 'fixed';
  toast.style.bottom = '84px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = '#181D27';
  toast.style.color = '#FFFFFF';
  toast.style.fontSize = '12.5px';
  toast.style.fontWeight = '700';
  toast.style.padding = '10px 18px';
  toast.style.borderRadius = '30px';
  toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
  toast.style.zIndex = '300';
  toast.style.maxWidth = '340px';
  toast.style.textAlign = 'center';
  toast.style.animation = 'fadeIn 0.2s ease';
  toast.textContent = msg;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2600);
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  renderMockInterview();
  updateUIElements();
});
