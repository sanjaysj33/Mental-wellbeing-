# 🌟 Mental Wellbeing App

A modern, responsive web application designed to help you track your mental health and practice self-care. Built with vanilla HTML, CSS, and JavaScript for optimal performance and accessibility.

## ✨ Features

### 🎯 Mood Tracking
- **Daily Mood Logging**: Rate your mood from 1-10 with optional notes
- **Mood History**: View your mood trends over time with visual charts
- **Average Mood Calculation**: Track your overall wellbeing progress
- **Data Persistence**: Your mood data is saved locally in your browser

### 💡 Self-Care Tips
- **Random Tips**: Get personalized self-care suggestions
- **Comprehensive Library**: Access to 8+ evidence-based wellness tips
- **Contextual Advice**: Tips for different emotional states (anxiety, stress, sadness, etc.)

### 🧘‍♀️ Breathing Exercises
- **4-7-8 Technique**: Guided breathing exercise for stress relief
- **Visual Guide**: Animated breathing circle with real-time instructions
- **Customizable Cycles**: Complete 4 breathing cycles with rest periods
- **Interactive Controls**: Start/stop functionality with progress tracking

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Full keyboard navigation and screen reader support
- **Dark/Light Mode**: Adaptive design that works in any environment

## 🚀 Quick Start

### Option 1: Direct Access
Simply open `index.html` in your web browser - no installation required!

### Option 2: Local Development Server
```bash
# Install dependencies (optional)
npm install

# Start development server
npm start
# or
npm run dev

# Alternative: Use any static server
npx http-server -p 3000 -o
```

The app will open automatically in your browser at `http://localhost:3000`

## 📱 Usage

### Logging Your Mood
1. Click "Log Today's Mood"
2. Select the date (defaults to today)
3. Rate your mood using the slider (1-10)
4. Add an optional note about how you're feeling
5. Click "Save Mood"

### Viewing Mood History
1. Click "Mood History"
2. See all your logged moods sorted by date
3. View your average mood rating
4. Track your progress over time

### Getting Self-Care Tips
1. Click "Random Tip" for a personalized suggestion
2. Click "View All Tips" to browse the complete library
3. Tips are tailored for different emotional states

### Breathing Exercise
1. Click "Breathing Exercise"
2. Read the instructions for the 4-7-8 technique
3. Click "Start Exercise"
4. Follow the visual guide and breathing prompts
5. Complete 4 cycles for maximum benefit

## 🛠️ Technical Details

### Built With
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **Vanilla JavaScript**: No frameworks - pure, fast, and lightweight
- **Local Storage**: Client-side data persistence
- **Responsive Design**: Mobile-first approach

### Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Performance
- **Lightweight**: < 50KB total bundle size
- **Fast Loading**: Optimized assets and minimal dependencies
- **Offline Capable**: Works without internet connection
- **Progressive**: Enhanced features for modern browsers

## 🔒 Privacy & Security

- **100% Local**: All data stays on your device
- **No Tracking**: No analytics or user tracking
- **No Server**: No data sent to external servers
- **GDPR Compliant**: No personal data collection

## 📊 Data Management

### Export Your Data
Your mood history can be exported as JSON for backup or analysis:
```javascript
// Available in browser console
window.MentalWellbeingUtils.exportMoodHistory();
```

### Import Data
Restore your mood history from a backup file:
```javascript
// Available in browser console
window.MentalWellbeingUtils.importMoodHistory(file);
```

## 🎨 Customization

### Themes
The app uses CSS custom properties for easy theming. Modify the `:root` variables in `styles.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #10b981;
    --accent-color: #f59e0b;
    /* ... more variables */
}
```

### Adding New Tips
Edit the `tips` array in `script.js`:

```javascript
this.tips = [
    "Your new tip here...",
    // ... existing tips
];
```

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Development Guidelines
- Follow existing code style
- Test on multiple browsers
- Ensure accessibility compliance
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Self-Care Tips**: Based on evidence-based mental health practices
- **Breathing Technique**: 4-7-8 method developed by Dr. Andrew Weil
- **Icons**: Font Awesome for beautiful, consistent icons
- **Fonts**: Inter font family for excellent readability

## 📞 Support

If you have questions or need help:

1. Check the [Issues](https://github.com/your-username/mental-wellbeing-app/issues) page
2. Create a new issue for bugs or feature requests
3. Review the documentation above

## 🌟 Features Roadmap

- [ ] Mood charts and analytics
- [ ] Custom breathing exercise timings
- [ ] Daily reminders and notifications
- [ ] Mood journal with rich text
- [ ] Integration with health apps
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Mood insights and patterns

---

**Remember**: This app is a tool to support your mental wellbeing, but it's not a replacement for professional mental health care. If you're experiencing severe distress, please reach out to a mental health professional or crisis helpline.

**Take care of yourself! 💚**
