# Open-Meteo Client Implementation 

Implements  a client to communicate with the Open-Meteo REST API. And creates a custom QML type that shows the current weather conditions, the date, and the time.


## Use it in your project

Just add to your project CMakeLists.txt

```
FetchContent_Declare(
        OMQml
        GIT_REPOSITORY https://github.com/EddyTheCo/OMClient.git
        GIT_TAG main
        FIND_PACKAGE_ARGS 0.0 CONFIG
    )
FetchContent_MakeAvailable(OMQml)
target_link_libraries(yourAppTarget PRIVATE OMQml)
```

Then you have to add to your [QML IMPORT PATH](https://doc.qt.io/qt-6/qtqml-syntax-imports.html) the `qrc:/esterVtech.com/imports` path.
For that one could add this to the  main function:

```
QQmlApplicationEngine engine;
engine.addImportPath("qrc:/esterVtech.com/imports");
```
The current weather widget can be created like: 

```
import OMQml

CurrentWeather
{
	width:250
        height:250
        anchors.centerIn:parent
        latitude:41.902916
        longitude:12.453389
        frontColor:"lightgray"
}
```

You can play with the QML element [here](https://eddytheco.github.io/qmlonline/?example_url=omclient). 


## Contributing

We appreciate any contribution!

Currently not all the weather codes are implemented, contribution to the shaders are highly appreciated. 
I find shaders very customizable, you can test  your new shaders contribution [here](https://www.shadertoy.com/view/csKyDz)


You can open an issue or request a feature also.
You can open a PR to the development branch and the CI/CD will take care of the rest.
Make sure to acknowledge your work, ideas when contributing.

## API reference

You can read the [API reference](https://eddytheco.github.io/OMClient/) here, or generate it yourself like
```
cmake -DBUILD_DOCS=ON ../
cmake --build . --target doxygen_docs
```
