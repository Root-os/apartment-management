import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useNavigate } from 'react-router-dom';

const GenerateReceiptPage = () => {
    const { state } = useLocation();
    const { payment } = state || {};
    const [companyInfo, setCompanyInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const receiptRef = useRef();
    const navigate = useNavigate();

    // Color space conversion utilities
    const oklchToRgb = (l, c, h) => {
        const lch = [l, c, h];
        const lab = oklchToLab(lch);
        const xyz = labToXyz(lab);
        return xyzToRgb(xyz);
    };

    const oklchToLab = ([l, c, h]) => {
        const a = c * Math.cos(h * Math.PI / 180);
        const b = c * Math.sin(h * Math.PI / 180);
        return [l, a, b];
    };

    const labToXyz = ([l, a, b]) => {
        const y = (l + 0.16) * 116;
        const x = a * 500 / 127 + y;
        const z = b * -200 / 127 + y;
        return [x, y, z];
    };

    const xyzToRgb = ([x, y, z]) => {
        const r =  3.2404542 * x - 1.5371385 * y - 0.4985314 * z;
        const g = -0.9692660 * x + 1.8760108 * y + 0.0415560 * z;
        const b =  0.0556434 * x - 0.2040259 * y + 1.0572252 * z;
        
        return [
            Math.max(0, Math.min(255, Math.round(r))),
            Math.max(0, Math.min(255, Math.round(g))),
            Math.max(0, Math.min(255, Math.round(b)))
        ];
    };

    useEffect(() => {
        const fetchSettings = async () => {
            const token = localStorage.getItem("token");
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}setting`, {
                    headers: { 
                        Authorization: `Bearer ${token}` 
                    },
                });
                if (response.data?.length > 0) {
                    setCompanyInfo(response.data[0]);
                }
            } catch (error) {
                console.error("Failed to fetch company settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleShareReceipt = async () => {
        try {
            const element = receiptRef.current;
            const opt = {
                margin: 0,
                image: { 
                    type: "jpeg", 
                    quality: 0.98 
                },
                html2canvas: { 
                    scale: 2,
                    letterRendering: true,
                    removeContainerWhitespace: true,
                   onclone: (clonedDoc) => {
    const styleSheets = Array.from(clonedDoc.getElementsByTagName('style'));
    styleSheets.forEach(sheet => {
        if (sheet.sheet && sheet.sheet.cssRules) {
            // Convert CSSRuleList to array safely
            Array.from(sheet.sheet.cssRules).forEach(rule => {
                if (rule.style && rule.style.cssText) {
                    rule.style.cssText = rule.style.cssText
                        .replace(/oklch\(([^)]+)\)/g, (match, p1) => {
                            const [l, c, h] = p1.split(' ').map(Number);
                            return `rgb(${oklchToRgb(l, c, h).join(',')})`;
                        });
                }
            });
        }
    });
}
                },
                jsPDF: { 
                    unit: "pt", 
                    format: "a4", 
                    orientation: "portrait" 
                }
            };

            const pdfBlob = await html2pdf().set(opt).from(element).outputPdf("blob");
            const file = new File([pdfBlob], "receipt.pdf", { type: "application/pdf" });
            
            const formData = new FormData();
            formData.append("file", file);
            
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}share/upload-receipt`, {
                method: "POST",
                body: formData,
            });
            
            const data = await response.json();
            if (data.success) {
                if (navigator.share) {
                    await navigator.share({
                        title: "Payment Receipt",
                        text: "Here is your receipt.",
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
            console.error('PDF generation failed:', error);
            alert('Failed to generate PDF. Please try again.');
        }
    };

    const handleDownloadPDF = () => {
        try {
            const element = receiptRef.current;
            const opt = {
                margin: 0,
                filename: "receipt.pdf",
                image: { 
                    type: "jpeg", 
                    quality: 0.98 
                },
                html2canvas: { 
                    scale: 2,
                    letterRendering: true,
                    removeContainerWhitespace: true
                },
                jsPDF: { 
                    unit: "pt", 
                    format: "a4", 
                    orientation: "portrait" 
                }
            };
            html2pdf().set(opt).from(element).save();
        } catch (error) {
            console.error('PDF download failed:', error);
            alert('Failed to download PDF. Please try again.');
        }
    };

    if (loading) return <p className="text-center text-lg text-gray-700">Loading...</p>;
    if (!payment) return <p className="text-center text-lg text-gray-700">No payment data available.</p>;

    const vendor = payment.Vendor;
    const paymentDate = new Date(payment.paymentDate).toLocaleDateString("en-US", {
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit",
    });

    return (
        <div className="print-area max-w-3xl mx-auto my-6 print:max-w-full print:shadow-none print:border-none print:p-0">
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
           
            <div
                ref={receiptRef}
                className="bg-white shadow-lg rounded-lg border border-gray-200 p-0"
                style={{ color: '#222', background: '#fff' }}
            >
                {/* Header */}
                <div className="flex justify-between items-center bg-blue-50 border-b border-gray-300 p-6 rounded-t-lg">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900 uppercase">{companyInfo?.buildingName || "Company Name"}</h1>
                        <p className="text-sm text-blue-700">{companyInfo?.buildingAddress || "Company Address"}</p>
                        <p className="text-sm text-blue-700">{companyInfo?.email || "Company Email"}</p>
                        <p className="text-sm text-blue-700">{companyInfo?.phoneNumber || "Company Phone"}</p>
                    </div>
                    {companyInfo?.logos && (
                        <img src={companyInfo.logos} alt="Logo" className="w-24 h-24 object-contain" />
                    )}
                </div>

                {/* Payment Info */}
                <div className="flex justify-end px-6 mt-4 mb-2 text-sm text-right text-gray-600">
                    <p><span className="font-bold">Receipt No:</span> 00{payment.id}</p>
                    <p><span className="font-bold">Payment Date:</span> {paymentDate}</p>
                </div>

                {/* Vendor Info */}
                <div className="flex justify-between border-t border-b py-4 px-6 bg-gray-50">
                    <div className="w-1/2">
                        <h3 className="text-sm font-bold text-gray-700 uppercase mb-1">Bill To</h3>
                        <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
                        <p className="text-sm text-gray-600">{vendor.address}</p>
                        <p className="text-sm text-gray-600">{vendor.phone}</p>
                        <p className="text-sm text-gray-600">{vendor.email}</p>
                    </div>
                    {vendor.shipAddress && vendor.shipAddress !== vendor.address && (
                        <div className="w-1/2">
                            <h3 className="text-sm font-bold text-gray-700 uppercase mb-1">Ship To</h3>
                            <p className="text-sm text-gray-600">{vendor.fname} {vendor.lname}</p>
                            <p className="text-sm text-gray-600">{vendor.shipAddress}</p>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="relative my-6 border-t border-b py-6 px-6 text-sm text-gray-700 bg-white">
                    <div className="space-y-4">
                        <div className="flex justify-between"><span className="font-bold w-1/2">Item</span><span className="w-1/2 text-right">{payment.item}</span></div>
                        <div className="flex justify-between"><span className="font-bold w-1/2">Description</span><span className="w-1/2 text-right">{payment.description}</span></div>
                        <div className="flex justify-between"><span className="font-bold w-1/2">Payment Method</span><span className="w-1/2 text-right">{payment.paymentMethod}</span></div>
                        <div className="flex justify-between"><span className="font-bold w-1/2">Amount</span><span className="w-1/2 text-right">ETB {payment.price.toFixed(2)}</span></div>
                    </div>
                    {companyInfo?.seal && (
                        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none z-0">
                            <img src={companyInfo.seal} alt="Seal" className="w-32 h-32 rounded-full object-contain" />
                        </div>
                    )}
                </div>

                {/* Total */}
                <div className="text-right px-6 mb-6">
                    <p className="text-base font-bold text-gray-700 border-t pt-2 inline-block">
                        Balance Paid: ETB {payment.price.toFixed(2)}
                    </p>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 mb-4">
                    <p>Developed by Abyssinia Software Technology</p>
                </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-center gap-4 print:hidden">
                <button
                    onClick={handleShareReceipt}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                    Share
                </button>
                <button
                    onClick={handleDownloadPDF}
                    className="px-4 py-2 bg-gray-700 text-white text-sm rounded hover:bg-gray-800"
                >
                    Download PDF
                </button>
            </div>
        </div>
    );
};

export default GenerateReceiptPage;