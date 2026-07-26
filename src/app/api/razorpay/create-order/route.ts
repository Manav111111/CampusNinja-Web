import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using service role (not exposed to browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id } = body;

    // Validate input
    if (!product_id || typeof product_id !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid product_id' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(product_id)) {
      return NextResponse.json(
        { error: 'Invalid product_id format' },
        { status: 400 }
      );
    }

    // Fetch product from database to validate price (never trust frontend price)
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, title, price, payment_methods, is_active')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      console.error('Product lookup failed:', productError);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (product.is_active === false) {
      return NextResponse.json(
        { error: 'Product is no longer available' },
        { status: 400 }
      );
    }

    // Verify that online payment is enabled for this product
    const paymentMethods: string[] = product.payment_methods || ['cod', 'online'];
    if (!paymentMethods.includes('online')) {
      return NextResponse.json(
        { error: 'Online payment is not enabled for this product' },
        { status: 400 }
      );
    }

    const priceInPaise = Math.round(Number(product.price) * 100);
    if (isNaN(priceInPaise) || priceInPaise <= 0) {
      return NextResponse.json(
        { error: 'Invalid product price' },
        { status: 400 }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: priceInPaise,
      currency: 'INR',
      receipt: `order_${product_id}_${Date.now()}`,
      notes: {
        product_id: product_id,
        product_title: product.title || '',
      },
    });

    return NextResponse.json({
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    });
  } catch (error: unknown) {
    console.error('Razorpay create-order error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
