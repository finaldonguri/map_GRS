// Cesium ionのアクセストークン
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


    viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(135.7082915, 35.2232903),
        point: {
            pixelSize: 8,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2
        },
        label: {
            text: 'Ginreisou house', 
            font: '12pt sans-serif',
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(0, -9),
        }
    });

    // 銀嶺荘にカメラを向ける
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(135.7082915, 35.2232903, 2000.0),
        duration: 2
    });
})();