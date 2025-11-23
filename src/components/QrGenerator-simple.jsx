import { useState, useRef } from 'react'
import QRCode from 'react-qr-code'
import { toPng } from 'html-to-image'

function QrGenerator() {
  const [value, setValue] = useState('')
  const [generatedValue, setGeneratedValue] = useState('https://example.com')
  const [options, setOptions] = useState({
    size: 256,
    fgColor: '#000000',
    bgColor: '#FFFFFF'
  })
  const qrRef = useRef(null)

  const handleGenerate = () => {
    if (value.trim()) {
      setGeneratedValue(value)
    }
  }

  const handleOptionChange = (option, newValue) => {
    setOptions(prev => ({
      ...prev,
      [option]: newValue
    }))
  }

  const handleDownloadPng = async () => {
    if (qrRef.current === null) {
      return
    }

    try {
      const dataUrl = await toPng(qrRef.current, {
        cacheBust: true,
        backgroundColor: options.bgColor,
      })
      
      const link = document.createElement('a')
      link.download = `qrcode-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Erreur lors du téléchargement PNG:', err)
    }
  }

  const handleDownloadSvg = () => {
    if (qrRef.current === null) {
      return
    }

    try {
      const svgElement = qrRef.current.querySelector('svg')
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement)
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
        const svgUrl = URL.createObjectURL(svgBlob)
        
        const link = document.createElement('a')
        link.download = `qrcode-${Date.now()}.svg`
        link.href = svgUrl
        link.click()
        
        URL.revokeObjectURL(svgUrl)
      }
    } catch (err) {
      console.error('Erreur lors du téléchargement SVG:', err)
    }
  }

  return (
    <div className="qr-generator">
      <div className="qr-content">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="qr-input">Entrez votre URL ou texte :</label>
            <input
              id="qr-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com ou votre texte..."
            />
          </div>
          
          <div className="options-section">
            <h3>Options de personnalisation</h3>
            
            <div className="options-grid">
              <div className="form-group">
                <label htmlFor="size-select">Taille :</label>
                <select
                  id="size-select"
                  value={options.size}
                  onChange={(e) => handleOptionChange('size', parseInt(e.target.value))}
                >
                  <option value={128}>Petit (128px)</option>
                  <option value={256}>Moyen (256px)</option>
                  <option value={512}>Grand (512px)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="fg-color">Couleur du QR :</label>
                <input
                  id="fg-color"
                  type="color"
                  value={options.fgColor}
                  onChange={(e) => handleOptionChange('fgColor', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bg-color">Couleur de fond :</label>
                <input
                  id="bg-color"
                  type="color"
                  value={options.bgColor}
                  onChange={(e) => handleOptionChange('bgColor', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="qr-display">
          {generatedValue ? (
            <div className="qr-result">
              <div className="qr-content-wrapper">
                <p>QR Code pour : <strong>{generatedValue}</strong></p>
                <div className="qr-code-container" ref={qrRef}>
                  <QRCode
                    value={generatedValue}
                    size={options.size}
                    fgColor={options.fgColor}
                    bgColor={options.bgColor}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="qr-placeholder">
              Entrez du texte et cliquez sur "Générer" pour voir le QR Code
            </div>
          )}
        </div>
      </div>
      
      <div className="action-buttons">
        <button 
          onClick={handleGenerate}
          disabled={!value.trim()}
          className="generate-btn primary"
        >
          Générer le QR Code
        </button>
        {generatedValue && (
          <>
            <button onClick={handleDownloadPng} className="download-btn">
              Télécharger PNG
            </button>
            <button onClick={handleDownloadSvg} className="download-btn svg-btn">
              Télécharger SVG
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default QrGenerator
