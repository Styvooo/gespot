import maplibregl from 'maplibre-gl'
import { t } from 'i18next'
import { el, mount, text } from 'redom'

import { LayerSwitcher, URLHash, Layer, LayerGroup } from '@russss/maplibregl-layer-switcher'

import $ from "jquery";
import './bootstrap.ts';

import EditButton from './edit-control.js'
import InfoPopup from './popup/infopopup.js'
import KeyControl from './key/key.js'
import WarningBox from './warning-box/warning-box.js'
import OIMSearch from './search/search.ts'

import { getStyle, getLayers } from './style/style.js'
import {warning_scale, warningWidth} from './style/style_gsp_power.ts';

import { ValidationErrorPopup } from './popup/validation-error-popup.js'
import { SymbolLoader } from './symbol-loader.ts'
import { ClickRouter } from './click-router.js'

export default class Gespot {
  map?: maplibregl.Map

  isWebglSupported() {
    if (window.WebGLRenderingContext) {
      const canvas = document.createElement('canvas')
      try {
        const context =
          canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
          canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true })
        if (context && typeof context.getParameter == 'function') {
          return true
        }
      } catch {
        // WebGL is supported, but disabled
      }
      return false
    }
    // WebGL not supported
    return false
  }

  constructor() {
    if (!this.isWebglSupported()) {
      const infobox = new WarningBox(t('warning', 'Warning'))
      infobox.update(t('warnings.webgl'))
      mount(document.body, infobox)
    }

    maplibregl.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      true // Lazy load the plugin
    )
  }

  init() {
    const layer_switcher = new LayerSwitcher(
      [
        new LayerGroup(t('layers.background'), [
          new Layer('A', t('openstreetmap'), 'osm_', 'background', true)
        ]),
        new LayerGroup(t('layers.overlays'), [
          new Layer('L', t('layers.labels'), 'label_', true)
        ]),
        new LayerGroup(t('layers.infrastructure'), [
          new Layer('P', t('layers.power'), 'power_', true),
          new Layer('T', t('layers.telecoms'), 'telecoms_', true)
        ]),
        new LayerGroup(t('layers.natural'), [
          new Layer('E', t('layers.vegetation'), 'vegetation_', false)
        ])
      ],
      t('layers.title', 'Couches')
    )
    const url_hash = new URLHash(layer_switcher)

    const map_style = getStyle()

    layer_switcher.setInitialVisibility(map_style)

    const map = new maplibregl.Map(
      url_hash.init({
        container: 'map',
        style: map_style,
        maxZoom: 20,
        zoom: 2,
        center: [12, 26],
        localIdeographFontFamily: "'Apple LiSung', 'Noto Sans', 'Noto Sans CJK SC', sans-serif"
      })
    )

    const clickRouter = new ClickRouter(map, map_style.layers)
    new SymbolLoader(map)

    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()

    url_hash.enable(map)
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    )

    map.addControl(new maplibregl.ScaleControl({}), 'bottom-left')

    map.addControl(new KeyControl(), 'top-right')
    map.addControl(layer_switcher, 'top-right')
    map.addControl(new EditButton(), 'bottom-right')

    new InfoPopup(
      getLayers().map((layer: { [x: string]: any }) => layer['id']),
      6
    ).add(map, clickRouter)
    new ValidationErrorPopup(map, clickRouter)

    clickRouter.register()
    this.map = map

    let warningArea_slider = el('input#panel_warningSlider', {
      "type":"text",
      "data-provide":"slider",
      "data-slider-ticks":'[0, 1, 2, 3, 4]',
      "data-slider-ticks-labels":'["-", "DMA", "DLVR", "DLVS", "DLI"]',
      "data-slider-min":"0",
      "data-slider-max":"4",
      "data-slider-step":"1",
      "data-slider-value":"1",
      "data-slider-tooltip":"hide",
      "data-slider-rangeHighlights":'[{ "start": 0, "end": 1, "class": "bg-danger" },{ "start": 1, "end": 3, "class": "bg-warning" },{ "start": 3, "end": 4, "class": "bg-info"}]'
    });

    document.getElementsByTagName("header")[0].insertAdjacentElement("beforeend", 
      el('div.mx-5.float-right.text-center', [
        el('div#panel_warningLink.d-inline-block.mr-3.align-text-top', 
          el('a.text-danger', {"data-toggle":"modal", "data-target":"#electricityModal"}, 
            text("Prévention du risque électrique"))), 
        el('div.d-inline.align-text-top',warningArea_slider)
    ]));

    $("#panel_warningSlider").slider().on("slideStop", function(ui: any){
      switch(ui.value){
        case 1:
          map.setPaintProperty("power_line_warning", "line-color", warning_scale["DMA"]);
          map.setPaintProperty("power_line_warning", "line-width", warningWidth("DMA"));
          map.setLayoutProperty("power_line_warning", 'visibility', 'visible');
          break;
        case 2:
          map.setPaintProperty("power_line_warning", "line-color", warning_scale["DLVR"]);
          map.setPaintProperty("power_line_warning", "line-width", warningWidth("DLVR"));
          map.setLayoutProperty("power_line_warning", 'visibility', 'visible');
          break;
        case 3:
          map.setPaintProperty("power_line_warning", "line-color", warning_scale["DLVS"]);
          map.setPaintProperty("power_line_warning", "line-width", warningWidth("DLVS"));
          map.setLayoutProperty("power_line_warning", 'visibility', 'visible');
          break;
        case 4:
          map.setPaintProperty("power_line_warning", "line-color", warning_scale["DLI"]);
          map.setPaintProperty("power_line_warning", "line-width", warningWidth("DLI"));
          map.setLayoutProperty("power_line_warning", 'visibility', 'visible');
          break;
        default:
          map.setLayoutProperty("power_line_warning", 'visibility', 'none');
          break;
      }
    })
  }
}
