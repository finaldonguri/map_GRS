// Cesium ionのアクセストークン
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

// 非同期処理を関数でラップ
(async function () {
    // Cesium Viewerの初期化
    const viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        timeline: false,
        animation: false
    });
    function applyCalloutStyle(entity, uiScale = 1.0, textFontPxBase = 18) {
        if (!entity) return;
        if (entity.point) {
            entity.point.pixelSize = Math.round(8 * uiScale);
            entity.point.outlineWidth = Math.round(2 * uiScale);
        }
        if (entity.label) {
            entity.label.font = `bold ${Math.round(textFontPxBase * uiScale)}px sans-serif`;
            entity.label.outlineWidth = Math.max(2, Math.round(3 * uiScale));
            entity.label.pixelOffset = new Cesium.Cartesian2(0, -Math.round(8 * uiScale));
            entity.label.scaleByDistance = new Cesium.NearFarScalar(
                300.0, 1.0 * uiScale,
                8000.0, 0.7 * uiScale
            );
        }
    }

    // イメージャリー
    const imageryProvider = await Cesium.IonImageryProvider.fromAssetId(3830183);
    viewer.imageryLayers.addImageryProvider(imageryProvider);

    // 地形
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2767062);
    viewer.terrainProvider = terrainProvider;

    // ================================
    // addCallout 関数の開始
    // ================================
    async function addCallout(viewer, lon, lat, lift, text) {
        const uiScale = 1.0;

        // 地形高を取得して地面高さに合わせる
        const carto = Cesium.Cartographic.fromDegrees(lon, lat);
        const [updated] = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [carto]);
        const groundH = (updated && updated.height) || 0;

        const groundPos = Cesium.Cartesian3.fromDegrees(lon, lat, groundH);
        const airPos = Cesium.Cartesian3.fromDegrees(lon, lat, groundH + lift);

        // 引き出し線（地面→空中）
        viewer.entities.add({
            polyline: {
                positions: [groundPos, airPos],
                width: 2,
                material: Cesium.Color.BLUE.withAlpha(0.9),
                clampToGround: false, // 垂直線なのでfalse
            },
        });

        // 地面ポイント
        const pt = viewer.entities.add({
            position: groundPos,
            point: {
                pixelSize: Math.round(8 * uiScale),
                color: Cesium.Color.RED,
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: Math.round(2 * uiScale),
            },
        });

        // 空中ラベル
        const lb = viewer.entities.add({
            position: airPos,
            label: {
                text: text,
                font: `bold ${Math.round(18 * uiScale)}px sans-serif`,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: Math.max(2, Math.round(3 * uiScale)),
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -Math.round(8 * uiScale)),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                scaleByDistance: new Cesium.NearFarScalar(300.0, 1.0 * uiScale, 8000.0, 0.7 * uiScale),
            },
        });

        applyCalloutStyle(pt, uiScale);
        applyCalloutStyle(lb, uiScale);
    }

    // ================================
    // addCallout 関数の終了
    // ================================


    // ===== 11個のポイント =====
    const calloutPoints = [
        { lon: 135.7082915, lat: 35.2232903, lift: 150, text: "Ginreisou log cabin" },
    ];

    for (const p of calloutPoints) {
        await addCallout(viewer, p.lon, p.lat, p.lift, p.text);
    }

    // カメラ移動
    await viewer.flyTo(viewer.entities, { duration: 2 });


})();   // ← ここが async 即時関数の閉じ
