import { useState, useEffect } from "react";
import { Upload, FileText, Trash2 } from "lucide-react";
import CsvDataTable from "../components/CsvDataTable";

interface CsvData {
  headers: string[];
  rows: string[][];
}

const CsvUpload = () => {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('csvData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData && parsedData.headers && parsedData.rows) {
          setCsvData(parsedData);
          setFileName('Previously uploaded file');
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const parseCSV = (text: string): CsvData => {
    const lines = text.trim().split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
      throw new Error('CSV file is empty or contains no valid data');
    }

    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];
        
        if (char === '"') {
          if (inQuotes && nextChar === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      
      // Add the last field
      result.push(current.trim());
      
      return result;
    };

    const headers = parseCSVLine(lines[0]).map(h => h.replace(/^"|"$/g, ''));
    const rows = lines.slice(1).map((line, index) => {
      try {
        return parseCSVLine(line).map(cell => cell.replace(/^"|"$/g, ''));
      } catch (err) {
        throw new Error(`Error parsing line ${index + 2}: ${(err as Error).message}`);
      }
    });

    const expectedColumns = headers.length;
    rows.forEach((row, index) => {
      if (row.length !== expectedColumns) {
        throw new Error(`Row ${index + 2} has ${row.length} columns but expected ${expectedColumns}`);
      }
    });

    return { headers, rows };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    processFile(file);
  };

  const handleClearData = () => {
    setCsvData(null);
    setFileName('');
    setError('');
    localStorage.removeItem('csvData');
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    
    const file = files[0];
    processFile(file);
  };

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file');
      return;
    }

    if (file.size === 0) {
      setError('File is empty');
      return;
    }

    setFileName(file.name);
    setError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        if (!text || text.trim() === '') {
          throw new Error('File is empty or contains no readable data');
        }
        const parsedData = parseCSV(text);
        setCsvData(parsedData);
        localStorage.setItem('csvData', JSON.stringify(parsedData))
        setError('');
      } catch (err) {
        const errorMessage = (err as Error).message;
        setError('Error parsing CSV file: ' + errorMessage);
        setCsvData(null);
        console.error('CSV parsing error:', err);
      }
    };
    reader.onerror = () => {
      setError('Error reading file. Please try again or choose a different file.');
      setCsvData(null);
      console.error('File reading error');
    };
    reader.readAsText(file);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">CSV Upload & Data Viewer</h1>
        
        {!csvData ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-muted-foreground/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <Upload className={`h-12 w-12 transition-colors ${
                isDragging ? 'text-primary' : 'text-muted-foreground'
              }`} />
              <div>
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <span className="text-lg font-medium text-foreground">
                    Click to upload CSV file
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    or drag and drop
                  </p>
                </label>
                <input
                  id="csv-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                CSV files only
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-foreground" />
                <div>
                  <p className="font-medium text-foreground">{fileName}</p>
                  <p className="text-sm text-muted-foreground">
                    {csvData.headers.length} columns, {csvData.rows.length} rows
                  </p>
                </div>
              </div>
              <button
                onClick={handleClearData}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            </div>
            
            <CsvDataTable data={csvData} />
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CsvUpload;
