using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController : ControllerBase
{

    private readonly ShopDb _db;
    private readonly IConfiguration _config;


     public AuthController(ShopDb db, IConfiguration config) {
        _db = db;
        _config = config;
     }

    [HttpPost("register")]
    public async Task<IActionResult> Register(AuthRequest request)
    {
        var exists = await _db.Users.AnyAsync(u => u.Username == request.Username);
        if(exists) return BadRequest("Username-ul exista deja!");

        var user = new User 
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok("Cont creat cu succes!");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthRequest request)
    {
      var user = await _db.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
        if(user is null) return Unauthorized("Credentiale invalide!");

        var validPassoword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if(!validPassoword) return Unauthorized("Credentiale invalide!");

        var token = GenerateToken(user);
        return Ok(new {token});

    }

    private string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("userId", user.Id.ToString())
        };
        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }


}

public record AuthRequest(string Username, string Password);