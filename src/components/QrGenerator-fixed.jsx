import { useState, useRef, useEffect } from 'react'
import QRCodeStyling from 'qr-code-styling'

function QrGenerator() {
  const [activeTab, setActiveTab] = useState('url')
  const [formData, setFormData] = useState({
    url: '',
    wifi: { ssid: '', password: '', security: 'WPA' },
    email: { email: '', subject: '', body: '' },
    sms: { phone: '', message: '' },
    tel: { phone: '' },
    vcard: { firstName: '', lastName: '', phone: '', email: '', organization: '' }
  })
  const [generatedValue, setGeneratedValue] = useState('https://example.com')
  const [options, setOptions] = useState({
    size: 256,
    fgColor: '#000000',
    bgColor: '#FFFFFF',
    dotsType: 'square',
    cornersSquareType: 'square',
    cornersDotType: 'square',
    frame: 'none',
    frameColor: '#000000',
    frameText: 'SCAN ME',
    gradientType: 'none',
    gradientColor1: '#000000',
    gradientColor2: '#007aff'
  })
  const qrRef = useRef(null)
  const qrCode = useRef(null)

  const generateQRContent = () => {
    switch (activeTab) {
      case 'url':
        return formData.url
      case 'wifi':
        return `WIFI:T:${formData.wifi.security};S:${formData.wifi.ssid};P:${formData.wifi.password};;`
      case 'email':
        return `mailto:${formData.email.email}?subject=${encodeURIComponent(formData.email.subject)}&body=${encodeURIComponent(formData.email.body)}`
      case 'sms':
        return `sms:${formData.sms.phone}?body=${encodeURIComponent(formData.sms.message)}`
      case 'tel':
        return `tel:${formData.tel.phone}`
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.vcard.firstName} ${formData.vcard.lastName}\nORG:${formData.vcard.organization}\nTEL:${formData.vcard.phone}\nEMAIL:${formData.vcard.email}\nEND:VCARD`
      default:
        return formData.url
    }
  }

  const handleGenerate = () => {
    const content = generateQRContent()
    if (content.trim()) {
      setGeneratedValue(content)
    }
  }

  const handleOptionChange = (option, newValue) => {
    setOptions(prev => ({
      ...prev,
      [option]: newValue
    }))
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }))
  }

  // Fonction pour créer la configuration des couleurs
  const getColorConfig = () => {
    if (options.gradientType === 'none') {
      return { color: options.fgColor }
    } else {
      return {
        gradient: {
          type: options.gradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: options.gradientColor1 },
            { offset: 1, color: options.gradientColor2 }
          ]
        }
      }
    }
  }

  // Initialiser le QR code
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: options.size,
      height: options.size,
      data: generatedValue,
      dotsOptions: {
        ...getColorConfig(),
        type: options.dotsType
      },
      backgroundOptions: {
        color: options.bgColor
      },
      cornersSquareOptions: {
        type: options.cornersSquareType,
        ...getColorConfig()
      },
      cornersDotOptions: {
        type: options.cornersDotType,
        ...getColorConfig()
      }
    })

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.current.append(qrRef.current)
    }
  }, [])

  // Mettre à jour le QR code quand les options ou le contenu changent
  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        width: options.size,
        height: options.size,
        data: generatedValue,
        dotsOptions: {
          ...getColorConfig(),
          type: options.dotsType
        },
        backgroundOptions: {
          color: options.bgColor
        },
        cornersSquareOptions: {
          type: options.cornersSquareType,
          ...getColorConfig()
        },
        cornersDotOptions: {
          type: options.cornersDotType,
          ...getColorConfig()
        }
      })
    }
  }, [generatedValue, options])

  const handleDownloadPng = async () => {
    if (qrCode.current === null) {
      return
    }

    try {
      await qrCode.current.download({
        name: `qrcode-${Date.now()}`,
        extension: 'png'
      })
    } catch (err) {
      console.error('Erreur lors du téléchargement PNG:', err)
    }
  }

  const handleDownloadSvg = async () => {
    if (qrCode.current === null) {
      return
    }

    try {
      await qrCode.current.download({
        name: `qrcode-${Date.now()}`,
        extension: 'svg'
      })
    } catch (err) {
      console.error('Erreur lors du téléchargement SVG:', err)
    }
  }

  return (
    <div className="qr-generator">
      <div className="qr-content">
        <div className="input-section">
          <div className="content-section">
            <h3>Type de contenu</h3>
            
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'url' ? 'active' : ''}`}
                onClick={() => setActiveTab('url')}
              >
                URL
              </button>
              <button 
                className={`tab ${activeTab === 'wifi' ? 'active' : ''}`}
                onClick={() => setActiveTab('wifi')}
              >
                WiFi
              </button>
              <button 
                className={`tab ${activeTab === 'email' ? 'active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                Email
              </button>
              <button 
                className={`tab ${activeTab === 'sms' ? 'active' : ''}`}
                onClick={() => setActiveTab('sms')}
              >
                SMS
              </button>
              <button 
                className={`tab ${activeTab === 'tel' ? 'active' : ''}`}
                onClick={() => setActiveTab('tel')}
              >
                Tel
              </button>
              <button 
                className={`tab ${activeTab === 'vcard' ? 'active' : ''}`}
                onClick={() => setActiveTab('vcard')}
              >
                vCard
              </button>
            </div>

            <div className="form-content">
              {activeTab === 'url' && (
                <div className="form-group">
                  <label htmlFor="url-input">URL :</label>
                  <input
                    id="url-input"
                    type="url"
                    value={formData.url}
                    onChange={(e) => handleFormChange('url', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              )}

              {activeTab === 'wifi' && (
                <>
                  <div className="form-group">
                    <label htmlFor="wifi-ssid">Nom du réseau (SSID) :</label>
                    <input
                      id="wifi-ssid"
                      type="text"
                      value={formData.wifi.ssid}
                      onChange={(e) => handleFormChange('ssid', e.target.value)}
                      placeholder="Mon WiFi"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="wifi-password">Mot de passe :</label>
                    <input
                      id="wifi-password"
                      type="password"
                      value={formData.wifi.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      placeholder="motdepasse123"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="wifi-security">Sécurité :</label>
                    <select
                      id="wifi-security"
                      value={formData.wifi.security}
                      onChange={(e) => handleFormChange('security', e.target.value)}
                    >
                      <option value="WPA">WPA/WPA2</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Aucune</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'email' && (
                <>
                  <div className="form-group">
                    <label htmlFor="email-address">Adresse email :</label>
                    <input
                      id="email-address"
                      type="email"
                      value={formData.email.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-subject">Sujet (optionnel) :</label>
                    <input
                      id="email-subject"
                      type="text"
                      value={formData.email.subject}
                      onChange={(e) => handleFormChange('subject', e.target.value)}
                      placeholder="Sujet du message"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email-body">Message (optionnel) :</label>
                    <textarea
                      id="email-body"
                      value={formData.email.body}
                      onChange={(e) => handleFormChange('body', e.target.value)}
                      placeholder="Votre message..."
                      rows="3"
                    />
                  </div>
                </>
              )}

              {activeTab === 'sms' && (
                <>
                  <div className="form-group">
                    <label htmlFor="sms-phone">Numéro de téléphone :</label>
                    <input
                      id="sms-phone"
                      type="tel"
                      value={formData.sms.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="+33123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="sms-message">Message :</label>
                    <textarea
                      id="sms-message"
                      value={formData.sms.message}
                      onChange={(e) => handleFormChange('message', e.target.value)}
                      placeholder="Votre message SMS..."
                      rows="3"
                    />
                  </div>
                </>
              )}

              {activeTab === 'tel' && (
                <div className="form-group">
                  <label htmlFor="tel-phone">Numéro de téléphone :</label>
                  <input
                    id="tel-phone"
                    type="tel"
                    value={formData.tel.phone}
                    onChange={(e) => handleFormChange('phone', e.target.value)}
                    placeholder="+33123456789"
                  />
                </div>
              )}

              {activeTab === 'vcard' && (
                <>
                  <div className="form-group">
                    <label htmlFor="vcard-firstname">Prénom :</label>
                    <input
                      id="vcard-firstname"
                      type="text"
                      value={formData.vcard.firstName}
                      onChange={(e) => handleFormChange('firstName', e.target.value)}
                      placeholder="Jean"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vcard-lastname">Nom :</label>
                    <input
                      id="vcard-lastname"
                      type="text"
                      value={formData.vcard.lastName}
                      onChange={(e) => handleFormChange('lastName', e.target.value)}
                      placeholder="Dupont"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vcard-phone">Téléphone :</label>
                    <input
                      id="vcard-phone"
                      type="tel"
                      value={formData.vcard.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      placeholder="+33123456789"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vcard-email">Email :</label>
                    <input
                      id="vcard-email"
                      type="email"
                      value={formData.vcard.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      placeholder="jean.dupont@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="vcard-organization">Organisation :</label>
                    <input
                      id="vcard-organization"
                      type="text"
                      value={formData.vcard.organization}
                      onChange={(e) => handleFormChange('organization', e.target.value)}
                      placeholder="Mon Entreprise"
                    />
                  </div>
                </>
              )}
            </div>
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

              <div className="form-group">
                <label>Forme des points :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsType === 'square' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsType', 'square')}
                  >
                    Carrés
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsType === 'dots' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsType', 'dots')}
                  >
                    Ronds
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsType === 'rounded' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsType', 'rounded')}
                  >
                    Arrondis
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsType === 'extra-rounded' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsType', 'extra-rounded')}
                  >
                    Très arrondis
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsType === 'classy' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsType', 'classy')}
                  >
                    Élégants
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsType === 'classy-rounded' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsType', 'classy-rounded')}
                  >
                    Élégants arrondis
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Coins carrés :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.cornersSquareType === 'square' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('cornersSquareType', 'square')}
                  >
                    Carrés
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.cornersSquareType === 'dot' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('cornersSquareType', 'dot')}
                  >
                    Ronds
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.cornersSquareType === 'extra-rounded' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('cornersSquareType', 'extra-rounded')}
                  >
                    Arrondis
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Points des coins :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.cornersDotType === 'square' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('cornersDotType', 'square')}
                  >
                    Carrés
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.cornersDotType === 'dot' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('cornersDotType', 'dot')}
                  >
                    Ronds
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Cadre :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.frame === 'none' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('frame', 'none')}
                  >
                    Aucun
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.frame === 'scan-me' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('frame', 'scan-me')}
                  >
                    SCAN ME
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.frame === 'border' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('frame', 'border')}
                  >
                    Bordure
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.frame === 'rounded' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('frame', 'rounded')}
                  >
                    Arrondi
                  </button>
                </div>
              </div>

              {options.frame !== 'none' && (
                <div className="form-group">
                  <label htmlFor="frame-color">Couleur du cadre :</label>
                  <input
                    id="frame-color"
                    type="color"
                    value={options.frameColor}
                    onChange={(e) => handleOptionChange('frameColor', e.target.value)}
                  />
                </div>
              )}

              {options.frame === 'scan-me' && (
                <div className="form-group">
                  <label htmlFor="frame-text">Texte du cadre :</label>
                  <input
                    id="frame-text"
                    type="text"
                    value={options.frameText}
                    onChange={(e) => handleOptionChange('frameText', e.target.value)}
                    placeholder="SCAN ME"
                  />
                </div>
              )}

              <div className="form-group">
                <label>Type de dégradé :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.gradientType === 'none' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('gradientType', 'none')}
                  >
                    Couleur unie
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.gradientType === 'linear' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('gradientType', 'linear')}
                  >
                    Dégradé linéaire
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.gradientType === 'radial' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('gradientType', 'radial')}
                  >
                    Dégradé radial
                  </button>
                </div>
              </div>

              {options.gradientType !== 'none' && (
                <>
                  <div className="form-group">
                    <label htmlFor="gradient-color1">Couleur 1 :</label>
                    <input
                      id="gradient-color1"
                      type="color"
                      value={options.gradientColor1}
                      onChange={(e) => handleOptionChange('gradientColor1', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gradient-color2">Couleur 2 :</label>
                    <input
                      id="gradient-color2"
                      type="color"
                      value={options.gradientColor2}
                      onChange={(e) => handleOptionChange('gradientColor2', e.target.value)}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="qr-display">
          {generatedValue ? (
            <div className="qr-result">
              <div className="qr-content-wrapper">
                <p>QR Code pour : <strong>{generatedValue}</strong></p>
                <div className={`qr-code-wrapper ${options.frame !== 'none' ? `frame-${options.frame}` : ''}`}>
                  <div className="qr-code-container" ref={qrRef}>
                    {/* Le QR code sera généré ici par qr-code-styling */}
                  </div>
                  {options.frame !== 'none' && (
                    <div className="qr-frame">
                      {options.frame === 'scan-me' && (
                        <div className="frame-text" style={{ color: options.frameColor }}>
                          {options.frameText}
                        </div>
                      )}
                      {options.frame === 'border' && (
                        <div className="frame-border" style={{ borderColor: options.frameColor }}></div>
                      )}
                      {options.frame === 'rounded' && (
                        <div className="frame-rounded" style={{ backgroundColor: options.frameColor }}></div>
                      )}
                    </div>
                  )}
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
          disabled={!generateQRContent().trim()}
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
