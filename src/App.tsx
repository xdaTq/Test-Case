import { useEffect, useState } from "react"
import './App.css'
import axios from 'axios'
import Movie from "./components/Movie"
import config from "./config.json"
import YouTube from "react-youtube-typescript"

const MOVIE_API = "https://api.themoviedb.org/3/"
const DISCOVER_API = MOVIE_API + "discover/movie"
const API_KEY = `${config.token}`
const BACKDROP_PATH = "https://image.tmdb.org/t/p/w1280"
const IMAGE_PATH = "https://image.tmdb.org/t/p/w154"
const SEARCH_MOVIE_API = `https://api.themoviedb.org/3/search/movie?&api_key=${config.token}&query=`;

export default function App() {

    const [playing, setPlaying] = useState(false)
    const [trailer, setTrailer] = useState({
        key: Number
    });
    const [searchWord, setSearchWord] = useState('');
    const [movies, setMovies] = useState<any[]>([])
    const [movie, setMovie] = useState({
        title: String,
        backdrop_path: String,
        overview: String,
        release_date: Number,
        id: Number,
        genre_ids: Number
    });
    const [credits, setCredits] = useState<any[]>([])

    const actList = credits.slice(0, 5).map(credit => {
        const popularity = Math.ceil(credit.popularity)
        return (
            <li>
                <h4>{credit.name}</h4>
                <h5>Popularity:</h5>
                <p className="actor-popularity">{popularity}</p>
                <img src={IMAGE_PATH + credit.profile_path} alt="" />
            </li>
        )
    })

    useEffect(() => {
        fetchMovies()
        fetchCastData(movie.id)
    }, [])

    const fetchMovies = async () => {

        const { data } = await axios.get(`${DISCOVER_API}`, {
            params: {
                api_key: API_KEY,
            }
        })

        setMovies(data.results)
        setMovie(data.results[0])

    };

    const fetchCastData = async (id: any) => {

        const { data } = await axios.get(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${API_KEY}&language=en-US`)

        setCredits(data.cast.slice(0, 5))

    };

    const fetchMovie = async (id: any) => {
        const { data } = await axios.get(`${MOVIE_API}movie/${id}`, {
            params: {
                api_key: API_KEY,
                append_to_response: "videos"
            }
        })

        if (data.videos && data.videos.results) {
            const trailer = data.videos.results.find((video: { name: string }) => video.name === "Official Trailer")
            setTrailer(trailer ? trailer : data.videos.results[0])
        }

        setMovie(data)
    };

    const selectMovie = (movie: any) => {
        fetchMovie(movie.id)
        fetchCastData(movie.id)
        setPlaying(false)
        setMovie(movie)
        setCredits(credits)
        window.scrollTo(0, 0)
    };

    const searchMovie = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        fetch(SEARCH_MOVIE_API + searchWord).then(res => res.json())
            .then(data => {
                setMovies(data.results)
            })
    };

    const onChangeSearch = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSearchWord(e.target.value)
    };

    const renderMovies = () => (
        movies.map(movie => (
            <Movie
                selectMovie={selectMovie}
                key={movie.id}
                movie={movie}
            />
        ))
    )
    
    return (
        <div className="App">
            <header className="center-max-size header">
                <span className="test-case">Test-Case Movie App</span>
                <form onSubmit={searchMovie}>
                    <input
                        className="search-bar"
                        type="seach"
                        placeholder="Search for movie..."
                        value={searchWord}
                        onChange={onChangeSearch}
                    />
                </form>
            </header>
            {movies.length ?
                <main>
                    {movie ?
                        <div className="poster"
                            style={{ backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)), url(${BACKDROP_PATH}${movie.backdrop_path})` }}>
                            {playing ?
                                <>
                                    <YouTube
                                        videoId={`${trailer.key}`}
                                        className={"youtube"}
                                        containerClassName={"youtube-container"}
                                    />
                                    <button onClick={() => setPlaying(false)} className={"button close-video"}>Close
                                    </button>
                                </> :
                                <div className="center-max-size">
                                    <div className="poster-content">
                                        {trailer ?
                                            <button className={"button play-video"} onClick={() => setPlaying(true)}
                                                type="button">Play
                                                Trailer</button>
                                            : 'Sorry, no trailer available'}
                                        <h1>{movie.title}</h1>
                                        <h3>Description</h3>
                                        <p>{movie.overview}</p>
                                        <h3>Release Date: {movie.release_date}</h3>
                                        <ul className="actor-profile"> {actList} </ul>
                                    </div>
                                </div>
                            }
                        </div>
                        : null
                    }
                    <div className={"center-max-size container"}>
                        {renderMovies()}
                    </div>
                </main>
                : 'Sorry, no movies found'}
        </div>
    );
}