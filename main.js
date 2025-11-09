// Cesium ionのアクセストークン
Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyOGRiZmY3Yy0wNzRjLTQ2MjktOGQ0Ni0xYmI5MzFmNDUxZDAiLCJpZCI6MzU0MDY0LCJpYXQiOjE3NjE0NTQ3MDh9.p9q4yTuNNbVz7U09nx04n-LQG0sxXh8TDw22H3FSIV0";

// 非同期処理を関数でラップ
(async function () {

    function computeUiScale() {
        const small = window.matchMedia("(max-width: 600px)").matches;
        const tiny = window.matchMedia("(max-width: 380px)").matches;
        let base = 1.0;
        if (small) base = 1.25;
        if (tiny) base = 1.4;
        return base;
    }
    let uiScale = computeUiScale();
    const px = (n) => `${Math.round(n * uiScale)}px`;

    // ラベル/ポイントに一括適用（存在するプロパティのみ触る）
    function applyCalloutStyle(entity, textFontPxBase = 18) {
        if (entity.point) {
            entity.point.pixelSize = Math.round(8 * uiScale);
            entity.point.outlineWidth = Math.round(2 * uiScale);
        }
        if (entity.label) {
            entity.label.font = `bold ${px(textFontPxBase)} sans-serif`;
            entity.label.outlineWidth = Math.max(2, Math.round(3 * uiScale));
            entity.label.pixelOffset = new Cesium.Cartesian2(0, -Math.round(8 * uiScale));
            entity.label.scaleByDistance = new Cesium.NearFarScalar(
                300.0, 1.0 * uiScale,
                8000.0, 0.7 * uiScale
            );
        }
    }

    // Cesium Viewerの初期化
    const viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false,
        timeline: false,
        animation: false,
        geocoder: false,
        homeButton: false,
    });

    // 既定ベースレイヤーを完全に除去（ボタンでの誤動作防止）
    while (viewer.imageryLayers.length > 0) {
        viewer.imageryLayers.remove(viewer.imageryLayers.get(0), false);
    }

    // 任意の見た目
    viewer.scene.globe.enableLighting = true;
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date("2024-06-21T12:00:00Z"));
    viewer.clock.shouldAnimate = false;

    // ここは viewer 初期化の直後・addCallout より上に置く
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
            entity.label.scaleByDistance = new Cesium.NearFarScalar(300.0, 1.0 * uiScale, 8000.0, 0.7 * uiScale);
        }
    }

    // ===== 地形 =====
    const terrainProvider = await Cesium.CesiumTerrainProvider.fromIonAssetId(2767062);
    viewer.terrainProvider = terrainProvider;

    // ===== 画像レイヤー定義 =====
    const layers = viewer.imageryLayers;

    // 衛星（Ion）
    const satelliteProvider = await Cesium.IonImageryProvider.fromAssetId(3830183);

    // 地理院 標準地図
    const gsiProvider = new Cesium.UrlTemplateImageryProvider({
        url: "https://cyberjapandata.gsi.go.jp/xyz/std/{z}/{x}/{y}.png",
        credit: new Cesium.Credit(
            '<a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">地理院タイル</a>'
        ),
        minimumLevel: 2,
        maximumLevel: 18,
    });

    // 古地図4枚
    const providersOld = [
        new Cesium.UrlTemplateImageryProvider({
            url: "https://mapwarper.h-gis.jp/maps/tile/814/{z}/{x}/{y}.png", // 四ッ谷
            credit: new Cesium.Credit("『四ッ谷』五万分一地形圖, 明治26年測図/大正11年修正, https://purl.stanford.edu/sg892mr4720"),
            minimumLevel: 2,
            maximumLevel: 18,
        }),
        new Cesium.UrlTemplateImageryProvider({
            url: "https://mapwarper.h-gis.jp/maps/tile/3547/{z}/{x}/{y}.png", // 『京都西北部』五万分一地形圖
            credit: new Cesium.Credit("『京都西北部』五万分一地形圖, 作成: 1948, https://www.gsi.go.jp/"),
            minimumLevel: 2,
            maximumLevel: 18,
        }),
        new Cesium.UrlTemplateImageryProvider({
            url: "https://mapwarper.h-gis.jp/maps/tile/3550/{z}/{x}/{y}.png", // 『京都東北部』五万分一地形圖
            credit: new Cesium.Credit("『京都東北部』五万分一地形圖,  作成: 1947, https://www.gsi.go.jp/"),
            minimumLevel: 2,
            maximumLevel: 18,
        }),
        new Cesium.UrlTemplateImageryProvider({
            url: "https://mapwarper.h-gis.jp/maps/tile/815/{z}/{x}/{y}.png", // 北小松
            credit: new Cesium.Credit("『北小松』五万分一地形圖, 明治26年測図/大正9年修正/昭和7年鉄道補入, https://purl.stanford.edu/hf547qg6944"),
            minimumLevel: 2,
            maximumLevel: 18,
        }),
    ];

    // レイヤーを一度だけ追加して参照保持
    const layerSatellite = layers.addImageryProvider(satelliteProvider); // 衛星
    const layerGSI = layers.addImageryProvider(gsiProvider); // 地理院

    const layerOlds = providersOld.map((p) => layers.addImageryProvider(p)); // 古地図4枚

    // 見た目調整（任意）
    [layerSatellite, layerGSI, ...layerOlds].forEach((l) => {
        l.alpha = 1.0;
        l.brightness = 0.95;
    });

    // まず全OFF → 衛星のみON
    function allOff() {
        layerSatellite.show = false;
        layerGSI.show = false;
        layerOlds.forEach((l) => (l.show = false));
    }
    allOff();
    layerSatellite.show = true;

    // 排他的切替
    function showSatellite() {
        allOff();
        layerSatellite.show = true;
        layers.lowerToBottom(layerSatellite);
        setActive("btn-satellite");
    }
    function showGSI() {
        allOff();
        layerGSI.show = true;
        layers.lowerToBottom(layerGSI);
        setActive("btn-gsi");
    }
    function showOldMaps() {
        allOff();
        layerOlds.forEach((l) => (l.show = true));
        layers.raiseToTop(layerOlds[layerOlds.length - 1]);
        setActive("btn-old");
    }

    // アクティブ状態（任意・見た目用）
    function setActive(id) {
        const ids = ["btn-gsi", "btn-satellite", "btn-old"];
        ids.forEach((x) => {
            const el = document.getElementById(x);
            if (el) el.classList.toggle("active", x === id);
        });
    }

    // ボタンにイベント付与（存在する場合のみ）
    const btnSat = document.getElementById("btn-satellite");
    const btnGsi = document.getElementById("btn-gsi");
    const btnOld = document.getElementById("btn-old");
    if (btnSat) btnSat.onclick = showSatellite;
    if (btnGsi) btnGsi.onclick = showGSI;
    if (btnOld) btnOld.onclick = showOldMaps;
    setActive("btn-satellite");


    // ================================
    // addCallout 関数の開始
    // ================================
    async function addCallout(viewer, lon, lat, lift, text) {
        const uiScale = 1.0;

        // 地形高を取得（0m 固定だと地面の下に潜る場合がある）
        const carto = Cesium.Cartographic.fromDegrees(lon, lat);
        const [updated] = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [carto]);
        const groundH = (updated && updated.height) || 0;

        const groundPos = Cesium.Cartesian3.fromDegrees(lon, lat, groundH);
        const airPos = Cesium.Cartesian3.fromDegrees(lon, lat, groundH + lift);

        // 引出線（地面→空中）
        viewer.entities.add({
            polyline: {
                positions: [groundPos, airPos],
                width: 2,
                material: Cesium.Color.BLUE.withAlpha(0.9),
                // 地形で隠れたときも同じ見た目で描く（任意だが見失いにくい）
                depthFailMaterial: Cesium.Color.BLUE.withAlpha(0.9),
                clampToGround: false, // 垂直線なので false
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
                // 地面の下に潜らないよう、必要なら:
                // disableDepthTestDistance: Number.POSITIVE_INFINITY
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
                disableDepthTestDistance: Number.POSITIVE_INFINITY, // ラベルは常に見える
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
