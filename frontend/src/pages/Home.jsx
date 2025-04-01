import { useState, useEffect } from "react"
import api from "../api"

function Home() {

    const [bookCount, setBookCount] = useState(0);
    const [bookWord, setBookWord] = useState("books");

    useEffect(() => {
        const getBookCount = async () => {
            try {
                const res = await api.get("/api/book-count/");
                const count = res.data.count
                setBookCount(count);
                setBookWord(count === 1 ? "book" : "books");
            } catch (error) {
                console.error("Error fetching book count", error);
            }
        };
        getBookCount();
    })


    return (
        <div className="home-page">
        <h2>Welcome to the library!</h2>
        <p>We have {bookCount} {bookWord} in our catalogue.</p>
        <div className="random-book-section">
            <h3>Check this one out:</h3>
            <p>(unchecked out book goes here)</p>
        </div>
        </div>
    ) 

}

export default Home