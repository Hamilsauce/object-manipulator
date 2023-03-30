## CLASSES
- GraphicObject: 
  * Handles most svg/dom initialization and provides DOM/SVG manipulation interface
  * Template Construction
  * Provides Object structural manipulation API
  * Adapts inputd to transforms
  * ...

- SceneObject `extends GraphicObject`: 
  * Adds Interface to `GraphicObject` for Producing Events/Actions to Context:
    1. Point/position
    2. bounding box
  * Adds Interface to `GraphicObject` for Consuming Scene State:
    1. FocusedObjectId
    2. content value?
  
- GeometryObject `extends SceneObject`: 
  * Adds Vertices
  * Draws paths from vertices

## NOTES
- 

  