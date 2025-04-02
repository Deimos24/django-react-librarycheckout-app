import "../styles/Book.css"
import { useState } from "react";

function Book({ bookData }) {

    const [showTooltip, setShowTooltip] = useState(false);

    // change to spinner asap
    if (!bookData) return <p>Loading...</p>;

    const buttonText = bookData.status === "available" ? "Check Out!" : "Waitlist";

    const handleCheckout = (bookId) => {
        console.log(`Attempting to checkout book with ID: ${bookId}`);
        // Add API call to checkout book
    };


    // eventually want to add a hover item for genre 'cloud'
    return (
        <div className="book-container">
            <h2>{bookData.title}</h2>
            <h3>by {bookData.author}</h3>
            <p className="book-content">{bookData.content}</p>
            <p>Status: {bookData.status}</p>
            <div className="genre-cloud">
                {bookData.genre_objects.map((genre, index) => (
                    <span key={index} className="genre">{genre}</span>
                ))}
            </div>
            <button
                className="book-button"
                onClick={() => handleCheckout(bookData.id)}>{buttonText}</button>
        </div>
    )

}

export default Book