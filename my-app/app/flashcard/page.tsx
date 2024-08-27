"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Box, Button, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"


export default function Flashcard() {
    type Flashcard = {
        id: string;
        front: string;
        back: string;
    };

    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [flipped, setFlipped] = useState([])
    const searchParams = useSearchParams()
    const search = searchParams.get("id")

    
    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(collection(db, "users"), user.id), search)
            const docs = await getDocs(colRef)
            const flashcards: Flashcard[] = []

            docs.forEach((doc) => {
                let id = doc.id
                let front = doc.data()["front"]
                let back = doc.data()["back"]
                let flashcard = {id, front, back}
                flashcards.push(flashcard)
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id: string) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[Number(id)],
        }))
    }

    if (!isLoaded || !isSignedIn) {
        return <></>
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={3} sx={{mt: 4}}>
                    {flashcards.map((flashcard: { id: string, front: string, back: string }, index: number) => (
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
        </Container>
    )
}