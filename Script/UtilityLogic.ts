module KeyStore {
    export interface IError {
        Name: string,
        Value: string
    }
    export class UtilityLogic {
        /**
         * determine and set the DataBase Type
         * 
         * 
         * @memberOf UtilityLogic
         */
        static setDbType = function () {
            (window as any).indexedDB = window.indexedDB || (window as any).mozIndexedDB || (window as any).webkitIndexedDB || (window as any).msIndexedDB;
            if (indexedDB) {
                (window as any).IDBTransaction = (window as any).IDBTransaction || (window as any).webkitIDBTransaction || (window as any).msIDBTransaction;
                (window as any).IDBKeyRange = (window as any).IDBKeyRange || (window as any).webkitIDBKeyRange || (window as any).msIDBKeyRange
            }
            else {
                throw 'Your browser doesnot support IndexedDb';
            }
        }

    }
}
