import React from "react";

const InputField = ({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  ...props
}) => {
  const defaultClasses =
    "w-full rounded-lg border border-gray-600 bg-[#2A2A40] px-4 py-2 text-white placeholder-gray-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none";

  const fileClasses =
    "file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-white file:bg-blue-500 file:cursor-pointer";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={type !== "file" ? value : undefined}
      onChange={onChange}
      className={`${defaultClasses} ${type === "file" ? fileClasses : ""} ${className}`}
      {...props}
    />
  );
};

export default InputField
