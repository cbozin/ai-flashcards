import Image from "next/image";
import getStripe from "@/utils/get-stripe"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Container, Toolbar, Typography, Button, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch("api/checkout_session", {
      method: "POST", 
      headers: {
        origin: "http://localhost:3000",
      },
    })

    const checkoutSessionJson = await checkoutSession.json()
    if(checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe?.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if(error) {
      console.warn(error.message)
    }

  }
  return (
    <Container maxWidth={"lg"}>
      <Head>
        <title>Flashcard SaaS</title>
        <meta name="description" content="Create flashcard from your text" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: "center", my: 2 }}>
        <Typography variant="h2" gutterBottom>Welcome to flashcard SaaS</Typography>
        <Typography variant="h5">The easiest way to make flashcards from text</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }}>Get Started</Button>
      </Box>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component={"h2"} gutterBottom>Features</Typography>
        <Grid spacing={4} container>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Easy Text Input</Typography>
            <Typography>{' '}Our AI intelligently breaks down your text into concise flashcards</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Accessible anywhere</Typography>
            <Typography>{' '}Access your flaschards from any device, anywhere</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6">Smart Flashcards</Typography>
            <Typography>{' '}Simply input your text and let our software create the flashcards</Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid spacing={4} container>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: "1px solid", borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5">Basic</Typography>
              <Typography variant="h6">$5 a month</Typography>
              <Typography>{' '} Access to basic features and limited storage</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Choose Basic</Button>
            </Box>
            </Grid>
            <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, border: "1px solid", borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5">Pro</Typography>
              <Typography variant="h6">$10 a month</Typography>
              <Typography>{' '} Access to unlimited flashcards and storage</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Choose Pro</Button>
            </Box> 
            </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
