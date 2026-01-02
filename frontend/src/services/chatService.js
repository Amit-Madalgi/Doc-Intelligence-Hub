import axios from 'axios';

const API_URL = '/api/documents/search';

const search = async (query, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, { query }, config);
  return response.data;
};

const chatService = {
  search,
};

export default chatService;
