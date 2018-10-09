/**
 * Discord bot
 *
 * (c) 2018 ryosebach
 */
import * as cheerio_client from 'cheerio-httpcli';

import ImageDownloader from 'server/app/utils/imageDownloader';

export const fetchRainCloudRadorGif = async (url: string): Promise<Buffer> => {
    const $ = (await cheerio_client.fetch(url)).$;
    const mainImage = await $('td.mainImg');
    return ImageDownloader.fetchBuffer(mainImage.children('img').attr('src'));
};
