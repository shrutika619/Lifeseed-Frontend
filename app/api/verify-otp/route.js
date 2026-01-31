import { NextResponse } from 'next/server';

// Same storage as send-otp
let otpData = {};

export async function POST(request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: 'Phone number and OTP are required' }, { status: 400 });
    }

    // Check if OTP exists
    const stored = otpData[phone];
    if (!stored) {
      return NextResponse.json({ error: 'No OTP found for this number. Please request a new OTP.' }, { status: 400 });
    }

    // Check if expired
    if (Date.now() > stored.expires) {
      delete otpData[phone];
      return NextResponse.json({ error: 'OTP has expired. Please request a new OTP.' }, { status: 400 });
    }
    

    // Check if correct
    if (stored.otp === otp) {
      delete otpData[phone];
      return NextResponse.json({ success: true, message: 'Login successful!' });
    } else {
      return NextResponse.json({ error: 'Invalid OTP. Please try again.' }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Server error while verifying OTP' }, { status: 500 });
  }
}