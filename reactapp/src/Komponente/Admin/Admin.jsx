import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaUser, FaFileAlt, FaTag, FaComment } from 'react-icons/fa'; // React Icons for numeric data
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from 'chart.js';
import './Admin.css';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState({});
    const [roleId, setRoleId] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
  
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const token = sessionStorage.getItem('access_token');
          const response = await axios.get('http://127.0.0.1:8000/api/admin/users', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsers(response.data);
        } catch (error) {
          setErrorMessage('Error fetching users. Please try again.');
          console.error('Error fetching users:', error);
        }
      };
  
      const fetchStatistics = async () => {
        try {
          const token = sessionStorage.getItem('access_token');
          const response = await axios.get('http://127.0.0.1:8000/api/admin/statistics', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStatistics(response.data);
        } catch (error) {
          setErrorMessage('Error fetching statistics. Please try again.');
          console.error('Error fetching statistics:', error);
        }
      };
  
      fetchUsers();
      fetchStatistics();
    }, []);
  
    const handleRoleChange = async (userId) => {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await axios.put(
          `http://127.0.0.1:8000/api/admin/users/${userId}`,
          { role_id: roleId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUsers(users.map(user => user.id === userId ? response.data : user));
        setRoleId(null);
        setSelectedUserId(null);
      } catch (error) {
        setErrorMessage('Error updating user role. Please try again.');
        console.error('Error updating user role:', error);
      }
    };
  
    if (errorMessage) {
      return <p className="error-text">{errorMessage}</p>;
    }
  
    const barData = {
      labels: statistics.top_tags ? statistics.top_tags.map(tag => tag.name) : [],
      datasets: [
        {
          label: 'Number of Documents',
          data: statistics.top_tags ? statistics.top_tags.map(tag => tag.total_documents) : [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  
    const lineData = {
      labels: statistics.documents_per_month ? statistics.documents_per_month.map(doc => doc.month) : [],
      datasets: [
        {
          label: 'Documents Created',
          data: statistics.documents_per_month ? statistics.documents_per_month.map(doc => doc.total) : [],
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    };
  
    return (
      <div className="admin-container">
        <h2>ADMIN</h2>
        <div className="statistics-container">
          <div className="stat-item">
            <FaUser />
            <div>Total Admins: {statistics.total_admins}</div>
          </div>
          <div className="stat-item">
            <FaUser />
            <div>Total Moderators: {statistics.total_moderators}</div>
          </div>
          <div className="stat-item">
            <FaUser />
            <div>Total Users: {statistics.total_users}</div>
          </div>
          <div className="stat-item">
            <FaFileAlt />
            <div>Total Documents: {statistics.total_documents}</div>
          </div>
          <div className="stat-item">
            <FaTag />
            <div>Total Tags: {statistics.total_tags}</div>
          </div>
          <div className="stat-item">
            <FaComment />
            <div>Total Comments: {statistics.total_comments}</div>
          </div>
        </div>
        <div className="charts-container">
          <div className="chart">
            <h3>Top Tags by Number of Documents</h3>
            <Bar data={barData} options={{ responsive: true }} />
          </div>
          <div className="chart">
            <h3>Documents Created Per Month</h3>
            <Line data={lineData} options={{ responsive: true }} />
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role_id}
                    onChange={(e) => {
                      setRoleId(e.target.value);
                      setSelectedUserId(user.id);
                    }}
                  >
                    <option value="1">Admin</option>
                    <option value="2">User</option>
                    <option value="3">Moderator</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleRoleChange(user.id)}>Update Role</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Admin;
  