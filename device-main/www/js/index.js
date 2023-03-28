/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
const baseSurviceUrl = "https://baas.kinvey.com/appdata/kid_SJkIP-gW2/positions";
const kinveyUsername = "kid_BkTUwWl-h";
const kinveyPassword = "27f0a2d0291641b5aa02f5bc64d69c5b";
const base64Auth = btoa(kinveyUsername + ":" + kinveyPassword);
document.addEventListener('deviceready', onDeviceReady, false);

window.addEventListener('batterystatus', onBatteryStatus, false);
window.addEventListener("batterylow", onBatteryLow, false);


function onBatteryLow(status) {
    alert("Battery Level Low " + status.level + "%");
}

function onBatteryStatus(status) {
    $('#batteryStatus').text(status.level);
    if (status.isPlugged) {
        $('#isPluggedLabel').removeClass("ui-checkbox-off");
        $('#isPluggedLabel').addClass("ui-checkbox-on");
    } else {
        $('#isPluggedLabel').removeClass("ui-checkbox-on");
        $('#isPluggedLabel').addClass("ui-checkbox-off");
    }
}

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    applyDeviceData(device)
    checkConnection();
    navigator.geolocation.watchPosition(geolocationSuccess);
    $("#camera-btn").click(getPicture);
}

function getPicture() {
    navigator.camera.getPicture(
        cameraSuccess,
        cameraError, {
        quality: 25,
        destinationType: Camera.DestinationType.DATA_URL
    }
    )
}

function cameraSuccess(imageData) {
    $("#myImage").attr("src", "data:image/jpeg;base64, " + imageData);
    $("#myImage").css("display", "block");
}

function cameraError(message) {
    alert(message)
}

function checkConnection() {
    var networkState = navigator.connection.type;
    console.log(navigator.connection);

    var states = {};
    states[Connection.UNKNOWN] = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI] = 'WiFi connection';
    states[Connection.CELL_2G] = 'Cell 2G connection';
    states[Connection.CELL_3G] = 'Cell 3G connection';
    states[Connection.CELL_4G] = 'Cell 4G connection';
    states[Connection.CELL] = 'Cell generic connection';
    states[Connection.NONE] = 'No network connection';

    $('#connectionType').text(states[networkState]);
}


function applyDeviceData(device) {
    $('#cordovaVersion').text(device.cordova);
    $('#manufacturer').text(device.manufacturer);
    $('#isVirtual').text(device.isVirtual);
    $('#deviceModel').text(device.model);
    $('#operatingSystem').text(device.platform);
    $('#uuid').text(device.uuid);
    $('#serial').text(device.serial);
    $('#osVersion').text(device.version);

    navigator.geolocation.watchPosition(geolocationSuccess, geolocationError);
}

function geolocationSuccess(position) {
    $('#latitude').text(position.coords.latitude);
    $('#longitude').text(position.coords.longitude);
    $('#altitude').text(position.coords.altitude);
    $('#accuracy').text(position.coords.accuracy);
    $('#altitudeAccuracy').text(position.coords.altitudeAccuracy);
    $('#speed').text(position.coords.speed);
    savePosition(position);
}

function geolocationError(error) {
    alert(error.code);
    alert(error.message);
}

function savePosition(position) {
    let entity = {
        latitude: position.coords.latitude,
        langitude: position.coords.longitude
    }
    $.ajax({
        type: "POST",
        url: baseSurviceUrl,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + base64Auth);
        },
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(entity),
        success: function () {
            alert("success");
        },
        error: function () {
            alert("error");
        }
    })
}