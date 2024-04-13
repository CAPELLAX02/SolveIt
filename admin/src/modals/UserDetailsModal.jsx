import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDetailsModal = ({ userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userDetailsResponse = await axios.get(
          `https://bbb-mobil-backend.onrender.com/api/admin/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUser(userDetailsResponse.data);
        const userIssuesResponse = await axios.get(
          `https://bbb-mobil-backend.onrender.com/api/admin/issues?user=${userId}`,
          {
            withCredentials: true,
          }
        );
        setIssues(userIssuesResponse.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (!user) return null;

  return (
    <div
      className='modal show'
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog modal-lg shadow-lg'>
        <div className='modal-content'>
          <div className='modal-header d-flex justify-content-between'>
            <h5 className='modal-title'>Kullanıcı Detayları</h5>
            <button
              type='button'
              className='btn btn-dark shadow-sm'
              onClick={onClose}
            >
              Kapat
            </button>
          </div>
          <div className='modal-body'>
            <div className='card mb-3'>
              <div className='card-body'>
                <h6>
                  <b>ID:</b> <span className='text-secondary'>{user._id}</span>
                </h6>
                <h6>
                  <b>İsim:</b>{' '}
                  <span className='text-secondary'>{user.name}</span>
                </h6>
                <h6>
                  <b>Soyisim:</b>{' '}
                  <span className='text-secondary'>{user.surname}</span>
                </h6>
                <h6>
                  <b>Email:</b>{' '}
                  <span className='text-secondary'>{user.email}</span>
                </h6>
                <h6>
                  <b>Telefon:</b>{' '}
                  <span className='text-secondary'>{user.phone}</span>
                </h6>
                <h6>
                  <b>Admin:</b>{' '}
                  <span
                    className={user.isAdmin ? 'text-success' : 'text-danger'}
                  >
                    {user.isAdmin ? 'Evet' : 'Hayır'}
                  </span>
                </h6>
                <h6>
                  <b>Email Doğrulandı:</b>{' '}
                  <span
                    className={
                      user.isEmailVerified ? 'text-success' : 'text-danger'
                    }
                  >
                    {user.isEmailVerified ? 'Evet' : 'Hayır'}
                  </span>
                </h6>
                <h6>
                  <b>Banlandı:</b>{' '}
                  <span
                    className={user.isBanned ? 'text-danger' : 'text-secondary'}
                  >
                    {user.isBanned ? 'Evet' : 'Hayır'}
                  </span>
                </h6>
              </div>
            </div>
            <h5 className='p-2'>Bildirdiği Sorunlar</h5>
            {issues.length > 0 ? (
              <table className='table table-hover'>
                <thead>
                  <tr>
                    <th>Sorun ID</th>
                    <th>Başlık</th>
                    <th>Açıklama</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {issues.map((issue) => (
                    <tr key={issue._id}>
                      <td>{issue._id}</td>
                      <td>{issue.title}</td>
                      <td>{issue.description}</td>
                      <td>{issue.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Bu kullanıcının bildirdiği sorun bulunamadı.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
