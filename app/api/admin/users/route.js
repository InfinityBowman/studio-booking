import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';

// Helper function to get Auth0 Management API token
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

// GET endpoint to fetch users
export async function GET() {
  try {
    const token = await getAuth0ManagementToken();

    // First, get users
    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const users = await response.json();

    // Get each user's roles using separate endpoint
    const transformedUsers = await Promise.all(
      users.map(async (user) => {
        const rolesResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.user_id}/roles`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rolesData = await rolesResponse.json();
        const roles = rolesData.map((role) => role.name);

        return {
          user_id: user.user_id,
          email: user.email,
          roles: roles,
        };
      }),
    );

    return NextResponse.json({ users: transformedUsers });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST endpoint to create users
export async function POST(req) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, password, roles } = await req.json();
    const token = await getAuth0ManagementToken();

    // 1. Create user
    const createResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        password,
        connection: 'Username-Password-Authentication',
        app_metadata: { roles },
      }),
    });

    if (!createResponse.ok) {
      const error = await createResponse.json();
      return NextResponse.json({ error: error.message }, { status: createResponse.status });
    }

    const userData = await createResponse.json();

    // 2. Get role IDs
    const getRolesResponse = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/roles`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const allRoles = await getRolesResponse.json();

    // 3. Find matching role IDs
    const roleIds = allRoles.filter((role) => roles.includes(role.name)).map((role) => role.id);

    // 4. Assign roles to user
    if (roleIds.length > 0) {
      const assignRolesResponse = await fetch(
        `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userData.user_id}/roles`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            roles: roleIds,
          }),
        },
      );

      if (!assignRolesResponse.ok) {
        console.error('Failed to assign roles:', await assignRolesResponse.json());
      }
    }

    return NextResponse.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
