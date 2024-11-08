import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { message } from "antd";

export const exportToPDF = async () => {
  try {
    // Tạm thời ẩn nút Browse Store và các phần không cần thiết
      const storeSection = document.querySelector('.store-section');
      const exportButtons = document.querySelectorAll('.export-button');
      if (storeSection) storeSection.style.display = 'none';
      exportButtons.forEach(btn => btn.style.display = 'none');
  
      const modalContent = document.querySelector('.water-quality-modal .ant-modal-body');
      const canvas = await html2canvas(modalContent, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
  
      // Khôi phục hiển thị các phần đã ẩn
      if (storeSection) storeSection.style.display = 'block';
      exportButtons.forEach(btn => btn.style.display = 'block');
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
  
      // Thêm header
      pdf.setFillColor(235, 245, 255);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      // Thêm logo hoặc icon (nếu có)
      // pdf.addImage(logoUrl, 'PNG', margin, margin, 20, 20);
  
      // Tiêu đề chính
      pdf.setFontSize(20);
      pdf.setTextColor(44, 62, 80);
      pdf.text('Water Quality Analysis Report', pageWidth / 2, 20, { align: 'center' });
  
      // Thông tin thời gian
      pdf.setFontSize(10);
      pdf.setTextColor(127, 140, 141);
      const date = new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      pdf.text(`Generated on: ${date}`, pageWidth / 2, 30, { align: 'center' });
  
      // Thêm đường kẻ phân cách
      pdf.setDrawColor(189, 195, 199);
      pdf.line(margin, 45, pageWidth - margin, 45);
  
      // Thêm nội dung chính
      const imgWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, 50, imgWidth, imgHeight);
  
      // Thêm footer
      const footerY = pageHeight - 10;
      pdf.setFontSize(8);
      pdf.setTextColor(127, 140, 141);
      pdf.text('© 2024 Koi Management System - Confidential Report', pageWidth / 2, footerY, { align: 'center' });
  
      // Lưu file với tên có format
      const fileName = `water-quality-report-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
  
      message.success('Report exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      message.error('Failed to export report. Please try again.');
    }
  };