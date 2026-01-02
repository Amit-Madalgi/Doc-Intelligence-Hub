import axios from 'axios';

const API_URL = '/api/documents';

const getDocuments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const uploadDocument = async (formData, token) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

// --- NEW FUNCTION: Get Query History ---
const getHistory = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/history`, config);
  return response.data;
};

const documentService = {
  getDocuments,
  uploadDocument,
  getHistory, // 👈 Export the new function
};

export default documentService;