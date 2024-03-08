import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../assets/Colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import SignUpModal from './SignUpModal';
import LoginBackground from '../components/LoginBackground';
import ForgotPasswordModal from './ForgotPasswordModal';
import { BASE_ENDPOINT } from '../constants';

const windowWidth = Dimensions.get('window').width;

const SignInModal = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);

  const { signIn } = useContext(AuthContext);

  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleOpenSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const handleCloseSignUpModal = () => {
    setShowSignUpModal(false);
    setEmail('');
    setPassword('');
  };

  const handleSignIn = async () => {
    setLoading(true);

    if (!email || !password) {
      Alert.alert('Giriş Başarısız.', 'Lütfen gerekli alanları doldurun.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_ENDPOINT}/users/auth`, {
        email,
        password,
      });
      const { token } = response.data;
      if (token) {
        signIn(token);
        setEmail('');
        setPassword('');
        setLoading(false);
        Alert.alert('Giriş Başarılı!', 'Hoş Geldiniz!');
      } else {
        console.log('5');
        console.log('Giriş Başarısız.', 'Token Alınamadı.');
        setLoading(false);
      }
      if (error.response) {
        console.log('sunucu yanıtı:', error.response?.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert(
          'Giriş Başarısız.',
          'Lütfen e-posta ve şifrenizi kontrol ediniz.'
        );
      }

      setLoading(false);
    }
  };

  return (
    <LoginBackground>
      <View style={styles.fullContainer}>
        <View style={styles.emptyContainer}></View>

        <View style={styles.signInContainer}>
          <Text style={styles.title}>Hoş Geldiniz.</Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder='E-posta'
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder='Şifreniz'
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!isPasswordVisible}
              />
              <TouchableOpacity
                style={styles.iconWrapper}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <FontAwesome
                  name={isPasswordVisible ? 'eye-slash' : 'eye'}
                  size={22}
                  color={Colors.dark}
                />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <ActivityIndicator
              size={50}
              color={Colors.dark}
              style={{ marginVertical: 10 }}
            />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleSignIn}>
              <MaterialCommunityIcons
                name='login'
                size={26}
                color='#fff'
                style={{ marginRight: 8 }}
              />
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={() => setShowForgotPasswordModal(true)}>
            <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Henüz hesabın yok mu?</Text>
          <TouchableOpacity
            style={styles.button2}
            onPress={handleOpenSignUpModal}
          >
            <FontAwesome5
              name='user-plus'
              size={27}
              color='#333'
              style={{ marginRight: 10 }}
            />
            <Text style={styles.buttonText2}>Hemen Aramıza Katıl!</Text>
          </TouchableOpacity>

          <Modal
            visible={showSignUpModal}
            onRequestClose={handleCloseSignUpModal}
            animationType='slide' // Modal geçişi için animasyon tipi
          >
            <SignUpModal onClose={handleCloseSignUpModal} />
          </Modal>
        </View>

        <ForgotPasswordModal
          visible={showForgotPasswordModal}
          onClose={() => setShowForgotPasswordModal(false)}
        />
      </View>
    </LoginBackground>
  );
};

const sharedShadowStyles = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.23,
  shadowRadius: 2.62,

  elevation: 4,
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    width: '100%',
    minHeight: 700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
  signInContainer: {
    alignItems: 'center',
    flex: 2,
  },
  signupContainer: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: Colors.dark,
    fontFamily: 'pop-sb',
  },
  inputContainer: {
    width: '90%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 8,
    paddingLeft: 12,
    margin: 8,
    fontSize: 14,
    ...sharedShadowStyles,
    fontFamily: 'pop',
    width: windowWidth * 0.85,
  },
  button: {
    backgroundColor: Colors.dark,
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 24,
    margin: 10,
    flexDirection: 'row',
    ...sharedShadowStyles,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'pop-b',
    // paddingLeft: 10,
  },
  forgotPassword: {
    color: '#333',
    alignSelf: 'center',
    fontFamily: 'pop-sb',
    fontSize: 14,
  },
  signupText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'pop-sb',
  },
  button2: {
    backgroundColor: Colors.orange,
    borderRadius: 40,
    paddingVertical: 12,
    paddingHorizontal: 20,
    margin: 10,
    flexDirection: 'row',
    ...sharedShadowStyles,
  },
  buttonText2: {
    color: '#333',
    fontSize: 16,
    fontFamily: 'pop-b',
  },
  iconWrapper: {
    padding: 10,
    position: 'absolute',
    right: 12,
    top: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    position: 'relative',
  },
});

export default SignInModal;
