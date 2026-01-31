document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const askAriaBtn = document.getElementById('askAriaBtn');
    const ariaOverlay = document.getElementById('ariaOverlay');
    const closeAriaBtn = document.getElementById('closeAriaBtn');
    const ariaBackdrop = document.getElementById('ariaBackdrop');
    const ariaChatArea = document.getElementById('ariaChatArea');
    const ariaInput = document.getElementById('ariaInput');
    const ariaSendBtn = document.getElementById('ariaSendBtn');
    const ariaSuggestions = document.getElementById('ariaSuggestions');

    // State
    let conversationState = 'initial'; // initial, clarifying_intent, clarifying_details, complete
    let userContext = {};

    // Open/Close Handlers
    askAriaBtn.addEventListener('click', openAria);
    closeAriaBtn.addEventListener('click', closeAria);
    ariaBackdrop.addEventListener('click', closeAria);

    // Chat Handlers
    ariaSendBtn.addEventListener('click', handleUserMessage);
    ariaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserMessage();
    });

    function openAria() {
        ariaOverlay.classList.add('active');
        // Reset chat if empty or restart logic here
        if (ariaChatArea.children.length <= 1) { // Only typing indicator
            resetChat();
        }
        setTimeout(() => ariaInput.focus(), 300);
    }

    function closeAria() {
        ariaOverlay.classList.remove('active');
    }

    function resetChat() {
        ariaChatArea.innerHTML = '<div class="message aria-message typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
        conversationState = 'initial';
        userContext = {};

        // Initial Greeting
        simulateAriaResponse("Hi! I'm Aria. I can help you find the perfect study program. What are you looking for today?", [
            "Master's in Data Science",
            "MBA in Europe",
            "Interior Design courses"
        ]);
    }

    function addUserMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message user-message';
        msgDiv.innerText = text;
        ariaChatArea.appendChild(msgDiv);
        scrollToBottom();
    }

    function addAriaMessage(text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message aria-message';
        // Allow basic HTML in specific cases (like links), otherwise text
        if (text.includes('<a')) {
            msgDiv.innerHTML = text;
        } else {
            msgDiv.innerText = text;
        }
        // Remove typing indicator if present
        const typing = ariaChatArea.querySelector('.typing');
        if (typing) typing.remove();

        ariaChatArea.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        if (ariaChatArea.querySelector('.typing')) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message aria-message typing';
        msgDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        ariaChatArea.appendChild(msgDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        ariaChatArea.scrollTop = ariaChatArea.scrollHeight;
    }

    function handleUserMessage() {
        const text = ariaInput.value.trim();
        if (!text) return;

        addUserMessage(text);
        ariaInput.value = '';
        ariaSuggestions.innerHTML = ''; // Clear chips

        showTypingIndicator();
        processUserIntent(text);
    }

    function simulateAriaResponse(text, chips = [], delay = 1000) {
        setTimeout(() => {
            addAriaMessage(text);
            renderChips(chips);
        }, delay);
    }

    function renderChips(chips) {
        ariaSuggestions.innerHTML = '';
        chips.forEach(chipText => {
            const btn = document.createElement('button');
            btn.className = 'chip';
            btn.innerText = chipText;
            btn.onclick = () => {
                ariaInput.value = chipText;
                handleUserMessage();
            };
            ariaSuggestions.appendChild(btn);
        });
    }

    // Mock AI Logic
    function processUserIntent(input) {
        const lowerInput = input.toLowerCase();

        // 1. Initial State -> Clarifying Intent
        if (conversationState === 'initial') {
            userContext.subject = input;
            conversationState = 'clarifying_location';

            // Heuristic check
            if (lowerInput.includes('germany') || lowerInput.includes('uk') || lowerInput.includes('usa')) {
                userContext.location = 'provided';
                conversationState = 'clarifying_mode';
                simulateAriaResponse("Great choice! Do you prefer on-campus or online programs?", ["On-campus", "Online", "Flexible"]);
            } else {
                simulateAriaResponse("That sounds exciting! Do you have a specific country or city in mind?", ["Germany", "United Kingdom", "No preference", "Online"]);
            }
            return;
        }

        // 2. Clarifying Location -> Clarifying Mode
        if (conversationState === 'clarifying_location') {
            userContext.location = input;
            conversationState = 'clarifying_mode';
            simulateAriaResponse("Got it. And are you looking for full-time on-campus programs, or something online?", ["On-campus", "Online", "Blended"]);
            return;
        }

        // 3. Clarifying Mode -> Results (The Dream Scenario)
        if (conversationState === 'clarifying_mode') {
            userContext.mode = input;
            conversationState = 'complete';

            const searchSummary = `Looking for ${userContext.subject} in ${userContext.location || 'preferred location'} (${userContext.mode})`;

            simulateAriaResponse(`I found some amazing programs that match your criteria!\n\n${searchSummary}.`, [], 600);

            // Show Cards
            setTimeout(() => {
                const programs = [
                    {
                        uni: "IU International University",
                        title: "M.Sc. Data Science",
                        location: "Germany (Online)",
                        img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=500&q=60"
                    },
                    {
                        uni: "Arden University",
                        title: "Master of Business Administration",
                        location: "Berlin, Germany",
                        img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=500&q=60"
                    },
                    {
                        uni: "University of Europe",
                        title: "Data Science & Tech",
                        location: "Hamburg, Germany",
                        img: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=500&q=60"
                    }
                ];
                renderProgramCards(programs);

                // Value Exchange Prompt
                setTimeout(() => {
                    showTypingIndicator();
                    setTimeout(() => {
                        renderLeadCapture();
                    }, 1000);
                }, 2000);
            }, 1500);
            return;
        }

        // Default fallback
        simulateAriaResponse("I'm learning! Could you rephrase that?");
    }

    function renderProgramCards(programs) {
        const carousel = document.createElement('div');
        carousel.className = 'result-carousel';

        programs.forEach(prog => {
            const card = document.createElement('div');
            card.className = 'program-card';
            card.innerHTML = `
                <div class="card-img" style="background-image: url('${prog.img}')"></div>
                <div class="card-body">
                    <div class="card-uni">${prog.uni}</div>
                    <div class="card-title">${prog.title}</div>
                    <div class="card-meta">
                        <span><i class="fa-solid fa-location-dot"></i> ${prog.location}</span>
                    </div>
                    <a href="#" class="btn-card-action">View Program</a>
                </div>
            `;
            carousel.appendChild(card);
        });

        const msgDiv = document.createElement('div');
        msgDiv.appendChild(carousel);
        ariaChatArea.appendChild(msgDiv);
        scrollToBottom();
    }

    function renderLeadCapture() {
        const typing = ariaChatArea.querySelector('.typing');
        if (typing) typing.remove();

        const container = document.createElement('div');
        container.className = 'message aria-message';
        container.style.padding = "0"; // Reset padding for inner container

        container.innerHTML = `
            <div class="lead-capture-container">
                <div class="lead-capture-title">
                    <i class="fa-regular fa-bell"></i> Don't lose this search!
                </div>
                <div class="lead-capture-text">
                    I can save these results to your profile and alert you when new matching programs open.
                </div>
                <div class="lead-capture-actions">
                    <button class="btn-primary-small" onclick="this.parentElement.innerHTML = '<i class=\\'fa-solid fa-check\\'></i> Saved! Alerts enabled.';">Yes, save & alert me</button>
                    <button class="btn-secondary-small">No thanks</button>
                </div>
            </div>
        `;
        ariaChatArea.appendChild(container);
        scrollToBottom();
    }
});
