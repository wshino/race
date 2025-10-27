# Tokyo Tesla 3D Drive

An immersive browser-based 3D driving simulation featuring a Tesla Model S autonomously driving through Tokyo's Shuto Expressway C1 loop. Experience the thrill of high-speed driving through a neon-lit Tokyo night with Gran Turismo-style driver's view perspective.

## Features

- **Autonomous Driving**: Sit back and enjoy the ride - the Tesla drives itself
- **Driver's View**: Immersive first-person perspective from the driver's seat
- **Shuto Expressway C1**: Loop around Tokyo's famous circular expressway
- **Night Mode**: Experience Tokyo's stunning nighttime cityscape
- **Speed Effects**: Motion blur, particles, and dynamic camera movements for enhanced immersion
- **Real-time 3D**: Powered by Three.js for smooth 60 FPS performance
- **Simple Controls**: Just press START and enjoy the endless drive

## Technology Stack

- **Three.js**: WebGL-based 3D rendering
- **Pure JavaScript**: No frameworks required
- **HTML5 Canvas**: Hardware-accelerated rendering
- **Post-Processing**: Bloom effects for enhanced visuals

## Quick Start

### Running Locally

1. Clone this repository:
```bash
git clone <repository-url>
cd race
```

2. Serve the files using any HTTP server:

**Using Python 3:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

4. Click the **START** button and enjoy the ride!

## Controls

- **START Button**: Begin the driving simulation
- **ESC Key** or **Stop Button**: Return to start screen
- **No driving controls**: The vehicle is fully autonomous

## Browser Compatibility

Recommended browsers:
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

Requires WebGL support and modern JavaScript features.

## Performance

The application is optimized for:
- **Target**: 60 FPS on modern hardware
- **Resolution**: Adaptive based on device
- **GPU**: Utilizes hardware acceleration
- **Mobile**: Responsive design (desktop recommended for best experience)

## Project Structure

```
race/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styling and UI
├── js/
│   ├── main.js         # Application entry point
│   ├── scene.js        # Scene management
│   ├── track.js        # Highway path system
│   ├── vehicle.js      # Tesla Model S
│   ├── environment.js  # Skybox, lighting, fog
│   └── effects.js      # Visual effects
└── assets/             # Future: 3D models, textures
```

## Features Detail

### Track System
- Smooth curved path using CatmullRomCurve3
- Lane markings and guardrails
- Tunnel sections
- Street lighting
- Seamless looping

### Vehicle System
- Simplified Tesla Model S geometry
- Interior dashboard and steering wheel
- Animated steering based on turns
- Headlights with dynamic beams
- Speed-based animations

### Environment
- Tokyo cityscape with buildings
- Night sky with stars
- Dynamic street lighting
- Atmospheric fog
- Building windows with lighting

### Effects
- Particle system for speed sensation
- Camera shake based on speed
- Motion trails
- Bloom post-processing
- Speed-reactive opacity

## Future Enhancements

Potential additions:
- [ ] Multiple vehicle options
- [ ] Day/night cycle toggle
- [ ] Weather effects (rain, fog)
- [ ] Additional routes
- [ ] Sound effects and music
- [ ] VR support
- [ ] Higher quality 3D models
- [ ] Real Tokyo landmarks
- [ ] Traffic simulation
- [ ] Replay system

## Development

Built with modern web technologies and best practices:
- Modular JavaScript classes
- Efficient geometry management
- Memory-conscious resource handling
- Responsive design patterns
- Performance optimization techniques

## License

This project is for educational and demonstration purposes.

## Credits

- **Three.js**: 3D rendering library
- **Inspiration**: Gran Turismo series, Tokyo street racing culture
- **Concept**: Relaxing endless driving experience

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## Known Issues

- Post-processing effects may not work in older browsers
- Mobile performance may vary
- Some browsers may throttle animations when tab is not active

## Troubleshooting

**Black screen on start:**
- Check browser console for errors
- Ensure WebGL is enabled
- Try disabling browser extensions
- Refresh the page

**Low FPS:**
- Close other tabs/applications
- Reduce browser window size
- Check GPU drivers are updated
- Try in Chrome for best performance

**Nothing happens when clicking START:**
- Check browser console
- Ensure JavaScript is enabled
- Try hard refresh (Ctrl+F5)

---

Enjoy your endless drive through Tokyo! 🚗💨🗼
