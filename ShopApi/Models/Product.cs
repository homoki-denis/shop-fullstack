using System.ComponentModel.DataAnnotations;

public class Product 
{
        public int Id {get; set;}

        [Required]
        [MinLength(2)]
        [MaxLength(100)]
        public string Name {get; set;}

        [Required]
        public decimal Price {get; set;}

        [Required]
        public int Stock {get; set;}

        [Required]
        public string Category {get; set;}
}