FOODTRUCK BACKEND
=================

This is the backend server for the Foodtruck mobile app.
It includes:
- Menu system
- Orders system
- Owner login (PIN-based)
- Truck location system
- Square payments
- SQLite database
- Render-ready configuration

---------------------------------------
1. HOW TO DEPLOY ON RENDER
---------------------------------------

Step 1 — Go to https://render.com
Step 2 — Click "New" → "Web Service"
Step 3 — Connect your GitHub account
Step 4 — Select the repository named "foodtruck"
Step 5 — Render will auto-detect the project

Use these settings:

- Runtime: Node
- Build Command: (leave empty)
- Start Command: node index.js
- Region: Any
- Branch: main
- Instance type: Free

---------------------------------------
2. ENVIRONMENT VARIABLES
---------------------------------------

Add these inside Render under:
"Environment → Add Environment Variable"

SQUARE_ACCESS_TOKEN = your Square access token
SQUARE_APP_ID = your Square app ID
SQUARE_LOCATION_ID = your Square location ID
PORT = 4000

---------------------------------------
3. FILE STRUCTURE
---------------------------------------

foodtruck/
  index.js
  db.js
  package.json
  .env.example
  routes/
    payments.js
    menu.js
    orders.js
    owner.js
    location.js
  public/
    payment.html

---------------------------------------
4. STARTING THE SERVER LOCALLY (optional)
---------------------------------------

If you ever want to run this on your computer:

1. Install Node.js
2. Run: npm install
3. Run: node index.js
4. Server will run on http://localhost:4000

---------------------------------------
5. OWNER LOGIN
---------------------------------------

Your owner PIN is:

0419

Use this PIN in the mobile app to access the owner dashboard.

---------------------------------------
6. SUPPORT
---------------------------------------

If anything breaks or you want to add new features,
just ask Copilot and it will guide you.
