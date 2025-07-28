import axios from 'axios';
import { API_CONFIG } from './constants/api-config';
import type { OpenWeatherResponse } from './types';

const api = axios.create({
	baseURL: API_CONFIG.BASE_URL,
	params: {
		appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
		units: 'metric',
	},
});

const fetchCityWeather = <T>(city: string, endPoint: string, days?: number) => {
	return api.get<T>(endPoint, {
		params: {
			q: city,
			cnt: days,
		},
	});
};

/** 현재 날씨 */
export const fetchCurrentWeather = (city: string) =>
	fetchCityWeather<OpenWeatherResponse>(city, API_CONFIG.ENDPOINTS.CURRENT);

/** 예측 날씨 */
export const fetchForecastWeather = (city: string, days: number) =>
	fetchCityWeather<{ list: OpenWeatherResponse[] }>(
		city,
		API_CONFIG.ENDPOINTS.FORECAST,
		days,
	);
