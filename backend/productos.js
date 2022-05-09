const admin = require("firebase-admin");
class Productos {
    constructor({ name, options }) {
        this.name = name;
        this.firebase = (admin.apps.length === 0) ? admin.initializeApp({
            credential: admin.credential.cert(options)
        }) : admin.app();
        this.query = this.firebase.firestore().collection(this.name);
    }

    async save(data) {
        try {
            const doc = await this.query.doc();
            await doc.set({ ...data, id: doc.id });
            return { _id: doc.id };
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getById(id) {
        try {
            const doc = this.query.doc(id);
            const snapshot = await doc.get();
            const response = snapshot.data();
            return response;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async getAll() {
        try {
            let snapshot = await this.query.get();
            let docs = snapshot.docs.map(doc => doc.data());
            return docs;
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async updateById(id, data) {
        try {
            const doc = this.query.doc(id);
            await doc.update(data);
            return await (await doc.get()).data();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async deleteById(id) {
        try {
            const doc = this.query.doc(id);
            return await doc.delete();
        } catch (e) {
            console.log(e);
            return null;
        }
    }

    async deleteAll() {
        try {
            const docs = this.query.get();
            docs.forEach(doc => doc.delete());
            return true;
        } catch (e) {
            console.log(e);
            return null;
        }
    }
}

module.exports = Productos;