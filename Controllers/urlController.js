import shortid from "shortid";
import URL from "../Models/UrlModel.js";
import axios from "axios";
import redis from "../Config/redisConfig.js";
import User from "../Models/UserModel.js";

export const shortUrl = async (req, res) => {
    const { longUrl, customAlias, topic } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: "LongUrl is required" });
    }

    try {
        const userId = req.params.userId

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        };

        let alias = customAlias || shortid.generate();

        const existing = await URL.findOne({ alias })
        if (existing) {
            return res.status(400).json({ error: "Alias already in use" });
        }

        const shortUrl = `${req.protocol}://${req.get('host')}/api/shorten/${alias}`;
        const newUrl = new URL({
            longUrl,
            shortUrl,
            alias,
            topic,
            userId: user._id,
        });

        user.url_list.push(newUrl._id);
        await user.save();
        await newUrl.save();

        return res.status(200).json({ shortUrl, createdAt: newUrl.createdAt });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const redirectUrl = async (req, res) => {
    try {

        const { alias } = req.params;

        let longUrl = await redis.get(alias);
        if (longUrl) {
            return res.redirect(longUrl)
        };

        const url = await URL.findOne({ alias });

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        const ip = req.ip;
        const isLocalIP = (ip === '::1') || (ip === '127.0.0.1');
        let geolocation = {};

        if (isLocalIP) {
            geolocation = {
                status: 'local',
                message: 'Localhost request'
            };
        } else {
            try {
                const geoRes = await axios.get(`https://ipapi.co/${ip}/json/`);
                geolocation = geoRes.data;
            } catch (error) {
                console.error('error:', error);
            }
        }

        url.clicks.push({
            timestamp: new Date(),
            userAgent: req.headers['user-agent'],
            ipAddress: ip,
            geolocation
        });
        await url.save();
        await redis.set(`url:${alias}`, url.longUrl, 'EX', 3600);

        res.redirect(url.longUrl);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};