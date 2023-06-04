const { get } = require("axios");

const isParkingSpotAvalibale = async (parkingSpot) => {
  const cameraUrl = `http://${parkingSpot.cameraIpAddress}:${parkingSpot.cameraPort}/captureParking/${parkingSpot.cameraName}`;

  const ans = await get(cameraUrl);

  return !(Array.isArray(ans.data.results) && ans.data.results.length);
};

const getCurrLicensePlate = async (parkingSpot) => {
  const cameraUrl = `http://${parkingSpot.cameraIpAddress}:${parkingSpot.cameraPort}/captureParking/${parkingSpot.cameraName}`;

  const ans = await get(cameraUrl);

  if (Array.isArray(ans.data.results) && ans.data.results.length) {
    return ans.data.results[0].plate;
  }
};

module.exports = {
  isParkingSpotAvalibale,
  getCurrLicensePlate,
};
