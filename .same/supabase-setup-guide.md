# Supabase Setup Guide for Instagram Profile Viewer

This guide will help you set up Supabase for email login and registration functionality in your Instagram Profile Viewer application.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com/](https://supabase.com/) and sign up for a free account.
2. After signing up, click on "New Project" to create a new project.
3. Enter a name for your project (e.g., "instagram-profile-viewer").
4. Set a secure database password (make sure to save this).
5. Choose the region closest to your users.
6. Click "Create new project".

## Step 2: Get Your API Keys

1. Once your project is created, navigate to the project dashboard.
2. In the left sidebar, click on "Project Settings".
3. Under "API", you'll find your project URL and API keys.
4. Copy the "Project URL" and "anon/public" key.

## Step 3: Configure Your Application

1. In your Instagram Profile Viewer project, create or update the `.env.local` file with your Supabase credentials:

```
# Existing configuration...

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Replace `your_project_url_here` with your Supabase project URL.
3. Replace `your_anon_key_here` with your Supabase anon/public key.

## Step 4: Enable Email Auth in Supabase

1. In your Supabase dashboard, go to "Authentication" in the left sidebar.
2. Navigate to "Providers" tab.
3. Make sure "Email" is enabled.
4. Optionally, you can customize email templates under the "Email Templates" tab.

## Step 5: Configure Email Settings (Optional)

For a production environment, you should configure a proper email provider:

1. In the Supabase dashboard, go to "Authentication" > "Email Templates".
2. Click on "Email Settings".
3. Configure your SMTP settings with your email provider (e.g., SendGrid, Mailgun, etc.).

## Step 6: Restart Your Application

1. After configuring the environment variables, restart your development server.
2. The application should now connect to your Supabase project and enable authentication.

## Using Supabase Authentication

Your Instagram Profile Viewer now supports:

- User registration with email
- User login with email and password
- Password reset functionality
- User session management

All user data is securely stored in your Supabase project.

## Extending Functionality

You can extend the Supabase integration to add more features:

1. **User Profiles**: Create a `profiles` table in Supabase to store additional user information.
2. **Saved Searches**: Create a `saved_searches` table to let users save their Instagram profile searches.
3. **Favorites**: Allow users to save favorite Instagram profiles.

## Troubleshooting

- If you encounter CORS errors, make sure your site's URL is added to the allowed domains in Supabase's Authentication settings.
- For email verification issues, check your SMTP configuration in Supabase.
- If authentication isn't working, verify that the environment variables are correctly set.

For more help, refer to the [Supabase documentation](https://supabase.com/docs).
