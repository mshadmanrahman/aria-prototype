// Prototype 2: Conversational Search Replacement
// Full-screen conversation modal functionality

// GLOBAL ERROR HANDLER
window.onerror = function (msg, url, line, col, error) {
    alert(`Javascript Error: ${msg}\nLine: ${line}`);
    console.error("Global Error:", msg, error);
    return false;
};

const ariaEngine2 = new ARIAEngine();
let currentChips2 = [];

// Focus main input (opens conversation)
function focusMainInput() {
    try {
        const input = document.getElementById('mainInput');
        if (!input) {
            alert("Error: mainInput element not found");
            return;
        }

        const text = input.value.trim();
        if (text) {
            startConversation(text);
        } else {
            input.focus();
        }
    } catch (e) {
        alert("Error in focusMainInput: " + e.message);
    }
}

// Handle main input Enter key
function handleMainInputKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        const input = document.getElementById('mainInput');
        const text = input.value.trim();

        if (text) {
            startConversation(text);
        }
    }
}

// Start conversation from example chip
function askExample(question) {
    try {
        if (!question) {
            alert("Error: No question provided to askExample");
            return;
        }
        startConversation(question);
    } catch (e) {
        alert("Error in askExample: " + e.message);
    }
}

// Start conversation
async function startConversation(initialMessage) {
    try {
        console.log("Starting conversation with:", initialMessage); // Keep for console debugging

        if (!ariaEngine2) {
            alert("CRITICAL ERROR: ARIA Engine is NOT loaded. The script may have failed to initialize.");
            return;
        }

        // Clear main input
        const mainInput = document.getElementById('mainInput');
        if (mainInput) mainInput.value = '';

        // Show conversation modal
        const modal = document.getElementById('conversationModal');
        if (!modal) {
            alert("Error: Modal element not found!");
            return;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Clear previous conversation
        const thread = document.getElementById('conversationThread');
        if (!thread) {
            alert("Error: Thread element not found!");
            return;
        }
        thread.innerHTML = '';
        ariaEngine2.reset();

        // Add user's initial message
        addThreadUserMessage(initialMessage);

        // Add to engine history
        ariaEngine2.addMessage('user', initialMessage);

        // Show typing
        addThreadTyping();

        // Check for greeting
        const lowerMsg = initialMessage.toLowerCase().trim();
        if (['hi', 'hello', 'hey', 'hia', 'hola'].some(g => lowerMsg.startsWith(g)) && lowerMsg.length < 20) {
            // Delayed response for realism
            setTimeout(() => {
                try {
                    removeThreadTyping();
                    const welcomeData = getWelcomeResponse();
                    if (!welcomeData) throw new Error("Welcome data is null");
                    // Pass true for isHtml
                    addThreadAssistantMessage(welcomeData.text, welcomeData.chips, null, null, true);
                } catch (err) {
                    console.error("Greeting Error:", err);
                    addThreadAssistantMessage("Hi there! How can I help you find your dream study abroad program today?");
                }
            }, 800);
            return;
        }

        // Generate normal response
        const response = await ariaEngine2.generateResponse(initialMessage);

        // Remove typing
        removeThreadTyping();

        // Add response
        if (response.message) {
            // Only show chips on main message if there is NO follow-up
            const chipsForMain = response.followUp ? [] : response.chips;
            addThreadAssistantMessage(response.message, chipsForMain, response.programs);
        }

        if (response.followUp) {
            setTimeout(async () => {
                addThreadTyping();
                await new Promise(resolve => setTimeout(resolve, 800));
                removeThreadTyping();
                addThreadAssistantMessage(response.followUp, response.chips);
            }, 600);
        }

        // Focus conversation input
        setTimeout(() => {
            const convInput = document.getElementById('conversationInput');
            if (convInput) convInput.focus();
        }, 300);

    } catch (e) {
        console.error("Error in startConversation:", e);
        alert("An error occurred: " + e.message);
    }
}

// ... existing helper functions ...

// Add user message to thread
// Add user message to thread
function addThreadUserMessage(text) {
    try {
        const thread = document.getElementById('conversationThread');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'thread-message user-message';
        messageDiv.innerHTML = `
        <div class="message-label">You Asked</div>
        <div class="message-text">${escapeHtml(text)}</div>
      `;
        thread.appendChild(messageDiv);
        scrollThreadToBottom();
    } catch (e) {
        console.error("Error in addThreadUserMessage: " + e.message);
    }
}

// Add assistant message to thread
function addThreadAssistantMessage(text, chips = [], programs = null, listingTitle = null, isHtml = false) {
    try {
        const thread = document.getElementById('conversationThread');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'thread-message assistant-message';

        let chipsHtml = '';
        if (chips && chips.length > 0) {
            currentChips2 = chips;
            chipsHtml = `
          <div class="chips-container">
            ${chips.map(chip => `
              <button class="chip" onclick="handleThreadChipClick('${chip.value}')">${chip.label}</button>
            `).join('')}
          </div>
        `;
        }

        let listingHtml = '';
        // Render programs if provided
        if (programs && programs.length > 0) {
            programs.forEach(prog => {
                listingHtml += `
            <a href="${prog.url}" target="_blank" style="
                margin-top: 16px; 
                display: block; 
                text-decoration: none; 
                background: white; 
                border: 2px solid orange; 
                border-left: 4px solid var(--primary-magenta);
                padding: 16px; 
                border-radius: 12px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                transition: transform 0.2s;
                max-width: 600px;
            ">
                <h4 style="margin: 0 0 4px 0; color: var(--primary-magenta); font-size: 16px; font-weight: 600;">${prog.title}</h4>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #333; font-weight: 500;">${prog.school}</p>
                <p style="margin: 0; font-size: 13px; color: #666;">📍 ${prog.location}</p>
            </a>
            `;
            });
        }

        const content = isHtml ? text : escapeHtml(text);

        messageDiv.innerHTML = `
        <div class="message-header">
          <div class="aria-avatar">A</div>
          <span class="message-author">ARIA</span>
        </div>
        <div class="message-text" style="white-space: pre-wrap;">${content}</div>
        ${chipsHtml}
        ${listingHtml}
      `;
        thread.appendChild(messageDiv);
        scrollThreadToBottom();
        logDebug(`Assistant message appended. Thread children: ${thread.children.length}`);
    } catch (e) {
        logDebug("Error in addThreadAssistantMessage: " + e.message);
    }
}

// Helper for the rich welcome message
function getWelcomeResponse() {
    return {
        text: `Hi there! 👋 I'm ARIA, your AI-powered study abroad advisor! I can help you with:

🎓 <strong>Finding Programs</strong>
Ask me about specific degrees, fields of study, or compare programs across countries.

🌍 <strong>Study Destinations</strong>
Learn about requirements, costs, and culture in different countries.

💰 <strong>Scholarships & Funding</strong>
Discover scholarship opportunities and financial aid options.

📋 <strong>Application Guidance</strong>
Get tips on applications, requirements, and deadlines.

<strong>Try asking me:</strong>
• "I want to study a Master's in Data Science"
• "What scholarships are available for international students?"
• "How can I study in Germany?"
• "Compare studying in UK vs Australia"

What would you like to explore today?`,
        chips: [
            { label: "Help me find a Master's program", value: "technology" }, // mapped to tech flow for demo
            { label: "Show me scholarships", value: "scholarships" },
            { label: "Best countries to study abroad", value: "best_countries" }
        ]
    };
}

// Close conversation modal
function closeConversation() {
    const modal = document.getElementById('conversationModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Start new search
function startNewSearch() {
    const thread = document.getElementById('conversationThread');
    thread.innerHTML = '';
    ariaEngine2.reset();
    document.getElementById('conversationInput').value = '';
    document.getElementById('conversationInput').focus();

    // Add welcome message immediately
    const welcome = getWelcomeResponse();
    addThreadAssistantMessage(welcome.text, welcome.chips, null, null, true);
}

// Add assistant message to thread
function addThreadAssistantMessage(text, chips = [], programs = null, listingTitle = null, isHtml = false) {
    const thread = document.getElementById('conversationThread');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'thread-message assistant-message';

    let chipsHtml = '';
    if (chips && chips.length > 0) {
        currentChips2 = chips;
        chipsHtml = `
      <div class="chips-container">
            ${chips.map(chip => `
          <button class="chip" onclick="handleThreadChipClick('${chip.value}')">${chip.label}</button>
        `).join('')}
      </div>
        `;
    }

    let listingHtml = '';
    // Render programs if provided
    if (programs && programs.length > 0) {
        programs.forEach(prog => {
            listingHtml += `
            <a href="${prog.url}" target="_blank" style="
                margin-top: 16px; 
                display: block; 
                text-decoration: none; 
                background: white; 
                border: 1px solid #e5e7eb; 
                border-left: 4px solid var(--primary-magenta);
                padding: 16px; 
                border-radius: 12px; 
                box-shadow: 0 4px 6px rgba(0,0,0,0.05);
                transition: transform 0.2s;
                max-width: 600px;
            ">
                <h4 style="margin: 0 0 4px 0; color: var(--primary-magenta); font-size: 16px; font-weight: 600;">${prog.title}</h4>
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #333; font-weight: 500;">${prog.school}</p>
                <p style="margin: 0; font-size: 13px; color: #666;">📍 ${prog.location}</p>
            </a>
            `;
        });
    }

    const content = isHtml ? text : escapeHtml(text);

    messageDiv.innerHTML = `
    <div class="message-header">
      <div class="aria-avatar">A</div>
      <span class="message-author">ARIA</span>
    </div>
    <div class="message-text" style="white-space: pre-wrap;">${content}</div>
    ${chipsHtml}
    ${listingHtml}
    `;
    thread.appendChild(messageDiv);
    scrollThreadToBottom();
}

// Add typing indicator to thread
function addThreadTyping() {
    const thread = document.getElementById('conversationThread');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'thread-message assistant-message';
    typingDiv.id = 'threadTypingIndicator';
    typingDiv.innerHTML = `
    <div class="message-header">
      <div class="aria-avatar">A</div>
      <span class="message-author">ARIA</span>
    </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    thread.appendChild(typingDiv);
    scrollThreadToBottom();
}

// Remove typing indicator from thread
function removeThreadTyping() {
    const typing = document.getElementById('threadTypingIndicator');
    if (typing) {
        typing.remove();
    }
}

// Handle chip click in thread
function handleThreadChipClick(value) {
    // Add user message
    const chipLabel = currentChips2.find(c => c.value === value)?.label || value;
    addThreadUserMessage(chipLabel);

    // 1. Initial Selection -> Ask Country
    if (['technology', 'business', 'engineering', 'affordable'].includes(value)) {
        addThreadAssistantMessage(
            `Perfect! I'd love to help you find the perfect programs for ${chipLabel}. Let me ask a few questions to narrow down the best options for you:`,
            []
        );
        setTimeout(() => {
            addThreadAssistantMessage(
                "Do you have a preferred country or region?",
                [
                    { label: "Germany", value: "germany" },
                    { label: "Netherlands", value: "netherlands" },
                    { label: "Spain", value: "spain" },
                    { label: "Any Country", value: "any_country" }
                ]
            );
        }, 800);
    }
    // 2. Country Selected -> Ask Field
    else if (['germany', 'netherlands', 'spain', 'any_country', 'Any Country'].includes(value) || ['Germany', 'Netherlands', 'Spain', 'Any country'].includes(chipLabel)) {
        addThreadAssistantMessage(
            `Great choice! ${chipLabel} is an excellent destination for international students.`,
            []
        );
        setTimeout(() => {
            addThreadAssistantMessage(
                "What specific field or specialization are you interested in?",
                [
                    { label: "Business & Management", value: "business_spec" },
                    { label: "Computer Science & IT", value: "cs_it_spec" },
                    { label: "Engineering", value: "engineering_spec" },
                    { label: "Social Sciences", value: "social_sciences_spec" }
                ]
            );
        }, 800);
    }
    // 3. Field Selected -> LEAD GEN FORM (Business Goal)
    else if (['business_spec', 'cs_it_spec', 'engineering_spec', 'social_sciences_spec'].includes(value)) {
        addThreadAssistantMessage(
            `I found 15+ programs that match your criteria! To send you the brochure and connect you with admissions, I just need a few details:`,
            []
        );

        // Show Lead Gen Form
        setTimeout(() => {
            const thread = document.getElementById('conversationThread');
            const formDiv = document.createElement('div');
            formDiv.className = 'thread-message assistant-message';
            formDiv.innerHTML = `
                <div class="message-header">
                  <div class="aria-avatar">A</div>
                  <span class="message-author">ARIA</span>
                </div>
                <div class="message-bubble" style="width: 100%; max-width: 400px; background: white; padding: 20px; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div class="lead-gen-form">
                        <input type="text" id="leadName2" placeholder="Full Name" class="conversational-input" style="margin-bottom: 12px; font-size: 15px;">
                        <input type="email" id="leadEmail2" placeholder="Email Address" class="conversational-input" style="margin-bottom: 12px; font-size: 15px;">
                        <input type="tel" id="leadPhone2" placeholder="Mobile Number" class="conversational-input" style="margin-bottom: 12px; font-size: 15px;">
                        <input type="text" id="leadLocation2" placeholder="Where do you live?" class="conversational-input" style="margin-bottom: 16px; font-size: 15px;">
                        <button onclick="submitLeadGen2()" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 16px; border-radius: 30px;">See My Matches</button>
                    </div>
                </div>
            `;
            thread.appendChild(formDiv);
            scrollThreadToBottom();
        }, 1000);
    }
    // 4. Degree Selected -> Link to Results
    else if (['Master\'s', 'Bachelor\'s', 'PhD'].includes(chipLabel)) {
        let degreeSlug = "masters-degrees"; // Default
        if (chipLabel === "Bachelor's") degreeSlug = "bachelors-degree";
        if (chipLabel === "PhD") degreeSlug = "phd-degrees";

        addThreadAssistantMessage(
            `Excellent! I found 230+ ${chipLabel} programs available for you.`,
            [],
            [{
                title: `Browse all ${chipLabel} Programs`,
                school: "educations.com",
                location: "Global",
                url: `https://www.educations.com/${degreeSlug}`
            }]
        );
    }
    // 5. Default Fallback
    else {
        addThreadAssistantMessage(
            `I found several programs for ${chipLabel}.`,
            [{ label: "Start Over", value: "technology" }]
        );
    }
}

// Function to handle Lead Gen Submission for Prototype 2
function submitLeadGen2() {
    const name = document.getElementById('leadName2').value;
    const email = document.getElementById('leadEmail2').value;

    if (!name || !email) {
        alert("Please enter at least your name and email.");
        return;
    }

    // Remove the form or update it (simulated)
    const formContainer = document.querySelector('.lead-gen-form').parentElement;
    formContainer.innerHTML = `<div style="padding:10px;">Thanks <strong>${name}</strong>!<br>I've sent the details to <strong>${email}</strong>. Here are your top matches:</div>`;

    // Show Results
    setTimeout(() => {
        addThreadAssistantMessage(
            "Here are the top programs based on your profile:",
            [],
            // Simulated Programs Result
            [
                { title: "MSc in Computer Science", school: "TU Munich", location: "Germany, Munich", url: "https://www.educations.com/masters-degrees/engineering-studies" },
                { title: "Master of Data Science", school: "University of Amsterdam", location: "Netherlands, Amsterdam", url: "https://www.educations.com/masters-degrees/data-science" }
            ]
        );
    }, 800);
}

// Send message from conversation input
async function sendConversationMessage() {
    const input = document.getElementById('conversationInput');
    const text = input.value.trim();

    if (!text) return;

    // Add user message
    addThreadUserMessage(text);
    // ariaEngine2.addMessage('user', text); // disable engine for controlled demo flow

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Show typing
    addThreadTyping();

    // Simulate generic response for manual input in this demo
    setTimeout(() => {
        removeThreadTyping();
        addThreadAssistantMessage(
            `That sounds interesting! To give you the best advice on "${text}", could you tell me which country you're primarily interested in?`,
            [
                { label: "Germany", value: "germany" },
                { label: "Netherlands", value: "netherlands" },
                { label: "Spain", value: "spain" },
                { label: "Any Country", value: "any_country" }
            ]
        );
    }, 1000);
}

// Handle conversation input Enter key
function handleConversationKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendConversationMessage();
    }
}

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', () => {
    const mainInput = document.getElementById('mainInput');
    mainInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 150) + 'px';
    });

    const conversationInput = document.getElementById('conversationInput');
    conversationInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
});

// Scroll thread to bottom
function scrollThreadToBottom() {
    const content = document.querySelector('.conversation-content');
    if (content) {
        content.scrollTop = content.scrollHeight;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
