import { useState, useEffect } from "react"
import api from "../api"
import Book from "../components/Book";
import LoadingIndicator from "../components/LoadingIndicator";
import "../styles/Home.css"

function Home() {

    // BUGS:
    // seems to be running useEffect twice - hopefully just due to dev strict mode
    // application breaks if logged in user is deleted, need an auto-logout function
    // token expires and homepage breaks after a certain amount of time on one screen
    // need to take a closer look at how style sheets are used - saw some bleeding

    const [bookCount, setBookCount] = useState(0);
    const [bookWord, setBookWord] = useState("books");

    const [randomBook, setRandomBook] = useState(null);
    const [showRandomBookButton, setShowRandomBookButton] = useState(false)

    const [loading, setLoading] = useState(true);
    const [userName, setUsername] = useState("");
    const [userID, setUserID] = useState(null);

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
            setRandomBook(book);
            setShowRandomBookButton(false);
        } catch (error) {
            setRandomBook(null)
            console.error("Error fetching showcased book", error.message)
        }
    };

    // hopefully replacing this with context
    const getUser = async () => {
        try {
            const res = await api.get("/api/current-user/")
            const user = res.data
            setUsername(user.username)
            setUserID(user.id)
        } catch (error) {
            console.error("Error fetching user data", error)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getUser();
        getBookCount();
        getRandomAvailableBook();

    }, []);


    return (
        <div className="home-page">
            <h2 className="home-text">Welcome to the library, {userName}!</h2>
            {loading ? <LoadingIndicator /> : <p className="home-text">We have {bookCount} {bookWord} in our catalogue.</p>}
            {randomBook ? <div className="featured-book-section">
                <h3 className="home-text">Check this one out:</h3>
                {loading ? <LoadingIndicator /> : <Book bookData={randomBook} userID={userID} key={randomBook.id} onCheckout={() => setShowRandomBookButton(true)} />}
                {showRandomBookButton && <button className="new-book-button" onClick={getRandomAvailableBook}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-repeat" viewBox="0 0 16 16">
                    <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                    <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                </svg></button>}
            </div> : <p className="home-text">Unfortunately they are all checked out!</p>}
        </div>
    )

}

export default Home;