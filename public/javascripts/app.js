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
        },
        hoursAgo = function (timeString) {
            var time = new Date(timeString),
                now = new Date(),
                hours = Math.floor((((now - time) / 1000) / 60) / 60);
            return (hours) ? (hours + '小時前') : '現在';
        },

        newsPage = [
            '.headline',
            '.one',
            '.two',
            '.three'
        ],
        newsPageIdx = 0;

    window.app = A.module('yamyday', []);

    app.factory('storeModel', function () {
        var _stores = [];
        return {
            stores: function () {
                return _stores;
            },
            add: function (news) {
                _stores.push(news);
            },
            remove: function (idx) { // index in _stores
                _stores.splice(idx, 1);
            }
        };
    });

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
                    s,
                    i = 0;

                news = data.news;
                scores = data.scores;
                shares = data.shares;
                for (s in shares) {
                    if (shares.hasOwnProperty(s)) {
                        for (i; i < shares[s].length; i = i + 1) {
                            shares[s][i].hoursAgo = hoursAgo(shares[s][i].date);
                        }
                    }
                }
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
                    headline.secondTitle = '';
                    headline.thirdTitle = '';
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
            newsById: function (id) {
                for (var i = 0; i < news.length; i = i + 1) {
                    if (news[i]._id === id) {
                        return news[i];
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
        'storeModel',
        function (s, h, nm, sm) {
            s.headline = nm.headline;
            s.one = nm.one;
            s.two = nm.two;
            s.three = nm.three;
            h.get('/ajax/main').success(function (data) {
                console.log(data);
                $('.pages').removeClass('invisible');
                $('.loading').addClass('hidden');
                nm.init(data);
            });
            s.toggleStore = function (news, e) {
                var idx = sm.stores().indexOf(news);
                $(e.currentTarget).toggleClass('added');
                if (idx >= 0) { // found, remove
                    sm.remove(idx);
                } else { // not found, add
                    sm.add(news);
                }
            };
            s.toggleStoreView = function (e) {
                $(e.currentTarget).toggleClass('added');
                $('.store').toggleClass('hidden');
            };
        }
    ]);

    app.controller('DetailPageCtrl', [
        '$scope',
        'newsModel',
        function (s, nm) {
            s.detailNews = nm.detailNews;
            s.closeDetail = function () {
                $('.page').addClass('hidden');
                $(newsPage[newsPageIdx]).removeClass('hidden');
            };
            $('.pages').delegate('.section', 'click', function (e) {
                var newsID = $(e.currentTarget).attr('newsID');
                var n = nm.newsById(newsID);
                if (n) {
                    nm.detailNews = n;
                    $('.page').addClass('hidden');
                    $('.detail').removeClass('hidden');
                }
            });
        }
    ]);

    app.controller('StoreCtrl', [
        '$scope',
        'storeModel',
        function (s, sm) {
            s.stores = sm.stores();
        }
    ]);


    $('#prev').click(function (e) {
        if (newsPageIdx > 0) {
            newsPageIdx = newsPageIdx - 1;
            $('.page').addClass('hidden');
            $(newsPage[newsPageIdx]).removeClass('hidden');
        }
        if (newsPageIdx === 0) {
            $('.pages').addClass('layoutHeadline');
        } else {
            $('.pages').removeClass('layoutHeadline');
            $('.pages').removeClass('layoutThree');
        }
    });
    $('#next').click(function (e) {
        if (newsPageIdx < 3) {
            newsPageIdx = newsPageIdx + 1;
            $('.page').addClass('hidden');
            $(newsPage[newsPageIdx]).removeClass('hidden');
        }
        if (newsPageIdx === 3) {
            $('.pages').addClass('layoutThree');
        } else {
            $('.pages').removeClass('layoutThree');
            $('.pages').removeClass('layoutHeadline');
        }
    });


    $(window).mousemove(function (e) {
        var xRight = e.pageX / $(window).width(),
            xLeft = 1 - xRight;
        $('#prev').css('opacity', xLeft * 2);
        $('#next').css('opacity', xRight * 2);
    });

}(angular, jQuery));