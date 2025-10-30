import React, { useState } from 'react'

export default function App() {
  const [reg, setReg] = useState({ username: '', email: '', password: '' });
  const [login, setLogin] = useState({ email: '', password: '' });
  const [token, setToken] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  const api = (path: string, opts: any) => fetch('/api' + path, opts).then(r => r.json());

  const doRegister = async () => {
    setMsg('');
    const res = await api('/register', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(reg) });
    if (res.error) setMsg(res.error); else setMsg('Registered: ' + res.username);
  }

  const doLogin = async () => {
    setMsg('');
    const res = await api('/login', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(login) });
    if (res.token) setToken(res.token), setMsg('Logged in'); else setMsg(res.error || 'Login failed');
  }

  const fetchUsers = async () => {
    setMsg('');
    const res = await fetch('/api/users', { headers: { Authorization: 'Bearer ' + token } }).then(r => r.json());
    if (res.error) setMsg(res.error); else setUsers(res);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full space-y-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Register</h2>
          <input className="input" placeholder="Username" value={reg.username} onChange={e=>setReg({...reg, username:e.target.value})} />
          <input className="input" placeholder="Email" value={reg.email} onChange={e=>setReg({...reg, email:e.target.value})} />
          <input className="input" placeholder="Password" type="password" value={reg.password} onChange={e=>setReg({...reg, password:e.target.value})} />
          <button className="btn" onClick={doRegister}>Register</button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <input className="input" placeholder="Email" value={login.email} onChange={e=>setLogin({...login, email:e.target.value})} />
          <input className="input" placeholder="Password" type="password" value={login.password} onChange={e=>setLogin({...login, password:e.target.value})} />
          <button className="btn" onClick={doLogin}>Login</button>
          <p className="mt-3 text-sm break-all">Token: {token}</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <button className="btn" onClick={fetchUsers}>Show Users</button>
          <pre className="mt-3 text-sm">{JSON.stringify(users, null, 2)}</pre>
        </div>

        <div className="text-red-600">{msg}</div>
      </div>
    </div>
  );
}
