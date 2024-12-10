import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
    const [users, setUsers] = useState([]); // Declare state for users
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        // Fetch data from the backend
        axios.get('http://localhost:5000/getUsers')
            .then(response => {
                console.log("Fetched Users:", response.data);
                setUsers(response.data); // Set users in state
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setError("Failed to load user data."); // Set error message
            });
    }, []);

    return (
        <div className="w-100 vh-100 d-flex justify-content-center align-items-center">
            <div className="w-50">
                <h1 className="text-center">User List</h1>
                {error ? (
                    <div className="alert alert-danger text-center">{error}</div>
                ) : (
                    <table className="table table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.age}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No users available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default App;
