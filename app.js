/**
 * MENTRA — CAREER RESTART & LEARNING MOBILE APPLICATION
 * Application State, 7-Step Quiz Logic, Personalized Dashboard, LMS & Community
 * Tailwind Heroicons System Integration (No emojis)
 */

// Application State
const appState = {
  user: {
    name: 'Minakshi',
    situation: 'On a career break',
    breakDuration: '2–5 years',
    breakReason: 'Marriage / relocation',
    previousWork: 'Teaching / training',
    roleClarity: 'I am confused',
    workInterest: 'Marketing & growth',
    confidence: 'Low — I doubt myself a lot',
    techComfort: 'Basic — email, WhatsApp, browsing',
    englishComfort: 'Intermediate — can write emails',
    timeCommitment: 'Most days, flexible hours',
    earningTimeline: 'In 1–3 months',
    primaryGoal: 'Work from home',
    familySupport: 'Somewhat — mixed feelings',
    biggestWorry: 'Gap on resume, lack of confidence in modern digital tools'
  },
  enrolled: false,
  programme: {
    id: 'prog-marketing',
    title: 'Digital Marketing Career Restart',
    category: 'Marketing',
    duration: '8 weeks',
    level: 'Beginner friendly',
    format: 'Video + PDF + Live Classes',
    modulesCount: 8,
    progressPct: 42,
    completedModules: 2
  },
  readiness: {
    overall: 62,
    levelText: 'Almost ready',
    categories: {
      skills: 55,
      portfolio: 60,
      resume: 75,
      interview: 50,
      profile: 80,
      progress: 42
    }
  },
  activeCatTab: 'All',
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
    title: 'Social Media Strategy: Creating a 1-Week Content Calendar',
    status: 'In Progress',
    fileAttached: false,
    fileName: 'SocialMedia_Strategy_Draft_Minakshi.pdf',
    linkUrl: 'https://notion.so/minakshi-social-strategy',
    notes: 'Drafted 5 content pillars for local brand campaign.'
  },
  community: {
    activeCategory: 'All',
    posts: [
      {
        id: 1,
        author: 'Priya Sharma',
        role: 'Marketing Cohort · Restarting after 3 yrs',
        category: 'Wins',
        content: 'Completed my first portfolio project on Canva & Meta Ads today! Feeling my confidence coming back after 3 years away.',
        likes: 24,
        liked: false,
        commentsCount: 6,
        time: '2h ago'
      },
      {
        id: 2,
        author: 'Ananya Roy',
        role: 'Career Restart · HR Track',
        category: 'Career Restart',
        content: 'How did you all frame a 4-year relocation gap in your introductory pitch? Need some reassurance before mock interviews.',
        likes: 18,
        liked: false,
        commentsCount: 11,
        time: '5h ago'
      },
      {
        id: 3,
        author: 'Sneha Patel',
        role: 'Data Track · Homemaker to Tech',
        category: 'Job Search',
        content: 'Attended the Thursday live doubt-clearing session. The mentor breakdown on spreadsheet formulas made things so clear!',
        likes: 15,
        liked: false,
        commentsCount: 4,
        time: '1d ago'
      }
    ]
  },
  mockInterview: {
    currentIndex: 0,
    isRecording: false,
    questions: [
      {
        type: 'Career Break & Motivation',
        q: 'Walk me through your career break and what inspired your comeback to Digital Marketing.',
        tip: 'Focus on proactive upskilling, personal growth, and practical project application through Mentra.'
      },
      {
        type: 'Work-from-Home Discipline',
        q: 'How do you structure your daily routine to balance flexible remote work with family responsibilities?',
        tip: 'Highlight time-blocking, transparent communication, and dedicated uninterrupted work hours.'
      },
      {
        type: 'Practical Role Craft',
        q: 'How would you measure the success of an organic social media campaign on Instagram for a small business?',
        tip: 'Mention engagement rate, save/share ratio, click-through rate, and lead conversions.'
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
  // Hide all screen views
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

  // Persistent bottom navigation visibility (Home, Learn, Community, Progress, Profile)
  const bottomNav = document.getElementById('appBottomNav');
  const mainTabs = ['s-home', 's-learn-dashboard', 's-community', 's-progress', 's-profile'];
  if (bottomNav) {
    bottomNav.style.display = mainTabs.includes(screenId) ? 'flex' : 'none';
  }

  // Active bottom nav tab state
  document.querySelectorAll('.nav-tab-item').forEach(tab => tab.classList.remove('active'));
  if (screenId === 's-home') document.getElementById('tab-home')?.classList.add('active');
  if (screenId === 's-learn-dashboard') document.getElementById('tab-learn')?.classList.add('active');
  if (screenId === 's-community') document.getElementById('tab-community')?.classList.add('active');
  if (screenId === 's-progress') document.getElementById('tab-progress')?.classList.add('active');
  if (screenId === 's-profile') document.getElementById('tab-profile')?.classList.add('active');

  // Dynamic Content Compilation on Navigation
  if (screenId === 's-quiz-7-processing') {
    startQuizProcessing();
  } else if (screenId === 's-home') {
    renderDashboardPersonalization();
  }

  updateUIElements();
}

/**
 * -----------------------------------------------------------------------------
 * 7-STEP QUIZ INTERACTIVE HANDLERS
 * -----------------------------------------------------------------------------
 */

// Screen 1: Situation & Break Duration
function selectQuizSituation(el, situationVal) {
  selectSingleOption(el);
  appState.user.situation = situationVal;
  
  const breakDurationBox = document.getElementById('q1BreakDurationSection');
  if (breakDurationBox) {
    breakDurationBox.style.display = situationVal === 'On a career break' ? 'block' : 'none';
  }
}

function selectQuizBreakDuration(el, durationVal) {
  selectSingleOption(el);
  appState.user.breakDuration = durationVal;
}

// Screen 2: Break Reason & Previous Work
function selectQuizBreakReason(el, reasonVal) {
  selectSingleOption(el);
  appState.user.breakReason = reasonVal;
}

function selectQuizPreviousWork(el, workVal) {
  selectSingleOption(el);
  appState.user.previousWork = workVal;
}

// Screen 3: Role Clarity & Interests
function selectQuizRoleClarity(el, clarityVal) {
  selectSingleOption(el);
  appState.user.roleClarity = clarityVal;
}

function selectQuizWorkInterest(el, interestVal) {
  selectSingleOption(el);
  appState.user.workInterest = interestVal;
}

// Screen 4: Confidence & Skills Comfort
function selectQuizConfidence(el, confVal) {
  selectSingleOption(el);
  appState.user.confidence = confVal;
}

function selectQuizTechComfort(el, techVal) {
  selectSingleOption(el);
  appState.user.techComfort = techVal;
}

function selectQuizEnglishComfort(el, englishVal) {
  selectSingleOption(el);
  appState.user.englishComfort = englishVal;
}

// Screen 5: Time, Timeline & Goals
function selectQuizTimeCommitment(el, timeVal) {
  selectSingleOption(el);
  appState.user.timeCommitment = timeVal;
}

function selectQuizEarningTimeline(el, timelineVal) {
  selectSingleOption(el);
  appState.user.earningTimeline = timelineVal;
}

function selectQuizPrimaryGoal(el, goalVal) {
  selectSingleOption(el);
  appState.user.primaryGoal = goalVal;
}

// Screen 6: Family Support & Blocker
function selectQuizFamilySupport(el, supportVal) {
  selectSingleOption(el);
  appState.user.familySupport = supportVal;
}

function handleQuizWorryInput(inputEl) {
  appState.user.biggestWorry = inputEl.value;
}

function selectSingleOption(cardEl) {
  cardEl.parentElement.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
  cardEl.classList.add('selected');
}

/**
 * Screen 7: Processing Simulation
 */
function startQuizProcessing() {
  const steps = [
    document.getElementById('procStep1'),
    document.getElementById('procStep2'),
    document.getElementById('procStep3'),
    document.getElementById('procStep4')
  ];

  setTimeout(() => { if (steps[0]) steps[0].style.opacity = '1'; }, 300);
  setTimeout(() => { if (steps[1]) steps[1].style.opacity = '1'; }, 700);
  setTimeout(() => { if (steps[2]) steps[2].style.opacity = '1'; }, 1100);
  setTimeout(() => { if (steps[3]) steps[3].style.opacity = '1'; }, 1500);

  setTimeout(() => {
    goToScreen('s-home');
    showToast('Your personalized comeback dashboard is ready');
  }, 2000);
}

/**
 * -----------------------------------------------------------------------------
 * DASHBOARD PERSONALIZATION ENGINE
 * -----------------------------------------------------------------------------
 */

function renderDashboardPersonalization() {
  const u = appState.user;

  // Header and Welcome
  const subTitle = document.getElementById('dashSubtitle');
  if (subTitle) subTitle.textContent = `${u.name}'s clarity plan`;

  // Restart Journey Description
  const journeyDesc = document.getElementById('journeyDescText');
  if (journeyDesc) {
    journeyDesc.textContent = `You've taken a career pause of ${u.breakDuration} due to ${u.breakReason.toLowerCase()} (with prior background in ${u.previousWork.toLowerCase()}) and are looking to achieve ${u.primaryGoal.toLowerCase()}.`;
  }

  // Profile Snapshot Fields
  setElText('snapSituation', u.situation);
  setElText('snapCareerGap', u.breakDuration);
  setElText('snapBreakReason', u.breakReason);
  setElText('snapPreviousWork', u.previousWork);
  setElText('snapRoleClarity', u.roleClarity);
  setElText('snapInterest', u.workInterest);
  setElText('snapConfidence', u.confidence.split('—')[0]);
  setElText('snapTechComfort', u.techComfort.split('—')[0]);
  setElText('snapEnglish', u.englishComfort.split('—')[0]);
  setElText('snapTimeCommitment', u.timeCommitment);
  setElText('snapTimeline', u.earningTimeline);
  setElText('snapPrimaryGoal', u.primaryGoal);

  // Recommended Roles Logic (Rule-based)
  renderRecommendedRoles(u);

  // Dynamic Strengths
  renderStrengths(u);

  // Dynamic Focus Areas
  renderFocusAreas(u);

  // Action Roadmap
  renderActionRoadmap(u);
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderRecommendedRoles(u) {
  const role1Title = document.getElementById('recRole1Title');
  const role1Desc = document.getElementById('recRole1Desc');
  const role2Title = document.getElementById('recRole2Title');
  const role2Desc = document.getElementById('recRole2Desc');

  if (u.workInterest.includes('Marketing') || u.workInterest.includes('Content')) {
    if (role1Title) role1Title.textContent = 'Digital Marketing Specialist';
    if (role1Desc) role1Desc.textContent = `Combines your interest in marketing with your goal for ${u.primaryGoal.toLowerCase()}. Strong freelance & remote demand.`;
    if (role2Title) role2Title.textContent = 'Social Media & Community Manager';
    if (role2Desc) role2Desc.textContent = 'Visual storytelling, scheduling tools, and community engagement for growing digital brands.';
  } else if (u.workInterest.includes('People') || u.workInterest.includes('HR')) {
    if (role1Title) role1Title.textContent = 'Talent Acquisition & HR Coordinator';
    if (role1Desc) role1Desc.textContent = `Leverages your people skills and prior ${u.previousWork.toLowerCase()} experience for structured recruitment support.`;
    if (role2Title) role2Title.textContent = 'Operations & Virtual Assistant';
    if (role2Desc) role2Desc.textContent = 'Remote administrative coordination, email management, and stakeholder scheduling.';
  } else if (u.workInterest.includes('Numbers') || u.workInterest.includes('reports')) {
    if (role1Title) role1Title.textContent = 'Data & Business Analytics Assistant';
    if (role1Desc) role1Desc.textContent = 'Spreadsheets, dashboard reporting, and business metrics for flexible remote roles.';
    if (role2Title) role2Title.textContent = 'Operations Analyst';
    if (role2Desc) role2Desc.textContent = 'Organizing workflows and tracking operational KPIs with digital software.';
  } else {
    if (role1Title) role1Title.textContent = 'Virtual Operations Coordinator';
    if (role1Desc) role1Desc.textContent = `Ideal for structured remote support aligned with your ${u.primaryGoal.toLowerCase()} goal.`;
    if (role2Title) role2Title.textContent = 'Content & Community Associate';
    if (role2Desc) role2Desc.textContent = 'Social communication and customer messaging with beginner-friendly learning curve.';
  }
}

function renderStrengths(u) {
  const list = document.getElementById('strengthsList');
  if (!list) return;

  const strengths = [];
  if (u.previousWork !== 'No formal work experience') {
    strengths.push(`Prior background in ${u.previousWork}`);
  }
  if (u.englishComfort.includes('Intermediate') || u.englishComfort.includes('Fluent')) {
    strengths.push('Workplace English communication');
  }
  if (u.familySupport.includes('Yes') || u.familySupport.includes('Somewhat')) {
    strengths.push('Supportive household foundation');
  }
  strengths.push(`Clear intention to ${u.primaryGoal.toLowerCase()}`);

  list.innerHTML = strengths.map(s => `
    <div style="display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--success-700); font-weight:700;">
      <svg class="h-icon h-icon-sm" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
      <span>${s}</span>
    </div>
  `).join('');
}

function renderFocusAreas(u) {
  const list = document.getElementById('focusAreasList');
  if (!list) return;

  const focus = [];
  if (u.confidence.includes('Low')) {
    focus.push('Rebuilding confidence & overcoming imposter syndrome');
  }
  if (u.techComfort.includes('Beginner') || u.techComfort.includes('Basic')) {
    focus.push('Familiarity with modern online tools & apps');
  }
  focus.push('Practical hands-on project deliverables');
  focus.push('Explaining your career break during interviews');

  list.innerHTML = focus.map(f => `
    <div style="display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--primary-700); font-weight:700;">
      <svg class="h-icon h-icon-sm" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg>
      <span>${f}</span>
    </div>
  `).join('');
}

function renderActionRoadmap(u) {
  const thisWeek = document.getElementById('roadmapThisWeek');
  const next2Weeks = document.getElementById('roadmapNext2Weeks');
  const next1to3Months = document.getElementById('roadmapNext1to3Months');

  if (thisWeek) thisWeek.textContent = `Explore ${appState.programme.title} foundations and review initial orientation.`;
  if (next2Weeks) next2Weeks.textContent = `Complete Module 1 & 2 exercises and connect with a Career Restart Advisor.`;
  if (next1to3Months) next1to3Months.textContent = `Build your practical portfolio deliverables and prepare for ${u.earningTimeline.toLowerCase()} earning goal.`;
}

/**
 * -----------------------------------------------------------------------------
 * PROGRAMME CATALOGUE & FILTERING
 * -----------------------------------------------------------------------------
 */

const PROGRAMMES_DATA = [
  {
    id: 'prog-marketing',
    title: 'Digital Marketing Career Restart',
    category: 'Marketing',
    duration: '8 weeks',
    level: 'Beginner friendly',
    format: 'Video + PDF + Live Classes',
    modules: '8 modules',
    outcome: 'Work-from-home campaign preparation'
  },
  {
    id: 'prog-social',
    title: 'Social Media & Community Specialist',
    category: 'Marketing',
    duration: '6 weeks',
    level: 'Beginner friendly',
    format: 'Video + PDF + Live Classes',
    modules: '6 modules',
    outcome: 'Social strategy & content creation'
  },
  {
    id: 'prog-hr',
    title: 'HR & Talent Acquisition Coordinator',
    category: 'HR',
    duration: '8 weeks',
    level: 'Beginner friendly',
    format: 'Video + PDF + Live Classes',
    modules: '8 modules',
    outcome: 'Recruitment & screening operations'
  },
  {
    id: 'prog-va',
    title: 'Virtual Operations & Executive Support',
    category: 'Business',
    duration: '6 weeks',
    level: 'Beginner friendly',
    format: 'Video + PDF + Live Classes',
    modules: '6 modules',
    outcome: 'Remote admin & client coordination'
  },
  {
    id: 'prog-data',
    title: 'Data & Analytics Fundamentals',
    category: 'Data',
    duration: '10 weeks',
    level: 'Intermediate',
    format: 'Video + PDF + Live Classes',
    modules: '8 modules',
    outcome: 'Spreadsheet metrics & reporting'
  },
  {
    id: 'prog-design',
    title: 'Product Design & UI Craft',
    category: 'Design',
    duration: '12 weeks',
    level: 'Intermediate',
    format: 'Video + PDF + Live Classes',
    modules: '10 modules',
    outcome: 'Figma case studies & portfolio'
  }
];

function filterProgrammes(cat, pillEl) {
  appState.activeCatTab = cat;
  document.querySelectorAll('.cat-tab-pill').forEach(p => p.classList.remove('active'));
  if (pillEl) pillEl.classList.add('active');

  const container = document.getElementById('programmesCatalogueList');
  if (!container) return;

  const filtered = cat === 'All' 
    ? PROGRAMMES_DATA 
    : PROGRAMMES_DATA.filter(p => p.category === cat);

  container.innerHTML = filtered.map(p => `
    <div class="category-card" onclick="viewProgrammeDetails('${p.id}')">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <span class="chip chip-primary" style="font-size:10.5px;">${p.category}</span>
        <span style="font-size:11.5px; font-weight:700; color:var(--neutral-500);">${p.duration}</span>
      </div>
      <div style="font-size:15px; font-weight:800; color:var(--color-black); margin-top:4px;">${p.title}</div>
      <div style="font-size:12px; color:var(--neutral-600); margin-top:2px;">${p.format} · ${p.level}</div>
      <div style="font-size:11.5px; color:var(--success-700); font-weight:700; margin-top:4px;">Outcome: ${p.outcome}</div>
      <button class="btn-primary" style="height:36px; font-size:12px; margin-top:8px;">View Programme →</button>
    </div>
  `).join('');
}

function viewProgrammeDetails(progId) {
  const prog = PROGRAMMES_DATA.find(p => p.id === progId) || PROGRAMMES_DATA[0];
  appState.programme.id = prog.id;
  appState.programme.title = prog.title;
  appState.programme.category = prog.category;
  appState.programme.duration = prog.duration;

  const titleEl = document.getElementById('progDetailTitle');
  if (titleEl) titleEl.textContent = prog.title;

  goToScreen('s-programme-details');
}

/**
 * -----------------------------------------------------------------------------
 * FREE VALUE & PURCHASE / ENROLMENT FLOW
 * -----------------------------------------------------------------------------
 */

function startFree2DayTrial() {
  appState.enrolled = true;
  goToScreen('s-learn-dashboard');
  showToast('Free 2-Day Access Activated. Module 1 and Career Roadmap unlocked.');
}

function openCounsellorModal() {
  openModal('modalCounsellorCall');
}

function confirmCounsellorCall() {
  closeModal('modalCounsellorCall');
  showToast('Free Career Guidance Call booked with a Mentra Advisor for Friday 4:00 PM.');
}

function openPurchaseModal() {
  openModal('modalPurchase');
}

function confirmPurchase() {
  closeModal('modalPurchase');
  appState.enrolled = true;
  goToScreen('s-learn-dashboard');
  showToast("You're enrolled! Welcome to Digital Marketing Career Restart.");
}

/**
 * -----------------------------------------------------------------------------
 * LMS & COURSE LEARNING EXPERIENCE
 * -----------------------------------------------------------------------------
 */

function toggleVideoPlay() {
  appState.videoLesson.isPlaying = !appState.videoLesson.isPlaying;
  const barPlayBtn = document.getElementById('videoControlPlayBtn');

  if (barPlayBtn) barPlayBtn.textContent = appState.videoLesson.isPlaying ? 'Pause' : 'Play';
  
  if (appState.videoLesson.isPlaying) {
    showToast('Playing: Module 2 — Social Media Fundamentals');
  }
}

function completeVideoLesson() {
  appState.videoLesson.completed = true;
  appState.readiness.overall = Math.min(100, appState.readiness.overall + 4);
  appState.programme.progressPct = Math.min(100, appState.programme.progressPct + 6);
  
  updateUIElements();
  goToScreen('s-module-detail');
  showToast('Video Lesson completed. Module progress updated.');
}

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
      1: "<h3>1. Social Media Framework</h3><p>Understanding organic vs paid social distribution for modern small business growth.</p>",
      2: "<h3>2. Core Content Pillars</h3><p>Structuring the 5 key pillars: Educational, Promotional, Behind-the-scenes, Social Proof, and Interactive.</p>",
      3: "<h3>3. Crafting the Weekly Schedule</h3><p>How to organize visual assets, captions, and publishing cadences using Notion or Google Sheets.</p>",
      4: "<h3>4. Engagement Protocols</h3><p>Replying to direct inquiries, customer comments, and community building routines.</p>",
      5: "<h3>5. Analytics & KPI Tracking</h3><p>Measuring reach, engagement rate, saves, and conversion clicks.</p>",
      6: "<h3>6. Campaign Case Study</h3><p>Real-world sample walkthrough: Grew local bakery engagement by 320% in 30 days.</p>",
      7: "<h3>7. Common Pitfalls</h3><p>Avoiding irregular posting, inconsistent brand voice, and ignoring audience replies.</p>",
      8: "<h3>8. Deliverable Checklist</h3><p>Verify your 1-Week Content Calendar has 5 scheduled posts with caption hooks and graphic prompts.</p>"
    };
    pageContent.innerHTML = pagesText[appState.pdfLesson.currentPage] || pagesText[3];
  }
}

function completePdfLesson() {
  appState.pdfLesson.completed = true;
  appState.readiness.overall = Math.min(100, appState.readiness.overall + 4);
  appState.programme.progressPct = Math.min(100, appState.programme.progressPct + 6);
  
  updateUIElements();
  goToScreen('s-module-detail');
  showToast('PDF Reading completed. Career readiness increased.');
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
    prompt.innerHTML = 'Attached: <strong>SocialMedia_Strategy_Draft_Minakshi.pdf</strong> (1.9 MB)';
    prompt.style.color = 'var(--success-700)';
  }
  showToast('Document attached: SocialMedia_Strategy_Draft_Minakshi.pdf');
}

function submitAssignmentWork() {
  if (!appState.assignment.fileAttached) {
    simulateAssignmentFile();
  }

  appState.assignment.status = 'Submitted';
  appState.readiness.overall = Math.min(100, appState.readiness.overall + 8);
  appState.readiness.categories.portfolio = 80;
  appState.programme.progressPct = 50;

  // Update Next Action dynamically
  const nextTitle = document.getElementById('nextActionTitle');
  const nextBtn = document.getElementById('nextActionBtn');
  if (nextTitle) nextTitle.textContent = 'Attend Thursday Live Doubt-Clearing Class';
  if (nextBtn) {
    nextBtn.textContent = 'View Live Class Details →';
    nextBtn.onclick = () => goToScreen('s-live-class');
  }

  updateUIElements();
  goToScreen('s-learn-dashboard');
  showToast('Assignment Submitted. Status updated to Under Review.');
}

/**
 * -----------------------------------------------------------------------------
 * COMMUNITY FEED (Heroicons SVG integration)
 * -----------------------------------------------------------------------------
 */

function filterCommunityCategory(cat, pillEl) {
  appState.community.activeCategory = cat;
  document.querySelectorAll('.comm-cat-pill').forEach(p => p.classList.remove('active'));
  if (pillEl) pillEl.classList.add('active');

  renderCommunityPosts();
}

function renderCommunityPosts() {
  const container = document.getElementById('communityFeedContainer');
  if (!container) return;

  const cat = appState.community.activeCategory;
  const filtered = cat === 'All' 
    ? appState.community.posts 
    : appState.community.posts.filter(p => p.category === cat);

  container.innerHTML = filtered.map(post => `
    <div class="post-card">
      <div class="post-header">
        <div class="post-avatar">${post.author.charAt(0)}</div>
        <div style="flex:1;">
          <div style="font-weight:800; font-size:13.5px; color:var(--color-black);">${post.author}</div>
          <div style="font-size:11px; color:var(--neutral-500);">${post.role} · ${post.time}</div>
        </div>
        <span class="chip chip-neutral" style="font-size:10px;">${post.category}</span>
      </div>
      <p style="font-size:12.5px; color:var(--neutral-800); line-height:1.45;">${post.content}</p>
      <div class="post-actions">
        <button class="post-act-btn ${post.liked ? 'liked' : ''}" onclick="toggleLikePost(${post.id})">
          <svg class="h-icon h-icon-sm" fill="${post.liked ? 'currentColor' : 'none'}" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
          <span>${post.likes}</span>
        </button>
        <button class="post-act-btn" onclick="showToast('Comments thread opened')">
          <svg class="h-icon h-icon-sm" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-.744-.658.75.75 0 0 1 .05-.417l.803-1.606A8.09 8.09 0 0 1 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" /></svg>
          <span>${post.commentsCount} comments</span>
        </button>
        <button class="post-act-btn" style="margin-left:auto;" onclick="showToast('Post saved to your bookmarks')">
          <svg class="h-icon h-icon-sm" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
        </button>
      </div>
    </div>
  `).join('');
}

function toggleLikePost(postId) {
  const post = appState.community.posts.find(p => p.id === postId);
  if (post) {
    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;
    renderCommunityPosts();
  }
}

function submitNewCommunityPost() {
  const textarea = document.getElementById('newPostContent');
  const catSelect = document.getElementById('newPostCategory');
  if (textarea && textarea.value.trim()) {
    const newPost = {
      id: Date.now(),
      author: appState.user.name,
      role: 'Marketing Cohort · Learning Journey',
      category: catSelect ? catSelect.value : 'General',
      content: textarea.value.trim(),
      likes: 1,
      liked: true,
      commentsCount: 0,
      time: 'Just now'
    };
    appState.community.posts.unshift(newPost);
    textarea.value = '';
    closeModal('modalCreatePost');
    renderCommunityPosts();
    showToast('Post published to community feed.');
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
    btn.textContent = appState.mockInterview.isRecording ? 'Stop & Analyze Answer' : 'Record Practice Answer';
    btn.style.background = appState.mockInterview.isRecording ? 'var(--error-600)' : 'var(--primary-600)';
  }
  if (status) {
    status.style.display = appState.mockInterview.isRecording ? 'block' : 'none';
  }
  if (!appState.mockInterview.isRecording) {
    showToast('Answer captured. Mentor framework verified structure & clarity.');
  }
}

function renderMockInterview() {
  const item = appState.mockInterview.questions[appState.mockInterview.currentIndex];
  setElText('interviewQType', item.type);
  setElText('interviewQText', `"${item.q}"`);
  setElText('interviewQTip', item.tip);
  setElText('interviewQNum', `Question ${appState.mockInterview.currentIndex + 1} of ${appState.mockInterview.questions.length}`);
}

/**
 * -----------------------------------------------------------------------------
 * RE-ENGAGEMENT, MISSED DEADLINE & 100% READY
 * -----------------------------------------------------------------------------
 */

function toggleSimulateInactivity() {
  appState.inactivitySimulated = !appState.inactivitySimulated;
  const banner = document.getElementById('inactivityBanner');
  if (banner) {
    banner.style.display = appState.inactivitySimulated ? 'block' : 'none';
  }
  showToast(appState.inactivitySimulated ? 'Inactivity mode simulated (5 days away)' : 'Active mode restored');
}

function openCatchUpModal() {
  openModal('modalCatchUp');
}

function confirmCatchUp() {
  closeModal('modalCatchUp');
  document.getElementById('missedDeadlineBanner')?.style.setProperty('display', 'none');
  document.getElementById('inactivityBanner')?.style.setProperty('display', 'none');
  showToast('Condensed Catch-Up Mode Activated: 25 mins session configured.');
}

function openRescheduleModal() {
  openModal('modalReschedule');
}

function confirmReschedule() {
  closeModal('modalReschedule');
  document.getElementById('missedDeadlineBanner')?.style.setProperty('display', 'none');
  showToast('Task rescheduled for tomorrow. Your streak remains protected.');
}

function simulateFullReadiness() {
  appState.readiness.overall = 100;
  appState.readiness.levelText = 'Career Ready';
  appState.programme.progressPct = 100;
  appState.programme.completedModules = 8;
  appState.readiness.categories = {
    skills: 100,
    portfolio: 100,
    resume: 100,
    interview: 100,
    profile: 100,
    progress: 100
  };
  updateUIElements();
  goToScreen('s-celebration');
  showToast('100% Career Ready achieved. All requirements verified.');
}

function resetAllProgress() {
  appState.readiness.overall = 62;
  appState.readiness.levelText = 'Almost ready';
  appState.programme.progressPct = 42;
  appState.assignment.status = 'In Progress';
  appState.assignment.fileAttached = false;
  appState.inactivitySimulated = false;
  goToScreen('s-splash');
  showToast('App reset to initial onboarding state.');
}

/**
 * -----------------------------------------------------------------------------
 * MODALS & UI SYNC
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

function updateUIElements() {
  const r = appState.readiness.overall;
  const p = appState.programme.progressPct;

  setElText('progRingReadiness', `${r}%`);
  setElText('dashReadinessPct', `${r}%`);
  setElText('sheetScoreNum', `${r}%`);
  setElText('progRingProgramme', `${p}%`);
  setElText('dashProgPct', `${p}% complete`);

  const dashProgFill = document.getElementById('dashProgFill');
  if (dashProgFill) dashProgFill.style.width = `${p}%`;

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

// Initializer
document.addEventListener('DOMContentLoaded', () => {
  renderMockInterview();
  renderCommunityPosts();
  filterProgrammes('All', null);
  renderDashboardPersonalization();
  updateUIElements();

  // Explicitly ensure the discovery quiz is opened on load
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById(hash)) {
    goToScreen(hash);
  } else {
    goToScreen('s-quiz-1-situation');
  }
});
