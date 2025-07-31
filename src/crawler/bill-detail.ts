import axios from 'axios';
import * as cheerio from 'cheerio';

export const getBillSummery = async (detailUrl: string) => {
	const response = await axios.get(detailUrl);
	const html = response.data;
	const $ = cheerio.load(html);

	return $('#summaryContentDiv').text();
};
