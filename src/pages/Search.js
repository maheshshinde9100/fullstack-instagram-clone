import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { getUserByUsername } from '../services/firebase';
import { Link } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Search - Instagram';
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    setError('');
    setResults([]);
    const trimmed = query.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const users = await getUserByUsername(trimmed);
      setResults(users);
      if (users.length === 0) setError('No users found');
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='bg-gray-background min-h-screen'>
      <Header />
      <div className='mx-auto max-w-screen-lg p-4'>
        <form onSubmit={handleSearch} className='flex gap-2 mb-4'>
          <input
            className='text-sm text-gray-base w-full py-3 px-4 border border-gray-primary rounded'
            type='text'
            placeholder='Search username...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className='bg-blue-medium text-white px-4 rounded font-bold' type='submit'>
            Search
          </button>
        </form>

        {loading && <p>Searching...</p>}
        {error && !loading && <p className='text-sm text-red-primary'>{error}</p>}

        <div className='grid gap-4'>
          {results.map((u) => (
            <div key={u.docId} className='bg-white border border-gray-primary rounded p-3 flex items-center justify-between'>
              <div className='flex items-center'>
                <img
                  className='rounded-full h-10 w-10 mr-3'
                  src={`/images/avatars/${u.username}.jpg`}
                  alt={`${u.username} avatar`}
                />
                <div>
                  <p className='font-bold'>{u.username}</p>
                  <p className='text-sm text-gray-base'>{u.fullName}</p>
                </div>
              </div>
              <Link className='text-blue-medium font-bold text-sm' to={`/p/${u.username}`}>
                View
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;


