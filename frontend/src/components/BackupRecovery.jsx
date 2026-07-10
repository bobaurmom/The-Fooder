import { useState } from 'react';
import { FiDownload, FiUpload, FiAlertTriangle, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { adminService } from '../services/adminService.js';

export default function BackupRecovery() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreFile, setRestoreFile] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const handleDownloadBackup = async () => {
    setIsDownloading(true);
    setMessage(null);

    try {
      const response = await adminService.downloadBackup();
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `backup-${timestamp}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage({
        type: 'success',
        text: 'Backup downloaded successfully!'
      });
      setMessageType('success');
    } catch (error) {
      console.error('Download backup error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to download backup'
      });
      setMessageType('error');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        setMessage({
          type: 'error',
          text: 'Please select a JSON file'
        });
        setMessageType('error');
        setRestoreFile(null);
        return;
      }
      setRestoreFile(file);
      setMessage(null);
    }
  };

  const handleRestoreBackup = async () => {
    if (!restoreFile) {
      setMessage({
        type: 'error',
        text: 'Please select a backup file first'
      });
      setMessageType('error');
      return;
    }

    setIsRestoring(true);
    setMessage(null);

    try {
      const result = await adminService.restoreBackup(restoreFile);
      
      setMessage({
        type: 'success',
        text: `Database restored successfully! ${result.restored.length} tables restored with ${result.totalRecords} total records.`
      });
      setMessageType('success');
      setRestoreFile(null);
      
      // Reset file input
      document.getElementById('restore-file-input').value = '';
    } catch (error) {
      console.error('Restore backup error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to restore backup'
      });
      setMessageType('error');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Database Backup & Recovery</h2>

      {/* Warning Message */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <FiAlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800">Important Warning</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Restoring a backup will replace all existing data in the database. 
              This action cannot be undone. Make sure to create a backup before restoring.
            </p>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            messageType === 'success'
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          {messageType === 'success' ? (
            <FiCheckCircle className="text-green-600 flex-shrink-0" />
          ) : (
            <FiAlertTriangle className="text-red-600 flex-shrink-0" />
          )}
          <p
            className={`text-sm ${
              messageType === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {message.text}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Download Backup Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiDownload />
            Download Backup
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Download a complete snapshot of the database as a JSON file.
          </p>
          <button
            onClick={handleDownloadBackup}
            disabled={isDownloading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition"
          >
            {isDownloading ? (
              <>
                <FiLoader className="animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <FiDownload />
                Download Backup
              </>
            )}
          </button>
        </div>

        {/* Restore Backup Section */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiUpload />
            Restore Backup
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upload a backup file to restore the database to a previous state.
          </p>
          
          <div className="mb-4">
            <input
              id="restore-file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            {restoreFile && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {restoreFile.name} ({(restoreFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <button
            onClick={handleRestoreBackup}
            disabled={isRestoring || !restoreFile}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-400 disabled:cursor-not-allowed transition"
          >
            {isRestoring ? (
              <>
                <FiLoader className="animate-spin" />
                Restoring...
              </>
            ) : (
              <>
                <FiUpload />
                Restore Backup
              </>
            )}
          </button>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-700 mb-2">Backup Information</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Backups include all tables: users, restaurants, food items, orders, etc.</li>
          <li>• Backup files are in JSON format for easy inspection</li>
          <li>• Recommended to download backups regularly</li>
          <li>• Store backups in a secure location</li>
        </ul>
      </div>
    </div>
  );
}
