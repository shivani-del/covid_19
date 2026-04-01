import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Plus, Edit2, Trash2 } from "lucide-react";
import FormModal from "./FormModal";

const STORAGE_KEY = "csvData";

interface CsvData {
  headers: string[];
  rows: string[][];
}

interface Props {
  data: CsvData;
  onDataChange?: (data: CsvData) => void;
}

const ROWS_PER_PAGE = 10;

const CsvDataTable = ({ data, onDataChange }: Props) => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<number | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [currentData, setCurrentData] = useState<CsvData>(data);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    console.log("Raw data from localStorage:", savedData);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log("Parsed data from localStorage:", parsedData);
        if (parsedData && parsedData.headers && parsedData.rows) {
          setCurrentData(parsedData);
          onDataChange?.(parsedData);
        }
      } catch (error) {
        console.error("Error parsing saved data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (!savedData) {
      setCurrentData(data);
    }
  }, [data]);

  const saveToLocalStorage = (dataToSave: CsvData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const filteredRows = currentData.rows.filter(row =>
    row.some(cell => 
      cell.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedRows = [...filteredRows].sort((a, b) => {
    if (sortColumn === null) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    const aNum = parseFloat(aValue);
    const bNum = parseFloat(bValue);
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }
    
    const comparison = aValue.localeCompare(bValue);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.ceil(sortedRows.length / ROWS_PER_PAGE);
  const pageData = sortedRows.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const handleSort = (columnIndex: number) => {
    if (sortColumn === columnIndex) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnIndex);
      setSortDirection("asc");
    }
    setPage(0);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleAddRow = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewRow = (formData: string[]) => {
    const updatedData = {
      ...currentData,
      rows: [formData, ...currentData.rows]
    };
    setCurrentData(updatedData);
    saveToLocalStorage(updatedData);
    onDataChange?.(updatedData);
    setIsAddModalOpen(false);
    setPage(0);
  };

  const handleEditRow = (rowIndex: number) => {
    const actualRowIndex = page * ROWS_PER_PAGE + rowIndex;
    setEditingRowIndex(actualRowIndex);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (formData: string[]) => {
    const updatedRows = [...sortedRows];
    updatedRows[editingRowIndex!] = formData;
    const updatedData = {
      ...currentData,
      rows: updatedRows
    };
    setCurrentData(updatedData);
    saveToLocalStorage(updatedData);
    onDataChange?.(updatedData);
    setIsEditModalOpen(false);
    setEditingRowIndex(null);
  };

  const handleDeleteRow = (rowIndex: number) => {
    const actualRowIndex = page * ROWS_PER_PAGE + rowIndex;
    const updatedRows = sortedRows.filter((_, index) => index !== actualRowIndex);
    const updatedData = {
      ...currentData,
      rows: updatedRows
    };
    setCurrentData(updatedData);
    saveToLocalStorage(updatedData);
    onDataChange?.(updatedData);
    if (page > 0 && page >= Math.ceil(updatedRows.length / ROWS_PER_PAGE)) {
      setPage(page - 1);
    }
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingRowIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Data Management</h2>
            <p className="text-muted-foreground">
              View, search, and manage your CSV data with advanced filtering and sorting options
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentData.rows.length}</div>
              <div className="text-sm text-blue-700 dark:text-blue-300">Total Rows</div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currentData.headers.length}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Columns</div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{sortedRows.length}</div>
              <div className="text-sm text-purple-700 dark:text-purple-300">Filtered</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search across all columns..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
          />
        </div>
        <button
          onClick={handleAddRow}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary transition-all duration-200 shadow-sm hover:shadow-md font-medium"
        >
          <Plus className="h-5 w-5" /> Add New Row
        </button>
      </div>

      <div className="rounded-lg border border-border bg-card shadow-lg overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full border-collapse min-w-[600px]">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-muted/80 to-muted/60 backdrop-blur-sm">
              <tr className="border-b border-border">
                <th className="w-16 px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">#</th>
                {currentData.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/70 transition-all duration-200 group"
                    onClick={() => handleSort(index)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[250px] group-hover:text-foreground transition-colors">
                        {header || `Column ${index + 1}`}
                      </span>
                      {sortColumn === index && (
                        <ArrowUpDown className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="w-40 px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {pageData.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={`transition-all duration-200 hover:bg-muted/20 ${
                    rowIndex % 2 === 0 ? 'bg-background' : 'bg-muted/10'
                  }`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-muted-foreground border-r border-border/30">
                    {page * ROWS_PER_PAGE + rowIndex + 1}
                  </td>
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex} 
                      className="px-6 py-4 text-sm text-foreground max-w-[350px] border-r border-border/30"
                    >
                      <span className="truncate block" title={cell}>
                        {cell || "<empty>"}
                      </span>
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditRow(rowIndex)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Edit2 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteRow(rowIndex)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gradient-to-r from-muted/30 to-muted/20">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground font-bold">{page * ROWS_PER_PAGE + 1}</span> to{' '}
              <span className="text-foreground font-bold">
                {Math.min((page + 1) * ROWS_PER_PAGE, sortedRows.length)}
              </span>{' '}
              of <span className="text-foreground font-bold">{sortedRows.length}</span> results
            </span>
            {searchTerm && (
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                Filtered by: "{searchTerm}"
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg bg-background text-foreground hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 text-sm font-medium rounded-md transition-all duration-200 ${
                      page === pageNum
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-foreground hover:bg-muted/50 border border-border'
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            <button
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg bg-background text-foreground hover:bg-muted/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {sortedRows.length === 0 && (
        <div className="text-center py-16 bg-card rounded-lg border border-border shadow-sm">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? "No results found" : "No data available"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? `No rows match your search criteria "${searchTerm}". Try adjusting your search terms.`
                : "Upload a CSV file to get started with data management."
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => handleSearch("")}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        </div>
      )}

      <FormModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSaveNewRow}
        headers={currentData.headers}
        title="Add New Row"
      />

      {editingRowIndex !== null && (
        <FormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleSaveEdit}
          headers={currentData.headers}
          initialData={sortedRows[editingRowIndex]}
          title="Edit Row"
        />
      )}
    </div>
  );
};

export default CsvDataTable;
