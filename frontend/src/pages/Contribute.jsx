import api from "../api"
import { useState } from "react";
import "../styles/Contribute.css"
import { parseErrorResponse } from "../components/utils";

function Contribute() {

    const [loading, setLoading] = useState(false)
    // package the book data with state
    const [bookData, setBookData] = useState({
        title: "",
        content: "",
        author: "",
        publication_date: "",
        genres: [],
    })

    const handleChange = (e) => {
        setBookData({
            ...bookData,
            [e.target.name]: e.target.value,
        });
    };

    // multiple genre selections
    const handleGenreChange = (e) => {
        const selectedGenres = Array.from(e.target.selectedOptions, option => option.value);
        setBookData({ ...bookData, genres: selectedGenres });
    };

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();

        try {
            const res = await api.post("/api/books/", bookData);
            if (res.status === 201) {
                alert("Book added succesfully!");
                setBookData({ title: "", author: "", content: "", publication_date: "", genres: [] });
            }
        } catch (error) {
            alert(parseErrorResponse(error));
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h1>Contribute to the Library</h1>
            <p>Book details:</p>

            <form onSubmit={handleSubmit} className="book-form">
                <input type="text" name="title" value={bookData.title} onChange={handleChange} placeholder="Title" required />
                <input type="text" name="author" value={bookData.author} onChange={handleChange} placeholder="Author" required />
                <textarea name="content" value={bookData.content} onChange={handleChange} placeholder="Description"></textarea>
                <p>Publication date:</p>
                <input type="date" name="publication_date" value={bookData.publication_date} onChange={handleChange} />
                <p>Keywords:</p>
                <select multiple name="genres" onChange={handleGenreChange}>
                    <option value="scifi">Science Fiction</option>
                    <option value="nonfiction">Nonfiction</option>
                    <option value="fantasy">Fantasy</option>
                    <option value="mystery">Mystery</option>
                </select>

                <button type="submit">Add Book</button>
            </form>

        </div>
    )

}

export default Contribute