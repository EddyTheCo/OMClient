cmake_minimum_required(VERSION 3.24)

option(USE_QML "Create QML types and modules" ON)
include(${CMAKE_CURRENT_BINARY_DIR}/local_conf.cmake OPTIONAL)

include(FetchContent)
FetchContent_Declare(
	ccommon
	GIT_REPOSITORY https://github.com/EddyTheCo/Common.git
	GIT_TAG v0.4.0
	)
FetchContent_MakeAvailable(ccommon)
version_from_git(
	LOG       OFF
	TIMESTAMP "%Y%m%d%H%M%S"
	)
project(openMeteo VERSION ${VERSION} DESCRIPTION "OpenMeteo client library" LANGUAGES CXX)


set_property(GLOBAL PROPERTY USE_FOLDERS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)
include(GNUInstallDirs)

find_package(Qt6 COMPONENTS Core Network )
if(USE_QML)
	find_package(Qt6 COMPONENTS Core Network Gui Quick ShaderTools)
endif(USE_QML)

if (Qt6_FOUND)
	qt_standard_project_setup()
	add_library(OMClient  src/omclient.cpp include/omclient.hpp)
	if(USE_QML)
		qt6_add_qml_module(OMClient
			URI  Esterv.CustomControls.OpenMeteo
			VERSION 1.0
			QML_FILES
			"qml/CurrentWeather.qml"
			RESOURCE_PREFIX
			"/esterVtech.com/imports"
			RESOURCES
			"fonts/Mukta/Mukta-Bold.ttf"
			"fonts/Mukta/Mukta-ExtraLight.ttf"
			OUTPUT_TARGETS out_targets_var
			OUTPUT_DIRECTORY
			${CMAKE_BINARY_DIR}/Esterv/CustomControls/OpenMeteo
			IMPORT_PATH ${CMAKE_BINARY_DIR}
			)
		add_library(${PROJECT_NAME}::OMClientplugin ALIAS OMClientplugin)
		target_compile_definitions(OMClient PRIVATE USE_QML)
		qt6_add_shaders(OMClient "esterVtech.com.imports.OMClient.shaders"
			BATCHABLE
			PRECOMPILE
			OPTIMIZED
			OUTPUT_TARGETS out_targets_var2
			PREFIX
			"/esterVtech.com/imports/Designs"
			FILES
			"frag/code3.frag"
			"frag/code2Am1.frag"
			"frag/code2Am0.frag"
			"frag/code1Am1.frag"
			"frag/code1Am0.frag"
			"frag/code0Am1.frag"
			"frag/code0Am0.frag"
			)

		target_link_libraries(OMClient PUBLIC Qt6::Gui Qt6::Quick)

		install(TARGETS ${out_targets_var} ${out_targets_var2}
			EXPORT ${PROJECT_NAME}-config
			DESTINATION ${CMAKE_INSTALL_LIBDIR}
			COMPONENT omclient
			RUNTIME DESTINATION "${CMAKE_INSTALL_BINDIR}" COMPONENT omclient
			)
		install(DIRECTORY ${CMAKE_BINARY_DIR}/Esterv/CustomControls/OpenMeteo
			DESTINATION ${CMAKE_INSTALL_LIBDIR}/Esterv/CustomControls
			COMPONENT omclient
			)
		install(TARGETS OMClientplugin
			EXPORT ${PROJECT_NAME}-config
			DESTINATION ${CMAKE_INSTALL_LIBDIR}/Esterv/CustomControls/OpenMeteo
			COMPONENT omclient
			RUNTIME DESTINATION "${CMAKE_INSTALL_BINDIR}" COMPONENT omclient
			)
	endif(USE_QML)
	add_library(${PROJECT_NAME}::OMClient ALIAS OMClient)
	target_link_libraries(OMClient PUBLIC Qt6::Core Qt6::Network)

	target_include_directories(OMClient PUBLIC $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
		"$<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}/Esterv/${PROJECT_NAME}>")

	target_compile_definitions(OMClient PRIVATE WINDOWS_OMClient)

	install(TARGETS OMClient
		EXPORT ${PROJECT_NAME}-config
		DESTINATION ${CMAKE_INSTALL_LIBDIR}
		COMPONENT omclient
		RUNTIME DESTINATION "${CMAKE_INSTALL_BINDIR}" COMPONENT omclient
		)
	install(DIRECTORY ${CMAKE_CURRENT_LIST_DIR}/include/
		DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/Esterv/${PROJECT_NAME}
		COMPONENT ${PROJECT_NAME}
		)

	build_exports()
	if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)
		add_subdirectory(examples)
		build_cpack()
	endif(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)

endif(Qt6_FOUND)

if(BUILD_DOCS)
	build_docs()
endif(BUILD_DOCS)
