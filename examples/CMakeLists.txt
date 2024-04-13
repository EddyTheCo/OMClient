
if(USE_QML AND BUILD_EXAMPLES)
	include(InstallRequiredSystemLibraries)
	qt_add_executable(allcodes allcodes.cpp )

	qt6_add_qml_module(allcodes
		URI  Allcodes
		VERSION 1.0
		QML_FILES
		"qml/allcodes.qml"
		RESOURCE_PREFIX
		"/esterVtech.com/imports"
		IMPORT_PATH ${CMAKE_BINARY_DIR}
		)

	target_link_libraries(allcodes PRIVATE Qt::Gui Qt::Qml Qt::Quick openMeteo::OMClient
		$<$<STREQUAL:$<TARGET_PROPERTY:openMeteo::OMClient,TYPE>,STATIC_LIBRARY>:openMeteo::OMClientplugin>
		)


	set_target_properties(allcodes PROPERTIES
		WIN32_EXECUTABLE ON
		MACOSX_BUNDLE ON
		)
	install(TARGETS allcodes COMPONENT examples
		BUNDLE  DESTINATION . COMPONENT examples
		LIBRARY DESTINATION ${CMAKE_INSTALL_LIBDIR}
		)
	if(QTDEPLOY)
		qt_generate_deploy_qml_app_script(
			TARGET allcodes
			OUTPUT_SCRIPT deploy_script
			)
		install(SCRIPT ${deploy_script} COMPONENT examples)
	endif(QTDEPLOY)
endif(USE_QML AND BUILD_EXAMPLES)
