import { supabase } from '../lib/supabaseClient';

/**
 * Service Layer for Supabase Interactions
 * All database logic should reside here, isolating components from Supabase dependencies.
 */

// Private helper to send email notification via FormSubmit.co
const _sendEmail = async (subject, data) => {
    console.log(`Attempting to send email: ${subject} to oldmoneygroupltd@gmail.com`);
    try {
        const response = await fetch('https://formsubmit.co/ajax/oldmoneygroupltd@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                _subject: `OM Group: ${subject}`,
                _template: 'table',
                _captcha: 'false',
                email: data.email || data.client_email || 'noreply@oldmoney.group', // Important for Reply-To
                ...data
            })
        });

        if (response.ok) {
            console.log('Email sent successfully!');
            // alert('System: Notification sent to admin email.'); // Optional: Uncomment if user wants confirmation
        } else {
            const errText = await response.text();
            console.error('Email service error:', errText);
            alert(`Email Notification Failed: Channel verification required. Check console.`);
        }
    } catch (e) {
        console.error("Email network error:", e);
        alert("Email Notification Network Error. Please check your internet connection or ad-blocker.");
    }
};

export const api = {
    // --- AUTH ---
    login: async (email, password) => {
        return await supabase.auth.signInWithPassword({ email, password });
    },
    logout: async () => {
        return await supabase.auth.signOut();
    },
    getUser: async () => {
        const { data } = await supabase.auth.getUser();
        return data.user;
    },

    // --- FLEET (PUBLIC) ---
    fetchFleet: async () => {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('year', { ascending: false }); // Youngest cars first within eras

        if (error) throw error;
        return data;
    },

    // --- FLEET (ADMIN) ---
    fetchAdminFleet: async () => {
        const { data, error } = await supabase
            .from('cars')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    createCar: async (carData, imageFile) => {
        let imageUrl = carData.image_url;

        // 1. Upload Image if provided
        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('car-images')
                .upload(fileName, imageFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('car-images')
                .getPublicUrl(fileName);

            imageUrl = publicUrl;
        }

        // 2. Insert Record
        const { data, error } = await supabase
            .from('cars')
            .insert([{ ...carData, image_url: imageUrl }])
            .select();

        if (error) throw error;
        return data[0];
    },

    updateCar: async (id, updates) => {
        const { data, error } = await supabase
            .from('cars')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    deleteCar: async (id) => {
        const { error } = await supabase
            .from('cars')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // --- BOOKING REQUESTS (CONCIERGE) ---
    submitBookingRequest: async (requestData) => {
        // 1. Save to Database
        const { error } = await supabase
            .from('booking_requests')
            .insert([requestData]);

        if (error) throw error;

        // 2. Send Email Notification
        await _sendEmail('New Booking Request', requestData);

        return true;
    },

    fetchBookingRequests: async (status = 'pending') => {
        const { data, error } = await supabase
            .from('booking_requests')
            .select(`
                *,
                cars (name, year)
            `)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    updateBookingStatus: async (id, status) => {
        const { data, error } = await supabase
            .from('booking_requests')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    // --- OWNER REGISTRY (LEAD GEN) ---
    submitRegistryForm: async (submissionData) => {
        // 1. Save to Database
        const { error } = await supabase
            .from('registry_submissions')
            .insert([submissionData]);

        if (error) throw error;

        // 2. Send Email Notification
        await _sendEmail('New Registry Asset', submissionData);

        return true;
    },

    fetchRegistrySubmissions: async (status = 'new') => {
        const { data, error } = await supabase
            .from('registry_submissions')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    updateRegistryStatus: async (id, status) => {
        const { data, error } = await supabase
            .from('registry_submissions')
            .update({ status })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    // --- CONTACT FORM ---
    submitContactMessage: async (messageData) => {
        // 1. Save to Database
        const { error } = await supabase
            .from('contact_messages')
            .insert([messageData]);

        if (error) throw error;

        // 2. Send Email Notification
        await _sendEmail('New Contact Message', messageData);

        return true;
    }
};
