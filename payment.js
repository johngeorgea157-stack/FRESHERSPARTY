
window.Payment = {
    async start(paymentData) {
        if (!paymentData) {
            throw new Error(
                "Payment data is missing."
            );
        }
        if (!paymentData.customer) {

            throw new Error(
                "Customer information is missing."
            );

        }
        if (
            !paymentData.customer.name ||
            !paymentData.customer.email ||
            !paymentData.customer.phone
        ) {
            throw new Error(
                "Customer information is incomplete."
            );
        }
        const orderResponse =
            await fetch("/api/payment/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    customer:
                        paymentData.customer,
                    items:
                        paymentData.items || [],
                    metadata:
                        paymentData.metadata || {}
                })
            });
        const orderResult =
            await orderResponse.json();

        if (
            !orderResponse.ok ||
            !orderResult.success
        ) {
            throw new Error(
                orderResult.message ||
                "Could not create payment order."
            );
        }

        console.log(
            "Payment order created:",
            orderResult
        );

        const options = {
            key:
                orderResult.key_id,
            amount:
                orderResult.amount,
            currency:
                orderResult.currency,
            name:
                orderResult.name ||
                "Payment",
            description:
                orderResult.description ||
                "Online Payment",
            order_id:
                orderResult.order_id,
            prefill: {
                name:
                    paymentData.customer.name,
                email:
                    paymentData.customer.email,
                contact:
                    paymentData.customer.phone
            },
            notes:
                orderResult.notes || {},
            theme: {
                color:
                    orderResult.theme_color ||
                    "#66e3ff"
            },
            handler:
                async function (response) {

                    console.log(
                        "Razorpay response:",
                        response
                    );
                    const verificationResponse =
                        await fetch(
                            "/api/payment/verify",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },
                                body: JSON.stringify({

                                    razorpay_order_id:
                                        response
                                            .razorpay_order_id,
                                    razorpay_payment_id:
                                        response
                                            .razorpay_payment_id,
                                    razorpay_signature:
                                        response
                                            .razorpay_signature
                                })
                            }
                        );
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
                    return result;
                }
        };
        return new Promise(
            function (resolve, reject) {
                const razorpay =
                    new Razorpay(options);
                razorpay.on(
                    "payment.failed",
                    function (response) {

                        console.error(
                            "Payment failed:",
                            response
                        );
                        reject(
                            new Error(
                                response.error?.description ||
                                "Payment failed."
                            )
                        );
                    }
                );
                options.handler =
                    async function (response) {
                        try {
                            const verificationResponse =
                                await fetch(
                                    "/api/payment/verify",
                                    {
                                        method: "POST",
                                        headers: {
                                            "Content-Type":
                                                "application/json"
                                        },
                                        body: JSON.stringify({
                                            razorpay_order_id:
                                                response
                                                    .razorpay_order_id,
                                            razorpay_payment_id:
                                                response
                                                    .razorpay_payment_id,
                                            razorpay_signature:
                                                response
                                                    .razorpay_signature
                                        })

                                    }
                                );

                            const result =
                                await verificationResponse.json();
                            if (
                                !verificationResponse.ok ||
                                !result.success
                            ) {
                                throw new Error(
                                    result.message ||
                                    "Payment verification failed."
                                );
                            }
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    };
                razorpay.open();
            }
        );
    }
};
