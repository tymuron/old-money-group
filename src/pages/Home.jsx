import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookingWidget from '../components/Booking/BookingWidget';
import OwnerRegistry from '../components/Booking/OwnerRegistry';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Layout from '../components/Layout';

const Home = () => {
    return (
        <Layout>
            <Navbar />
            <Hero />
            <BookingWidget />
            {/* Elegant Separator */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-omg-gold/30 to-transparent"></div>
            <OwnerRegistry />
            <ContactSection />
            <Footer />
        </Layout>
    );
};

export default Home;
