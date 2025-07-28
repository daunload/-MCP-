export const API_CONFIG = {
	BASE_URL: 'http://api.openweathermap.org/data/2.5',
	DEFAULT_CITY: 'Seoul',
	ENDPOINTS: {
		CURRENT: 'weather',
		FORECAST: 'forecast',
	},
} as const;
