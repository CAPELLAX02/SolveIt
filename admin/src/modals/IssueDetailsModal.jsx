import { useState } from 'react';
import axios from 'axios';
import SendFeedbackModal from './SendFeedbackModal';

const IssueDetailsModal = ({ isOpen, onClose, issue, user }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const toggleFeedbackModal = () => {
    setShowFeedbackModal(!showFeedbackModal);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
  };

  if (!isOpen || !issue) {
    return null;
  }

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

  const handleDeleteIssue = async () => {
    if (
      window.confirm(
        'Bu sorunu kalıcı olarak silmek istediğinizden emin misiniz?'
      )
    ) {
      try {
        await axios.delete(
          `https://bbb-mobil-backend.onrender.com/api/admin/issues/${issue._id}`,
          {
            withCredentials: true,
          }
        );
        alert(`Sorun (${issue._id}) kalıcı olarak silindi.`);
        onClose(); // Close the modal and refresh the issues list
      } catch (error) {
        console.error('Error deleting issue:', error);
      }
    }
  };

  const handleBanUser = async () => {
    if (
      window.confirm(
        'Bu kullanıcıyı sunucudan yasaklamak istediğinize emin misiniz?'
      )
    ) {
      try {
        await axios.put(
          `https://bbb-mobil-backend.onrender.com/api/admin/users/${issue.user}/ban`,
          {},
          {
            withCredentials: true,
          }
        );
        alert('Kullanıcı sunucudan yasaklandı.');
        onClose(); // Close the modal and refresh the users list
      } catch (error) {
        console.error('Error banning user:', error);
      }
    }
  };

  const handleUnbanUser = async () => {
    if (
      window.confirm(
        'Bu kullanıcının sunucudaki yasağını kaldırmak istediğinize emin misiniz?'
      )
    ) {
      try {
        await axios.put(
          `https://bbb-mobil-backend.onrender.com/api/admin/users/${issue.user}/unban`,
          {},
          {
            withCredentials: true,
          }
        );
        alert('Kullanıcının sunucudaki yasağı kaldırıldı.');
        onClose(); // Close the modal and refresh the users list
      } catch (error) {
        console.error('Error unbanning user:', error);
      }
    }
  };

  return (
    <>
      <div
        className={`modal ${isOpen ? 'show' : ''}`}
        style={{
          display: isOpen ? 'block' : 'none',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <div className='modal-dialog modal-lg shadow-lg'>
          <div className='modal-content'>
            <div className='modal-header d-flex justify-content-between'>
              <h4 className='modal-title fw-semibold'>
                Sorun Detayları ({issue._id})
              </h4>
              <button className='btn btn-dark fw-medium' onClick={onClose}>
                Kapat
              </button>
            </div>
            <div className='modal-body'>
              <div className='d-flex justify-content-start align-items-start'>
                <img
                  src={issue.image}
                  alt='Issue'
                  className='img-fluid m-2 rounded-2 shadow-sm'
                  style={{ maxWidth: '300px' }}
                />
                <div className='list-group mt-2 flex-grow-1 shadow-sm'>
                  <div
                    className='list-group-item list-group-item-success btn btn-success shadow-sm rounded-top-2 rounded-bottom-0 fw-medium'
                    onClick={toggleFeedbackModal}
                  >
                    Geri Bildirim Gönder
                  </div>
                  <div className='list-group-item'>
                    <b>ID:</b> {issue._id}
                  </div>
                  <div className='list-group-item'>
                    <b>Başlık:</b> {issue.title}
                  </div>
                  <div className='list-group-item'>
                    <b>Kod:</b> {issue.code}
                  </div>
                  <div className='list-group-item'>
                    <b>Adres:</b> {issue.address}
                  </div>
                  <div className='list-group-item'>
                    <b>Durum:</b> {getIssueStatusText(issue.status)}
                  </div>
                  <div
                    className='list-group-item list-group-item-danger btn btn-danger shadow-sm rounded-top-0 rounded-bottom-2 fw-medium'
                    onClick={handleDeleteIssue}
                  >
                    Sorunu Sil
                  </div>
                </div>
              </div>

              <div className='d-flex justify-content-end align-items-end'>
                <div className='list-group mt-2 flex-grow-1 shadow-sm'>
                  <h5 className='p-2 fw-semibold'>
                    Sorunu Bildiren Kullanıcının Bilgileri
                  </h5>
                  <div className='list-group-item'>
                    <b>ID:</b> {user._id}
                  </div>
                  <div className='list-group-item'>
                    <b>İsim:</b> {user.name}
                  </div>
                  <div className='list-group-item'>
                    <b>Soyisim:</b> {user.surname}
                  </div>
                  <div className='list-group-item'>
                    <b>Email:</b> {user.email}
                  </div>
                  <div className='list-group-item'>
                    <b>Telefon:</b> {user.phone}
                  </div>
                  <div className='list-group-item'>
                    <b>Yasaklı:</b> {user.isBanned ? 'Evet' : 'Hayır'}
                  </div>
                </div>
              </div>
            </div>
            <div className='modal-footer d-flex flex-row justify-content-between'>
              <div className='m-1'>
                <button
                  className='btn btn-danger shadow-sm fw-medium m-2'
                  onClick={handleBanUser}
                  disabled={user.isBanned}
                >
                  Kullanıcıyı Yasakla
                </button>
                <button
                  className='btn btn-info shadow-sm fw-medium m-2'
                  onClick={handleUnbanUser}
                  disabled={!user.isBanned}
                >
                  Kullanıcının Yasağını Kaldır
                </button>
              </div>
              <button
                className='btn btn-dark shadow-sm fw-medium'
                onClick={onClose}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      </div>

      {showFeedbackModal && (
        <SendFeedbackModal
          isOpen={showFeedbackModal}
          onRequestClose={closeFeedbackModal} // Feedback modal'ı kapat
          issueId={issue._id}
        />
      )}
    </>
  );
};

export default IssueDetailsModal;
