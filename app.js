document.getElementById("app").innerHTML = `

<header class="wrap nav">
    <div class="brand">
        UOW <span>INDIA</span>
    </div>

    <a href="#register">Register</a>

    <div class="mobile-menu">
        FRESHERS '26
    </div>
</header>


<main>

    <!-- HERO -->

    <section class="hero">

        <div class="wrap hero-grid">

            <div>

                <div class="eyebrow">
                    University of Wollongong India · 2026
                </div>

                <h1>
                    FRESHERS<br>
                    <em>PARTY.</em>
                </h1>

                <p>
                    Meet your new people. Make your first memories.
                    Start the year with a night built for the UOW India community.
                </p>

                <div class="details">

                    <div class="pill">
                        09 September 2026
                    </div>

                    <div class="pill">
                        Wednesday
                    </div>

                    <div class="pill">
                        Ticket · ₹200
                    </div>

                </div>

                <a class="btn primary" href="#register">
                    Register Now&nbsp; →
                </a>

            </div>


            <div class="visual">

                <div class="orb"></div>

                <div class="ticket">

                    <div class="mini">
                        UOW INDIA · ADMIT ONE
                    </div>

                    <h3>
                        FRESHERS<br>
                        PARTY '26
                    </h3>

                    <div class="date">
                        07:00 PM · 09 SEP 2026 · WED
                    </div>

                </div>

            </div>

        </div>

    </section>


    <!-- EVENT INFORMATION -->

    <section class="section">

        <div class="wrap">

            <div class="eyebrow">
                The night
            </div>

            <h2>
                More than an introduction.
            </h2>

            <p class="section-intro">
                A fresh start deserves a proper celebration.
                Come ready to connect with your batchmates,
                enjoy the entertainment and make memories that
                last beyond orientation week.
            </p>


            <div class="cards">

                <div class="card">
                    <div class="icon">✦</div>

                    <h3>
                        Meet your people
                    </h3>

                    <p>
                        Connect with Faculty classmates and students
                        across courses and years.
                    </p>
                </div>


                <div class="card">
                    <div class="icon">♫</div>

                    <h3>
                        Music & entertainment
                    </h3>

                    <p>
                        A high-energy evening designed to get everyone involved.
                    </p>
                </div>


                <div class="card">
                    <div class="icon">◉</div>

                    <h3>
                        Make it yours
                    </h3>

                    <p>
                        Photos, activities and plenty of moments worth remembering.
                    </p>
                </div>

            </div>

        </div>

    </section>


    <!-- REGISTRATION -->

    <section id="register" class="form-section">

        <div class="wrap">

            <div class="form-card">

                <div class="eyebrow">
                    Registration
                </div>

                <h2>
                    Reserve your ticket.
                </h2>

                <p>
                    Fill in your details below.
                    Fields marked * are required.
                </p>


                <form id="registration">

                    <div class="grid">


                        <div class="field">

                            <label>
                                Full Name *
                            </label>

                            <input
                                id="fullName"
                                name="fullName"
                                required
                                placeholder="Your full name"
                            >

                        </div>


                        <div class="field">

                            <label>
                                Student ID *
                            </label>

                            <input
                                id="studentId"
                                name="studentId"
                                required
                                placeholder="e.g. 123456"
                            >

                        </div>


                        <div class="field">

                            <label>
                                University Email *
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                required
                                placeholder="you@uow.edu.au"
                            >

                        </div>


                        <div class="field">

                            <label>
                                Phone Number *
                            </label>

                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                required
                                placeholder="+91 XXXXX XXXXX"
                            >

                        </div>


                        <div class="field">

                            <label>
                                Course *
                            </label>

                            <input
                                id="course"
                                name="course"
                                required
                                placeholder="e.g. MBA"
                            >

                        </div>


                        <div class="field">

                            <label>
                                Batch *
                            </label>

                            <select
                                id="batch"
                                name="BATCH"
                                required
                            >

                                <option value="">
                                    Select Batch
                                </option>

                                <option>Bachelors</option>
                                <option>Computing 1</option>
                                <option>Computing 2</option>
                                <option>Fintech 1</option>
                                <option>Fintech 2</option>
                                <option>Fintech 3</option>

                            </select>

                        </div>


                    </div>


                    <div class="actions">

                        <span class="required">
                            Your information will be used for event registration.
                        </span>

                        <button
                            id="payButton"
                            class="btn primary"
                            type="submit"
                        >
                            Continue to Payment →
                        </button>

                    </div>


                    <div
                        id="paymentMessage"
                        class="success"
                    ></div>


                </form>

            </div>

        </div>

    </section>

</main>


<footer class="wrap footer">

    <span>
        © 2026 UOW India · Freshers Party
    </span>

    <span>

        Event venue:

        <a
            href="https://www.google.com/maps/search/?api=1&query=Lounge+Casanova"
            target="_blank"
            rel="noopener"
        >
            Lounge Casanova 📍
        </a>

    </span>

</footer>

`;


/*
|--------------------------------------------------------------------------
| WEBSITE → PAYMENT ENGINE
|--------------------------------------------------------------------------
|
| This is the only place where this particular website talks to
| the generic payment engine.
|
*/

document
    .getElementById("registration")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const form = e.target;

        const button =
            document.getElementById("payButton");

        const message =
            document.getElementById("paymentMessage");


        /*
        |--------------------------------------------------------------------------
        | Collect website-specific information
        |--------------------------------------------------------------------------
        */

        const customer = {

            name:
                document
                    .getElementById("fullName")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("email")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("phone")
                    .value
                    .trim()
        };


        const registrationData = {

            student_id:
                document
                    .getElementById("studentId")
                    .value
                    .trim(),

            course:
                document
                    .getElementById("course")
                    .value
                    .trim(),

            batch:
                document
                    .getElementById("batch")
                    .value
        };


        /*
        |--------------------------------------------------------------------------
        | Ticket being purchased
        |--------------------------------------------------------------------------
        */

        const items = [

            {
                id: "FRESHERS-2026",
                quantity: 1
            }

        ];


        button.disabled = true;

        button.textContent =
            "Opening payment...";


        try {

            const result =
                await Payment.start({

                    customer: customer,

                    items: items,

                    metadata: registrationData

                });


            /*
            |--------------------------------------------------------------------------
            | Payment successful
            |--------------------------------------------------------------------------
            */

            console.log(
                "Payment successful:",
                result
            );


            message.style.display = "block";

            message.textContent =
                "Payment verified! Your ticket is ready.";


            if (result.ticket_url) {

                sessionStorage.setItem(
                    "ticket",
                    JSON.stringify(result)
                );

                window.location.href =
                    result.ticket_url;
            }


        } catch (error) {

            console.error(
                "Payment error:",
                error
            );


            message.style.display = "block";

            message.textContent =
                error.message ||
                "Payment could not be completed.";


            button.disabled = false;

            button.textContent =
                "Continue to Payment →";
        }

    });
