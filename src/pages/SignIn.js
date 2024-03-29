import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'
import OAuth from '../components/OAuth'
import { toastifyError, toastifySuccess } from '../toastify'
import axios from 'axios'


function SignIn() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();
  const onChangeHamdler = function (e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }


  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      // const userCred=await signInWithEmailAndPassword(auth,formData.email,formData.password)
      // // console.log(userCred);
      // const user=auth.currentUser;
      // console.log(user);
      const response = await axios.post('https://house-market-place-backend.onrender.com/api/user/signin', formData);
      if (response.status == 200) {
        const token = response.data.token;
        localStorage.setItem('jwtToken', token);
        toastifySuccess('Succesfully Singed In.')
        navigate('/profile');
      }
    }
    catch (err) {
      toastifyError("Fraud!!!! Bad User Credentials !!!")
      console.error(err.message);
    }
  }

  return (
    <>
      <div className='pageContainer'>
        <header>
          <p className='pageHeader'>
            Welcome Back!!!
          </p>
        </header>
        <form onSubmit={onSubmitHandler}>
          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChangeHamdler}
          />
          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChangeHamdler}
            />
            <img src={visibilityIcon} alt='show password' className='showPassword'
              onClick={() => { setShowPassword((prevState) => !prevState) }} />
          </div>

          {/* <Link to='/forgetpassword' className='forgotPasswordLink'>Forget Password</Link> */}
          <div className='signInBar'>
            <p className='signInText'>
              Sign In
            </p>
            <button className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
        <Link to='/sign-up' className='registerLink'>
          Sign Up Instead
        </Link>

      </div>
    </>
  )
}

export default SignIn