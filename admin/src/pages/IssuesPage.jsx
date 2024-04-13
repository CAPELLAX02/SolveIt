import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import UserDetailsModal from '../modals/UserDetailsModal';
import IssueDetailsModal from '../modals/IssueDetailsModal';

const IssuesPage = () => {
  const [issues, setIssues] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [codeFilter, setCodeFilter] = useState('all');
  const [neighborhoodFilter, setNeighborhoodFilter] = useState('all');

  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchIssues = async () => {
      setIssuesLoading(true);
      try {
        const { data } = await axios.get(
          'https://bbb-mobil-backend.onrender.com/api/admin/issues',
          {
            withCredentials: true,
          }
        );
        setIssues(data);
      } catch (error) {
        setError('Sorunlar yüklenirken bir hata oluştu: ' + error.message);
      } finally {
        setIssuesLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const handleUserClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleIssueClick = async (issue) => {
    console.log(issue.address.split(',')[1].split(' ')[1]);
    setSelectedIssue(issue);

    try {
      const response = await axios.get(
        `https://bbb-mobil-backend.onrender.com/api/admin/users/${issue.user}`,
        {
          withCredentials: true,
        }
      );
      setSelectedUser(response.data); // Seçilen kullanıcının bilgilerini state'e kaydet
    } catch (error) {
      console.error('Kullanıcı bilgileri çekilirken bir hata oluştu:', error);
      setSelectedUser(null); // Hata durumunda kullanıcı bilgilerini null olarak ayarla
    }

    setIsIssueModalOpen(true);
  };

  const getIssueStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'solved':
        return 'Çözüldü';
      case 'unsolved':
        return 'Çözülmedi';
      default:
        return 'Bilinmiyor'; // Varsayılan bir değer
    }
  };

  const filteredIssues = issues.filter((issue) => {
    return (
      (statusFilter === 'all' || issue.status === statusFilter) &&
      (codeFilter === 'all' || issue.code === codeFilter) &&
      // (neighborhoodFilter === 'all' ||
      //   issue.address.split(',')[1].split(' ')[1])
      (neighborhoodFilter === 'all' || issue.address)
      // MAHALLE FİLTRESİ BOZUK!
    );
  });

  const renderFilterRadioButtons = (name, options, selectedValue, onChange) => {
    return (
      <div className='p-3 shadow mt-2 mb-4'>
        <h5 className='mb-2'>{name}</h5>
        {options.map((option) => (
          <div key={option.value} className='form-check form-switch mb-1'>
            <input
              type='radio'
              className='form-check-input '
              id={option.value}
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
            />
            <label className='form-check-label' htmlFor={option.value}>
              {option.label}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='container m-3'>
      <h2>Sorun Listesi</h2>
      {issuesLoading ? (
        <div className='spinner-border m-4' role='status'>
          <span className='visually-hidden'>Yükleniyor...</span>
        </div>
      ) : error ? (
        <p className='alert alert-danger'>{error}</p>
      ) : (
        <>
          <div className='row'>
            <div className='col-sm-3'>
              {renderFilterRadioButtons(
                'Durum',
                [
                  { label: 'Tümü', value: 'all' },
                  { label: 'Çözüldü', value: 'solved' },
                  { label: 'Çözülemedi', value: 'unsolved' },
                  { label: 'Beklemede', value: 'pending' },
                ],
                statusFilter,
                setStatusFilter
              )}
            </div>
            <div className='col-sm-3'>
              {renderFilterRadioButtons(
                'Kod',
                [
                  { label: 'Tümü', value: 'all' },
                  { label: 'Kırmızı', value: 'red' },
                  { label: 'Yeşil', value: 'green' },
                  { label: 'Mavi', value: 'blue' },
                ],
                codeFilter,
                setCodeFilter
              )}
            </div>
            <div className='col-sm-3'>
              {renderFilterRadioButtons(
                'Mahalle',
                [
                  { label: 'Tümü', value: 'all' },
                  { label: 'Mahalle A', value: 'a' },
                  { label: 'Mahalle B', value: 'b' },
                  { label: 'Mahalle C', value: 'c' },
                ],

                neighborhoodFilter,
                setNeighborhoodFilter
              )}
            </div>
          </div>

          <table className='table table-hover table-striped'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Kullanıcı ID</th>
                <th>Başlık</th>
                <th>Açıklama</th>
                <th>Resim</th>
                <th>Adres</th>
                <th>Kod</th>
                <th>Durum</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {filteredIssues.map((issue) => (
                <tr key={issue._id}>
                  <td
                    onClick={() => handleIssueClick(issue)}
                    style={{ cursor: 'pointer' }}
                  >
                    {issue._id}
                  </td>
                  <td
                    onClick={() => handleUserClick(issue.user)}
                    style={{ cursor: 'pointer' }}
                  >
                    {issue.user}
                  </td>
                  <td>{issue.title}</td>
                  <td>{issue.description}</td>
                  <td
                    onClick={() => handleIssueClick(issue)}
                    style={{ cursor: 'pointer' }}
                  >
                    {issue.image && (
                      <img
                        src={issue.image}
                        alt='issue'
                        style={{ width: '50px', height: '50px' }}
                      />
                    )}
                  </td>
                  <td>{issue.address}</td>
                  <td>
                    {issue.code === 'green'
                      ? 'Yeşil'
                      : issue.code === 'blue'
                      ? 'Mavi'
                      : issue.code === 'red'
                      ? 'Kırmızı'
                      : '-'}
                  </td>
                  <td>{getIssueStatusText(issue.status)}</td>
                  <td>{new Date(issue.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {selectedUserId && (
        <UserDetailsModal
          userId={selectedUserId}
          onClose={() => setSelectedUserId(null)}
        />
      )}

      {selectedIssue && (
        <IssueDetailsModal
          issue={selectedIssue}
          user={selectedUser}
          isOpen={isIssueModalOpen}
          onClose={() => setIsIssueModalOpen(false)}
        />
      )}
    </div>
  );
};

export default IssuesPage;
