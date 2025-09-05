import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const exportToPDF = (lineup, config) => {
  const doc = new jsPDF();
  
  // Page 1: Header and Batting Order
  doc.setFontSize(20);
  doc.text(`${config.teamName} vs ${config.opponent}`, 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(`Date: ${config.date}`, 20, 35);
  doc.text(`Field: ${config.field}`, 20, 42);
  doc.text(`Home/Away: ${config.isHome ? 'Home' : 'Away'}`, 20, 49);
  
  // Batting Order
  doc.setFontSize(16);
  doc.text('Batting Order', 20, 65);
  
  const battingOrderData = lineup.battingOrder.map((player, index) => [
    index + 1,
    player.number || '',
    `${player.firstName} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}`
  ]);
  
  doc.autoTable({
    startY: 70,
    head: [['#', 'Jersey', 'Player Name']],
    body: battingOrderData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] }
  });
  
  // Add new page for fielding assignments
  doc.addPage();
  
  // Page 2: Fielding Assignments
  doc.setFontSize(20);
  doc.text('Fielding Assignments by Inning', 105, 20, { align: 'center' });
  
  const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Bench'];
  const fieldingData = positions.map(pos => {
    const row = [pos];
    for (let inning = 1; inning <= 6; inning++) {
      if (pos === 'Bench') {
        const benchPlayers = lineup.fieldingAssignments[inning].Bench;
        if (Array.isArray(benchPlayers) && benchPlayers.length > 0) {
          const benchNames = benchPlayers.map(p => 
            `${p.firstName} ${p.lastName ? p.lastName.charAt(0) + '.' : ''}`
          ).join(', ');
          row.push(benchNames);
        } else {
          row.push('-');
        }
      } else {
        const player = lineup.fieldingAssignments[inning][pos];
        if (player) {
          row.push(`${player.firstName} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}`);
        } else {
          row.push('-');
        }
      }
    }
    return row;
  });
  
  doc.autoTable({
    startY: 30,
    head: [['Position', 'Inning 1', 'Inning 2', 'Inning 3', 'Inning 4', 'Inning 5', 'Inning 6']],
    body: fieldingData,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 }
  });
  
  // Save the PDF
  doc.save(`${config.teamName}_vs_${config.opponent}_${config.date}.pdf`);
};

export const exportToCSV = (lineup, config) => {
  const positions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'Bench'];
  
  // Create CSV header
  let csv = 'Position,Inning 1,Inning 2,Inning 3,Inning 4,Inning 5,Inning 6\n';
  
  // Add fielding assignments
  positions.forEach(pos => {
    const row = [pos];
    for (let inning = 1; inning <= 6; inning++) {
      if (pos === 'Bench') {
        const benchPlayers = lineup.fieldingAssignments[inning].Bench;
        if (Array.isArray(benchPlayers) && benchPlayers.length > 0) {
          const benchNames = benchPlayers.map(p => 
            `${p.firstName} ${p.lastName ? p.lastName.charAt(0) + '.' : ''}`
          ).join('; ');
          row.push(benchNames);
        } else {
          row.push('');
        }
      } else {
        const player = lineup.fieldingAssignments[inning][pos];
        if (player) {
          row.push(`${player.firstName} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}`);
        } else {
          row.push('');
        }
      }
    }
    csv += row.join(',') + '\n';
  });
  
  // Add batting order
  csv += '\nBatting Order\n';
  lineup.battingOrder.forEach((player, index) => {
    csv += `${index + 1},${player.number || ''},${player.firstName} ${player.lastName ? player.lastName.charAt(0) + '.' : ''}\n`;
  });
  
  // Create and download CSV
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${config.teamName}_vs_${config.opponent}_${config.date}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportToPNG = async (elementId, filename) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found for PNG export');
      return;
    }
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const link = document.createElement('a');
    link.download = filename || 'lineup.png';
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('Error exporting to PNG:', error);
  }
};

export const printLineup = () => {
  window.print();
};
