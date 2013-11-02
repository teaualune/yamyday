exports.index = function (req, res) {
    res.locals.sectionHelper = function (partition, section, i, layoutType) {
        var sectionI = section + '[' + i + ']',
            img = '<img src="{{ ' + sectionI + '.imgUrl }}" />',
            content = '<p>{{ ' + sectionI + '.content }}</p>';
        return text = [
            '<div class="section s-1-' + partition + ' layout' + layoutType + '">',
            '<h3>{{ ' + sectionI + '.title }}</h3>',
            '<h4>{{ ' + sectionI + '.subTitle }}</h4>',
            (layoutType === 3) ? '' : img,
            content,
            // '<span class="more">more</span>',
            // '<span class="add-store" ng-click="toggleStore(' + sectionI + ', $event)"></span>'
            '</div>'
        ].join('');
    };
    res.render('index', { title: 'Ya! MyDay - 雅每迭新聞' });
};