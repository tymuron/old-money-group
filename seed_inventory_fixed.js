
const { createClient } = require('@supabase/supabase-js');

// Helper to allow async/await in top level
(async () => {
    const supabaseUrl = 'https://hgvgnyupfwlzahfifimr.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhndmdueXVwZndsemFoZmlmaW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMzcwNTYsImV4cCI6MjA4MzkxMzA1Nn0.hvz2ER2wo0m5QAtVdAsVMAr4tNcbLyGgYku6PvaP5ZY';

    const supabase = createClient(supabaseUrl, supabaseKey);

    const REAL_FLEET = [
        // ICONS (1960-1989)
        {
            name: 'Mercedes-Benz 280SL Pagoda',
            year: 1969,
            era: 'icons',
            daily_rate: 450,
            status: 'available',
            tagline: 'The Riviera Cruiser',
            specs: '2.8L Inline-6 • Automatic • Convertible',
            image_url: 'https://images.unsplash.com/photo-1696515239105-0f531952e803?q=80&w=2000&auto=format&fit=crop'
        },
        {
            name: 'Porsche 911 Turbo (930)',
            year: 1988,
            era: 'icons',
            daily_rate: 600,
            status: 'available',
            tagline: 'The Widowmaker',
            specs: '3.3L Turbo Flat-6 • Manual • Coupe',
            image_url: 'https://images.unsplash.com/photo-1611657365985-927ae453dc67?q=80&w=2000&auto=format&fit=crop'
        },
        // YOUNGTIMERS (1990-2012)
        {
            name: 'Maserati Quattroporte V',
            year: 2011,
            era: 'youngtimers',
            daily_rate: 350,
            status: 'available',
            tagline: 'The Italian Minister’s Choice',
            specs: '4.7L V8 • Automatic • Sedan',
            image_url: 'https://images.unsplash.com/photo-1629853926618-502a5c3732fa?q=80&w=2000&auto=format&fit=crop'
        },
        {
            name: 'Bentley Arnage T',
            year: 2004,
            era: 'youngtimers',
            daily_rate: 550,
            status: 'reserved',
            tagline: 'The Last True Bentley',
            specs: '6.75L Twin-Turbo V8 • Automatic • Sedan',
            image_url: 'https://images.unsplash.com/photo-1631557975855-325ee1909a36?q=80&w=2000&auto=format&fit=crop'
        }
    ];

    console.log('🚗 Inserting Real Fleet...');

    // Attempt delete (might fail with anon key depending on RLS, ignoring error)
    // await supabase.from('cars').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (const car of REAL_FLEET) {
        const { data, error } = await supabase
            .from('cars')
            .insert([car])
            .select();

        if (error) {
            console.error(`❌ Failed to insert ${car.name}:`, error.message);
        } else {
            console.log(`✅ Added: ${car.name} (${car.era})`);
        }
    }

    console.log('✨ Seed Complete.');
})();
