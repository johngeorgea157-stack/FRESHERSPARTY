window.Payment = {
    async start(paymentData) {
        if (!paymentData) {
            throw new Error("Payment data is missing.");
        }

        if (!paymentData.customer) {
            throw new Error("Customer information is missing.");
        }

        const customer = paymentData.customer;

        if (!customer.name || !customer.email || !customer.phone) {
            throw new Error("Customer information is incomplete.");
        }

        const registrationData = {
            name: customer.name,
            student_id: paymentData.metadata?.student_id || "",
            email: customer.email,
            phone: customer.phone,
            course: paymentData.metadata?.course || "",
            batch: paymentData.metadata?.batch || ""
        };

        const registrationResponse = await fetch("/api/registrations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registrationData)
        });

        const registrationText = await registrationResponse.text();
        let registrationResult;

        try {
            registrationResult = JSON.parse(registrationText);
        } catch (error) {
            console.error("Registration API returned non-JSON:", registrationText);
            throw new Error("Registration server returned an invalid response.");
        }

        if (!registrationResponse.ok || !registrationResult.success) {
            throw new Error(
                registrationResult.message ||
                "Registration could not be completed."
            );
        }

        const registration = registrationResult.registration;

        const orderResponse = await fetch("/api/create-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                registration_id: registration.registration_id
            })
        });

        const orderText = await orderResponse.text();
        let orderResult;

        try {
            orderResult = JSON.parse(orderText);
        } catch (error) {
            console.error("Create-order API returned non-JSON:", orderText);
            throw new Error("Payment server returned an invalid response.");
        }

        if (!orderResponse.ok || !orderResult.success) {
            throw new Error(
                orderResult.message ||
                "Could not create payment order."
            );
        }

        return new Promise(function(resolve, reject) {
            const options = {
                key: orderResult.key_id,
                amount: orderResult.amount,
                currency: orderResult.currency,
                name: orderResult.name || "UOW India",
                description: orderResult.description || "Online Payment",
                order_id: orderResult.order_id,
                prefill: {
                    name: customer.name,
                    email: customer.email,
                    contact: customer.phone
                },
                notes: {
                    registration_id: registration.registration_id,
                    student_id: paymentData.metadata?.student_id || ""
                },
                theme: {
                    color: orderResult.theme_color || "#66e3ff"
                },
                handler: async function(response) {
                    try {
                        const verificationResponse = await fetch("/api/verify-payment", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                registration_id: registration.registration_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            })
                        });

                        const verificationText = await verificationResponse.text();
                        let result;

                        try {
                            result = JSON.parse(verificationText);
                        } catch (error) {
                            console.error(
                                "Verification API returned non-JSON:",
                                verificationText
                            );
                            throw new Error(
                                "Payment verification server returned an invalid response."
                            );
                        }

                        if (!verificationResponse.ok || !result.success) {
                            throw new Error(
                                result.message ||
                                "Payment verification failed."
                            );
                        }

                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                },
                modal: {
                    ondismiss: function() {
                        reject(new Error("Payment was cancelled."));
                    }
                }
            };

            const razorpay = new Razorpay(options);

            razorpay.on("payment.failed", function(response) {
                reject(
                    new Error(
                        response.error?.description ||
                        "Payment failed."
                    )
                );
            });

            razorpay.open();
        });
    }
};
