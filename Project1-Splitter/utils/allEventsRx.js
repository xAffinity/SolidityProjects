const Rx = require('rx');

/**
 * It creates an observable with the contract's events. Needs to be added to the contract.
 * @param {!Object} filterObject as per https://github.com/ethereum/wiki/wiki/JavaScript-API#parameters-30
 * @returns {!Observable.<Object>} observable of all the Splitter events.
 */
module.exports = function(filterObject) {
    const myContract = this;
    return Rx.Observable.create(function (observer) {
        const filter = myContract.allEvents(filterObject);
        filter.watch(function (error, event) {
            if (error) {
                observer.onError(error);
            } else {
                observer.onNext(event);
            }
            // There is no way to know the end and call `.onCompleted()`.
        });

        return function() {
            if (typeof filter !== "undefined") {
                filter.stopWatching(function(error) {
                    if (error) {
                        console.error(error);
                    }
                });
            }
        };
    });
};