using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace parkingSpotHandler
{
    public class CaptureProcessModel
    {
        public string ParkingId { get; set; }
        public string Ip { get; set; }
        public int Port { get; set; }
        public string CameraName { get; set; }
    }
}
