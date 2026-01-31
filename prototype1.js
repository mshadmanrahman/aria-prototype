// Prototype 1: ARIA Chat Widget Beside Search
// Interactive chat panel functionality

const ariaEngine = new ARIAEngine();
let currentChips = [];

// Initialize chat with welcome message
function initChat() {
    addAssistantMessage(
        `I'm ARIA, your AI-powered study abroad advisor! I can help you with:

🎓 Finding Programs - Ask me about specific degrees, fields of study, or compare programs across countries.

🌍 Study Destinations - Learn about requirements, costs, and culture in different countries.

💰 Scholarships & Funding - Discover scholarship opportunities and financial aid options.

📋 Application Guidance - Get tips on applications, requirements, and deadlines.

Try asking me:
• "I want to study a Master's in Data Science"
• "What scholarships are available for international students?"
• "How can I study in Germany?"
• "Compare studying in UK vs Australia"

What would you like to explore today?`,
        [
            { label: "Help me find a Master's program", value: "find_masters" },
            { label: "Show me scholarships", value: "scholarships" },
            { label: "Best countries to study abroad", value: "best_countries" }
        ]
    );
}

// Open chat panel
function openChat() {
    const overlay = document.getElementById('modalOverlay');
    const chatContainer = document.getElementById('chatContainer');

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Initialize chat if container is empty
    if (chatContainer && chatContainer.children.length === 0) {
        initChat();
    }

    // Focus input after animation
    setTimeout(() => {
        const input = document.getElementById('chatInput');
        if (input) input.focus();
    }, 300);
}

// Close chat panel
function closeChat() {
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('open');
    document.body.style.overflow = 'auto';
}

// Add user message to chat
function addUserMessage(text) {
    const messagesContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    messageDiv.innerHTML = `
    <div class="message-avatar">U</div>
    <div class="message-bubble">${escapeHtml(text)}</div>
  `;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Add assistant message
function addAssistantMessage(text, chips = [], programs = null) {
    currentChips = chips; // Update current chips context

    const messagesContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message assistant';

    let chipsHtml = '';
    if (chips.length > 0) {
        chipsHtml = `
      <div class="chips-container">
        ${chips.map(chip => `
          <button class="chip" onclick="handleChipClick('${chip.value}')">${chip.label}</button>
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
                margin-top: 12px; 
                display: block; 
                text-decoration: none; 
                background: white; 
                border: 1px solid #e5e7eb; 
                border-left: 4px solid var(--primary-magenta);
                padding: 12px; 
                border-radius: 8px; 
                box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                transition: transform 0.2s;
            ">
                <h4 style="margin: 0 0 4px 0; color: var(--primary-magenta); font-size: 15px; font-weight: 600;">${prog.title}</h4>
                <p style="margin: 0 0 4px 0; font-size: 13px; color: #333; font-weight: 500;">${prog.school}</p>
                <p style="margin: 0; font-size: 12px; color: #666;">📍 ${prog.location}</p>
            </a>
            `;
        });
    }

    messageDiv.innerHTML = `
    <div class="message-avatar">A</div>
    <div class="message-bubble">
      <div style="white-space: pre-wrap;">${escapeHtml(text)}</div>
      ${chipsHtml}
      ${listingHtml}
    </div>
  `;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Show typing indicator
function showTyping() {
    const messagesContainer = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
    <div class="message-avatar">A</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
    messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

// Remove typing indicator
function removeTyping() {
    const typing = document.getElementById('typingIndicator');
    if (typing) {
        typing.remove();
    }
}

// Handle// Chip click handler
function handleChipClick(value) {
    // Add user message
    const chipLabel = currentChips.find(c => c.value === value)?.label || value;
    addUserMessage(chipLabel);

    // 1. Initial Selection -> Ask Country
    if (['find_masters', 'scholarships', 'best_countries'].includes(value)) {
        addAssistantMessage(
            `Perfect! I'd love to help you find the perfect programs. Let me ask a few questions to narrow down the best options for you:`,
            []
        );
        setTimeout(() => {
            addAssistantMessage(
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
    else if (['germany', 'netherlands', 'spain', 'any_country'].includes(value)) {
        addAssistantMessage(
            `Great choice! ${chipLabel} is an excellent destination for international students.`,
            []
        );
        setTimeout(() => {
            addAssistantMessage(
                "What field of study are you interested in?",
                [
                    { label: "Business & Management", value: "business" },
                    { label: "Computer Science & IT", value: "cs_it" },
                    { label: "Engineering", value: "engineering" },
                    { label: "Social Sciences", value: "social_sciences" }
                ]
            );
        }, 800);
    }
    // 3. Field Selected -> LEAD GEN FORM (Business Goal)
    else if (['business', 'cs_it', 'engineering', 'social_sciences'].includes(value)) {
        addAssistantMessage(
            `I found 15+ programs for ${chipLabel} that match your criteria! To send you the brochure and connect you with admissions, I just need a few details:`,
            []
        );

        // Show Lead Gen Form
        setTimeout(() => {
            const messagesContainer = document.getElementById('chatContainer');
            const formDiv = document.createElement('div');
            formDiv.className = 'message assistant';
            formDiv.innerHTML = `
                <div class="message-avatar">A</div>
                <div class="message-bubble" style="width: 100%; max-width: 300px;">
                    <div class="lead-gen-form">
                        <input type="text" id="leadName" placeholder="Full Name" class="chat-input" style="margin-bottom: 8px; width: 100%;">
                        <input type="email" id="leadEmail" placeholder="Email Address" class="chat-input" style="margin-bottom: 8px; width: 100%;">
                        <input type="tel" id="leadPhone" placeholder="Mobile Number" class="chat-input" style="margin-bottom: 8px; width: 100%;">
                        <input type="text" id="leadLocation" placeholder="Where do you live?" class="chat-input" style="margin-bottom: 12px; width: 100%;">
                        <button onclick="submitLeadGen()" class="btn btn-primary" style="width: 100%;">See My Matches</button>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(formDiv);
            scrollToBottom();
        }, 1000);
    }
    // 4. Default Fallback
    else {
        addAssistantMessage(
            `I found several programs for ${chipLabel}.`,
            [{ label: "Start Over", value: "find_masters" }]
        );
    }
}

// Function to handle Lead Gen Submission
function submitLeadGen() {
    const name = document.getElementById('leadName').value;
    const email = document.getElementById('leadEmail').value;

    if (!name || !email) {
        alert("Please enter at least your name and email.");
        return;
    }

    // Remove the form or update it (simulated)
    const formContainer = document.querySelector('.lead-gen-form').parentElement;
    formContainer.innerHTML = `Thanks ${name}! I've sent the details to ${email}. Here are your top matches:`;

    // Show Results
    setTimeout(() => {
        addAssistantMessage(
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

// Send message
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();

    if (!text) return;

    // Add user message
    addUserMessage(text);
    ariaEngine.addMessage('user', text);

    // Clear input
    input.value = '';
    input.style.height = 'auto';

    // Show typing
    showTyping();

    // Generate response
    const response = await ariaEngine.generateResponse(text);

    // Remove typing
    removeTyping();

    // Add response
    if (response.message) {
        addAssistantMessage(response.message, response.chips, response.programs);
    }

    if (response.followUp) {
        setTimeout(() => {
            addAssistantMessage(response.followUp, response.chips);
        }, 500);
    }
}

// Handle Enter key
function handleChatKeydown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Auto-resize textarea
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('chatInput');
    input.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
});

// Scroll to bottom of chat
function scrollToBottom() {
    const messagesContainer = document.getElementById('chatContainer');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
