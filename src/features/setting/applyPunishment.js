import React, { useEffect, useState } from "react";
import { ShieldAlert, Loader2, Plus, Trash2, XCircle } from "lucide-react";
import api from "../../utils/api";

const DEFAULT_SETTING = {
  isEnabled: false,
  rules: { rules: [] },
  exists: false, // flag to determine create vs update
};

const PunishmentSettingsPage = () => {
  const [punishmentSetting, setPunishmentSetting] = useState(DEFAULT_SETTING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Auto-dismiss messages
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/punishment-settings");

        // Determine existence: if backend returned a record (even default), mark exists = true
        const exists = res.data && (res.data.rules?.rules.length > 0 || res.data.isEnabled);

        setPunishmentSetting({
          ...DEFAULT_SETTING,
          ...res.data,
          exists,
        });
      } catch (err) {
        console.error(err);
        setMessage({ text: "Failed to fetch punishment settings", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Save (POST if not exists, PUT if exists)
  const saveSetting = async (updatedData = punishmentSetting) => {
    setSaving(true);
    setMessage({ text: "", type: "" });

    // Validate percentages
    if (updatedData.rules.rules.some((r) => r.percent <= 0)) {
      setMessage({ text: "Percentage must be greater than 0", type: "error" });
      setSaving(false);
      return;
    }

    try {
      const res = updatedData.exists
        ? await api.put("/punishment-settings", updatedData) // UPDATE
        : await api.post("/punishment-settings", updatedData); // CREATE

      setPunishmentSetting({
        ...res.data,
        exists: true,
      });

      setMessage({ text: "Settings saved successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setMessage({
        text: err.response?.data?.message || "Failed to save settings",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Toggle enabled (auto-save)
  const toggleEnabled = async () => {
    if (!punishmentSetting.isEnabled && punishmentSetting.rules.rules.length === 0) {
      setMessage({ text: "Cannot enable: add at least one rule first.", type: "error" });
      return;
    }

    const updatedData = {
      ...punishmentSetting,
      isEnabled: !punishmentSetting.isEnabled,
    };

    setPunishmentSetting(updatedData);
    await saveSetting(updatedData);
  };

  // Add rule
  const addRule = () => {
    const rules = punishmentSetting.rules.rules;
    const lastRule = rules[rules.length - 1];

    const nextFromDay = lastRule ? (lastRule.to_day ?? lastRule.from_day) + 1 : 1;

    let nextPercent = lastRule ? lastRule.percent + 1 : 1;
    if (nextPercent > 100) nextPercent = 100;

    setPunishmentSetting((prev) => ({
      ...prev,
      rules: {
        rules: [...prev.rules.rules, { from_day: nextFromDay, percent: nextPercent }],
      },
    }));
  };

  // Update rule
  const updateRule = (index, field, value) => {
    if (field === "percent" && value < 1) {
      setMessage({ text: "Percentage must be greater than 0", type: "error" });
      return;
    }

    const updatedRules = punishmentSetting.rules.rules.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );

    setPunishmentSetting({
      ...punishmentSetting,
      rules: { rules: updatedRules },
    });
  };

  // Remove rule
  const removeRule = (index) => {
    if (punishmentSetting.isEnabled && punishmentSetting.rules.rules.length === 1) {
      setMessage({ text: "Cannot remove the last rule while enabled.", type: "error" });
      return;
    }

    const updatedRules = punishmentSetting.rules.rules.filter((_, i) => i !== index);

    setPunishmentSetting({
      ...punishmentSetting,
      rules: { rules: updatedRules },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white border shadow-lg rounded-2xl px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ShieldAlert
          className={`w-6 h-6 ${punishmentSetting.isEnabled ? "text-green-600" : "text-gray-400"}`}
        />
        <h2 className="text-xl font-semibold">Punishment System</h2>
      </div>

      {/* Status */}
      <div className="mb-2 text-sm font-medium">
        Status:{" "}
        <span className={punishmentSetting.isEnabled ? "text-green-600" : "text-gray-500"}>
          {punishmentSetting.isEnabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      {/* Toggle */}
      <label className="relative inline-flex items-center cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={punishmentSetting.isEnabled}
          onChange={toggleEnabled}
          className="sr-only"
        />
        <div
          className={`w-12 h-6 rounded-full transition ${
            punishmentSetting.isEnabled ? "bg-green-600" : "bg-gray-300"
          }`}
        />
        <div
          className={`absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow transform transition ${
            punishmentSetting.isEnabled ? "translate-x-6" : ""
          }`}
        />
      </label>

      {/* Message */}
      {message.text && (
        <div
          className={`flex justify-between items-center px-4 py-2 mb-4 rounded ${
            message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage({ text: "", type: "" })}>
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Rules */}
      <h3 className="font-semibold mb-3">Rules</h3>

      {punishmentSetting.rules.rules.length === 0 && (
        <div className="text-sm text-gray-500 mb-3">No rules configured.</div>
      )}

    {punishmentSetting.rules.rules.map((rule, index) => (
  <div
    key={index}
    className="grid grid-cols-4 gap-3 mb-3 border p-3 rounded items-end"
  >
    <div>
      <label className="block text-sm font-medium mb-1">
        From Day
      </label>
      <input
        type="number"
        value={rule.from_day}
        onChange={(e) =>
          updateRule(index, "from_day", Number(e.target.value))
        }
        className="w-full border rounded px-2"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        To Day
      </label>
      <input
        type="number"
        value={rule.to_day ?? ""}
        onChange={(e) =>
          updateRule(
            index,
            "to_day",
            e.target.value ? Number(e.target.value) : undefined
          )
        }
        className="w-full border rounded px-2"
      />
    </div>

    <div>
      <label className="block text-sm font-medium mb-1">
        Percentage (%)
      </label>
      <input
        type="number"
        value={rule.percent}
        onChange={(e) =>
          updateRule(index, "percent", Number(e.target.value))
        }
        className="w-full border rounded px-2"
      />
    </div>

    <button onClick={() => removeRule(index)}>
      <Trash2 className="w-4 h-4 text-red-600" />
    </button>
  </div>
))}


      <button onClick={addRule} className="flex items-center gap-1 text-blue-600 text-sm mt-2">
        <Plus className="w-4 h-4" /> Add Rule
      </button>

      {/* Save */}
      <button
        onClick={() => saveSetting()}
        disabled={saving}
        className="mt-6 w-full bg-green-600 text-white py-2 rounded flex justify-center gap-2"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </div>
  );
};

export default PunishmentSettingsPage;
