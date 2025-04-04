import "../styles/Book.css"
import api from "../api";
import { useEffect, useState } from "react";
import LoadingIndicator from "./LoadingIndicator";

function Book({ bookData, userID }) {

    // BUG: maxed out forms can create a tall book

    if (!bookData) return <LoadingIndicator/>;

    // need to organize checkout function logic
    const isAvailable = bookData.status === "available"
    const isCheckedOutByUser = bookData.checked_out_by === userID;
    const [buttonText, setButtonText] = useState("")
    const [buttonClass, setButtonClass] = useState("")
    const [buttonDisabled, setButtonDisabled] = useState(false)

    useEffect(()=> {
        // this seems terrible
        if (isAvailable) {
            setButtonText("Check Out!")
            setButtonClass("book-button checkout")
        } else if (isCheckedOutByUser) {
            setButtonText("Return It")
            setButtonClass("book-button return")
        } else {
            setButtonText("Waitlist")
            setButtonClass("book-button waitlist")
            setButtonDisabled(true)
        }
    }, []);

    const handleAction = async () => {

        try {
            if (isCheckedOutByUser) {
                // return the book
                setButtonClass("book-button waitlist")
                setButtonText("Book Returned!")
                setButtonDisabled(true)
                await api.patch(`/api/books/update/${bookData.id}/`, { checked_out_by: null, status: "available" });
            } else {
                // checkout the book
                setButtonClass("book-button waitlist")
                setButtonText("Book Checked Out!")
                setButtonDisabled(true)
                await api.patch(`/api/books/update/${bookData.id}/`, { checked_out_by: userID, status: "checked_out" });
            }

            // retain page state until something changes
            // window.location.reload();
        } catch (error) {
            console.error("Error updating book status", error);
        }
    };

    return (
        <div className="book-container">
            <h2>{bookData.title}</h2>
            <h3>by {bookData.author}</h3>
            <p className="book-content">{bookData.content}</p>
            <div className="genre-cloud">
                {bookData.genres.map((genre, index) => (
                    <span key={index} className="genre">{genre}</span>
                ))}
            </div>
            <button
                className={buttonClass}
                disabled={buttonDisabled}
                onClick={() => handleAction()}>{buttonText}</button>
        </div>
    )

}

export default Book