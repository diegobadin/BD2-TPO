const express = require('express');
const path = require('path');
const router = express.Router();

const { getRedis } = require('../lib/redis');

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const queryPath = path.join(__dirname, '../queries/', `query${id}.js`);
        console.log(queryPath);
        const query = require(queryPath);

        const redisKey = query.key;
        const redisClient = getRedis();

        const cached = await redisClient.get(redisKey);
        if (cached) {
            return res.json({ source: 'redis', data: JSON.parse(cached) });
        }

        const results = await query.execute();
        await redisClient.set(redisKey, JSON.stringify(results));

        res.json({ source: 'mongo', data: results });
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: `Query '${id}' no encontrada o con error.` });
    }
});

module.exports = router;
