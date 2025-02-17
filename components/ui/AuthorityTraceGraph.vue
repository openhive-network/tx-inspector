<template>
  <div id="cy" class="h-[600px] w-[800px] cursor-pointer ma-auto" />
</template>

<script setup>
/* eslint-disable @typescript-eslint/naming-convention */
import { onMounted } from 'vue';
import cytoscape from 'cytoscape';
import expandCollapse from 'cytoscape-expand-collapse';

const config = useRuntimeConfig();

cytoscape.use(expandCollapse);

onMounted(() => {
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      { data: { id: 'tattooworld', label: '@tattooworld (1/1)' } },
      { data: { id: 'leofinance1', label: '@leofinance (2/1)' } },
      { data: { id: 'leofinance2', label: '@leofinance (2/1)' } },
      { data: { id: 'leofinance3', label: '@leofinance (2/1)' } },
      { data: { id: 'leofinance4', label: '@leofinance (2/1)' } },
      { data: { id: 'leofinance5', label: '@leofinance (2/1)' } },
      { data: { id: 'leofinance6', label: '@leofinance (2/1)' } },
      { data: { id: 'leofinance7', label: '@leofinance (2/1)' } },
      { data: { id: 'steemauto', label: '@steemauto (2/1)' } },
      { data: { id: 'e1', source: 'tattooworld', target: 'leofinance1' } },
      { data: { id: 'e2', source: 'tattooworld', target: 'leofinance2' } },
      { data: { id: 'e3', source: 'tattooworld', target: 'leofinance3' } },
      { data: { id: 'e4', source: 'tattooworld', target: 'leofinance4' } },
      { data: { id: 'e5', source: 'tattooworld', target: 'leofinance5' } },
      { data: { id: 'e6', source: 'tattooworld', target: 'leofinance6' } },
      { data: { id: 'e7', source: 'tattooworld', target: 'leofinance7' } },
      { data: { id: 'e8', source: 'leofinance1', target: 'steemauto' } },
      { data: { id: 'e9', source: 'leofinance2', target: 'steemauto' } },
      { data: { id: 'e10', source: 'leofinance3', target: 'steemauto' } },
      { data: { id: 'e11', source: 'leofinance4', target: 'steemauto' } },
      { data: { id: 'e12', source: 'leofinance5', target: 'steemauto' } },
      { data: { id: 'e13', source: 'leofinance6', target: 'steemauto' } },
      { data: { id: 'e14', source: 'leofinance7', target: 'steemauto' } }
    ],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#000',
          color: '#0fbd86',
          'text-valign': 'center',
          'text-halign': 'center',
          width: 'label',
          height: 'label',
          label: 'data(label)',
          shape: 'rectangle',
          padding: '10px',
          grabbable: false
        }
      },
      {
        selector: 'edge',
        style: {
          width: 1,
          'line-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ],
    layout: {
      name: 'breadthfirst',
      directed: true,
      padding: 10,
      spacingFactor: 1,
      nodeDimensionsIncludeLabels: false,
      fit: true,
      transform: (_node, position) => {
        return {
          x: position.y * 2,
          y: position.x / 2
        };
      }
    },
    wheelSensitivity: 0.1,
    autoungrabify: true
  });

  cy.fit();

  cy.on('tap', 'node', (evt) => {
    const node = evt.target;
    const id = node.id().replace(/\d+$/, '');
    const url = `${config.public.blockExplorerUrl}/@${id}`;
    window.open(url, '_blank');
  });
});
</script>
