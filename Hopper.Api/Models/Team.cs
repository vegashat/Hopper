using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Hopper.Api.Models
{
    public class Team
    {
        public int TeamId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? City { get; set; }
        public string? LogoUrl { get; set; }
    }
}