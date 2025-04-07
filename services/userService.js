import supabase from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const createUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  const { data, error } = await supabase
    .from('users')
    .insert([{
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      address: userData.address
    }])
    .select();

  if (error) throw error;
  return data[0];
};

export const authenticateUser = async (email, password) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) throw new Error('Invalid credentials');
  
  const isValid = await bcrypt.compare(password, data.password);
  if (!isValid) throw new Error('Invalid credentials');

  // Update last login
  await supabase
    .from('users')
    .update({ last_login: new Date() })
    .eq('id', data.id);

  return {
    token: jwt.sign({ userId: data.id }, process.env.JWT_SECRET, { expiresIn: '24h' }),
    userId: data.id
  };
};