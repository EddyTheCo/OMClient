import QtQuick.Layouts
import QtQuick
import Esterv.CustomControls.OpenMeteo
import QtQuick.Controls
import QtQml

Item {
    id: control
    property alias latitude: omclient.latitude
    property alias longitude: omclient.longitude
    property alias tempUnit: omclient.tempUnit

    property color color: "white"

    property font boldFont: cboldFont.font
    property font lightfont: clightfont.font
    property bool showTime: true

    FontLoader {
        id: cboldFont
        source: "qrc:/esterVtech.com/imports/Esterv/CustomControls/OpenMeteo/fonts/Mukta/Mukta-Bold.ttf"
    }
    FontLoader {
        id: clightfont
        source: "qrc:/esterVtech.com/imports/Esterv/CustomControls/OpenMeteo/fonts/Mukta/Mukta-ExtraLight.ttf"
    }
    Component.onCompleted: {
        omclient.getCurrentWeather();
    }

    OMClient {
        id: omclient
        onCurrentWeatherChanged: {
            if (omclient.currentWeather.weathercode < 4) {
                let cions = "code" + omclient.currentWeather.weathercode;
                if (omclient.currentWeather.weathercode < 3) {
                    cions += "Am" + omclient.currentWeather.is_day;
                }
                shader.codeIcons = cions;
            }
            temp.text = (isNaN(Math.round(omclient.currentWeather.temperature))) ? "" : (Math.round(omclient.currentWeather.temperature) + "\u00b0");
        }
    }

    Timer {
        interval: 500
        running: control.showTime
        repeat: true
        onTriggered: {
            let cday = new Date();
            time.text = cday.getMonth() + 1 + "/" + cday.getDate() + "   " + cday.getHours() + ":" + ((cday.getMinutes() < 10) ? "0" : "") + cday.getMinutes();
        }
    }

    Item {
        id: codefigure
        width: Math.min(control.width, control.height) * 0.5
        height: width * ((control.showTime) ? 1.0 : 2.0)

        ShaderEffect {
            id: shader
            property string codeIcons: "code2Am1"
            anchors.centerIn: codefigure
            width: codefigure.width * 0.95
            height: codefigure.height * 0.95
            property var src: codefigure
            property real iTime: 0.0
            property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
            fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/" + shader.codeIcons + ".frag.qsb"
            Timer {
                id: timer
                interval: 50
                repeat: true
                running: true
                onTriggered: {
                    shader.iTime += 0.05;
                }
            }
        }
    }

    Label {
        id: temp
        width: codefigure.width
        height: codefigure.height
        anchors.left: codefigure.right
        fontSizeMode: Text.Fit
        font: Qt.font({
                family: control.boldFont.family,
                weight: control.boldFont.weight,
                pointSize: 250
            })

        color: control.color
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        Layout.alignment: Qt.AlignTop | Qt.AlignHCenter
    }
    Label {
        id: time
        width: codefigure.width * 2.0
        height: codefigure.height
        anchors.top: codefigure.bottom
        fontSizeMode: Text.Fit
        font: Qt.font({
                family: control.lightfont.family,
                weight: control.lightfont.weight,
                pointSize: 150
            })

        visible: control.showTime
        color: control.color
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
    }

    MouseArea {
        anchors.fill: control
        onClicked: {
            omclient.getCurrentWeather();
        }
    }
}
