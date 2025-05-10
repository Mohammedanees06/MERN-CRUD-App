import  { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const addUser = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/users', { name, email })
            .then(response => {
                setUsers([...users, response.data]);
                setName('');
                setEmail('');
            })
            .catch(error => console.error('Error adding user:', error));
    };

    const deleteUser = (id) => {
        axios.delete(`http://localhost:5000/api/users/${id}`)  // ✅ fixed with backticks
            .then(() => {
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(error => console.error('Error deleting user:', error));
    };

    const startEditing = (user) => {
        setName(user.name);
        setEmail(user.email);
        setCurrentId(user.id);
        setIsEditing(true);
    };

    const updateUser = (e) => {
        e.preventDefault();
        console.log('Updating user with id:', currentId);  // Check if currentId is valid
        console.log('User data:', { name, email });  // Check the data being sent

        axios.put(`http://localhost:5000/api/users/${currentId}`, { name, email })  // ✅ fixed with backticks
            .then(response => {
                setUsers(users.map(user => (user.id === currentId ? response.data : user)));
                setIsEditing(false);
                setName('');
                setEmail('');
                setCurrentId(null);
            })
            .catch(error => console.error('Error updating user:', error));
    };

    return (
        <div className="App">
            <h1>Simple MERN CRUD App</h1>

            <form onSubmit={isEditing ? updateUser : addUser}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">{isEditing ? 'Update User' : 'Add User'}</button>
            </form>

            <h2 className='listss'>Users List</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email}
                        <button onClick={() => startEditing(user)}>Edit</button>
                        <button onClick={() => deleteUser(user.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
