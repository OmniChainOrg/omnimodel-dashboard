// components/ui/textarea.tsx
import * as React from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error = false, className = "", ...props }, ref) => {
    const baseStyles =
      "block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1";
    const errorStyles = error
      ? "border-red-500 focus:ring-red-300"
      : "border-gray-300 focus:ring-blue-300";

    return (
      <div className={`space-y-1 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${baseStyles} ${errorStyles}`}
          {...props}
        />
        {error && (
          <p className="text-xs text-red-600">Please correct this field.</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
