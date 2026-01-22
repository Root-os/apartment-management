import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingComponent from "../../components/loading";

const TenantProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/tenant/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.error("Error fetching profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const getFileType = (url) => {
    if (!url) return null;
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "unknown";
  };

  if (loading) return <LoadingComponent />;

  if (!profile) {
    return <p className="text-center text-gray-500">Profile not found</p>;
  }

  const fileType = getFileType(profile.document);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-base-100 shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-semibold mb-6">Tenant Profile</h1>

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileItem label="Full Name" value={profile.fullName} />
          <ProfileItem label="Phone Number" value={profile.phoneNumber} />
          <ProfileItem label="Email" value={profile.email || "-"} />
          <ProfileItem label="TIN" value={profile.tin || "-"} />
          <ProfileItem label="National ID" value={profile.nationalId || "-"} />
        </div>

        {/* Document Section */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-3">Document</h2>

          {!profile.document && (
            <p className="text-gray-500">No document uploaded</p>
          )}

          {fileType === "image" && (
            <img
              src={profile.document}
              alt="Tenant Document"
              className="max-w-xs rounded-lg border"
            />
          )}

          {fileType === "pdf" && (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-lg">
                📄
              </div>
              <div>
                <p className="font-medium">PDF Document</p>
                <a
                  href={profile.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline text-sm"
                >
                  View / Download
                </a>
              </div>
            </div>
          )}

          {fileType === "unknown" && (
            <a
              href={profile.document}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Download Document
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileItem = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default TenantProfile;
