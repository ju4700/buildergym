import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'gym2025admin';
    
    // Validate credentials
    if (username === adminUsername && password === adminPassword) {
      // In production, you would generate a JWT token here
      return NextResponse.json({ 
        success: true, 
        message: 'Authentication successful',
        // For demo purposes, we'll just return success
        // In production, return a JWT token instead
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid credentials' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication failed' 
    }, { status: 500 });
  }
}
