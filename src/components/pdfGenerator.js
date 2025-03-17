import { jsPDF } from "jspdf";

const GeneratePdf = async (payments) => {
  console.log("generatePDF called with payments:", payments);

  if (payments.length === 0) {
    console.error("No payments provided");
    return;
  }

  const vendor = payments[0].Vendor;
  const pdf = new jsPDF();

  // Add company information
  pdf.setFontSize(20);
  pdf.text("Birra Group House Apartment", pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" });

  pdf.setFontSize(12);
  pdf.text("Addis Ababa ,Bole ,Ethiopia", pdf.internal.pageSize.getWidth() / 2, 30, { align: "center" });

  // Add payment and vendor information
  pdf.text(`Receipt for: ${vendor.fname} ${vendor.lname}`, 10, 50);
  pdf.text(`Vendor Address: ${vendor.address}`, 10, 60);
  pdf.text(`Vendor Phone: ${vendor.phone}`, 10, 70);
  pdf.text(`Vendor Email: ${vendor.email}`, 10, 80);

  const paymentDate = new Date(payments[0].paymentDate).toLocaleString();
  pdf.text(`Payment Date: ${paymentDate}`, pdf.internal.pageSize.getWidth() - 10, 50, { align: "right" });
  pdf.text(`Payment Method: ${payments[0].paymentMethod}`, pdf.internal.pageSize.getWidth() - 10, 60, { align: "right" });
  pdf.text(`Status: ${payments[0].status}`, pdf.internal.pageSize.getWidth() - 10, 70, { align: "right" });

  // Add item list in table format
  pdf.text("Item List:", 10, 100);
  pdf.setFontSize(10);

  // Table Header
  pdf.text("Item", 10, 110);
  pdf.text("Price", 80, 110);
  pdf.text("Details", 140, 110);

  let yPosition = 120;
  payments.forEach(payment => {
    pdf.text(`${payment.Item.itemName}`, 10, yPosition);
    pdf.text(`ETB-${payment.price}`, 80, yPosition);
    pdf.text(`${payment.Item.itemDetails}`, 140, yPosition);
    yPosition += 10;
  });

  // Add total price
  const totalPrice = payments.reduce((total, payment) => total + payment.price, 0);
  pdf.setFontSize(16);
  pdf.text(`Total Price: ETB-${totalPrice}`, pdf.internal.pageSize.getWidth() - 10, yPosition + 10, { align: "right" });

  try {
    // Fetch the image as a Base64 string
    const response = await fetch("/seal.png"); 
    const blob = await response.blob();
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64data = reader.result;
      const imgWidth = pdf.internal.pageSize.getWidth() / 4;
      const imgHeight = 45; // Set fixed height for watermark
      const imgX = (pdf.internal.pageSize.getWidth() - imgWidth) / 2; // Center X
      const imgY = 65; // Position just above the item list (which starts at y = 100)
      
      pdf.addImage(base64data, "PNG", imgX, imgY, imgWidth, imgHeight, undefined, 'NONE');
      pdf.save(`receipt_${payments[0].id}.pdf`);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Failed to load watermark image", error);
    pdf.save(`receipt_${payments[0].id}.pdf`); // Save PDF even if image fails to load
  }
};

export default GeneratePdf;