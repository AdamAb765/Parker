using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace parkingSpotHandler
{
    public class ParkingSpotModel
    {
        [JsonPropertyName("_id")]
        public string Id { get; set; }
        [JsonPropertyName("title")]
        public string Title { get; set; }
        [JsonPropertyName("address")]
        public string Address { get; set; }
    }
}
