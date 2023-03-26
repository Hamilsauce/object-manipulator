export const ApplicationConfig = {
  type: 'app-component',
  name: 'app',
  components: {
    canvas: {
      type: 'viewport',
      name: 'canvas',
      // width: window.innerWidth,
      // height: window.innerHeight,
      viewBox: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      scale: 1,
      dimensions: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      point: {
        x: 0,
        y: 0,
      },
      components: {
        scene: {
          type: 'viewport',
          name: 'scene',
          scale: 1,
          // width: 412,
          // height: 781,
          dimensions: {
            width: 412,
            height: 781,
          },
          point: {
            x: 0,
            y: 0,
          },
          viewBox: {
            x: -36,
            y: -64,
            width: 72,
            height: 128,
          },
          layers: {
            surface: {
              type: 'layer',
              name: 'surface',
            },
            objects: {
              type: 'layer',
              name: 'objects',
            },
          },
        },
        hud: {
          type: 'component',
          name: 'hud',
          widgets: {
            panes: {
              detail: null,
              origin: null,
            },
            toolbox: null,
          },
        },
      },
    },
  }
}