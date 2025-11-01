// Grant CesiumJS access to your ion assets
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

// Cesium Viewerの初期化
// Cesium 1.99対応版：Cesium World Terrainを使用
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(1) // Cesium World Terrain
    }),
    baseLayerPicker: true,
    imageryProvider: new Cesium.IonImageryProvider({ assetId: 2 }) // Bing Maps Aerial
});


const layer = viewer.imageryLayers.addImageryProvider(
    await Cesium.IonImageryProvider.fromAssetId(3),
);

viewer.scene.setTerrain(
    new Cesium.Terrain(
        Cesium.CesiumTerrainProvider.fromIonAssetId(1),
    ),
);


// 初期表示時のカメラ位置（大阪付近）
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(135.70, 35.22, 10000.0),
    duration: 2
});