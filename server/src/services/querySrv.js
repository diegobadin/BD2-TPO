
const path = require('path');
const { getRedis } = require('../lib/redis');

async function get(req, res) {
    const id = req.params.id;
    try {
        const queryPath = path.join(__dirname, '../queries/', `query${id}.js`);
        const query = require(queryPath);

        const redisKey = query.getKey({
            query: req.query,
            params: req.params,
            body: req.body,
        });
        
        const redisClient = getRedis();

        const cached = await redisClient.get(query.getKey({
            query: req.query,
            params: req.params,
            body: req.body,
        }));
        if (cached) {
            return res.json({ source: 'redis', data: JSON.parse(cached) });
        }

        const results = await query.execute({
            query: req.query,
            params: req.params,
            body: req.body,
        });
        await redisClient.set(redisKey, JSON.stringify(results),{EX: 2 });

        res.json({ source: 'mongo', data: results });
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: `Query '${id}' no encontrada o con error.` });
    }
};

module.exports = {get};
