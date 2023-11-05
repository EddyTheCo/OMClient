
import OMQml
import App

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
            }
}
