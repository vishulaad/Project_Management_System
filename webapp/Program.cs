using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json.Serialization;
using webapp.Data; // AppDbContext
using webapp.Services; 

var builder = WebApplication.CreateBuilder(args);

// --------------------------
// 1 Add Services to Container
// --------------------------

// Add Razor Pages
builder.Services.AddRazorPages();

// Add Controllers with JSON options (enum as string)
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Add DbContext (MySQL)
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

// Configure JWT Authentication
var jwtConfig = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtConfig["Issuer"],
            ValidAudience = jwtConfig["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtConfig["Key"]!))
        };
    });

//  Add CORS for React Vite (localhost:5173)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // React Vite default port
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // if using cookies/auth headers
    });
});

// Add Authorization
builder.Services.AddAuthorization();

// Add JwtService to generate tokens
builder.Services.AddScoped<JwtService>();

//  Register SprintService after builder is defined
builder.Services.AddScoped<ISprintService, SprintService>();

builder.Services.AddScoped<IStoryService, StoryService>();
// --------------------------
//  Build App
// --------------------------
var app = builder.Build();

// --------------------------
//  Configure Middleware
// --------------------------
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();


app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers()
   .RequireCors("AllowReactApp");

app.MapRazorPages();

app.Run();
