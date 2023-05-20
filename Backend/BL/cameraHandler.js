const axios = require('axios');

// Specify the start and end date-time
const startDateTime = new Date('2023-05-01T08:00:00'); // Example: May 1, 2023, 08:00:00
const endDateTime = new Date('2023-06-01T17:00:00'); // Example: June 1, 2023, 17:00:00

// Calculate the time range in milliseconds
const startTime = startDateTime.getTime();
const endTime = endDateTime.getTime();
const interval = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to send the request
async function sendRequest() {
  try {
    // Make your HTTP request here using axios or any other library
    const response = await axios.get('https://example.com/api/endpoint');
    console.log('Request sent:', response.data);
  } catch (error) {
    console.error('Error sending request:', error.message);
  }
}

// Function to check if the current time is within the specified range
function isWithinRange() {
  const currentTime = Date.now();
  return currentTime >= startTime && currentTime <= endTime;
}

// Run the script every 5 minutes
setInterval(() => {
  if (isWithinRange()) {
    sendRequest(); 
  }
}, interval);