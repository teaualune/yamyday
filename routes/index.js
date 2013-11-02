
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.locals.sectionHelper = function (partition, section, i) {
        return text = [
            '<div class="section s-1-' + partition + '"><img src="{{ ',
            section + '[' + i + '].imgUrl }}" /><h3>{{ ',
            section + '[' + i + '].title }}</h3><h4>{{ ',
            section + '[' + i + '].subTitle }}</h4><span class="more">more</span><span class="store"></span></div>'
        ].join('');
    };
    res.render('index', { title: req.session.fbid });
};