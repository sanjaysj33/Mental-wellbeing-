# 🗺️ Google Maps API Setup Guide

To enable the "Find Help Nearby" feature in your Mental Wellbeing app, you need to set up a Google Maps API key.

## 🔑 Getting Your Google Maps API Key

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing (required for Maps API)

### Step 2: Enable Required APIs
Enable these APIs in your Google Cloud Console:
- **Maps JavaScript API**
- **Places API**
- **Geocoding API**

### Step 3: Create API Key
1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy your API key

### Step 4: Restrict Your API Key (Recommended)
1. Click on your API key to edit it
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain (e.g., `localhost:3000/*`, `yourdomain.com/*`)
4. Under "API restrictions", select "Restrict key"
5. Choose the APIs you enabled in Step 2

## 🔧 Adding Your API Key to the App

### Option 1: Replace in HTML (Quick Setup)
1. Open `index.html`
2. Find this line:
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgTjE8J8J8J&libraries=places&callback=initMap"></script>
   ```
3. Replace `AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgTjE8J8J8J` with your actual API key

### Option 2: Environment Variable (Production)
For production deployment, use environment variables:
1. Create a `.env` file:
   ```
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```
2. Update the HTML to use the environment variable

## 🚀 Testing the Feature

1. Open your app in a browser
2. Click "Find Help Nearby"
3. Enter a location or use "Use Current Location"
4. Click "Find Nearby Help"
5. You should see a map with nearby healthcare facilities

## 🏥 What the Feature Does

The "Find Help Nearby" feature:
- **Shows nearby hospitals, medical centers, and healthcare facilities**
- **Displays distance and ratings** for each facility
- **Provides directions** to selected locations
- **Shows phone numbers** for calling facilities
- **Includes crisis resources** (911, Crisis Text Line, Suicide Prevention)
- **Works on mobile and desktop**

## 🔒 Security Notes

- **Never commit your API key** to public repositories
- **Use API key restrictions** to limit usage to your domain
- **Monitor usage** in Google Cloud Console
- **Set up billing alerts** to avoid unexpected charges

## 💰 Pricing

Google Maps API has a free tier:
- **$200 free credits per month**
- **Covers most small to medium applications**
- **Check current pricing** at [Google Maps Platform Pricing](https://cloud.google.com/maps-platform/pricing)

## 🆘 Troubleshooting

### "This page can't load Google Maps correctly"
- Check if your API key is correct
- Verify the APIs are enabled
- Check if your domain is allowed in API key restrictions

### "Places API not enabled"
- Go to Google Cloud Console
- Enable the Places API
- Wait a few minutes for changes to propagate

### No results found
- Try a different location
- Check if there are healthcare facilities in the area
- Verify your location permissions

## 🌟 Features Included

✅ **Interactive Google Map** with custom markers  
✅ **Location search** by address or current location  
✅ **Healthcare facility filtering** (hospitals, clinics, etc.)  
✅ **Distance calculation** and sorting  
✅ **Directions integration** with Google Maps  
✅ **Phone number display** for calling facilities  
✅ **Crisis resources** prominently displayed  
✅ **Responsive design** for mobile and desktop  
✅ **Error handling** and user feedback  

Your Mental Wellbeing app now has a powerful feature to help users find healthcare resources when they need them most! 🎉



