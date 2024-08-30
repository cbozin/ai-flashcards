'use client'

import { db } from "@/firebase"
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Paper, TextField, Typography } from "@mui/material"
import { collection, doc, getDoc, writeBatch } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function Generate() {
    const {isLoaded, isSignedIn, user} = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const handleSubmit = async () => {
        fetch('api/generate', {
            method: 'POST',
            body: text,
        }).then((res) => res.json())
            .then(data => setFlashcards(data))
    }

    const handleCardClick = (id: string) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[Number(id)],
        }))
    }

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const saveFlashcards = async () => {
        if (!name) {
            alert('Please enter a name')
            return
        }
        console.log(name)

        const batch = writeBatch(db)
        const userDocRef = doc(collection(db, 'users'), user?.id)
        console.log(user)
        console.log("user doc ref", userDocRef)
        const docSnap = await getDoc(userDocRef)
        console.log(docSnap)

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f: { name: string }) => f.name === name)) {
                alert(`Flashcard with name ${name} exists`)
                return
            } else {
                collections.push({name})
                batch.set(userDocRef, { flashcards: collections }, { merge: true })
            }
        } else {
            batch.set(userDocRef, { flashcards: [{name}] })
        }

        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')

    }
    return (<Container maxWidth="md">
        <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h4">Generate Flashcards</Typography>
            <Paper sx={{ p: 4, width: '100%' }}>
                <TextField
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    label={'Enter text'}
                    fullWidth
                    multiline
                    rows={4}
                    variant={"outlined"}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth>
                    {' '}
                    Submit
                </Button>
            </Paper>
        </Box>

        {flashcards.length > 0 &&
            (<Box sx={{ mt: 4 }}>
                <Typography variant="h5">Flashcard preview</Typography>
                <Grid container spacing={3}>
                    {flashcards.map((flashcard: { name: string, front: string, back: string }, index: number) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <CardActionArea onClick={() => { handleCardClick(String(index)) }}>
                                <CardContent>
                                    <Box sx={{
                                        perspective: "1000px",
                                        "& > div": {
                                            transition: "transform 0.6s",
                                            transformStyle: "preserve-3d",
                                            position: "relative",
                                            width: "100%",
                                            height: "200px",
                                            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                                            transform: flipped[index]
                                                ? "rotateY(180deg)"
                                                : "rotateX(0deg)",
                                        },
                                        "& > div > div": {
                                            position: "absolute",
                                            width: "100%",
                                            height: "100%",
                                            backfaceVisibility: "hidden",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            padding: 2,
                                            boxSizing: "border-box",
                                        },
                                        "& > div > div:nth-of-type(2)": {
                                            transform: "rotateY(180deg)",
                                        },
                                    }}>
                                        <div>
                                            <div>
                                                <Typography variant="h5" component={"div"}>
                                                    {flashcard.front}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="h5" component={"div"}>
                                                    {flashcard.back}
                                                </Typography>
                                            </div>
                                        </div>
                                    </Box>
                                </CardContent>
                            </CardActionArea><Card></Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                    <Button variant="contained" color="secondary" onClick={handleOpen}>Save</Button>
                </Box>
            </Box>
            )    
        }
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter a name for your flashcard collection.
                </DialogContentText>
                <TextField autoFocus margin="dense" label="Collection Name" type="text" fullWidth value={name} variant="outlined" onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setName(event.target.value);
                }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Close</Button>
                <Button onClick={saveFlashcards}>Save</Button>
            </DialogActions>
        </Dialog>
    </Container>)

}