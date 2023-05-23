const { get } = require("axios");

const isParkingSpotAvalibale = async (parkingSpot) => {
  const cameraUrl = `http://${parkingSpot.cameraIpAddress}:${parkingSpot.cameraPort}/captureParking/${parkingSpot.cameraName}`;

  const ans = await get(cameraUrl);

  return !(Array.isArray(ans.data.results) && ans.data.results.length);
};

module.exports = {
  isParkingSpotAvalibale,
};
