import QtQuick.Controls
import QtQuick
import QtQuick.Layouts
import OMQml

ApplicationWindow {
    visible: true
    id:window


    background: Rectangle
    {
        color:"#10141c"
    }

    CurrentWeather
    {
        anchors.fill: parent
        latitude:45.406433
        longitude:11.876761
        frontColor:"gray"
    }



}
