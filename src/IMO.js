var IMO = IMO || (function () {
    var client = function (hostname, authentication, productName, options) {

        //-------------------------------------------------------------
        // Verify hostname starts with a scheme
        //-------------------------------------------------------------
        var scheme = ((hostname.match(/^(http|https):\/\//))
                    ? ""
                    : 'http://');

        if (options === undefined) {
            options = {
                crossDomain: true,
                contentType: "application/json",
                accept : "application/json"
            }
        }

        //-------------------------------------------------------------
        // A Deferred object contains the promise that will be returned
        // to the API's callers.
        //-------------------------------------------------------------
        var deferred = $.Deferred();

        //-------------------------------------------------------------
        // Construct the complete path to the service point.
        //-------------------------------------------------------------
        var constructUrl = function (method, productName, action) {
            var url = scheme
                     + hostname
                     + "/api/v2/product";

            if (productName != null) {
                url += ("/" + productName);
            }

            if (action != null) {
                url += ("/" + action);
            }

            //-------------------------------------------------------------
            // Uniqueify the URL to prevent cached data being
            // returned by 304 responses.
            //-------------------------------------------------------------
            url += '?xv=' + (new Date()).getMilliseconds().toString();

            console.log("url: " + url);
            return url;
        }

        //-------------------------------------------------------------
        // Reshape any errors into a common [response] object,
        //-------------------------------------------------------------
        var constructErrorResponse = function (status, msg) {
            return {
                readyState: 4, // Rejected
                status: status,
                statusText: msg,
                responseText: ""
            };
        }

        //-------------------------------------------------------------
        // Initiate RPC to portalwebservice.
        //      method: GET | POST
        //      productName: Name of the underlying stream
        //      action: action to perform against the product
        //      parameters: call's parameter as an object
        // Returns: a promise
        //-------------------------------------------------------------
        var remoteCall = function (method, productName, action, parameters) {

            options.method = method;

            if (method == "POST") {

                //--------------------------------------------------
                // [authentication] is required.
                // The value of authentication is expected to be the base64 encoded key and secret.
                //
                // Note: When going against a locally hosted Portal Web Service a secret may not be required.
                //--------------------------------------------------
                if (authentication === undefined || authentication == null) {
                    var response = constructErrorResponse(401, 'No [authentication] supplied.');
                    deferred.reject(response);
                    return deferred.promise();
                }

                options.headers = {
                    Authorization: "Basic " + authentication
                };

                options.processData = true;
                options.data = JSON.stringify(parameters);
            }

            var url = constructUrl(method, productName, action);

            //-----------------------------------------
            // Make the request; return a promise.
            //-----------------------------------------
            var request = $.ajax(url, options)
                .fail(function (response) {
                    var msg = "Error: (" + response.status + ") "
                                + response.statusText
                                + " -  Call to [" + url + "] failed.\n"
                                + formatJSON(response.responseText);
                    console.log(msg);
                    deferred.reject(response);
                })
                .done(function (data, callStatus, response) {
                    deferred.resolve(response);
                });

            return deferred.promise();
        }

        //----------------------------------------------------------------------
        // Return the Portal Web Service API object.
        //
        // The API object contains only the entry points needed to
        // meet the PortalWebService contract: products, product, search, detail,
        // item, count).
        //
        // For entry-points requiring parameters, it is the caller's responsibilty
        // to create a properly shaped parameter object. An improperly-shaped
        // object will result in the promise being rejected. The 'responseJSON'
        // property of the response object will contain a 'modelState' property,
        // with a member for each missing, or improperly formed parameter.
        //
        // Each function returns a promise. The 'done' and 'failed' functions
        // of the promise will receive a response object with at least these
        // properties:
        //
        //  response
        //  ---------
        //      readyState: number
        //      status: number
        //      statusText: string
        //      responseText: string
        //
        //  The response object sent through the 'done' function, may also contain an
        //  object 'responseJSON'. In this case the responseText will contain
        //  the serialized form of the responseJSON.
        //
        //  example
        //  -------
        //      function callForProduct(productName) {
        //
        //          var hostname = "localhost/portalwebservice";
        //          var authentication = "SU1PVEVTVA==";
        //
        //          var client = new IMO.PortalWebClient(hostname, authentication, productName);
        //
        //          client.product()
        //              .done(responseHandler)
        //              .fail(function (response) {
        //                  alert((response.responseJSON === undefined)
        //                                      ? response.statusText
        //                                      : formatJSON(response.responseText));
        //              });
        //
        //       var responseHandler = function (response) {
        //           var msg = (response.status == 200)
        //                       ? formatJSON(response.responseText)
        //                       : response.responseText;
        //           console.log('Response: ' + msg);
        //           // ... use 'response.responseJSON' for what-ever.;
        //       }
        //
        //----------------------------------------------------------------------
        return {
            //-----------------------------------------------------
            // product
            // product/{productName}
            //-----------------------------------------------------
            products: function () {
                return remoteCall("GET");
            },

            product: function () {
                return remoteCall("GET", productName);
            },

            //-----------------------------------------------------
            // product/{productName}/search
            //-----------------------------------------------------
            search: function (parameters) {
                if (parameters === undefined) {
                    parameters = {}
                }

                if (productName === undefined || productName == null) {
                    var response = constructErrorResponse(400, "No [productName] given.");
                    deferred.reject(response);
                    return deferred.promise();
                }
                return remoteCall("POST", productName, "search", parameters);
            },

            //-----------------------------------------------------
            // product/{productName}/detail
            //-----------------------------------------------------
            detail: function (parameters) {
                if (parameters === undefined) {
                    parameters = {}
                }

                if (productName === undefined || productName == null) {
                    var response = constructErrorResponse(400, "No [productName] given.");
                    deferred.reject(response);
                    return deferred.promise();
                }

                return remoteCall("POST", productName, "detail", parameters);
            },

            //-----------------------------------------------------
            // product/{productName}/item
            //-----------------------------------------------------
            item: function (parameters) {
                if (parameters === undefined) {
                    parameters = {}
                }

                if (productName === undefined || productName == null) {
                    var response = constructErrorResponse(400, "No [productName] given.");
                    deferred.reject(response);
                    return deferred.promise();
                }

                return remoteCall("POST", productName, "item", parameters);
            },

            //-----------------------------------------------------
            // product/{productName}/count
            //-----------------------------------------------------
            count: function (parameters) {
                if (parameters === undefined) {
                    parameters = {}
                }

                if (productName === undefined || productName == null) {
                    var response = constructErrorResponse(400, "No [productName] given.");
                    deferred.reject(response);
                    return deferred.promise();
                }

                return remoteCall("POST", productName, "count", parameters);
            }
        }
    };

    return {
        //-----------------------------------------------------------
        // Define the c-tor 'PortalWebClient'; a function that
        // returns the API object.
        //-----------------------------------------------------------
        PortalWebClient: function (hostname, authentication, productName) {
            var api = client(hostname, authentication, productName);
            return api;
        }
    }
}());
