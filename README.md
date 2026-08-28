# Reusable Registration & Payment Platform

A customizable registration and payment platform originally built for the **UOW India Freshers Party 2026**.

The project automates registration, payment collection, payment verification, and personalized ticket generation. It is designed to be reused for events, small businesses, shops, supermarkets, workshops, registrations, and other applications that require an online payment workflow.

---

## 📖 The Story Behind the Project

This project started while we were organizing the **UOW India Freshers Party 2026**.

We were a small group of students organizing our Freshers Party, and initially, collecting registrations and information manually seemed manageable.

However, as registrations started coming in, we realized that even with a relatively small group, maintaining records and collecting information was becoming difficult.

We had to collect student details, maintain registration records, track payments, and keep everything organized. Much of this work was repetitive and had to be done manually.

So we decided to build a system that could automate the repetitive parts of the process.

The initial idea was simple:

```text
Collect Student Details
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

The system was built using **JavaScript, CSS, SQL, Supabase, Razorpay, and Vercel**.

- **JavaScript** — application and frontend logic
- **CSS** — website design and responsive styling
- **SQL** — database structure and data management
- **Supabase** — database and data storage
- **Razorpay** — payment gateway
- **Vercel** — hosting and deployment

Once we had the system working for our Freshers Party, we started thinking about whether the same idea could be useful to others.

The problem we were solving was not limited to a college event.

The same type of workflow could be useful for:

- College events
- Freshers parties
- Workshops
- Conferences
- Small shops
- Supermarkets
- Freelancers
- Small businesses
- Service providers
- Course registrations
- Product ordering
- Other activities where fintech and online payments are required

Instead of everyone building their own registration and payment system from scratch, we decided to make the project reusable.

The website layer is separated from the payment infrastructure. If someone wants to redesign the website, they can modify **`app.js`** and **`style.css`** while keeping the payment infrastructure unchanged, provided the required registration and payment interface remains compatible.

What started as a solution to a small problem while organizing our own Freshers Party became an attempt to build something that others could adapt and reuse.

> **Build once. Customize it. Reuse it.**

---

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

---

# 🏗️ Architecture

The project separates the website layer from the payment infrastructure.

```text
                         ┌──────────────┐
                         │  index.html  │
                         │ Entry Point  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │    app.js    │
                         │ Website Layer│
                         └──────┬───────┘
                                │
                                │ Payment.start(...)
                                ▼
                         ┌──────────────┐
                         │ payment.js   │
                         │ Payment Layer│
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Backend    │
                         └──────┬───────┘
                                │
                       ┌────────┴────────┐
                       │                 │
                       ▼                 ▼
                ┌────────────┐    ┌────────────┐
                │  Supabase  │    │  Razorpay  │
                │  Database  │    │  Payments  │
                └────────────┘    └────────────┘
```

The main principle is:

> **The website should be replaceable without rebuilding the payment engine.**

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

```text
                         ┌──────────────┐
                         │  index.html  │
                         │ Entry Point  │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │    app.js    │
                         │   Website    │
                         └──────┬───────┘
                                │
                                │ Payment.start(...)
                                ▼
                         ┌──────────────┐
                         │ payment.js   │
                         │   Payment    │
                         │    Engine    │
                         └──────┬───────┘
                                │
                                ▼
                         ┌──────────────┐
                         │   Backend    │
                         └──────┬───────┘
                                │
                       ┌────────┴────────┐
                       ▼                 ▼
                ┌────────────┐    ┌────────────┐
                │  Supabase  │    │  Razorpay  │
                │  Database  │    │  Payments  │
                └────────────┘    └────────────┘
```

## In One View

```text
┌─────────────────────────────────────────────────────┐
│                    WEBSITE                          │
│                                                     │
│              app.js + style.css                     │
│                                                     │
│             Customize / Replace                    │
└───────────────────────┬─────────────────────────────┘
                        │
                        │ Payment.start(...)
                        ▼
┌─────────────────────────────────────────────────────┐
│                 PAYMENT ENGINE                      │
│                                                     │
│                  payment.js                         │
│                                                     │
│                 Keep Reusable                       │
└───────────────────────┬─────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────┐
│                    BACKEND                           │
│                                                     │
│   Registration → Order → Payment Verification       │
└───────────────────────┬─────────────────────────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        ┌───────────┐       ┌───────────┐
        │ Supabase  │       │ Razorpay  │
        │ Database  │       │ Payments  │
        └───────────┘       └───────────┘
```

# Build Once. Customize It. Reuse It.
