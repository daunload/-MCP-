import { z } from 'zod';
import { fetchCurrentWeather } from './api';
import type { WeatherData } from './types';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import axios from 'axios';
import {
	ResourceTemplate,
	McpServer,
} from '@modelcontextprotocol/sdk/server/mcp.js';

const server = new McpServer(
	{
		name: 'weather-server',
		version: '0.1.0',
	},
	{
		capabilities: {
			resources: {},
			tools: {},
		},
	},
);

server.registerResource(
	'city-weather',
	new ResourceTemplate('weather://{city}/current', { list: undefined }),
	{
		title: 'city weather',
		description:
			'Fetches the current weather conditions for a specified city',
		mimeType: 'application/json',
	},
	async (uri, { city }) => {
		if (!city) {
			throw new Error('City name is required to fetch weather data.');
		}

		if (Array.isArray(city)) {
			throw new Error('City is Array.');
		}

		try {
			const response = await fetchCurrentWeather(city);

			const weatherData: WeatherData = {
				temperature: response.data.main.temp,
				conditions: response.data.weather[0].description,
				humidity: response.data.main.humidity,
				wind_speed: response.data.wind.speed,
				timestamp: new Date().toISOString(),
			};

			return {
				contents: [
					{
						uri: uri.href,
						mimeType: 'application/json',
						text: JSON.stringify(weatherData, null, 2),
					},
				],
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new McpError(
					ErrorCode.InternalError,
					`날씨 API 오류: ${error.response?.data.message ?? error.message}`,
				);
			}
			throw error;
		}
	},
);

// 도구 등록 추가
server.registerTool(
	'get_weather',
	{
		title: 'city weather',
		description: 'Get current weather for a city',
		inputSchema: {
			city: z
				.string()
				.min(1, 'City name cannot be empty')
				.describe('The name of the city'),
		},
	},
	async ({ city }) => {
		if (!city || typeof city !== 'string') {
			throw new McpError(
				ErrorCode.InvalidParams,
				'City name is required and must be a string',
			);
		}

		try {
			const response = await fetchCurrentWeather(city);

			const weatherData: WeatherData = {
				temperature: response.data.main.temp,
				conditions: response.data.weather[0].description,
				humidity: response.data.main.humidity,
				wind_speed: response.data.wind.speed,
				timestamp: new Date().toISOString(),
			};

			return {
				content: [
					{
						type: 'text',
						text: `현재 ${city}의 날씨:
                                온도: ${weatherData.temperature}°C
                                날씨: ${weatherData.conditions}
                                습도: ${weatherData.humidity}%
                                풍속: ${weatherData.wind_speed} m/s
                                조회시간: ${weatherData.timestamp}`,
					},
				],
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new McpError(
					ErrorCode.InternalError,
					`날씨 API 오류: ${error.response?.data.message ?? error.message}`,
				);
			}
			throw error;
		}
	},
);

const transport = new StdioServerTransport();
server
	.connect(transport)
	.then(() => {
		console.error('Weather MCP server running on stdio');
	})
	.catch((error) => {
		console.error('Failed to run server', error);
		process.exit(1);
	});
