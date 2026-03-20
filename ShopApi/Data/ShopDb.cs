using Microsoft.EntityFrameworkCore;

public class ShopDb : DbContext
{

    public ShopDb(DbContextOptions<ShopDb> options) : base(options) {}


    public DbSet<Product> Products {get; set;}
    public DbSet<User> Users {get; set;}

    public DbSet<Order> Orders {get; set;}

    public DbSet<OrderItem> OrderItems {get; set;} 


}