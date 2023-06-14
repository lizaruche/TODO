using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ToDoAPI.Models
{
    public class TodoItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool ISComplete { get; set; }
        public int CategoryId { get; set; }
        public ItemCategory Category { get; set; }
    }
}