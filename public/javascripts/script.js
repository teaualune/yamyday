(function (A, $) {
    // var app = A.module('yamyday', []);
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

    $.ajax({
        type: 'GET',
        url: '/ajax/main',
        dataType: 'json'
    }).done(function (res) {
        console.log(res);
    }).fail(function (err) {
        console.log(err);
    });

}(angular, jQuery));