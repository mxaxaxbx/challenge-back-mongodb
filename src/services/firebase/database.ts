import admin from 'firebase-admin';

class Model {

    private db = admin.firestore();
    private collection = "";

    constructor(collection: string) {
        this.collection = collection;
    }

    async get_by_id(doc_id: string): Promise<any> {
        const docRef = this.db.collection( this.collection ).doc( doc_id );
        const doc    = await docRef.get();

        if( !doc.exists ) return null;

        return doc.data();
    }
}

export {
    Model
}
