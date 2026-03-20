using System.ComponentModel.DataAnnotations;
public class Order {
    public int Id {get; set;}

    public int UserId {get; set;}
    public User User {get; set;}

    public List<OrderItem> Items {get; set;} = new List<OrderItem>();

    public string Status {get; set;} = "Pending";

    public decimal Total {get; set;}

    public DateTime CreateAt {get; set;} = DateTime.Now;
}

public class OrderItem {
    public int Id {get; set;}

    public int OrderId {get; set;}
    public Order Order {get; set;}

    public int ProductId {get; set;}
    public Product Product {get; set;}

    public int Quantity {get; set;}

    public decimal Price {get; set;}
}