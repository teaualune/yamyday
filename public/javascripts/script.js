(function (A, $) {
    var sectionNewsSchema = function () {
            return {
                title: null,
                subTitle: null,
                imgUrl: null,
                content: null,
                newsID: null,
            };
        },

        detailNewsSchema = function () {
            return {
                newsTitle: null,
                imgUrl: null,
                content: null,
                newsID: null,
                shares: null
            };
        },

        mergeIntoNews = function (news, S, name) {
            var link, s, i;
            for (link in S) {
                if (S.hasOwnProperty(link)) {
                    s = S[link];
                    for (i = 0; i < news.length; i = i + 1) {
                        if (news[i]._id === link) {
                            news[i][name] = s;
                            break;
                        }
                    }
                }
            }
        };

    window.app = A.module('yamyday', []);
    // app.factory('newspaperStack', function () {
    //     var _c = {
    //             getPage: function () {
    //                 return _c.scrolls[_c._head];
    //             },
    //             scrolls: {
    //                 headline: {
    //                     idx: 0,
    //                     next: 'one',
    //                     DOM: null
    //                 },
    //                 one: {
    //                     idx: 1,
    //                     prev: 'headline',
    //                     next: 'two',
    //                     DOM: null
    //                 },
    //                 two: {
    //                     idx: 2,
    //                     prev: 'one',
    //                     next: 'three',
    //                     DOM: null
    //                 },
    //                 three: {
    //                     idx: 3,
    //                     prev: 'two',
    //                     DOM: null
    //                 }
    //             },
    //             _head: 'headline'
    //         },
    //         _s = [ _c ],
    //         }],
    //         stack = {
    //             push: function (obj) {
    //                 _s.push(obj);
    //             },
    //             pop: function () {
    //                 var obj = false;
    //                 if (_s.length > 1) {
    //                     obj = _s.pop();
    //                 }
    //                 return obj;
    //             },
    //             head: function () {
    //                 return _s[_s.length - 1];
    //             }
    //         };
    //     return {
    //         push: function (page) {
    //             // fadeOut('push', stack.head.getPage());
    //             stack.push(page);
    //             // fadeOut('push', stack.head.getPage());
    //         }
    //     }
    // });

    app.factory('newsModel', function () {
        var news,
            scores,
            shares,
            headline = {
                title: null,
                subTitle: null,
                imgUrl: null,
                newsID: null,
                secondTitle: null,
                thirdTitle: null
            },
            one = {
                content: null,
                shares: null
            },
            two = [
                sectionNewsSchema(),
                sectionNewsSchema(),
                sectionNewsSchema(),
                sectionNewsSchema()
            ],
            three = [
                sectionNewsSchema(),
                sectionNewsSchema(),
                sectionNewsSchema(),
                sectionNewsSchema(),
                sectionNewsSchema()
            ];
        return {
            init: function (data) {
                var n = 0,
                    i;

                news = data.news;
                scores = data.scores;
                shares = data.shares;
                mergeIntoNews(news, scores, 'score');
                mergeIntoNews(news, shares, 'shares');

                if (news.length === 0) {
                    console.log('...');
                }
                if (news.length > 0) { // at least 1
                    // who says it: data.news[0].shares[0].from.name
                    headline.title = data.news[0].shares[0].message;
                    headline.subTitle = data.news[0].title;
                    headline.imgUrl = data.news[0].imgUrl;
                    headline.newsID = data.news[0]._id;
                    one.content = data.news[0].content;
                    one.shares = data.news[0].shares;
                }
                if (news.length > 1) { // at least 2
                    n = Math.min(data.news.length, 5);
                    for (i = 1; i < n; i = i + 1) {
                        // who says it: data.news[i].shares[0].from.name
                        two[i - 1].title = data.news[i].shares[0].message;
                        two[i - 1].subTitle = data.news[i].title;
                        two[i - 1].imgUrl = data.news[i].imgUrl;
                        two[i - 1].content = data.news[i].content;
                        two[i - 1].newsID = data.news[i]._id;
                    }
                    headline.secondTitle = data.news[1].title;
                    headline.thirdTitle = (data.news[2]) ? data.news[2].title : null;
                }
                if (news.length > 5) { // at least 6
                    n = Math.min(data.news.length, 10);
                    for (i = 5; i < n; i = i + 1) {
                        // who says it: data.news[i].shares[0].from.name
                        three[i - 5].title = data.news[i].shares[0].message;
                        three[i - 5].subTitle = data.news[i].title;
                        three[i - 5].imgUrl = data.news[i].imgUrl;
                        three[i - 5].content = data.news[i].content;
                        three[i - 5].newsID = data.news[i]._id;
                    }
                }
            },
            headline: headline,
            one: one,
            two: two,
            three: three,
            detailNews: null // pointer to one of the news
        };
    });

    app.controller('MainCtrl', [
        '$scope',
        '$http',
        'newsModel',
        function (s, h, m) {
            s.headline = m.headline;
            s.one = m.one;
            s.two = m.two;
            s.three = m.three;
            h.get('/ajax/main').success(function (data) {
                console.log(data);
                $('.pages').removeClass('invisible');
                $('.loading').addClass('hidden');
                m.init(data);
            });
        }
    ]);

    app.controller('DetailPageCtrl', [
        '$scope',
        'newsModel',
        function (s, m) {
            s.detailNews = m.detailNews;
        }
    ]);

}(angular, jQuery));