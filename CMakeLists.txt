cmake_minimum_required(VERSION 3.24)
include(${CMAKE_CURRENT_BINARY_DIR}/local_conf.cmake OPTIONAL)

include(FetchContent)
FetchContent_Declare(
	ccommon
	GIT_REPOSITORY https://github.com/EddyTheCo/Common.git
	GIT_TAG main
	)
FetchContent_MakeAvailable(ccommon)
version_from_git(
	LOG       OFF
	TIMESTAMP "%Y%m%d%H%M%S"
	)
project(openMeteo VERSION ${VERSION} DESCRIPTION "openMeteo client library for REST API" LANGUAGES CXX)

set(default_build_type "Release")
if(NOT CMAKE_BUILD_TYPE AND NOT CMAKE_CONFIGURATION_TYPES)
	message(STATUS "Setting build type to '${default_build_type}' as none was specified.")
	set(CMAKE_BUILD_TYPE "${default_build_type}" CACHE
		STRING "Choose the type of build." FORCE)
	# Set the possible values of build type for cmake-gui
	set_property(CACHE CMAKE_BUILD_TYPE PROPERTY STRINGS
		"Debug" "Release" "MinSizeRel" "RelWithDebInfo")
endif()

set_property(GLOBAL PROPERTY USE_FOLDERS ON)
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)
include(GNUInstallDirs)


find_package(Qt6 COMPONENTS Core Network Gui Quick ShaderTools)

if (Qt6_FOUND)
	qt_standard_project_setup()
endif(Qt6_FOUND)

if (Qt6_FOUND)

	qt6_add_qml_module(OMQml
		URI  OMQml
		VERSION 1.0
		SOURCES
		src/omqml.cpp include/omqml.hpp src/omclient.cpp include/omclient.hpp
		QML_FILES
		qml/CurrentWeather.qml
		RESOURCE_PREFIX
		"/esterVtech.com/imports"
		OUTPUT_TARGETS out_targets_var
		OUTPUT_DIRECTORY
		${CMAKE_CURRENT_BINARY_DIR}/OMQml
		IMPORT_PATH ${QML_IMPORT_PATH}
		)
	qt6_add_shaders(OMQml "esterVtech.com.imports.OMQml.shaders"
		BATCHABLE
		PRECOMPILE
		OPTIMIZED
		OUTPUT_TARGETS out_targets_var2
		PREFIX
		"/esterVtech.com/imports/OMQml"
		FILES
		"frag/CodeIcons.frag"
		)

	qt_add_resources(OMQml "OMQml.fonts"
		PREFIX "/esterVtech.com/imports/OMQml"
		OUTPUT_TARGETS out_targets_var3
		FILES
		"fonts/Mukta/Mukta-Bold.ttf"
		"fonts/Mukta/Mukta-ExtraLight.ttf"
		)

	target_link_libraries(OMQml PUBLIC Qt6::Gui Qt6::Quick Qt6::Core Qt6::Network)

	target_compile_definitions(OMQml PRIVATE WINDOWS_OMQML)
	target_include_directories(OMQml PUBLIC $<BUILD_INTERFACE:${CMAKE_CURRENT_SOURCE_DIR}/include>
		"$<INSTALL_INTERFACE:${CMAKE_INSTALL_INCLUDEDIR}/omqml>")

endif(Qt6_FOUND)



install(TARGETS ${out_targets_var} ${out_targets_var2}  ${out_targets_var3} OMQml EXPORT OMQmlTargets DESTINATION ${CMAKE_INSTALL_LIBDIR})
install(DIRECTORY ${CMAKE_CURRENT_LIST_DIR}/include/ DESTINATION ${CMAKE_INSTALL_INCLUDEDIR}/omqml)

install(EXPORT OMQmlTargets
	FILE OMQmlTargets.cmake
	DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/OMQml
	)
include(CMakePackageConfigHelpers)
# generate the config file that is includes the exports
configure_package_config_file(${CMAKE_CURRENT_SOURCE_DIR}/Config.cmake.in
	"${CMAKE_CURRENT_BINARY_DIR}/OMQmlConfig.cmake"
	INSTALL_DESTINATION "${CMAKE_INSTALL_LIBDIR}/cmake/OMQml"
	)
write_basic_package_version_file(
	"${CMAKE_CURRENT_BINARY_DIR}/OMQmlConfigVersion.cmake"
	VERSION ${VERSION}
	COMPATIBILITY SameMajorVersion
	)
install(FILES
	${CMAKE_CURRENT_BINARY_DIR}/OMQmlConfig.cmake
	${CMAKE_CURRENT_BINARY_DIR}/OMQmlConfigVersion.cmake
	DESTINATION ${CMAKE_INSTALL_LIBDIR}/cmake/OMQml
	)
export(EXPORT OMQmlTargets
	FILE "${CMAKE_CURRENT_BINARY_DIR}/OMQmlTargets.cmake"
	)


if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME)
	set(CPACK_PACKAGE_CONTACT "estervtech")
	include(CTest)
	set(CPACK_PACKAGE_FILE_NAME "${PROJECT_NAME}-v${SEMVER}-${CMAKE_SYSTEM_NAME}_${CMAKE_SYSTEM_VERSION}-${CMAKE_SYSTEM_PROCESSOR}-${CMAKE_CXX_COMPILER_ID}")
	if(NOT BUILD_SHARED_LIBS)
		set(CPACK_PACKAGE_FILE_NAME "${CPACK_PACKAGE_FILE_NAME}-static")
	endif(NOT BUILD_SHARED_LIBS)
	if(USE_THREADS)
		set(CPACK_PACKAGE_FILE_NAME "${CPACK_PACKAGE_FILE_NAME}-MThread")
	endif(USE_THREADS)
	include(CPack)
endif()
#if(CMAKE_PROJECT_NAME STREQUAL PROJECT_NAME AND BUILD_TESTING)
#    add_subdirectory(tests)
#endif()
if(BUILD_DOCS)
	get_target_property(build_docs cmake_build_docs SOURCES)
	include(${build_docs})
endif()
list(APPEND QML_IMPORT_PATH ${CMAKE_CURRENT_SOURCE_DIR}/qml ${CMAKE_CURRENT_BINARY_DIR}/)
list(REMOVE_DUPLICATES QML_IMPORT_PATH)
set(QML_IMPORT_PATH ${QML_IMPORT_PATH} CACHE STRING "" FORCE)

