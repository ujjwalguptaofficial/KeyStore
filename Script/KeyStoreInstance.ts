module KeyStore {

    /**
     * Initialize KeyStore
     * 
     */
    export var init = function () {
        if (Status.ConStatus == ConnectionStatus.NotStarted) {
            UtilityLogic.setDbType();
            KeyStoreObj = new Business.MainLogic();
            KeyStoreObj.createDb(TableName);
        }
    };

    /**
    * return the value by key
    * 
    * @param {string} key 
    * @param {Function} onSuccess 
    * @param {Function} [onError=null] 
    */
    export var get = function (key: string, onSuccess: Function, onError: Function = null) {
        if (Status.ConStatus == ConnectionStatus.Connected) {
            var Query = <ISelect>{
                From: this.TableName,
                Where: {
                    Key: key
                }
            }
            this.KeyStoreObj.get(Query, onSuccess, onError);
        }
        else if (Status.ConStatus == ConnectionStatus.NotStarted) {
            var That = this;
            setTimeout(function () {
                That.get(key, onSuccess, onError);
            }, 50);
        }
        else if (Status.ConStatus == ConnectionStatus.Closed) {
            var That = this;
            this.openDb();
            setTimeout(function () {
                That.get(key, onSuccess, onError);
            }, 50);

        }
    };

    /**
    * insert or update value
    * 
    * @param {any} key 
    * @param {any} value 
    * @param {Function} [onSuccess=null] 
    * @param {Function} [onError=null] 
    */
    export var set = function (key, value, onSuccess: Function = null, onError: Function = null) {
        if (Status.ConStatus == ConnectionStatus.Connected) {
            var Value = <ISet>{
                Key: key,
                Value: value
            }
            KeyStoreObj.set(this.TableName, Value, onSuccess, onError);
        }
        else if (Status.ConStatus == ConnectionStatus.NotStarted) {
            var That = this;
            setTimeout(function () {
                That.set(key, value, onSuccess, onError);
            }, 50);
        }
        else if (Status.ConStatus == ConnectionStatus.Closed) {
            var That = this;
            this.openDb();
            setTimeout(function () {
                That.set(key, value, onSuccess, onError);
            }, 50);
        }
    };

    /**
    * delete value
    * 
    * @param {string} key 
    * @param {Function} [onSuccess=null] 
    * @param {Function} [onError=null] 
    */
    export var remove = function (key: string, onSuccess: Function = null, onError: Function = null) {
        if (Status.ConStatus == ConnectionStatus.Connected) {
            var Query = <IDelete>{
                From: this.TableName,
                Where: {
                    Key: key
                }
            }
            this.KeyStoreObj.remove(Query, onSuccess, onError);
        }
        else if (Status.ConStatus == ConnectionStatus.NotStarted) {
            var That = this;
            setTimeout(function () {
                That.remove(key, onSuccess, onError);
            }, 50);
        }
        else if (Status.ConStatus == ConnectionStatus.Closed) {
            var That = this;
            this.openDb();
            setTimeout(function () {
                That.remove(key, onSuccess, onError);
            }, 50);
        }
    }
}
