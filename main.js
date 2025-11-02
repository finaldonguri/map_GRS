// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

// 非同期処理を関数でラップ
(async function () {
    // Cesium Viewerの初期化
    const viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: true,
        timeline: false,
        animation: false
    });

    // イメージャリー: Google Maps 2D Satellite with Labels
    const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3830183);
    viewer.imageryLayers.addImageryProvider(imageryProvider);

    // 地形: Japan Regional Terrain
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2767062);
    viewer.terrainProvider = terrainProvider;



    infoDiv.innerHTML = '<h3>高室山ルート</h3><p>GeoJSON読み込み中...</p>';

    var routePath = 'route.geojson';
    console.log('GeoJSON読み込み開始:', routePath);

    Cesium.GeoJsonDataSource.load(routePath).then(function (dataSource) {
        console.log('GeoJSON読み込み成功');

        viewer.dataSources.add(dataSource);

        var entities = dataSource.entities.values;
        console.log('エンティティ数:', entities.length);

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];

            if (entity.polyline) {
                entity.polyline.material = Cesium.Color.RED;
                entity.polyline.width = 5;
                // clampToGround は古いビルドだと無いことがあるので、必要なら後で戻す
                // entity.polyline.clampToGround = true;
            }

            if (entity.position) {
                entity.point = new Cesium.PointGraphics({
                    pixelSize: 10,
                    color: Cesium.Color.YELLOW,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2
                });

                if (i === 0) {
                    entity.point.pixelSize = 15;
                    entity.point.color = Cesium.Color.GREEN;
                }

                if (i === entities.length - 1) {
                    entity.point.pixelSize = 15;
                    entity.point.color = Cesium.Color.BLUE;
                }
            }
        }



    // 初期表示時のカメラ位置（大阪付近）
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(135.7, 35.22, 10000.0),
        duration: 2,
    });

})();