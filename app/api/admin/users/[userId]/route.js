import { NextResponse } from 'next/server';

async function getAuth0ManagementToken() {
  const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_MANAGEMENT_CLIENT_ID,
      client_secret: process.env.AUTH0_MANAGEMENT_CLIENT_SECRET,
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
    }),
  });

  const data = await response.json();
  return data.access_token;
}

export async function DELETE(request, { params }) {
  try {
    const token = await getAuth0ManagementToken();

    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${params.userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: response.status });
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
