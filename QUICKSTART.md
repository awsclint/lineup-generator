# 🚀 Quick Start Guide

## Get Started in 3 Steps

### 1. Start the Application
```bash
npm run dev
```
The app will open automatically at http://localhost:3000

### 2. Use the Sample Data
The app comes pre-loaded with a 12-player roster:
- **Thunder** vs **Lightning** 
- **Date**: Today
- **Field**: Central Park Field 3

### 3. Generate Your First Lineup
1. Click **"🎲 Regenerate Lineup"** in the status bar
2. Review the generated lineup
3. Use drag & drop to make adjustments
4. Export to PDF or print

## 🎯 Key Features to Try

### Roster Management
- **Add Player**: Click "+ Add Player" in left panel
- **Edit Player**: Click "Edit" on any player card
- **Set Availability**: Adjust start/end innings (1-6)
- **Position Eligibility**: Check P, C, IF, OF boxes

### Lineup Generation
- **Auto-Generate**: Click regenerate button for new lineup
- **Drag & Drop**: Move players between positions
- **Lock Innings**: Use 🔒 to prevent changes
- **Rebalance**: Use 🔄 to regenerate from specific inning

### Export & Print
- **PDF**: Complete lineup sheet
- **CSV**: Data export
- **Print**: Browser print dialog

## 🏆 Sample Test Scenarios

### Test 1: Basic Lineup
1. Generate lineup with sample data
2. Verify 9 fielders per inning
3. Check all players bat every inning

### Test 2: Pitcher Constraints
1. Look for pitcher assignments
2. Verify max 2 consecutive innings
3. Verify max 3 total innings

### Test 3: Live Editing
1. Drag a player from bench to position
2. Check validation updates
3. Use undo/redo buttons

### Test 4: Export
1. Click "Export PDF"
2. Verify complete lineup sheet
3. Check pitching summary

## 🆘 Need Help?

- **Validation Issues**: Check status bar for errors/warnings
- **Drag & Drop**: Ensure modern browser support
- **Export Problems**: Check browser console for errors
- **Performance**: Limit roster size for very large teams

## 🎉 You're Ready!

The application is fully functional with:
- ✅ Smart constraint solving
- ✅ Real-time validation
- ✅ Professional export options
- ✅ Mobile-responsive design
- ✅ Full undo/redo support

Start creating your softball lineups today!
