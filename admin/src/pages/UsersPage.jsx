import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import UserDetailsModal from '../modals/UserDetailsModal';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const { data } = await axios.get(
          'http://localhost:8000/api/admin/users',
          {
            withCredentials: true,
          }
        );
        console.log(data);
        setUsers(data);
      } catch (error) {
        setError('Kullanıcılar yüklenirken bir hata oluştu.');
        console.log(error);
      }
      setUsersLoading(false);
    };
    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    const user = users.find((user) => user._id === userId);
    setSelectedUser(user);
  };

  return (
    <div className='container m-3'>
      <h2>Kullanıcı Listesi</h2>
      {usersLoading ? (
        <div className='spinner-border m-4' role='status'>
          <span className='visually-hidden'>Yükleniyor...</span>
        </div>
      ) : error ? (
        <p className='alert alert-danger'>{error}</p>
      ) : (
        <table className='table table-hover table-striped'>
          <thead className='thead-dark'>
            <tr>
              <th>ID</th>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Admin</th>
              <th>Email Doğrulandı</th>
              <th>Banlandı</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} onClick={() => handleUserClick(user._id)}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td className={user.isAdmin ? 'text-success' : 'text-danger'}>
                  {user.isAdmin ? 'Evet' : 'Hayır'}
                </td>
                <td
                  className={
                    user.isEmailVerified ? 'text-success' : 'text-danger'
                  }
                >
                  {user.isEmailVerified ? 'Evet' : 'Hayır'}
                </td>
                <td className={!user.isBanned ? 'text-success' : 'text-danger'}>
                  {user.isBanned ? 'Evet' : 'Hayır'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UsersPage;
