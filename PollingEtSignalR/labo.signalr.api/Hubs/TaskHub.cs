using labo.signalr.api.Data;
using labo.signalr.api.Models;
using Microsoft.AspNetCore.Http.HttpResults;
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

        public static int UserCount { get; set; }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            UserCount++;
            await Clients.Caller.SendAsync("TaskList", await _context.UselessTasks.ToListAsync());
            await Clients.All.SendAsync("UserCount", UserCount);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
            UserCount--;
            await Clients.All.SendAsync("UserCount", UserCount);
        }

        public async Task Add(string taskText)
        {
            UselessTask uselessTask = new UselessTask
            {
                Text = taskText,
                Completed = false
            };

            _context.UselessTasks.Add(uselessTask);
            await _context.SaveChangesAsync();

            await Clients.All.SendAsync("TaskList", await _context.UselessTasks.ToListAsync());
        }

        public async Task CompleteTask(int id)
        {
            UselessTask uselessTask = _context.UselessTasks.Single(x => x.Id == id);
            uselessTask.Completed = true;
            await _context.SaveChangesAsync();

            await Clients.All.SendAsync("TaskList", await _context.UselessTasks.ToListAsync());
        }

    }
}
