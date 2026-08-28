import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

function getRazorpayClient() {
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials are not configured on the server.');
  }

  return new Razorpay({ key_id, key_secret });
}

export async function POST(request: NextRequest) {
  try {
    const razorpay = getRazorpayClient();
    const body = await request.json();
    const { product_id, amount, cart_items } = body;

    let priceInPaise = 0;
    let receiptPrefix = 'order';
    let productTitle = 'CampusNinja Materials';

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    // 1. Single Product Flow
    if (product_id && typeof product_id === 'string' && uuidRegex.test(product_id)) {
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('id, title, price, payment_methods, is_active')
        .eq('id', product_id)
        .single();

      if (productError || !product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404, headers: corsHeaders }
        );
      }

      if (product.is_active === false) {
        return NextResponse.json(
          { error: 'Product is no longer available' },
          { status: 400, headers: corsHeaders }
        );
      }

      const paymentMethods: string[] = product.payment_methods || ['cod', 'online'];
      if (!paymentMethods.includes('online')) {
        return NextResponse.json(
          { error: 'Online payment is not enabled for this product' },
          { status: 400, headers: corsHeaders }
        );
      }

      priceInPaise = Math.round(Number(product.price) * 100);
      receiptPrefix = `prod_${product_id.substring(0, 8)}`;
      productTitle = product.title || 'CampusNinja Product';
    } 
    // 2. Cart Items Flow
    else if (Array.isArray(cart_items) && cart_items.length > 0) {
      let calculatedTotal = 0;
      for (const item of cart_items) {
        const itemPrice = Number(item.product?.price || item.price || 0);
        const qty = Number(item.quantity || 1);
        calculatedTotal += itemPrice * qty;
      }
      if (amount && Number(amount) > calculatedTotal) {
        calculatedTotal = Number(amount); // include delivery fee if present
      }
      priceInPaise = Math.round(calculatedTotal * 100);
      receiptPrefix = 'cart';
      productTitle = `Cart Checkout (${cart_items.length} items)`;
    } 
    // 3. Direct Amount Flow (e.g. custom services / orders)
    else if (amount && Number(amount) > 0) {
      priceInPaise = Math.round(Number(amount) * 100);
      receiptPrefix = 'custom';
    } 
    else {
      return NextResponse.json(
        { error: 'Missing product_id, cart_items, or valid amount.' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (isNaN(priceInPaise) || priceInPaise <= 0) {
      return NextResponse.json(
        { error: 'Invalid order amount' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: priceInPaise,
      currency: 'INR',
      receipt: `${receiptPrefix}_${Date.now()}`,
      notes: {
        product_id: product_id || 'multi',
        product_title: productTitle,
      },
    });

    return NextResponse.json(
      {
        order_id: razorpayOrder.id,
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      },
      { headers: corsHeaders }
    );
  } catch (error: unknown) {
    console.error('Razorpay create-order error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
