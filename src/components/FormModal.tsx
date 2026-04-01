import { useState } from "react";
import { X, Save } from "lucide-react";

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: string[]) => void;
  headers: string[];
  initialData?: string[];
  title: string;
}

const FormModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  headers, 
  initialData = [], 
  title 
}: FormModalProps) => {
  const [formData, setFormData] = useState<string[]>(
    initialData.length > 0 ? initialData : new Array(headers.length).fill("")
  );

  const handleInputChange = (index: number, value: string) => {
    const newFormData = [...formData];
    newFormData[index] = value;
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(new Array(headers.length).fill(""));
  };

  const handleClose = () => {
    onClose();
    setFormData(new Array(headers.length).fill(""));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {headers.map((header, index) => (
              <div key={index} className="space-y-2">
                <label htmlFor={`field-${index}`} className="block text-sm font-medium text-foreground">
                  {header || `Column ${index + 1}`}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    id={`field-${index}`}
                    type="text"
                    value={formData[index] || ""}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-full px-3 py-2 bg-background text-foreground placeholder:text-muted-foreground border border-border rounded-md focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-300 transition-all duration-200"
                    placeholder={`Enter ${header || `Column ${index + 1}`}`}
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium border border-border rounded-md bg-background text-foreground hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Save className="h-4 w-4" />
              {title === "Add New Row" ? "Add Row" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormModal;
