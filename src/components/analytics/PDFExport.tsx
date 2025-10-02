import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Injection {
  peptide_name: string;
  dose_amount: number;
  dose_unit: string;
  injection_site: string;
  injection_date: string;
  notes?: string;
}

interface Vial {
  peptide_name: string;
  total_amount_mg: number;
  remaining_amount_mg: number;
  bac_water_ml: number;
  reconstitution_date: string;
  cost?: number;
}

interface Stats {
  totalInjections: number;
  averageDose: number;
  activeVials: number;
  totalSpent: number;
  avgCostPerInjection: number;
}

interface PDFExportProps {
  injections: Injection[];
  vials: Vial[];
  stats: Stats;
}

export function PDFExport({ injections, vials, stats }: PDFExportProps) {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // Primary color
    doc.text("Peptide Health Report", pageWidth / 2, 20, { align: "center" });
    
    // Date
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 28, { align: "center" });
    
    // Stats Summary
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Summary Statistics", 14, 40);
    
    doc.setFontSize(10);
    doc.text([
      `Total Injections: ${stats.totalInjections}`,
      `Average Dose: ${stats.averageDose.toFixed(2)} mg`,
      `Active Vials: ${stats.activeVials}`,
      `Total Spent: $${stats.totalSpent.toFixed(2)}`,
      `Average Cost per Injection: $${stats.avgCostPerInjection.toFixed(2)}`,
    ], 14, 48);
    
    // Injection History Table
    doc.setFontSize(14);
    doc.text("Recent Injection History", 14, 85);
    
    const injectionData = injections.slice(0, 20).map(inj => [
      new Date(inj.injection_date).toLocaleDateString(),
      inj.peptide_name,
      `${inj.dose_amount} ${inj.dose_unit}`,
      inj.injection_site,
      inj.notes || "-",
    ]);
    
    autoTable(doc, {
      startY: 90,
      head: [["Date", "Peptide", "Dose", "Site", "Notes"]],
      body: injectionData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 },
    });
    
    // Vial Inventory
    const finalY = (doc as any).lastAutoTable.finalY || 90;
    doc.setFontSize(14);
    doc.text("Current Vial Inventory", 14, finalY + 15);
    
    const vialData = vials.map(vial => [
      vial.peptide_name,
      `${vial.remaining_amount_mg} / ${vial.total_amount_mg} mg`,
      `${vial.bac_water_ml} mL`,
      new Date(vial.reconstitution_date).toLocaleDateString(),
      vial.cost ? `$${vial.cost.toFixed(2)}` : "-",
    ]);
    
    autoTable(doc, {
      startY: finalY + 20,
      head: [["Peptide", "Remaining/Total", "BAC Water", "Reconstituted", "Cost"]],
      body: vialData,
      theme: "striped",
      headStyles: { fillColor: [59, 130, 246] },
      styles: { fontSize: 8 },
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(150);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
      doc.text(
        "This report is for personal health tracking purposes only. Consult with a healthcare provider.",
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 5,
        { align: "center" }
      );
    }
    
    // Save
    doc.save(`peptide-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <Button onClick={generatePDF} variant="outline">
      <Download className="h-4 w-4 mr-2" />
      Export PDF Report
    </Button>
  );
}
