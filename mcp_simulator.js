/**
 * FIFA AuraAI - Model Context Protocol (MCP) Simulator & LLM Orchestrator
 * This file simulates a network of 10 specialized MCP servers and an intelligent 
 * LLM reasoning layer to solve queries during the FIFA World Cup 2026.
 */

// Simulated Telemetry Database
const mcpDatabase = {
  // Stadium Digital Twin Data
  digitalTwin: {
    occupancy: 82410,
    maxCapacity: 82500,
    sections: {
      "sec-101": { 
        name: "Section 101", 
        category: "Category 1 (West Lower)", 
        basePrice: 220, 
        price: 285, 
        overallAura: 92, 
        jerseyProb: 82, 
        selfieScore: 74, 
        chantEnergy: 96, 
        broadcastScore: 60, 
        shadeComfort: 90, 
        exitEvac: 85,
        communityDensity: { team: "Neutral (Mixed)", ratio: "50/50", label: "Mixed Fans" },
        reasoning: "Excellent selfie and autograph probabilities as the player benches are located directly in front. With Argentina attacking this side in the 2nd half, goal celebrations are likely to peak here. Roof canopy provides solid afternoon shade cover."
      },
      "sec-102": { 
        name: "Section 102", 
        category: "Category 1 (West Lower)", 
        basePrice: 220, 
        price: 275, 
        overallAura: 87, 
        jerseyProb: 65, 
        selfieScore: 72, 
        chantEnergy: 84, 
        broadcastScore: 92, 
        shadeComfort: 92, 
        exitEvac: 83,
        communityDensity: { team: "Neutral (Corporate)", ratio: "60/40", label: "Neutral" },
        reasoning: "Perfect center-line camera visibility. High probability of appearing on international TV broadcasts. Close to VIP boxes and central entryways, but slightly further from corner-flag celebration hotspots."
      },
      "sec-103": { 
        name: "Section 103", 
        category: "Category 1 (East Lower)", 
        basePrice: 200, 
        price: 235, 
        overallAura: 85, 
        jerseyProb: 55, 
        selfieScore: 68, 
        chantEnergy: 80, 
        broadcastScore: 85, 
        shadeComfort: 40, 
        exitEvac: 88,
        communityDensity: { team: "Neutral (Sponsors)", ratio: "70/30", label: "Sponsor Zone" },
        reasoning: "Direct pitch view on the East side. Currently exposed to late afternoon sun glare (low shade comfort). Moderate autograph/selfie score, but offers extremely rapid exit routes directly to Gate 2."
      },
      "sec-104": { 
        name: "Section 104", 
        category: "Category 1 (East Lower)", 
        basePrice: 200, 
        price: 245, 
        overallAura: 86, 
        jerseyProb: 60, 
        selfieScore: 70, 
        chantEnergy: 82, 
        broadcastScore: 82, 
        shadeComfort: 45, 
        exitEvac: 88,
        communityDensity: { team: "Neutral (Mixed)", ratio: "55/45", label: "Mixed Fans" },
        reasoning: "Located right next to Section 103. Slightly better shadow shelter as the stadium angle shifts. Excellent proximity to the East Side Merchandise Megastore, featuring low queue delays."
      },
      "sec-110": { 
        name: "Section 110", 
        category: "Category 2 (South Goal - Row A-M)", 
        basePrice: 180, 
        price: 225, 
        overallAura: 88, 
        jerseyProb: 74, 
        selfieScore: 65, 
        chantEnergy: 98, 
        broadcastScore: 50, 
        shadeComfort: 80, 
        exitEvac: 78,
        communityDensity: { team: "Argentina", ratio: "88%", label: "Albiceleste Wall" },
        reasoning: "Located right behind the South Goal. Perfect view of penalty dynamics. Experience score boosted (+42%) by Argentina fans chanting intensely, creating an electric, highly contagious atmosphere."
      },
      "sec-111": { 
        name: "Section 111", 
        category: "Category 2 (South Goal Center)", 
        basePrice: 160, 
        price: 215, 
        overallAura: 94, 
        jerseyProb: 88, 
        selfieScore: 55, 
        chantEnergy: 99, 
        broadcastScore: 45, 
        shadeComfort: 82, 
        exitEvac: 75,
        communityDensity: { team: "Argentina", ratio: "95%", label: "Albiceleste Heart" },
        reasoning: "The heartbeat of the South Stand supporters. Chant levels are deafening (112+ dB). Extreme high probability of jersey tosses and post-goal player runs to the crowd corner."
      },
      "sec-112": { 
        name: "Section 112", 
        category: "Category 2 (South Goal Corner)", 
        basePrice: 150, 
        price: 195, 
        overallAura: 80, 
        jerseyProb: 72, 
        selfieScore: 58, 
        chantEnergy: 92, 
        broadcastScore: 40, 
        shadeComfort: 85, 
        exitEvac: 80,
        communityDensity: { team: "Argentina", ratio: "82%", label: "Albiceleste Corner" },
        reasoning: "Positioned directly beside the corner flag. High chance of capturing corner kick drama and player slides. Tunnel A is in close view, offering accessibility ramps."
      },
      "sec-120": { 
        name: "Section 120", 
        category: "Category 2 (North Goal Corner)", 
        basePrice: 150, 
        price: 175, 
        overallAura: 78, 
        jerseyProb: 65, 
        selfieScore: 60, 
        chantEnergy: 85, 
        broadcastScore: 40, 
        shadeComfort: 80, 
        exitEvac: 82,
        communityDensity: { team: "France", ratio: "85%", label: "Les Bleus Corner" },
        reasoning: "North Stand corner flag view. Excellent view of France's defensive setup. Currently experiences a lighter crowd density, allowing quick vendor queue accesses."
      },
      "sec-121": { 
        name: "Section 121", 
        category: "Category 2 (North Goal Center)", 
        basePrice: 160, 
        price: 185, 
        overallAura: 82, 
        jerseyProb: 78, 
        selfieScore: 52, 
        chantEnergy: 90, 
        broadcastScore: 45, 
        shadeComfort: 82, 
        exitEvac: 78,
        communityDensity: { team: "France", ratio: "90%", label: "Les Bleus Heart" },
        reasoning: "French supporters section. Features high noise spikes when France attacks the North goal. Standard goal-net view with lower ticket upgrade prices than the South Stand."
      },
      "sec-201": { 
        name: "Section 201", 
        category: "Category 3 (West Upper)", 
        basePrice: 120, 
        price: 135, 
        overallAura: 62, 
        jerseyProb: 20, 
        selfieScore: 18, 
        chantEnergy: 75, 
        broadcastScore: 68, 
        shadeComfort: 95, 
        exitEvac: 86,
        communityDensity: { team: "Neutral", ratio: "70%", label: "Mixed Seating" },
        reasoning: "Elevated panoramic seat on the West Side. Perfect tactical overview of the entire pitch. Completely shaded, very comfortable, but selfie/autograph probabilities are extremely low."
      },
      "sec-203": { 
        name: "Section 203", 
        category: "Category 3 (East Upper)", 
        basePrice: 110, 
        price: 120, 
        overallAura: 52, 
        jerseyProb: 15, 
        selfieScore: 12, 
        chantEnergy: 70, 
        broadcastScore: 72, 
        shadeComfort: 35, 
        exitEvac: 87,
        communityDensity: { team: "Neutral", ratio: "65%", label: "Mixed Seating" },
        reasoning: "High East Stand seating. Offers a clean TV-like view of the game. Low shade comfort currently due to direct solar alignment. Ideal for budget-conscious tactical analysis fans."
      },
      "sec-211": { 
        name: "Section 211", 
        category: "Category 4 (South Upper)", 
        basePrice: 90, 
        price: 105, 
        overallAura: 56, 
        jerseyProb: 10, 
        selfieScore: 8, 
        chantEnergy: 85, 
        broadcastScore: 35, 
        shadeComfort: 85, 
        exitEvac: 70,
        communityDensity: { team: "Argentina", ratio: "75%", label: "Albiceleste Upper" },
        reasoning: "High South Stand. Offers an incredible view of the supporter chants below. Experiencing a temporary crowd inflow surge at the gates (density high)."
      }
    },
    gates: {
      "Gate 1": { status: "Clear", queueTimeMins: 2, flows: "Low" },
      "Gate 2": { status: "Clear", queueTimeMins: 3, flows: "Medium" },
      "Gate 3": { status: "Minor Delay", queueTimeMins: 8, flows: "Medium-High" },
      "Gate 4": { status: "Congested", queueTimeMins: 14, flows: "High" }
    }
  },
  
  // Vision AI Detections
  vision: {
    yoloDetections: {
      players: ["Messi", "De Paul", "Mbappe", "Griezmann", "Dembele"],
      crowdDensity: "High near South Gates, Normal elsewhere",
      autographEvents: { active: true, location: "Tunnel A vicinity", confidence: 0.88 },
      jerseyToss: { active: false, lastLocation: "Section 111 goal area" }
    },
    vendorQueues: {
      "Gate 4 Hotdogs": { length: 22, waitTime: 14 },
      "East Beer Stand": { length: 8, waitTime: 5 },
      "South Tacos": { length: 5, waitTime: 3 },
      "West Premium Burgers": { length: 2, waitTime: 1.5 }
    }
  },

  // FIFA Statistics Database
  stats: {
    argentinaCelebrations: [
      { trigger: "Goal", primaryLocation: "South Stand Corner (near Section 110/111)", probability: 0.85 },
      { trigger: "Halftime", primaryLocation: "Tunnel A (South-West)", probability: 0.95 },
      { trigger: "Post-match Win", primaryLocation: "South Stand supporters block", probability: 0.90 }
    ],
    franceCelebrations: [
      { trigger: "Goal", primaryLocation: "North Stand Goal Corner (near Section 120)", probability: 0.78 },
      { trigger: "Halftime", primaryLocation: "Tunnel A", probability: 0.95 }
    ]
  },

  // Transport & Traffic Intelligence
  transport: {
    metro: { status: "Running", nextArrivals: [4, 9, 14], waitTimeMins: 3, occupancy: "Medium" },
    uber: { etaMins: 8, priceMultiplier: 1.4, congestionTimeMins: 11 },
    parking: { lotA: "92% Full", lotB: "78% Full", lotC: "Available" }
  },

  // Weather Telemetry
  weather: {
    temp: 26,
    humidity: "62%",
    rainChance: "15%",
    windSpeed: "12 km/h NW",
    heatIndex: "27C",
    condition: "Clear Sky",
    lightningAlert: "None"
  },

  // Merchandise Inventory
  merchandise: {
    jerseyInventory: {
      "Messi Home L": 12,
      "Mbappe Away M": 8,
      "USA Retro S": 4,
      "World Cup Official Ball": 48
    },
    stores: {
      "West Side Hub": { status: "Busy", queueMins: 12 },
      "East Side Express": { status: "Low Queue", queueMins: 2 },
      "South Goal Vendor": { status: "Very Busy", queueMins: 18 }
    }
  },

  // Accessibility Map
  accessibility: {
    wheelchairStands: ["Section 103", "Section 104", "Section 112", "Section 202"],
    liftsStatus: "All 12 Lifts Operational",
    routeAdvisories: "Elevator C near Gate 4 is prioritizing wheelchair transfers. Wait time is 1 min."
  },

  // Emergency & Security
  emergency: {
    activeMedicalIncidents: 0,
    securityAlerts: [],
    evacuationStatus: "Normal Operations",
    activeStaffDeployed: 310
  }
};

/**
 * Simulates calling MCP tools and executing LLM reasoning over the outputs.
 * Prints logs to the HTML terminal and resolves with a structured answer.
 */
function simulateLLMReasoning(query, currentSeatId = "sec-203", role = "fan") {
  const terminal = document.getElementById("mcpTerminal");
  if (!terminal) return;

  // Clear or prepare console
  terminal.innerHTML += `<div class="mcp-log-entry system">[${new Date().toLocaleTimeString()}] --- NEW LLM INQUIRY RECEIVED ---</div>`;
  terminal.innerHTML += `<div class="mcp-log-entry system">Query: "${query}" | Persona: ${role}</div>`;
  terminal.scrollTop = terminal.scrollHeight;

  return new Promise((resolve) => {
    let responseText = "";
    const logs = [];

    // Simple keyword extraction for tool selection
    const lowercaseQuery = query.toLowerCase();

    // 1. Messi / Autograph query
    if (lowercaseQuery.includes("messi") || lowercaseQuery.includes("autograph") || lowercaseQuery.includes("selfie")) {
      logs.push({ server: "FIFA Stats MCP", tool: "get_celebration_locations(team: 'ARG', player: 'Messi')" });
      logs.push({ server: "Vision MCP", tool: "get_live_player_locations()" });
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_section_proximity(tunnel: 'Tunnel A')" });
      
      const autographProb = mcpDatabase.digitalTwin.sections["sec-101"].jerseyProb;
      const tunnels = mcpDatabase.stats.argentinaCelebrations[1].primaryLocation;
      
      responseText = `### ✍️ Player Autograph & Interaction Guide
Based on real-time data from **FIFA Stats MCP** and **Vision MCP**:
* **Player Habits:** Lionel Messi and Team Argentina historically celebrate 85% of goals in front of the **South Stand (Sections 110-111)**. At halftime and post-match, they evacuate via **Tunnel A (South-West corner)**.
* **Live Position:** Messi is currently active on the West wing of the pitch.
* **Best Proximity Seat:** 
  * **Section 101 / 102 (West Lower):** Right next to the benches. You have a **74% selfie zone score** and **82% jersey toss probability**. 
  * **Section 110 (South Goal):** Current crowd chant energy is **98/100**. This is where player interaction peaks if a goal is scored.

**AuraAI Recommendation:** If you are in Section 203, upgrade to **Section 101 or 110** immediately to increase player interaction probability by **+70%**!`;
    }
    // 2. Queue / Food query
    else if (lowercaseQuery.includes("queue") || lowercaseQuery.includes("food") || lowercaseQuery.includes("hotdog") || lowercaseQuery.includes("burger") || lowercaseQuery.includes("hungry")) {
      logs.push({ server: "Vision MCP", tool: "get_live_vendor_queues()" });
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_closest_vendors(current_seat: '" + currentSeatId + "')" });
      
      const queueList = Object.entries(mcpDatabase.vision.vendorQueues)
        .map(([name, data]) => `* **${name}**: ${data.length} people in line (~${data.waitTime} mins wait)`).join("\n");
      
      responseText = `### 🍔 Food & Beverage Crowd Intelligence
We polled **Vision MCP** CCTV feeds and mapped them to your location:
${queueList}

**AuraAI Navigation Strategy:**
* **Your nearest vendor:** *East Beer Stand* is just 30 meters from you with only a 5-minute wait time.
* **Best Option:** If you want premium food, **West Premium Burgers** has a 1.5-minute wait time (only 2 people in line!).
* **Avoid:** *Gate 4 Hotdogs* is heavily congested due to high fan inflow from Gate 4 security gates. 

*Tip: If you wait 5 more minutes until the 78th minute, crowd density at East stands is predicted to drop by another 30%.*`;
    }
    // 3. Metro / Transport / Exit / Crowded query
    else if (lowercaseQuery.includes("metro") || lowercaseQuery.includes("transport") || lowercaseQuery.includes("exit") || lowercaseQuery.includes("uber") || lowercaseQuery.includes("train") || lowercaseQuery.includes("traffic")) {
      logs.push({ server: "Transport MCP", tool: "get_transit_status()" });
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_gate_flow_metrics()" });
      logs.push({ server: "Emergency MCP", tool: "get_evacuation_routes()" });

      const metroNext = mcpDatabase.transport.metro.nextArrivals[0];
      const uberSurge = mcpDatabase.transport.uber.priceMultiplier;
      const gate4Status = mcpDatabase.digitalTwin.gates["Gate 4"].status;

      responseText = `### 🚇 Evacuation & Transit Routing Support
Our real-time routing layer queried the **Transport MCP** and **Digital Twin MCP**:
* **Metro Train:** Transit is running smoothly. Next train arrives in **${metroNext} minutes** at the Stadium Station. Current station queue occupancy is **Medium**.
* **Uber/Ride-share:** Surge multiplier is currently **${uberSurge}x**. Heavy traffic congestion on the Main Boulevard adds **11 minutes** to departures.
* **Gate Status:**
  * **Gate 1 & 2:** Clear (Under 3 mins transit time).
  * **Gate 4:** **CONGESTED** (${mcpDatabase.digitalTwin.gates["Gate 4"].queueTimeMins} mins delay). Avoid exiting via Gate 4 if possible.

**AuraAI Recommendation:** Exit the stadium via **Gate 2** (East side). Walk to the Metro station. This routes you completely around the West Gate congestion, saving you approximately **18 minutes** of waiting.`;
    }
    // 4. Accessibility / Wheelchair / Translation
    else if (lowercaseQuery.includes("wheelchair") || lowercaseQuery.includes("accessibility") || lowercaseQuery.includes("elev") || lowercaseQuery.includes("elevator") || lowercaseQuery.includes("disable") || lowercaseQuery.includes("spanish") || lowercaseQuery.includes("¿cómo") || lowercaseQuery.includes("como") || lowercaseQuery.includes("french") || lowercaseQuery.includes("telugu") || lowercaseQuery.includes("hindi") || lowercaseQuery.includes("arabic") || lowercaseQuery.includes("aide") || lowercaseQuery.includes("ayuda") || lowercaseQuery.includes("sahayam") || lowercaseQuery.includes("madad") || lowercaseQuery.includes("musaada") || lowercaseQuery.includes("సహాయం") || lowercaseQuery.includes("వీల్‌చైర్") || lowercaseQuery.includes("मदद") || lowercaseQuery.includes("व्हीलचेयर") || lowercaseQuery.includes("مساعدة") || lowercaseQuery.includes("كرسي") || lowercaseQuery.includes("fauteuil") || lowercaseQuery.includes("roulant") || lowercaseQuery.includes("accès")) {
      logs.push({ server: "Accessibility MCP", tool: "get_accessible_routes(origin: '" + currentSeatId + "')" });
      
      const routeAdv = mcpDatabase.accessibility.routeAdvisories;
      const standsList = mcpDatabase.accessibility.wheelchairStands.join(", ");

      if (lowercaseQuery.includes("spanish") || lowercaseQuery.includes("¿cómo") || lowercaseQuery.includes("como")) {
        logs.push({ server: "Translation MCP", tool: "translate_text(language: 'ES')" });
        responseText = `### ♿ Guía de Accesibilidad (Español)
Traducido por **Translation MCP** y verificado con **Accessibility MCP**:
* **Rutas Accesibles:** Todos los 12 ascensores están en funcionamiento.
* **Alerta de Tráfico:** El ascensor C en la Puerta 4 está reservado prioritariamente para personas con movilidad reducida (tiempo de espera: 1 min).
* **Secciones Accesibles:** Zonas adaptadas en **${standsList}**.

**Recomendación de Ruta:** Si se encuentra en el nivel superior, tome el pasillo accesible hacia el **Ascensor B**. El personal voluntario en la Puerta 2 le guiará directamente a la rampa de salida.`;
      } else if (lowercaseQuery.includes("french") || lowercaseQuery.includes("aide")) {
        logs.push({ server: "Translation MCP", tool: "translate_text(language: 'FR')" });
        responseText = `### ♿ Guide d'Accessibilité (Français)
Traduit par **Translation MCP** et vérifié par **Accessibility MCP**:
* **Itinéraires accessibles:** Les 12 ascenseurs sont opérationnels.
* **Alerte trafic:** L'ascenseur C près de la porte 4 est prioritaire pour les fauteuils roulants (attente: 1 min).
* **Zones adaptées:** Zones de fauteuils roulants dans **${standsList}**.

**Conseil de navigation:** Empruntez la rampe vers l'ascenseur B. Le flux est plus fluide, offrant un accès direct et confortable vers la porte 2.`;
      } else if (lowercaseQuery.includes("telugu") || lowercaseQuery.includes("సహాయం")) {
        logs.push({ server: "Translation MCP", tool: "translate_text(language: 'TE')" });
        responseText = `### ♿ యాక్సెసిబిలిటీ గైడ్ (తెలుగు)
**Translation MCP** ద్వారా అనువదించబడింది మరియు **Accessibility MCP** ద్వారా ధృవీకరించబడింది:
* **అందుబాటులో ఉన్న మార్గాలు:** అన్ని 12 లిఫ్ట్‌లు విజయవంతంగా నడుస్తున్నాయి.
* **లిఫ్ట్ ప్రాధాన్యత:** గేట్ 4 సమీపంలో ఉన్న ఎలివేటర్ సి వీల్‌చైర్ వినియోగదారులకు ప్రాధాన్యత ఇస్తుంది.
* **ప్రత్యేక విభాగాలు:** వీల్‌చైర్ సీటింగ్ జోన్లు **${standsList}** లో ఉన్నాయి.

**సలహా:** ఎలివేటర్ బి వైపు ఉన్న ర్యాంప్ తీసుకోండి. గేట్ 2 కు వెళ్లేందుకు ఇది చాలా సులభమైన మరియు తక్కువ రద్దీ ఉన్న మార్గం.`;
      } else if (lowercaseQuery.includes("hindi") || lowercaseQuery.includes("मदद")) {
        logs.push({ server: "Translation MCP", tool: "translate_text(language: 'HI')" });
        responseText = `### ♿ सुगमता गाइड (हिन्दी)
**Translation MCP** द्वारा अनुवादित और **Accessibility MCP** द्वारा सत्यापित:
* **सुलभ मार्ग:** सभी 12 लिफ्ट चालू हैं।
* **लिफ्ट प्राथमिकता:** गेट 4 के पास लिफ्ट सी व्हीलचेयर उपयोगकर्ताओं के लिए प्राथमिकता पर है (प्रतीक्षा समय: 1 मिनट)।
* **विशेष खंड:** व्हीलचेयर बैठने के क्षेत्र **${standsList}** में सक्रिय हैं।

**सुझाव:** लिफ्ट बी की ओर जाने वाले रैंप का उपयोग करें। यह गेट 2 की ओर जाने का सबसे आसान मार्ग है।`;
      } else if (lowercaseQuery.includes("arabic") || lowercaseQuery.includes("مساعدة")) {
        logs.push({ server: "Translation MCP", tool: "translate_text(language: 'AR')" });
        responseText = `### ♿ دليل إمكانية الوصول (العربية)
مترجم بواسطة **Translation MCP** ومعتمد من **Accessibility MCP**:
* **المسارات الميسرة:** جميع المصاعد الـ 12 تعمل بكفاءة.
* **أولوية المصاعد:** المصعد C بالقرب من البوابة 4 يعطي الأولوية لمستخدمي الكراسي المتحركة (الانتظار: 1 دقيقة).
* **مناطق مخصصة:** مناطق جلوس الكراسي المتحركة نشطة في **${standsList}**.

**توجيه المسار:** خذ المنحدر المؤدي إلى المصعد B. التدفق أخف بنسبة 50% ويؤدي بسلاسة إلى البوابة 2.`;
      } else {
        responseText = `### ♿ Accessibility & Mobility Guidance
Queried **Accessibility MCP** and **Digital Twin maps**:
* **Elevators:** All 12 lifts are fully operational.
* **Elevator Priority:** ${routeAdv}
* **Wheelchair Seating Zones:** Designated areas are active in **${standsList}**.
* **Support Staff:** 12 Accessibility volunteers are stationed at the bottom of Section 103 / 104 ramps.

**Evacuation Advice:** Take the ramp leading to Elevator B. The flow is 50% lighter than Elevator C, offering a smooth path to Gate 2.`;
      }
    }
    // 5. Staff: Volunteer/Security congestion query
    else if (role === "staff" && (lowercaseQuery.includes("volunteer") || lowercaseQuery.includes("incident") || lowercaseQuery.includes("congestion") || lowercaseQuery.includes("security") || lowercaseQuery.includes("alert"))) {
      logs.push({ server: "Emergency MCP", tool: "get_security_incidents()" });
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_congestion_hotspots()" });
      logs.push({ server: "Vision MCP", tool: "yolo_detect_crowd_anomalies()" });

      const activeVolunteers = mcpDatabase.emergency.activeStaffDeployed;

      responseText = `### 🚨 Operational Intelligence Dispatch Report (Staff Only)
Queried **Emergency**, **Vision**, and **Digital Twin MCP** telemetry:
* **Active Incidents:** 
  1. *Gate 4 Congestion:* Crowd bottleneck blocking wheelchair corridor (Severity: **Medium**).
  2. *Section 211 Inflow:* Surge detected at upper tier access points (Severity: **High** if untreated).
* **Staff Deployment Status:** ${activeVolunteers} volunteers active. 24 reserves standby.

**AuraAI Operations Recommendation:**
* **Action 1:** Dispatch **2 Accessibility Volunteers** to *Gate 4* to clear the wheelchair lane.
* **Action 2:** Trigger a crowd re-routing alert on Section 211 digital signage to redirect incoming spectators to Gate 1. Dispatch **4 security volunteers** to manage Section 211 turnstile lines.`;
    }
    // 6. Fan Community & Sit-Together Grouping query
    else if (lowercaseQuery.includes("together") || lowercaseQuery.includes("community") || lowercaseQuery.includes("group") || lowercaseQuery.includes("sit with") || lowercaseQuery.includes("fan zone") || lowercaseQuery.includes("supporters") || lowercaseQuery.includes("swaps") || lowercaseQuery.includes("match")) {
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_fan_distribution_zones()" });
      logs.push({ server: "Accessibility MCP", tool: "verify_group_seat_adjacency(quantity: 2, team: 'ARG')" });

      responseText = `### 👥 Fan Community & Sit-Together Swaps
We queried the **Stadium Digital Twin MCP** and mapped fan community densities:
* **Live Supporter Wall Distributions:**
  * **Argentina Fans (Albiceleste):** Concentrated in **South Goal (Sections 110, 111, 112)** at **88%-95% density**.
  * **France Fans (Les Bleus):** Concentrated in **North Goal (Sections 120, 121)** at **85%-90% density**.
  * **Neutral/Mixed Zones:** Center tiers (Sections 101, 102, 103, 104) are mixed/corporate zones.
* **Sit-Together Seat Swaps Active:**
  * **Argentina Fans Swap:** Section 111 has a matching community seat swap active. Two adjacent seats are available for Albiceleste fans looking to join the main supporters group.
  * **France Fans Swap:** Section 121 has a group seating swap vacancy offering direct sightlines to the French supporter core.

**AuraAI Recommendation:** Upgrade to **Section 111** (if you support Argentina) or **Section 121** (if you support France). Your digital tickets will be updated instantly so you can sit directly with your community wall!`;
    }
    // 7. Merchandise query
    else if (lowercaseQuery.includes("merchandise") || lowercaseQuery.includes("shop") || lowercaseQuery.includes("store") || lowercaseQuery.includes("jersey") || lowercaseQuery.includes("shirt") || lowercaseQuery.includes("buy") || lowercaseQuery.includes("size") || lowercaseQuery.includes("cap") || lowercaseQuery.includes("scarf")) {
      logs.push({ server: "Merchandise MCP", tool: "get_store_inventory()" });
      logs.push({ server: "Merchandise MCP", tool: "get_store_wait_times()" });
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_closest_stores(current_seat: '" + currentSeatId + "')" });
      
      const invList = Object.entries(mcpDatabase.merchandise.jerseyInventory)
        .map(([name, count]) => `* **${name}**: ${count} items in stock`).join("\n");
      
      responseText = `### 🛍️ Merchandise & Retail Intelligence
Based on real-time data from **Merchandise MCP** and **Digital Twin MCP**:
* **Live Stock Status:**
${invList}
* **Store Wait Times:**
  * **East Side Express:** 2 mins wait time (Low Queue).
  * **West Side Hub:** 12 mins wait time (Busy).
  * **South Goal Vendor:** 18 mins wait time (Very Busy).

**AuraAI Recommendation:** Since you are in Section 203 (East Stand), your closest outlet is the **East Side Express** (only 2 minutes wait). You can grab a Messi jersey and avoid the crowd surge on the West Side!`;
    }
    // 8. Weather query
    else if (lowercaseQuery.includes("weather") || lowercaseQuery.includes("rain") || lowercaseQuery.includes("sun") || lowercaseQuery.includes("shade") || lowercaseQuery.includes("temperature") || lowercaseQuery.includes("hot") || lowercaseQuery.includes("cold") || lowercaseQuery.includes("wind") || lowercaseQuery.includes("forecast") || lowercaseQuery.includes("lightning")) {
      logs.push({ server: "Weather MCP", tool: "get_live_weather()" });
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_shade_comfort_metrics()" });
      
      const w = mcpDatabase.weather;
      
      responseText = `### ☀️ Live Weather & Seat Comfort Advisory
Telemetry from **Weather MCP** and **Stadium Digital Twin MCP** indicates:
* **Weather Telemetry:** Current temperature is **${w.temp}°C**, humidity is **${w.humidity}**, and wind is **${w.windSpeed}**. Condition: **${w.condition}**.
* **Shade Comfort Overlay:**
  * **West Stand (Sections 101, 102, 201):** 90%-95% shade comfort (fully protected).
  * **East Stand (Sections 103, 104, 203):** 35%-45% shade comfort (exposed to direct solar glare).
* **Rain Forecast:** Rain probability is ${w.rainChance}. Lightning alerts: **${w.lightningAlert}**.

**AuraAI Recommendation:** If you are experiencing solar glare in Section 203, we recommend upgrading to **Section 101 or 201** on the West Stand, which features maximum roof shade coverage (90%+ comfort).`;
    }
    // Default fallback query
    else {
      logs.push({ server: "Stadium Digital Twin MCP", tool: "get_match_general_metrics()" });
      logs.push({ server: "Weather MCP", tool: "get_live_weather()" });

      responseText = `### ℹ️ FIFA AuraAI Stadium Status
I queried **Weather MCP** and **Stadium Twin MCP** to answer your request:
* **Current Score:** Argentina 2 - 2 France (72')
* **Stadium Weather:** ${mcpDatabase.weather.temp}°C, ${mcpDatabase.weather.condition}. Wind is ${mcpDatabase.weather.windSpeed}. No rain alerts.
* **Stadium Attendance:** ${mcpDatabase.digitalTwin.occupancy} fans inside.

Could you please specify your question? For example:
* *"Where is the Messi autograph hot spot?"*
* *"Which food stalls have no queues?"*
* *"What is the fastest way to get to the metro?"*`;
    }

    // Simulate async tool execution waterfall in the terminal
    let delay = 300;
    logs.forEach((log, index) => {
      setTimeout(() => {
        terminal.innerHTML += `<div class="mcp-log-entry call">[CALLING ${log.server}] -> ${log.tool}</div>`;
        terminal.scrollTop = terminal.scrollHeight;
      }, delay * (index + 1));
    });

    // Final response logs and output
    setTimeout(() => {
      terminal.innerHTML += `<div class="mcp-log-entry response">[RESPONSE] Queries completed successfully. Processing inputs through LLM reasoning layer...</div>`;
      terminal.innerHTML += `<div class="mcp-log-entry llm">[LLM REASONING] Formulating recommendation based on crowds, player patterns, and spatial metadata.</div>`;
      terminal.scrollTop = terminal.scrollHeight;
      resolve(responseText);
    }, delay * (logs.length + 1));
  });
}
