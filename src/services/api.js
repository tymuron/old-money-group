import { supabase } from '../lib/supabaseClient';

/**
 * Service Layer for Supabase Interactions
 * All database logic should reside here, isolating components from Supabase dependencies.
 */

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
        const { error } = await supabase
            .from('booking_requests')
            .insert([requestData]);

        if (error) throw error;
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
        const { error } = await supabase
            .from('registry_submissions')
            .insert([submissionData]);

        if (error) throw error;
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
        const { error } = await supabase
            .from('contact_messages')
            .insert([messageData]);

        if (error) throw error;
        return true;
    }
};
