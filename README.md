# ⚾ Softball Lineup Generator

A comprehensive web application for generating fair, printable softball lineups for 6-inning games with smart constraints and live editing capabilities.

## 🎯 Features

### Core Functionality
- **Smart Lineup Generation**: Automatically generates balanced lineups respecting all constraints
- **6-Inning Support**: Fixed 6-inning format with all players batting every inning
- **Position Management**: 9 fielders per inning with bench rotation
- **Pitcher Constraints**: Enforces max 2 consecutive innings and max 3 total innings pitched

### Advanced Constraints
- **Availability Management**: Set player availability for specific innings
- **Position Eligibility**: Mark players eligible for P, C, IF, OF positions
- **Fairness Rules**: Balance playing time, avoid back-to-back bench stints
- **Premium Position Limits**: Control innings for C, SS, 1B positions

### Live Editing
- **Drag & Drop**: Move players between positions and innings
- **Real-time Validation**: Instant feedback on constraint violations
- **Inning Locking**: Lock specific innings during rebalancing
- **Undo/Redo**: Full history tracking for all changes

### Export & Print
- **PDF Export**: Professional lineup sheets with all details
- **CSV Export**: Data export for record keeping
- **PNG Export**: Screenshot of current lineup board
- **Print Support**: Browser-optimized printing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with ES6+ support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd softball-lineup-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 Usage Guide

### 1. Setting Up Your Roster

- **Add Players**: Click "+ Add Player" in the Roster panel
- **Player Details**: Enter first/last name, jersey number (optional)
- **Position Eligibility**: Check boxes for P, C, IF, OF positions
- **Availability**: Set start/end innings (1-6) for each player

### 2. Game Configuration

- **Basic Info**: Team name, opponent, date, field, home/away
- **Constraints**: Toggle pitcher rules, fairness settings
- **Position Limits**: Set maximum innings for premium positions

### 3. Generating Lineups

- **Auto-Generate**: Click "🎲 Regenerate Lineup" for new assignments
- **Smart Algorithm**: Automatically respects all constraints
- **Validation**: Check status bar for errors/warnings

### 4. Live Editing

- **Drag & Drop**: Move players between positions and innings
- **Real-time Updates**: Validation happens instantly
- **Lock Innings**: Use 🔒 button to prevent changes during rebalancing
- **Rebalance**: Use 🔄 button to regenerate from specific inning

### 5. Export & Print

- **PDF**: Complete lineup sheet with all details
- **CSV**: Data export for analysis
- **Print**: Browser print dialog for physical copies

## 🏗️ Architecture

### Data Models
- **Player**: Individual player with eligibility and availability
- **GameConfig**: Game settings and constraint configuration
- **Lineup**: Complete lineup with batting order and fielding assignments

### Constraint Solver
- **Multi-Pass Algorithm**: Pitchers → Catchers → Positions → Bench
- **Smart Selection**: Prioritizes fair distribution and constraint satisfaction
- **Backtracking**: Handles complex constraint scenarios

### State Management
- **History Tracking**: Full undo/redo capability
- **Real-time Validation**: Instant constraint checking
- **Persistent State**: Optional localStorage saving

## 🎨 UI Components

### Left Panel - Roster Management
- Player list with drag-and-drop
- Add/edit/remove players
- Availability settings
- Position eligibility badges

### Center - Inning Board
- 6 columns for innings 1-6
- 10 rows for positions + bench
- Drag-and-drop between positions
- Lock/rebalance controls

### Right Panel - Batting Order
- Numbered batting order
- Drag to reorder
- Player statistics summary
- Position eligibility display

### Status Bar
- Validation errors and warnings
- Pitching summary
- Action buttons (undo, redo, regenerate)

## 🔧 Configuration Options

### Pitcher Rules
- **Max Consecutive**: 2 innings
- **Max Total**: 3 innings
- **Enforcement**: Toggle on/off

### Fairness Constraints
- **Min Field Innings**: Per player minimum
- **Position Limits**: Avoid overuse of same position
- **Bench Rotation**: Prevent back-to-back bench stints

### Premium Positions
- **Catcher**: Max innings limit
- **Shortstop**: Max innings limit
- **First Base**: Max innings limit

## 📱 Responsive Design

- **Desktop**: Full 3-column layout
- **Tablet**: Stacked layout with scrollable sections
- **Mobile**: Single-column layout optimized for touch

## 🖨️ Print & Export

### PDF Export
- Team and game information
- Complete batting order
- Inning-by-inning fielding chart
- Pitching summary with violations
- Validation issues report

### CSV Export
- Fielding assignments by inning
- Batting order
- Pitching statistics
- Player availability

### Print Layout
- Print-optimized CSS
- Clean, professional appearance
- Mobile-friendly formatting

## 🧪 Testing Scenarios

### Acceptance Criteria Validation

1. **12 Players, 1 Absent**
   - Only 9 fielders per inning
   - All available players bat every inning
   - No duplicate assignments

2. **Pitcher Constraints**
   - Blocks 3+ consecutive innings
   - Blocks 4+ total innings
   - Flags violations when overridden

3. **Live Editing**
   - Drag player from bench to position
   - Instant validation updates
   - Maintains constraint integrity

4. **Rebalancing**
   - Locks previous innings
   - Regenerates from specified inning
   - Preserves batting order

## 🚀 Performance Features

- **Efficient Rendering**: React optimization for large rosters
- **Smart Updates**: Only re-render changed components
- **Memory Management**: Limited history stack (50 operations)
- **Lazy Loading**: Components load on demand

## 🔒 Data Security

- **Client-Side Only**: No data sent to external servers
- **Local Storage**: Optional save/load functionality
- **Privacy First**: All data stays on user's device

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch
3. Install dependencies
4. Make changes
5. Test thoroughly
6. Submit pull request

### Code Standards
- ES6+ JavaScript
- React functional components with hooks
- CSS custom properties for theming
- Responsive design principles

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

### Common Issues
- **Drag & Drop Not Working**: Ensure modern browser with ES6+ support
- **PDF Export Fails**: Check browser console for errors
- **Performance Issues**: Limit roster size for very large teams

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Roadmap

### Future Features
- **Team Templates**: Save/load team configurations
- **Advanced Statistics**: Detailed playing time analysis
- **Mobile App**: Native mobile application
- **Cloud Sync**: Multi-device lineup management
- **Tournament Mode**: Multi-game scheduling

### Performance Improvements
- **Web Workers**: Background constraint solving
- **Virtual Scrolling**: Handle very large rosters
- **Offline Support**: Service worker implementation

---

**Built with ❤️ for softball coaches and teams everywhere!**

For questions, issues, or feature requests, please open an issue on GitHub.
