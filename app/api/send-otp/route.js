import { NextResponse } from 'next/server';

let otpData = {};

export async function POST(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP
    otpData[phone] = {
      otp: otp,
      expires: Date.now() + 5 * 60 * 1000
    };

    console.log(`Generated OTP for ${phone}: ${otp}`);

    // Build URL exactly as shown in your Fast2SMS interface
    const apiKey = process.env.FAST2SMS_API_KEY;
    const apiUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${apiKey}&route=dlt&sender_id=DRFUSN&message=174808&variables_values=${otp}&numbers=${phone}&flash=0`;

    console.log('API URL:', apiUrl);

    // Send GET request
    const response = await fetch(apiUrl, {
      method: 'GET'
    });

    const data = await response.json();
    console.log('Fast2SMS Response:', data);

    // Check for success
    if (response.ok && (data.return === true || data.status === 'success' || data.message?.includes('success'))) {
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully' 
      });
    } else {
      console.error('Fast2SMS Error:', data);
      return NextResponse.json({ 
        error: 'Failed to send OTP', 
        details: data 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({ 
      error: 'Server error while sending OTP',
      details: error.message
    }, { status: 500 });
  }
}

export { otpData };