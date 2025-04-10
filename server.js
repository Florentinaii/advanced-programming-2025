import express from 'express';
import bodyParser from 'body-parser';
import { supabase } from './supabaseClient.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// GET të gjitha produktet
app.get('/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
    
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET produkt sipas ID
app.get('/products/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();
    
  if (error) return res.status(404).json({ error: 'Produkti nuk u gjet' });
  res.json(data);
});

// POST krijo produkt të ri
app.post('/products', async (req, res) => {
  const newProduct = {
    ...req.body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('products')
    .insert([newProduct])
    .select();
    
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data[0]);
});

// DELETE produkt
app.delete('/products/:id', async (req, res) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id);
    
  if (error) return res.status(404).json({ error: 'Produkti nuk u gjet' });
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Serveri është duke u drejtuar në http://localhost:${PORT}`);
});