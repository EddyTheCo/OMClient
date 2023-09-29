#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include "omqml.hpp"

int main(int argc, char *argv[])
{

    auto var=OMQMLData();
    QGuiApplication app(argc, argv);

	QQmlApplicationEngine engine;
    engine.addImportPath("qrc:/esterVtech.com/imports");
    qDebug()<<engine.importPathList();

    const QUrl url(u"qrc:/esterVtech.com/imports/OMQml/qml/demo.qml"_qs);
	QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
			&app, [url](QObject *obj, const QUrl &objUrl) {
			if (!obj && url == objUrl)
			QCoreApplication::exit(-1);
			}, Qt::QueuedConnection);

	engine.load(url);

	return app.exec();
}
