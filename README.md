# ARIA Powered Search Prototypes

Interactive prototypes demonstrating ARIA AI assistant integration into educations.com for Product & Technology leadership.

## Prototypes

### Prototype 1: ARIA Chat Widget
**File:** `prototype1.html`  
**Demo:** [Prototype 1 on Vercel]

**Description:**  
Keeps the traditional educations.com search interface intact and adds an ARIA chat widget that opens as a side panel. Users can choose between traditional search or conversational AI assistance.

**Key Features:**
- Traditional dual-input search (field of study + destination)
- Floating ARIA chat button
- Slide-in chat panel from right
- Multi-turn conversations with clarifying questions
- Simulated program results within chat
- Brand-consistent design

**How to Demo:**
1. Open the prototype
2. Click "Ask ARIA" button or floating chat icon
3. Type a question like "I want to study data science in Germany"
4. Follow the conversation flow with clarifying questions
5. View program recommendations

---

### Prototype 2: Conversational Search
**File:** `prototype2.html`  
**Demo:** [Prototype 2 on Vercel]

**Description:**  
Replaces the traditional search bar with a Reddit Answers-style conversational input. Clicking or typing opens a full-screen conversation experience with ARIA.

**Key Features:**
- Single conversational input field
- Example questions as quick-start chips
- Full-screen conversation modal
- Thread-based message display
- Rich program cards within conversation
- "Start new search" functionality

**How to Demo:**
1. Open the prototype
2. Type a question in the main search box or click an example
3. Conversation opens in full-screen mode
4. Interact with clarifying question chips
5. View program results integrated into conversation thread

---

## Technical Details

### Stack
- **Frontend:** HTML, CSS, JavaScript (vanilla)
- **Styling:** Custom CSS matching educations.com brand
- **Conversation Engine:** Simulated AI with realistic responses
- **Hosting:** Vercel

### Files
- `shared-styles.css` - Brand-consistent styles for both prototypes
- `aria-engine.js` - Conversation simulation engine with mock data
- `prototype1.html` / `prototype1.js` - Chat widget version
- `prototype2.html` / `prototype2.js` - Conversational search version

### Brand Specifications
- **Primary Color:** `#a3164d` (educations.com magenta)
- **ARIA Color:** `#10b981` (green) with teal gradient
- **Typography:** Clean sans-serif matching educations.com
- **Layout:** Replicates educations.com header and hero sections

---

## Simulated Conversation Flow

Both prototypes use the same conversation engine with:

1. **Intent Detection:** Identifies user goals from natural language
2. **Entity Extraction:** Extracts fields, countries, levels, etc.
3. **Contextual Questions:** Asks clarifying questions for missing information
4. **Program Matching:** Returns relevant programs based on criteria
5. **Realistic Timing:** Simulated typing delays for natural feel

### Sample Programs Database
- MSc Data Science (TU Munich, Germany)
- MSc Computer Science (University of Amsterdam)
- MBA International Business (Barcelona)
- BSc Engineering (Politecnico di Milano)
- MSc Artificial Intelligence (KU Leuven, Belgium)
- BSc Business Administration (Copenhagen Business School)

---

## Development

### Local Testing
Simply open `prototype1.html` or `prototype2.html` in a web browser. No build process required.

### Deployment
Deployed to Vercel for easy sharing and presentation.

---

## Presentation Tips

### For Prototype 1 (Chat Widget):
- Emphasize **low friction** - users can try AI without leaving familiar interface
- Show how it **complements** existing search rather than replacing it
- Highlight **side-by-side** comparison potential

### For Prototype 2 (Conversational Search):
- Emphasize **modern, engaging** user experience
- Show how it **guides users** through complex decisions
- Highlight **simplified interface** reducing cognitive load

### Key Talking Points:
1. **Conversational search** reduces decision paralysis for users
2. **Clarifying questions** help users discover what they actually need
3. **Program recommendations** are contextualized through dialogue
4. **Brand consistency** maintains trust while innovating
5. **Both approaches** can coexist for A/B testing

---

## Next Steps

After leadership review:
1. Gather feedback on preferred approach
2. Conduct user testing with real students
3. Integrate with actual ARIA API
4. Build analytics and tracking
5. A/B test against traditional search
6. Measure impact on conversion rates and user satisfaction

---

**Built for:** Keystone Education Group  
**Presented by:** Shadman Rahman, Senior Product Manager  
**Date:** February 2026
