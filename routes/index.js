
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.locals.sectionHelper = function (partition, section, i) {
        var sectionI = section + '[' + i + ']';
        return text = [
            '<div class="section s-1-' + partition + '"><img src="{{ ',
            sectionI + '.imgUrl }}" /><h3>{{ ',
            sectionI + '.title }}</h3><h4>{{ ',
            sectionI + '.subTitle }}</h4>',
            '<span class="more">more</span>',
            '<span class="add-store" ng-click="toggleStore(' + sectionI + ', $event)"></span></div>'
        ].join('');
    };
    res.render('index', { title: 'Ya! MyDay - 雅每迭新聞' });
};