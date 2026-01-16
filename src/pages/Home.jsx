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
            {/* Elegant Separator - More Visible */}
            <div className="w-full h-16 bg-omg-cream flex items-center justify-center">
                <div className="w-1/2 h-[2px] bg-omg-gold/50"></div>
            </div>
            <OwnerRegistry />
            <ContactSection />
            <Footer />
        </Layout>
    );
};

export default Home;
