"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import * as XLSX from "xlsx";
import { liveUrl } from "@/constants/url";
import toast, { Toaster } from "react-hot-toast";

export default function Modal({ open, setOpen, onClose }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [excelData, setExcelData] = useState(null);
  const [btnDis, setBtnDis] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ];

      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
        readExcelFile(selectedFile);
      } else {
        setError("Please upload a valid Excel file (.xls or .xlsx)");
        setFile(null);
        setExcelData(null);
      }
    }
  };

  const readExcelFile = (file) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary", dateNF: "mm dd" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          dateNF: "mm dd"
        });

        const formattedData = jsonData.map((row) => ({
          ...row,
          birthDate: row.birthDate
        }));

        setExcelData(formattedData);
        console.log("Fvdvvd", formattedData)
      } catch (err) {
        setError("Error reading Excel file: " + err.message);
        setExcelData(null);
      }
    };

    reader.onerror = () => {
      setError("Error reading file");
      setExcelData(null);
    };

    reader.readAsBinaryString(file);
  };

  const handleUpload = async () => {
    if (file && excelData) {
      try {
        // return
        const response = await fetch(`${liveUrl}/bulk-upload`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY
          },
          body: JSON.stringify(excelData)
        });

        const result = await response.json();
        if (response.ok) {
          console.log("Upload successful:", result);
          toast.success(result.message)
          setBtnDis(true);
          setTimeout(() => {
            setOpen(false);
          }, 2000);
        } else {
          console.error("Upload failed:", result);
          toast.error(error.message)
          setBtnDis(true);
        }
      } catch (error) {
        console.error("Error during upload:", error);
        toast.error(error.message)
        setBtnDis(true);


      }
    }
  };

  return (
    <Dialog open={open} onClose={() => {}} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <Toaster position="bottom-center" reverseOrder={false} />
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-screen-md data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 ">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:size-10">
                  {/* Upload icon */}
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Upload Excel File
                  </DialogTitle>
                  <div className="mt-2">
                    <input
                      type="file"
                      accept=".xls,.xlsx"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {file && <p className="mt-2 text-sm text-gray-600">Selected file: {file.name}</p>}
                    {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                    {excelData && excelData.length > 0 && (
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <p className="text-sm text-gray-600 mb-2">Preview (first 5 rows):</p>
                        <table className="w-full text-sm text-left text-gray-500 border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              {Object.keys(excelData[0]).map((header, index) => (
                                <th key={index} className="px-2 py-1 font-medium text-gray-900 border-b">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {excelData.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex} className="border-b">
                                {Object.values(row).map((value, colIndex) => (
                                  <td key={colIndex} className="px-2 py-1">
                                    {value?.toString() || "-"}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <p className="mt-2 text-sm text-gray-500">
                      Please select an Excel file (.xls or .xlsx) to upload.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || !excelData || btnDis}
                className={`inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs sm:ml-3 sm:w-auto ${
                  file && excelData ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Upload
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
