Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0';

var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

const layer = viewer.imageryLayers.addImageryProvider(
    await Cesium.IonImageryProvider.fromAssetId(2),
);


viewer.scene.setTerrain(
    new Cesium.Terrain(
        Cesium.CesiumTerrainProvider.fromIonAssetId(1),
    ),
);



viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(135.70, 35.22, 10000.0),
    duration: 2
});