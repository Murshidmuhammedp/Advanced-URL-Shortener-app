import URL from "../Models/UrlModel.js";

export const urlAnalytics = async (req, res) => {
    const { alias } = req.params;
    try {
        const url = await URL.findOne({ alias });
        if (!url) {
            return res.status(404).json({ error: "Short URL not found" })
        }

        const totalClicks = url.clicks.length;

        const uniqueUsers = new Set(url.clicks.map(click => click.ipAddress)).size;

        const clicksByDate = {};
        const sevenDays = new Date();
        sevenDays.setDate(sevenDays.getDate() - 7);

        url.clicks.forEach(click => {
            const clickDate = new Date(click.timestamp);
            if (clickDate >= sevenDays) {
                const dateStr = clickDate.toISOString().split('T')[0];
                clicksByDate[dateStr] = (clicksByDate[dateStr] || 0) + 1;
            }
        });

        const osType = {};
        const deviceType = {};

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

        return res.status(200).json({
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
        console.error(error, "url analytics error");
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}