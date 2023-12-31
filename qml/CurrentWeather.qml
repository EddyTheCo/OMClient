import QtQuick.Layouts
import QtQuick
import OMQml
import QtQuick.Controls
import QtQml
Rectangle
{
    id:root
    property alias latitude:omdata.latitude;
    property alias longitude:omdata.longitude;
    property alias temperature_unit:omdata.temperature_unit;
    property bool conected:(omdata.current_weather!==null)
    property color frontColor:"white"
    property string codeIcons:"code2Am1"


    FontLoader {
        id: boldFont
        source: "qrc:/esterVtech.com/imports/OMQml/fonts/Mukta/Mukta-Bold.ttf"
    }
    FontLoader {
        id: lightfont
        source: "qrc:/esterVtech.com/imports/OMQml/fonts/Mukta/Mukta-ExtraLight.ttf"
    }

    color:"transparent"

    OMQMLData
    {
        id:omdata
        Component.onCompleted:
        {
            omdata.get_current_weather();
        }
        onCurrent_weatherChanged:
        {
            console.log("weather_code:",omdata.current_weather.weathercode);

            if(omdata.current_weather.weathercode<4)
            {
                let cions="code"+omdata.current_weather.weathercode;
                if(omdata.current_weather.weathercode<3)
                {
                    cions+="Am"+omdata.current_weather.is_day;
                }
                root.codeIcons=cions;
                console.log("root.CodeIcons:",root.codeIcons);
            }
            console.log("root.CodeIcons:",root.codeIcons);
            temp.text=(isNaN(Math.round(omdata.current_weather.temperature)))?"":
              (Math.round(omdata.current_weather.temperature)+"\u00b0")
        }
    }

    Timer {
        interval: 500; running: true; repeat: true
        onTriggered:
        {
            let cday=new Date();
            time.text = cday.getMonth()+1+"/"+cday.getDate()+"   "+cday.getHours()+":"+((cday.getMinutes()<10)?"0":"")+cday.getMinutes();
        }
    }

    ColumnLayout
    {

        anchors.fill: root
        RowLayout
        {
            id:rlo

            Layout.fillHeight: true
            Layout.alignment: Qt.AlignTop||Qt.AlignHCenter


            Rectangle
            {
                id:rectang
                color:"transparent"
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.minimumWidth: root.width*0.4
                Layout.alignment: Qt.AlignTop|Qt.AlignHCenter
                visible:root.conected
                ShaderEffect {
                    id: shader
                    anchors.fill: rectang;
                    property var src:rectang;
                    property real iTime:0.0;
                    property var pixelStep: Qt.vector2d(1/src.width, 1/src.height)
                    fragmentShader: "qrc:/esterVtech.com/imports/OMQml/frag/"+root.codeIcons+".frag.qsb"
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
            Label
            {
                id:temp
                Layout.fillWidth: true
                Layout.fillHeight: true
                fontSizeMode:Text.Fit
                font:Qt.font({  family: boldFont.font.family,
                                 weight: boldFont.font.weight ,
                                 pointSize : 250});

                visible:root.conected
                color:root.frontColor
                horizontalAlignment:Text.AlignHCenter
                verticalAlignment:Text.AlignVCenter
                Layout.alignment: Qt.AlignTop|Qt.AlignHCenter
            }
        }
        Label
        {
            id:time
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.leftMargin: 20
            Layout.rightMargin: 20
            Layout.bottomMargin:  20
            fontSizeMode:Text.Fit
            font:Qt.font({  family: lightfont.font.family,
                             weight: lightfont.font.weight ,
                             pointSize : 150});
            Layout.alignment: Qt.AlignTop|Qt.AlignHCenter

            visible:root.conected
            color:root.frontColor
            horizontalAlignment:Text.AlignHCenter
            verticalAlignment:Text.AlignVCenter

        }
    }
    MouseArea
    {
        anchors.fill: root
        onClicked:
        {
            omdata.get_current_weather();
        }
    }
}
