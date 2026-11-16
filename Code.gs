const SHEET_NAME = 'Data mentah';

function doGet() {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('Portal Rasmi Penempatan Praktikum Fasa 2 | Unit Amalan Profesional')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, maximum-scale=5');
}

function getDashboardData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  
  if (lastRow < 4) return { students: [], stats: {} };
  
  // Data bermula baris 4, lajur C (3) hingga lajur Q (17) -> 15 lajur
  const rawData = sheet.getRange(4, 3, lastRow - 3, 15).getValues();
  
  const students = [];
  const schoolCount = {};
  const majorCount = {};
  const kumpulanCount = {};

  rawData.forEach(row => {
    const nama = String(row[1] || '').trim();
    if (!nama) return;

    const bil = row[0];
    const kumpulan = String(row[2] || '').trim();
    const ic = String(row[3] || '').trim();
    const tel = String(row[4] || '-').trim();
    const major = String(row[5] || '').trim();
    const minor = String(row[6] || '-').trim();
    const alamat = [row[7], row[8], row[9], row[10], row[11]]
      .map(v => String(v || '').trim())
      .filter(v => v && v !== '-')
      .join(', ');
    const sekolahFasa2 = String(row[14] || 'Belum Ditetapkan').trim();

    students.push({
      bil,
      nama,
      kumpulan,
      ic,
      tel,
      major,
      minor,
      alamat,
      sekolahFasa2
    });

    schoolCount[sekolahFasa2] = (schoolCount[sekolahFasa2] || 0) + 1;
    majorCount[major] = (majorCount[major] || 0) + 1;
    kumpulanCount[kumpulan] = (kumpulanCount[kumpulan] || 0) + 1;
  });

  const schoolAnalysis = Object.entries(schoolCount)
    .map(([sekolah, jumlah]) => ({ sekolah, jumlah }))
    .sort((a, b) => b.jumlah - a.jumlah || a.sekolah.localeCompare(b.sekolah));

  return {
    students: students,
    stats: {
      totalStudents: students.length,
      totalSchools: schoolAnalysis.length,
      totalKumpulan: Object.keys(kumpulanCount).length,
      majorCount: majorCount,
      schoolAnalysis: schoolAnalysis
    }
  };
}
