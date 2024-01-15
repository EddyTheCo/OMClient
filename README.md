# Open-Meteo Client Implementation 

Implements  a client to communicate with the Open-Meteo REST API. 
The repo creates  a custom QML module and types related with weather conditions.


## Installing the library 

### From source code
```
git clone https://github.com/EddyTheCo/OMClient.git 

mkdir build
cd build
qt-cmake -G Ninja -DCMAKE_INSTALL_PREFIX=installDir -DCMAKE_BUILD_TYPE=Release -DBUILD_EXAMPLES=OFF -DUSE_QML=OFF -DBUILD_DOCS=OFF ../OMClient

cmake --build . 

cmake --install . 
```
where `installDir` is the installation path. 
Setting the `USE_QML` variable produce or not the QML module.
One can choose to build or not the examples and the documentation with the `BUILD_EXAMPLES` and `BUILD_DOCS` variables.

### From GitHub releases
Download the releases from this repo. 


## Use it in your project

Just add to your project CMakeLists.txt

```
FetchContent_Declare(
        openMeteo
        GIT_REPOSITORY https://github.com/EddyTheCo/OMClient.git
        GIT_TAG v0.2.0
        FIND_PACKAGE_ARGS 0.2 CONFIG
    )
FetchContent_MakeAvailable(openMeteo)
target_link_libraries(<target> <PRIVATE|PUBLIC|INTERFACE> openMeteo::OMClient)
```
If want to use the QML module also add
```
$<$<STREQUAL:$<TARGET_PROPERTY:openMeteo::OMClient,TYPE>,STATIC_LIBRARY>:openMeteo::OMClientplugin>
```

## Using the QML modules

One needs to  make available to the QML engine the different modules by setting the [QML import path](https://doc.qt.io/qt-6/qtqml-syntax-imports.html#qml-import-path).

1. In your main function `engine.addImportPath("qrc:/esterVtech.com/imports");` to use the resource file. 

2. Set the environment variable like `export QML_IMPORT_PATH=installDir/CMAKE_INSTALL_LIBDIR`  where `CMAKE_INSTALL_LIBDIR` is where `Esterv` folder was created.

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
