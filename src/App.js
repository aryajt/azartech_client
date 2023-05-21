import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import CryptoJS from 'crypto-js';

const socket = io('http://localhost:3001'); // Connect to WebSocket server on port 3001

function App() {
  const [userId, setUserId] = useState('');
  const [encryptedUserId, setEncryptedUserId] = useState('');
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = socket;

    socketRef.current.on('connect', () => {
      console.log('Connected!');
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleConnect = () => {
    socketRef.current.connect();
  };

  const handleDisconnect = () => {
    socketRef.current.disconnect();
  };

  const handleSend = () => {
    if (encryptedUserId) {
      socketRef.current.emit('userId', encryptedUserId);
    }
  };

  const handleUserIdChange = (event) => {
    setUserId(event.target.value);
    const encrypted = CryptoJS.AES.encrypt(event.target.value, '123').toString();
    setEncryptedUserId(encrypted);
  };

  return (
    <div>
      <h1>WebSocket Client App</h1>
      <div>
        <label htmlFor="userId">User ID:</label>
        <input
          type="text"
          id="userId"
          value={userId}
          onChange={handleUserIdChange}
        />
      </div>
      <div>
        <button onClick={handleConnect}>Connect</button>
        <button onClick={handleDisconnect}>Disconnect</button>
        <button onClick={handleSend}>Send</button>
      </div>
      <p>Encrypted AES User ID: {encryptedUserId}</p>
    </div>
  );
}

export default App;
