using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Text;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ShopDb _db;

    public OrdersController(ShopDb db) 
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _db.Orders.Include(o => o.Items).ThenInclude(i => i.Product).ToListAsync();

        return Ok(orders);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateOrderRequest request)
    {
        var userId = int.Parse(User.FindFirst("userId")!.Value);

        var order = new Order {UserId = userId};

        decimal total = 0;

        foreach (var item in request.Items)
        {
            var product = await _db.Products.FindAsync(item.ProductId);
            if(product is null) return NotFound($"Produsul {item.ProductId} nu exista!");
            if(product.Stock < item.Quantity)
            return BadRequest($"Stoc insuficient pentru {product.Name}!");

            product.Stock -= item.Quantity;
            var orderItem = new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                Price = product.Price * item.Quantity
            };

            order.Items.Add(orderItem);
            total += orderItem.Price;
        }
        order.Total = total;
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetAll), order);

    }


}


public record CreateOrderRequest(List<OrderItemRequest> Items);
public record OrderItemRequest(int ProductId, int Quantity);