<template>
  <div
    :id="`cy-${props.uniqueId}`"
    class="h-[100px] w-[800px] cursor-pointer ma-auto"
    :class="{ 'h-[400px]': props.graphData.length > 10, 'h-[600px]': props.graphData.length > 30 }"
  />
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/naming-convention */
import cytoscape from 'cytoscape';
import type { IAuthorityGraphData } from '~/types/wax';

const props = defineProps<{
  graphData: IAuthorityGraphData[];
  uniqueId: number;
}>();

const config = useRuntimeConfig();

onMounted(() => {
  const cy = cytoscape({
    container: document.getElementById(`cy-${props.uniqueId}`),
    elements: props.graphData,
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
          'font-size': props.graphData.length > 1 ? '' : 1.5,
          // @ts-expect-error
          padding: props.graphData.length > 1 ? 10 : 1
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
