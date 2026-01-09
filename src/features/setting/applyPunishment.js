import React, { useEffect, useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import axios from "axios";
import api from '../../utils/api';

const PunishmentSettingsPage = () => {
  const [applyPunishment, setApplyPunishment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // OPTIONAL: fetch current setting on mount
  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await api.get("setting/punishment");
        setApplyPunishment(res.data.applyPunishment);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSetting();
  }, []);

  const togglePunishment = async () => {
    const newValue = !applyPunishment;

    setLoading(true);
    setError("");

    try {
      const res = await api.patch("setting/punishment", {
        applyPunishment: newValue,
      });

      setApplyPunishment(res.data.applyPunishment);
    } catch (err) {
      console.error(err);
      setError("Failed to update punishment setting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-200 shadow-md rounded-2xl px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-xl ${
              applyPunishment ? "bg-red-100" : "bg-gray-100"
            }`}
          >
            <ShieldAlert
              className={`w-5 h-5 ${
                applyPunishment ? "text-red-600" : "text-gray-500"
              }`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Punishment System
            </h3>
            <p className="text-sm text-gray-500">
              Enable or disable overdue tenant penalties
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`text-xs font-medium px-3 py-1 rounded-full ${
            applyPunishment
              ? "bg-green-300 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {applyPunishment ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className="my-4 border-t border-gray-100" />

      {/* Toggle Row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 max-w-sm">
          When enabled, the system will automatically calculate penalties,
          create punishment records, and notify tenants and admins.
        </p>

        <button
          onClick={togglePunishment}
          disabled={loading}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
            applyPunishment ? "bg-green-600" : "bg-gray-300"
          } ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
              applyPunishment ? "translate-x-7" : "translate-x-1"
            }`}
          />

          {loading && (
            <Loader2 className="absolute right-1 w-4 h-4 animate-spin text-white" />
          )}
        </button>
      </div>

      {/* Warning */}
      {applyPunishment && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          ⚠️ Penalties will be applied daily to all overdue tenants.
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {error}
        </div>
      )}
    </div>
  );
};

export default PunishmentSettingsPage;
