import OMQml
import QtQuick
import QtQuick.Controls
import code3
import code2Am1
import code2Am0
import code1Am1
import code1Am0
import code0Am1
import code0Am0
ApplicationWindow {
    visible: true
    id:window
    Rectangle
    {
        id:rectang
        color:"#10141c"
        anchors.fill:parent
        ShaderEffect {
            id: shader
            anchors.fill: rectang;
            property var src:rectang;
            property real iTime:0.0;
            property var pixelStep: Qt.vector2d(1/src.width, 1/src.height)
            fragmentShader: "qrc:/esterVtech.com/imports/OMQml/frag/"+ShaderSel.shadder+".frag.qsb"
        }
        Timer {
            id:timer
            interval: 50;  repeat: true; running: true
            onTriggered:
            {
                shader.iTime+=0.05;
            }
        }
    }
}
