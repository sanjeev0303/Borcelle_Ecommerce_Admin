'use client';

import { useEffect, useState } from 'react';

const Home = () => {
  const [myCookie, setMyCookie] = useState('');

  const setCookie = async () => {
    await fetch('/api/set-cookie');
  };

  useEffect(() => {
    const fetchCookie = async () => {
      const res = await fetch('/api/get-cookie');
      const data = await res.json();
      setMyCookie(data.myCookie);
    };

    fetchCookie();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Cookie Value: {myCookie}</p>
      <button onClick={setCookie}>Set Cookie</button>
    </div>
  );
};

export default Home;