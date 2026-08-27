document.getElementById("registration").addEventListener("submit", async function(e) {
    e.preventDefault();

    const form = e.target;
    const button = form.querySelector("button[type='submit']");
    const success = document.getElementById("success");

    const data = {
        name: form.elements["fullName"].value.trim(),
        student_id: form.elements["studentId"].value.trim(),
        email: form.elements["email"].value.trim(),
        phone: form.elements["phone"].value.trim(),
        course: form.elements["course"].value.trim(),
        batch: form.elements["BATCH"].value
    };

    button.disabled = true;
    button.textContent = "Creating registration...";

    try {

        /* STEP 1: Create registration in Supabase */

        const registrationResponse = await fetch("/api/registrations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const registrationResult = await registrationResponse.json();

        if (!registrationResponse.ok || !registrationResult.success) {
            throw new Error(
                registrationResult.message ||
                "Registration could not be completed."
            );
        }

        const registration =
            registrationResult.registration;

        console.log("Registration created:", registration);

        /* STEP 2: Create Razorpay order */

        button.textContent = "Opening payment...";

        const orderResponse = await fetch("/api/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                registration_id: registration.registration_id
            })
        });

        const orderResult = await orderResponse.json();

        if (!orderResponse.ok || !orderResult.success) {
            throw new Error(
                orderResult.message ||
                "Could not create payment order."
            );
        }

        console.log("Razorpay order:", orderResult);

        /* STEP 3: Open Razorpay Checkout */

        const options = {

            key: orderResult.key_id,

            amount: orderResult.amount,

            currency: orderResult.currency,

            name: "UOW India",

            description: "Freshers Party 2026",

            order_id: orderResult.order_id,

            prefill: {
                name: data.name,
                email: data.email,
                contact: data.phone
            },

            notes: {
                registration_id: registration.registration_id,
                student_id: data.student_id
            },

            theme: {
                color: "#66e3ff"
            },

            handler: async function(response) {

                console.log("Payment response:", response);

                success.style.display = "block";

                success.textContent =
                    "Payment completed. Verifying your payment...";

                try {

                    const verificationResponse =
                        await fetch("/api/verify-payment", {

                            method: "POST",

                            headers: {
                                "Content-Type": "application/json"
                            },

                            body: JSON.stringify({

                                registration_id:
                                    registration.registration_id,

                                razorpay_order_id:
                                    response.razorpay_order_id,

                                razorpay_payment_id:
                                    response.razorpay_payment_id,

                                razorpay_signature:
                                    response.razorpay_signature

                            })

                        });

                    const result =
                        await verificationResponse.json();

                    console.log(
                        "Verification result:",
                        result
                    );

                    if (
                        !verificationResponse.ok ||
                        !result.success
                    ) {

                        throw new Error(
                            result.message ||
                            "Payment verification failed."
                        );

                    }

                    success.textContent =
                        "Payment verified! Your ticket is ready.";

                    sessionStorage.setItem(
                        "ticket",
                        JSON.stringify(result)
                    );

                    window.location.href =
                        result.ticket_url;

                } catch (error) {

                    console.error(
                        "Payment verification error:",
                        error
                    );

                    success.textContent =
                        "Payment was received, but we could not verify it. Please contact the event team.";

                    button.disabled = false;

                    button.textContent =
                        "Continue to Payment →";
                }
            },

            modal: {

                ondismiss: function() {

                    button.disabled = false;

                    button.textContent =
                        "Continue to Payment →";

                }

            }

        };

        const razorpay =
            new Razorpay(options);

        razorpay.open();


    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "Something went wrong."
        );

        button.disabled = false;

        button.textContent =
            "Continue to Payment →";
    }
});
