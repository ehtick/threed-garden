// 'use client'
// ================================================
// RESOURCES

// ** VALTIO (State) Imports
import { 
  proxy, 
  useSnapshot,
} from 'valtio'

// ** REACT Imports
import {
  useEffect,
  useState,
  useRef,
  Suspense,
} from 'react'

// ** REACT THREE Imports
import {
  useThree,
  useFrame,
  useLoader,
} from '@react-three/fiber'
import {
  useCursor,
  useGLTF,
  useFBX,
  useAnimations,
  useTexture,
  // Bounds, 
  useBounds, // inside Model
} from '@react-three/drei'

// Three Loaders
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
// import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

// React Spring (for actions)
// import { useSpring, a, Globals } from '@react-spring/three'
// Globals.assign({
//   frameLoop: 'always',
// })

// ** PHYSICS Imports
import { RigidBody } from '@react-three/rapier'

// ** EXAMPLES Imports
import CoffeeCup from '#/lib/threed/components/examples/CoffeeCup/CoffeeCup'

// HELPERS Imports
// ** UUID Generator
import { v4 as newUUID } from 'uuid'
// ** COLORFUL CONSOLE MESSAGES (ccm)
import ccm from '#/lib/utils/console-colors'
// ** SPINNER
// import Spinner from '#/layout/ui/spinner'
// ** CANVAS LOADER
// import Loader from '@react-three/drei'
// ** CANVAS HTML
// import Html from '@react-three/drei'
import { 
  Html,
  Loader,
} from '@react-three/drei'

// ==========================================
// ** VARIABLES

const debug = true // false | true // ts: boolean
const DEBUG = true // false | true // ts: boolean

// ==========================================
// ** ThreeD == Group of > Files of > Nodes of > 3DObjects
// interface IThreeD {
// ** TODO
let IThreeD = {
  name: 'THREED DEFAULT: FILE (GROUP OF) NODES TO RENDER',
  data: {}, // original data records from db/api
  group: {
    group_id: newUUID(),
    // NOTE: 1.570796 radians = Math.PI / 2 = 90 degrees
    group_position: [0, 0, 0],
    group_rotation: [0, 0, 0], // [-Math.PI / 2, 0, 0],
    group_scale: 1.0, // 0.01 | 0.05 | 0.5 | 1.0 | 5.0 | 50.0 | 100.0
  },
  file: {
    __typename: 'File',
    file: null,
    fileId: 0,
    fileType: 'tbd',
    isObject3d: false,
    isUrl: false,
    modified: '',
    title: '',
    uri: '',
    url: '',
  },
  fileUrl: '',
  nodes: [], // nodes from file(s) == threed.nodes
  actionModes: [
    'translate',
    'rotate',
    'scale'
  ]
}

// ** ThreeD Object -- Constructor Function
// -- returns new ThreeD
// function ThreeD(this: IThreeD, _type: string = 'ThreeD') {
// ** TODO: interface IThreeD
function ThreeD(_type = 'ThreeD') {
  // object params
  this.name = 'ThreeD: Default FILE (GROUP OF) NODES TO RENDER'
  this.data = {} // original data records from db/api
  this.group = {
    group_id: newUUID(),
    // NOTE: 1.570796 radians = Math.PI / 2 = 90 degrees
    group_position: [0, 0, 0],
    group_rotation: [0, 0, 0], // [-Math.PI / 2, 0, 0],
    group_scale: 1.0, // 0.01 | 0.05 | 0.5 | 1.0 | 5.0 | 50.0 | 100.0
  }
  this.file = {
    __typename: 'File',
    file: null,
    fileId: 0,
    fileType: 'tbd',
    isObject3d: false,
    isUrl: false,
    modified: '',
    title: '',
    uri: '',
    url: '',
  }
  this.fileUrl = ''
  this.nodes = [] // nodes from file(s) == threed.nodes
  this.actionModes = [
    'translate',
    'rotate',
    'scale'
  ]
}

// ** ThreeD Model -||-
const Model = ({
  threed =     new ThreeD(),
  // name =    ThreeD.name,
  // group =   ThreeD.group,
  // file =    ThreeD.file
}) => {

  // **
  // ** for testing only
  // ** return 1 ThreeD Object in JSX
  // return <><CoffeeCup /></>

  // get Reactive state on each model (using valtio)
  // const modelVState = proxy({ current: null, mode: 0 })
  // const modelVState = proxy({ current: null, mode: 0 })

  // Ties this component to the model state
  // const snap = useSnapshot(modelVState)

  // **
  // if (debug || DEBUG) console.debug(`%c====================================`, ccm.black)
  if (debug || DEBUG) console.debug('%c🖊️ Model props.threed', ccm.red, threed.name, threed)
  // if (debug || DEBUG) console.debug('%c🖊️ Model props.threed.name', ccm.red, threed.name)
  // if (debug || DEBUG) console.debug('%c🖊️ Model props.threed.group', ccm.red, threed.group)
  // if (debug || DEBUG) console.debug('%c🖊️ Model props.threed.file', ccm.red, threed.file)
  // if (debug || DEBUG) console.debug(`%c====================================`, ccm.black)
  // if (debug || DEBUG) console.debug('%c🖊️ Model modelVState', ccm.red, modelVState)
  // if (debug || DEBUG) console.debug('%c🖊️ Model snap', ccm.red, snap)
  // if (debug || DEBUG) console.debug('Model props.sceneState', sceneState)
  // if (debug || DEBUG) console.debug('Model props.storeState', storeState)

  // set a default file to load for Model (for testing)
  // fileUrlDefault: '/assets/objects/examples/compressed.glb' | '/assets/objects/examples/compressed-v002.glb' |
  const fileUrlDefault =
    // ''
    // '/assets/objects/threeds/synty/polygon/farm/Demo/Polygon_Farm_Demo_FBX.glb'
    // 'https://threedpublic.s3.us-west-2.amazonaws.com/assets/threeds/synty/polygon/farm/Demo/Polygon_Farm_Demo_FBX.glb'
    // '/assets/objects/threeds/synty/polygon/farm/Demo/Polygon_Farm_Demo_FBX.fbx'
    // 'https://threedpublic.s3.us-west-2.amazonaws.com/assets/threeds/synty/polygon/farm/Demo/Polygon_Farm_Demo_FBX.fbx'
    // '/assets/objects/examples/coffee-transformed.glb'
    // 'https://threedpublic.s3.us-west-2.amazonaws.com/assets/threeds/synty/polygon/farm/FBX/SM_Prop_Carrot_01.fbx'
    'https://threedpublic.s3.us-west-2.amazonaws.com/assets/threeds/synty/polygon/farm/FBX/SM_Prop_Plant_Corn_01.fbx'
  // const fileUrl = threed.file?.isUrl ? threed.file.url : fileUrlDefault
  let fileUrl = fileUrlDefault
  if (threed.data.modelFiles.nodes[0].url) {
    fileUrl = threed.data.modelFiles.nodes[0].url
  }

  const textureUrlDefault = '' // blank string
  const textureUrl = threed.file?.isUrl && threed.file?.isTexture ? threed.file.url : textureUrlDefault

  // this model = threed_model -||-
  const model = {
    ref:        useRef(null),
    name:       threed.name,
    file:       fileUrl,                // threed.data.modelFiles.nodes[0].url,
    group:      threed.group,
    nodes:      threed.nodes,
    //** custom fields
    __typename: threed.data.__typename, // 'Threed'
    content:    threed.data.content,
    files:      threed.data.files,
    threedId:   threed.data.threedId,
    title:      threed.data.title,      // 'ThreeD Demo: McGee Ranch (FBX)',
    uri:        threed.data.uri,        // '/threed-threed/threed-demo-mcgee-ranch-fbx/',
    version:    threed.data.version,    // '0.0.2',
    modified:   threed.data.modified,   // '2024-03-13T04:18:47',
    positionX:  threed.data.positionX,
    positionY:  threed.data.positionY,
    positionZ:  threed.data.positionZ,
    rotationX:  threed.data.rotationX,
    rotationY:  threed.data.rotationY,
    rotationZ:  threed.data.rotationZ,
    scaleX:     threed.data.scaleX,
    scaleY:     threed.data.scaleY,
    scaleZ:     threed.data.scaleZ,

    texture:    textureUrl,

    // state:  modelVState, // for funzees ??
    // sceneState: sceneState, // for funzees ??
    // storeState: storeState, // for funzees ??

    // file type?
    type: 'tbd', // fbx | gltf | obj | threed | threed_node | png | texture
    // ** decide file type from file extension (and other qualifiers)
    // const testExt = /\.(glb|gltf|fbx|obj|mtl|gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileUrl)
    // if (debug || DEBUG) console.debug('testExt', testExt)
    is: {
      // is Ready to go?
      isReadyForCanvas: false,
      // file type is.isSupported?
      isSupported: /\.(glb|gltf|fbx|obj|mtl|gif|jpe?g|png|webp)$/i.test(fileUrl),
      // 3D Objects
      isObject3D: /\.(glb|gltf|fbx|obj)$/i.test(fileUrl),
      isGLTF: /\.(glb|gltf)$/i.test(fileUrl),
      isFBX: /\.(fbx)$/i.test(fileUrl),
      isOBJ: /\.(obj)$/i.test(fileUrl),
      isMTL: /\.(mtl)$/i.test(fileUrl), // meta file for OBJ
      // 2D Files
      isImage: /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i.test(fileUrl),
      isPNG: /\.(png)$/i.test(fileUrl),
      isJPG: /\.(jpe?g)$/i.test(fileUrl),
      isGIF: /\.(gif)$/i.test(fileUrl),
      isSVG: /\.(svg)$/i.test(fileUrl),
      isWEBP: /\.(webp)$/i.test(fileUrl),
      // Texture Files
      isTexture: textureUrl ? true : false,
      // ThreeD Nodes
      isThreeD: false,
      isThreeDNode: false,
    },
    // animations
    ani: {
      ref: null, // useRef(null),
      actions: [],
      names: [],
      clips: [],
      mixer: {},
    },
  }


  // fetch the file (GLTF, FBX, OBJ, etc)
  if (model.is.isSupported) {

    if (debug || DEBUG) console.debug('%c🌱 model.is.isSupported: true', ccm.darkgreen, model.name, model.file)
    // if (debug || DEBUG) console.debug(`%c======================================`, ccm.darkgreen)
    
    
    if (model.is.isObject3D) {

      // const OBJModel = ({ file, textureFile, ...props }) => {
      //   const obj = useLoader(OBJLoader, file)
      //   const texture = useTexture(textureFile)

      //   useEffect(() => {
      //     obj.traverse(child => {
      //       if (child.isMesh) child.material.map = texture
      //     })
      //   }, [obj])

      //   return <primitive object={obj} {...props} />
      // }

      // Which can be used with something like

      // <OBJModel file='./a.obj' textureFile='./a.png' position-z={10} />

      // ** FBX
      if (model.is.isFBX) {
        model.type = 'fbx'
        // const { nodes, animations } = useFBX(model.file)
        // const fbx = useFBX(model.file)
        const fbx = useLoader(FBXLoader, model.file, loader => {
          loader.manager.addHandler(/\.tga$/i, new TGALoader())
          // loader.manager.addHandler(/\.png$/i, new TextureLoader())
        })
        if (debug || DEBUG) console.debug('%c📐 FBX NODES: fbx', ccm.green, model.name, fbx)
        // if (debug || DEBUG) console.debug(`%c======================================`, ccm.darkgreen)
        if (fbx) {
          // ** NODES
          // model.node = fbx
          model.nodes = fbx
          // if (debug || DEBUG) console.debug('RETURN ONLY NODE AS NODES: true', model.nodes)

          if (model.texture) {
            if (debug || DEBUG) console.debug(`%c LOADING TEXTURE ...`, ccm.orangeAlert, model.texture)
            let texture = useTexture(TextureLoader, model.texture, loader => {
              loader.manager.addHandler(/\.tga$/i, new TGALoader())
              // loader.manager.addHandler(/\.png$/i, new TextureLoader())
            })
            if (debug || DEBUG) console.debug(`%c TEXTURE`, ccm.orangeAlert, texture)
          }

          // ** ANIMATIONS
          if (fbx.animations) {
            if (debug || DEBUG) console.debug('%c FBX animations', ccm.orangeAlert, fbx.animations)
            // Extract animation actions
            const { ref, mixer, actions, names, clips } = useAnimations(fbx.animations)
            // if (debug || DEBUG) console.debug('FBX useAnimations', ref, mixer, actions, names, clips)
            model.ani.ref = ref
            model.ani.mixer = mixer
            model.ani.actions = actions
            model.ani.names = names
            model.ani.clips = clips
          }
        }
      }


      // ** GLTF
      else if (model.is.isGLTF) {
        model.type = 'gltf'
        // nodes[] is an array of all the meshes
        // file is cached/memoized; it only gets loaded and parsed once
        // const gltf = useGLTF(model.file)
        const gltf = useLoader(GLTFLoader, model.file) // , loader => {
          // loader.manager.addHandler(/\.tga$/i, new TGALoader())
        // })
        // if (debug || DEBUG) console.debug('%c📐 GLB NODES: gltf', ccm.greenAlert, model.name, gltf)
        // if (debug || DEBUG) console.debug(`%c======================================`, ccm.darkgreen)
        if (gltf) {
          // ** NODES
          // if (gltf.nodes?.RootNode) {
          //   model.nodes = gltf.nodes.RootNode.children
          //   if (debug || DEBUG) console.debug('%c📐 RETURN RootNode CHILDREN NODES: true', ccm.orangeAlert, model.name, model.nodes)
          //   if (debug || DEBUG) console.debug(`%c======================================`, ccm.orange)
          // }
          // else if (model.nodes[model.name]) {
          //   model.nodes[model.name] = gltf[model.name]
          //   if (debug || DEBUG) console.debug('%c📐 RETURN ONE NODE: true', ccm.orangeAlert, model.name, model.nodes[model.name])
          //   if (debug || DEBUG) console.debug(`%c======================================`, ccm.orange)
          // }
          // else
          if (gltf.nodes) {
            // let gltfAsArray = new Array()
            // gltfAsArray.push([...Array(gltf.nodes)])
            // for (const [key, value] of Object.entries(gltf.nodes))  {
            //   if (debug || DEBUG) console.debug(`key: ${key}, value: ${value}`)
            //   gltfAsArray.push([key: value])
            // }
            // let gltfObjectParent = gltf
            let gltfObject = gltf // gltf | gltf.nodes
            model.nodes = gltfObject
            // let gltfObjectNodes = gltf.nodes // gltf | gltf.nodes
            // let gltfObjectKeys = new Array()
            // let gltfAsArray = new Array()
            // let gltfObjectCount = 48 // maximum to return
            // gltfObjectKeys = Object.keys(gltfObject) // returns all keys [5446]
            // // if (debug || DEBUG) console.debug('%c📐 gltfObjectKeys', ccm.orangeAlert, gltfObjectKeys)
            // let gltfObjectectAsArray = gltfObjectKeys.slice(0, gltfObjectCount).map((key, index) => {
            //   // let kvpair = {}
            //   // // kvpair[key] = gltfObject[key]
            //   // kvpair[index] = gltfObject[key]
            //   // return kvpair
            //   return gltfObject[key] // the value of the object at this key
            // })
            // gltfAsArray = objectAsArray
            // // model.nodes = gltfAsArray
            // // if (debug || DEBUG) console.debug('%c📐 gltfAsArray', ccm.orangeAlert, gltfAsArray)
            // // model.nodes = gltf.nodes
            // // model.nodes = gltf
            if (debug || DEBUG) console.debug('%c📐 RETURN ALL GLTF NODES: default', ccm.green, model.name, model.nodes)
            // if (debug || DEBUG) console.debug(`%c======================================`, ccm.darkgreen)
          }
          else {
            model.nodes = gltf.nodes // []
            if (debug || DEBUG) console.debug('%c📐 RETURN ALL/BLANK NODES: default', ccm.redAlert, model.name, model.nodes)
            // if (debug || DEBUG) console.debug(`%c======================================`, ccm.red)
          }

          // ** ANIMATIONS
          if (gltf.animations) {
            if (debug || DEBUG) console.debug('%c GLTF animations', ccm.orangeAlert, gltf.animations)
            // Extract animation actions
            const { ref, mixer, actions, names, clips } = useAnimations(gltf.animations)
            // if (debug || DEBUG) console.debug('GLTF useAnimations', ref, mixer, actions, names, clips)
            model.ani.ref = ref
            model.ani.mixer = mixer
            model.ani.actions = actions
            model.ani.names = names
            model.ani.clips = clips
          }
        }
      }


      // ** OBJ
      else if (model.is.isOBJ) {
        model.type = 'obj'
        // const nodes = useOBJ(model.file)
        const obj = new OBJLoader().load(model.file)
        if (debug || DEBUG) console.debug('%c🌱 OBJ NODES: obj', ccm.orange, obj)
        // if (debug || DEBUG) console.debug(`%c======================================`, ccm.orange)
        if (obj) {
          model.nodes = obj
          // if (debug || DEBUG) console.debug('RETURN ONLY NODE AS NODES: true')
        }
      }

      // finally, decide if ready for _r3f canvas
      if (model.nodes && model.is.isFBX) {
        model.is.isReadyForCanvas = true // true | false
        if (debug || DEBUG) console.debug('%c✔️📐 THREED MODEL IS READY FOR CANVAS', ccm.greenAlert, model.name, model.file)
        // if (debug || DEBUG) console.debug(`%c==========================================`, ccm.greenAlert)
      }
      else if (model.nodes && model.is.isGLTF) {
        model.is.isReadyForCanvas = true // true | false
        if (debug || DEBUG) console.debug('%c✔️📐 THREED MODEL IS READY FOR CANVAS', ccm.orangeAlert, model.name, model.file)
        // if (debug || DEBUG) console.debug(`%c==========================================`, ccm.orangeAlert)
      }
      else { // if (model.nodes && model.is.isOBJ) {
        model.is.isReadyForCanvas = false
        if (debug || DEBUG) console.debug('%c✖️📐 THREED MODEL IS NOT READY FOR CANVAS', ccm.redAlert, model.name, model.file)
        // if (debug || DEBUG) console.debug(`%c==========================================`, ccm.redAlert)
      }
    }
    // if (debug || DEBUG) console.debug(`%c======================================`, ccm.black)
  } else {
    if (debug || DEBUG) console.debug('%c✖️📐 MODEL.is.isSupported: false', ccm.redAlert, model.name)
    // if (debug || DEBUG) console.debug(`%c==========================================`, ccm.red)
  }
  if (debug || DEBUG) console.debug('%cmodel', ccm.greenAlert, model)
  // if (debug || DEBUG) console.debug(`%c======================================`, ccm.greenAlert)

  const [index, setIndex] = useState(0)
  // if (debug || DEBUG) console.debug(`%c======================================`, ccm.greenAlert)

  // ==========================================
  // ==========================================
  // ==========================================
  // ** HOVER STATE (w support for ANIMATIONS ...)

  // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  // const [isHovered, setIsHovered] = useState(false)
  // useCursor(isHovered)

  // // Animate the selection halo
  // const { color, scale } = useSpring({
  //   scale: isHovered ? [1.15, 1.15, 1] : [1, 1, 1],
  //   color: isHovered ? '#ff6d6d' : '#569AFF',
  // })

  // // Change cursor on hover-state
  // useEffect(
  //   () => void (document.body.style.cursor = isHovered ? 'pointer' : 'auto'), [isHovered])

  // ==========================================
  // ==========================================
  // ==========================================
  // ** ANIMATIONS

  // let index = 0 // testing
  // if (debug || DEBUG) console.debug('index', index)

  // Change animation when the index changes
  useEffect(() => {
    if (model.ani.actions != undefined
      && model.ani.names != undefined
      && model.ani.names[index] != undefined
      // && model.ani.actions[model.ani.names[index]] != undefined
    ) {
      if (debug || DEBUG) console.debug('index', index)
      if (debug || DEBUG) console.debug('model', model)
      // if (debug || DEBUG) console.debug('model.ani', model.ani)
      // if (debug || DEBUG) console.debug('model.ani.actions', model.ani.actions)
      // if (debug || DEBUG) console.debug('model.ani.names', model.ani.names)
      // if (debug || DEBUG) console.debug('model.ani.names[index]', model.ani.names[index])
      // if (debug || DEBUG) console.debug('model.ani.actions[model.ani.names[index]]', model.ani.actions[model.ani.names[index]])
      // if (debug || DEBUG) console.debug('model.ani.actions["Take 001"]', model.ani.actions["Take 001"]))
      if (debug || DEBUG) console.debug('Object.values(model.ani.actions)', Object.values(model.ani.actions))
      if (debug || DEBUG) console.debug('Object.keys(model.ani.actions)', Object.keys(model.ani.actions))
      // if (debug || DEBUG) console.debug('Object.keys(model.ani.actions)[index]', Object.keys(model.ani.actions)[index])
      let theAnimation = Object.keys(model.ani.actions)[index]
      // if (model.ani.actions[model.ani.names[index]]) {
        // if (debug || DEBUG) console.debug('model.ani.actions[model.ani.names[index]]', model.ani.actions[model.ani.names[index]])
      if (theAnimation) {
        if (debug || DEBUG) console.debug('Object.keys(model.ani.actions)[index] EXISTS', theAnimation)
        if (debug || DEBUG) console.debug('model.ani.actions[theAnimation]', model.ani.actions[theAnimation])

        try {
          // model.ani.actions[model.ani.names[index]]
          // model.ani.actions[Object.keys(model.ani.actions)[index]]
          // model.ani.actions[theAnimation]
          // theAnimation
          // ** Reset and fade in animation after an index has been changed
          //   .reset()
          //   .fadeIn(0.5)
          // Play the animation
          //   .play()

        } catch (ERROR) {
          console.error('ERROR: theAnimation.play()', ERROR)
        }

        // In the clean-up phase, fade it out
        // (page route may have changed)
        // return () => {
        //   try {
        //     model.ani.actions[model.ani.names[index]]
        //       .fadeOut(0.5)
        //   } catch (ERROR) {
        //     console.error('ERROR: model.ani.actions[model.ani.names[index]]', ERROR)
        //   }
        // }
      }
    }
    // return undefined
  // }, [index, model.ani.actions, model.ani.names])
  }, [index])
  // }, [])

  // ==========================================
  // ANIMATIONS (FOR ALL MODELS !!!)

  const getThreeDClock = useFrame(({ clock }) => {
    const ThreeDClock = clock
    // const a = clock.getElapsedTime()
    // model.ref.current.rotation.z = a
    return ThreeDClock
  })

  // ==========================================
  // ** RETURN JSX

  if (model.is.isReadyForCanvas) {
    // if (debug || DEBUG) console.debug(`%c==========================================`, ccm.blue)
    // if (debug || DEBUG) console.debug(`%c✔️📐 DRAW MODEL ${model.type}`, ccm.blue, model.name) // , model
    if (debug || DEBUG) console.debug(`%c✔️📐 DRAW MODEL.nodes: ${model.type}`, ccm.blue, model.name, model.nodes)
    // if (debug || DEBUG) console.debug(`%c==========================================`, ccm.blue)


    // ** FBX
    // return FBX node
    if (model.is.isFBX) {
      return (
        <group
          key={model.group.group_id} // newUUID()
          // ref={model.ref}
          // ref={model.ani.ref}
          ref={model.ani.ref ? model.ani.ref : model.ref}
          position={model.group.group_position}
          rotation={model.group.group_rotation}
          scale={model.group.group_scale}
          // rotationX
          dispose={null}
        >
          <primitive
            name={model.name ? model.name : 'no name'}
            // ref={model.ref}
            // ref={model.ani.ref}
            // ref={model.ani.ref ? model.ani.ref : model.ref}
            object={model.nodes}
            dispose={null}

            map={model.texture}
          />
        </group>
      )
    }


    // ** GLTF
    // return GLTF node
    else if (model.is.isGLTF) {
      // if (debug || DEBUG) console.debug('GLTF: model.nodes', model.name, model.nodes)
      // if (debug || DEBUG) console.debug('GLTF: model.nodes.scene', model.name, model.nodes.scene)
      return (
        // LOOP OVER NODE ARRAY TO RETURN MULTIPLE MESHES ([5000])
        <group
          key={model.group.group_id} // newUUID()
          // ref={model.ref}
          // ref={model.ani.ref}
          ref={model.ani.ref ? model.ani.ref : model.ref}
          position={model.group.group_position}
          rotation={model.group.group_rotation}
          scale={model.group.group_scale}
          dispose={null}
        >
          {/* const Model = () => {
            const gltf = useLoader(GLTFLoader, "./bomb.gltf");
            return <primitive object={gltf.scene} scale={0.4} />;
          }; */}
          <primitive
            name={model.name ? model.name : 'no name'}
            // ref={model.ref}
            // ref={model.ani.ref}
            // ref={model.ani.ref ? model.ani.ref : model.ref}
            object={model.nodes.scene} // gltf.scene
            dispose={null}
            // scale={1.0}

            map={model.texture}
          />
          {/* {model.nodes.map((_model_node, index) => (
            <mesh
              key={model.group.group_id + '-' + index} // newUUID() | index
              // name={_model_node.name}
              // ref={_model_node.ref}
              // // Click sets the mesh as the new target
              // onClick={(e) => (e.stopPropagation(), (modelVState.current = _model_node.name))}
              // // If a click happened but this mesh wasn't hit we null out the target,
              // // This works because missed pointers fire before the actual hits
              // onPointerMissed={(e) => e.type === 'click' && (modelVState.current = null)}
              // // Right click cycles through the transform ThreeD.actionModes
              // onContextMenu={(e) =>
              //   snap.current === _model_node.name && (e.stopPropagation(), (modelVState.mode = (snap.mode + 1) % ThreeD.actionModes.length))
              // }
              // onPointerOver={(e) => (e.stopPropagation(), setIsHovered(true))}
              // onPointerOut={(e) => setIsHovered(false)}
              geometry={_model_node.geometry}
              material={_model_node.material}
              // material-color={snap.current === _model_node.name ? '#ff7070' : '#ababab'}
              // {...props}
              dispose={null}
            />
          ))} */}
        </group>
      )
    }


    // ** OBJ
    // return OBJ node
    else if (model.is.isOBJ) {
      return (
        <mesh
          key={newUUID()}
          // ref={model.ref}
          // ref={model.ani.ref}
          ref={model.ani.ref ? model.ani.ref : model.ref}
          dispose={null}

          map={model.texture}
        />
      )
    }
  }


  // DEFAULT return mesh
  // 'error sphere' mesh object, with original model.name and props
  else { // !model.is.isReadyForCanvas
    return (
      <mesh
        key={newUUID()}
        name={model.name}
        // ref={model.ref}
        // ref={model.ani.ref}
        ref={model.ani.ref ? model.ani.ref : model.ref}
        // // Click sets the mesh as the new target
        // onClick={(e) => (
        //   e.stopPropagation(),
        //   (modelVState.current = model.name),
        //   if (debug || DEBUG) console.debug('modelVState.current', model.name),
        //   if (debug || DEBUG) console.debug('snap.current', snap.current)
        // )}
        // // If a click happened but this mesh wasn't hit we null out the target,
        // // This works because missed pointers fire before the actual hits
        // onPointerMissed={(e) => (
        //   e.type === 'click',
        //   (modelVState.current = null),
        //   if (debug || DEBUG) console.debug('modelVState.current', null),
        //   if (debug || DEBUG) console.debug('snap.current', snap.current)
        // )}
        // // Right click cycles through the transform ThreeD.actionModes
        // onContextMenu={(e) =>
        //   snap.current === model.name &&
        //   (e.stopPropagation(),
        //   (modelVState.mode = (snap.mode + 1) % ThreeD.actionModes.length),
        //   if (debug || DEBUG) console.debug('modelVState.mode', modelVState.mode),
        //   if (debug || DEBUG) console.debug('snap.current', snap.current))
        // }
        // onPointerOver={(e) => (e.stopPropagation(), setIsHovered(true))}
        // onPointerOut={(e) => setIsHovered(false)}
        position={[-4, 0, 4]} // put in front of center:center, for easier viewing
        dispose={null}
      >
        <sphereGeometry args={[3, 96]} />
        <meshPhysicalMaterial
          color={model.is.isGLTF ? 'darkRed' : model.is.isOBJ ? 'darkOrange' : model.is.isFBX ? 'darkGreen' : 'darkPink'}
        />
      </mesh>
    )
  }
}

// Controls
function ThreeDControls() {
  // **
  // get Reactive state on each model (using valtio)
  const modelVState = proxy({ current: null, mode: 0 })
  // get Apollo Stores state
  // const storeState = undefined
  const sceneState = useThree((sceneState) => sceneState.scene)
  if (sceneState) {
    if (debug || DEBUG) if (debug || DEBUG) console.debug('%c sceneState to load to ThreeDCanvas', ccm.yellow, sceneState)
    if (sceneState.length) {
      // if (debug) if (debug || DEBUG) console.debug('sceneState.length', sceneState.length)
    }
  }

  // Get 'snap' notified on changes to modelVState + sceneState
  const snap = useSnapshot(modelVState)

  return (
    <group>
      {/* As of drei@7.13 transform-controls can refer to the target by children, or the object prop */}
      {snap.current && (
        <TransformControls
          object={sceneState.getObjectByName(snap.current)}
          mode={ThreeD.actionModes[snap.mode]}
        />
      )}
    </group>
  )
}


// ** OLD JOYSTICK + ANIMATIONS ************************

// let joystick = new JoyStick({
//   onMove: playerControl,
//   game: container
// })

/** ANIMATE + RENDER (continuous rendering) ******************************************** */

// let animate = function () {

//   const dt = getThreeDClock.getDelta()
//   // watchPointer(camera, plane.children)
//   // controls.update()
//   // TWEEN.update()

//   requestAnimationFrame(animate)

//   if ( params.ANIMATE ) {
//     // plane.rotation.x += 0.002
//     // plane.rotation.y += 0.002
//     plane.rotation.z -= 0.0007
//   }

//   /** PLAYER CHARACTER */
//   if ( player.mixer !== undefined ) {
//     player.mixer.update(dt)
//   }

//   if ( player.action == "Walking" ) {
//     const elapsedTime = Date.now() - player.actionTime
//     if ( elapsedTime > 2000 && player.move.forward > 0.7 ){
//       setAction("Running")
//     }
//   }

//   if ( player.move !== undefined ) {
//     movePlayer(dt)
//   }

//   if ( player.cameras != undefined && player.cameras.active != undefined ) {
//     camera.position.lerp( player.cameras.active.getWorldPosition(new THREE.Vector3()), 0.05 )
//     const pos = player.object.position.clone()
//     pos.y += 200
//     camera.lookAt(pos)
//   }

//       if (directionalLight != undefined){
//           // directionalLight.position.x = player.object.position.x
//           // directionalLight.position.y = player.object.position.y + 200
//           // directionalLight.position.z = player.object.position.z + 100
//           // directionalLight.target = player.object
//       }

//   renderer.render(scene, camera)
// }

// animate()


// let loadNextAnim = function (loader) {
//   let anim = anims.pop()
//   // if (debug || DEBUG) console.debug("-----------------------")
//   // if (debug || DEBUG) console.debug("anim-------------------")
//   // if (debug || DEBUG) console.debug(anim)
//   // if (debug || DEBUG) console.debug("-----------------------")
//   loader.load( `${params.assetsPath}fbx/anims2/${anim}.fbx`, function(object) {
//     // if (debug || DEBUG) console.debug("-----------------------")
//     // if (debug || DEBUG) console.debug("object-----------------")
//     // if (debug || DEBUG) console.debug(object)
//     // if (debug || DEBUG) console.debug("-----------------------")
//     animations[anim] = object.animations[0]
//     if (anims.length > 0){
//       // if (debug || DEBUG) console.debug("-----------------------")
//       // if (debug || DEBUG) console.debug("anims.length-----------")
//       // if (debug || DEBUG) console.debug(anims.length)
//       // if (debug || DEBUG) console.debug("-----------------------")
//       // if (debug || DEBUG) console.debug("-----------------------")
//       // if (debug || DEBUG) console.debug("getAction()-----------")
//       // if (debug || DEBUG) console.debug(getAction())
//       // if (debug || DEBUG) console.debug("-----------------------")
//       // if (debug || DEBUG) console.debug("player.action----------")
//       // if (debug || DEBUG) console.debug(player.action)
//       // if (debug || DEBUG) console.debug("-----------------------")
//       loadNextAnim(loader)
//     }
//     else {
//       // if (debug || DEBUG) console.debug("-----------------------")
//       // if (debug || DEBUG) console.debug("anims.length = 0-------")
//       // if (debug || DEBUG) console.debug(anims.length)
//       // if (debug || DEBUG) console.debug("-----------------------")
//       anims = []
//       setAction("Idle")
//       animate()
//     }
//   })
// }

// //return scene
// // }

// function setAction(name) {
// const action = player.mixer.clipAction( animations[name] )
// action.time = 0
// if (debug || DEBUG) console.debug("-----------------------")
// if (debug || DEBUG) console.debug("animations-----------------")
// if (debug || DEBUG) console.debug(animations)
// if (debug || DEBUG) console.debug("-----------------------")
// player.mixer.stopAllAction()
// player.action = name
// player.actionTime = Date.now()
// // if (debug || DEBUG) console.debug("-----------------------")
// // if (debug || DEBUG) console.debug("player-----------------")
// // if (debug || DEBUG) console.debug(player)
// // if (debug || DEBUG) console.debug("-----------------------")

// action.fadeIn(0.5)
// action.play()
// }

// function getAction() {
// if (player === undefined || player.action === undefined) {
//   return "doesn't exist yet"
// }
// return player.action
// }

// function toggleAnimation() {
// if ( player.action == "Idle" ) {
//   setAction("Pointing Gesture")
// }
// else {
//   setAction("Idle")
// }
// }

// function movePlayer1(dt) {
// // if (debug || DEBUG) console.debug("-------------------------")
// // if (debug || DEBUG) console.debug("player.move.forward------")
// // if (debug || DEBUG) console.debug(player.move.forward)
// // if (debug || DEBUG) console.debug("-------------------------")
// if ( player.move.forward > 0 ) {
//   const speed = ( player.action == "Running" ) ? 24 : 8
//   player.object.translateZ( dt * speed )
// }
// else if ( player.move.forward < 0 ) {
//   player.object.translateZ( -dt * 2)
// }
// player.object.rotateY( player.move.turn * dt )
// }

// function movePlayer(dt){
// const pos = player.object.position.clone()
// pos.y += 60
// let dir = new THREE.Vector3()
// player.object.getWorldDirection(dir)
// if (player.move.forward<0) dir.negate()
// let raycaster = new THREE.Raycaster(pos, dir)
// let blocked = false
// const colliders = params.colliders

// // if (colliders!==undefined){
// // 	const intersect = raycaster.intersectObjects(colliders)
// // 	if (intersect.length>0){
// // 		if (intersect[0].distance<50) blocked = true
// // 	}
// // }

// if (!blocked){
//   if (player.move.forward>0){
//     const speed = (player.action=="Running") ? 24 : 8
//     player.object.translateZ(dt*speed)
//   }
//   else if ( player.move.forward < 0 ) {
//     player.object.translateZ(-dt*2)
//   }
// }

// /*
// if (colliders!==undefined){
//   //cast left
//   dir.set(-1,0,0)
//   dir.applyMatrix4(player.object.matrix)
//   dir.normalize()
//   raycaster = new THREE.Raycaster(pos, dir)

//   let intersect = raycaster.intersectObjects(colliders)
//   if (intersect.length>0){
//     if (intersect[0].distance<50) player.object.translateX(100-intersect[0].distance)
//   }

//   //cast right
//   dir.set(1,0,0)
//   dir.applyMatrix4(player.object.matrix)
//   dir.normalize()
//   raycaster = new THREE.Raycaster(pos, dir)

//   intersect = raycaster.intersectObjects(colliders)
//   if (intersect.length>0){
//     if (intersect[0].distance<50) player.object.translateX(intersect[0].distance-100)
//   }

//   //cast down
//   dir.set(0,-1,0)
//   pos.y += 200
//   raycaster = new THREE.Raycaster(pos, dir)
//   const gravity = 30

//   intersect = raycaster.intersectObjects(colliders)
//   if (intersect.length>0){
//     const targetY = pos.y - intersect[0].distance
//     if (targetY > player.object.position.y){
//       //Going up
//       player.object.position.y = 0.8 * player.object.position.y + 0.2 * targetY
//       player.velocityY = 0
//     }else if (targetY < player.object.position.y){
//       //Falling
//       if (player.velocityY==undefined) player.velocityY = 0
//       player.velocityY += dt * gravity
//       player.object.position.y -= player.velocityY
//       if (player.object.position.y < targetY){
//         player.velocityY = 0
//         player.object.position.y = targetY
//       }
//     }
//   }else if (player.object.position.y>0){
//     if (player.velocityY==undefined) player.velocityY = 0
//     player.velocityY += dt * gravity
//     player.object.position.y -= player.velocityY
//     if (player.object.position.y < 0){
//       player.velocityY = 0
//       player.object.position.y = 0
//     }
//   }
// }
// */

// player.object.rotateY(player.move.turn*dt)
// }


// function playerControl(forward, turn) {

// turn = -turn

// if ( forward > 0.2 ) {
//       if ( player.action != "Walking" && player.action != "Running" ) {
//     setAction("Walking")
//   }
// }
// else if ( forward < -0.2 ) {
//       if ( player.action != "Walking Backwards" ) {
//     setAction("Walking Backwards")
//   }
// }
// else {
//       forward = 0
//       if ( Math.abs(turn) > 0.05 ) {
//           if ( player.action != "Left Turn" ) {
//       setAction("Left Turn")
//     }
//   }
//   else if ( player.action != "Idle" ) {
//           setAction("Idle")
//   }
//   // else {
//   // 	setAction("Idle")
//   // }
//   }

//   // if ( forward == 0 && turn == 0 ) {
//   //     player.move = {}
// // }
// // else {
//       player.move = { forward, turn }
//   // }
// }

// ===========================================
// EXAMPLE -- LOOP OVER ARRAY OF NODES TO CREATE INDIVIDUAL MODELS
// **
// interface IThreeD {
//   name: string
//   threedId: number
// }
// export const Elements = (props: { threeds: Array<IThreeD> }) => {
//   return (
//     <>
//       {props.threeds.map((_threed: IThreeD) => <h1>{_threed.name} | {_threed.threedId}</h1>)}
//     </>
//   )
// }
// export default const ElementCaller = () => {
//   var threedsArray: IThreeD[] = []
//   return (<Elements threeds={threedsArray} />)
// }

// ===========================================
// **
const ThreeDModels = ({ threeds }) => {
  // **
  if (debug || DEBUG) console.debug(`%c======================================`, ccm.darkredAlert)
  if (debug || DEBUG) console.debug('%c🌱 threeds[i]', ccm.darkredAlert, threeds)
  if (debug || DEBUG) console.debug('%c🌱 threeds ==========================', ccm.darkredAlert)
  if (debug || DEBUG) console.debug(`%c======================================`, ccm.darkredAlert)
  // **

  // ** TESTING
  // return <CoffeeCup />

  // DEFAULT 0, RETURN BLANK JSX (no need to render this component)
  if (!threeds.length) {
    // return <></>
    return (
      <Html center>
        {/* <Spinner /> */}
        <Loader />
      </Html>
    )
  }

  // RENDER THIS COMPONENT
  return (
    <group
      key='threed_models'
      position={[ 8, -1, 0 ]}
    >
      {/* <CoffeeCup /> */}
      {/* <ThreeDControls /> */}
      {/* THREED: LOOP OVER NODES FOR EACH FILE = MODEL */}
      {/* <Suspense fallback={null}> */}
      <>
        {threeds.map((_threed, index) => {
          if (debug || DEBUG) console.debug('_threed', index + ': ', _threed)
          // if (debug || DEBUG) console.debug(`%c======================================`, ccm.red)
          const threed = new ThreeD()
          threed.name = _threed.title
          threed.data = _threed
          // threed.group = threed.group
          threed.group.group_position = [_threed.positionX, _threed.positionY, _threed.positionZ]
          threed.group.group_rotation = [_threed.rotationX, _threed.rotationY, _threed.rotationZ]
          threed.group.group_scale = [_threed.scaleX, _threed.scaleY, _threed.scaleZ]
          return (
            <group
              // key={newUUID()}
              // key={index}
              key={threed.group.group_id + '_' + index + '_' + newUUID()}
              // ref={ref}
              // ref={threed.group.group_ref}
              // position={threed.group.group_position}
              // rotation={threed.group.group_rotation}
              // scale={threed.group.group_scale}
              // quaternion={threed.group.group_quaternion}
            >
              { _threed.files.nodes &&
                _threed.files.nodes.map((_file, index) => {
                if (debug || DEBUG) console.debug('%c MODEL _file', ccm.redAlert, index + ': ', _file)
                // if (debug || DEBUG) console.debug(`%c ================================`, ccm.redAlert)

                // const threed = new ThreeD()
                threed.name = _file.title
                threed.file = _file
                // threed.group = threed.group

                return (
                  <RigidBody 
                    type='fixed'
                    key={'RigidBody' + index + '_' + newUUID()}
                  >
                    <Model
                      // key={_file.fileId} // no, duplicates
                      // key={newUUID()}
                      // key={index}
                      // key={index + '_' + newUUID()}
                      key={threed.name + '_' + index + '_' + newUUID()}
                      threed={threed}
                    />
                  </RigidBody>
                )
              })}
            </group>
          )
        })}
      </>
      {/* </Suspense> */}
    </group>
  )
}

// const ThreeDModel_UseClient = dynamic(() => Promise.resolve(ThreeDModels), {
//   ssr: false
// })
// export default ThreeDModel_UseClient
export default ThreeDModels
