import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useNavigate } from "react-router-dom";
import { HiPrinter, HiShare, HiDownload } from "react-icons/hi";

const LawPrintView = () => {
  const [rules, setRules] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const a4Ref = useRef();
  const navigate = useNavigate();

  // Color space conversion utilities
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

  // Preload image to ensure it's available for html2canvas
  const preloadImage = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        console.warn("No image URL provided for preloading");
        resolve(); // No image to preload
        return;
      }
      console.log("Preloading image:", url); // Debug log
      const img = new Image();
      img.crossOrigin = "Anonymous"; // Handle CORS
      img.src = url;
      img.onload = () => {
        console.log("Image loaded successfully:", url);
        resolve();
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        resolve(); // Continue even if image fails to load
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const [rulesRes, settingRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}building-law`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_BASE_URL}setting`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setRules(rulesRes.data);
        const setting = settingRes.data?.[0];
        setCompanyInfo(setting);
        console.log("Company Info:", setting); // Debug log
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handleShare = async () => {
    try {
      // Preload QR image and logo if they exist
      await Promise.all([
        preloadImage(companyInfo?.qrImage),
        preloadImage(companyInfo?.logo),
      ]);

      const element = a4Ref.current;
      const opt = {
        margin: 0,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          letterRendering: true,
          removeContainerWhitespace: true,
          useCORS: true, // Enable CORS for images
          onclone: (clonedDoc) => {
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
                        const [l, c, h] = p1.split(" ").map(Number);
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
                  ); // Debug log
                  img.src = absoluteUrl;
                }
              }
            });
          },
        },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      };

      const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
      const file = new File([pdfBlob], "building-rules.pdf", {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}share/upload-receipt`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.success) {
        if (navigator.share) {
          await navigator.share({
            title: "Building Rules",
            text: "Check out our building rules",
            url: data.url,
          });
        } else {
          window.open(data.url, "_blank");
          alert("Share this link: " + data.url);
        }
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (error) {
      console.error("PDF generation or sharing failed:", error);
      alert("Failed to generate or share PDF. Please try again.");
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Preload images before generating PDF
      await Promise.all([
        preloadImage(companyInfo?.qrImage),
        preloadImage(companyInfo?.logo),
      ]);

      const element = a4Ref.current;
      if (!element) {
        alert("PDF content not ready. Please try again.");
        return;
      }

      const opt = {
        margin: 0,
        filename: "building-rules.pdf",
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

      // Generate and save the PDF
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <>
      <div className="mt-1 ml-4 flex justify-start px-20 py-5 gap-4 print:hidden mb-1">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-300 text-gray-800 px-4 rounded hover:bg-gray-400 flex items-center gap-2"
        >
          {/* Left Arrow SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
      </div>
      <div className="flex flex-col items-center">
        {/* A4 Content */}
        <div
          ref={a4Ref}
          className="print-area bg-white shadow-lg  p-10 print:p-0 relative"
        style={{
  maxWidth: "794px",   // Changed from fixed width to maxWidth
  width: "100%",       // Make width fluid, so it shrinks on small screens
  minHeight: "924px",
  color: "#222",
  background: "#fff",
  margin: "0 auto",    // Center horizontally
  boxSizing: "border-box", // Include padding in width calculation
  paddingLeft: "1rem", // Add horizontal padding so content doesn't touch edges on small devices
  paddingRight: "1rem",
}}

        >
          {/* Optional Logo */}
          {companyInfo?.logo && (
           <div className="absolute top-10 left-10 sm:static sm:mb-4 sm:flex sm:justify-center">
  <img
    src={companyInfo.logo}
    alt="Company Logo"
    className="w-24 h-24 object-contain sm:w-20 sm:h-20"
  />
</div>

          )}

          {/* Header */}
          <header className="text-center border-b pb-4 mb-6 print:border-none">
            <h1 className="text-3xl font-bold text-gray-800">
              {companyInfo?.buildingName || "Building Rules & Regulations"}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Please read and follow all rules to maintain safety and order.
            </p>
          </header>

          {/* Rules */}
          <main className="pr-40">
            <ol className="list-decimal space-y-4 text-gray-800 text-lg pl-5">
              {rules.map((rule, index) => (
                <li key={index} className="leading-relaxed">
                  {rule.description}
                </li>
              ))}
            </ol>
          </main>

          {/* QR Image from settings */}
          {companyInfo?.qrImage && (
            <div className="absolute right-10 bottom-8 print:bottom-4">
              <img
                src={companyInfo.qrImage}
                alt="QR Code"
                className="w-32 h-32 object-contain border border-gray-300 shadow"
              />
            </div>
          )}

          {/* Footer */}
          <footer className="absolute bottom-4 left-10 text-gray-500">
             <div className="text-center text-xs text-gray-500 mt-8 print-footer">
  <p>
    Developed by Abyssinia Software Technology
  </p>
</div>
          </footer>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition duration-300"
            title="Print"
          >
            <HiPrinter size={20} />
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 transition duration-300 ml-2"
            title="Share "
          >
            <HiShare size={20} />
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-1 bg-gray-700 text-white text-sm font-semibold rounded hover:bg-gray-800 transition duration-300 ml-2"
            title="Download PDF"
          >
            <HiDownload size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default LawPrintView;
