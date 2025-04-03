import api from "../api"
import { useState, useEffect } from "react"
import "../styles/FindBooks.css"
import Book from "../components/Book"

function FindBooks() {

    const [genreNames, setGenreNames] = useState([])
    const [selectedSearch, setSelectedSearch] = useState('all');
    const [searchValue, setSearchValue] = useState('');
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const getGenres = async () => {
            try {
                const res = await api.get("/api/genres/");
                const formattedGenres = res.data.map((genre, index) => ({
                    id: index,
                    name: genre.name
                }));
                setGenreNames(formattedGenres);
            } catch (error) {
                console.error("Error fetching genres", error);
            }
        };
        getGenres();

    }, []);

    const handleChange = (e) => {
        setSelectedSearch(e.target.value);
    }

    const handleGenreClick = (genre) => {
        setSelectedGenres((prev) =>
            prev.includes(genre)
                ? prev.filter(g => g !== genre) // Remove if already selected
                : [...prev, genre]              // Add if not selected
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let queryParams = new URLSearchParams();

        // Add the search query
        if (searchValue.trim()) {
            queryParams.append("search", searchValue);

            // Apply search field limit if not "all"
            if (selectedSearch !== "all") {
                queryParams.append("search_field", selectedSearch);
            }
        }

        // add selected genres as filters
        // this needs attention
        selectedGenres.forEach(genre => {
            queryParams.append("genres__name", genre);
        });


        try {
            const res = await api.get(`/api/books/?${queryParams.toString()}`);
            const bookResults = res.data
            setSearchResults(
                bookResults.length > 0
                    ? bookResults.map(book => <Book key={book.id} bookData={book} />)
                    : "Your search returned no results."
            );

        } catch (error) {
            // haven't triggered an error yet, needs testing
            console.error("Error searching books:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form-container">
                <h2>Search:</h2>
                <input className="form-input"
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search query..." />
                <div className="search-limit-div">
                    <p>Search by:</p>
                    <select className="form-select" value={selectedSearch} onChange={handleChange}>
                        <option value="all">All</option>
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                        <option value="content">Keyword</option>
                    </select>
                </div>
                <div className="genre-cloud">
                    {genreNames.map((genre, index) => (
                        <span
                            key={index}
                            className={`genre ${selectedGenres.includes(genre.name) ? "selected" : ""}`}
                            onClick={() => handleGenreClick(genre.name)}
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>
                <button className="form-button" type="submit">Go!</button>
            </form>
            <div className="search-results-container">
                {searchResults}
            </div>
        </>
    )
}

export default FindBooks