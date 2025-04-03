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
    const [loading, setLoading] = useState(true);
    const [userName, setUsername] = useState("");
    const [userID, setUserID] = useState(null);


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

        const getRandomAvailableBook = async () => {
            try {
                const res = await api.get("/api/random-book/")
                const book = res.data
                setRandomBook(book)
            } catch (error) {
                console.error("Error fetching showcased book", error)
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

        getUser();
        getBookCount();
        getRandomAvailableBook();

    }, []);


    return (
        <div className="home-page">
        <h2 className="home-text">Welcome to the library, {userName}!</h2>
        {loading ? <LoadingIndicator/> : <p className="home-text">We have {bookCount} {bookWord} in our catalogue.</p>}
        {randomBook && <div className="featured-book-section">
            <h3 className="home-text">Check this one out:</h3>
            {loading ? <LoadingIndicator/> : <Book bookData={randomBook} userID={userID} />}
        </div>}
        </div>
    ) 

}

export default Home;