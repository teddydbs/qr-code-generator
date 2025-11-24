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
    size: 300,
    margin: 0,
    fgColor: '#000000',
    bgColor: '#ffffff',
    dotsType: 'square',
    cornersSquareType: 'square',
    cornersDotType: 'square',
    
    // Options de dégradé pour les points
    dotsGradientType: 'none',
    dotsGradientColor1: '#000000',
    dotsGradientColor2: '#007aff',
    
    // Options de couleur pour les coins
    cornersSquareColor: '#000000',
    cornersDotColor: '#000000',
    
    // Options de fond avancées
    backgroundGradientType: 'none',
    backgroundGradientColor1: '#ffffff',
    backgroundGradientColor2: '#f0f0f0',
    
    // Options de cadre avec le plugin
    borderType: 'none',
    borderColor: '#000000',
    borderWidth: 10,
    borderText: 'SCAN ME',
    
    // Options QR techniques
    errorCorrectionLevel: 'M'
  })
  const qrRef = useRef(null)
  const qrCode = useRef(null)
  const qrDisplayRef = useRef(null)

  const generateQRContent = () => {
    switch (activeTab) {
      case 'url':
        return formData.url || ''
      case 'wifi':
        return `WIFI:T:${formData.wifi.security || 'WPA'};S:${formData.wifi.ssid || ''};P:${formData.wifi.password || ''};;`
      case 'email':
        return `mailto:${formData.email.email || ''}?subject=${encodeURIComponent(formData.email.subject || '')}&body=${encodeURIComponent(formData.email.body || '')}`
      case 'sms':
        return `sms:${formData.sms.phone || ''}?body=${encodeURIComponent(formData.sms.message || '')}`
      case 'tel':
        return `tel:${formData.tel.phone || ''}`
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${formData.vcard.firstName || ''} ${formData.vcard.lastName || ''}\nORG:${formData.vcard.organization || ''}\nTEL:${formData.vcard.phone || ''}\nEMAIL:${formData.vcard.email || ''}\nEND:VCARD`
      default:
        return formData.url || ''
    }
  }

  const handleGenerate = () => {
    const content = generateQRContent()
    if (content.trim()) {
      setGeneratedValue(content)
    }
  }

  const handleFormChange = (field, value) => {
    if (activeTab === 'url') {
      // Pour URL, on met à jour directement la string
      setFormData(prev => ({
        ...prev,
        url: value
      }))
    } else {
      // Pour les autres tabs, on met à jour l'objet
      setFormData(prev => ({
        ...prev,
        [activeTab]: {
          ...prev[activeTab],
          [field]: value
        }
      }))
    }
  }

  const handleOptionChange = (option, newValue) => {
    setOptions(prev => ({
      ...prev,
      [option]: newValue
    }))
  }

  // Fonctions pour obtenir les configurations de couleurs
  const getDotsColorConfig = () => {
    if (options.dotsGradientType === 'none') {
      return { color: options.fgColor }
    } else {
      return {
        gradient: {
          type: options.dotsGradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: options.dotsGradientColor1 },
            { offset: 1, color: options.dotsGradientColor2 }
          ]
        }
      }
    }
  }

  const getBackgroundColorConfig = () => {
    if (options.backgroundGradientType === 'none') {
      return { color: options.bgColor }
    } else {
      return {
        gradient: {
          type: options.backgroundGradientType,
          rotation: 0,
          colorStops: [
            { offset: 0, color: options.backgroundGradientColor1 },
            { offset: 1, color: options.backgroundGradientColor2 }
          ]
        }
      }
    }
  }


  // Initialiser le QR code avec les nouvelles options
  useEffect(() => {
    const dotsColorConfig = getDotsColorConfig()
    const backgroundColorConfig = getBackgroundColorConfig()
    
    const qrConfig = {
      width: options.size,
      height: options.size,
      data: generatedValue,
      margin: options.margin,
      dotsOptions: {
        ...dotsColorConfig,
        type: options.dotsType
      },
      backgroundOptions: backgroundColorConfig,
      cornersSquareOptions: {
        type: options.cornersSquareType,
        color: options.cornersSquareColor
      },
      cornersDotOptions: {
        type: options.cornersDotType,
        color: options.cornersDotColor
      },
      qrOptions: {
        errorCorrectionLevel: options.errorCorrectionLevel
      }
    }

    qrCode.current = new QRCodeStyling(qrConfig)

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.current.append(qrRef.current)
    }
  }, [])

  // Mettre à jour le QR code
  useEffect(() => {
    if (qrCode.current) {
      const dotsColorConfig = getDotsColorConfig()
      const backgroundColorConfig = getBackgroundColorConfig()
      
      qrCode.current.update({
        width: options.size,
        height: options.size,
        data: generatedValue,
        margin: options.margin,
        dotsOptions: {
          ...dotsColorConfig,
          type: options.dotsType
        },
        backgroundOptions: backgroundColorConfig,
        cornersSquareOptions: {
          type: options.cornersSquareType,
          color: options.cornersSquareColor
        },
        cornersDotOptions: {
          type: options.cornersDotType,
          color: options.cornersDotColor
        },
        qrOptions: {
          errorCorrectionLevel: options.errorCorrectionLevel
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
                    onChange={(e) => handleFormChange('', e.target.value)}
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
                      rows="5"
                      style={{ resize: 'none' }}
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
                      rows="4"
                      style={{ resize: 'none' }}
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
                <label>Cadre CSS :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.borderType === 'none' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('borderType', 'none')}
                  >
                    Aucun
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.borderType === 'solid' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('borderType', 'solid')}
                  >
                    Bordure
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.borderType === 'shadow' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('borderType', 'shadow')}
                  >
                    Ombre
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.borderType === 'text' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('borderType', 'text')}
                  >
                    Avec texte
                  </button>
                </div>
              </div>

              {options.borderType !== 'none' && (
                <>
                  <div className="form-group">
                    <label htmlFor="border-color">Couleur du cadre :</label>
                    <input
                      id="border-color"
                      type="color"
                      value={options.borderColor}
                      onChange={(e) => handleOptionChange('borderColor', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="border-width">Largeur du cadre :</label>
                    <input
                      id="border-width"
                      type="range"
                      min="2"
                      max="12"
                      value={options.borderWidth}
                      onChange={(e) => handleOptionChange('borderWidth', parseInt(e.target.value))}
                    />
                    <span>{options.borderWidth}px</span>
                  </div>
                  {options.borderType === 'text' && (
                    <div className="form-group">
                      <label htmlFor="border-text">Texte du cadre :</label>
                      <input
                        id="border-text"
                        type="text"
                        value={options.borderText}
                        onChange={(e) => handleOptionChange('borderText', e.target.value)}
                        placeholder="SCAN ME"
                      />
                    </div>
                  )}
                </>
              )}

              <div className="form-group">
                <label>Dégradé des points :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsGradientType === 'none' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsGradientType', 'none')}
                  >
                    Couleur unie
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsGradientType === 'linear' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsGradientType', 'linear')}
                  >
                    Dégradé linéaire
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.dotsGradientType === 'radial' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('dotsGradientType', 'radial')}
                  >
                    Dégradé radial
                  </button>
                </div>
              </div>

              {options.dotsGradientType !== 'none' && (
                <>
                  <div className="form-group">
                    <label htmlFor="dots-gradient-color1">Couleur 1 :</label>
                    <input
                      id="dots-gradient-color1"
                      type="color"
                      value={options.dotsGradientColor1}
                      onChange={(e) => handleOptionChange('dotsGradientColor1', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dots-gradient-color2">Couleur 2 :</label>
                    <input
                      id="dots-gradient-color2"
                      type="color"
                      value={options.dotsGradientColor2}
                      onChange={(e) => handleOptionChange('dotsGradientColor2', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Nouvelles options pour les couleurs des coins */}
              <div className="form-group">
                <label htmlFor="corners-square-color">Couleur coins carrés :</label>
                <input
                  id="corners-square-color"
                  type="color"
                  value={options.cornersSquareColor}
                  onChange={(e) => handleOptionChange('cornersSquareColor', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="corners-dot-color">Couleur points des coins :</label>
                <input
                  id="corners-dot-color"
                  type="color"
                  value={options.cornersDotColor}
                  onChange={(e) => handleOptionChange('cornersDotColor', e.target.value)}
                />
              </div>

              {/* Options de fond avancées */}
              <div className="form-group">
                <label>Dégradé de fond :</label>
                <div className="button-group">
                  <button 
                    type="button"
                    className={`option-btn ${options.backgroundGradientType === 'none' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('backgroundGradientType', 'none')}
                  >
                    Couleur unie
                  </button>
                  <button 
                    type="button"
                    className={`option-btn ${options.backgroundGradientType === 'linear' ? 'active' : ''}`}
                    onClick={() => handleOptionChange('backgroundGradientType', 'linear')}
                  >
                    Dégradé
                  </button>
                </div>
              </div>

              {options.backgroundGradientType !== 'none' && (
                <>
                  <div className="form-group">
                    <label htmlFor="bg-gradient-color1">Couleur fond 1 :</label>
                    <input
                      id="bg-gradient-color1"
                      type="color"
                      value={options.backgroundGradientColor1}
                      onChange={(e) => handleOptionChange('backgroundGradientColor1', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="bg-gradient-color2">Couleur fond 2 :</label>
                    <input
                      id="bg-gradient-color2"
                      type="color"
                      value={options.backgroundGradientColor2}
                      onChange={(e) => handleOptionChange('backgroundGradientColor2', e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Option de marge */}
              <div className="form-group">
                <label htmlFor="margin">Marge :</label>
                <input
                  id="margin"
                  type="range"
                  min="0"
                  max="50"
                  value={options.margin}
                  onChange={(e) => handleOptionChange('margin', parseInt(e.target.value))}
                />
                <span>{options.margin}px</span>
              </div>

              {/* Options QR techniques */}
              <div className="form-group">
                <label htmlFor="error-correction">Correction d'erreur :</label>
                <select
                  id="error-correction"
                  value={options.errorCorrectionLevel}
                  onChange={(e) => handleOptionChange('errorCorrectionLevel', e.target.value)}
                >
                  <option value="L">Faible (L)</option>
                  <option value="M">Moyen (M)</option>
                  <option value="Q">Élevé (Q)</option>
                  <option value="H">Maximum (H)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <div className="qr-display qr-sticky" ref={qrDisplayRef}>
          {generatedValue ? (
            <div className="qr-result">
              <div className="qr-content-wrapper">
                <p>QR Code pour : <strong>{generatedValue}</strong></p>
                <div 
                  className={`qr-code-container ${options.borderType !== 'none' ? `border-${options.borderType}` : ''}`}
                  ref={qrRef}
                  data-border-text={options.borderText}
                  style={{ 
                    '--border-color': options.borderColor,
                    '--border-width': `${options.borderWidth}px`
                  }}
                  role="img"
                  aria-label={`QR Code pour ${generatedValue}`}
                >
                  {/* Le QR code sera généré ici par qr-code-styling */}
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
          disabled={!generateQRContent()?.trim()}
          className="generate-btn"
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
