using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace parkingSpotHandler
{
    public class CaptureProcessModel
    {
        [JsonPropertyName("parkId")]
        public string ParkingId { get; set; }
        [JsonPropertyName("cameraIpAddress")]
        public string Ip { get; set; }
        [JsonPropertyName("cameraPort")]
        public int Port { get; set; }
        [JsonPropertyName("cameraName")]
        public string CameraName { get; set; }
    }
}
