export const ApplicationConfig = {
  objectType: 'app',
  name: 'app',
  components: {
    canvas: {
      objectType: 'viewport',
      name: 'canvas',
      scale: 1,
      width: window.innerWidth,
      height: window.innerHeight,
      viewBox: {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      components: {
        scene: {
          objectType: 'viewport',
          name: 'scene',
          scale: 16,
          width: 412,
          height: 781,
          viewBox: {
            x: -36,
            y: -64,
            width: 72,
            height: 128,
          },
          layers: {
            surface: {
              objectType: 'layer',
              name: 'surface',
            },
            objects: {
              objectType: 'layer',
              name: 'objects',
            },
          },
        },
        hud: {
          objectType: 'component',
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