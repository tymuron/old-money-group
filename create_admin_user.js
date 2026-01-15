
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hgvgnyupfwlzahfifimr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndmdueXVwZndsemFoZmlmaW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMzcwNTYsImV4cCI6MjA4MzkxMzA1Nn0.hvz2ER2wo0m5QAtVdAsVMAr4tNcbLyGgYku6PvaP5ZY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    const email = 'admin@oldmoney.com';
    const password = 'securepassword123';

    console.log(`Attempting to sign up user: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.error('Error creating user:', error.message);
        // If user already exists, try to sign in to confirm credentials work
        if (error.message.includes('already registered')) {
            console.log('User already exists. Trying to sign in...');
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (signInError) {
                console.error('Sign in failed:', signInError.message);
            } else {
                console.log('Sign in successful for existing user.');
            }
        }
    } else {
        console.log('User created successfully:', data.user.email);
    }
}

createAdmin();
