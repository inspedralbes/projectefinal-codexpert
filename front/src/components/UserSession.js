var UserProfile = (function () {
    var uData = {};

    var getData = function () {
        return uData;
    };

    var setData = function (data) {
        uData = data;
    };

    return {
        getData: getData,
        setData: setData
    }

})();

export default UserProfile;