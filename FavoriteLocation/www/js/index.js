document.addEventListener('deviceready', onDeviceReady, false);

const kinveyBaseUrl = "https://baas.kinvey.com/";
const kinveyAppKey = "kid_BkazXV2fh";
const kinveyAppSecret = "a88cebf6f06747abbb76bfaa8d3494be";
const kinveyAppAuthHeaders = {
    "Authorization": "Basic " + btoa(kinveyAppKey + ":" + kinveyAppSecret) //if error occurs, remove Auth
};

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    checkSession();
    window.addEventListener('batterystatus', onBatteryStatus, false);
    navigator.geolocation.watchPosition(geolocationSuccess, geolocationError);

    function onBatteryStatus(status) {
        document.getElementById("battery").value = status.level
        if (status.level < 20) {
            if (window.navigator.userAgentData.mobile) {
                window.navigator.vibrate(2000);
            }
            ons.notification.toast('Battery low: ' + status.level + "%", { timeout: 2000, animation: 'fall' })
        }
    }

    $('#menu ons-tab').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
}

document.addEventListener('show', function (event) {
    ons.ready(function () {
        if (event.target.matches('#Tab1')) {
            if (sessionStorage.getItem('user_id'))
                listDest();
        }
        if (event.target.matches('#Tab3')) {
            if (sessionStorage.getItem('user_id'))
                getInfo(sessionStorage.getItem('user_id'));
        }
    });
});

$(document).ajaxStart(function () {
    showModal();
}).ajaxStop(function () {
    hideModal();
});

function showModal() {
    var modal = document.querySelector('ons-modal');
    modal.show();
}

function hideModal() {
    var modal = document.querySelector('ons-modal');
    modal.hide();
}

function applyDeviceData(device) {
    $('#operatingSystem').text(device.platform);
    $('#osVersion').text(device.version);
    navigator.geolocation.watchPosition(geolocationSuccess, geolocationError);
}

function geolocationSuccess(position) {
    $('#latitude').text(position.coords.latitude);
    $('#longitude').text(position.coords.longitude);
}

function geolocationError(error) {
    ons.notification.alert(error, {
        title: 'Error'
    });
}

function checkSession() {
    if (!sessionStorage.getItem('user_id')) {
        $("#signin").show();
        $("#signuplink").click(() => {
            $("#signin").hide();
            $("#signup").show();
        });
        $("#signinlink").click(() => {
            $("#signup").hide();
            $("#signin").show();
        });
        hideMenu();
    } else {
        showMenu();
        applyDeviceData(device);
    }
}


function login() {
    let userData = {
        username: $('#formLogin input[name=username]').val(),
        password: $('#formLogin input[name=password]').val()
    };

    if (userData.username == "" || userData.password == "") {
        ons.notification.alert('All fields are required!', {
            title: 'Error'
        });
        return;
    }

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/login",
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: loginSuccess,
        error: handleAjaxError
    });

    function loginSuccess(userInfo) {
        saveAuthInSession(userInfo);
        $("#signin").hide();
        showMenu();
        listDest();
        getInfo(sessionStorage.getItem('user_id'));
    }
}

function register() {
    let userData = {
        username: $('#formRegister input[name=username]').val(),
        password: $('#formRegister input[name=password]').val()
    };

    if (userData.username == "" || userData.password == "") {
        ons.notification.alert('All fields are required!', {
            title: 'Error'
        });
        return;
    }

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "user/" + kinveyAppKey + "/",
        headers: kinveyAppAuthHeaders,
        data: userData,
        success: registerSuccess,
        error: handleAjaxError
    });

    function registerSuccess(userInfo) {
        saveAuthInSession(userInfo);
        $("#signup").hide();
        showMenu();
        listDest();
        getInfo(sessionStorage.getItem('user_id'));
    }
}

function logout() {
    sessionStorage.clear();
    hideMenu();
    $("#signin").show();
}

function showMenu() {
    $("#welcome").hide();
    $("#menu").show();
}

function hideMenu() {
    $("#menu").hide();
    $("#welcome").show();
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON &&
        response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    ons.notification.alert(errorMsg, {
        title: 'Error'
    });
}

function saveAuthInSession(userInfo) {
    let userAuth = userInfo._kmd.authtoken;
    sessionStorage.setItem('authToken', userAuth);
    let userId = userInfo._id;
    sessionStorage.setItem('user_id', userId);
    sessionStorage.setItem('isAdmin', userInfo.isAdmin);
    sessionStorage.setItem('username', userInfo.username);
    let username = userInfo.username;
    ons.notification.toast('Wellcome, ' + username, { timeout: 2000, animation: 'fall' })
}

function getKinveyUserAuthHeaders() {
    return {
        "Authorization": "Kinvey " + sessionStorage.getItem('authToken')
    };
}

function getPicture() {
    navigator.camera.getPicture(
        successCameraCallback,
        failedCamCallback, {
        quality: 25,
        destinationType: Camera.DestinationType.DATA_URL
    });
}

function successCameraCallback(imageData) {
    $('#myImage').attr('src', 'data:image/jpeg;base64,' + imageData);
    $('#myImage').show();
}

function failedCamCallback() {
    ons.notification.alert("Can't add this picture!", {
        title: 'Error!'
    });
}

function add() {
    if ($('#description').val() == "") {
        ons.notification.alert('Add description!', {
            title: 'Error'
        });
        return;
    }

    if ($('#myImage').css('display') == "none") {
        ons.notification.alert('Take picture!', {
            title: 'Error'
        });
        return;
    }

    let data = {
        description: $('#description').val(),
        img: $('#myImage').attr('src'),
        latitude: $('#latitude').text(),
        langitude: $('#longitude').text()
    };

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/destinations",
        headers: getKinveyUserAuthHeaders(),
        data: data,
        success: addingSuccess,
        error: handleAjaxError
    });
    function addingSuccess() {
        ons.notification.alert('Destination successfully added!', {
            title: 'Success!'
        });
        $('#description').val("");
        $('#myImage').attr('src', '');
        $('#myImage').hide();
    }
}

function addComment() {
    if ($('#comment').val() == "") {
        ons.notification.alert('Enter comment!', {
            title: 'Error'
        });
        return;
    }

    let data = {
        comment: $('#comment').val(),
        rating: sessionStorage.getItem("rating"),
        post_id: sessionStorage.getItem("post_id"),
        date: new Date()
    };

    $.ajax({
        method: "POST",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/comments",
        headers: getKinveyUserAuthHeaders(),
        data: data,
        success: commentSuccess,
        error: handleAjaxError
    });

    function commentSuccess() {
        ons.notification.alert('Comment successfully added!', {
            title: 'Success!'
        }).then(() => {
            document
                .getElementById("my-dialog")
                .hide()
        });
    }
}

function listDest() {
    $('#list').empty();
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + "/destinations",
        headers: getKinveyUserAuthHeaders(),
        success: loadSuccess,
        error: handleAjaxError
    });

    function loadSuccess(destinations) {
        let table = $('<table class="table">').append(`<thead><tr>
            <th class="text-center" scope="col">Description</th>
            <th class="text-center" scope="col">Picture</th>
            <th class="text-center" scope="col">Distance</th>
            <th class="text-center" scope="col" colspan="2">Action</th>`);

        for (let i = 0; i < destinations.length; i++) {
            appendRow(destinations[i], table);
            $('#list').append(table);
        }
    }
}

function appendRow(destination, table) {
    let deleteBtn = "";
    let commentBtn = `<button onclick="showTemplateDialog(this.id)" class="btn btn-info" id="${destination._id}">
                    <ons-icon style="color: white!important;" icon="ion-ios-create"></ons-icon>
            </button>`;

    if (destination._acl.creator == sessionStorage['user_id'] || sessionStorage['isAdmin'] == 1) {
        deleteBtn = `
            <button onclick="deleteDest(this.id)" class="btn btn-danger" id="${destination._id}">
                    <ons-icon style="color: white!important;" icon="ion-ios-trash"></ons-icon>
            </button>`;
    }
    table.append(`<tr scope="row">
            <td class="text-center align-middle">${destination.description}</td>
            <td class="text-center align-middle"><img id="myImage" class="mx-3 border" style="width: 150px; height: 150px; object-fit: cover;" src=" ${destination.img}" alt="Alternate Text"/></td>
            <td class="text-center align-middle">${getDistanceFromLatLonInKm(destination.latitude, destination.langitude, $('#latitude').text(), $('#longitude').text())} km</td>
            <td class="text-center align-middle">${commentBtn}</td>
            <td class="text-center align-middle">${deleteBtn}</td>`);

}

function viewComments(id) {
    $('#comments').empty();
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + '/comments/?query={"post_id":"' + id + '"}',
        headers: getKinveyUserAuthHeaders(),
        beforeSend: function () {
            var modal = document.querySelector('ons-modal');
            modal.show();
        },
        success: loadSuccess,
        error: handleAjaxError,
        complete: function () {
            var modal = document.querySelector('ons-modal');
            modal.hide();
        }
    });

    function loadSuccess(comments) {
        $('#average').text(calcAverageRating(comments));
        let table = $('<table class="table">').append(`<thead><tr>
            <th class="text-center" scope="col">Comment</th>
            <th class="text-center" scope="col">Rating</th>
            <th class="text-center" scope="col">Before</th>
            <th class="text-center" scope="col">Action</th>`);
        for (let i = 0; i < comments.length; i++) {
            fillComment(comments[i], table);
            $('#comments').append(table);
        }
    }

    function fillComment(commentData, table) {
        let deleteBtn = "", rating = "--";
        if (commentData._acl.creator == sessionStorage['user_id'] || sessionStorage['isAdmin'] == 1) {
            deleteBtn = `
                <button onclick="deleteComment(this.id)" class="btn btn-danger" id="${commentData._id}">
                        <ons-icon style="color: white!important;" icon="ion-ios-trash"></ons-icon>
                </button>`;
        }
        if (commentData.rating) {
            rating = commentData.rating + "/5";
        }
        table.append(`<tr scope="row">
                <td class="text-center align-middle">${commentData.comment}</td>
                <td class="text-center align-middle">${rating}</td>
                <td class="text-center align-middle">${days(new Date(commentData.date))}</td>
                <td class="text-center align-middle">${deleteBtn}</td>`);
        function days(date) {
            let difference = new Date().getTime() - date.getTime();
            let TotalDays = Math.ceil(difference / (1000 * 3600 * 24)) - 1;
            return TotalDays + " days";
        }
    }
}

function showTemplateDialog(id) {
    var dialog = document.getElementById('my-dialog'), ratingStars;
    $('#comment').val("");
    $('#average').text("0.0");
    sessionStorage.removeItem("post_id");
    sessionStorage.removeItem("rating");
    viewComments(id);
    sessionStorage.setItem("post_id", id);
    if (dialog) {
        dialog.show();
        ratingStars = [...document.querySelectorAll(".rating__star")];
        clearRating(ratingStars);
        executeRating(ratingStars);
    } else {
        ons.createElement('dialog.html', { append: true })
            .then(function (dialog) {
                dialog.show();
                ratingStars = [...document.querySelectorAll(".rating__star")];
                clearRating(ratingStars);
                executeRating(ratingStars);
            });
    }
};

var hideDialog = function (id) {
    document
        .getElementById(id)
        .hide();
};

function deleteComment(id) {
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + '/comments/?query={"_id":"' + id + '"}',
        headers: getKinveyUserAuthHeaders(),
        success: loadSuccess,
        error: handleAjaxError
    });


    function loadSuccess(comment) {
        if (comment[0]._acl.creator == sessionStorage['user_id'] || sessionStorage['isAdmin'] == 1) {
            ons.notification.confirm('Are you sure to delete?').then(
                (response) => {
                    if (response === 1) {
                        $.ajax({
                            method: "DELETE",
                            url: kinveyCommentUrl = kinveyBaseUrl + "appdata/" +
                                kinveyAppKey + "/comments/" + id,
                            headers: getKinveyUserAuthHeaders(),
                            success: deleteCommentSuccess,
                            error: handleAjaxError
                        });
                    }
                }
            );
            function deleteCommentSuccess() {
                ons.notification.alert('Comment successfully deleted!', {
                    title: 'Success!'
                }).then(() => {
                    document
                        .getElementById("my-dialog")
                        .hide()
                });
            }
        } else {
            ons.notification.alert('Access denied!', {
                title: 'Error!'
            }).then(() => {
                document
                    .getElementById("my-dialog")
                    .hide()
            });
        }
    }
}

function deleteDest(id) {
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + '/destinations/?query={"_id":"' + id + '"}',
        headers: getKinveyUserAuthHeaders(),
        success: loadSuccess,
        error: handleAjaxError
    });
    function loadSuccess(destination) {
        if (destination[0]._acl.creator == sessionStorage['user_id'] || sessionStorage['isAdmin'] == 1) {
            ons.notification.confirm('Are you sure to delete?').then(
                (response) => {
                    if (response === 1) {
                        $.ajax({
                            method: "DELETE",
                            url: kinveyDestUrl = kinveyBaseUrl + "appdata/" +
                                kinveyAppKey + "/destinations/" + id,
                            headers: getKinveyUserAuthHeaders(),
                            success: deleteDestSuccess,
                            error: handleAjaxError
                        });
                    }
                }
            );
            function deleteDestSuccess() {
                ons.notification.alert('Destination successfully deleted!', {
                    title: 'Success!'
                });
                listDest();
            }
        } else {
            ons.notification.alert('Access denied!', {
                title: 'Error!'
            });
        }
    }
}

function getInfo(id) {
    $("#usernameInfo").html(sessionStorage['username']);

    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + '/destinations/?query={"_acl.creator":"' + id + '"}',
        headers: getKinveyUserAuthHeaders(),
        success: loadDestSuccess,
        error: handleAjaxError
    });

    function loadDestSuccess(post) {
        $("#postInfo").html(post.length);
    }
    $.ajax({
        method: "GET",
        url: kinveyBaseUrl + "appdata/" + kinveyAppKey + '/comments/?query={"_acl.creator":"' + id + '"}',
        headers: getKinveyUserAuthHeaders(),
        success: loadCommentSuccess,
        error: handleAjaxError
    });

    function loadCommentSuccess(comments) {
        $("#commentsInfo").html(comments.length);
        $('#averageInfo').html(calcAverageRating(comments));
    }
}
function calcAverageRating(comments) {
    var sum = 0, len = 0;
    for (let i = 0; i < comments.length; i++) {
        if (comments[i].rating != "") {
            sum += Number(comments[i].rating);
            len++;
        }
    }
    if (len > 0)
        return (sum / len).toFixed(2);
}
// function changePass() {
//     let userData = {
//         password: $('#formChangePass input[name=password1]').val(),
//         passwordRep: $('#formChangePass input[name=password2]').val()
//     };

//     if (userData.password == "" || userData.passwordRep == "") {
//         ons.notification.alert('All fields are required!', {
//             title: 'Error'
//         });
//         return;
//     }

//     if (userData.password != userData.passwordRep) {
//         ons.notification.alert('Passwords do not match!', {
//             title: 'Error'
//         });
//         return;
//     }

//     let pass = {
//         password: $('#formChangePass input[name=password1]').val()
//     }

//     $.ajax({
//         method: "POST",
//         url: kinveyBaseUrl + "/" + kinveyAppKey + "/" + sessionStorage['user_id'] + "/user-password-reset-initiate",
//         headers: kinveyAppAuthHeaders,
//         data: pass,
//         success: updateSuccess,
//         error: handleAjaxError
//     });

// function updateSuccess() {
//     ons.notification.alert('Password successfully updated!', {
//         title: 'Success!'
//     });
// }
// }

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = (R * c).toFixed(); // Distance in km
    if (d < 1) d = d * 1000;
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

/** Star rating **/

function executeRating(stars) {
    const starClassActive = "rating__star fas fa-star";
    const starClassInactive = "rating__star far fa-star";
    const starsLength = stars.length;
    let i;
    stars.map((star) => {
        star.onclick = () => {
            i = stars.indexOf(star);
            sessionStorage.setItem("rating", i + 1);
            if (star.className === starClassInactive) {
                for (i; i >= 0; --i) stars[i].className = starClassActive;
            } else {
                for (i; i < starsLength; ++i) stars[i].className = starClassInactive;
            }
        };
    });
}

function clearRating(stars) {
    const starClassInactive = "rating__star far fa-star";
    stars.forEach(star => {
        star.className = starClassInactive;
    });
}
