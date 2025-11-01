Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0';

var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: Cesium.createWorldTerrain()
});

// 神奈川県横浜市の建物データ（3D Tiles）
var your_3d_tiles = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14100_yokohama/low_resolution/tileset.json',
    })
);

viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(135.70, 35.22, 10000.0),
    duration: 2
});