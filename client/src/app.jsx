import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';                              
import { Paginator } from 'primereact/paginator';

const App = () => {
    const [users, setUsers] = useState([]); 
    const [error, setError] = useState(null); 
    const [first, setFirst] = useState(0); 
    const [rows, setRows] = useState(3); 
    const [displayUsers, setDisplayUsers] = useState([]); 

    useEffect(() => {
        axios.get('http://localhost:5000/getUsers') 
            .then(response => {
                console.log("Fetched Users:", response.data);
                setUsers(response.data); 
                setDisplayUsers(response.data.slice(0, rows)); 
            })
            .catch(err => {
                console.error("Error fetching data:", err);
                setError("Failed to load user data."); 
            });
    }, []);

    const onPageChange = (event) => {
        const startIndex = event.first; 
        const endIndex = startIndex + event.rows; 
        setFirst(startIndex);
        setRows(event.rows); 
        setDisplayUsers(users.slice(startIndex, endIndex)); 
    };

    return (
        <div style={{ padding: "50px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <h1 className="text-center">User List</h1>
            {error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : (
                <>
                    <table className="table table-bordered mt-4">
                        <thead className="thead-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Age</th>
                                <th>Department</th>
                                <th>Gender</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayUsers.length > 0 ? (
                                displayUsers.map(user => (
                                    <tr key={user._id}>
                                        <td>{user.id}</td>
                                        <td>{user.name}</td>
                                        <td>{user.age}</td>
                                        <td>{user.dept}</td>
                                        <td>{user.gender}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No users available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={users.length}
                        rowsPerPageOptions={[3, 5, 10]}
                        onPageChange={onPageChange}
                        className="mt-3"
                    />
                </>
            )}
        </div>
    );
};

export default App;
