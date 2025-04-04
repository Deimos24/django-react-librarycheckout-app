import { useEffect, useState } from "react";
import Book from "../components/Book";
import api from "../api";
import "../styles/Account.css";

function Account() {

    // TODO: basic styling, checkout dates, user details, etc

    const [loading, setLoading] = useState(false);
    const [myBooks, setMyBooks] = useState([]);
    const [userID, setUserID] = useState(null);


    useEffect(() => {
        // hopefully replacing this with context
        const getUser = async () => {
            try {
                const res = await api.get("/api/current-user/")
                const user = res.data
                setUserID(user.id)
            } catch (error) {
                console.error("Error fetching user data", error)
            }
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchMyBooks = async () => {
            // wait for userID to be set before fetching books
            if (!userID) return;
            try {
                const res = await api.get(`/api/books/?checked_out_by=${userID}`);
                const bookResults = res.data
                setMyBooks(bookResults.length > 0
                    ? bookResults.map(book => <Book key={book.id} bookData={book} userID={userID} />)
                    : "You have not checked out any books.");
            } catch (error) {
                console.error("Error fetching books", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBooks();

    }, [userID]);

    return (
        <div className="account-page">
            <h2>Account</h2>
            <p>My checked out books:</p>
            <div className="book-results-container">
                {myBooks}
            </div>
        </div>
    )
}

export default Account