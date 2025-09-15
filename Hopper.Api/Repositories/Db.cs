using System.Data;
using Microsoft.Data.SqlClient;

namespace Hopper.Api.Repositories;

public class Db
{
    private readonly string _connectionString;

    public Db(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("Default")
            ?? throw new InvalidOperationException("Missing connection string: Default");
    }

    public IDbConnection Open()
    {
        var conn = new SqlConnection(_connectionString);
        conn.Open();
        return conn;
    }
}