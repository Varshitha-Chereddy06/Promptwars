// FIFA AuraAI - Main Application Logic
// Handles state, SVG map rendering, YOLO Canvas simulation, Chat Concierge, and Fan memory generation.

// Global App State
const state = {
  currentRole: 'fan',
  currentTab: 'companion',
  selectedSection: null,
  activeOverlay: 'experience',
  mySeat: 'sec-203', // Starts at East Upper
  mySeatLabel: 'Section 203 (East Upper)',
  mySeatAura: 52,
  gameTime: 72,
  tickInterval: null,
  cctvActive: false,
  canvasAnimationId: null,
  activeIncidents: {
    gate4: true,
    sec211: false
  }
};

// Colors for SVG mapping based on score metrics
const colorsMap = {
  high: { fill: '#06b6d4', stroke: '#22d3ee', opacity: 0.75 },     // Cyan
  mediumHigh: { fill: '#3b82f6', stroke: '#60a5fa', opacity: 0.6 }, // Blue
  medium: { fill: '#a855f7', stroke: '#c084fc', opacity: 0.45 },   // Purple
  low: { fill: '#ec4899', stroke: '#f472b6', opacity: 0.25 },     // Pink
  shadeCover: { fill: '#1e293b', stroke: '#475569', opacity: 0.8 },// Dark shade
  greenOk: { fill: '#10b981', stroke: '#34d399', opacity: 0.65 }   // Green
};

// Initialize Application
window.addEventListener('DOMContentLoaded', () => {
  initGameClock();
  applyOverlayColors();
  setupSVGEventHandlers();
  
  // Set initial labels
  document.getElementById('mySeatLabel').textContent = state.mySeatLabel;
  document.getElementById('mySeatAura').textContent = state.mySeatAura + '/100';
  document.getElementById('fanSeat').value = state.mySeatLabel;

  // Render initial YOLO CCTV Canvas to make it look active in background if tabs switch
  initYoloCanvas();
});

// 1. Live Match Clock Simulator
function initGameClock() {
  let seconds = 45;
  state.tickInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      state.gameTime++;
      seconds = 0;
    }
    const clockText = `${state.gameTime}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('gameClock').textContent = clockText;
    
    // Random live event triggers
    if (state.gameTime === 75 && seconds === 10) {
      showLiveAlert("Goal Alert! Kylian Mbappé fires from close range. France scores! Game is 2-3.");
      document.querySelector('.match-teams .score').textContent = "2 - 3";
      updateLiveMarketplaceForGoal();
    }
    if (state.gameTime === 80 && seconds === 30) {
      showLiveAlert("Congestion Alert: Section 211 upper access gates experiencing fan surge. Staff advised.");
      if (state.currentRole === 'staff') {
        triggerSimulatedIncident('crowd_surge');
      }
    }
  }, 1000);
}

function showLiveAlert(message) {
  const ticker = document.getElementById('tickerAlert');
  if (ticker) {
    ticker.textContent = message;
    ticker.classList.remove('animate-pulse');
    void ticker.offsetWidth; // Trigger reflow
    ticker.style.animation = 'subtle-pulse 3s infinite ease-in-out';
  }
}

// 2. Tab Navigation
function switchTab(tabId) {
  state.currentTab = tabId;
  
  // Update Tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}Btn`);
  if (activeBtn) activeBtn.classList.add('active');

  // Update Tab content panels
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
  const activeContent = document.getElementById(`tab${tabId.charAt(0).toUpperCase() + tabId.slice(1)}`);
  if (activeContent) activeContent.classList.add('active');

  // CCTV Rendering loop start/stop
  if (tabId === 'ops' && state.currentRole === 'staff') {
    state.cctvActive = true;
    animateYoloCanvas();
  } else {
    state.cctvActive = false;
    if (state.canvasAnimationId) {
      cancelAnimationFrame(state.canvasAnimationId);
    }
  }
}

// 3. User Persona/Role Switching
function switchRole(role) {
  state.currentRole = role;
  
  const fanBtn = document.getElementById('roleFan');
  const staffBtn = document.getElementById('roleStaff');
  const opsTabBtn = document.getElementById('tabOpsBtn');

  if (role === 'staff') {
    fanBtn.classList.remove('active');
    staffBtn.classList.add('active');
    opsTabBtn.style.display = 'flex'; // Show Operations tab
    
    // Show CCTV Bounding overlay on SVG
    document.getElementById('yoloVisionOverlay').style.display = 'block';
    
    // Switch to Ops tab
    switchTab('ops');
    showToast("Switched to Stadium Operations view. CCTV & dispatcher active.");
    
    // Add welcome message to chat
    addChatMessage("agent", "### 🚨 Staff Operations Concierge Online\nI've unlocked the operational tools and emergency logs. Ask me about **crowd control recommendations**, **volunteer dispatch status**, or **metro queues**.", "15:53");
  } else {
    fanBtn.classList.add('active');
    staffBtn.classList.remove('active');
    opsTabBtn.style.display = 'none'; // Hide Operations tab
    
    // Hide CCTV Bounding overlay on SVG
    document.getElementById('yoloVisionOverlay').style.display = 'none';
    
    if (state.currentTab === 'ops') {
      switchTab('companion');
    }
    showToast("Switched to Fan Experience view.");
  }
}

// 4. SVG Digital Twin Visual Heatmap Coloring
function applyOverlayColors() {
  const metric = state.activeOverlay;
  const sections = mcpDatabase.digitalTwin.sections;
  
  Object.keys(sections).forEach(secId => {
    const secEl = document.getElementById(secId);
    if (!secEl) return;
    
    const data = sections[secId];
    let score = 0;
    
    // Select score value depending on active filter
    switch (metric) {
      case 'experience':
        score = data.overallAura;
        break;
      case 'community':
        score = data.communityDensity.team === 'Argentina' ? 95 : (data.communityDensity.team === 'France' ? 80 : 20);
        break;
      case 'jersey':
        score = data.jerseyProb;
        break;
      case 'selfie':
        score = data.selfieScore;
        break;
      case 'celebration':
        score = data.chantEnergy * 0.9 + data.jerseyProb * 0.1; // celebration hotspot approximation
        if (secId === 'sec-111' || secId === 'sec-121' || secId === 'sec-110') score = 95;
        break;
      case 'chant':
        score = data.chantEnergy;
        break;
      case 'shade':
        score = data.shadeComfort;
        break;
      case 'exit':
        score = data.exitEvac;
        break;
    }
    
    // Apply styling parameters based on thresholds
    if (metric === 'shade') {
      if (score >= 80) {
        secEl.style.fill = colorsMap.shadeCover.fill;
        secEl.style.fillOpacity = 0.55;
        secEl.style.stroke = colorsMap.shadeCover.stroke;
      } else {
        secEl.style.fill = '#f59e0b'; // Sunny yellow
        secEl.style.fillOpacity = 0.25;
        secEl.style.stroke = '#fbbf24';
      }
    } else if (metric === 'community') {
      if (data.communityDensity.team === 'Argentina') {
        secEl.style.fill = '#38bdf8'; // Sky Blue
        secEl.style.fillOpacity = 0.65;
        secEl.style.stroke = '#bae6fd';
      } else if (data.communityDensity.team === 'France') {
        secEl.style.fill = '#ec4899'; // France pink
        secEl.style.fillOpacity = 0.55;
        secEl.style.stroke = '#fbcfe8';
      } else {
        secEl.style.fill = 'rgba(255, 255, 255, 0.04)';
        secEl.style.fillOpacity = 0.15;
        secEl.style.stroke = 'rgba(255, 255, 255, 0.15)';
      }
    } else {
      if (score >= 90) {
        secEl.style.fill = colorsMap.high.fill;
        secEl.style.fillOpacity = colorsMap.high.opacity;
        secEl.style.stroke = colorsMap.high.stroke;
      } else if (score >= 75) {
        secEl.style.fill = colorsMap.mediumHigh.fill;
        secEl.style.fillOpacity = colorsMap.mediumHigh.opacity;
        secEl.style.stroke = colorsMap.mediumHigh.stroke;
      } else if (score >= 60) {
        secEl.style.fill = colorsMap.medium.fill;
        secEl.style.fillOpacity = colorsMap.medium.opacity;
        secEl.style.stroke = colorsMap.medium.stroke;
      } else {
        secEl.style.fill = colorsMap.low.fill;
        secEl.style.fillOpacity = colorsMap.low.opacity;
        secEl.style.stroke = colorsMap.low.stroke;
      }
    }
    
    // Highlight my current seat specifically
    if (secId === state.mySeat) {
      secEl.style.stroke = '#ffffff';
      secEl.style.strokeWidth = '3px';
      secEl.style.strokeDasharray = '4 2';
    } else {
      secEl.style.strokeWidth = '2px';
      secEl.style.strokeDasharray = 'none';
    }
  });

  // Toggle visual elements based on overlays
  const sunOverlay = document.getElementById('sunOverlay');
  if (metric === 'shade') {
    sunOverlay.style.display = 'block';
  } else {
    sunOverlay.style.display = 'none';
  }
}

function changeOverlay(metric) {
  state.activeOverlay = metric;
  
  // Highlight correct toggle pill
  document.querySelectorAll('#overlayToggles .pill-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-metric') === metric) {
      btn.classList.add('active');
    }
  });

  applyOverlayColors();
  showToast(`Digital Twin overlay changed to: ${metric.toUpperCase()}`);
}

// 5. SVG Stadium Click Handlers
function setupSVGEventHandlers() {
  const sections = document.querySelectorAll('.stadium-sec');
  sections.forEach(sec => {
    sec.addEventListener('click', (e) => {
      const secId = e.target.id;
      selectSection(secId);
    });
  });
}

function selectSection(secId) {
  state.selectedSection = secId;
  
  // Highlight clicked section visually on SVG
  document.querySelectorAll('.stadium-sec').forEach(sec => {
    sec.classList.remove('selected');
  });
  const secEl = document.getElementById(secId);
  if (secEl) secEl.classList.add('selected');

  // Load section database
  const secData = mcpDatabase.digitalTwin.sections[secId];
  if (!secData) return;

  // Show Details Card Content
  document.getElementById('seatCardPlaceholder').classList.add('hidden');
  document.getElementById('seatCardContent').classList.remove('hidden');

  // Fill Details
  document.getElementById('seatSectionTitle').textContent = secData.name;
  document.getElementById('seatCategory').textContent = secData.category;
  document.getElementById('seatAuraScore').textContent = secData.overallAura;
  document.getElementById('seatPrice').textContent = `$${secData.price}`;
  document.getElementById('seatReasoningText').textContent = secData.reasoning;

  // Update Community density badge
  const commData = secData.communityDensity;
  if (commData) {
    document.getElementById('seatCommunityVal').textContent = `${commData.label} (${commData.ratio})`;
    const badge = document.getElementById('seatCommunityBadge');
    if (commData.team === 'Argentina') {
      badge.style.background = 'rgba(56, 189, 248, 0.15)';
      badge.style.borderColor = 'rgba(56, 189, 248, 0.35)';
      document.getElementById('seatCommunityVal').style.color = '#38bdf8';
    } else if (commData.team === 'France') {
      badge.style.background = 'rgba(236, 72, 153, 0.15)';
      badge.style.borderColor = 'rgba(236, 72, 153, 0.35)';
      document.getElementById('seatCommunityVal').style.color = 'var(--accent)';
    } else {
      badge.style.background = 'rgba(255, 255, 255, 0.05)';
      badge.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      document.getElementById('seatCommunityVal').style.color = 'var(--text-muted)';
    }
  }

  // Fill Metrics Progress Bars
  updateMetricBar('metricJersey', secData.jerseyProb);
  updateMetricBar('metricSelfie', secData.selfieScore);
  updateMetricBar('metricChant', secData.chantEnergy);
  updateMetricBar('metricBroadcast', secData.broadcastScore);
  updateMetricBar('metricShade', secData.shadeComfort);
  updateMetricBar('metricExit', secData.exitEvac);

  // Price Delta justification
  const delta = secData.price - secData.basePrice;
  const deltaEl = document.getElementById('priceDelta');
  if (delta > 0) {
    deltaEl.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> +$${delta} (due to high live aura match score)`;
    deltaEl.className = "price-justification text-green";
  } else if (delta < 0) {
    deltaEl.innerHTML = `<i class="fa-solid fa-arrow-trend-down"></i> -$${Math.abs(delta)} (reduced solar comfort)`;
    deltaEl.className = "price-justification text-yellow";
  } else {
    deltaEl.textContent = "Base Price (Normal Demand)";
    deltaEl.className = "price-justification text-fade";
  }

  // Adjust upgrade action button: hide if it's already my seat
  const upgradeBtnWrapper = document.getElementById('upgradeBtnWrapper');
  if (secId === state.mySeat) {
    upgradeBtnWrapper.innerHTML = `
      <button class="btn btn-outline-primary btn-block" disabled style="opacity: 0.6; cursor: not-allowed;">
        <i class="fa-solid fa-circle-check"></i> You Are Seated Here
      </button>
    `;
  } else {
    upgradeBtnWrapper.innerHTML = `
      <button class="btn btn-primary" onclick="initiateSeatUpgrade('${secId}')">
        <i class="fa-solid fa-circle-chevron-up"></i> Upgrade to This Seat
      </button>
    `;
  }
}

function updateMetricBar(elementId, value) {
  document.getElementById(`${elementId}Val`).textContent = `${value}%`;
  document.getElementById(`${elementId}Fill`).style.width = `${value}%`;
}

// Helper to bridge marketplace cards clicking directly to SVG map and panel select
function selectSectionFromMarket(secId) {
  selectSection(secId);
  // Highlight the section visually by scrolling to the stadium card
  document.getElementById('stadiumMap').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// 6. AI chatbot logic
function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const query = input.value.trim();
  if (!query) return;

  // Add User Bubble
  addChatMessage("user", query, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  input.value = "";

  // Call MCP Simulated Reasoning Waterfall
  simulateLLMReasoning(query, state.mySeat, state.currentRole).then(answer => {
    // Add Agent Bubble
    addChatMessage("agent", answer, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  });
}

function askQuickQuestion(q) {
  document.getElementById('chatInput').value = q;
  sendChatMessage();
}

function addChatMessage(sender, text, timestamp) {
  const feed = document.getElementById('chatFeed');
  if (!feed) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-message ${sender}`;

  // Simple Markdown Parsing helper (bold, header titles, lists)
  let htmlContent = text
    .replace(/^### (.*$)/gim, '<h4 style="font-family:var(--font-title); font-size:14px; margin-top:8px; margin-bottom:4px; font-weight:700; color:var(--secondary)">$1</h4>')
    .replace(/^## (.*$)/gim, '<h3 style="font-family:var(--font-title); font-size:16px; margin-top:12px; margin-bottom:6px; font-weight:800">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^\* (.*$)/gim, '<li style="margin-left:14px; margin-bottom:2px;">$1</li>');

  // Wrap list items
  if (htmlContent.includes('<li>')) {
    // Basic check to group sequential li elements (dirty but fast for simulation)
    htmlContent = htmlContent.replace(/<\/h4>\n<li/g, '</h4><ul style="margin:6px 0"><li');
    // close ul
  }

  bubble.innerHTML = `
    <div class="message-header">
      <span class="sender-name">
        ${sender === 'agent' ? '<i class="fa-solid fa-robot"></i> FIFA AuraAI Super Agent' : '<i class="fa-solid fa-user-astronaut"></i> You'}
      </span>
      <span class="timestamp">${timestamp}</span>
    </div>
    <div class="message-body">${htmlContent}</div>
  `;

  feed.appendChild(bubble);
  feed.scrollTop = feed.scrollHeight;
}

// 7. Dynamic Seat upgrades flow & Checkout Modal
function initiateSeatUpgrade(targetSecId = null, costOverride = null, labelOverride = null) {
  const targetId = targetSecId || state.selectedSection;
  if (!targetId) return;

  const targetData = mcpDatabase.digitalTwin.sections[targetId];
  const sourceData = mcpDatabase.digitalTwin.sections[state.mySeat];
  
  if (!targetData) return;

  // Calculate Upgrade Cost
  const cost = costOverride || Math.max(15, targetData.price - (sourceData ? sourceData.price : 100));
  
  // Fill Modal Contents
  document.getElementById('modalSourceSeat').textContent = state.mySeat.replace('sec-', 'Sec ');
  document.getElementById('modalTargetSeat').textContent = targetId.replace('sec-', 'Sec ');
  
  document.getElementById('modalTargetLabel').textContent = labelOverride || `${targetData.name} - ${targetData.category}`;
  
  const auraDiff = targetData.overallAura - (sourceData ? sourceData.overallAura : 50);
  const auraDeltaEl = document.getElementById('modalAuraDelta');
  if (auraDiff >= 0) {
    auraDeltaEl.textContent = `+${auraDiff}% (Experience Surge)`;
    auraDeltaEl.className = "text-green";
  } else {
    auraDeltaEl.textContent = `${auraDiff}% (Downgrade)`;
    auraDeltaEl.className = "text-red";
  }

  document.getElementById('modalAutographVal').textContent = `${targetData.jerseyProb}% (${targetData.jerseyProb > 75 ? 'Excellent' : 'Moderate'})`;
  document.getElementById('modalCostVal').textContent = `$${cost.toFixed(2)}`;

  // Bind confirmation state payload
  state.checkoutPayload = {
    targetId: targetId,
    cost: cost,
    label: targetData.name,
    aura: targetData.overallAura
  };

  // Open Modal
  document.getElementById('checkoutModal').classList.remove('hidden');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.add('hidden');
  state.checkoutPayload = null;
}

function completeSeatUpgrade() {
  if (!state.checkoutPayload) return;

  const payload = state.checkoutPayload;
  
  // 1. Update Core State
  state.mySeat = payload.targetId;
  state.mySeatLabel = `${payload.label} (Upgraded)`;
  state.mySeatAura = payload.aura;

  // 2. Refresh seat indicators & tables
  document.getElementById('mySeatLabel').textContent = state.mySeatLabel;
  document.getElementById('mySeatAura').textContent = state.mySeatAura + '/100';
  document.getElementById('fanSeat').value = state.mySeatLabel;

  // 3. Re-color stadium SVG map (updates current seat marker outline)
  applyOverlayColors();

  // 4. Update the select action on stadium twin card
  selectSection(payload.targetId);

  // 5. Close Modal & Show Success Toast
  closeCheckoutModal();
  showToast(`Re-Issued! Ticket re-routed to Section ${payload.targetId.replace('sec-', '')}. Wallet updated.`);

  // 6. Write transaction receipt directly in the MCP log console
  const terminal = document.getElementById("mcpTerminal");
  if (terminal) {
    terminal.innerHTML += `<div class="mcp-log-entry response">[TRANSACTION SUCCESS] Seat upgraded to ${payload.targetId.toUpperCase()}. Charging card fee $${payload.cost.toFixed(2)}. Updating Digital Twin inventory.</div>`;
    terminal.scrollTop = terminal.scrollHeight;
  }
}

// 8. simulated YOLO CCTV Canvas Rendering Engine
let yoloPoints = [];
function initYoloCanvas() {
  const canvas = document.getElementById('yoloCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Spawn random moving fan heatpoints
  yoloPoints = [];
  for (let i = 0; i < 24; i++) {
    yoloPoints.push({
      x: Math.random() * (canvas.width - 40) + 20,
      y: Math.random() * (canvas.height - 40) + 20,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
      type: Math.random() > 0.85 ? 'staff' : (Math.random() > 0.7 ? 'alert' : 'fan')
    });
  }
}

function animateYoloCanvas() {
  if (!state.cctvActive) return;

  const canvas = document.getElementById('yoloCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clear Frame
  ctx.fillStyle = '#020308';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw Pitch Outline Mock (CCTV View)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 40, canvas.width - 120, canvas.height - 80);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 40);
  ctx.lineTo(canvas.width / 2, canvas.height - 40);
  ctx.stroke();

  // Draw simulated CCTV static interference lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let i = 0; i < canvas.height; i += 6) {
    if (Math.random() > 0.2) {
      ctx.fillRect(0, i, canvas.width, 2);
    }
  }

  // Draw sweep line
  const time = Date.now() * 0.002;
  const sweepY = (Math.sin(time) + 1) * 0.5 * canvas.height;
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.15)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, sweepY);
  ctx.lineTo(canvas.width, sweepY);
  ctx.stroke();

  // Update & Draw heatpoints (simulating YOLOv11 bounding box detections)
  yoloPoints.forEach(p => {
    // bounce wall bounds
    p.x += p.dx;
    p.y += p.dy;

    if (p.x < 10 || p.x > canvas.width - 10) p.dx *= -1;
    if (p.y < 10 || p.y > canvas.height - 10) p.dy *= -1;

    // Draw point
    ctx.beginPath();
    if (p.type === 'alert') {
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444'; // Red
      ctx.fill();

      // Bounding box
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x - 12, p.y - 12, 24, 24);
      ctx.font = '8px monospace';
      ctx.fillStyle = '#ef4444';
      ctx.fillText(' bottleneck', p.x - 10, p.y - 15);
    } else if (p.type === 'staff') {
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6'; // Blue Staff
      ctx.fill();

      ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
      ctx.lineWidth = 1;
      ctx.strokeRect(p.x - 8, p.y - 8, 16, 16);
    } else {
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981'; // Green normal flow
      ctx.fill();
    }
  });

  // Stamp telemetry tag
  ctx.font = '8px monospace';
  ctx.fillStyle = '#6b7280';
  ctx.fillText(`CAM_12 SOUTH ENTRY | FPS: 30.0 | TIME: ${new Date().toLocaleTimeString()}`, 10, 20);

  // Request Next Frame
  state.canvasAnimationId = requestAnimationFrame(animateYoloCanvas);
}

// 9. Simulated Incidents & Dispatch Resolution
function triggerSimulatedIncident(type) {
  const terminal = document.getElementById("mcpTerminal");
  
  if (type === 'crowd_surge') {
    state.activeIncidents.sec211 = true;
    document.getElementById('surgedAlertItem').style.display = 'flex';
    document.getElementById('opsIncidentLabel').textContent = "Surge (Sec 211)";
    document.getElementById('opsIncidentSub').textContent = "Turnstile queue bottlenecking";
    
    // Set Section 211 on SVG map to high warning glow
    const sec211El = document.getElementById('sec-211');
    if (sec211El) {
      sec211El.style.fill = '#ef4444';
      sec211El.style.fillOpacity = 0.8;
      sec211El.style.stroke = '#fca5a5';
      sec211El.classList.add('animate-pulse');
    }
    
    showToast("CRITICAL: Section 211 Crowd surge registered in DB.");
    showLiveAlert("Urgent: Section 211 is experiencing a severe crowd bottleneck at upper tier gate access points!");
    
    if (terminal) {
      terminal.innerHTML += `<div class="mcp-log-entry call">[EMERGENCY ALERT] Stadium-Twin-MCP reports occupant density in Sec 211 exceeded threshold (82% vs 65% safe limit).</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }
  } 
  else if (type === 'goal_celebration') {
    showToast("Match Event: Goal Celebration Event Simulated!");
    showLiveAlert("Goal Alert! Kylian Mbappé scores in 75'! North Stand section celebration aura peaking.");
    
    // Highlight North Goal sections (sec-120/121) golden temporarily
    ['sec-120', 'sec-121'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.fill = '#f59e0b';
        el.style.fillOpacity = 0.9;
        el.style.stroke = '#ffffff';
        setTimeout(() => applyOverlayColors(), 5000);
      }
    });

    if (terminal) {
      terminal.innerHTML += `<div class="mcp-log-entry call">[EVENT TRIGGER] Vision-MCP detected goal celebration trigger. Bounding box coordinates center: (X:450, Y:120) near French Bench.</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }
  } 
  else if (type === 'heavy_rain') {
    showToast("Weather Event: Rain Simulation Initiated.");
    mcpDatabase.weather.condition = "Heavy Rain";
    mcpDatabase.weather.rainChance = "90%";
    mcpDatabase.weather.temp = 22;
    
    // Update shade scores: East stands (sec-103/104/203) comfort drops to 10%
    mcpDatabase.digitalTwin.sections["sec-103"].shadeComfort = 10;
    mcpDatabase.digitalTwin.sections["sec-104"].shadeComfort = 12;
    mcpDatabase.digitalTwin.sections["sec-203"].shadeComfort = 5;

    showLiveAlert("Weather Shift: Heavy downpour starting over MetLife stadium. Roof shaded zones (West Stand) now at high premium value.");
    
    changeOverlay('shade'); // Automatically show shade overlay

    if (terminal) {
      terminal.innerHTML += `<div class="mcp-log-entry call">[WEATHER RE-CALCULATION] Weather-MCP reports wind shear shift + temperature drop. Recalculating seat comfort quotients.</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }
  }
}

function resolveDispatch(incidentKey, description) {
  state.activeIncidents[incidentKey] = false;
  
  if (incidentKey === 'gate4') {
    // Hide Gate 4 alert in DOM
    const list = document.getElementById('opsDispatchAlerts');
    // Mark accessibility solved
    showToast("Volunteers dispatched to Gate 4 wheelchair corridor.");
  } 
  else if (incidentKey === 'sec211') {
    document.getElementById('surgedAlertItem').style.display = 'none';
    document.getElementById('opsIncidentLabel').textContent = "None";
    document.getElementById('opsIncidentSub').textContent = "All gates functioning";
    
    // Reset Section 211 visual glow
    const sec211El = document.getElementById('sec-211');
    if (sec211El) {
      sec211El.classList.remove('animate-pulse');
    }
    applyOverlayColors();
    showToast("Security staff deployed. Section 211 bottleneck resolving.");
  }

  // Update stats
  document.getElementById('opsQueueTime').textContent = "3.8 mins";
  document.getElementById('opsCrowdDensity').textContent = "Safe (38%)";

  const terminal = document.getElementById("mcpTerminal");
  if (terminal) {
    terminal.innerHTML += `<div class="mcp-log-entry response">[DISPATCH COMMAND COMPLETED] Dispatched reinforcements to: ${description}. Resolving bottlenecks.</div>`;
    terminal.scrollTop = terminal.scrollHeight;
  }
}

function updateLiveMarketplaceForGoal() {
  const upList = document.getElementById('upgradeList');
  if (!upList) return;

  // Insert a French Goal Celebration hot upgrade card at the top
  const alertCard = document.createElement('div');
  alertCard.className = 'upgrade-card';
  alertCard.style.borderColor = 'var(--danger)';
  alertCard.innerHTML = `
    <div class="upgrade-card-header">
      <div>
        <span class="badge badge-accent" style="background:rgba(239,68,68,0.15); color:var(--danger); border-color:var(--danger)">Goal Zone Peak</span>
        <h4>Section 121 - France Supporters</h4>
      </div>
      <div class="upgrade-cost">+$20</div>
    </div>
    <p style="font-size:11px; margin-top:-6px; color:var(--text-muted)">Mbappé celebration hot spot! France scores. Live celebration score: 98%.</p>
    <div class="upgrade-comparison">
      <div class="comp-item">
        <span>Celebration Aura</span>
        <strong class="text-red">98% <i class="fa-solid fa-fire animate-pulse"></i></strong>
      </div>
      <div class="comp-item">
        <span>Upgrade Price</span>
        <strong class="text-gold">$20.00</strong>
      </div>
    </div>
    <button class="btn btn-sm btn-danger" onclick="initiateSeatUpgrade('sec-121', 20, 'Section 121')">Grab Live Seat</button>
  `;
  
  upList.insertBefore(alertCard, upList.firstChild);
}

// 10. Fan Memory Certificate Generator
function generateFanMemoryCard() {
  const name = document.getElementById('fanName').value.trim() || 'Leo Fan';
  const seat = document.getElementById('fanSeat').value;
  const favTeam = document.getElementById('favTeam').value;

  // Update Certificate DOM Elements
  document.getElementById('certFanName').textContent = name;
  document.getElementById('certFanSeat').textContent = seat;

  // Calculate scores based on the current upgraded seat
  let goalsSeen = 4;
  let dbChant = 112;
  let auraScore = state.mySeatAura;
  let storyContent = "";

  const secId = state.mySeat;
  if (secId.startsWith('sec-11') || secId.startsWith('sec-12')) {
    // Goal stands
    goalsSeen = 5;
    dbChant = 116; // louder behind goals
    storyContent = `"${name} stood at the epicenter of football passion. Located in the supporter stands behind the nets, ${name} felt the deafening raw roar of the crowd reach a staggering peak of ${dbChant} dB. As goals crashed into the net from both sides, players sprinted directly towards ${name}'s section to share an unforgettable celebration of World Cup history."`;
  } else if (secId === 'sec-101' || secId === 'sec-102') {
    // West lower benches
    goalsSeen = 4;
    dbChant = 108;
    storyContent = `"${name} secured prime pitch-side access. Positioned within arm's reach of the player benches, ${name} enjoyed a premium ${auraScore}% overall Aura Score, greeting the superstars as they walked down the tunnel and capturing rare photos of key tactical coaching directives in real-time."`;
  } else if (secId === 'sec-103' || secId === 'sec-104') {
    // East lower
    goalsSeen = 4;
    dbChant = 106;
    storyContent = `"${name} witnessed the match under direct broadcast conditions. Seated directly opposite the benches in Category 1, ${name} enjoyed a crystal-clear tactical overview and was caught on the global TV feed multiple times during key corner kick drama."`;
  } else {
    // Upper seats (default seat)
    goalsSeen = 4;
    dbChant = 102;
    storyContent = `"${name} witnessed the titanic Argentina vs France match from a majestic high vantage point, seeing every tactical layout, line defense break, and spectacular goal outline develop from start to finish."`;
  }

  // Set updates
  document.getElementById('certGoalsSeen').textContent = goalsSeen;
  document.getElementById('certDecibels').textContent = `${dbChant} dB`;
  document.getElementById('certAuraRating').textContent = `ELITE ${auraScore}%`;
  document.getElementById('certStoryText').textContent = storyContent;

  // Toggle panes
  document.getElementById('memorySetupPane').classList.add('hidden');
  document.getElementById('memoryOutputPane').classList.remove('hidden');

  showToast("Aura Memory Certificate Generated!");
}

function resetMemoryForm() {
  document.getElementById('memorySetupPane').classList.remove('hidden');
  document.getElementById('memoryOutputPane').classList.add('hidden');
}

function simulateShare() {
  showToast("Certificate downloaded to Wallet and shared to social media feeds!");
}

// 11. Toast System helper
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.remove('hidden');

  // Dismiss timer
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3500);
}
