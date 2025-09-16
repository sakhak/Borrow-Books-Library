import React, { useState } from 'react';

function LoginPage() {
    const [username,setUsername] = useState(null);
    const [password,setPassword] = useState(null);


  return (
    <form>
        <h1>login</h1>
      <input
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder='email'
      type="text" />
      <input
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder='password'
      type="text" />
    </form>
  );
}

export default LoginPage;
