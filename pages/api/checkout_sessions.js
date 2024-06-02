const stripe = require('stripe')(process.env.SECRET_KEY);

export default async function handler(req, res) {
    switch (req.method) {
        case "POST":
            try {

                // Create Checkout Sessions from body params.
                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                            price: 'price_1PNHQuRwturtisfzSYiT9N3K',
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: `${req.headers.origin}/?success=true`,
                    cancel_url: `${req.headers.origin}/?canceled=true`,
                });

                console.log({ session })
                res.redirect(303, session.url);
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