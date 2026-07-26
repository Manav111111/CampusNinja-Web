import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      product_id,
      user_id,
      customer_name,
      customer_phone,
      customer_email,
      requirement,
      college_name,
      address,
      file_url,
      instructions,
    } = body;

    // ── Validate required fields ──────────────────────────────────
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing Razorpay payment details' },
        { status: 400 }
      );
    }

    if (!product_id || !customer_name || !customer_phone || !customer_email) {
      return NextResponse.json(
        { error: 'Missing required order details' },
        { status: 400 }
      );
    }

    // ── Prevent duplicate orders ──────────────────────────────────
    const { data: existingOrder } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json(
        { error: 'Payment already processed', order_id: existingOrder.id },
        { status: 409 }
      );
    }

    // ── Verify Razorpay signature ─────────────────────────────────
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      console.error('RAZORPAY_KEY_SECRET is not set');
      return NextResponse.json(
        { error: 'Payment verification configuration error' },
        { status: 500 }
      );
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Razorpay signature mismatch', {
        razorpay_order_id,
        razorpay_payment_id,
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { error: 'Payment verification failed. Invalid signature.' },
        { status: 400 }
      );
    }

    // ── Signature verified — create the order ─────────────────────
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([{
        product_id,
        user_id: user_id || null,
        customer_name,
        customer_phone,
        customer_email,
        requirement: requirement || null,
        college_name: college_name || null,
        address: address || null,
        payment_method: 'online',
        payment_status: 'paid',
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        transaction_time: new Date().toISOString(),
        file_url: file_url || null,
        instructions: instructions || null,
        status: 'pending',
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Failed to create order after payment verification:', orderError);
      return NextResponse.json(
        { error: 'Order creation failed after successful payment. Contact support with payment ID: ' + razorpay_payment_id },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      payment_id: razorpay_payment_id,
      message: 'Payment verified and order created successfully',
    });
  } catch (error: unknown) {
    console.error('Razorpay verify-payment error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
