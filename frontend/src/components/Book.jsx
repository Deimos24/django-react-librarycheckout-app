import "../styles/Book.css"
import LoadingIndicator from "./LoadingIndicator";

function Book({ bookData }) {

    if (!bookData) return <LoadingIndicator/>;

    const isAvailable = bookData.status === "available"

    // format the action button based on availability
    const buttonText = isAvailable ? "Check Out!" : "Waitlist";
    const buttonClass = isAvailable ? "book-button available" : "book-button waitlist";

    const handleCheckout = (bookId) => {
        console.log(`Attempting to checkout book with ID: ${bookId}`);
        // Add API call to checkout book
    };

    return (
        <div className="book-container">
            <h2>{bookData.title}</h2>
            <h3>by {bookData.author}</h3>
            <p className="book-content">{bookData.content}</p>
            {/* <p>Status: {bookData.status_display}</p> */}
            <div className="genre-cloud">
                {bookData.genres.map((genre, index) => (
                    <span key={index} className="genre">{genre}</span>
                ))}
            </div>
            <button
                className={buttonClass}
                onClick={() => handleCheckout(bookData.id)}>{buttonText}</button>
        </div>
    )

}

export default Book