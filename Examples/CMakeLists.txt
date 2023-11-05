cmake_minimum_required(VERSION 3.11)


foreach(example "code3"
                "code2Am1"
                "code2Am0"
                "code1Am1"
                "code1Am0"
                "code0Am1"
                "code0Am0" 		
		)
qt_add_executable(${example} single.cpp )
qt6_add_qml_module(${example}
	URI  App
	VERSION 1.0
	QML_FILES
	qml/single.qml
	RESOURCE_PREFIX
	"/esterVtech.com/imports"
	IMPORT_PATH ${CMAKE_BINARY_DIR}
	OUTPUT_DIRECTORY
	${CMAKE_BINARY_DIR}/${example}
	)

# Link the application target with the libraries
target_link_libraries(${example} PRIVATE Qt::Gui Qt::Qml Qt::Quick OMQml
	)
target_compile_definitions(${example} PRIVATE SHADER ${example})
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
