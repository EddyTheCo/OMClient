import QtQuick
import QtQuick.Controls
import Esterv.CustomControls.OpenMeteo

ApplicationWindow {
    id: window
    visible: true

    Timer {
        id: timer
        interval: 50
        repeat: true
        running: true
        onTriggered: {
            code3.iTime += 0.05;
            code2Am1.iTime += 0.05;
            code2Am0.iTime += 0.05;
            code1Am1.iTime += 0.05;
            code1Am0.iTime += 0.05;
            code0Am1.iTime += 0.05;
            code0Am0.iTime += 0.05;
        }
    }
    ScrollView {
        anchors.fill: parent
        contentWidth: width
        contentHeight: parent.width * 0.5 * 5

        Rectangle {
            id: code0Am1Box
            color: "#10141c"
            width: parent.width * 0.5
            height: width
            ShaderEffect {
                id: code0Am1
                anchors.fill: code0Am1Box
                property var src: code0Am1Box
                property real iTime: 0.0
                property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
                fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/code0Am1.frag.qsb"
            }
        }
        Rectangle {
            id: code0Am0Box
            color: "#10141c"
            anchors.left: code0Am1Box.right
            width: parent.width * 0.5
            height: width
            ShaderEffect {
                id: code0Am0
                anchors.fill: code0Am0Box
                property var src: code0Am0Box
                property real iTime: 0.0
                property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
                fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/code0Am0.frag.qsb"
            }
        }
        Rectangle {
            id: code1Am1Box
            color: "#10141c"
            width: parent.width * 0.5
            height: width
            anchors.top: code0Am1Box.bottom
            ShaderEffect {
                id: code1Am1
                anchors.fill: code1Am1Box
                property var src: code1Am1Box
                property real iTime: 0.0
                property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
                fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/code1Am1.frag.qsb"
            }
        }
        Rectangle {
            id: code1Am0Box
            color: "#10141c"
            anchors.top: code0Am0Box.bottom
            anchors.left: code1Am1Box.right
            width: parent.width * 0.5
            height: width
            ShaderEffect {
                id: code1Am0
                anchors.fill: code1Am0Box
                property var src: code1Am0Box
                property real iTime: 0.0
                property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
                fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/code1Am0.frag.qsb"
            }
        }
        Rectangle {
            id: code2Am1Box
            color: "#10141c"
            width: parent.width * 0.5
            height: width
            anchors.top: code1Am1Box.bottom
            ShaderEffect {
                id: code2Am1
                anchors.fill: code2Am1Box
                property var src: code2Am1Box
                property real iTime: 0.0
                property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
                fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/code2Am1.frag.qsb"
            }
        }
        Rectangle {
            id: code2Am0Box
            color: "#10141c"
            anchors.top: code1Am0Box.bottom
            anchors.left: code2Am1Box.right
            width: parent.width * 0.5
            height: width
            ShaderEffect {
                id: code2Am0
                anchors.fill: code2Am0Box
                property var src: code2Am0Box
                property real iTime: 0.0
                property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
                fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/code2Am0.frag.qsb"
            }
        }
        Rectangle {
            id: code3Box
            color: "#10141c"
            width: parent.width * 0.5
            height: width
            anchors.top: code2Am1Box.bottom

            ShaderEffect {
                id: code3
                anchors.fill: code3Box
                property var src: code3Box
                property real iTime: 0.0
                property var pixelStep: Qt.vector2d(1 / src.width, 1 / src.height)
                fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/code3.frag.qsb"
            }
        }
        CurrentWeather {
            width: parent.width * 0.5
            height: width
            anchors.left: code3Box.right
            anchors.top: code2Am1Box.bottom
            latitude: 41.902916
            longitude: 12.453389
            color: "lightgray"
        }
        CurrentWeather {
            width: parent.width * 0.5
            height: width
            anchors.top: code3Box.bottom
            latitude: 41.902916
            longitude: 12.453389
            color: "green"
            showTime: false
        }
    }
}
