// Cesium ionのアクセストークン（公式に記載があったものを使用しています）
Cesium.Ion.defaultAccessToken = Cesium.Ion.defaultAccessToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0';
// Cesium ViewerをcesiumContainerというIDのHTML要素に初期化
// Terrainの指定（EGM96、国土数値情報5m標高から生成した全国の地形モデル、5m標高データが無い場所は10m標高で補完している）
var viewer = new Cesium.Viewer('cesiumContainer', {
    terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(3830184),
    }),
});

// PLATEAU-Orthoの参照
var imageProvider = new Cesium.UrlTemplateImageryProvider({
    url: 'https://api.plateauview.mlit.go.jp/tiles/plateau-ortho-2023/{z}/{x}/{y}.png',
    maximumLevel: 19,
});
var current_image = viewer.scene.imageryLayers.addImageryProvider(imageProvider);

// 神奈川県横浜市の建物データ（3D Tiles）
var your_3d_tiles = viewer.scene.primitives.add(
    new Cesium.Cesium3DTileset({
        url: 'https://plateau.geospatial.jp/main/data/3d-tiles/bldg/14100_yokohama/low_resolution/tileset.json',
    })
);
// 初期表示時のカメラ位置
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(135.70, 35.22, 10000.0),
});