module.exports = {
    dateFromNow: function (diff) {
        var nowTime = new Date(),
            beforeTime = nowTime - diff;
        return new Date(beforeTime);
    },
    minutesFromNow: function (lastTime) {
        var nowTime = new Date(),
            diff = nowTime - lastTime,
            value = Math.ceil((diff / 1000) / 60);
        return value;
    }
};