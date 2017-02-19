angular.module('BookmarkFixer', [
    'ngRoute',
    'ngSanitize',
    'app.test'
])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('!');
        $routeProvider
            .when('/', {
                templateUrl: 'tmpl/main.htm',
                controller: 'MainController'
            })
            .otherwise('/')
            ;
    })
    .controller('AppController', [
        '$scope',
        function ($_) {
            console.log('[AppController]');

        }
    ])
    .controller('MainController', [
        '$scope', '$http', '$compile', '$templateRequest', '$timeout',
        function ($_, $http, $compile, $templateGet, $timeout) {
            console.log('[MainController]');

            $_.output = {
                html: null,
                jsonString: ''
            };

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

                    $_.output.jsonString = JSON.stringify(res.data, null, '\t');

                    // map to scope data                    
                    $_.roots = res.data.roots;

                    var formatDate = function (time) {
                        if (!time) return;
                        var date = new Date(parseInt(time.substring(0, 13)));
                        return Math.round(date.getTime() / 1000);
                    }
                        , folderToDLDT = function (content, node) {
                            var dl = document.createElement('DL');
                            dl.innerHTML += '<p>\n';
                            var dt = document.createElement('DT');
                            var h3 = document.createElement('H3');
                            var keys = Object.keys(node);
                            keys.forEach(function (key) {
                                h3.setAttribute(key, node[key]);
                            });
                            h3.innerHTML = content;
                            dt.appendChild(h3);
                            dl.appendChild(dt);
                            return dl;
                        }
                        , linkToA = function (content, node) {
                            var a = document.createElement('A');
                            var keys = Object.keys(node);
                            a.setAttribute('HREF', node.url);
                            keys.forEach(function (key) {
                                if (!/url/i.test(key)) {
                                    a.setAttribute(key, node[key]);
                                }
                            });
                            a.innerHTML = content;
                            var dt = document.createElement('DT');
                            dt.appendChild(a);
                            return dt;
                        }
                        , appendChildrenToDL = function (nodes, dl) {
                            angular.forEach(nodes, function (child) {
                                var el;
                                switch (child.type) {
                                    case 'folder':
                                        el = folderToDLDT(child.name, {
                                            ADD_DATE: formatDate(child.date_added),
                                            LAST_MODIFIED: formatDate(child.date_modified)
                                        });
                                        appendChildrenToDL(child.children, el);
                                        break;

                                    case 'url':
                                    default:
                                        el = linkToA(child.name, {
                                            ADD_DATE: formatDate(child.date_added),
                                            url: child.url
                                        });
                                }
                                if (el) {
                                    dl.querySelector('DT').appendChild(el);
                                    dl.innerHTML += '\n\t';
                                }
                            });
                        }
                        ;

                    // Start processing document                    
                    var DocHTML = ''
                        , header = `
<!DOCTYPE NETSCAPE-Bookmark-file-1>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
                        `
                        , footer = `<!-- End of document -->`;

                    // Append header
                    DocHTML += header;
                    if ($_.roots['bookmark_bar']) {

                        var pf = $_.roots['bookmark_bar']
                            , dl = folderToDLDT(pf.name, {
                                PERSONAL_TOOLBAR_FOLDER: true,
                                ADD_DATE: formatDate(pf.date_added),
                                LAST_MODIFIED: formatDate(pf.date_modified)
                            });

                        // append children 
                        appendChildrenToDL(pf.children, dl);

                        // Capture HTML                        
                        DocHTML += dl.innerHTML;

                        // show output
                        $_.output.html = DocHTML;
                    }

                }
                , function onError(res) {
                    console.error('Something went wrong');
                }
                );

        }
    ])
    ;
