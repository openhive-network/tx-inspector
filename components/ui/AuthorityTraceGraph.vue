<template>
  <div class="position-relative canvas-container">
    <div
      :id="`cy-${props.uniqueId}`"
      class="h-[75px] w-full cursor-pointer ma-auto"
    />
    <s-dialog>
      <s-tooltip-provider :delay-duration="350">
        <s-tooltip>
          <s-tooltip-trigger class="position-absolute top-[5px] right-[5px] hover:opacity-80 p-3 !text-muted-foreground transition-opacity" as-child>
            <s-dialog-trigger as-child @click="renderGraphInDialog">
              <v-icon size="medium">
                mdi-arrow-expand-all
              </v-icon>
            </s-dialog-trigger>
          </s-tooltip-trigger>
          <s-tooltip-content>
            <div class="flex flex-col">
              <span class="text-lg">Authority path preview:</span>
              <hr class="my-2">
              <span>
                <p>Click to display the full screen, interactive authority path preview.</p>
                <p class="font-bold my-2">In the preview mode, you can:</p>
                <ul>
                  <li><v-icon>mdi-hand-pointing-right</v-icon> Zoom in and out,</li>
                  <li><v-icon>mdi-hand-pointing-right</v-icon> Drag the graph,</li>
                  <li><v-icon>mdi-hand-pointing-right</v-icon> Click on the nodes to open detailed account information.</li>
                </ul>
              </span>
            </div>
          </s-tooltip-content>
        </s-tooltip>
      </s-tooltip-provider>
      <s-dialog-content class="min-w-[90vw] max-h-[80dvh]">
        <s-dialog-header>
          <s-dialog-title>
            Authority path preview
          </s-dialog-title>
          <s-dialog-description>
            Click on the node to open the block explorer
          </s-dialog-description>
        </s-dialog-header>
        <div
          :id="`cy-preview-${props.uniqueId}`"
          class="h-[70vh] w-[80vw] cursor-pointer ma-auto"
        />
      </s-dialog-content>
    </s-dialog>
  </div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/naming-convention */
import cytoscape from 'cytoscape';
import type { IAuthorityGraphData } from '~/types/wax';

const props = defineProps<{
  graphData: IAuthorityGraphData[];
  uniqueId: number;
  color: string;
}>();

const color = () => {
  switch (props.color) {
    case 'posting':
      return '#0fbd86';
    case 'active':
      return '#0fbabd';
    case 'owner':
      return '#bd740f';
    default:
      return '#fff';
  }
};

const config = useRuntimeConfig();

const renderGraphInDialog = async () => {
  const cyElement = computed(() => document.getElementById(`cy-preview-${props.uniqueId}`));

  await nextTick(() => {
    const cy = cytoscape({
      container: cyElement.value,
      elements: props.graphData,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': '#000',
            color: color(),
            'text-valign': 'center',
            'text-halign': 'center',
            width: 200,
            height: 50,
            label: 'data(label)',
            shape: 'rectangle',
            'font-size': props.graphData.length > 1 ? 15 : 10,
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
};

onMounted(() => {
  const cy = cytoscape({
    container: document.getElementById(`cy-${props.uniqueId}`),
    elements: props.graphData,
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#000',
          color: color(),
          'text-valign': 'center',
          'text-halign': 'center',
          width: 200,
          height: 50,
          label: 'data(label)',
          shape: 'rectangle',
          'font-size': props.graphData.length > 1 ? 20 : 15,
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
    // Disable zooming and grabbing by default for the authority path preview.
    userZoomingEnabled: false,
    userPanningEnabled: false,
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

<style>
.canvas-container [id^="cy-"] {
  pointer-events: none;
}
</style>
