import { jsPDF } from "jspdf";

const GeneratePdf = async (payment) => {
  console.log("generatePDF called with payment:", payment);

  const pdf = new jsPDF();

  // Add company information
  pdf.setFontSize(20);
  pdf.text("Birra Group House Apartment", pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" });

  pdf.setFontSize(12);
  pdf.text("Addis Ababa ,Bole ,Ethiopia", pdf.internal.pageSize.getWidth() / 2, 30, { align: "center" });

  // Add payment and vendor information
  pdf.text(`Receipt for: ${payment.Vendor.fname} ${payment.Vendor.lname}`, 10, 50);
  pdf.text(`Vendor Address: ${payment.Vendor.address}`, 10, 60);
  pdf.text(`Vendor Phone: ${payment.Vendor.phone}`, 10, 70);
  pdf.text(`Vendor Email: ${payment.Vendor.email}`, 10, 80);

  const paymentDate = new Date(payment.paymentDate).toLocaleString();
  pdf.text(`Payment Date: ${paymentDate}`, pdf.internal.pageSize.getWidth() - 10, 50, { align: "right" });
  pdf.text(`Payment Method: ${payment.paymentMethod}`, pdf.internal.pageSize.getWidth() - 10, 60, { align: "right" });
  pdf.text(`Status: ${payment.status}`, pdf.internal.pageSize.getWidth() - 10, 70, { align: "right" });

  // Add item list
  pdf.text("Item List:", 10, 100);
  pdf.text(`Price: ETB-${payment.price}`, 10, 110);

  // Add total price
  pdf.setFontSize(16);
  pdf.text(`Total Price: ETB-${payment.price}`, pdf.internal.pageSize.getWidth() - 10, 130, { align: "right" });

  try {
    // Fetch the image as a Base64 string
    const response = await fetch("/seal.png"); // Ensure "intro.png" is inside the "public" folder
    const blob = await response.blob();
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64data = reader.result;
      const imgWidth = pdf.internal.pageSize.getWidth() / 4;
      const imgHeight = 45; // Set fixed height for watermark
      const imgX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2; // Center X
      const imgY = 65; // Position just above the item list (which starts at y = 100)
      
      pdf.addImage(base64data, "PNG", imgX, imgY, imgWidth, imgHeight, undefined, 'NONE');
      pdf.save(`receipt_${payment.id}.pdf`);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Failed to load watermark image", error);
    pdf.save(`receipt_${payment.id}.pdf`); // Save PDF even if image fails to load
  }
};

export default GeneratePdf;