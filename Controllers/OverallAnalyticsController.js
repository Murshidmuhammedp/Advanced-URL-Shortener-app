import URL from "../Models/UrlModel.js";

export const overallAnalytics = async (req, res) => {
    try {
        const urls = await URL.find();

        const totalUrls = urls.length;
        const totalClicks = urls.reduce((sum, url) => sum + url.clicks.length, 0);
        const uniqueUsers = new Set(urls.flatMap(url => url.clicks.map(click => click.ipAddress))).size;

        const clicksByDate = {};
        urls.forEach(url => {
            url.clicks.forEach(click => {
                const date = click.timestamp.toISOString().split('T')[0];
                clicksByDate[date] = (clicksByDate[date] || 0) + 1;
            });
        });

        // OS and Device types
        const osType = {};
        const deviceType = {};

        urls.forEach(url => {
            url.clicks.forEach(click => {
                const userAgent = click.userAgent || '';
                const osMatch = userAgent.match(/Windows|Mac OS|Linux|Android|iOS/) || ['Unknown'];
                const osName = osMatch[0];

                const deviceName = /Mobile/.test(userAgent) ? 'Mobile' : 'Desktop';

                osType[osName] = (osType[osName] || { uniqueClicks: 0, uniqueUsers: new Set() });
                osType[osName].uniqueClicks++;
                osType[osName].uniqueUsers.add(click.ipAddress);

                deviceType[deviceName] = (deviceType[deviceName] || { uniqueClicks: 0, uniqueUsers: new Set() });
                deviceType[deviceName].uniqueClicks++;
                deviceType[deviceName].uniqueUsers.add(click.ipAddress);
            });
        });

        return res.status(200).json({
            totalUrls,
            totalClicks,
            uniqueUsers,
            clicksByDate: Object.entries(clicksByDate).map(([date, count]) => ({ date, count })),
            osType: Object.entries(osType).map(([osName, data]) => ({
                osName,
                uniqueClicks: data.uniqueClicks,
                uniqueUsers: data.uniqueUsers.size
            })),
            deviceType: Object.entries(deviceType).map(([deviceName, data]) => ({
                deviceName,
                uniqueClicks: data.uniqueClicks,
                uniqueUsers: data.uniqueUsers.size
            }))
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}