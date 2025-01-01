import URL from "../Models/UrlModel.js";

export const topicBasedAnalytics = async (req, res) => {
    const { topic } = req.params;

    try {
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

        return res.status(200).json({
            totalClicks,
            uniqueUsers,
            clicksByDate: Object.entries(clicksByDate).map(([date, totalClick]) => ({ date, totalClick })),
            urls: urlDetails
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}