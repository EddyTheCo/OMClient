cmake_minimum_required(VERSION 3.11)


foreach(example "code3"
                "code2Am1"
                "code2Am0"
                "code1Am1"
                "code1Am0"
                "code0Am1"
                "code0Am0"
                "allcodes"
		)
if(${example} STREQUAL "allcodes")
    qt_add_executable(${example} allcodes.cpp )
    set(qmlfile "qml/allcodes.qml")
else()
    qt_add_executable(${example} single.cpp include/single.hpp)
    target_include_directories(${example} PUBLIC $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>)
    target_compile_definitions(${example} PRIVATE WINDOWS_OMONI)
    target_compile_definitions(${example} PRIVATE SHADER="${example}")
    set(qmlfile "qml/single.qml")
endif()

qt6_add_qml_module(${example}
        URI  ${example}
	VERSION 1.0
	QML_FILES
        ${qmlfile}
	RESOURCE_PREFIX
	"/esterVtech.com/imports"
	IMPORT_PATH ${CMAKE_BINARY_DIR}
	OUTPUT_DIRECTORY
	${CMAKE_BINARY_DIR}/${example}
	)


target_link_libraries(${example} PRIVATE Qt::Gui Qt::Qml Qt::Quick OMQml
	)

set_target_properties(${example} PROPERTIES
	WIN32_EXECUTABLE ON
	MACOSX_BUNDLE ON
	)
install(TARGETS ${example} 
    BUNDLE  DESTINATION .
    DESTINATION ${CMAKE_INSTALL_BINDIR}
)
if(QTDEPLOY)
    qt_generate_deploy_qml_app_script(
        TARGET ${example}
        OUTPUT_SCRIPT deploy_script
    )
install(SCRIPT ${deploy_script})
endif(QTDEPLOY)

endforeach()
