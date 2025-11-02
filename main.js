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


    // 初期表示時のカメラ位置（大阪付近）
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(135.7, 35.22, 10000.0),
        duration: 2,
    });

})();