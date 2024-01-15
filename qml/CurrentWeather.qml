import QtQuick.Layouts
import QtQuick
import Esterv.CustomControls.OpenMeteo
import QtQuick.Controls
import QtQml


Item
{
    id:control
    property alias latitude:omdata.latitude;
    property alias longitude:omdata.longitude;
    property alias temperature_unit:omdata.temperature_unit;

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
    Component.onCompleted:
    {
        omdata.get_current_weather();
    }

    OMQMLData
    {
        id:omdata

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
                shader.codeIcons=cions;
                console.log("shader.CodeIcons:",shader.codeIcons);
            }
            console.log("shader.CodeIcons:",shader.codeIcons);
            temp.text=(isNaN(Math.round(omdata.current_weather.temperature)))?"":
            (Math.round(omdata.current_weather.temperature)+"\u00b0")
        }
    }

    Timer {
        interval: 500; running: control.showTime; repeat: true
        onTriggered:
        {
            let cday=new Date();
            time.text = cday.getMonth()+1+"/"+cday.getDate()+"   "+cday.getHours()+":"+((cday.getMinutes()<10)?"0":"")+cday.getMinutes();
        }
    }


    Item
    {
        id:codefigure
        width:Math.min(control.width,control.height)*0.5
        height:width*((control.showTime)?1.0:2.0)

        ShaderEffect {
            id: shader
            property string codeIcons:"code2Am1"
            anchors.centerIn: codefigure
            width:codefigure.width*0.95
            height:codefigure.height*0.95
            property var src:codefigure;
            property real iTime:0.0;
            property var pixelStep: Qt.vector2d(1/src.width, 1/src.height)
            fragmentShader: "qrc:/esterVtech.com/imports/Designs/frag/"+shader.codeIcons+".frag.qsb"
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

    Label
    {
        id:temp
        width:codefigure.width
        height:codefigure.height
        anchors.left: codefigure.right
        fontSizeMode:Text.Fit
        font:Qt.font({  family: control.boldFont.family,
                         weight: control.boldFont.weight,
                         pointSize : 250});

        color:control.color
        horizontalAlignment:Text.AlignHCenter
        verticalAlignment:Text.AlignVCenter
        Layout.alignment: Qt.AlignTop|Qt.AlignHCenter
    }
    Label
    {
        id:time
        width:codefigure.width*2.0
        height:codefigure.height
        anchors.top: codefigure.bottom
        fontSizeMode:Text.Fit
        font:Qt.font({  family: control.lightfont.family,
                         weight: control.lightfont.weight ,
                         pointSize : 150});


        visible:control.showTime
        color:control.color
        horizontalAlignment:Text.AlignHCenter
        verticalAlignment:Text.AlignVCenter

    }

    MouseArea
    {
        anchors.fill: control
        onClicked:
        {
            omdata.get_current_weather();
        }
    }
}
