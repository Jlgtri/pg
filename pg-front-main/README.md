# Pege landing frontend

## Configuration

The application uses environment variables for configuration. Copy `env.example` to `.env` and modify the values as needed.

### Environment Variables

All configuration data is now stored in env file. The main configuration variables are:

1. `VITE_START_DATE_INPUT` - Start date in format "HH-MM-SS DD-MM-YYYY"
2. `VITE_TIME_BETWEEN_SNAPSHOTS_MINUTES` - Periods between snapshots in minutes for testing purposes, default is 10 minutes
3. `VITE_TIME_BETWEEN_SNAPSHOTS_DAYS` - Periods between snapshots in days. If value is more than 0, this period will have priority and will be used for calculating time between snapshots
4. `VITE_DONATION_ADDRESS` - Donation address
5. `VITE_TG_LINK` - TG link
6. `VITE_X_LINK` - X.com link
7. `VITE_HOME_LINK`, `VITE_WHO_IS_PEGE_LINK`, `VITE_WHY_PEGE_LINK`, `VITE_ROADMAP_LINK`, `VITE_TOKENOMICS_LINK` - Links to another PEGE website for navigation

