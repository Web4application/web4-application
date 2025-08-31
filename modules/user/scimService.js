const axios = require('axios');

const SCIM_BASE_URL = 'https://api.workos.com/scim/v2.0';
const API_KEY = process.env.WORKOS_API_KEY;

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

async function createUser(userData) {
  const response = await axios.post(`${SCIM_BASE_URL}/Users`, userData, { headers });
  return response.data;
}

async function updateUser(userId, updates) {
  const response = await axios.patch(`${SCIM_BASE_URL}/Users/${userId}`, updates, { headers });
  return response.data;
}

async function deleteUser(userId) {
  const response = await axios.delete(`${SCIM_BASE_URL}/Users/${userId}`, { headers });
  return response.status === 204;
}

module.exports = { createUser, updateUser, deleteUser };
