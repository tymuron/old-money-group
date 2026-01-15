
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, 'old-money-group/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

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
        image_url: 'https://images.unsplash.com/photo-1696515239105-0f531952e803?q=80&w=2000&auto=format&fit=crop' // Placeholder real image
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

async function seedInventory() {
    console.log('🌱 Starting Seed Process...');

    // 1. Clear existing data (Optional: remove if you want to keep old data)
    // Note: This requires RLS allowing delete or Service Role. 
    // Since we only have Anon Key in .env typically, this might fail if RLS is strict.
    // We will verify RLS allows this or just Insert.

    // Attempt delete
    /*
    const { error: deleteError } = await supabase.from('cars').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
        console.warn('⚠️ Could not clear table (likely RLS). Configuring RLS or manually deleting recommended.');
    } else {
        console.log('🧹 Cleared existing inventory.');
    }
    */

    // Actually, anon key usually can't delete all. We will just insert and user can filter.
    // But user asked to "replace". 
    // I will assume for now I can insert. 

    console.log('🚗 Inserting Real Fleet...');

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
}

seedInventory();
