import { NextRequest, NextResponse } from 'next/server';

const GREENHOUSE_API_KEY = process.env.GREENHOUSE_API_KEY!;
const GREENHOUSE_BASE_URL = 'https://harvest.greenhouse.io/v1';
const JOB_ID = process.env.GREENHOUSE_JOB_ID!;
const USER_ID = process.env.GREENHOUSE_USER_ID!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const linkedinUrl = formData.get('linkedinUrl') as string;
    const coverLetter = formData.get('coverLetter') as string;
    const resumeFile = formData.get('resume') as File;

    // Convert resume file to base64
    const resumeBuffer = await resumeFile.arrayBuffer();
    const resumeBase64 = Buffer.from(resumeBuffer).toString('base64');

    const authHeader = `Basic ${Buffer.from(GREENHOUSE_API_KEY + ':').toString('base64')}`;

    // Create candidate with application in a single request
    const candidateData: any = {
      first_name: firstName,
      last_name: lastName,
      email_addresses: [
        {
          value: email,
          type: 'personal'
        }
      ],
      phone_numbers: [
        {
          value: phone,
          type: 'mobile'
        }
      ],
      social_media_addresses: linkedinUrl ? [
        {
          value: linkedinUrl
        }
      ] : [],
      applications: [
        {
          job_id: parseInt(JOB_ID)
        }
      ],
      attachments: [
        {
          filename: resumeFile.name,
          type: 'resume',
          content: resumeBase64,
          content_type: resumeFile.type
        }
      ]
    };

    // Add cover letter if provided
    if (coverLetter) {
      candidateData.attachments.push({
        filename: 'cover_letter.txt',
        type: 'cover_letter',
        content: Buffer.from(coverLetter).toString('base64'),
        content_type: 'text/plain'
      });
    }

    const response = await fetch(`${GREENHOUSE_BASE_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'On-Behalf-Of': USER_ID
      },
      body: JSON.stringify(candidateData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Greenhouse API error:', errorData);
      throw new Error(`Failed to submit application: ${response.status}`);
    }

    const result = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      applicationId: result.id
    });

  } catch (error) {
    console.error('Error submitting application:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit application. Please try again.'
      },
      { status: 500 }
    );
  }
}