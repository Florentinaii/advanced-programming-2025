import express from 'express';
import bodyParser from 'body-parser';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config(); // Ngarko variablat nga .env

const app = express();
const PORT = 3000;

// --- Konfigurimi i Supabase duke përdorur Çelësin Service Role ---
const supabaseUrl = process.env.SUPABASE_URL;
// Lexo çelësin SERVICE ROLE nga .env
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Kontroll i rëndësishëm për kredencialet
if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
        "Gabim Kritik: Kredencialet e Supabase (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) nuk janë vendosur në .env. " +
        "Sigurohu që po përdor çelësin SERVICE ROLE."
        );
    process.exit(1); // Ndalo aplikacionin
}

// Krijo klientin Supabase me çelësin service_role
// Ky klient do të anashkalojë politikat e Row Level Security (RLS)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        // Këto janë opsione të rekomanduara për përdorim backend:
        autoRefreshToken: false, // Nuk ka nevojë për refresh token në backend
        persistSession: false    // Nuk ka nevojë të ruhet sesioni në backend
    }
});

console.log("Klienti Supabase u inicializua me sukses duke përdorur çelësin service_role.");
// ------------------------------------------------------------

// Middleware
app.use(bodyParser.json());

// --- Endpoint-et (Mbeten të njëjta në logjikë, por tani përdorin klientin me service_role) ---

// GET të gjitha produktet
app.get('/products', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('Gabim në Supabase (GET /products):', error);
            return res.status(500).json({ message: 'Gabim gjatë marrjes së produkteve', error: error.message });
        }
        res.json(data || []);
    } catch (err) {
        console.error('Gabim i papritur (GET /products):', err);
        res.status(500).json({ message: 'Gabim i brendshëm i serverit' });
    }
});

// GET produkt sipas ID
app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            if (error.code === 'PGRST116') { // Kjo ende mund të ndodhë nëse ID nuk ekziston
                 return res.status(404).json({ message: 'Produkti nuk u gjet' });
            }
            console.error(`Gabim në Supabase (GET /products/${id}):`, error);
            return res.status(500).json({ message: 'Gabim gjatë marrjes së produktit', error: error.message });
        }
        // Edhe pse .single() kthen gabim për 0 rezultate, shtojmë kontroll shtesë
        if (!product) {
             return res.status(404).json({ message: 'Produkti nuk u gjet' });
        }
        res.json(product);

    } catch (err) {
        console.error(`Gabim i papritur (GET /products/${id}):`, err);
        res.status(500).json({ message: 'Gabim i brendshëm i serverit' });
    }
});

// POST krijo produkt të ri
app.post('/products', async (req, res) => {
    const productData = req.body;
    // Validimet mund të shtohen këtu

    try {
        // Me service_role, ky insert do të anashkalojë çdo politikë RLS që mund të kesh vendosur
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert([productData])
            .select()
            .single();

        // Gabimet RLS nuk do të ndodhin, por gabime të tjera (p.sh., NOT NULL violation) mund të ndodhin
        if (error) {
            console.error('Gabim në Supabase (POST /products):', error);
            // Kthe kodin 400 (Bad Request) nëse gabimi lidhet me të dhënat hyrëse
            if (error.code && (error.code.startsWith('23') || error.code.startsWith('22'))) { // PostgreSQL constraint violation codes
                 return res.status(400).json({ message: 'Të dhëna hyrëse jo të vlefshme ose shkelje e kufizimeve', details: error.message });
            }
            return res.status(500).json({ message: 'Gabim gjatë krijimit të produktit', error: error.message });
        }

        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Gabim i papritur (POST /products):', err);
        res.status(500).json({ message: 'Gabim i brendshëm i serverit' });
    }
});

// DELETE produkt
app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Ky fshirje do të anashkalojë politikat RLS
        const { error, count } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Gabim në Supabase (DELETE /products/${id}):`, error);
            return res.status(500).json({ message: 'Gabim gjatë fshirjes së produktit', error: error.message });
        }

        // Mund të kontrollosh 'count' nëse dëshiron të dish nëse diçka u fshi realisht
        // console.log(`Numri i rreshtave të fshirë: ${count}`);
        // if (count === 0) {
        //     return res.status(404).json({ message: 'Produkti nuk u gjet për fshirje' });
        // }

        res.status(204).send(); // Sukses, pa përmbajtje
    } catch (err) {
        console.error(`Gabim i papritur (DELETE /products/${id}):`, err);
        res.status(500).json({ message: 'Gabim i brendshëm i serverit' });
    }
});

// PATCH produkt (Përditësim)
app.patch('/products/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    delete updates.id;
    delete updates.createdAt; // Nuk duhet lejuar përditësimi manual i këtyre

    try {
        // Ky përditësim do të anashkalojë politikat RLS
        const { data: updatedProduct, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
             if (error.code === 'PGRST116') { // Ende ndodh nëse ID nuk gjendet
                 return res.status(404).json({ message: 'Produkti nuk u gjet për përditësim' });
             }
            console.error(`Gabim në Supabase (PATCH /products/${id}):`, error);
             // Kontrollo për gabime të dhënash
             if (error.code && (error.code.startsWith('23') || error.code.startsWith('22'))) {
                 return res.status(400).json({ message: 'Të dhëna hyrëse jo të vlefshme ose shkelje e kufizimeve', details: error.message });
             }
            return res.status(500).json({ message: 'Gabim gjatë përditësimit të produktit', error: error.message });
        }

        if (!updatedProduct) { // Siguri shtesë
             return res.status(404).json({ message: 'Produkti nuk u gjet për përditësim' });
        }

        res.json(updatedProduct);
    } catch (err) {
        console.error(`Gabim i papritur (PATCH /products/${id}):`, err);
        res.status(500).json({ message: 'Gabim i brendshëm i serverit' });
    }
});

// Nis serverin
app.listen(PORT, () => {
    console.log(`Serveri është duke u drejtuar në http://localhost:${PORT}`);
    console.log(`Lidhur me Supabase URL: ${supabaseUrl}`);
});

export default app;