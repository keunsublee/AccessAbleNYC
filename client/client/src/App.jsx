import React, {useState, useEffect} from 'react';

function App() {

  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data.data);
        console.log("Fetched Data:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  },[]);

  //Access the data
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Username:', userName);
    console.log('Email:', userEmail);

    const userInfo = {name: userName,email: userEmail};
    
    fetch('http://localhost:5000/',{
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userInfo)
    })

    console.log("Data sent: " + JSON.stringify(userInfo));
  };

  return (
    <div>
    <h1>Fetched Users</h1>
    <ul>
      {users.map(user => {
        return <div key={user._id}>
          <li >
            <p>{user.name}</p>
            <p>{user.email}</p>
          </li>
        </div>
      })}
    </ul>
    <form onSubmit={handleSubmit}>
        <label>
          <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder='Full Name'/>
          <input type="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder='Email'/>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App
