import React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { collection, getDocs, query, where, orderBy, limit, startAfter, getDoc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { toastifyError, toastifySuccess } from '../toastify'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import axios from 'axios'




function Offers() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastFetchedListing, setLastFetchedListing] = useState(null);
    const params = useParams();
    useEffect(() => {
        const fetchListings = async () => {
            try {
                const response = await axios.get('https://house-market-place-backend.onrender.com/api/offer-listings');
                console.log(response.data);
                setListings(response.data);
                setLoading(false);
            }
            catch (err) {
                toastifyError("OOPS!!!");
                console.log(err);
            }
        }
        fetchListings();
    }, [])


    // Load more
    const onFetchMoreListings = async () => {
        try {
            // listing reference
            const listingsRef = collection(db, 'listings');
            // generating query

            const q = await query(listingsRef, where('offer', '==', true),
                orderBy('timestamp', 'desc'), startAfter(lastFetchedListing),
                limit(10))

            // execute query
            const querySnap = await getDocs(q);
            const lastVisible = querySnap.docs[querySnap.docs.length - 1]
            setLastFetchedListing(lastVisible)
            // console.log(querySnap);
            let listingsTemp = [];
            querySnap.forEach((doc) => {
                // console.log(doc.data());
                return listingsTemp.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            setListings((prevState) => { return [...prevState, ...listingsTemp] });
            setLoading(false);
            console.log(listings)
        }
        catch (err) {
            toastifyError("OOPS!!!");
            console.log(err);
        }
    }





    return (
        <div className='category'>
            <header className=''>
                <p className='pageHeader'>
                    Offers
                </p>
                {loading ?
                    <Spinner /> :
                    listings && listings.length > 0 ?

                        (<>
                            {console.log("Inside main", listings)}
                            <main>
                                <ul className='categoryListings'>
                                    {listings.map((listing) => (
                                        <ListingItem listing={listing} id={listing._id} key={listing._id} />
                                    ))}
                                </ul>
                            </main>
                            {lastFetchedListing && (<p className='loadMore' onClick={onFetchMoreListings}> Load More </p>)}
                        </>) :
                        <p>There are no current offers</p>}
            </header>
        </div>
    )
}
export default Offers