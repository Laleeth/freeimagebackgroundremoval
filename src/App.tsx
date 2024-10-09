import React, { useState } from 'react'
import { Upload, Image as ImageIcon, Trash2 } from 'lucide-react'
import { removeBackground } from '@imgly/background-removal'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
        setProcessedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveBackground = async () => {
    if (image) {
      setIsProcessing(true)
      try {
        const blob = await (await fetch(image)).blob()
        const result = await removeBackground(blob)
        setProcessedImage(URL.createObjectURL(result))
      } catch (error) {
        console.error('Background removal failed:', error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleReset = () => {
    setImage(null)
    setProcessedImage(null)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-8">Image Background Removal</h1>
        
        {!image && (
          <div className="border-4 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-semibold text-gray-900">
                Upload an image
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        {image && !processedImage && (
          <div className="mb-8">
            <img src={image} alt="Original" className="max-w-full h-auto mb-4" />
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Remove Background'}
            </button>
          </div>
        )}

        {processedImage && (
          <div className="mb-8">
            <img src={processedImage} alt="Processed" className="max-w-full h-auto mb-4" />
            <a
              href={processedImage}
              download="processed_image.png"
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition mr-4"
            >
              Download
            </a>
            <button
              onClick={handleReset}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Reset
            </button>
          </div>
        )}

        <div className="flex justify-center space-x-4 mt-8">
          <div className="text-center">
            <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-1 block text-sm text-gray-500">Upload</span>
          </div>
          <div className="text-center">
            <Trash2 className="mx-auto h-8 w-8 text-gray-400" />
            <span className="mt-1 block text-sm text-gray-500">Remove BG</span>
          </div>
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="mt-1 block text-sm text-gray-500">Download</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App