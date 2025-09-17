using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hopper.Api.Models
{
    public class ClaimRequest
    {
        public string FirebaseUserId { get; set; }
        public string Pin { get; set; }
    }
}