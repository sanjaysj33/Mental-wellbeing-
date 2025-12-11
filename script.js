// Mental Wellbeing App - JavaScript
class MentalWellbeingApp {
    constructor() {
        this.moodHistory = this.loadMoodHistory();
        this.breathingInterval = null;
        this.breathingPhase = 0;
        this.breathingCycles = 0;
        this.maxBreathingCycles = 4;
        
        // Maps and location properties
        this.map = null;
        this.currentLocation = null;
        this.placesService = null;
        this.geocoder = null;
        this.markers = [];
        // Detect mapping backend (Google if available, else Leaflet)
        this.isLeaflet = !(window.google && window.google.maps);
        
        this.tips = [
            "Feeling anxious? Try grounding: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
            "Low energy? Take a 5-minute walk outside or stretch gently.",
            "Overwhelmed? Write down 3 things you're grateful for right now.",
            "Sad? Listen to your favorite uplifting song and dance along.",
            "Stressed? Close your eyes and imagine a peaceful place for 2 minutes.",
            "Irritable? Drink a glass of water and take 10 deep breaths.",
            "Lonely? Reach out to a friend with a quick message.",
            "Happy? Share your joy—tell someone about it!"
        ];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupDateInput();
        this.displayAllTips();
        // Initialize mood filter if present
        const moodFilter = document.getElementById('moodFilter');
        if (moodFilter) {
            moodFilter.addEventListener('change', () => this.displayMoodHistory());
        }
    }
    
    setupEventListeners() {
        // Action buttons
        document.getElementById('logMoodBtn').addEventListener('click', () => this.openModal('moodModal'));
        document.getElementById('viewHistoryBtn').addEventListener('click', () => this.openModal('historyModal'));
        document.getElementById('randomTipBtn').addEventListener('click', () => this.openModal('tipsModal'));
        document.getElementById('breathingBtn').addEventListener('click', () => this.openModal('breathingModal'));
        document.getElementById('findHelpBtn').addEventListener('click', () => this.openModal('findHelpModal'));
        document.getElementById('connectWatchBtn').addEventListener('click', () => this.openModal('watchModal'));
        
        // Modal close buttons
        document.getElementById('closeMoodModal').addEventListener('click', () => this.closeModal('moodModal'));
        document.getElementById('closeHistoryModal').addEventListener('click', () => this.closeModal('historyModal'));
        document.getElementById('closeTipsModal').addEventListener('click', () => this.closeModal('tipsModal'));
        document.getElementById('closeBreathingModal').addEventListener('click', () => this.closeModal('breathingModal'));
        document.getElementById('closeFindHelpModal').addEventListener('click', () => this.closeModal('findHelpModal'));
        document.getElementById('closeWatchModal').addEventListener('click', () => this.closeModal('watchModal'));
        
        // Form submissions
        document.getElementById('saveMoodBtn').addEventListener('click', () => this.saveMood());
        document.getElementById('moodRating').addEventListener('input', (e) => this.updateRatingDisplay(e.target.value));
        
        // Breathing exercise controls
        document.getElementById('startBreathingBtn').addEventListener('click', () => this.startBreathingExercise());
        document.getElementById('stopBreathingBtn').addEventListener('click', () => this.stopBreathingExercise());
        
        // Find help controls
        document.getElementById('useCurrentLocationBtn').addEventListener('click', () => this.useCurrentLocation());
        document.getElementById('searchNearbyBtn').addEventListener('click', () => this.searchNearbyHelp());
        // Wearable
        document.getElementById('connectHeartRateBtn').addEventListener('click', () => this.connectHeartRate());
        const scanAny = document.getElementById('scanAnyBtBtn');
        if (scanAny) scanAny.addEventListener('click', () => this.scanAnyBluetooth());
        
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Logout button (if present) — simple client-side demo logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('loggedInRole');
                localStorage.removeItem('loggedInToken');
                window.location.href = 'login.html';
            });
        }
    }
    
    setupDateInput() {
        const dateInput = document.getElementById('moodDate');
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
        dateInput.max = today; // Prevent future dates
    }
    
    // Modal Management
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Special handling for different modals
        if (modalId === 'historyModal') {
            this.displayMoodHistory();
        } else if (modalId === 'tipsModal') {
            this.showRandomTip();
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        
        // Reset breathing exercise if closing breathing modal
        if (modalId === 'breathingModal') {
            this.stopBreathingExercise();
        }
        
        // Clear map markers if closing find help modal
        if (modalId === 'findHelpModal') {
            this.clearMapMarkers();
        }
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = 'auto';
        this.stopBreathingExercise();
        this.clearMapMarkers();
    }
    
    // Mood Tracking
    saveMood() {
        const date = document.getElementById('moodDate').value;
        const rating = parseInt(document.getElementById('moodRating').value);
        const note = document.getElementById('moodNote').value.trim();
        
        if (!date) {
            this.showNotification('Please select a date', 'error');
            return;
        }
        
        if (rating < 1 || rating > 10) {
            this.showNotification('Please select a valid mood rating', 'error');
            return;
        }
        
        const mood = {
            id: Date.now(),
            date: date,
            rating: rating,
            note: note || 'No note'
        };
        
        this.moodHistory.push(mood);
        this.saveMoodHistory();
        
        this.showNotification(`Mood logged successfully! Rating: ${rating}/10`, 'success');
        this.closeModal('moodModal');
        this.resetMoodForm();
        // Refresh history UI and stats immediately
        this.displayMoodHistory();
    }
    
    resetMoodForm() {
        document.getElementById('moodDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('moodRating').value = 5;
        document.getElementById('moodNote').value = '';
        this.updateRatingDisplay(5);
    }
    
    updateRatingDisplay(rating) {
        document.getElementById('ratingValue').textContent = rating;
    }
    
    displayMoodHistory() {
        const historyContent = document.getElementById('historyContent');
        const totalEntriesEl = document.getElementById('totalEntries');
        const averageMoodEl = document.getElementById('averageMood');
        const streakDaysEl = document.getElementById('streakDays');
        const bestMoodEl = document.getElementById('bestMood');
        const moodFilter = document.getElementById('moodFilter');

        if (!historyContent) return;

        if (!this.moodHistory || this.moodHistory.length === 0) {
            historyContent.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon"><i class="fas fa-chart-line"></i></div>
                    <h3>Start Your Journey</h3>
                    <p>No moods logged yet. Start tracking your mood to see your progress and insights!</p>
                    <button class="btn-primary" onclick="app.openModal('moodModal')">
                        <i class="fas fa-plus"></i>
                        Log Your First Mood
                    </button>
                </div>
            `;
            if (totalEntriesEl) totalEntriesEl.textContent = '0';
            if (averageMoodEl) averageMoodEl.textContent = '0';
            if (streakDaysEl) streakDaysEl.textContent = '0';
            if (bestMoodEl) bestMoodEl.textContent = '0';
            return;
        }

        // Sort by date desc
        const sorted = [...this.moodHistory].sort((a, b) => new Date(b.date) - new Date(a.date));

        // Filter if requested
        let filtered = sorted;
        if (moodFilter) {
            const v = moodFilter.value;
            if (v === 'high') filtered = sorted.filter(m => m.rating >= 8);
            else if (v === 'medium') filtered = sorted.filter(m => m.rating >= 5 && m.rating <= 7);
            else if (v === 'low') filtered = sorted.filter(m => m.rating <= 4);
        }

        // Stats
        const total = sorted.length;
        const avg = (sorted.reduce((s, m) => s + m.rating, 0) / total).toFixed(1);
        const best = Math.max(...sorted.map(m => m.rating));
        const streak = this.calculateDayStreak(sorted);
        if (totalEntriesEl) totalEntriesEl.textContent = String(total);
        if (averageMoodEl) averageMoodEl.textContent = String(avg);
        if (streakDaysEl) streakDaysEl.textContent = String(streak);
        if (bestMoodEl) bestMoodEl.textContent = String(best);

        // Render list
        const items = filtered.map(m => {
            const d = new Date(m.date);
            const dateStr = d.toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
            const emoji = window.MentalWellbeingUtils.getMoodEmoji(m.rating);
            const desc = window.MentalWellbeingUtils.getMoodDescription(m.rating);
            return `
                <div class="mood-entry">
                    <div class="date">${dateStr}</div>
                    <div class="rating">${emoji} ${m.rating}/10 • ${desc}</div>
                    <div class="note">${m.note}</div>
                </div>
            `;
        }).join('');

        historyContent.innerHTML = items || `
            <div class="empty-state">
                <i class="fas fa-filter"></i>
                <p>No entries match this filter.</p>
            </div>
        `;
    }

    calculateDayStreak(sortedHistoryDesc) {
        // Expects sorted by date desc
        const days = new Set(sortedHistoryDesc.map(m => new Date(m.date).toDateString()));
        if (days.size === 0) return 0;
        let streak = 0;
        const today = new Date();
        for (let i = 0; ; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            if (days.has(d.toDateString())) streak++;
            else break;
        }
        return streak;
    }
    
    // Tips System
    showRandomTip() {
        const randomTip = this.getRandomTip();
        document.getElementById('randomTipText').textContent = randomTip;
    }
    
    getRandomTip() {
        if (this.tips.length === 0) return "No tips available.";
        const index = Math.floor(Math.random() * this.tips.length);
        return this.tips[index];
    }
    
    displayAllTips() {
        const allTipsList = document.getElementById('allTipsList');
        let html = '';
        
        this.tips.forEach((tip, index) => {
            html += `
                <div class="tip-item">
                    <strong>${index + 1}.</strong> ${tip}
                </div>
            `;
        });
        
        allTipsList.innerHTML = html;
    }
    
    // Breathing Exercise
    startBreathingExercise() {
        const startBtn = document.getElementById('startBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');
        const breathingCircle = document.getElementById('breathingCircle');
        const breathingText = document.getElementById('breathingText');
        
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';
        
        breathingCircle.classList.add('breathing');
        this.breathingPhase = 0;
        this.breathingCycles = 0;
        
        this.updateBreathingText('Get ready...', 'Starting in 3 seconds');
        
        setTimeout(() => {
            this.runBreathingCycle();
        }, 3000);
    }
    
    stopBreathingExercise() {
        const startBtn = document.getElementById('startBreathingBtn');
        const stopBtn = document.getElementById('stopBreathingBtn');
        const breathingCircle = document.getElementById('breathingCircle');
        
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        
        startBtn.style.display = 'inline-block';
        stopBtn.style.display = 'none';
        
        breathingCircle.classList.remove('breathing');
        this.updateBreathingText('Ready to begin?', 'Click start to begin the 4-7-8 breathing technique');
    }
    
    runBreathingCycle() {
        const phases = [
            { text: 'Breathe In', instruction: 'Inhale through your nose for 4 seconds', duration: 4000 },
            { text: 'Hold', instruction: 'Hold your breath for 7 seconds', duration: 7000 },
            { text: 'Breathe Out', instruction: 'Exhale through your mouth for 8 seconds', duration: 8000 }
        ];
        
        let phaseIndex = 0;
        let countdown = phases[phaseIndex].duration / 1000;
        
        const updatePhase = () => {
            if (this.breathingCycles >= this.maxBreathingCycles) {
                this.completeBreathingExercise();
                return;
            }
            
            const phase = phases[phaseIndex];
            this.updateBreathingText(phase.text, `${phase.instruction} (${Math.ceil(countdown)}s)`);
            
            countdown -= 0.1;
            
            if (countdown <= 0) {
                phaseIndex++;
                if (phaseIndex >= phases.length) {
                    phaseIndex = 0;
                    this.breathingCycles++;
                    if (this.breathingCycles < this.maxBreathingCycles) {
                        this.updateBreathingText('Rest', 'Take a moment before the next cycle');
                        setTimeout(() => {
                            countdown = phases[0].duration / 1000;
                            updatePhase();
                        }, 2000);
                        return;
                    }
                } else {
                    countdown = phases[phaseIndex].duration / 1000;
                }
            }
            
            this.breathingInterval = setTimeout(updatePhase, 100);
        };
        
        updatePhase();
    }
    
    completeBreathingExercise() {
        this.stopBreathingExercise();
        this.updateBreathingText('Complete!', 'Great job! How do you feel?');
        
        setTimeout(() => {
            this.updateBreathingText('Ready to begin?', 'Click start to begin the 4-7-8 breathing technique');
        }, 5000);
    }
    
    updateBreathingText(title, instruction) {
        const breathingText = document.getElementById('breathingText');
        breathingText.innerHTML = `
            <h3>${title}</h3>
            <p>${instruction}</p>
        `;
    }
    
    // Data Persistence
    saveMoodHistory() {
        try {
            localStorage.setItem('mentalWellbeing_moodHistory', JSON.stringify(this.moodHistory));
        } catch (error) {
            console.error('Error saving mood history:', error);
            this.showNotification('Error saving mood history', 'error');
        }
    }
    
    loadMoodHistory() {
        try {
            const stored = localStorage.getItem('mentalWellbeing_moodHistory');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading mood history:', error);
            return [];
        }
    }
    
    // Utility Functions
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        // Add animation keyframes if not already added
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease-out reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Export mood history as JSON
    exportMoodHistory() {
        const dataStr = JSON.stringify(this.moodHistory, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `mood-history-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    // Import mood history from JSON
    importMoodHistory(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (Array.isArray(importedData)) {
                    this.moodHistory = importedData;
                    this.saveMoodHistory();
                    this.showNotification('Mood history imported successfully!', 'success');
                } else {
                    this.showNotification('Invalid file format', 'error');
                }
            } catch (error) {
                this.showNotification('Error importing mood history', 'error');
            }
        };
        reader.readAsText(file);
    }

    // Web Bluetooth - Heart Rate
    async connectHeartRate() {
        try {
            if (!navigator.bluetooth) {
                this.showNotification('Web Bluetooth not supported in this browser', 'error');
                return;
            }
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['heart_rate'] }]
            });
            const server = await device.gatt.connect();
            const service = await server.getPrimaryService('heart_rate');
            const characteristic = await service.getCharacteristic('heart_rate_measurement');

            await characteristic.startNotifications();
            this.showNotification('Connected to heart rate monitor', 'success');

            const watchStats = document.getElementById('watchStats');
            const currentHR = document.getElementById('currentHR');
            const avgHR = document.getElementById('avgHR');
            const samplesHR = document.getElementById('samplesHR');
            const watchLog = document.getElementById('watchLog');
            watchStats.style.display = 'grid';

            const session = { startTs: Date.now(), values: [] };

            const parseHeartRate = (dataView) => {
                // Based on Bluetooth SIG Heart Rate Measurement spec
                const flags = dataView.getUint8(0);
                const isUint16 = flags & 0x01;
                let index = 1;
                let hr;
                if (isUint16) {
                    hr = dataView.getUint16(index, /*littleEndian=*/true); index += 2;
                } else {
                    hr = dataView.getUint8(index); index += 1;
                }
                return hr;
            };

            characteristic.addEventListener('characteristicvaluechanged', (event) => {
                const dv = event.target.value;
                const hr = parseHeartRate(dv);
                const ts = new Date().toISOString();

                session.values.push(hr);
                const avg = session.values.reduce((a,b)=>a+b,0) / session.values.length;

                currentHR.textContent = hr;
                avgHR.textContent = Math.round(avg);
                samplesHR.textContent = String(session.values.length);

                const line = `[${ts}] HR: ${hr}`;
                const entry = document.createElement('div');
                entry.textContent = line;
                watchLog.prepend(entry);

                this.persistHeartRate({ ts, bpm: hr });
            });
        } catch (err) {
            console.error(err);
            this.showNotification('Failed to connect to heart rate monitor', 'error');
        }
    }

    persistHeartRate(sample) {
        try {
            const key = 'mentalWellbeing_heartRate';
            const data = JSON.parse(localStorage.getItem(key) || '[]');
            data.push(sample);
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {
            console.error('Persist HR error', e);
        }
    }

    async scanAnyBluetooth() {
        try {
            if (!navigator.bluetooth) {
                this.showNotification('Web Bluetooth not supported in this browser', 'error');
                return;
            }
            const device = await navigator.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['heart_rate', 'battery_service', 'device_information']
            });
            const server = await device.gatt.connect();
            const services = await server.getPrimaryServices();

            const watchLog = document.getElementById('watchLog');
            const watchStats = document.getElementById('watchStats');
            watchStats.style.display = 'grid';

            const log = (msg) => { const d=document.createElement('div'); d.textContent=msg; watchLog.prepend(d); };
            log(`Connected: ${device.name || 'Unnamed device'}`);

            // Try Heart Rate if present
            try {
                const hrService = await server.getPrimaryService('heart_rate');
                const hrChar = await hrService.getCharacteristic('heart_rate_measurement');
                await hrChar.startNotifications();
                log('Subscribed to Heart Rate');
                hrChar.addEventListener('characteristicvaluechanged', (event) => {
                    const dv = event.target.value;
                    const hr = (()=>{ const flags=dv.getUint8(0); let i=1; return (flags&1)? dv.getUint16(i,true): dv.getUint8(i); })();
                    document.getElementById('currentHR').textContent = hr;
                    document.getElementById('samplesHR').textContent = String(parseInt(document.getElementById('samplesHR').textContent||'0')+1);
                    const avgEl = document.getElementById('avgHR');
                    const samples = parseInt(document.getElementById('samplesHR').textContent);
                    const prevAvg = parseInt(avgEl.textContent||'0') || 0;
                    const newAvg = Math.round(((prevAvg*(samples-1)) + hr)/samples);
                    avgEl.textContent = newAvg;
                    this.persistHeartRate({ ts:new Date().toISOString(), bpm: hr });
                });
            } catch {}

            // Battery Service
            try {
                const batt = await server.getPrimaryService('battery_service');
                const levelChar = await batt.getCharacteristic('battery_level');
                const value = await levelChar.readValue();
                const level = value.getUint8(0);
                log(`Battery Level: ${level}%`);
            } catch {}

            // Device Information
            try {
                const info = await server.getPrimaryService('device_information');
                const readText = async (uuid, label) => {
                    try { const ch = await info.getCharacteristic(uuid); const v = await ch.readValue();
                        const txt = new TextDecoder().decode(v.buffer); log(`${label}: ${txt}`); } catch {}
                };
                await readText('manufacturer_name_string', 'Manufacturer');
                await readText('model_number_string', 'Model');
                await readText('serial_number_string', 'Serial');
            } catch {}

            this.showNotification('Bluetooth device connected', 'success');
        } catch (e) {
            console.error(e);
            this.showNotification('Bluetooth connection failed or cancelled', 'error');
        }
    }
    
    // Google Maps and Location Services
    async useCurrentLocation() {
        const locationInput = document.getElementById('locationInput');
        const useCurrentBtn = document.getElementById('useCurrentLocationBtn');
        
        if (!navigator.geolocation) {
            this.showNotification('Geolocation is not supported by this browser', 'error');
            return;
        }
        
        useCurrentBtn.disabled = true;
        useCurrentBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
        
        try {
            const position = await this.getCurrentPosition();
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            this.currentLocation = { lat, lng };
            
            // Reverse geocode to get address
            if (this.geocoder) {
                this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        locationInput.value = results[0].formatted_address;
                    } else {
                        locationInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
                    }
                });
            } else {
                locationInput.value = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            }
            
            this.showNotification('Location found successfully!', 'success');
        } catch (error) {
            this.showNotification('Unable to get your location. Please enter it manually.', 'error');
        } finally {
            useCurrentBtn.disabled = false;
            useCurrentBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Use Current Location';
        }
    }
    
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            });
        });
    }
    
    async searchNearbyHelp() {
        const locationInput = document.getElementById('locationInput');
        const searchBtn = document.getElementById('searchNearbyBtn');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const resultsList = document.getElementById('resultsList');
        
        const location = locationInput.value.trim();
        if (!location) {
            this.showNotification('Please enter a location or use current location', 'error');
            return;
        }
        
        searchBtn.style.display = 'none';
        loadingSpinner.style.display = 'flex';
        resultsList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><p>Searching for nearby healthcare facilities...</p></div>';
        
        try {
            // Initialize map if not already done
            if (!this.map) {
                await this.initializeMap();
            }
            
            // Geocode the location
            const locationCoords = await this.geocodeLocation(location);
            if (!locationCoords) {
                throw new Error('Could not find the specified location');
            }
            
            this.currentLocation = locationCoords;
            
            // Center map on location
            this.map.setCenter(locationCoords);
            this.map.setZoom(13);
            
            // Add user location marker
            this.addUserLocationMarker(locationCoords);
            
            // Search for nearby places
            const places = await this.searchNearbyPlaces(locationCoords);
            
            // Display results
            this.displaySearchResults(places);
            
            this.showNotification(`Found ${places.length} healthcare facilities nearby`, 'success');
            
        } catch (error) {
            console.error('Search error:', error);
            this.showNotification('Error searching for nearby facilities. Please try again.', 'error');
            resultsList.innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Unable to search for facilities. Please check your location and try again.</p></div>';
        } finally {
            searchBtn.style.display = 'inline-block';
            loadingSpinner.style.display = 'none';
        }
    }
    
    async initializeMap() {
        return new Promise((resolve, reject) => {
            const mapElement = document.getElementById('map');
            if (!mapElement) {
                reject(new Error('Map element not found'));
                return;
            }
            
            // Default location (New York City) if no current location
            const defaultLocation = this.currentLocation || { lat: 40.7128, lng: -74.0060 };

            if (this.isLeaflet) {
                // Initialize Leaflet map
                this.map = L.map(mapElement).setView([defaultLocation.lat, defaultLocation.lng], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap contributors'
                }).addTo(this.map);
                resolve();
                return;
            }

            // Google Maps path
            this.map = new google.maps.Map(mapElement, {
                center: defaultLocation,
                zoom: 13,
                styles: [
                    {
                        featureType: 'poi',
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    }
                ]
            });
            this.placesService = new google.maps.places.PlacesService(this.map);
            this.geocoder = new google.maps.Geocoder();
            resolve();
        });
    }
    
    geocodeLocation(location) {
        // Use Google Geocoder if available, otherwise Nominatim
        if (!this.isLeaflet) {
            return new Promise((resolve, reject) => {
                if (!this.geocoder) {
                    reject(new Error('Geocoder not initialized'));
                    return;
                }
                this.geocoder.geocode({ address: location }, (results, status) => {
                    if (status === 'OK' && results[0]) {
                        const loc = results[0].geometry.location;
                        resolve({ lat: loc.lat(), lng: loc.lng() });
                    } else {
                        reject(new Error('Geocoding failed'));
                    }
                });
            });
        }
        // Nominatim fallback
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
        return fetch(url, { headers: { 'Accept-Language': 'en' } })
            .then(r => r.json())
            .then(results => {
                if (results && results.length > 0) {
                    return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
                }
                throw new Error('Geocoding failed');
            });
    }
    
    searchNearbyPlaces(location) {
        // Google Places path
        if (!this.isLeaflet) {
            return new Promise((resolve, reject) => {
                if (!this.placesService) {
                    reject(new Error('Places service not initialized'));
                    return;
                }
                const request = {
                    location: location,
                    radius: 10000,
                    type: ['hospital', 'doctor', 'pharmacy', 'health']
                };
                this.placesService.nearbySearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        const healthcarePlaces = results
                            .filter(place => this.isHealthcarePlace(place))
                            .sort((a, b) => {
                                const distanceA = this.calculateDistance(location, a.geometry.location);
                                const distanceB = this.calculateDistance(location, b.geometry.location);
                                return distanceA - distanceB;
                            })
                            .slice(0, 20);
                        resolve(healthcarePlaces);
                    } else {
                        reject(new Error('Places search failed'));
                    }
                });
            });
        }
        // Overpass API fallback for OSM
        const radius = 10000; // 10 km
        const query = `[
          out:json
        ];
        (
          node["amenity"="hospital"](around:${radius},${location.lat},${location.lng});
          node["amenity"="clinic"](around:${radius},${location.lat},${location.lng});
          node["healthcare"](around:${radius},${location.lat},${location.lng});
          node["amenity"="doctors"](around:${radius},${location.lat},${location.lng});
          node["amenity"="pharmacy"](around:${radius},${location.lat},${location.lng});
        );
        out center 50;`;
        return fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: query
        }).then(r => r.json()).then(data => {
            const elements = (data.elements || []).slice(0, 30);
            return elements.map(el => ({
                name: el.tags && (el.tags.name || 'Unnamed facility'),
                vicinity: el.tags && (el.tags['addr:full'] || `${el.tags['addr:housenumber'] || ''} ${el.tags['addr:street'] || ''} ${el.tags['addr:city'] || ''}`.trim()),
                types: this.osmTagsToTypes(el.tags || {}),
                rating: null,
                geometry: { location: { lat: () => el.lat || (el.center && el.center.lat), lng: () => el.lon || (el.center && el.center.lon) } },
                place_id: `osm-${el.type}-${el.id}`,
                formatted_phone_number: null
            }));
        });
    }

    osmTagsToTypes(tags) {
        const types = [];
        if (tags.amenity === 'hospital') types.push('hospital');
        if (tags.amenity === 'clinic' || tags.healthcare === 'clinic') types.push('medical_center');
        if (tags.amenity === 'doctors') types.push('doctor');
        if (tags.amenity === 'pharmacy') types.push('pharmacy');
        if (tags.healthcare && (tags.healthcare.includes('psychology') || tags.healthcare.includes('psychiatry'))) types.push('psychologist');
        return types.length ? types : ['health'];
    }
    
    isHealthcarePlace(place) {
        const healthcareTypes = [
            'hospital', 'doctor', 'pharmacy', 'dentist', 'physiotherapist',
            'psychologist', 'psychiatrist', 'mental_health_counselor',
            'health', 'medical_center', 'clinic'
        ];
        
        return place.types.some(type => healthcareTypes.includes(type));
    }
    
    calculateDistance(location1, location2) {
        const R = 6371; // Earth's radius in km
        const dLat = (location2.lat() - location1.lat) * Math.PI / 180;
        const dLng = (location2.lng() - location1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(location1.lat * Math.PI / 180) * Math.cos(location2.lat() * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    addUserLocationMarker(location) {
        if (this.isLeaflet) {
            const marker = L.marker([location.lat, location.lng]).addTo(this.map).bindPopup('You are here');
            this.markers.push(marker);
            return;
        }
        const marker = new google.maps.Marker({
            position: location,
            map: this.map,
            title: 'Your Location',
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(24, 24)
            }
        });
        this.markers.push(marker);
    }
    
    displaySearchResults(places) {
        const resultsList = document.getElementById('resultsList');
        
        if (places.length === 0) {
            resultsList.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No healthcare facilities found in your area. Try expanding your search radius.</p></div>';
            return;
        }
        
        let html = '';
        
        places.forEach((place, index) => {
            const distance = this.calculateDistance(this.currentLocation, place.geometry.location);
            const placeType = this.getPlaceType(place.types);
            const rating = place.rating ? place.rating.toFixed(1) : 'N/A';
            const priceLevel = place.price_level ? '$'.repeat(place.price_level) : '';
            
            html += `
                <div class="result-item">
                    <div class="result-header">
                        <div class="result-name">${place.name}</div>
                        <div class="result-type">${placeType}</div>
                    </div>
                    <div class="result-address">${place.vicinity}</div>
                    <div class="result-details">
                        <div>
                            <span class="result-distance">${distance.toFixed(1)} km away</span>
                            ${place.rating ? `<span> • ⭐ ${rating} ${priceLevel}</span>` : ''}
                        </div>
                        <div class="result-actions">
                            <button class="btn-directions" onclick="app.getDirections('${place.place_id}')">
                                <i class="fas fa-directions"></i> Directions
                            </button>
                            ${place.formatted_phone_number ? `
                                <button class="btn-call" onclick="app.callPlace('${place.formatted_phone_number}')">
                                    <i class="fas fa-phone"></i> Call
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
            
            // Add marker to map
            this.addPlaceMarker(place, index);
        });
        
        resultsList.innerHTML = html;
    }
    
    getPlaceType(types) {
        if (types.includes('hospital')) return 'Hospital';
        if (types.includes('doctor')) return 'Medical Center';
        if (types.includes('pharmacy')) return 'Pharmacy';
        if (types.includes('psychologist') || types.includes('psychiatrist')) return 'Mental Health';
        if (types.includes('dentist')) return 'Dental';
        if (types.includes('physiotherapist')) return 'Physical Therapy';
        return 'Healthcare';
    }
    
    addPlaceMarker(place, index) {
        const iconColor = this.getMarkerColor(place.types);
        if (this.isLeaflet) {
            const lat = typeof place.geometry.location.lat === 'function' ? place.geometry.location.lat() : place.geometry.location.lat;
            const lng = typeof place.geometry.location.lng === 'function' ? place.geometry.location.lng() : place.geometry.location.lng;
            const marker = L.marker([lat, lng], {
            }).addTo(this.map);
            marker.bindPopup(`
                <div style="padding: 8px; max-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px;">${place.name}</h4>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${place.vicinity || ''}</p>
                </div>
            `);
            this.markers.push(marker);
            return;
        }
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.map,
            title: place.name,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 2C10.48 2 6 6.48 6 12c0 8 10 18 10 18s10-10 10-18c0-5.52-4.48-10-10-10z" fill="${iconColor}"/>
                        <circle cx="16" cy="12" r="4" fill="white"/>
                    </svg>
                `),
                scaledSize: new google.maps.Size(32, 32)
            }
        });
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 8px; max-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px;">${place.name}</h4>
                    <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${place.vicinity}</p>
                    ${place.rating ? `<p style="margin: 0; font-size: 12px;">⭐ ${place.rating.toFixed(1)}</p>` : ''}
                </div>
            `
        });
        marker.addListener('click', () => { infoWindow.open(this.map, marker); });
        this.markers.push(marker);
    }
    
    getMarkerColor(types) {
        if (types.includes('hospital')) return '#dc2626';
        if (types.includes('doctor')) return '#059669';
        if (types.includes('psychologist') || types.includes('psychiatrist')) return '#7c3aed';
        return '#6366f1';
    }
    
    clearMapMarkers() {
        this.markers.forEach(marker => {
            if (this.isLeaflet && marker.remove) {
                marker.remove();
            } else if (marker.setMap) {
                marker.setMap(null);
            }
        });
        this.markers = [];
    }
    
    getDirections(placeId) {
        if (!this.currentLocation) {
            this.showNotification('Please set your location first', 'error');
            return;
        }
        
        const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${this.currentLocation.lat},${this.currentLocation.lng}&destination=place_id:${placeId}`;
        window.open(directionsUrl, '_blank');
    }
    
    callPlace(phoneNumber) {
        window.open(`tel:${phoneNumber}`, '_self');
    }
}

// Global function for Google Maps callback
let app;
window.initMap = function() {
    // This function will be called when Google Maps API loads
    console.log('Google Maps API loaded');
};

// -----------------------
// Simple client-side Auth helper (demo only)
// -----------------------
window.Auth = (function(){
    // Demo users (hard-coded for UI demo). DO NOT use this in production.
    const demo = {
        // Keep a demo user (hidden from UI). Admin default updated per request.
        user: { email: 'user@example.com', password: 'user123', role: 'user' },
        admin: { email: 'admin123@gmail.com', password: 'admin@123', role: 'admin' }
    };

    function login(role, email, password) {
        email = (email || '').toLowerCase();
        password = password || '';
        if (!role || (role !== 'user' && role !== 'admin')) {
            return { success: false, message: 'Invalid role' };
        }

        // First check persisted demo users list in localStorage
        try {
            const stored = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            const found = stored.find(u => (u.email || '').toLowerCase() === email && u.password === password);
            if (found) {
                localStorage.setItem('loggedInRole', found.role || 'user');
                localStorage.setItem('loggedInToken', btoa(found.email + ':' + Date.now()));
                try { localStorage.setItem('loggedInUserEmail', found.email); } catch (e) {}
                return { success: true };
            }
        } catch (e) {
            // ignore
        }

        // Fallback to built-in demo accounts
        const record = demo[role];
        if (!record) return { success: false, message: 'No such role' };

        if (record.email === email && record.password === password) {
            // Save a tiny session token and role in localStorage for demo routing
            try {
                localStorage.setItem('loggedInRole', record.role);
                localStorage.setItem('loggedInToken', btoa(record.email + ':' + Date.now()));
                localStorage.setItem('loggedInUserEmail', record.email);
            } catch (e) {
                console.warn('Unable to persist session', e);
            }
            return { success: true };
        }

        return { success: false, message: 'Invalid email or password' };
    }

    // register(email, password, profile = { name, age, bloodGroup, height, weight, medical, avatarUrl })
    function register(email, password, profile) {
        email = (email || '').toLowerCase();
        password = password || '';
        profile = profile || {};
        if (!email || !password) return { success: false, message: 'Email and password required' };

        try {
            const stored = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            if (stored.find(u => (u.email || '').toLowerCase() === email)) {
                return { success: false, message: 'An account with this email already exists' };
            }

            const newUser = { id: Date.now().toString(), email, password, role: 'user', createdAt: Date.now(), profile };
            stored.push(newUser);
            localStorage.setItem('demoUsers', JSON.stringify(stored));

            // increment created counter
            try {
                const created = Number(localStorage.getItem('accountsCreated') || '0');
                localStorage.setItem('accountsCreated', String(created + 1));
            } catch (e) {}

            return { success: true, user: newUser };
        } catch (e) {
            console.error('Register error', e);
            return { success: false, message: 'Unable to persist account' };
        }
    }

    function getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem('demoUsers') || '[]');
        } catch (e) {
            console.warn('Failed to read demoUsers', e);
            return [];
        }
    }

    function getUserByEmail(email) {
        if (!email) return null;
        try {
            const stored = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            return stored.find(u => (u.email || '').toLowerCase() === (email || '').toLowerCase()) || null;
        } catch (e) {
            return null;
        }
    }

    function deleteUserByEmail(email) {
        if (!email) return { success: false, message: 'Email required' };
        try {
            let stored = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            const before = stored.length;
            stored = stored.filter(u => (u.email||'').toLowerCase() !== (email||'').toLowerCase());
            const after = stored.length;
            if (after === before) return { success: false, message: 'User not found' };
            localStorage.setItem('demoUsers', JSON.stringify(stored));
            // increment deleted counter
            try {
                const deleted = Number(localStorage.getItem('accountsDeleted') || '0');
                localStorage.setItem('accountsDeleted', String(deleted + 1));
            } catch (e) {}
            return { success: true };
        } catch (e) {
            return { success: false, message: 'Unable to delete user' };
        }
    }

    function deleteCurrentUser() {
        const email = localStorage.getItem('loggedInUserEmail');
        const res = deleteUserByEmail(email);
        if (res.success) {
            // clear session
            localStorage.removeItem('loggedInRole');
            localStorage.removeItem('loggedInToken');
            localStorage.removeItem('loggedInUserEmail');
            window.location.href = 'login.html';
        }
        return res;
    }

    function getAccountCounts() {
        const created = Number(localStorage.getItem('accountsCreated') || '0');
        const deleted = Number(localStorage.getItem('accountsDeleted') || '0');
        return { created, deleted };
    }

    function updateUserByEmail(email, changes) {
        if (!email) return { success: false, message: 'Email required' };
        try {
            const stored = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            const idx = stored.findIndex(u => (u.email||'').toLowerCase() === (email||'').toLowerCase());
            if (idx === -1) return { success: false, message: 'User not found' };
            const user = stored[idx];
            // Merge shallow changes for profile and top-level fields
            if (changes.profile) {
                user.profile = Object.assign({}, user.profile || {}, changes.profile);
            }
            // allow changing password or other top-level fields if provided
            Object.keys(changes).forEach(k => {
                if (k === 'profile') return;
                user[k] = changes[k];
            });
            stored[idx] = user;
            localStorage.setItem('demoUsers', JSON.stringify(stored));
            return { success: true, user };
        } catch (e) {
            return { success: false, message: 'Unable to update user' };
        }
    }

    function getAllUsers() {
        try {
            return JSON.parse(localStorage.getItem('demoUsers') || '[]');
        } catch (e) {
            console.warn('Failed to read demoUsers', e);
            return [];
        }
    }

    function getUserByEmail(email) {
        if (!email) return null;
        try {
            const stored = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            return stored.find(u => (u.email || '').toLowerCase() === (email || '').toLowerCase()) || null;
        } catch (e) {
            return null;
        }
    }

    function logout() {
        localStorage.removeItem('loggedInRole');
        localStorage.removeItem('loggedInToken');
        window.location.href = 'login.html';
    }

    return { login, logout, register, getAllUsers, getUserByEmail, deleteUserByEmail, deleteCurrentUser, getAccountCounts, updateUserByEmail };
})();

// Small global UI helpers
window.UI = (function(){
    function ensureContainer() {
        let c = document.getElementById('globalToastContainer');
        if (c) return c;
        c = document.createElement('div');
        c.id = 'globalToastContainer';
        c.style.position = 'fixed';
        c.style.right = '1rem';
        c.style.bottom = '1rem';
        c.style.zIndex = '9999';
        c.style.display = 'flex';
        c.style.flexDirection = 'column';
        c.style.gap = '0.5rem';
        document.body.appendChild(c);
        return c;
    }

    function showToast(message, type) {
        const container = ensureContainer();
        const el = document.createElement('div');
        el.className = 'global-toast ' + (type || 'info');
        el.style.background = type === 'error' ? '#ffefef' : (type === 'success' ? '#e9ffef' : '#fff');
        el.style.border = '1px solid ' + (type === 'error' ? '#f5c6c6' : (type === 'success' ? '#bfeebb' : '#ddd'));
        el.style.padding = '0.6rem 0.8rem';
        el.style.borderRadius = '6px';
        el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)';
        el.style.minWidth = '220px';
        el.style.fontSize = '0.95rem';
        el.textContent = message;
        container.appendChild(el);
        setTimeout(() => {
            el.style.transition = 'opacity 300ms ease';
            el.style.opacity = '0';
            setTimeout(() => container.removeChild(el), 350);
        }, 3500);
    }

    return { showToast };
})();

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app = new MentalWellbeingApp();
});

// Add some additional utility functions
window.MentalWellbeingUtils = {
    // Format date for display
    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Get mood emoji based on rating
    getMoodEmoji: (rating) => {
        if (rating >= 9) return '😊';
        if (rating >= 7) return '🙂';
        if (rating >= 5) return '😐';
        if (rating >= 3) return '😕';
        return '😢';
    },
    
    // Get mood description
    getMoodDescription: (rating) => {
        if (rating >= 9) return 'Excellent';
        if (rating >= 7) return 'Good';
        if (rating >= 5) return 'Okay';
        if (rating >= 3) return 'Low';
        return 'Very Low';
    }
};
