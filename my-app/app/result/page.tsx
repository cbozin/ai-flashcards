"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Box, CircularProgress, Container, Typography } from "@mui/material"

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get("sessions_id")

    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState({ payment_status: null })
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCheckoutSessions = async () => {
            if (!session_id) return

            try {
                const res = await fetch(`api/checkout_session/session_id=${session_id}`)
                const sessionData = await res.json()
                if (res.ok) {
                    setSession(sessionData)
                } else {
                    setError(sessionData.error)
                }
            } catch (err) {
                setError("an error occured when getting session data")
            } finally {
                setLoading(false)
            }
        }

        fetchCheckoutSessions()
    }, [session_id])

    if (loading) {
        return <Container maxWidth="lg" sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
            <Typography variant="h6">Loading...</Typography>
        </Container>
    }

    if (error) {
        return <Container maxWidth="lg" sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6">{error}</Typography>
        </Container>
    }
    return <Container maxWidth="lg" sx={{ textAlign: "center", mt: 4 }}>
        {session.payment_status === "paid" ? (
            <>
                <Typography variant="h4">Thank you for purchasing</Typography>
                <Box sx={{ mt: 22 }}>
                    <Typography variant="h6">
                        Session ID: {session_id}
                    </Typography>
                    <Typography variant="body1">
                        We have received your payment, you will receive an email with order details shortly.
                    </Typography>
                </Box>
            </>
        ) : (
            <>
                <Typography variant="h4">Payment failed.</Typography>
                <Box sx={{ mt: 22 }}>
                    <Typography variant="h6">
                        Session ID: {session_id}
                    </Typography>
                    <Typography variant="body1">
                        Your payment was unsuccessful, please try again
                    </Typography>
                </Box>
            </>
        )}
    </Container>
}

export default ResultPage