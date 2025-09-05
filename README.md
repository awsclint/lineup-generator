# ⚾ Softball Lineup Generator

A modern web application for generating fair, printable softball lineups for 6-inning games with smart constraints and live editing capabilities.

## 🎯 Features

### Core Functionality
- **Smart Lineup Generation**: Automatically generates balanced lineups respecting all constraints
- **6-Inning Support**: Fixed 6-inning format with all players batting every inning
- **Position Management**: 9 fielders per inning with bench rotation
- **Pitcher Constraints**: Enforces max 2 consecutive innings and max 3 total innings pitched

### Player Management
- **Roster Management**: Add, edit, and remove players with full details
- **Position Eligibility**: Mark players eligible for specific positions (P, C, 1B, 2B, 3B, SS, LF, CF, RF)
- **Availability Settings**: Set player availability for specific innings (1-6)
- **Jersey Numbers**: Optional jersey number assignment

### Live Editing
- **Drag & Drop**: Move players between positions and innings with visual feedback
- **Real-time Validation**: Instant feedback on constraint violations
- **Inning Locking**: Lock specific innings during rebalancing
- **Visual Indicators**: Clear insertion points during drag operations

### Lineup Management
- **Save Lineups**: Save and name batting orders for future use
- **Import/Export**: Share lineups with other coaches via JSON files
- **Load Lineups**: Quickly switch between saved lineups
- **Rename/Delete**: Manage your saved lineup collection

### Export & Print
- **PDF Export**: Professional lineup sheets with game information
- **CSV Export**: Data export for record keeping
- **Print Support**: Browser-optimized printing with separate pages for batting order and fielding assignments

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ and npm
- Modern web browser

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
   Navigate to `http://localhost:3001` (or the port shown in terminal)

### Build for Production
```bash
npm run build
npm run preview
```

## 📖 How to Use

### 1. Add Your Players
- Go to **Roster Management** tab
- Click **"+ Add Player"** button
- Enter player details: name, jersey number (optional)
- Select position eligibility (P, C, 1B, 2B, 3B, SS, LF, CF, RF)
- Set availability (which innings they can play)

### 2. Configure Game Info
- Go to **Fielding Assignments** tab
- Click **"Edit Game Info"** button
- Enter team name, opponent, date, time, and location

### 3. Generate Lineup
- Click **"🎲 Regenerate Lineup"** to auto-generate
- The system will create a fair lineup respecting all constraints
- Check the status bar for any validation messages

### 4. Customize Your Lineup
- **Drag & Drop**: Move players between positions and innings
- **Reorder Batting**: Drag players in the batting order panel
- **Lock Innings**: Use the 🔒 button to prevent changes to specific innings
- **Rebalance**: Use 🔄 button to regenerate from a specific inning

### 5. Save and Export
- **Save Lineup**: Click **"📋 Manage Lineups"** to save your current lineup
- **Export**: Use **"PDF"** or **"CSV"** buttons to export your lineup
- **Print**: Use your browser's print function for physical copies

## 🎨 Interface Overview

### Roster Management
- Add and manage your team roster
- Set position eligibility and availability
- Import/export roster data

### Batting Order Panel
- Shows the current batting order
- Drag to reorder players
- Visual indicators during drag operations

### Fielding Assignments
- 6 columns for innings 1-6
- 10 rows for positions + bench
- Drag players between positions
- Lock/rebalance controls

### Status Bar
- Shows validation messages
- Action buttons for lineup management
- Export options

## 🔧 Key Features

### Smart Constraints
- **Pitcher Limits**: Max 2 consecutive innings, max 3 total
- **Fair Playing Time**: Balanced distribution across innings
- **Position Eligibility**: Only eligible players can play each position
- **Availability**: Respects player availability settings

### Visual Feedback
- **Drag Indicators**: Shows where players will be inserted
- **Color-coded Positions**: Easy identification of position types
- **Real-time Validation**: Instant feedback on constraint violations

### Data Persistence
- **Auto-save**: Automatically saves your work
- **Lineup Storage**: Save multiple lineups with custom names
- **Roster Backup**: Export/import roster data

## 🖨️ Export Options

### PDF Export
- Professional lineup sheets
- Game information header
- Separate pages for batting order and fielding assignments
- Clean, print-ready format

### CSV Export
- Fielding assignments by inning
- Batting order
- Player information
- Easy to import into spreadsheets

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment

This application is ready for deployment to:
- **AWS Amplify** (recommended)
- **Vercel**
- **Netlify**
- Any static hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ for softball coaches and teams everywhere!**

For questions or issues, please open an issue on GitHub.