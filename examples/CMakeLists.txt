
if(USE_QML)
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
install(TARGETS allcodes
	BUNDLE  DESTINATION .
	DESTINATION ${CMAKE_INSTALL_BINDIR}
	)
endif(USE_QML)
