import "../styles/Book.css"
import LoadingIndicator from "./LoadingIndicator";

function Book({ bookData }) {

    if (!bookData) return <LoadingIndicator/>;

    const buttonText = bookData.status === "available" ? "Check Out!" : "Waitlist";

    const handleCheckout = (bookId) => {
        console.log(`Attempting to checkout book with ID: ${bookId}`);
        // Add API call to checkout book
    };

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