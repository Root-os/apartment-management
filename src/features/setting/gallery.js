import React, { useEffect, useState } from "react";
import { CheckCircle, Trash2, UploadCloud } from "lucide-react";
import api from "../../utils/api";

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [snack, setSnack] = useState(null); // { type: "success"|"error", message: "" }
  const [confirmDelete, setConfirmDelete] = useState(null); // { id, message }

  const fetchGallery = async () => {
    try {
      const res = await api.get("gallery");
      setImages(res.data.data || []);
      setSelectedBackground(res.data.selectedBackground || null);
    } catch (err) {
      console.error("Failed to load gallery", err);
      showSnack("error", "Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Custom snack
  const showSnack = (type, message) => {
    setSnack({ type, message });
    setTimeout(() => setSnack(null), 3000);
  };

  const handleSelect = async (id) => {
    try {
      await api.post(`gallery/select?id=${id}`);
      showSnack("success", "Login background selected successfully");
      fetchGallery();
    } catch (err) {
      console.error("Failed to select image", err);
      showSnack("error", "Failed to select background");
    }
  };

  const handleDelete = (id) => {
    setConfirmDelete({ id, message: "Are you sure you want to delete this image?" });
  };

  const confirmDeleteAction = async (id) => {
    try {
      await api.delete(`gallery/${id}`);
      showSnack("success", "Image deleted successfully");
      fetchGallery();
    } catch (err) {
      console.error("Failed to delete image", err);
      showSnack("error", "Failed to delete image");
    } finally {
      setConfirmDelete(null);
    }
  };

  const handleFileChange = (e) => setSelectedFiles(e.target.files);

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) return showSnack("error", "No files selected!");

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => formData.append("images", file));

    try {
      setUploading(true);
      await api.post("gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSnack("success", "Images uploaded successfully");
      setSelectedFiles([]);
      fetchGallery();
    } catch (err) {
      console.error("Upload failed", err);
      showSnack("error", "Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading gallery…</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto relative">
      {/* Snack / Toast */}
      {snack && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-md text-white ${
            snack.type === "success" ? "bg-green-500" : "bg-red-500"
          } z-50`}
        >
          {snack.message}
        </div>
      )}

      {/* Confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-gray-800">
            <p className="mb-4">{confirmDelete.message}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1 rounded bg-gray-300 text-gray-700"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-1 rounded bg-red-600 text-white"
                onClick={() => confirmDeleteAction(confirmDelete.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800"> Gallery </h1>
          <p className="text-gray-500 mt-1">Manage background images and select which one is used on login pages.</p>
        </div>

        {/* Upload */}
        <div className="flex gap-2 items-center">
          <label className="cursor-pointer bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <UploadCloud size={16} /> Choose Images
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
          <button
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
            className={`px-4 py-2 rounded-lg text-white font-medium ${
              uploading || selectedFiles.length === 0 ? "bg-indigo-500/50 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>

      {/* Gallery */}
      {images.length === 0 ? (
        <div className="text-center text-gray-500">No images uploaded yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => {
            const isSelected = img.imageUrl === selectedBackground;
            return (
              <div
                key={img.id}
                className={`relative rounded-xl overflow-hidden shadow-md group transition ${
                  isSelected ? "ring-4 ring-indigo-500" : "hover:ring-2 hover:ring-gray-300"
                }`}
              >
                <img src={img.imageUrl} alt="Gallery" className="w-full h-48 object-cover" />
                {isSelected && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full">
                    <CheckCircle size={14} /> Selected
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  {!isSelected && (
                    <button
                      onClick={() => handleSelect(img.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      Use as Background
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
