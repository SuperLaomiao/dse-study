# CloudBase Deploy Notes

## Target

- Environment: `testing`
- Environment ID: `testing-0gl3765x0fdfd178`
- Region: `Shanghai`
- Recommended service name: `dse-study`

## Deploy mode

Use CloudBase `CloudRun / 云托管` for this Next.js app.

Do not use HTTP cloud functions for this project.

## Required environment variables

- `DATABASE_URL`

Use the CloudBase MySQL connection string for the target environment.

Example:

`mysql://root:password@10.x.x.x:3306/dse_study`

## Build and start model

This repository is ready for container-based deployment with the included `Dockerfile`.

Container behavior:

- installs dependencies
- generates Prisma client
- builds Next.js
- starts the production server on port `3000`

## Before first public preview

1. Add `DATABASE_URL` in CloudBase environment variables
2. Deploy the container
3. After the first deploy is live, run seed once in a trusted shell against the same database if the target database is empty
4. Verify `/sign-in`, `/admin/family`, and `/onboarding/profile`

## Smoke test checklist

- sign-in page loads
- demo sign-in works for `mom@example.com`
- admin family page renders `Chan Family`
- onboarding profile page loads for learner session
- production server can read CloudBase MySQL without falling back to demo mode
