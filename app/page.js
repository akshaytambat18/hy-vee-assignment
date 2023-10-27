"use client";
import React, { useState, useEffect } from 'react';
import countryNames from './countryData.js';

export default function Home() {
  const [name, setName] = useState('');
  const [nationalities, setNationalities] = useState([]);
  const [gender, setGender] = useState(null);
  const [age, setAge] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name) {
      try {
        setIsLoading(true); 
        const [nationalizeResponse, genderizeResponse, agifyResponse] = await Promise.all([
          fetch(`https://api.nationalize.io?name=${name}`).then((res) => res.json()),
          fetch(`https://api.genderize.io?name=${name}`).then((res) => res.json()),
          fetch(`https://api.agify.io?name=${name}`).then((res) => res.json()),
        ]);

        const sortedNationalities = nationalizeResponse.country.sort((a, b) => b.probability - a.probability);

        setNationalities(
          sortedNationalities.map((entry) => ({
            ...entry,
            fullName: countryNames[entry.country_id] || entry.country_id, 
          }))
        );

        setGender(genderizeResponse);
        setAge(agifyResponse);
      } catch (error) {
        console.error('API call error:', error);
      } finally {
        setIsLoading(false); 
      }
    }
  };

  const clearForm = () => {
    setName('');
    setNationalities([]);
    setGender(null);
    setAge(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Person Name Analyzer</h1>
        <form onSubmit={handleSubmit} className="mb-4 relative">
          <label className="block text-gray-600 mb-2">
            Enter a name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
          </label>
          <div className="flex space-x-2 mt-4">
            <button type="submit" className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md">
              Submit
            </button>
            <button
              onClick={clearForm}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Clear
            </button>
          </div>
        </form>
        {isLoading && (
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-blue-500 text-2xl"></i> Loading...
          </div>
        )}
        {!isLoading && nationalities.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold">Nationality:</h2>
            <p className="text-gray-600  mb-2 ">
              {nationalities.length > 0 && (
                <>
                  <span>
                    <span style={{ fontWeight: 'bold' }}>
                      {(nationalities[0].probability * 100).toFixed(2)}%
                    </span>{' '}
                     probability is that the user is from{' '}
                    <span style={{ fontWeight: 'bold' }}>{nationalities[0].fullName}</span>.
                  </span>
                </>
              )}
            </p>
          </div>
        )}
        {!isLoading && gender && (
          <div>
            <h2 className="text-lg font-semibold">Gender:</h2>
            <p className="text-gray-600  mb-2">{gender.gender === 'male' ? 'Male' : 'Female'}</p>
          </div>
        )}
        {!isLoading && age && (
          <div>
            <h2 className="text-lg font-semibold">Age:</h2>
            <p className="text-gray-600  mb-2">{age.age}</p>
          </div>
        )}
      </div>
    </div>
  );
}
