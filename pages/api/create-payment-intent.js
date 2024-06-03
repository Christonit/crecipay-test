const stripe = require('stripe')(process.env.SECRET_KEY);


export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            try {
                const { amount } = req.body;


                // Create Checkout Sessions from body params.
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Number(amount + "00"),
                    currency: "usd",
                    payment_method_types: ["us_bank_account"],


                });

                res.send({
                    clientSecret: paymentIntent.client_secret,
                });
            } catch (err) {
                console.log(err);
                res.status(err.statusCode || 500).json(err.message);
            }
            break;
        case "GET":
            try {
                const session =
                    await stripe.checkout.sessions.retrieve(req.query.session_id);

                res.send({
                    status: session.status,
                    customer_email: session.customer_details.email
                });
            } catch (err) {
                res.status(err.statusCode || 500).json(err.message);
            }
            break;
        default:
            res.setHeader('Allow', req.method);
            res.status(405).end('Method Not Allowed');
    }
}