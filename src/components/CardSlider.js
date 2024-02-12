import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { collection, doc, docs, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import 'swiper/css';
import Spinner from './Spinner';
import { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './CardSlider.css';
import axios from 'axios';


function CardSlider() {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3, // Show 3 cards by default
        slidesToScroll: 1,
        // centerMode: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2, // Show 2 cards in medium screens
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1, // Show 1 card in small screens
                },
            },
        ],
        centerPadding: '75px',
        // useCSS: true,
        // className: 'card-container',
    };
    const [loading, setLoading] = useState(true)
    const [listings, setListings] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchListings = async () => {
            const response = await axios.get('https://house-market-place-backend.onrender.com/api/latest-listings');
            setListings(response.data);
            console.log("Listings :", listings);
            setLoading(false);
        }
        fetchListings();
        setLoading(false);

    }, [])
    if (loading) return <Spinner />
    if (listings) {

        return (
            <Slider {...sliderSettings}>
                {listings.map((item) => (
                    <Link to={`/category/${item.type}/${item._id}`} className='categoryListingLink'>
                        <div key={item._id} className="card-container">
                            <div className="card">
                                {/* Your card content goes here */}
                                <img src={item.imageUrls[0]} alt={item.name} />
                                <h3>For {item.type} | {item.name}</h3>
                                <p>{item.regularPrice}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </Slider>
        )
    }
    return (
        <div>Slider</div>
    )
}

export default CardSlider;