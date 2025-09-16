# CinemaMax Frontend

A modern React-based frontend for the movie ticket booking system.

## Features

- 🎬 **Movie Browsing**: Browse movies with search and filter capabilities
- 🎫 **Seat Selection**: Interactive seat map for booking tickets
- 📱 **Responsive Design**: Works perfectly on all devices
- 👨‍💼 **Admin Interface**: Manage movies, bookings, and seat layouts
- ⚡ **Real-time Updates**: Live seat availability updates
- 🎨 **Modern UI**: Cinema-themed design with smooth animations

## Quick Start

### 1. Installation

```bash
# Navigate to frontend directory
cd movie-booking-frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm start
```

### 2. Environment Configuration

Edit `.env` file:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ADMIN_PASSWORD=admin123
```

For production, update the API URL:
```
REACT_APP_API_URL=https://your-api-domain.com/api
```

### 3. Development Server

The app will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.js       # Navigation header
│   ├── MovieCard.js    # Movie display component
│   ├── SeatMap.js      # Interactive seat selection
│   └── LoadingSpinner.js
├── pages/              # Page components
│   ├── Home.js         # Homepage
│   ├── Movies.js       # Movies listing
│   ├── MovieDetails.js # Single movie view
│   ├── SeatSelection.js # Seat booking
│   ├── Booking.js      # Booking confirmation
│   ├── Admin.js        # Admin login
│   └── AdminDashboard.js # Admin panel
├── services/           # API services
│   └── api.js          # API client and methods
├── utils/              # Utility functions
├── App.js              # Main app component
├── App.css             # Global styles
└── index.js            # App entry point
```

## Free Deployment Options

### 1. Netlify (Recommended for Frontend)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Drag and drop `build` folder to netlify.com
   - Or connect GitHub repository for automatic deployments

3. **Configure Environment Variables**:
   - Go to Site Settings > Environment Variables
   - Add `REACT_APP_API_URL=https://your-api-url.com/api`

### 2. Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**:
   ```bash
   vercel env add REACT_APP_API_URL
   ```

### 3. GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json**:
   ```json
   {
     "homepage": "https://yourusername.github.io/your-repo-name",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d build"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run deploy
   ```

### 4. Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## API Integration

The frontend communicates with the backend API using Axios. Key API endpoints:

### Movies
- `GET /api/movies` - Fetch all movies
- `GET /api/movies/:id` - Get movie details

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/:id` - Get booking details

### Seats
- `GET /api/seats/availability` - Check seat availability
- `GET /api/seats/layout` - Get theatre layout

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/dashboard` - Dashboard data

## Key Components

### SeatMap Component
Interactive seat selection with:
- Real-time availability checking
- Different seat types (Regular, Premium, VIP)
- Visual seat status indicators
- Touch/click selection

### MovieCard Component
Displays movie information:
- Poster images
- Ratings and duration
- Show times
- Quick booking actions

### Admin Dashboard
Full admin capabilities:
- Movie management (CRUD)
- Booking overview
- Seat layout configuration
- Analytics and reports

## Styling

The app uses CSS modules with:
- **Cinema Theme**: Dark background with gold accents
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects
- **Typography**: Clean, readable fonts

### Custom CSS Variables
```css
:root {
  --primary-gold: #ffd700;
  --dark-bg: #0a0a0a;
  --card-bg: rgba(255, 255, 255, 0.05);
  --border-color: rgba(255, 215, 0, 0.1);
}
```

## Performance Optimization

- **Code Splitting**: Lazy loading of routes
- **Image Optimization**: Placeholder images for failed loads
- **API Caching**: Efficient data fetching
- **Bundle Optimization**: Tree shaking and minification

## Production Checklist

- [ ] Update API URL in environment variables
- [ ] Enable HTTPS
- [ ] Optimize images and assets
- [ ] Configure proper CORS settings
- [ ] Set up error monitoring
- [ ] Test on multiple devices and browsers

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### CORS Issues
Update the backend CORS configuration to allow your frontend domain.

### API Connection Issues
Verify the `REACT_APP_API_URL` environment variable is correct.

### Build Errors
Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use for personal and commercial projects.
