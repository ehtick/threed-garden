// 'use client'

// ==========================================================
// RESOURCES

import { 
  useEffect, 
  useRef, 
} from 'react'
import {
  Leva, LevaPanel,
  useControls, useCreateStore,
  folder, monitor, button
} from 'leva'
// import { useFullscreen } from 'react-use'
// import { spring } from '@leva-ui/plugin-spring'
// import Noise from 'noisejs'

// ** APOLLO Imports
// import { stores, queries, mutations } from '#/lib/api/graphql/apollo'
// import stores from '#/lib/api/graphql/apollo'
import { useReactiveVar } from '@apollo/client'
import { isPreferencesDataSetVar, preferencesDataVar } from '#/lib/api/graphql/apollo'

// ** RADIX-UI Imports
import { 
  Box,
  Button,
  Grid,
  Flex,
  Text,
} from '@radix-ui/themes'

// ** HELPER Components
import Spinner from '#/layout/ui/spinner'
// ** HELPFUL UTIL: COLORFUL CONSOLE MESSAGES (ccm)
import ccm from '#/lib/utils/console-colors'

const debug = false
const DEBUG = false

// ** WAVEFORM SUPPORT
// const noise = new Noise(Math.random())

// ==========================================================

export function ThreeDLevaControls() {
  // return <></>
  // **
  // const prefs = preferencesDataVar() // NO ??
  const prefs = useReactiveVar(preferencesDataVar) // YES ??
  // console.debug('%c prefs', ccm.orangeAlert, prefs)

  // ** EXAMPLES
  // number: { value: 10, step: 0.25 },
  // image: { image: undefined },
  // colorObj: { r: 1, g: 2, b: 3 },
  // select: { options: ['x', 'y', ['x', 'y']] },
  // interval: { min: -100, max: 100, value: [10, 15] },
  // refMonitor: monitor(ref, { graph: true, interval: 60 }),
  // showFolders: false,
  // folders: folder(
  //   {
  //     // color2: '#fff',
  //     color: {
  //       value: '#ff005b',
  //       render: (get) => get('showFolders'),
  //     },
  //     folder2: folder(
  //       {
  //         'Hey Button': button(() => console.debug('HEY HEY HEY')),
  //         folder3: folder(
  //           {
  //             spring: spring(),
  //             pos2d: { value: { x: 3, y: 4 } },
  //             pos2dArr: { value: [100, 200], x: { max: 300 } },
  //             pos3d: { value: { x: 0.3, k: 0.1, z: 0.5 }, j: { min: 0 } },
  //             pos3dArr: [Math.PI / 2, 20, 4],
  //           },
  //           {
  //             collapsed: true,
  //             render: (get) => get('showFolders'),
  //           },
  //         ),
  //       },
  //       {
  //         collapsed: true,
  //         render: (get) => get('showFolders'),
  //       },
  //     ),
  //   },
  //   {
  //     collapsed: true,
  //     render: (get) => get('showFolders'),
  //   },
  // ),

  // **


  // **
  const colorsStore = useCreateStore()
  const radiiStore = useCreateStore()
  const spaceStore = useCreateStore()
  const fontSizesStore = useCreateStore()
  const sizesStore = useCreateStore()
  const borderWidthsStore = useCreateStore()
  const fontWeightsStore = useCreateStore()

  const colors = useControls(
    {
      colors: folder({
        elevation1: 'rgba(0,0,0,0.0)', // '#09090D',
        elevation2: 'rgba(0,0,0,0.8)', // '#181C20',
        elevation3: 'rgba(255,255,255,0.1)', // '#373C4B',
        accent1: '#0066DC',
        accent2: '#007BFF',
        accent3: '#3C93FF',
        highlight1: '#535760',
        highlight2: '#8C92A4',
        highlight3: '#FEFEFE',
        vivid1: '#ffcc00',
      }),
    },
    { store: colorsStore }
  )

  const radii = useControls(
    {
      radii: folder({
        xs: '2px',
        sm: '3px',
        lg: '10px',
      }),
    },
    { store: radiiStore }
  )

  const space = useControls(
    {
      space: folder({
        sm: '6px',
        md: '6px',
        rowGap: '6px',
        colGap: '6px',
      }),
    },
    { store: spaceStore }
  )

  const fontSizes = useControls(
    {
      fontSizes: folder({
        root: '14px',
      }),
    },
    { store: fontSizesStore }
  )

  const sizes = useControls(
    {
      sizes: folder({
        rootWidth: 'auto',
        controlWidth: '50%',
        rowHeight: '16px',
        folderHeight: '16px',
        folderTitleHeight: '16px',
        titleBarHeight: '16px',
        checkboxSize: '12px',
        joystickWidth: '64px',
        joystickHeight: '64px',
        colorPickerWidth: '100px',
        colorPickerHeight: '20px',
        monitorHeight: '64px',
        numberInputMinWidth: '48px',
        scrubberWidth: '8px',
        scrubberHeight: '16px',
      }),
    },
    { store: sizesStore }
  )

  const borderWidths = useControls(
    {
      borderWidths: folder({
        root: '0px',
        input: '1px',
        focus: '1px',
        hover: '1px',
        active: '1px',
        folder: '1px',
      }),
    },
    { store: borderWidthsStore }
  )

  const fontWeights = useControls(
    {
      fontWeights: folder({
        label: { value: 'normal', options: ['bold', 'light'] },
        folder: { value: 'normal', options: ['bold', 'light'] },
        button: { value: 'normal', options: ['bold', 'light'] },
      }),
    },
    { store: fontWeightsStore }
  )

  const theme = { colors, radii, space, fontSizes, sizes, borderWidths, fontWeights }

  // ** LEVA GUI CONTROL PANEL
  const [{
    showTitleBar,
    title,
    drag,
    filter,
    position,
    // fullScreen,
    // oneLineLabels,
    // refMonitor
  }, setControlPanelLeva] = useControls(
    'Leva Control Panel',
    () => ({
      showTitleBar: { value: true, render: (get) => get('Panel.showTitleBar') },
      // prefs.projectName
      title: { value: prefs.projectName, render: (get) => get('Panel.showTitleBar') },
      drag: { value: true, render: (get) => get('Panel.showTitleBar') },
      filter: { value: false, render: (get) => get('Panel.showTitleBar') },
      position: { 
        value: { 
          x: -440, 
          y: 6
        }, 
        render: (get) => get('Panel.showTitleBar') 
      },
      // fullScreen: true,
      // oneLineLabels: false,
      // refMonitor: { 
      //   value:  monitor(refMon, { graph: true, interval: 60 }), 
      //           render: (get) => get('Panel.showTitleBar') 
      // },
    }),
    {
      color: 'darkgreen',
      collapsed: false,
      order: -2,
    },
  )

  const [{
    doAutoLoadDataLeva,
    doAutoRotateLeva,
  }, setUserPreferencesLeva] = useControls(
    'User Preferences',
    () => ({
      doAutoLoadDataLeva: {
        label: 'Auto Load Data?',
        value: prefs.doAutoLoadData,
      },
      doAutoRotateLeva: {
        label: 'Auto Rotate?',
        value: prefs.doAutoRotate,
      },
    }),
    {
      color: 'darkgreen',
      collapsed: false,
      order: 0,
    },
  )

  const [{
    projectNameLeva,
    // refMonitorLeva,
  }, setProjectPreferencesLeva] = useControls(
    'Project Preferences',
    () => ({
      projectNameLeva: {
        label: 'Project Name',
        value: prefs.projectName,
      },
    }),
    {
      color: 'darkgreen',
      collapsed: false,
      order: -1,
    },
  )

  // ==========================================================
  // isPreferencesDataSetVar() ??

  // ==========================================================
  // ** doAutoLoadData

  // **
  useEffect(() => {
    let newData = {...preferencesDataVar()} // latest prefs
    // console.debug('%c⚙️ doAutoLoadDataLeva newData', ccm.green, newData)
    newData.doAutoLoadData = doAutoLoadDataLeva
    // console.debug('%c⚙️ doAutoLoadDataLeva newData UPDATED', ccm.green, newData)
    preferencesDataVar(newData)
    // console.debug('%c⚙️ doAutoLoadDataLeva preferencesDataVar', ccm.darkgreen, preferencesDataVar())
  }, [doAutoLoadDataLeva])

  useEffect(() => {
    // if (prefs.doAutoLoadData != undefined) {
      setUserPreferencesLeva({ doAutoLoadDataLeva: prefs.doAutoLoadData })
    // }
    if (debug) console.debug('%c⚙️ READ FROM MASTER REACTIVE VAR: prefs.doAutoLoadData', ccm.greenAlert, prefs.doAutoLoadData)
  }, [prefs.doAutoLoadData])

  // ==========================================================

  // ==========================================================
  // ** doAutoRotate

  // **
  useEffect(() => {
    let newData = {...preferencesDataVar()} // latest prefs
    // console.debug('%c⚙️ doAutoRotateLeva newData', ccm.green, newData)
    newData.doAutoRotate = doAutoRotateLeva
    // console.debug('%c⚙️ doAutoRotateLeva newData UPDATED', ccm.green, newData)
    preferencesDataVar(newData)
    // console.debug('%c⚙️ doAutoRotateLeva preferencesDataVar', ccm.darkgreen, preferencesDataVar())
  }, [doAutoRotateLeva])

  // **
  useEffect(() => {
    // if (prefs.doAutoRotateLeva != undefined) {
      setUserPreferencesLeva({ doAutoRotateLeva: prefs.doAutoRotate })
    // }
    if (debug) console.debug('%c⚙️ READ FROM MASTER REACTIVE VAR: prefs.doAutoRotate', ccm.greenAlert, prefs.doAutoRotate)
  }, [prefs.doAutoRotate])

  // ==========================================================

  // ==========================================================
  // ** projectName
  useEffect(() => {
    // set({ Id: projectName})
    // if (prefs.projectName != undefined) {
      setControlPanelLeva({ title: prefs.projectName})
      setProjectPreferencesLeva({ projectNameLeva: prefs.projectName })
    // }
    if (debug) console.debug('%c⚙️ READ FROM MASTER REACTIVE VAR: prefs.projectName', ccm.greenAlert, prefs.projectName)
  }, [prefs.projectName])
  // **
  useEffect(() => {
    try {

      let newData = {...preferencesDataVar()} // latest prefs
      newData.projectName = projectNameLeva
      // console.debug('%c⚙️ projectNameLeva newData', ccm.redAlert, projectNameLeva)
      preferencesDataVar(newData)
      // console.debug('%c⚙️ projectNameLeva preferencesDataVar', ccm.darkgreen, preferencesDataVar())

      if (projectNameLeva != undefined) {
        setControlPanelLeva({ title: projectNameLeva})
      }
      else {
        console.debug('%c⚙️ ERROR: projectNameLeva: UNDEFINED', ccm.redAlert, projectNameLeva)
      }

    } catch (ERR) {
      console.debug('%c⚙️ ERROR: setControlPanelLeva title: projectNameLeva', ccm.redAlert, projectNameLeva)
    }
  }, [projectNameLeva])
  // ==========================================================

  // ==========================================================

  // // **
  // const refMon = useRef(4) // 4 ?
  // // **
  // useEffect(() => {
  //   let x = 0
  //   setInterval(() => {
  //     x += 0.1
  //     const t = Date.now()
  //     refMon.current = 2 * noise.simplex2(3 * x + t, x) + (3 * Math.sin(x)) / x
  //   }, 30)
  // }, [])

  // useFullscreen({ current: document.documentElement }, fullScreen, {
  //   onClose: () => setControlPanelLeva({ fullScreen: false }),
  // })

  // ==========================================================

  return (
    <>
      <div
        style={{
          // display: 'none',
          display: 'inline-flex',
          width: '320px',
        }}
      >
        <Leva
          isRoot={true}
          titleBar={showTitleBar && { drag, title, filter, position }} // TITLE | PROJECT_NAME
          // hideTitleBar={true} // default = false. true hides the GUI header
          theme={theme} // you can pass a custom theme (see the styling section)
          collapsed={true} // default = false. true makes the GUI collapsed to start
          fill={false} // default = false. true makes the pane fill the parent dom node it's rendered in
          flat={true} // default = false. true removes border radius and shadow
          hidden={false} // default = false. true hides the GUI
          neverHide={true} // default = true. false allows hiding of the GUI
          oneLineLabels={false} // default = false. true makes labels + fields on separate rows
          hideCopyButton={true} // default = false. true hides the onHover copy button
        />
      </div>
      {/* <LevaPanel fill flat titleBar={false} store={colorsStore} /> */}
      {/* <LevaPanel fill flat titleBar={false} store={radiiStore} /> */}
      {/* <LevaPanel fill flat titleBar={false} store={spaceStore} /> */}
      {/* <LevaPanel fill flat titleBar={false} store={fontSizesStore} /> */}
      {/* <LevaPanel fill flat titleBar={false} store={sizesStore} /> */}
      {/* <LevaPanel fill flat titleBar={false} store={borderWidthsStore} /> */}
      {/* <LevaPanel fill flat titleBar={false} store={fontWeightsStore} /> */}
      {/* <pre>{JSON.stringify(theme, null, '  ')}</pre> */}
    </>
  )
}

export const ThreeDLevaComponent = (
  { 
    projectName,
    setProjectName,
    projectNameFromLeva,
    setProjectNameFromLeva,
  }:
  { 
    projectName: string,
    setProjectName: Function,
    projectNameFromLeva: string,
    setProjectNameFromLeva: Function,
  }
) => {
  // **
  const word = `[MM] ThreeDLevaComponent @ ${new Date().toISOString()}`
  // **
  // const [{ projectNameFromLeva }, set] = useControls(
  //   () => (
  //     {
  //       projectName: projectName,
  //       projectNameFromLeva: projectName,
  //       word: word,
  //     }
  //   )
  // )

  // ** onMount (on component loaded)
  useEffect(() => {
    // react set state
    // setProjectName(projectName)
    setProjectName(projectNameFromLeva)
    // leva set store (from react state)
    setProjectNameFromLeva(projectName)
    // setProjectNameFromLeva(projectNameFromLeva)
    // **
  }, [projectName, projectNameFromLeva])

  return (
    <>
      {/* <div>
        {projectNameFromLeva}: {projectName}
      </div>
      <div>
        {projectName}: {projectNameFromLeva}
      </div> */}
    </>
  )
}

export default ThreeDLevaControls
