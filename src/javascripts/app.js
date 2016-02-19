module.exports = (function () {
    return {
        requests: {
            fetchNorris: function () {
                var currentUser = this.currentUser();
                return {
                    url: 'http://api.icndb.com/jokes/random?escape=javascript',
                    type: 'GET',
                    data: {
                        firstName: currentUser.name,
                        lastName: ""
                    }
                };
            },

            fetchNorrisFiltered: function () {
                var currentUser = this.currentUser();
                return {
                    url: 'http://api.icndb.com/jokes/random?limitTo=[nerdy]',
                    type: 'GET',
                    data: {
                        firstName: currentUser.name,
                        lastName: ""
                    }
                };
            }
        },
        events: {
            'app.activated': 'init',
            'app.deactivated': 'cleanup',
            'app.willDestroy': 'cleanup',
            'fetchNorris.done': function (data) {
                this.failureCounter = 0;
                this.renderNorris(data.value.joke);
            },
            'fetchNorris.fail': function (data){
                this.failureCounter = Math.max(10, this.failureCounter + 1);

                // Retry request after delay
                this.timeout = _.delay(this.ajax.bind(this, 'fetchNorris'), 1000 * this.failureCounter);
            },
            'fetchNorrisFiltered.done': function (data) {
                this.failureCounter = 0;
                this.renderNorris(data.value.joke);
            },
            'fetchNorrisFiltered.fail': function (data){
                this.failureCounter = Math.max(10, this.failureCounter + 1);

                // Retry request after delay
                this.timeout = _.delay(this.ajax.bind(this, 'fetchNorrisFiltered'), 1000 * this.failureCounter);
            }
        },

        init: function () {
            if ( this.setting('partyPooper') === false ) {
                this.ajax('fetchNorris');
            } else {
                this.ajax('fetchNorrisFiltered');
            }
            this.counter = 1;
            this.failureCounter = 0;
        },
        renderNorris: function (fact) {
            var image = 'norris-' + this.counter + '.jpg';
            this.counter = Math.max(1,((this.counter + 1) % 4));
            this.switchTo('norris', {
                fact: fact,
                image: image
            });
            this.timeout = _.delay(this.ajax.bind(this, 'fetchNorris'), 10000);
        },

        cleanup: function() {
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
        }
    };

}());
