import Error from "next/error";
import { NextResponse, NextRequest } from "next/server";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const formatAmountStripe = (amount: number) => {
    return Math.round(amount * 100)
}

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams
    const session_id = searchParams.get("session_id")

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id!)
        return NextResponse.json(checkoutSession)
    } catch (error: unknown) {
        console.error("error retreiving checkout session")

        let errorMessage = 'An unexpected error occurred';
        if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = (error as { message: string }).message;
        }
        return NextResponse.json({error: {message: errorMessage}}, {status:  500})
    }
}

export async function POST(req: NextRequest) {

    const params: Stripe.Checkout.SessionCreateParams = {
        mode: "subscription",
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
        success_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.get("origin")}/result?session_id={CHECKOUT_SESSION_ID}`,
    };
    const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(params)
    
    return NextResponse.json(checkoutSession, {
        status: 200,
    })

}