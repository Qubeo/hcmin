/*eslint no-unused-vars: "warn"*/
import cytoscape from 'cytoscape';


export function basicCyto(container) {
  
    console.log("basicCyto.js: basicCyto()");
    var cy = cytoscape({
  
    container: container, // container to render in
  
    elements: [ // list of graph elements to start with
      { // node a
        data: { id: 'a' }
      },
      { // node b
        data: { id: 'b' }
      },
      { // edge ab
        data: { id: 'ab', source: 'a', target: 'b' }
      }
    ],
  
    style: [ // the stylesheet for the graph
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
        }
      },
  
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle'
        }
      }
    ],
  
    layout: {
      name: 'grid',
      fit: true,
      padding: 12,
      rows: 1,
      // boundingBox: { x1: 0, y1: 0, w: 400, h: 400 }
    },

      // initial viewport state:
    zoom: 1,
    pan: { x: 0, y: 0 },
  });

  // var eles = cy.elements();
  // eles.renderedBoundingBox();
  // cy.fit();
  // cy.center();
  // cy.elements().shift('x', -200);

}