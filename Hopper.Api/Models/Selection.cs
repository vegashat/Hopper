using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hopper.Api.Models
{
    public class Selection
    {
        public long SelectionId { get; set; }
        public string FirebaseUserId { get; set; }
        public int GameId { get; set; }
        public byte Quantity { get; set; } // 2 or 4
        public DateTime PickedUtc { get; set; }

    }
}