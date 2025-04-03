import api from "../api"
import { useState, useEffect } from "react";
import "../styles/Contribute.css"
import { parseErrorResponse } from "../components/utils";

function Contribute() {

    const MAX_GENRES = 6;

    // current genres, genre to be added, and add function visibility
    const [genreNames, setGenreNames] = useState([])
    const [newGenre, setNewGenre] = useState("");
    const [isAddGenreVisible, setIsAddGenreVisible] = useState(false);

    const [loading, setLoading] = useState(false)

    // package the book data with state
    const [bookData, setBookData] = useState({
        title: "",
        content: "",
        author: "",
        publication_date: "",
        genres: [],
    })

    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await api.get("/api/genres/");
                setGenreNames(res.data.map(genre => genre.name));
            } catch (error) {
                console.error("Error fetching genres", error);
            }
        };
        getGenres();
    }, []);

    const handleChange = (e) => {
        setBookData({
            ...bookData,
            [e.target.name]: e.target.value,
        });
    };

    const handleGenreClick = (genre) => {

        // limit genres here
        if (bookData.genres.length >= MAX_GENRES && !bookData.genres.includes(genre)) {
            alert(`You can only select up to ${MAX_GENRES} genres.`);
            return
        }

        // if genre is already selected, remove it
        // otherwise add it to the selection
        const updatedGenres = new Set(bookData.genres);
        if (updatedGenres.has(genre)) {
            updatedGenres.delete(genre);
        } else {
            updatedGenres.add(genre);
        }
        setBookData({ ...bookData, genres: Array.from(updatedGenres) });
    };

    const handleAddGenre = async () => {
        if (!newGenre.trim()) return;

        // pattern wasn't working in the form, let's try here
        const genrePattern = /^[a-z0-9_\-]+$/;
        if (!genrePattern.test(newGenre)) {
            alert("Genres can only contain lowercase letters, numbers, hyphens, and underscores.");
            setLoading(false);
            return;
        }

        try {
            const res = await api.post("/api/genres/", { name: newGenre });
            if (res.status === 201) {
                setGenreNames([...genreNames, newGenre]);
                // don't allow genre limit bypass with newGenre
                if (bookData.genres.length < MAX_GENRES && !bookData.genres.includes(newGenre)) {
                    setBookData({ ...bookData, genres: [...bookData.genres, newGenre] });
                }

                setNewGenre("");
            }
        } catch (error) {
            alert(parseErrorResponse(error));
        }
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
            setIsAddGenreVisible(false)
        } catch (error) {
            alert(parseErrorResponse(error));
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="contribute-container">
            <h1>Contribute to the Library</h1>
            <p>Book details:</p>

            <form onSubmit={handleSubmit} className="book-form">
                <input type="text" name="title" value={bookData.title} onChange={handleChange} placeholder="Title" required />
                <input type="text" name="author" value={bookData.author} onChange={handleChange} placeholder="Author" required />
                <textarea name="content" value={bookData.content} onChange={handleChange} placeholder="Content"></textarea>
                <p>Publication date:</p>
                <input type="date" name="publication_date" value={bookData.publication_date} onChange={handleChange} />
                <p>Genres:</p>
                <div className="genre-cloud">
                    {genreNames.map((genre, index) => (
                        <span
                            key={index}
                            className={`genre ${bookData.genres.includes(genre) ? "selected" : ""}`}
                            onClick={() => handleGenreClick(genre)}
                        >
                            {genre}
                        </span>))}<span className={`genre ${isAddGenreVisible ? "selected" : ""}`} onClick={() => setIsAddGenreVisible(!isAddGenreVisible)}>
                        {isAddGenreVisible ? "-" : "+"}</span>
                </div>

                {isAddGenreVisible && (
                    <div className="add-genre">
                        <input type="text" pattern="^[a-z0-9_\-]+$" value={newGenre} onChange={(e) => setNewGenre(e.target.value.toLowerCase())} placeholder="New genre" />
                        <button type="button" onClick={handleAddGenre}>Add Genre</button>
                    </div>
                )}

                <button type="submit">{loading ? "Adding..." : "Add Book"}</button>
            </form>

        </div>
    )

}

export default Contribute