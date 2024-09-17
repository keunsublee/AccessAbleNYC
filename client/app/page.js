'use client'

import styles from "./page.module.css";
import React, { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState("Loading");  
  const [users, setUsers] = useState([]);  // State for storing fetched users

  // Fetch the message from the /api/home route
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/api/home")
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setMessage(data.message);  // Set the message to state
      })
      .catch(err => console.error('Error fetching message:', err));
  }, []);

  // Fetch the list of users from the /api/users route
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_SERVER_URL + "/api/users")
      .then(response => response.json())
      .then(data => {
        console.log('Fetched users:', data);
        setUsers(data);  // Set users to state
      })
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* Display the message from /api/home */}
        <div>Return message from server:</div>
        <div>{message}</div>

        {/* Display the list of users */}
        <h1>Users List</h1>
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.username} ({user.email})</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
