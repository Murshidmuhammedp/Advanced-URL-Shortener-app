import redis from "../Config/redisConfig.js";
import URL from "../Models/UrlModel.js";

export const topicBasedAnalytics = async (req, res) => {
    try {
        const { topic } = req.params;

        const cachedAnalytics = await redis.get(`analytics:topic:${topic}`);
        if (cachedAnalytics) {
            return res.status(200).json(JSON.parse(cachedAnalytics));
        }

        const urls = await URL.find({ topic });

        const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
        const uniqueUsers = new Set(urls.flatMap(url => url.clicks.map(click => click.ipAddress))).size;

        const clicksByDate = {};
        urls.forEach(url => {
            url.clicks.forEach(click => {
                const date = click.timestamp.toISOString().split('T')[0];
                clicksByDate[date] = (clicksByDate[date] || 0) + 1;
            });
        });

        const urlDetails = urls.map(url => ({
            shortUrl: url.shortUrl,
            totalClicks: url.clicks.length,
            uniqueUsers: new Set(url.clicks.map(click => click.ipAddress)).size
        }));
        const response = {
            totalClicks,
            uniqueUsers,
            clicksByDate: Object.entries(clicksByDate).map(([date, totalClick]) => ({ date, totalClick })),
            urls: urlDetails
        }

        await redis.set(`analytics:topic:${topic}`, JSON.stringify(response), 'EX', 240);
        return res.status(200).json(response);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}