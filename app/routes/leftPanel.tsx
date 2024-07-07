import { Box, Collapse, Group, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { CaretDownFill, CaretRightFill, ListNested, Plus } from 'react-bootstrap-icons';
import { WidgetType } from './widgetDefinition';
import { allElementWidgets, allLayoutWidgets, Widgetinstance } from './widgets';
import { NewWidgetDraggables } from './_index';

export default function LeftPane({ droppedItems }: { droppedItems: Widgetinstance[]}) {
  const [showItem, setShowItem] = useState('');
  console.log(showItem)
  return (
    <div className=' tw-grid tw-grid-flow-col tw-h-screen tw-bg-gray-900 '>
      <div className=' tw-py-2 tw-px-1 tw-flex tw-flex-col tw-gap-2 tw-bg-gray-900  tw-border-r-2 tw-w-[50px]'>
        <div className=' tw-text-4xl hover:tw-bg-slate-400 hover:tw-bg-opacity-10 tw-cursor-pointer tw-rounded-sm tw-mx-auto ' onClick={() =>  setShowItem('')} ><Plus /></div>
        <div className=' tw-text-3xl hover:tw-bg-slate-400 hover:tw-bg-opacity-10 tw-cursor-pointer tw-rounded-sm tw-p-1 ' onClick={() => { showItem !== 'widgetTree' ? setShowItem('widgetTree') : setShowItem('') }} ><ListNested /></div>
      </div>
      {showItem === '' && <div className=" tw-w-[100%] tw-h-full tw-bg-gray-900 ">
        <AddWidgetsComponent showItem={showItem} handleShowItem={setShowItem} />
      </div>}

      {showItem === 'widgetTree' && <div className=" tw-flex-1 tw-h-full tw-bg-gray-900">
        <TreeComponent droppedItems={droppedItems} />
      </div>}


    </div>
  )
}


export function AddWidgetsComponent({ showItem, handleShowItem }: { showItem: string; handleShowItem: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <div className=' tw-h-full'>
      <h4 className=' tw-text-xl tw-font-bold tw-text-gray-300 tw-pt-3 tw-pl-2'>Add</h4>
      <div className=' tw-pl-4 tw-flex tw-flex-col tw-justify-around tw-py-2 tw-gap-8 '>
        <div className=' tw-text-xl tw-font-bold' ><ElementsCollapsableMenu showItem={showItem} handleShowItem={handleShowItem} /></div>
        <div className=' tw-text-xl tw-font-bold'><LayoutCollapsableMenu /></div>
      </div>
    </div>
  )
}


export function ElementsCollapsableMenu({ showItem, handleShowItem }: { showItem: string; handleShowItem: React.Dispatch<React.SetStateAction<string>> }) {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <Box maw={400}>
      <Group justify="start" mb={5}>
        <div onClick={toggle} className=' tw-flex tw-justify-center tw-items-center tw-cursor-pointer tw-gap-2'>
          {opened ?
            <CaretDownFill />
            :
            <CaretRightFill />
          }
          <div>Elements</div></div>
      </Group>

      <Collapse in={opened} transitionDuration={100} transitionTimingFunction="linear">
        <div className="tw-col-span-1 tw-p-3 tw-h-auto tw-grid tw-grid-cols-1 xl:tw-grid-cols-2 tw-gap-1 ">
          {allElementWidgets.map((WidgetClass, index) => (
            <NewWidgetDraggables key={index} WidgetClass={WidgetClass} />
          ))}
        </div>
        <div>
        </div>
      </Collapse>
    </Box>
  );
}
export function LayoutCollapsableMenu() {
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <Box maw={400}>
      <Group justify="start" mb={5}>
        <div onClick={toggle} className=' tw-flex tw-justify-center tw-items-center tw-cursor-pointer tw-gap-2'>
          {opened ?
            <CaretDownFill />
            :
            <CaretRightFill />
          }
          <div>Layout</div>
        </div>
      </Group>

      <Collapse in={opened} transitionDuration={100} transitionTimingFunction="linear">
        <div className="tw-col-span-1 tw-h-auto tw-grid tw-grid-cols-1 tw-p-3 xl:tw-grid-cols-2 tw-gap-1  ">
          {allLayoutWidgets.map((WidgetClass, index) => (
            <NewWidgetDraggables key={index} WidgetClass={WidgetClass} />
          ))}
        </div>
      </Collapse>
    </Box>
  );
}
/***    */

function TreeNode({ node }) {
  const [opened, { toggle }] = useDisclosure(false);
  console.log("treenode", node)
  const flag = (node.leftChildren || node.rightChildren || node.children);

  return (
    <Box>
      <Group justify="start" mb={5}>
        <div onClick={toggle} className={`tw-flex tw-justify-center tw-items-center tw-cursor-pointer tw-gap-2 ${flag ? 'tw-ml-0' : 'tw-ml-6'}`}>
          {flag ? (opened ? <CaretDownFill /> : <CaretRightFill />) : ' '}
          <Text>{node.humanRedableName}</Text>
        </div>
      </Group>
      {node.children && (
        <Collapse in={opened} transitionDuration={100} transitionTimingFunction="linear">
          <Box pl={20}>
            {node.children.map(child => (
              <TreeNode key={child.id} node={child} />
            ))}
          </Box>
        </Collapse>
      )}
      {node.type === WidgetType.twoColumnLayout && (
        
        <Collapse in={opened} transitionDuration={100} transitionTimingFunction="linear">
          <Box pl={20}>
            <Text>Left Column</Text>
            {node.leftChildren && node.leftChildren.map(child => (
              <TreeNode key={child.id} node={child} />
            ))}
            <Text>Right Column</Text>
            {node.rightChildren && node.rightChildren.map(child => (
              <TreeNode key={child.id} node={child} />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
}

export function TreeComponent({ droppedItems }: { droppedItems: Widgetinstance[]}) {
  return (
    <Box maw={400}>
      <div className='tw-text-xl tw-font-bold tw-pt-3 tw-pl-2 tw-text-gray-300'>Widget Tree</div>
      <div className='tw-pl-4 tw-py-2'>
        {droppedItems.map(node => (
          <TreeNode key={node.id} node={node} />
        ))}
      </div>
    </Box>
  );
}




