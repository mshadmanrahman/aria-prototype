// ARIA Conversation Engine - Simulated AI Assistant
// Handles conversation state, mock responses, and program data

class ARIAEngine {
  constructor() {
    this.conversationHistory = [];
    this.currentContext = {};
    this.isTyping = false;

    // Mock program database
    this.programs = [
      {
        id: 1,
        name: "MSc Data Science",
        university: "Technical University of Munich",
        location: "Munich, Germany",
        country: "Germany",
        duration: "2 years",
        tuition: "€0 (No tuition fees)",
        language: "English",
        level: "Master's",
        field: "Technology"
      },
      {
        id: 2,
        name: "MSc Computer Science",
        university: "University of Amsterdam",
        location: "Amsterdam, Netherlands",
        country: "Netherlands",
        duration: "2 years",
        tuition: "€2,314/year",
        language: "English",
        level: "Master's",
        field: "Technology"
      },
      {
        id: 3,
        name: "MBA International Business",
        university: "Barcelona Graduate School of Economics",
        location: "Barcelona, Spain",
        country: "Spain",
        duration: "1 year",
        tuition: "€9,000/year",
        language: "English",
        level: "Master's",
        field: "Business"
      },
      {
        id: 4,
        name: "BSc Engineering",
        university: "Politecnico di Milano",
        location: "Milan, Italy",
        country: "Italy",
        duration: "3 years",
        tuition: "€3,900/year",
        language: "English",
        level: "Bachelor's",
        field: "Engineering"
      },
      {
        id: 5,
        name: "MSc Artificial Intelligence",
        university: "KU Leuven",
        location: "Leuven, Belgium",
        country: "Belgium",
        duration: "2 years",
        tuition: "€938/year",
        language: "English",
        level: "Master's",
        field: "Technology"
      },
      {
        id: 6,
        name: "BSc Business Administration",
        university: "Copenhagen Business School",
        location: "Copenhagen, Denmark",
        country: "Denmark",
        duration: "3 years",
        tuition: "€0 (EU students)",
        language: "English",
        level: "Bachelor's",
        field: "Business"
      }
    ];

    // Response templates
    this.responses = {
      greeting: "Hi! I'm ARIA, your AI study abroad assistant. I'm here to help you find the perfect program based on your interests and goals. What would you like to study?",

      clarifying: {
        field: "Great! What field of study are you interested in?",
        level: "What degree level are you looking for?",
        country: "Do you have a preferred country or region?",
        language: "Would you prefer programs taught in English or another language?",
        budget: "What's your budget range per year for tuition?",
        duration: "How long would you like your program to be?"
      },

      acknowledgments: [
        "Great choice!",
        "Perfect!",
        "Excellent!",
        "That's a popular option!",
        "Good thinking!"
      ]
    };
  }

  // Add message to conversation history
  addMessage(role, content, options = {}) {
    this.conversationHistory.push({
      role, // 'user' or 'assistant'
      content,
      timestamp: new Date(),
      ...options
    });
  }

  // Simulate typing delay
  async simulateTyping(duration = 1500) {
    this.isTyping = true;
    await new Promise(resolve => setTimeout(resolve, duration));
    this.isTyping = false;
  }

  // Get random acknowledgment
  getRandomAcknowledgment() {
    return this.responses.acknowledgments[
      Math.floor(Math.random() * this.responses.acknowledgments.length)
    ];
  }

  // Detect intent from user message
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();

    const intents = {
      field: ['study', 'major', 'field', 'subject', 'program'],
      country: ['country', 'where', 'location', 'place', 'germany', 'spain', 'italy', 'netherlands', 'europe'],
      level: ['bachelor', 'master', 'phd', 'mba', 'degree'],
      budget: ['cheap', 'affordable', 'budget', 'cost', 'tuition', 'fee', 'expensive'],
      language: ['english', 'language'],
      general: ['help', 'find', 'looking', 'want', 'interested']
    };

    const detected = {};

    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        detected[intent] = true;
      }
    }

    return detected;
  }

  // Extract entities from message
  extractEntities(message) {
    const lowerMessage = message.toLowerCase();
    const entities = {};

    // Detect field
    if (lowerMessage.includes('data science') || lowerMessage.includes('data')) {
      entities.field = 'Technology';
      entities.specificField = 'Data Science';
    } else if (lowerMessage.includes('computer science') || lowerMessage.includes('cs')) {
      entities.field = 'Technology';
      entities.specificField = 'Computer Science';
    } else if (lowerMessage.includes('business') || lowerMessage.includes('mba')) {
      entities.field = 'Business';
    } else if (lowerMessage.includes('engineering')) {
      entities.field = 'Engineering';
    }

    // Detect level
    if (lowerMessage.includes("bachelor") || lowerMessage.includes("bsc")) {
      entities.level = "Bachelor's";
    } else if (lowerMessage.includes("master") || lowerMessage.includes("msc") || lowerMessage.includes("mba")) {
      entities.level = "Master's";
    } else if (lowerMessage.includes("phd") || lowerMessage.includes("doctorate")) {
      entities.level = "PhD";
    }

    // Detect country
    const countries = ['germany', 'spain', 'italy', 'netherlands', 'belgium', 'denmark'];
    countries.forEach(country => {
      if (lowerMessage.includes(country)) {
        entities.country = country.charAt(0).toUpperCase() + country.slice(1);
      }
    });

    // Detect budget preference
    if (lowerMessage.includes('cheap') || lowerMessage.includes('affordable') || lowerMessage.includes('budget')) {
      entities.budgetConcern = true;
    }

    return entities;
  }

  // Generate listing page URL based on criteria
  generateListingUrl(criteria = {}) {
    let baseUrl = 'https://www.educations.com';

    // Determine degree level path
    let levelPath = '';
    if (criteria.level === "Bachelor's") {
      levelPath = '/bachelors-degrees';
    } else if (criteria.level === "Master's") {
      levelPath = '/masters-degrees';
    } else if (criteria.level === "PhD") {
      levelPath = '/phd-programs';
    } else {
      levelPath = '/study-abroad-programs';
    }

    // Determine field path
    let fieldPath = '';
    if (criteria.field === 'Technology') {
      fieldPath = '/computer-science-it';
    } else if (criteria.field === 'Business') {
      fieldPath = '/business-management-studies';
    } else if (criteria.field === 'Engineering') {
      fieldPath = '/engineering-studies';
    } else if (criteria.field === 'Healthcare') {
      fieldPath = '/healthcare';
    }

    // Construct full URL
    let url = baseUrl + levelPath + fieldPath;

    // Add country query param if specified
    if (criteria.country) {
      url += `?country=${criteria.country.toLowerCase()}`;
    }

    return url;
  }

  // Search programs based on criteria
  searchPrograms(criteria = {}) {
    let results = [...this.programs];

    if (criteria.field) {
      results = results.filter(p => p.field === criteria.field);
    }

    if (criteria.level) {
      results = results.filter(p => p.level === criteria.level);
    }

    if (criteria.country) {
      results = results.filter(p => p.country === criteria.country);
    }

    if (criteria.language) {
      results = results.filter(p => p.language === criteria.language);
    }

    return results;
  }

  // Generate conversation response
  async generateResponse(userMessage) {
    // Detect intent and extract entities
    const intent = this.detectIntent(userMessage);
    const entities = this.extractEntities(userMessage);

    // Update context with extracted entities
    this.currentContext = { ...this.currentContext, ...entities };

    // Simulate typing
    await this.simulateTyping(1200);

    // Determine response based on context
    let response = {
      message: "",
      chips: [],
      programs: []
    };

    // If this is first message or general inquiry
    if (this.conversationHistory.filter(m => m.role === 'user').length === 1) {
      if (Object.keys(entities).length > 0) {
        response.message = `${this.getRandomAcknowledgment()} I'd love to help you find ${entities.specificField || entities.field || 'the perfect'} programs${entities.country ? ' in ' + entities.country : ''}. Let me ask a few questions to narrow down the best options for you.`;

        // Ask for missing information
        if (!this.currentContext.level) {
          await this.simulateTyping(800);
          response.chips = [
            { label: "Bachelor's", value: "bachelor" },
            { label: "Master's", value: "master" },
            { label: "PhD", value: "phd" }
          ];
          response.followUp = this.responses.clarifying.level;
        } else if (!this.currentContext.country) {
          await this.simulateTyping(800);
          response.chips = [
            { label: "Germany", value: "germany" },
            { label: "Netherlands", value: "netherlands" },
            { label: "Spain", value: "spain" },
            { label: "Any country", value: "any" }
          ];
          response.followUp = this.responses.clarifying.country;
        }
      } else {
        response.message = this.responses.greeting;
        response.chips = [
          { label: "Technology", value: "technology" },
          { label: "Business", value: "business" },
          { label: "Engineering", value: "engineering" },
          { label: "Other", value: "other" }
        ];
      }
    } else {
      // Continuing conversation
      const missingInfo = this.getMissingRequiredInfo();

      if (missingInfo.length > 0) {
        response.message = this.getRandomAcknowledgment();
        await this.simulateTyping(600);

        const nextInfo = missingInfo[0];
        if (nextInfo === 'level') {
          response.followUp = this.responses.clarifying.level;
          response.chips = [
            { label: "Bachelor's", value: "bachelor" },
            { label: "Master's", value: "master" },
            { label: "PhD", value: "phd" }
          ];
        } else if (nextInfo === 'country') {
          response.followUp = "Would you like to study in a specific country?";
          response.chips = [
            { label: "Germany", value: "germany" },
            { label: "Netherlands", value: "netherlands" },
            { label: "Spain", value: "spain" },
            { label: "Any country", value: "any" }
          ];
        }
      } else {
        // We have enough info, show results with listing link
        const programs = this.searchPrograms(this.currentContext);
        const listingUrl = this.generateListingUrl(this.currentContext);

        response.message = `Perfect! I found ${programs.length} programs that match your criteria.`;
        response.listingUrl = listingUrl;
        response.listingTitle = this.getListingTitle(this.currentContext);
        response.programs = programs; // Still include for count
      }
    }

    return response;
  }

  // Check what information is still needed
  getMissingRequiredInfo() {
    const missing = [];
    if (!this.currentContext.level) missing.push('level');
    if (!this.currentContext.country && !this.currentContext.field) missing.push('country');
    return missing;
  }

  // Reset conversation
  reset() {
    this.conversationHistory = [];
    this.currentContext = {};
    this.isTyping = false;
  }

  // Set context from chip selection
  setContextFromChip(chipValue) {
    const lowerValue = chipValue.toLowerCase();

    if (lowerValue === 'bachelor' || lowerValue === "bachelor's") {
      this.currentContext.level = "Bachelor's";
    } else if (lowerValue === 'master' || lowerValue === "master's") {
      this.currentContext.level = "Master's";
    } else if (lowerValue === 'phd') {
      this.currentContext.level = "PhD";
    } else if (lowerValue === 'technology') {
      this.currentContext.field = 'Technology';
    } else if (lowerValue === 'business') {
      this.currentContext.field = 'Business';
    } else if (lowerValue === 'engineering') {
      this.currentContext.field = 'Engineering';
    } else if (['germany', 'spain', 'italy', 'netherlands', 'belgium', 'denmark'].includes(lowerValue)) {
      this.currentContext.country = chipValue.charAt(0).toUpperCase() + chipValue.slice(1).toLowerCase();
    }
  }

  // Get listing title based on criteria
  getListingTitle(criteria) {
    let title = '';

    if (criteria.level) {
      title += criteria.level + ' ';
    }

    if (criteria.field) {
      title += criteria.field + ' ';
    }

    title += 'Programs';

    if (criteria.country) {
      title += ' in ' + criteria.country;
    }

    return title;
  }
}

// Export for use in both prototypes
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARIAEngine;
}
