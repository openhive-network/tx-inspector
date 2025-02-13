<template>
  <div id="svg-tree" />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
// @ts-ignore
import ApexTree from 'apextree';
import type { IAuthorityPathEntry } from '@hiveio/wax';

interface INode {
  id: string;
  name: string;
  options: { fontColor: string };
  children: INode[];
}

const config = useRuntimeConfig();

const data: IAuthorityPathEntry = {
  processedEntry: 'tattooworld',
  processedRole: 'posting',
  threshold: 1,
  weight: 1,
  recursionDepth: 0,
  processingStatus: {
    entryAccepted: false,
    accountAuthorityProcessingDepthExceeded: false,
    accountAuthorityCountExceeded: false,
    accountAuthorityPointsMissingAccount: false,
    hasAccountAuthorityCycle: false,
    hasInsufficientWeight: true,
    hasMatchingPublicKey: false
  },
  visitedEntries: [
    {
      processedEntry: 'leofinance',
      processedRole: 'posting',
      threshold: 1,
      weight: 2,
      recursionDepth: 1,
      processingStatus: {
        entryAccepted: true,
        isOpenAuthority: false
      },
      visitedEntries: [
        {
          processedEntry: 'steemauto',
          processedRole: 'posting',
          threshold: 1,
          weight: 2,
          recursionDepth: 2,
          processingStatus: {
            entryAccepted: true,
            isOpenAuthority: false
          },
          visitedEntries: [
            {
              processedEntry: 'STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF',
              processedRole: 'posting',
              threshold: 1,
              weight: 1,
              recursionDepth: 2,
              processingStatus: {
                entryAccepted: true,
                isOpenAuthority: false
              },
              visitedEntries: []
            }
          ]
        }
      ]
    },
    {
      processedEntry: 'leofinance',
      processedRole: 'posting',
      threshold: 1,
      weight: 2,
      recursionDepth: 1,
      processingStatus: {
        entryAccepted: true,
        isOpenAuthority: false
      },
      visitedEntries: [
        {
          processedEntry: 'steemauto',
          processedRole: 'posting',
          threshold: 1,
          weight: 2,
          recursionDepth: 2,
          processingStatus: {
            entryAccepted: true,
            isOpenAuthority: false
          },
          visitedEntries: [
            {
              processedEntry: 'STM8WWUYHMdHLgEHidYCztswzfZCViA16EqGkAxt7RG4dWwDpFtCF',
              processedRole: 'posting',
              threshold: 1,
              weight: 1,
              recursionDepth: 2,
              processingStatus: {
                entryAccepted: true,
                isOpenAuthority: false
              },
              visitedEntries: []
            }
          ]
        }
      ]
    }
  ]
};

const convertToApexTreeData = (root: IAuthorityPathEntry): INode => {
  return {
    id: root.processedEntry,
    name: `@${root.processedEntry} (${data.weight}/${data.threshold})`,
    options: { fontColor: getColorByRole(data.processedRole) },
    children: root.visitedEntries.length === 0 ? [] : root.visitedEntries.filter(e => !e.processedEntry.startsWith('STM')).map(convertToApexTreeData)
  };
};

const getColorByRole = (role: string): string => {
  switch (role) {
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

onMounted(() => {
  const el = document.getElementById('svg-tree');
  const apexData = convertToApexTreeData(data);
  const options = {
    width: 600,
    height: 150,
    nodeWidth: 180,
    nodeHeight: 50,
    nodeTemplate: (content: string) => `<a href="${config.public.blockExplorerUrl}/${content.split(' ')[0]}" style="background-color: #000; border-radius: 5px; padding: 5px; height: 50px; display: flex; justify-content: center; align-items: center;">${content}</a>`,
    childrenSpacing: 40,
    siblingSpacing: 30,
    direction: 'left',
    enableToolbar: true,
    enableExpandCollapse: true
  };
  const tree = new ApexTree(el, options);
  tree.render(apexData);
});
</script>
