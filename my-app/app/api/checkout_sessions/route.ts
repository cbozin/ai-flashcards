import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import Stripe from 'stripe';

export async function POST(req: NextApiRequest) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
    const formatAmountStripe = (amount: number) => {
        return Math.round(amount * 100)
    }

    const params: Stripe.Checkout.SessionCreateParams = {
        submit_type: 'pay',
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: 'USD',
                    product_data: { name: 'pro subscription' },
                    unit_amount: formatAmountStripe(10),
                    recurring: {
                        interval: 'month',
                        interval_count: 1,
                    },
                },
                quantity: 1,
            },
        ],
        success_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)
    
    return NextResponse.json(checkoutSession, {
        status: 200,
    })

}