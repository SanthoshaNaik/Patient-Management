using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using PatientManagement.Api.Data;
using PatientManagement.Api.Models;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

var builder = WebApplication.CreateBuilder(args);

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT key is missing.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("JWT issuer is missing.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("JWT audience is missing.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,

            ValidateAudience = true,
            ValidAudience = jwtAudience,

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),

            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

var connectionString =
    builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException(
        "Database connection string not found.");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularClient", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AngularClient");

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/api/auth/signup", async (
    SignupRequest request,
    ApplicationDbContext db,
    IPasswordHasher<User> passwordHasher) =>
{
    if (string.IsNullOrWhiteSpace(request.Name) ||
        string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest("All fields are required.");
    }

    if (!new System.ComponentModel.DataAnnotations.EmailAddressAttribute()
        .IsValid(request.Email))
    {
        return Results.BadRequest("Please enter a valid email address.");
    }

    if (request.Password.Length < 8)
    {
        return Results.BadRequest(
            "Password must contain at least 8 characters.");
    }

    var email = request.Email.Trim().ToLowerInvariant();

    var existingUser = await db.Users
        .FirstOrDefaultAsync(u => u.Email == email);

    if (existingUser is not null)
    {
        return Results.Conflict(
            "An account with this email already exists.");
    }

    var user = new User
    {
        Name = request.Name.Trim(),
        Email = email
    };

    user.PasswordHash = passwordHasher.HashPassword(
        user,
        request.Password);

    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Ok("Account created successfully.");
});


app.MapPost("/api/auth/login", async (
    LoginRequest request,
    ApplicationDbContext db,
    IPasswordHasher<User> passwordHasher) =>
{
    // Validate required fields
    if (string.IsNullOrWhiteSpace(request.Email) ||
        string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest("Email and password are required.");
    }

    // Find the user by email
    var email = request.Email.Trim().ToLowerInvariant();

    var user = await db.Users
        .FirstOrDefaultAsync(u => u.Email == email);

    // Check whether the account exists
    if (user is null)
    {
        return Results.Json(
            "Invalid email or password.",
            statusCode: StatusCodes.Status401Unauthorized);
    }

    // Verify the password against the stored hash
    var verificationResult = passwordHasher.VerifyHashedPassword(
        user,
        user.PasswordHash,
        request.Password
    );

    if (verificationResult == PasswordVerificationResult.Failed)
    {
        return Results.Json(
            "Invalid email or password.",
            statusCode: StatusCodes.Status401Unauthorized);
    }

    // Generate JWT token
var claims = new[]
{
    new System.Security.Claims.Claim(
        System.Security.Claims.ClaimTypes.NameIdentifier,
        user.Id.ToString()),

    new System.Security.Claims.Claim(
        System.Security.Claims.ClaimTypes.Name,
        user.Name),

    new System.Security.Claims.Claim(
        System.Security.Claims.ClaimTypes.Email,
        user.Email)
};

var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(jwtKey));

var credentials = new SigningCredentials(
    key,
    SecurityAlgorithms.HmacSha256);

var expiresAt = DateTime.UtcNow.AddMinutes(30);

var token = new JwtSecurityToken(
    issuer: jwtIssuer,
    audience: jwtAudience,
    claims: claims,
    expires: expiresAt,
    signingCredentials: credentials);

var tokenString = new JwtSecurityTokenHandler()
    .WriteToken(token);

return Results.Ok(new
{
    token = tokenString,
    expiresAt,
    name = user.Name,
    email = user.Email
});
});

app.Run();