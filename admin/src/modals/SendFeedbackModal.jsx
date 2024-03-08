import React, { useState } from 'react';
import axios from 'axios';

const SendFeedbackModal = ({ isOpen, onRequestClose, issueId }) => {
  const [feedbackText, setFeedbackText] = useState('');
  const [image, setImage] = useState(null);

  if (!isOpen) {
    return null;
  }

  const handleSolveIssue = async () => {
    if (window.confirm('Geri bildirim göndermek istediğinize emin misiniz?')) {
      try {
        const formData = new FormData();
        formData.append('text', feedbackText);
        if (image) {
          formData.append('image', image, image.name);
        }
        await axios.post(
          `http://localhost:8000/api/admin/issues/${issueId}/solve`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        alert('Sorun çözüldü olarak işaretlendi.');
        onRequestClose();
      } catch (error) {
        alert(
          'Geri bildirim gönderilirken bir hata meydana geldi: ' + error.message
        );
      }
    }
  };

  const handleUnsolveIssue = async () => {
    if (window.confirm('Geri bildirim göndermek istediğinize emin misiniz?')) {
      try {
        const formData = new FormData();
        formData.append('text', feedbackText);
        if (image) {
          formData.append('image', image, image.name);
        }
        await axios.post(
          `http://localhost:8000/api/admin/issues/${issueId}/unsolve`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          }
        );
        alert('Sorun çözülemedi olarak işaretlendi.');
        onRequestClose();
      } catch (error) {
        alert(
          'Geri bildirim gönderilirken bir hata meydana geldi: ' + error.message
        );
      }
    }
  };

  return (
    <div
      className='modal show'
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header d-flex justify-content-between'>
            <h4 className='modal-title fw-medium'>Geri Bildirim Gönder</h4>
            <button
              type='button'
              className='btn btn-dark shadow-sm'
              onClick={onRequestClose}
            >
              Kapat
            </button>
          </div>
          <div className='modal-body'>
            <form>
              <div className='form-floating mb-3'>
                <textarea
                  className='form-control shadow-sm border-grey border-3'
                  id='feedbackText'
                  placeholder='Geri Bildirim Metni'
                  style={{ height: '100px' }}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                ></textarea>
                <label htmlFor='feedbackText'>Geri Bildirim Metni</label>
              </div>
              <div className='form-group d-flex flex-column ms-2'>
                <label htmlFor='feedbackImage' className='mb-2 fw-medium'>
                  Sorunun çözüldüğüne dair fotoğraf ekle
                </label>
                <input
                  type='file'
                  className='form-control-file'
                  id='feedbackImage'
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </form>
          </div>
          <div className='modal-footer'>
            <button
              type='button'
              className='btn btn-success fw-medium shadow-sm rounded-1 mx-2 my-2 w-100'
              onClick={handleSolveIssue}
            >
              Çözüldüğünü Kullanıcıya Bildir
            </button>
            <button
              type='button'
              className='btn btn-danger fw-medium shadow-sm rounded-1 mx-2 my-1 w-100'
              onClick={handleUnsolveIssue}
            >
              Çözülemediğini Kullanıcıya Bildir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendFeedbackModal;
