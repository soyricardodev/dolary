## TODO:
- [x] Add Vercel Redis to cache data and request from there
- [ ] Add Background fetch to update the data
- [ ] Store locally the data and get firts this
- [ ] Add a "Refresh" button to the "All Currencies" screen
- [ ] Add vercel cron job:
```
"crons": [
  {
    "path": "/api/cron",
    "schedule": "*/15 12-22 * * 1-5"
  }
]
```