module KeyStore {
    export var prcoessExecutionOfCode = function (request: IWebWorkerRequest) {
        QueryRequests.push(request);
        if (QueryRequests.length == 1) {
            executeCode();
        }
    }

    export var executeCode = function () {
        if (QueryRequests.length > 0) {
            var Request = <IWebWorkerRequest>{
                Name: QueryRequests[0].Name,
                Query: QueryRequests[0].Query
            }
            executeCodeDirect(QueryRequests[0]);
        }
    }

    export var executeCodeDirect = function (request: IWebWorkerRequest) {
        var That = this;
        new Business.Main(function (results) {
            That.processFinishedRequest(results);
        }).checkConnectionAndExecuteLogic(request);
    }

    export var processFinishedRequest = function (message: IWebWorkerResult) {
        var FinishedRequest: IWebWorkerRequest = this.QueryRequests.shift();
        if (message.ErrorOccured) {
            if (FinishedRequest.OnError) {
                FinishedRequest.OnError(message.ErrorDetails);
            }
            else {
                console.log(message.ErrorDetails);
            }
        }
        else {
            if (FinishedRequest.OnSuccess) {
                if (message.ReturnedValue) {
                    FinishedRequest.OnSuccess(message.ReturnedValue);
                }
                else {
                    FinishedRequest.OnSuccess();
                }
            }
        }
        this.executeCode();
    }

}