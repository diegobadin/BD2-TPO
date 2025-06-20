const redisClient = require('../db/redis');

const dependencyMap = new Map(); // recurso -> Set de claves de cache

/**
 * Registra una query como dependiente de un recurso
 * @param {string} resource - por ejemplo "productos"
 * @param {string} queryKey - por ejemplo "queryX"
 */
function subscribe(resource, queryKey) {
    if (!dependencyMap.has(resource)) {
        dependencyMap.set(resource, new Set());
    }
    dependencyMap.get(resource).add(queryKey);
}

/**
 * Marca como sucio un recurso, borrando del cache todas las queries relacionadas
 * @param {string} resource
 */
async function markDirty(resource) {
    const dependents = dependencyMap.get(resource);
    if (!dependents) return;

    for (const queryKey of dependents) {
        await redisClient.del(queryKey);
        console.log(`[Cache] Invalidado: ${queryKey} por cambio en ${resource}`);
    }
    dependencyMap.set(resource, new Set());
}

module.exports = {
    subscribe,
    markDirty
};
