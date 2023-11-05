#include <QGuiApplication>
#include <QQmlApplicationEngine>


int main(int argc, char *argv[])
{
	QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;

	engine.addImportPath("qrc:/esterVtech.com/imports");
    qDebug()<<engine.importPathList();

    const QUrl url=QUrl("qrc:/esterVtech.com/imports/allcodes/qml/allcodes.qml");

	// Load the main QML file
	engine.load(url);

	return app.exec();
}

