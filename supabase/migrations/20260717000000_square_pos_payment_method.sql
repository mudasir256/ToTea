-- Add Square Point of Sale as a payment method
ALTER TYPE public.payment_method ADD VALUE IF NOT EXISTS 'square_pos';
