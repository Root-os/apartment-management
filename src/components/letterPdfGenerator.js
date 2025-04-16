import { jsPDF } from "jspdf";

const GeneratePdf = async (letter) => {
  console.log("generatePDF called with letter:", letter);

  if (!letter) {
    console.error("No letter provided");
    return;
  }

  const pdf = new jsPDF();

  // Add company information
  pdf.setFontSize(20);
  pdf.text("International Letters Inc.", pdf.internal.pageSize.getWidth() / 2, 20, { align: "center" });

  pdf.setFontSize(12);
  pdf.text("1234 Global St, Ethiopia, World", pdf.internal.pageSize.getWidth() / 2, 30, { align: "center" });
  pdf.text("Phone: +123-456-7890 | Email: info@intlletters.com", pdf.internal.pageSize.getWidth() / 2, 35, { align: "center" });

  // Add letter and recipient information
  pdf.text(`To: ${letter.Tenant.fullName}`, 10, 50);
  pdf.text(`Address: ${letter.Tenant.address}`, 10, 60);
  pdf.text(`Phone: ${letter.Tenant.phoneNumber}`, 10, 70);
  pdf.text(`Email: ${letter.Tenant.email}`, 10, 80);

  const letterDate = new Date(letter.letterDate).toISOString().split('T')[0];
  pdf.text(`Date: ${letterDate}`, pdf.internal.pageSize.getWidth() - 10, 50, { align: "right" });

  // Add the subject centered
  pdf.setFontSize(14);
  const subject = "Subject: Important Information regarding your tenancy";
  const subjectWidth = pdf.getTextWidth(subject); // Get the width of the subject text
  const subjectX = (pdf.internal.pageSize.getWidth() - subjectWidth) / 2; // Calculate the centered X position
  pdf.text(subject, subjectX, 100); // Render the subject at the calculated position

  // Add greeting
  pdf.setFontSize(12);
  pdf.text(`Dear ${letter.Tenant.fullName},`, 10, 110);
  pdf.text(``, 10, 120); // Add empty line for spacing
  pdf.text(`${letter.description}`, 10, 130);
  pdf.text(``, 10, 140); // Add empty line for spacing

  // Add company seal image as watermark
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
      const imgY = 160; // Position below the letter content

      pdf.addImage(base64data, "PNG", imgX, imgY, imgWidth, imgHeight, undefined, 'NONE');
      pdf.save(`letter_${letter.id}.pdf`);
    };

    reader.readAsDataURL(blob);
  } catch (error) {
    console.error("Failed to load watermark image", error);
    pdf.save(`letter_${letter.id}.pdf`); // Save PDF even if image fails to load
  }
};

export default GeneratePdf;
