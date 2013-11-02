module.exports = {
    dateFromNow: function (diff) {
        var nowTime = new Date(),
            beforeTime = nowTime - diff;
        return new Date(beforeTime);
    }
};