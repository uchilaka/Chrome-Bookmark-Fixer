angular.module('app.test', [])
    .run([
        '$rootScope', '$templateCache', '$http', '$templateRequest', '$compile', '$timeout',
        function ($all, $template, $http, $templateGet, $compile, $timeout) {

            $all.$on('$routeChangeSuccess', function () {
                console.warn('[Running tests]');

                // date format test 
                var exDate = new Date();
                console.warn('Time: %d', exDate.getTime());

                // parse date 
                var newDate = new Date(parseInt('1446977317') * 1000);
                console.warn('Parsed date: %o', newDate);

                // sjcl 
                console.warn('SHA256 Hash: %s', sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash('Hello World!')));
                //console.warn('SHA512 Hash: %s', sjcl.codec.base64.fromBits(sjcl.hash.sha512.hash('Hello World!')));

                var req = {
                    method: 'GET',
                    url: 'data/test.json',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                $http(req)
                    .then(
                    function onSuccess(res) {
                        console.log('Test JSON data: %o', res);

                        $all.roots = res.data.roots;

                        // get template 
                        $templateGet('tmpl/bookmarks.htm').then(function (tmpl) {
                            console.log('Template: %s', tmpl);
                            var el = document.createElement('pre');
                            el.innerHTML = tmpl;
                            $compile(el)($all);
                            $timeout(function () {
                                console.log('Compiled? %o', el.innerHTML);
                            }, 100, true);
                        });

                    }
                    , function onError(res) {
                        console.error('Something went wrong');
                    }
                    );

            });

        }]);