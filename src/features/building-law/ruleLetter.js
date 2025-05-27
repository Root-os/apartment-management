import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const LawPrintView = () => {
  const [rules, setRules] = useState([]);
  const [companyInfo, setCompanyInfo] = useState(null);
  const a4Ref = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rulesRes, settingRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BASE_URL}building-law`),
          axios.get(`${process.env.REACT_APP_BASE_URL}setting`)
        ]);

        setRules(rulesRes.data);
        const setting = settingRes.data?.[0];
        setCompanyInfo(setting);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const shareUrl = window.location.href;
  const shareSupported = !!navigator.share;

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'Building Rules',
        text: 'Check out our building rules',
        url: shareUrl,
      });
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleDownloadPDF = () => {
    const element = a4Ref.current;
    const opt = {
      margin: 0,
      filename: 'building-rules.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col items-center">
      {/* A4 Content */}
      <div
        ref={a4Ref}
        className="bg-white shadow-lg mt-10 p-10 print:p-0 relative"
        style={{
          width: '794px',
          minHeight: '924px',
        }}
      >
        {/* Optional Logo */}
        {companyInfo?.logo && (
          <div className="absolute top-10 left-10">
            <img
              src={companyInfo.logo}
              alt="Company Logo"
              className="w-24 h-24 object-contain"
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
        <footer className="absolute bottom-4 left-10 text-gray-500 text-sm">
          {companyInfo?.buildingName && <p>{companyInfo.buildingName}</p>}
          <p>Developed by <span className="font-semibold">AST</span></p>
        </footer>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-center gap-4 print:hidden">
        {shareSupported ? (
          <button
            onClick={handleShare}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Share
          </button>
        ) : (
          <>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              WhatsApp
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=Building%20Rules`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Telegram
            </a>
            <a
              href={`mailto:?subject=Building Rules&body=${encodeURIComponent(shareUrl)}`}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Email
            </a>
          </>
        )}

        <button
          onClick={handleDownloadPDF}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default LawPrintView;
