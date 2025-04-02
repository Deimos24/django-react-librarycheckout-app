import { useState, useEffect } from "react"
import api from "../api"
import Book from "../components/Book";

function Home() {

    // loading spinner asap
    const [bookCount, setBookCount] = useState(0);
    const [bookWord, setBookWord] = useState("books");
    const [randomBook, setRandomBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // seems to be running useEffect twice - hopefully just due to dev strict mode
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
        const getRandomAvailableBook = async () => {
            try {
                const res = await api.get("/api/random-book/")
                const book = res.data
                console.log(book)
                setRandomBook(book)
            } catch (error) {
                console.error("Error fetching showcased book", error)
            } finally {
                setLoading(false);
            }

        };
        getBookCount();
        getRandomAvailableBook();

    }, []);


    return (
        <div className="home-page">
        <h2>Welcome to the library!</h2>
        <p>We have {bookCount} {bookWord} in our catalogue.</p>
        <div className="random-book-section">
            <h3>Check this one out:</h3>
            {loading ? <p>Loading book...</p> : <Book bookData={randomBook} />}
        </div>
        </div>
    ) 

}

export default Home;