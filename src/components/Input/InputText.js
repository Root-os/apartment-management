import { useState } from "react";

function InputText({ labelTitle, labelStyle, type, containerStyle, defaultValue, placeholder, updateFormValue, updateType, onChange, value, disabled }) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  const updateInputValue = (val) => {
    setInternalValue(val);

    // Call the custom form handler if provided
    if (updateFormValue) {
      updateFormValue({ updateType, value: val });
    }

    // Support onChange if passed instead
    if (onChange) {
      onChange({ target: { value: val } }); // mimic React synthetic event
    }
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={"label-text text-base-content " + labelStyle}>
          {labelTitle}
        </span>
      </label>
      <input
        type={type || "text"}
        value={value !== undefined ? value : internalValue}
        placeholder={placeholder || ""}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input input-bordered w-full"
        disabled={disabled}
      />
    </div>
  );
}

export default InputText;
