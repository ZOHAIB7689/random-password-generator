'use client';

import { useState, ChangeEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { CalendarIcon, StarIcon } from 'lucide-react';
import { Spinner } from './ui/spinner';

export default function MovieSearch() {
  type MovieDetails = {
    Title: string;
    Year: string;
    Plot: string;
    ImdbRating: string;
    Poster: string;
    Genre: string;
    Director: string;
    Actors: string;
    Runtime: string;
    Released: string;
  };

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMovieDetails(null);
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?t=${searchTerm}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.Response === 'False') {
        throw new Error(data.Error);
      }
      setMovieDetails(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50 p-4">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Movie Search 🎥
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Find movie details including plot, genre, director, and more!
        </p>
        <div className="flex space-x-2 mb-6">
          <Input
            type="text"
            placeholder="Enter movie title"
            value={searchTerm}
            onChange={handleChange}
            className="flex-1 px-4 py-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Button
            onClick={handleSearch}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition-all duration-200"
          >
            Search
          </Button>
        </div>

        {loading && (
          <div className="flex justify-center items-center">
            <Spinner className="w-8 h-8 text-indigo-500" />
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center mb-4">
            {error}. Please try another movie.
          </div>
        )}
        {movieDetails && (
          <div className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md mt-6">
            <img
              src={
                movieDetails.Poster !== 'N/A'
                  ? movieDetails.Poster
                  : '/placeholder.svg'
              }
              alt={movieDetails.Title}
              width={300}
              height={450}
              className="rounded-lg shadow"
            />
            <h2 className="text-2xl font-semibold text-gray-800 mt-4">
              {movieDetails.Title}
            </h2>
            <p className="text-gray-600 italic mb-4">{movieDetails.Plot}</p>
            <div className="grid grid-cols-2 gap-4 text-gray-600 w-full">
              <div>
                <CalendarIcon className="inline w-5 h-5 text-indigo-500 mr-2" />
                <span>{movieDetails.Released}</span>
              </div>
              <div>
                <StarIcon className="inline w-5 h-5 text-yellow-500 mr-2" />
                <span>{movieDetails.ImdbRating}</span>
              </div>
              <div>
                <strong>Genre:</strong> {movieDetails.Genre}
              </div>
              <div>
                <strong>Director:</strong> {movieDetails.Director}
              </div>
              <div>
                <strong>Actors:</strong> {movieDetails.Actors}
              </div>
              <div>
                <strong>Runtime:</strong> {movieDetails.Runtime}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
