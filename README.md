# Google Authenticator for PC

A secure two-factor authentication (2FA) implementation for enhanced account security.

## Features

- Generate time-based one-time passwords (TOTP)
- QR code scanning support
- Backup and restore functionality
- Multiple account management
- Offline authentication
- Cross-platform compatibility

## Requirements

- Node.js (version 18 or higher, recommended version 22.14.0)
- Google Authenticator Setuped

## Steps To Use

1. Open Google Authenticator
2. Go To Menu i.e ≡ on left top
3. Click on "Transfer Codes"
4. Click on "Export Codes"
5. Select 2fa Codes u want to show and click Next
6. Screenshot the QR Code displayed on your screen
7. Click Next and Make SURE to select "Keep Exported Codes", and click Done

- Now we can view the code on pc

## Installation

1. Clone the repository:
   ```shell
   git clone https://github.com/aryanm830/google-auth-pc.git
   ```

2. Install the dependencies:
   ```shell
   cd google-auth-pc
   npm install
   ```
3. Copy The Screenshoted QR Code in this folder, And rename it to a short name for writing fast

4. Start the application:
 - auth.jpg is the ScreenShot of QR Code
   ```shell
   node index.js auth.jpg
   ```
5. Enjoy!

6. To Exit, Press Ctrl + C


