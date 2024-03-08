import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signIn(email, password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Kullanıcı adı veya şifre hatalı.');
    }
  };

  return (
    <div className='container d-flex justify-content-center align-items-center mt-5'>
      <div
        className='card shadow-lg p-3 mb-5 bg-white rounded border-0'
        style={{ width: '420px' }}
      >
        <img
          src='/logo2.png'
          alt='Logo'
          className='img-fluid w-25 mt-4 mb-2 align-self-center'
        />
        <div className='card-body'>
          <h5 className='card-title text-center mb-4 fw-medium'>
            Yönetici Girişi
          </h5>

          {error && (
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <div className='form-floating mb-3'>
              <input
                type='email'
                className='form-control shadow border-0'
                id='floatingInput'
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor='floatingInput'>Email adresi</label>
            </div>
            <div className='form-floating'>
              <input
                type='password'
                className='form-control shadow border-0'
                id='floatingPassword'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor='floatingPassword'>Şifre</label>
            </div>

            <button
              type='submit'
              className='btn btn-primary shadow w-100 mt-4 p-2 fw-medium border-0'
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
