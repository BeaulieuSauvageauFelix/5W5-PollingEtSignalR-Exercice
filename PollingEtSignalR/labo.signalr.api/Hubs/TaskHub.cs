using labo.signalr.api.Data;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace labo.signalr.api.Hubs
{
    public class TaskHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public TaskHub(ApplicationDbContext context)
        {
            _context = context;
        }

        public override async Task OnConnectedAsync()
        {
            await Clients.Caller.SendAsync("TaskList", await _context.UselessTasks.ToListAsync());
        }
    }
}
