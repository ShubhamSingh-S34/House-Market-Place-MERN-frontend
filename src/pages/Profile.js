import React, { useEffect, useState } from 'react'
import { getAuth, updateProfile } from 'firebase/auth'
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { doc, updateDoc, collection, getDocs, where, orderBy, deleteDoc, query } from 'firebase/firestore';
import { toastifyError, toastifySuccess } from '../toastify';
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';
import axios from 'axios';
// import jwt from 'jsonwebtoken';

function Profile() {
  const auth = getAuth();
  const [listings, setListings] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userRef, setUserRef] = useState('');
  const [loading, setLoading] = useState(true);
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    userRef: '',
  });


  const navigate = useNavigate()
  const logout = () => {
    // auth.signOut();
    localStorage.removeItem('jwtToken');
    navigate('/');
  }

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        console.log('Inside FetchUserListing Function ');
        const response = await axios.get('https://house-market-place-backend.onrender.com/api/listings');
        setListings(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.log('Error inside fetchUserListing function !!! : ', error);
      }

    }
    const getDetailsFromToken = async () => {
      const token = localStorage.getItem('jwtToken');
      const JWT_SECRET = 'This is a secret.';
      try {
        if (token) {
          // Verify the JWT token
          // const decodedToken = jwt.verify(token, JWT_SECRET);
          // Access specific data from the payload
          // userRef = decodedToken.userRef;
          // Perform additional checks or actions if needed
        }
      } catch (error) {
        // Handle token verification error
        console.error('Error decoding JWT token:', error.message);
        navigate('/sign-in');
      }
      const response = await axios.post('https://house-market-place-backend.onrender.com/api/user/getdetails', userRef);
      if (response.status == 200) {
        name = response.data.name;
        email = response.data.email;
        userRef = response.data.userRef;
        fetchUserListings();
      }
      else {
        navigate('sign-in');
      }
    }
    const getUserDetails = async () => {
      const token = localStorage.getItem('jwtToken')
      console.log("This is the token : ", token);
      const response = await axios.post('https://house-market-place-backend.onrender.com/api/user/getdetails', { token });
      console.log('response : ', response);
      if (response.status != 200) {
        navigate('/sign-in');
      }
      setListings(response.data.listings);
      setName(response.data.name);
      setEmail(response.data.email);
      setUserRef(response.data.userRef);
      setLoading(false);
      console.log(response.data);
    }
    getUserDetails();

  }, [])

  const changeDetailsHandler = () => {
    if (changeDetails) {
      onSubmitHandler();
    }
    setChangeDetails((prevState) => (!prevState))
  }
  const onSubmitHandler = async () => {
    try {
      if (auth.currentUser.displayName != name) {
        // update display name in authentication
        updateProfile(auth.currentUser, {
          displayName: name
        })

        // update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name: name
        })

      }
    } catch (error) {
      console.log(error);
      toastifyError("Could not update profile details")
    }
  }

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure you want to delete?')) {
      const response = await axios.delete(`https://house-market-place-backend.onrender.com/api/listings/${listingId}`);
      console.log(response.data);
      const updatedListings = listings.filter(
        (listing) => listing._id !== listingId
      )
      setListings(updatedListings)
      toastifySuccess('Listing Deleted !')
    }
  }
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }


  if (loading) { return <Spinner /> }

  return <div className='profile'>
    <header className='profileHeader'>
      <p className='pageHeader'>My Profile</p>
      <button className='logOut' type='button' onClick={logout}>Logout</button>
    </header>

    <main>
      <div className='profileDetailsHeader'>
        <p className='profileDetailsText'> Personal Details </p>
        <p className='changePersonalDetails' onClick={changeDetailsHandler} >
          {changeDetails ? 'Done' : 'Edit'}
        </p>
      </div>
      <div className='profileCard'>
        <form>
          <input type='text' id='name'
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
          />
          <input type='text' id='email'
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={email}
            onChange={onChange}
          />
        </form>
      </div>
      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt='home' />
        <p>Sell or Rent your home</p>
        <img src={arrowRight} alt='arrow right' />
      </Link>


      {!loading && listings?.length > 0 && (
        <>
          <p className='listingsText'>Your Listings</p>
          <ul>
            {listings.map((listing) => {
              return <ListingItem key={listing._id} listing={listing} id={listing._id} onDelete={() => onDelete(listing._id)} />
            })}
          </ul>
        </>
      )}


    </main>

  </div>
}

export default Profile