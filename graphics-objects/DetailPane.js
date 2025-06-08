export const initDetailPane = (context) => {
  
  const self = context.dom.querySelector('#detail-pane');
  
  const DetailPane = {
    dom: self,
    name: self.querySelector('#object-name'),
    selected: self.querySelector('#selected-value'),
    focused: self.querySelector('#focused-value'),
    xcoord: self.querySelector('#x-coord-value'),
    ycoord: self.querySelector('#y-coord-value'),
    width: self.querySelector('#width-value'),
    height: self.querySelector('#height-value'),
    vertices: self.querySelector('#vertices-value'),
    addEventListener(evt, listener) { this.dom.addEventListener(evt, listener) },
  }
  
  // DetailPane.dom.addEventListener('click', e => {
  //   // e.stopPropagation()
  //   console.log('DETAIL PANE CLICK', e.target)
  //   // const targ = e.target.closest('')
  //   // const
    
  // });
  // DetailPane.name.addEventListener('click', e => {
  //   // e.stopPropagation()
  //   console.log('DETAIL PANE NAME CLICK', e.target)
    
  //   // console.log(e.target)
  //   // const targ = e.target.closest('')
  //   // const
    
  // });
  
  return DetailPane
}