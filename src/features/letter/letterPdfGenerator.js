import React, { useState, useEffect, useRef, useContext} from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useNavigate } from 'react-router-dom';
import { HiPrinter, HiShare, HiDownload } from "react-icons/hi";
import Loading from '../../components/loading';
import { CalendarContext } from '../../context/calendarContext';

const LetterDetailPage = () => {
  const { state } = useLocation();
  const letter = state?.letterDetails;
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const letterRef = useRef();
  const navigate = useNavigate();
  const { formatDateForDisplay } = useContext(CalendarContext);

  // Color space conversion utilities (from GenerateReceiptPage)
  const oklchToRgb = (l, c, h) => {
    const lch = [l, c, h];
    const lab = oklchToLab(lch);
    const xyz = labToXyz(lab);
    return xyzToRgb(xyz);
  };

  const oklchToLab = ([l, c, h]) => {
    const a = c * Math.cos((h * Math.PI) / 180);
    const b = c * Math.sin((h * Math.PI) / 180);
    return [l, a, b];
  };

  const labToXyz = ([l, a, b]) => {
    const y = (l + 0.16) * 116;
    const x = (a * 500) / 127 + y;
    const z = (b * -200) / 127 + y;
    return [x, y, z];
  };

  const xyzToRgb = ([x, y, z]) => {
    const r = 3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
    const g = -0.969266 * x + 1.8760108 * y + 0.041556 * z;
    const b = 0.0556434 * x - 0.2040259 * y + 1.0572252 * z;

    return [
      Math.max(0, Math.min(255, Math.round(r))),
      Math.max(0, Math.min(255, Math.round(g))),
      Math.max(0, Math.min(255, Math.round(b))),
    ];
  };

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const companyResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}setting`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const settings = companyResponse.data;
        if (settings && settings.length > 0) {
          setCompanyInfo(settings[0]);
          // Debug seal URL
          console.log("Seal URL:", settings[0].seal);
        }
      } catch (error) {
        console.error("Error fetching company settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleShareLetter = async () => {
    try {
      const element = letterRef.current;
      // Preload the seal image
      if (companyInfo?.seal) {
        try {
          await new Promise((resolve, reject) => {
            const img = new Image();
            img.src = companyInfo.seal;
            img.onload = () => {
              console.log("Seal image loaded successfully");
              resolve();
            };
            img.onerror = () => {
              console.error("Failed to load seal image:", companyInfo.seal);
              reject(new Error("Failed to load seal image"));
            };
          });
        } catch (error) {
          console.error(error);
          // Proceed with PDF generation even if image fails
        }
      }

      const opt = {
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          letterRendering: true,
          removeContainerWhitespace: true,
          useCORS: companyInfo?.seal?.includes("http") ? true : false, // Enable CORS only for external URLs
          onclone: (clonedDoc) => {
            const styleSheets = Array.from(clonedDoc.getElementsByTagName("style"));
            styleSheets.forEach((sheet) => {
              if (sheet.sheet && sheet.sheet.cssRules) {
                Array.from(sheet.sheet.cssRules).forEach((rule) => {
                  if (rule.style && rule.style.cssText) {
                    rule.style.cssText = rule.style.cssText.replace(
                      /oklch\(([^)]+)\)/g,
                      (match, p1) => {
                        const [l, c, h] = p1.split(" ").map(Number);
                        return `rgb(${oklchToRgb(l, c, h).join(",")})`;
                      }
                    );
                  }
                });
              }
            });
          },
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      const file = new File([pdfBlob], "letter.pdf", { type: "application/pdf" });

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${process.env.REACT_APP_BASE_URL}share/upload-receipt`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Upload failed: ${errorData.error || response.statusText} (Status: ${response.status})`);
      }

      const data = await response.json();
      if (data.success) {
        if (navigator.share) {
          await navigator.share({
            title: "Letter",
            text: "Here is your letter.",
            url: data.url,
          });
        } else {
          window.open(data.url, "_blank");
          alert("Share this link: " + data.url);
        }
      } else {
        throw new Error(`Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("PDF generation or upload failed:", error);
      alert(`Failed to share letter: ${error.message}`);
    }
  };

  const handleDownloadPDF = () => {
    try {
      const element = letterRef.current;
      // Preload the seal image
      if (companyInfo?.seal) {
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = companyInfo.seal;
          img.onload = () => {
            console.log("Seal image loaded successfully for download");
            resolve();
          };
          img.onerror = () => {
            console.error("Failed to load seal image for download:", companyInfo.seal);
            reject(new Error("Failed to load seal image"));
          };
        }).catch((error) => console.error(error));
      }

       const opt = {
        margin: 0,
        filename: "letter.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          letterRendering: true,
          removeContainerWhitespace: true,
          useCORS: true, // Enable CORS for images
          onclone: (clonedDoc) => {
            // Convert oklch colors to rgb
            const styleSheets = Array.from(
              clonedDoc.getElementsByTagName("style")
            );
            styleSheets.forEach((sheet) => {
              if (sheet.sheet && sheet.sheet.cssRules) {
                Array.from(sheet.sheet.cssRules).forEach((rule) => {
                  if (rule.style && rule.style.cssText) {
                    rule.style.cssText = rule.style.cssText.replace(
                      /oklch\(([^)]+)\)/g,
                      (match, p1) => {
                        const [l, c, h] = p1
                          .split(" ")
                          .map((val) => parseFloat(val));
                        if (isNaN(l) || isNaN(c) || isNaN(h)) {
                          console.warn(`Invalid oklch values: ${p1}`);
                          return "rgb(0,0,0)"; // Fallback color
                        }
                        return `rgb(${oklchToRgb(l, c, h).join(",")})`;
                      }
                    );
                  }
                });
              }
            });

            // Ensure images have absolute URLs and CORS attributes
            const images = clonedDoc.getElementsByTagName("img");
            Array.from(images).forEach((img) => {
              if (img.src) {
                img.crossOrigin = "Anonymous";
                // Convert relative URLs to absolute if necessary
                if (!img.src.startsWith("http")) {
                  const absoluteUrl = new URL(img.src, window.location.origin)
                    .href;
                  console.log(
                    `Converted relative URL ${img.src} to ${absoluteUrl}`
                  );
                  img.src = absoluteUrl;
                }
              }
            });
          },
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  if (loading) {
    <Loading/>
  }

  if (!letter) {
    return <p className="text-center text-lg text-red-500 print:hidden">No letter data provided.</p>;
  }

  const tenant = letter.Tenant;
  // const currentDate = new Date(letter.letterDate || letter.createdAt).toISOString().split("T")[0];

  return (
    <>
        <div className="mt-1 flex justify-end gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-4 rounded hover:bg-gray-400 flex items-center gap-2"
        >
          {/* Left Arrow SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      
      {/* Printable area only */}
      <div
        ref={letterRef}
        className="print-area max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 print:shadow-none print:border-none print:p-0 print:rounded-none print:block text-justify leading-7 text-gray-700"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">{companyInfo?.buildingName || "Company Name"}</h1>
          <p>{companyInfo?.buildingAddress || "Company Address"}</p>
          <p>Phone: {companyInfo?.phoneNumber || "Company Phone"}</p>
          <p>Email: {companyInfo?.email || "Company Email"}</p>
        </div>

        {/* Date and Subject */}
        <div className="mb-8 text-right">
          <p className="mb-2">Date: {letter.Date?formatDateForDisplay(letter.Date) : '-'}</p>
        </div>

           {/* <p><strong>Date:</strong> {selectedLetter.Date ? formatDateForDisplay(selectedLetter.Date) : '-'}</p> */}

        {/* Recipient Block */}
        <div className="mb-8">
          <p className="font-semibold mb-1">To:</p>
          <p>{tenant?.fullName || "N/A"}</p>
          <p>Phone: {tenant?.phoneNumber || "N/A"}</p>
          <p>Email: {tenant?.email || "N/A"}</p>
        </div>
        {/* Subject */}
        <div className="flex space-x-2 mb-4">
          <p className="font-semibold mb-1">Subject:</p>
          <p>{letter?.LetterType?.name || "No subject available."}</p>
        </div>

        {/* Salutation and Body */}
        <div className="mb-8">
          <p className="mb-4">Dear {tenant?.fullName || "Tenant"},</p>
          <p>
            This letter serves to formally inform you that you are currently residing in{" "}
            <strong>
              Floor {tenant?.Floor?.floorNumber || "N/A"}, Unit {tenant?.Unit?.unitNumber || "N/A"}
            </strong>{" "}
            of our property. <br />
            <br />
            {letter?.description || "No description available."}
          </p>
        </div>

        {/* Closing and Signature */}
        <div className="mt-12">
          <p className="mb-4">Sincerely,</p>

          {companyInfo?.seal && (
            <div className="mb-4">
              <img
                src={companyInfo.seal}
                alt="Company Seal"
                className="w-28 h-28 object-cover mb-2"
              />
            </div>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 mt-8 print-footer">
            <p>Developed by Abyssinia Software Technology</p>
          </div>
        </div>
      </div>

       {/* Non-printable UI */}
      <div className="print:hidden">
        <div className="text-center mt-6">
          <button
        onClick={() => window.print()}
      className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition duration-300"
      title="Print Letter"
    >
      <HiPrinter size={20} />
          </button>
          <button
         onClick={handleShareLetter}
      className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition duration-300 ml-2"
      title="Share Letter"
    >
      <HiShare size={20} />
          </button>
          <button
          onClick={handleDownloadPDF}
      className="px-3 py-1 bg-gray-700 text-white text-sm font-semibold rounded hover:bg-gray-800 transition duration-300 ml-2"
      title="Download PDF"
    >
      <HiDownload size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default LetterDetailPage;