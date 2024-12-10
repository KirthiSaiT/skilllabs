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
    const [searchTerm, setSearchTerm] = useState(''); 
    const [sortBy, setSortBy] = useState({ field: null, isAsc: true }); 

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
        setDisplayUsers(
            users
                .filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(startIndex, endIndex)
        ); 
    };

    const handleSearch = (e) => {
        const term = e.target.value; 
        setSearchTerm(term);
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(term.toLowerCase())
        );
        setDisplayUsers(filteredUsers.slice(0, rows));
        setFirst(0); 
    };

    const handleSort = (field) => {
        const isAsc = sortBy.field === field ? !sortBy.isAsc : true;
        const sortedUsers = [...users].sort((a, b) => {
            if (a[field] < b[field]) return isAsc ? -1 : 1;
            if (a[field] > b[field]) return isAsc ? 1 : -1;
            return 0;
        });
        setSortBy({ field, isAsc });
        setUsers(sortedUsers);
        setDisplayUsers(
            sortedUsers
                .filter(user =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .slice(first, first + rows)
        );
    };

    return (
        <div style={{ padding: "50px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <h1 className="text-center">User List</h1>
            <div className="d-flex justify-content-between w-75 mb-4">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="form-control w-50"
                />
                <div className="d-flex">
                    <button 
                        className="btn btn-primary ml-3"
                        onClick={() => handleSort('name')}
                    >
                        {sortBy.field === 'name' && !sortBy.isAsc ? 'Sort Name Descending' : 'Sort Name Ascending'}
                    </button>
                    <button 
                        className="btn btn-secondary ml-3"
                        onClick={() => handleSort('age')}
                    >
                        {sortBy.field === 'age' && !sortBy.isAsc ? 'Sort Age Descending' : 'Sort Age Ascending'}
                    </button>
                    <button 
                        className="btn btn-success ml-3"
                        onClick={() => handleSort('dept')}
                    >
                        {sortBy.field === 'dept' && !sortBy.isAsc ? 'Sort Dept Descending' : 'Sort Dept Ascending'}
                    </button>
                </div>
            </div>
            {error ? (
                <div className="alert alert-danger text-center">{error}</div>
            ) : (
                <>
                    <table className="table table-bordered mt-4" style={{ width: '100%' }}>
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
                                    <td colSpan="5" className="text-center">No users available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Paginator
                        first={first}
                        rows={rows}
                        totalRecords={users.filter(user =>
                            user.name.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length}
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
