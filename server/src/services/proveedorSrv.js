const { getDB } = require('../lib/mongo');
const { markDirty } = require('../utils/cacheDependency');

const proveedores = "proveedores";
const ops = "ops";


async function create(data) {
    const db = getDB();
    try {
        const result = await db.collection(proveedores).insertOne(data);
        await markDirty(proveedores);
        return { id_proveedor: result.insertedId, ...data };
    } catch (e) {
        if (e.code === 11000) {
            throw new Error("El id_proveedor ya existe.");
        }
        throw e;
    }
}


async function update(id, data) {
    const db = getDB();

    const result = await db.collection(proveedores).findOneAndUpdate(
        { id_proveedor: Number(id) },
        { $set: data },
        { returnDocument: 'after' } 
    );

    if (!result.value) {
        const err = new Error(`No se encontró ningún proveedor con id_proveedor = ${id}`);
        err.status = 404;
        throw err;
    }

    await markDirty(proveedores);
    
    return result.value;
}

async function remove(id) {
    const db = getDB();

    await db.collection(proveedores).deleteOne({ id_proveedor: Number(id) });
    await db.collection(ops).deleteOne({ id_proveedor: Number(id) });

    await markDirty(proveedores);
    await markDirty(ops);
}

module.exports = { create, update, remove };