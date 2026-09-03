# 🦊 Buddy — Interactive AI 3D Companion

An interactive AI-powered 3D companion designed to make digital experiences feel more human, contextual, and engaging.

**Buddy** combines conversational AI, a 3D character, personality modes, contextual awareness, event-driven reactions, and persistent user preferences into a reusable companion layer that can be embedded into different web experiences.

The current implementation is demonstrated through a real registration, payment, and digital-ticket workflow. The **Freshers Party is the demonstration environment — Buddy is the central product concept.**

---

## 💡 The Idea Behind Buddy

Most websites are transactional:

```text
User
  ↓
Fill in information
  ↓
Click buttons
  ↓
Complete task
  ↓
Leave
```

Buddy explores a different approach:

```text
User
  ↓
Interacts with the website
  ↓
🦊 Buddy observes available context
  ↓
AI generates a contextual response
  ↓
Buddy expresses a personality / reaction
  ↓
User continues the experience
```

The goal is not to replace the underlying application.

Instead, Buddy acts as an **intelligent interaction layer** that can sit on top of an existing workflow.

This makes the concept applicable to:

- Event platforms
- E-commerce
- Education
- Onboarding
- Customer support
- Financial applications
- Productivity tools
- Games and entertainment
- Community platforms
- Interactive websites
- Other digital experiences where a conversational interface can improve engagement

---

## 📖 How the Project Started

The underlying web application started from a practical problem while organizing the **UOW India Freshers Party 2026**.

We initially needed to collect registrations, maintain records, process payments, verify transactions, and generate digital tickets. The workflow was automated into a reusable registration and payment platform.

Once that system was working, we explored a different question:

> **What if a website did not just process a user, but interacted with them?**

That led to Buddy.

Rather than building a standalone chatbot, Buddy was designed as a character that could exist inside a real application and react to what the user was doing.

The Freshers Party application therefore became the first practical environment for testing the concept.

The original transaction flow remains:

```text
Collect Information
        ↓
Create Registration
        ↓
Process Payment
        ↓
Verify Payment
        ↓
Generate Personalized Ticket
        ↓
Generate QR Code
```

Buddy adds an interaction layer around this workflow:

```text
                 🦊 BUDDY
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Registration   Payment     Ticket
        │           │           │
        └───────────┼───────────┘
                    ▼
             Contextual AI
                 Response
```

---

# 🎯 What Buddy Does

Buddy is a reusable companion system that combines:

- Conversational AI
- Context-aware responses
- Multiple personality modes
- 3D character rendering
- Animation playback
- Expression support
- Event-driven reactions
- Persistent Buddy preferences
- Cross-page interaction
- User-controlled positioning
- Reduced-motion support

The underlying registration and payment system provides a realistic environment in which these capabilities can be demonstrated.

---

# ✨ Features

### 🧠 AI Interaction
- AI-generated contextual responses
- User-context-aware messages
- Different conversational personalities
- Graceful fallback responses when AI is unavailable

### 🦊 3D Companion
- Interactive 3D fox character
- GLB / glTF model support
- Three.js rendering
- Animation clip support
- Facial expression / morph-target support
- Floating and visual reactions

### 🎭 Personality Modes
- **Friendly** — supportive and welcoming
- **Extra Friendly** — more playful and humorous
- **No Buddy** — disables Buddy without affecting the application

### 🔄 Contextual Experience
- Reacts to registration information
- Reacts to successful payment
- Continues onto the ticket experience
- Receives ticket context such as name, course, and batch
- Can react differently depending on the current interaction

### 🖱️ Interaction
- Draggable Buddy
- User-controlled placement
- Thought-bubble style messages
- Persistent Buddy mode selection

### 🏗️ Reusable Application Infrastructure
- Online registration
- Razorpay payment integration
- Server-side payment order creation
- Payment verification
- Supabase database integration
- Personalized ticket generation
- QR code generation
- Vercel deployment
- Separated website and payment logic

---

# 🦊 AI Buddy Companion

Buddy is intentionally designed as a **separate interaction layer** rather than being hard-coded into the payment system.

This means the same Buddy architecture can be added to another application without rebuilding the underlying application logic.

```text
                    APPLICATION
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
     Core Workflow                 🦊 BUDDY
          │                             │
          │                       ┌─────┴─────┐
          │                       ▼           ▼
          │                  3D Character   AI Layer
          │                       │           │
          │                    Three.js   pet-ai.js
          │                       │           │
          └───────────────┬───────┴───────────┘
                          ▼
                 Contextual Experience
```

## Buddy Modes

- **Friendly** — supportive and welcoming, with reactions based on the user's context.
- **Extra Friendly** — more playful, with jokes and a stronger personality.
- **No Buddy** — disables the companion without affecting the underlying application.

## How the Buddy Works

The Buddy is implemented as a separate frontend component:

```text
pet.js
   │
   ├── Three.js
   │      └── Loads and renders the GLB fox model
   │
   ├── pet.css
   │      └── Buddy interface, thought bubble and positioning
   │
   └── pet-ai.js
          └── Generates personalized Buddy responses
```

Buddy can:

- Load a GLB-based 3D character.
- Play available GLB animations through Three.js.
- Display AI-generated messages.
- React to available user context.
- Provide different personalities through Buddy modes.
- Continue onto another page through application events.
- Remember the selected Buddy mode through browser storage.
- Be dragged around the screen.
- React to application events such as payment success.
- Respect reduced-motion preferences.

The Buddy layer is deliberately non-critical: if the AI or 3D companion is unavailable, the core application can continue functioning.

## Context-Aware Interaction

The companion receives only the contextual information required for the interaction.

For example:

```text
User enters:
    Name
    Course
    Batch

        ↓

Buddy context

        ↓

AI response

        ↓

Message + Animation + Expression
```

This allows Buddy to respond differently to different users without turning the companion into a generic static chatbot.

## Ticket Experience

The ticket page demonstrates that Buddy can continue beyond a single screen.

```text
Ticket URL
    │
    ▼
Load Ticket
    │
    ▼
Name / Course / Batch
    │
    ▼
pet:ticket-ready
    │
    ▼
🦊 Buddy
    │
    ▼
Contextual AI Response
```

The ticket itself remains independently generated and validated. Buddy simply enriches the surrounding experience.

## 3D Model

Buddy uses `.glb` files stored under the pet model directory.

The model can contain:

- Character meshes and materials.
- Animation clips such as `Idle`, `Welcome`, `Curious`, `Excited`, `Celebrate`, and `Smug`.
- Morph targets when facial expressions are supported.
- A model hierarchy suitable for Three.js animation.

The animation set can evolve independently from the AI layer.

---

# 🧩 Demonstration Application

The current implementation uses a **Freshers Party registration platform** as the first real-world demonstration of Buddy.

The application includes:

```text
Landing Page
     ↓
Registration
     ↓
Payment
     ↓
Verification
     ↓
Digital Ticket
     ↓
QR Code
```

Buddy can accompany the user across this journey:

```text
Landing / Registration
        ↓
   🦊 Interaction
        ↓
     Payment
        ↓
   🦊 Celebration
        ↓
      Ticket
        ↓
   🦊 Interaction
```

The event-specific content can be replaced without changing the core Buddy concept.

# 🎯 What the Project Does

The platform provides a complete registration-to-payment workflow:

```text
User
  ↓
Registration
  ↓
Database
  ↓
Payment Order
  ↓
Razorpay Checkout
  ↓
Payment Verification
  ↓
Ticket Generation
  ↓
QR Code
```

The original implementation was designed for event registration, but the architecture can be adapted for other payment-enabled applications.

---

# ✨ Features

- Online registration
- Razorpay payment integration
- Server-side payment order creation
- Payment verification
- Supabase database integration
- SQL database
- Personalized ticket generation
- QR code generation
- Responsive website
- Vercel deployment
- Separated website and payment logic
- Reusable architecture
- AI-powered Buddy companion with Friendly, Extra Friendly, and No Buddy modes
- Interactive 3D fox Buddy on registration and ticket pages
- Personalized Buddy messages based on registration and ticket context
- Draggable Buddy with interactive reactions

---

# 🦊 AI Buddy Companion

The Freshers Party experience was extended with an interactive 3D fox Buddy that acts as a lightweight AI companion throughout the website.

The Buddy is an addition to the original registration and payment workflow rather than a replacement for it.

```text
Registration Website
        │
        ├───────────────┐
        │               │
        ▼               ▼
 Registration       🦊 Buddy
        │               │
        ▼               ├── Friendly
    Payment            ├── Extra Friendly
        │              └── No Buddy
        ▼
     Ticket
        │
        └───────────────► 🦊 Buddy
```

## Buddy Modes

- **Friendly** — supportive and welcoming, with reactions based on the user's context.
- **Extra Friendly** — more playful, with jokes and a stronger personality.
- **No Buddy** — disables the companion without affecting registration or payment.

## How the Buddy Works

The Buddy is implemented as a separate frontend component so the core payment workflow remains independent.

```text
pet.js
   │
   ├── Three.js
   │      └── Loads and renders the GLB fox model
   │
   ├── pet.css
   │      └── Buddy interface, bubble and positioning
   │
   └── pet-ai.js
          └── Generates personalized Buddy responses
```

The Buddy can:

- Load a GLB-based 3D fox model.
- Play available GLB animations through Three.js.
- Display AI-generated messages.
- React to registration information such as name, course and batch.
- Provide different personalities through Buddy modes.
- Continue on the ticket page after registration.
- Remember the selected Buddy mode through browser storage.
- Be dragged around the screen.
- React to being dragged.
- Respect reduced-motion preferences.

The Buddy is intentionally separated from the payment engine. If the Buddy is unavailable, registration and payment can continue normally.

## Ticket Experience

After successful payment, the ticket page can load the Buddy using the ticket information.

```text
Ticket URL
    │
    ▼
Load Ticket
    │
    ▼
Name / Course / Batch
    │
    ▼
pet:ticket-ready
    │
    ▼
AI Buddy
    │
    ▼
Personalized Message
```

This extends the Freshers Party experience beyond the payment screen while keeping ticket validation independent.

## 3D Model

The Buddy uses `.glb` files stored under the pet model directory.

The model can contain:

- Fox meshes and materials.
- Animation clips such as `Idle`, `Welcome`, `Curious`, `Excited`, `Celebrate`, and `Smug`.
- Morph targets when facial expressions are supported.
- A model hierarchy suitable for Three.js animation.

The animation set can evolve as additional Buddy interactions are created.

---

# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Frontend and application logic |
| HTML | Application entry point |
| CSS | Website design and responsive layout |
| SQL | Database structure and data management |
| Supabase | Database and data storage |
| Razorpay | Payment gateway |
| Vercel | Hosting and deployment |
| Three.js | 3D Buddy rendering and animation |
| GLB / glTF | 3D Buddy model format |
| AI / pet-ai.js | Personalized Buddy responses |

---

# 🏗️ Architecture

The architecture is divided into three conceptual layers:

1. **Application Layer** — the website or workflow Buddy is embedded into.
2. **Buddy Layer** — the interactive AI and 3D companion.
3. **Infrastructure Layer** — database, payment, and backend services.

```text
                         ┌─────────────────────┐
                         │     APPLICATION     │
                         │                     │
                         │ index.html / app.js │
                         │    style.css        │
                         └──────────┬──────────┘
                                    │
                         Application Context
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │      🦊 BUDDY       │
                         │                     │
                         │       pet.js        │
                         └───────┬─────┬───────┘
                                 │     │
                     ┌───────────┘     └───────────┐
                     ▼                             ▼
              ┌──────────────┐              ┌──────────────┐
              │   Three.js   │              │   pet-ai.js  │
              │              │              │              │
              │  3D / GLB    │              │ Conversational│
              │  Animation   │              │     AI       │
              └──────────────┘              └──────────────┘
                                 │
                                 ▼
                       Contextual Experience
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
          ┌──────────────┐                ┌──────────────┐
          │   Payment    │                │   Database   │
          │    Engine     │                │  Supabase    │
          │  Razorpay    │                │              │
          └──────────────┘                └──────────────┘
```

### Design Principle

> **Buddy should be replaceable, reusable, and independent from the application's critical workflow.**

The core application does not depend on Buddy to complete a transaction.

Likewise, Buddy does not need to understand the implementation details of the payment engine. It receives relevant context and produces an interaction.

This separation makes it possible to reuse Buddy in other applications.

---

# 📁 Project Structure

```text
project/
│
├── index.html
├── app.js
├── style.css
├── payment.js
│
├── api/
│   ├── registrations.js
│   ├── create-order.js
│   └── verify-payment.js
│
├── package.json
└── README.md
```

The exact API folder structure may vary depending on the Vercel backend implementation.

---

# 📄 File Descriptions

## `index.html`

The main entry point of the application.

It loads:

- `style.css`
- Razorpay Checkout
- `app.js`
- `payment.js`

The file is intentionally kept small.

Example:

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>My Website</title>

    <link rel="stylesheet" href="style.css">
</head>

<body>

<div id="app"></div>

<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="app.js"></script>
<script src="payment.js"></script>

</body>
</html>
```

Keep the Razorpay Checkout script before `payment.js`.

---

## `app.js`

Contains the **website-specific content and frontend functionality**.

This is the primary file to modify when creating a new website.

You can change:

- Website content
- Event information
- Forms
- Products
- Sections
- Buttons
- Customer interface
- Website functionality

The website communicates with the payment engine through the payment interface.

Example:

```javascript
Payment.start({
    customer: {
        name: "...",
        email: "...",
        phone: "..."
    },
    items: [...],
    metadata: {...}
});
```

---

## `style.css`

Contains the visual design of the website.

You can modify:

- Colors
- Fonts
- Layout
- Backgrounds
- Cards
- Buttons
- Spacing
- Animations
- Mobile responsiveness

For a normal redesign, the primary files to change are:

```text
app.js
style.css
```

---

## `pet.js`

Contains the reusable frontend logic for the 3D Buddy companion.

It handles:

- GLB model loading
- Three.js scene setup
- Buddy animations
- Buddy modes
- Drag interaction
- Registration-page reactions
- Ticket-page reactions
- Persistent Buddy mode selection

The Buddy remains separate from the payment engine.

---

## `pet-ai.js`

Contains the AI-facing Buddy response logic.

It receives relevant user or ticket context and returns the Buddy's message, animation and expression instructions.

The AI layer is used for the conversational experience only. It is not responsible for payment verification, ticket validation or payment amounts.

---

## `pet.css`

Contains the Buddy's visual styling, including:

- 3D canvas positioning
- Thought/dialog bubble
- Responsive sizing
- Drag cursor behavior
- Mobile layout
- Reduced-motion behavior

---

## `payment.js`

Contains the reusable payment logic.

It handles:

1. Registration submission
2. Razorpay order creation
3. Razorpay Checkout
4. Payment response handling
5. Payment verification
6. Returning the verified payment result

The website communicates with it through the `Payment.start()` interface.

When reusing the same registration and payment structure, this file should remain unchanged.

---

## `api/registrations.js`

Backend endpoint responsible for creating and storing registration information.

It connects registration data from the website to the database.

---

## `api/create-order.js`

Backend endpoint responsible for creating the Razorpay payment order.

The payment amount is controlled by the backend using the configured pricing rather than trusting an amount supplied directly by the browser.

---

## `api/verify-payment.js`

Backend endpoint responsible for verifying the Razorpay payment.

It receives the Razorpay payment information and validates the transaction before the application treats the payment as successful.

---

## `package.json`

Contains the project's Node.js dependencies and configuration.

---

## `README.md`

Contains the project documentation, setup instructions, architecture, configuration, deployment instructions, and reuse information.

---

# 🔄 Payment Flow

The current payment workflow is:

```text
                         USER
                           │
                           ▼
                        Website
                           │
                           ▼
                   Registration Form
                           │
                           ▼
                /api/registrations
                           │
                           ▼
                       Supabase
                           │
                           ▼
                  Registration Created
                           │
                           ▼
                  /api/create-order
                           │
                           ▼
                    Razorpay Order
                           │
                           ▼
                  Razorpay Checkout
                           │
                           ▼
                         Payment
                           │
                           ▼
                 /api/verify-payment
                           │
                           ▼
                  Payment Verification
                           │
                           ▼
                  Ticket Generation
                           │
                           ▼
                Personalized Ticket
                           │
                           ▼
                       QR Code
```

The current backend endpoints are:

```text
POST /api/registrations
POST /api/create-order
POST /api/verify-payment
```

---

# 🔌 Payment Interface

The website communicates with the payment engine through the `Payment.start()` interface.

Example:

```javascript
Payment.start({
    customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "9876543210"
    },

    items: [
        {
            id: "FRESHERS-2026",
            quantity: 1
        }
    ],

    metadata: {
        student_id: "123456",
        course: "MBA",
        batch: "Fintech 1"
    }
});
```

This interface acts as the connection between the website and `payment.js`.

As long as the required structure is maintained, the website can be redesigned independently.

---

# 📝 Current Registration Structure

The original Freshers Party implementation collects:

```text
Full Name
Student ID
University Email
Phone Number
Course
Batch
```

These values are passed into the payment system through the payment interface.

For another Freshers Party or similar event using the same registration requirements, the website can be redesigned without changing the payment infrastructure.

---

# 🔐 Environment Variables

No credentials or secret values are included in this repository.

Each person deploying the project must configure their own environment variables using their own Razorpay and Supabase accounts.

The required environment variables are:

```text
TICKET_PRICE_INR

RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET

SUPABASE_URL
SUPABASE_SECRET_KEY
```

## `TICKET_PRICE_INR`

The ticket price in Indian Rupees.

Example:

```text
TICKET_PRICE_INR=200
```

The backend uses this value when determining the payment amount.

For another event, configure the appropriate ticket price.

## `RAZORPAY_KEY_ID`

Your Razorpay API Key ID.

This is used by the application when communicating with Razorpay and initializing the payment checkout.

## `RAZORPAY_KEY_SECRET`

Your Razorpay API Key Secret.

This is a private credential and must remain server-side.

Never expose it in frontend code.

## `SUPABASE_URL`

The URL of your Supabase project.

Example format:

```text
https://your-project.supabase.co
```

Use the URL belonging to your own Supabase project.

## `SUPABASE_SECRET_KEY`

The secret key used by the backend to communicate with Supabase.

This is a private server-side credential.

Never expose it through frontend JavaScript.

---

# ⚠️ Environment Variable Security

Never place secret values directly inside:

```text
index.html
app.js
payment.js
style.css
```

Never commit credentials to GitHub or another public repository.

The following variables contain sensitive credentials:

```text
RAZORPAY_KEY_SECRET
SUPABASE_SECRET_KEY
```

These should only be configured in the server environment.

---

# ⚙️ Setting Up Your Own Instance

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <project-folder>
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create a Supabase Project

Create your own Supabase project and configure the required SQL tables.

Use your own:

```text
SUPABASE_URL
SUPABASE_SECRET_KEY
```

## 4. Create a Razorpay Account

Create your own Razorpay account and obtain:

```text
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
```

Use Razorpay's test environment while developing.

## 5. Configure the Ticket Price

Set:

```text
TICKET_PRICE_INR
```

Example:

```text
TICKET_PRICE_INR=200
```

---

# 🗄️ Supabase Setup

1. Create a Supabase project.
2. Configure the required SQL tables.
3. Configure the database according to the backend.
4. Add your Supabase environment variables.
5. Deploy the application.
6. Test registration and database operations.

The database structure should match the fields required by the backend.

---

# 💳 Razorpay Setup

1. Create a Razorpay account.
2. Obtain your API credentials.
3. Configure the environment variables.
4. Use test credentials during development.
5. Test the complete payment flow.
6. Switch to live credentials when ready.

Never expose:

```text
RAZORPAY_KEY_SECRET
```

in frontend code.

---

# 🚀 Vercel Deployment

This project is designed to be deployed using Vercel.

## Steps

1. Push the project to GitHub.
2. Open Vercel.
3. Create a new project.
4. Import the GitHub repository.
5. Configure the environment variables.
6. Deploy the project.
7. Test the website.
8. Test registration.
9. Test Razorpay.
10. Test payment verification.
11. Confirm ticket generation.

---

# 🔑 Vercel Environment Variables

In your Vercel project:

```text
Project
   ↓
Settings
   ↓
Environment Variables
```

Add:

```text
TICKET_PRICE_INR
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
SUPABASE_URL
SUPABASE_SECRET_KEY
```

Use your own values.

Do not copy credentials from another deployment.

---

# 🎨 Reusing the Template

One of the main purposes of this project is to make the website reusable.

If you want to redesign the existing website, modify:

```text
app.js
style.css
```

You normally do not need to modify:

```text
index.html
payment.js
backend
```

as long as the required payment interface and registration structure remain compatible.

---

# 🦊 Reusing the Buddy

The Buddy can be reused independently of the original Freshers Party branding.

Keep the Buddy frontend files and model assets together:

```text
pet/
├── pet.js
├── pet-ai.js
├── pet.css
└── models/
    ├── friendly.glb
    └── extra-friendly.glb
```

A new website can provide the same controls:

```html
<button data-pet-mode="friendly">Friendly</button>
<button data-pet-mode="extra-friendly">Extra Friendly</button>
<button data-pet-mode="off">No Buddy</button>
```

The Buddy is an optional experience layer. The core registration, payment, verification and ticket workflow does not depend on it.

---

# 🖥️ Creating Another Freshers Website

You can create a completely different design for another Freshers Party by changing:

- University name
- Event name
- Event date
- Venue
- Branding
- Colors
- Images
- Website layout
- Event information

The main files to modify are:

```text
app.js
style.css
```

If the registration structure remains the same, the existing payment infrastructure can continue to be used.

Example:

```text
2026 Freshers Website
        │
        ▼
    app.js
    style.css
        │
        ▼
 payment.js
        │
        ▼
 Existing Backend
```

---

# 🛒 Example: Supermarket

The same architecture can be adapted for a supermarket or small shop.

For example:

```text
Rice          ₹450 × 1
Milk           ₹60 × 2
Bread          ₹45 × 1
-----------------------
Total         ₹615
```

The recommended flow is:

```text
Products
   │
   ▼
Product IDs + Quantities
   │
   ▼
Backend
   │
   ▼
Database Prices
   │
   ▼
Calculate Final Price
   │
   ▼
Apply Discounts
   │
   ▼
Create Razorpay Order
   │
   ▼
Payment
```

The final amount should be calculated or validated on the backend rather than trusting a price supplied directly by the browser.

---

# 💰 Dynamic Pricing

The platform can be extended to support dynamic pricing.

For example:

```text
Product A       ₹200
Product B       ₹150
Product C       ₹265
---------------------
Total           ₹615
```

The frontend can send product IDs and quantities:

```javascript
{
    items: [
        {
            id: "PRODUCT-001",
            quantity: 1
        },
        {
            id: "PRODUCT-002",
            quantity: 2
        }
    ]
}
```

The backend should then:

```text
Product IDs + Quantities
          ↓
       Database
          ↓
   Retrieve Prices
          ↓
   Calculate Total
          ↓
 Apply Discounts/Rules
          ↓
 Create Payment Order
```

This approach prevents users from changing the price through browser developer tools.

---

# 💡 Possible Use Cases

## Events

- Freshers parties
- College events
- Conferences
- Workshops
- Meetups

## Businesses

- Small shops
- Supermarkets
- Product ordering
- Service payments

## Freelancers

Developers and freelancers can use the project as a starting point when building payment-enabled websites for clients.

## Other Applications

- Course registration
- Membership systems
- Community activities
- Booking systems
- Product ordering
- Small-scale payment workflows
- Other fintech-enabled applications

---

# 🧩 What Should I Change?

| Goal | Files / Configuration |
|---|---|
| Change website design | `style.css` |
| Change website content | `app.js` |
| Create another Freshers design | `app.js` + `style.css` |
| Change ticket price | `TICKET_PRICE_INR` |
| Change Razorpay account | Razorpay environment variables |
| Change Supabase account | Supabase environment variables |
| Change payment workflow | `payment.js` + backend |
| Change database | SQL / Supabase + backend |
| Deploy the project | Vercel |

---

# 🧠 Design Principle

The project follows a simple principle:

> **Automate the repetitive work without making the system unnecessarily complicated.**

The original problem was registration and payment management for a student event.

The solution automated the repetitive work while keeping the website and payment infrastructure separated.

This makes it easier to reuse the project for different websites and use cases.

---

# 🐛 Troubleshooting

## `Unexpected token ... is not valid JSON`

This generally means the frontend expected JSON but the server returned something else, such as an HTML error page.

Check:

- API route
- Vercel deployment
- API URL
- Backend error
- Environment variables
- Server response

## Razorpay Does Not Open

Make sure Razorpay Checkout is loaded before `payment.js`.

The correct order is:

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script src="app.js"></script>
<script src="payment.js"></script>
```

## Registration Fails

Check:

```text
/api/registrations
```

Verify:

- Supabase is configured
- Database tables exist
- Environment variables are available
- The API is deployed correctly

## Payment Order Fails

Check:

```text
/api/create-order
```

Verify:

- Razorpay credentials
- Environment variables
- Razorpay account configuration
- Vercel server logs

## Payment Verification Fails

Check:

```text
/api/verify-payment
```

Verify that the Razorpay payment information is being received correctly and that the backend is using the correct Razorpay secret.

---

# 🔮 Future Improvements

Possible future improvements include:

- Generic payment API
- Dynamic product pricing
- Shopping cart support
- Inventory management
- Coupon and discount systems
- Admin dashboard
- Payment analytics
- Multiple event support
- Automated email notifications
- SMS notifications
- Refund management
- Advanced QR validation
- Multiple payment providers
- Reusable payment SDK
- More Buddy animations and interactions
- Additional Buddy personalities
- Expanded AI context and ticket interactions
- Optional Buddy customization for reusable deployments

---

# 🤝 Contributing

Contributions and improvements are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Test the application.
5. Test the complete payment workflow.
6. Submit a pull request.

Do not commit:

```text
API keys
Payment secrets
Database credentials
.env files
Personal user data
```

---

# ⚠️ Disclaimer

This project is provided as a reusable starting point.

Before using it for a commercial or large-scale application, review the requirements applicable to your use case, including:

- Payment provider requirements
- Data protection
- Privacy
- Tax requirements
- Refund policies
- Terms and conditions
- Applicable laws and regulations

The person deploying the application is responsible for configuring their own services, credentials, database, payment account, and legal requirements.

---

# 📜 License

Add the license you choose for this project.

For example:

```text
MIT License
```

---

# ❤️ Built From a Real Problem

This project was not initially built as a generic payment platform.

It started with a practical problem while organizing a small student event.

Manual registration and record keeping became repetitive even at a relatively small scale. Building the system allowed us to automate that work while learning about:

- Frontend development
- Backend development
- APIs
- Databases
- SQL
- Payment gateways
- Payment verification
- QR codes
- Cloud hosting
- Deployment
- System architecture

Once the system worked, we realized that the same foundation could be useful to other people.

That is why the project is being shared as a reusable template.

Whether you are organizing a Freshers Party, building a small shop, creating a supermarket checkout, developing a client website as a freelancer, or experimenting with fintech applications, the goal is to provide a working foundation that can be customized instead of starting from zero.

---

# 🚀 Final Architecture

The overall system contains two connected but independent experiences:

```text
                    WEBSITE
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
   Registration              🦊 AI BUDDY
          │                         │
          ▼                         ▼
      Payment                  pet-ai.js
          │                         │
          ▼                         ▼
       Ticket                  Three.js / GLB
          │
          └───────────────► 🦊 Buddy
```

The Buddy enriches the user experience while remaining separate from the financial transaction path.

---

# 🚀 Final Architecture

The project can be viewed as a reusable **AI companion layer** sitting on top of an application.

```text
┌─────────────────────────────────────────────────────┐
│                    APPLICATION                      │
│                                                     │
│          Website / Workflow / User Journey          │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ Context
                        ▼
┌─────────────────────────────────────────────────────┐
│                    🦊 BUDDY                         │
│                                                     │
│        Interactive AI + 3D Companion Layer          │
│                                                     │
│       pet.js · pet-ai.js · pet.css · GLB            │
└───────────────┬─────────────────────┬───────────────┘
                │                     │
                ▼                     ▼
        ┌───────────────┐     ┌────────────────┐
        │   Three.js    │     │  Conversational│
        │   3D Engine   │     │      AI        │
        └───────────────┘     └────────────────┘
                │                     │
                └──────────┬──────────┘
                           ▼
                  Contextual Response
                           │
                           ▼
                    User Experience
```

The current application demonstrates this architecture through registration, payment, and ticket generation, but the Buddy layer is intentionally designed to extend beyond that use case.

## Why This Architecture Matters

Buddy is not simply a chatbot placed beside a website.

It combines:

```text
AI
 +
Context
 +
Personality
 +
3D Character
 +
Animation
 +
Application Events
 =
Interactive AI Companion
```

The result is a reusable interaction model that can be adapted to different digital products and workflows.

---

# Build Once. Give It a Personality. Add Buddy. Reuse It.
