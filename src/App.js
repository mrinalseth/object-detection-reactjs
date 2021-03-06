import React, { useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as cocossd from '@tensorflow-models/coco-ssd'
import Webcam from 'react-webcam'
import { drawRect } from './utilities'

const App = () => {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const runCoco = async() => {
    // Load network into our model
    const net = await cocossd.load()

    setInterval(() => {
      detect(net)
    }, 10)
  }

  const detect = async(net) => {
    // check if data is available or not(from webcam)
    if (typeof webcamRef.current !== "undefined" &&
    webcamRef.current !== null &&
    webcamRef.current.video.readyState === 4) {
      // get video property
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // set video height width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // make detection
      const obj = await net.detect(video)
      console.log(obj)

      const ctx = canvasRef.current.getContext("2d")
      
      drawRect(obj, ctx)
    }
  }

  useEffect(() => {
    runCoco()
  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      </header>
    </div>
  )
}

export default App