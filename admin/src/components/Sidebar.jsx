import { Link, useLocation } from 'react-router-dom';
import '../App.css';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation(); // Aktif konumu almak için
  const { signOut } = useAuth();

  const handleSignOut = () => {
    if (window.confirm('Çıkış yapmak istediğinize emin misin?')) {
      signOut();
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div
      className='d-flex flex-column flex-shrink-0 p-3 bg-dark shadow'
      style={{ width: '280px' }}
    >
      <div className='sidebar-header'>
        <img src='/logo.png' alt='Logo' className='img-fluid' />
        <h2 className='text-light fs-5'>mobil</h2>
        <h3 className='text-secondary fs-4'>Yönetici Paneli</h3>
      </div>

      <div className='d-flex flex-column'>
        <Link
          to='/overview'
          className='btn btn-primary nav-item m-2'
          style={{ background: isActive('/overview') ? '#0d6efd' : '#6c757d' }}
        >
          Genel Bakış
        </Link>
        <Link
          to='/issues'
          className='btn btn-primary nav-item m-2'
          style={{ background: isActive('/issues') ? '#0d6efd' : '#6c757d' }}
        >
          Sorunlar
        </Link>
        <Link
          to='/users'
          className='btn btn-primary nav-item m-2'
          style={{ background: isActive('/users') ? '#0d6efd' : '#6c757d' }}
        >
          Kullanıcılar
        </Link>
      </div>

      <div className='text-center mt-5'>
        <button onClick={handleSignOut} className='btn btn-danger w-50 py-2'>
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
